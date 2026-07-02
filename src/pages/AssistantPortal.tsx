import React, { useState, useEffect, useRef } from 'react';
import { routeVanaQuestion, AGENT_CONFIGS, AIAgentRole } from '@/lib/vanaRouter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Send, 
  Bot, 
  Sparkles, 
  AlertTriangle,
  Hammer,
  Wrench,
  Map as MapIcon,
  ShoppingBag,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  sender_role: 'user' | 'assistant';
  content: string;
  agent_role?: AIAgentRole;
  created_at: string;
}

export default function AssistantPortal() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AIAgentRole>('vana');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender_role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);

    // Intent routing
    const vanaRes = routeVanaQuestion(userText);
    setCurrentAgent(vanaRes.agentRole);

    // Simulated network delay (replace with real LLM/Edge call when backends are up)
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender_role: 'assistant',
        content: vanaRes.answer,
        agent_role: vanaRes.agentRole,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 800);
  };

  const getAgentIcon = (role: AIAgentRole) => {
    switch (role) {
      case 'builder': return <Hammer size={16} />;
      case 'mechanic': return <Wrench size={16} />;
      case 'travel': return <MapIcon size={16} />;
      case 'marketplace': return <ShoppingBag size={16} />;
      case 'emergency': return <ShieldAlert size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e8dcc8] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1fr_350px] gap-8">
        
        {/* Chat Section */}
        <div className="flex flex-col h-[750px] bg-[#111111] border border-[#2e2e2e] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#2e2e2e] bg-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c9a96e] flex items-center justify-center text-[#0d0d0d]">
                {getAgentIcon(currentAgent)}
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-[#c9a96e]">
                  {AGENT_CONFIGS[currentAgent].name}
                </h2>
                <p className="text-[10px] text-[#9a8f7e] font-bold">ACTIVE PROTOCOL: {currentAgent.toUpperCase()}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-[#c9a96e]/30 text-[#c9a96e]">
              ENCRYPTED SESSION
            </Badge>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-20">
                  <Bot size={48} className="mx-auto text-[#2e2e2e] mb-4" />
                  <h3 className="text-lg font-bold">Vanciety Intelligence Core</h3>
                  <p className="text-[#9a8f7e] text-sm max-w-sm mx-auto mt-2">
                    Specialized agents for electrical, mechanical, build carpentry, and travel safety. 
                    Begin query transmission.
                  </p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${
                    msg.sender_role === 'user' 
                      ? 'bg-[#c9a96e] text-[#0d0d0d] font-bold rounded-tr-none' 
                      : 'bg-[#1a1a1a] border border-[#2e2e2e] text-[#e8dcc8] rounded-tl-none'
                  }`}>
                    {msg.sender_role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-[9px] font-black uppercase tracking-tighter opacity-60">
                        {getAgentIcon(msg.agent_role || 'vana')} {AGENT_CONFIGS[msg.agent_role || 'vana'].name}
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-[#1a1a1a] border-t border-[#2e2e2e]">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Transmission details (e.g. 'lithium wiring', 'gray water bypass', 'stealth parking')..."
                className="bg-[#0d0d0d] border-[#2e2e2e] text-[#e8dcc8] placeholder:text-[#444] text-xs h-11"
              />
              <Button type="submit" className="bg-[#c9a96e] hover:bg-[#d4b87a] text-[#0d0d0d] font-black h-11 w-11 p-0">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar / Context */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#2e2e2e] p-6 rounded-xl">
            <h3 className="text-[#c9a96e] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert size={14} /> Safety Protocols
            </h3>
            <div className="space-y-4 text-xs text-[#9a8f7e] leading-normal font-medium">
              <p>
                <span className="text-[#e8dcc8] font-bold">Verification:</span> AI recommendations are generated from community datasets but must be verified against manufacturer specs.
              </p>
              <p>
                <span className="text-[#e8dcc8] font-bold">Electrical:</span> Torque values, wire gauge calculations, and BMS settings are safety-critical.
              </p>
              <p>
                <span className="text-[#e05c5c] font-bold">Emergency:</span> If in immediate danger, use the EMERGENCY module for authoritative survival steps.
              </p>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#2e2e2e] p-6 rounded-xl">
            <h3 className="text-[#c9a96e] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} /> Agent Routing
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(AGENT_CONFIGS).map((role) => (
                <div key={role} className={`p-2 border rounded-md text-center transition-all ${
                  currentAgent === role ? 'bg-[#c9a96e]/10 border-[#c9a96e] text-[#c9a96e]' : 'bg-[#1a1a1a] border-[#2e2e2e] text-[#555]'
                }`}>
                  <div className="flex flex-col items-center gap-1">
                    {getAgentIcon(role as AIAgentRole)}
                    <span className="text-[9px] font-bold uppercase">{role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
