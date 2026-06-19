import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';

interface VoiceVannyProps {
  compact?: boolean;
}

const VoiceVanny: React.FC<VoiceVannyProps> = ({ compact = false }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const recognitionRef = useRef<any>(null);

  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const toggleListen = () => {
    if (!supported) {
      setTranscript('Voice input is not supported in this browser. Try Chrome.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      setStatus('idle');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setStatus('listening');
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const t = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
    };

    recognition.onend = () => {
      setListening(false);
      setStatus('idle');
    };

    recognition.onerror = () => {
      setListening(false);
      setStatus('idle');
      setTranscript('Could not hear you. Try again.');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className={`rounded-xl border border-border/60 bg-card/60 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center gap-3 mb-3">
        <Volume2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Voice Assistant</span>
        {!supported && <span className="text-xs text-muted-foreground">(Chrome recommended)</span>}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={toggleListen}
          variant={listening ? 'destructive' : 'outline'}
          size={compact ? 'sm' : 'default'}
          className={`rounded-full ${compact ? 'w-12 h-12' : 'w-16 h-16'} p-0 transition-all ${listening ? 'animate-pulse shadow-lg shadow-red-500/30' : 'hover:border-primary/60'}`}
        >
          {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {status === 'listening' ? 'Listening...' : status === 'processing' ? 'Processing...' : 'Tap to speak'}
        </p>

        {transcript && (
          <div className="w-full rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
            {transcript}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceVanny;
