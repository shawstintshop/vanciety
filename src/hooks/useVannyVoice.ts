import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VoiceState = "idle" | "connecting" | "listening" | "speaking" | "error";

export interface VoiceMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface UseVannyVoiceReturn {
  state: VoiceState;
  messages: VoiceMessage[];
  transcript: string;
  error: string | null;
  isSupported: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearMessages: () => void;
}

export function useVannyVoice(): UseVannyVoiceReturn {
  const [state, setState] = useState<VoiceState>("idle");
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!window.RTCPeerConnection &&
    !!navigator.mediaDevices?.getUserMedia;

  const addMessage = useCallback((role: "user" | "assistant", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, text, timestamp: new Date() },
    ]);
  }, []);

  const disconnect = useCallback(() => {
    dcRef.current?.close();
    pcRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
    }
    pcRef.current = null;
    dcRef.current = null;
    streamRef.current = null;
    setTranscript("");
    setState("idle");
  }, []);

  const connect = useCallback(async () => {
    if (!isSupported) {
      setError("Voice chat is not supported in this browser.");
      setState("error");
      return;
    }

    try {
      setState("connecting");
      setError(null);

      // 1. Get ephemeral token from Supabase Edge Function
      const { data, error: fnError } = await supabase.functions.invoke(
        "realtime-session"
      );
      if (fnError || !data?.client_secret?.value) {
        throw new Error(fnError?.message ?? "Failed to get session token");
      }
      const ephemeralKey: string = data.client_secret.value;

      // 2. Set up WebRTC peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Audio playback element for AI voice
      if (!audioElRef.current) {
        audioElRef.current = document.createElement("audio");
        audioElRef.current.autoplay = true;
      }
      pc.ontrack = (e) => {
        if (audioElRef.current) {
          audioElRef.current.srcObject = e.streams[0];
        }
        setState("listening");
      };

      // 3. Capture microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 4. Data channel for events (transcripts, function calls)
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onopen = () => setState("listening");
      dc.onclose = () => setState("idle");

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);

          // User transcript
          if (
            event.type === "conversation.item.input_audio_transcription.completed"
          ) {
            const text = event.transcript?.trim();
            if (text) {
              setTranscript(text);
              addMessage("user", text);
            }
          }

          // Assistant response text delta
          if (event.type === "response.text.delta") {
            setTranscript((prev) => prev + (event.delta ?? ""));
          }

          // Assistant response complete
          if (event.type === "response.text.done") {
            const text = event.text?.trim();
            if (text) {
              addMessage("assistant", text);
              setTranscript("");
            }
            setState("listening");
          }

          // Audio playing
          if (event.type === "response.audio.delta") {
            setState("speaking");
          }

          // Error from OpenAI
          if (event.type === "error") {
            setError(event.error?.message ?? "Realtime error");
            setState("error");
          }
        } catch {
          // ignore parse errors on non-JSON frames
        }
      };

      // 5. SDP handshake with OpenAI Realtime
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpResponse.ok) {
        throw new Error(`SDP exchange failed: ${sdpResponse.status}`);
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setState("listening");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState("error");
      disconnect();
    }
  }, [isSupported, addMessage, disconnect]);

  // Clean up on unmount
  useEffect(() => () => disconnect(), [disconnect]);

  return {
    state,
    messages,
    transcript,
    error,
    isSupported,
    connect,
    disconnect,
    clearMessages: () => setMessages([]),
  };
}
