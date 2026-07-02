import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { 
  History, 
  MessageSquare, 
  AlertTriangle, 
  Settings, 
  Hammer, 
  ShieldAlert, 
  HelpCircle,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { AGENT_CONFIGS } from "@/lib/vanaRouter";

interface AITask {
  id: string;
  agent_role: string;
  task_type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

interface IssueReport {
  id: string;
  issue_type: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  created_at: string;
  conversation_id?: string;
}

export default function AIAdmin() {
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'open'>('all');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: taskData } = await supabase
        .from('ai_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: reportData } = await supabase
        .from('ai_issue_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (taskData) setTasks(taskData);
      if (reportData) setReports(reportData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load AI operational data");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: AITask['status']) => {
    try {
      const { error } = await supabase
        .from('ai_tasks')
        .update({ status } as any)
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Task marked as ${status}`);
      fetchData();
    } catch (e) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e8dcc8] pt-20 pb-10">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Intro */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#c9a96e] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            <Settings size={14} /> System / AI Operations
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">AI Intelligence Hub</h1>
          <p className="text-[#9a8f7e] text-sm max-w-2xl">
            Monitoring specialist agent performance, unresolved user queries, and system-generated maintenance tasks.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#2e2e2e] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9a8f7e] text-[10px] uppercase font-bold tracking-widest">Active Tasks</span>
              <Hammer className="text-[#c9a96e]" size={18} />
            </div>
            <div className="text-3xl font-mono text-[#c9a96e] font-bold">
              {tasks.filter(t => t.status !== 'completed').length}
            </div>
          </div>
          <div className="bg-[#111111] border border-[#2e2e2e] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9a8f7e] text-[10px] uppercase font-bold tracking-widest">Open Reports</span>
              <AlertTriangle className="text-[#e05c5c]" size={18} />
            </div>
            <div className="text-3xl font-mono text-[#e05c5c] font-bold">
              {reports.filter(r => r.status === 'open').length}
            </div>
          </div>
          <div className="bg-[#111111] border border-[#2e2e2e] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9a8f7e] text-[10px] uppercase font-bold tracking-widest">Global Agent Health</span>
              <CheckCircle2 className="text-[#5cb85c]" size={18} />
            </div>
            <div className="text-sm font-bold text-[#5cb85c]">Operational (100%)</div>
          </div>
          <div className="bg-[#111111] border border-[#2e2e2e] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9a8f7e] text-[10px] uppercase font-bold tracking-widest">Latest Diagnostic</span>
              <Clock className="text-[#9a8f7e]" size={18} />
            </div>
            <div className="text-xs font-mono text-[#e8dcc8]">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111111] border border-[#2e2e2e] p-4 rounded-lg mb-8">
          <div className="flex gap-2">
             {['all', 'pending', 'open'].map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                   filter === f ? 'bg-[#c9a96e] text-[#0d0d0d]' : 'bg-[#1a1a1a] text-[#9a8f7e] hover:text-[#e8dcc8]'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2e2e2e] px-3 py-1.5 rounded w-full sm:w-auto">
            <Search size={14} className="text-[#9a8f7e]" />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              className="bg-transparent border-none text-[12px] focus:outline-none w-full text-[#e8dcc8]"
            />
          </div>
        </div>

        {/* Content Tabs / Lists */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Agent Tasks Column */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
              <FileText size={16} className="text-[#c9a96e]" /> Specialist Agent Actions
            </h2>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-[#9a8f7e] border border-dashed border-[#2e2e2e] rounded-lg">
                  No automated tasks detected.
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="bg-[#111111] border border-[#2e2e2e] p-4 rounded-lg group hover:border-[#c9a96e]/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] font-black uppercase bg-[#1a1a1a] px-2 py-0.5 rounded text-[#c9a96e] border border-[#c9a96e]/20 mr-2">
                          {task.agent_role}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          task.priority === 'critical' ? 'bg-[#e05c5c] text-white' : 
                          task.priority === 'high' ? 'bg-[#c9a96e] text-[#0d0d0d]' : 'bg-[#2e2e2e] text-[#9a8f7e]'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => updateTaskStatus(task.id, 'completed')} className="text-[#5cb85c] hover:bg-[#5cb85c]/10 p-1 rounded transition-colors"><CheckCircle2 size={14}/></button>
                        <button onClick={() => updateTaskStatus(task.id, 'cancelled')} className="text-[#e05c5c] hover:bg-[#e05c5c]/10 p-1 rounded transition-colors"><XCircle size={14}/></button>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#e8dcc8] mb-1">{task.task_type}</h3>
                    <p className="text-[#9a8f7e] text-xs leading-relaxed mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#9a8f7e] font-mono border-t border-[#2e2e2e] pt-3">
                      <span>{new Date(task.created_at).toLocaleDateString()}</span>
                      <span className="uppercase">{task.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Issue Reports Column */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#e05c5c]" /> Intelligence Reports
            </h2>
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-[#9a8f7e] border border-dashed border-[#2e2e2e] rounded-lg">
                  System health report: 0 anomalies.
                </div>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="bg-[#111111] border border-[#2e2e2e] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#e05c5c] uppercase tracking-tighter">
                        FAULT: {report.issue_type}
                      </span>
                      <div className="text-[9px] text-[#9a8f7e] uppercase font-bold bg-[#1a1a1a] px-2 py-0.5 rounded">
                        {report.status}
                      </div>
                    </div>
                    <p className="text-[#e8dcc8] text-xs mb-3 font-medium">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#9a8f7e] font-mono border-t border-[#2e2e2e] pt-3">
                      <div className="flex gap-4">
                        <span>{new Date(report.created_at).toLocaleString()}</span>
                        {report.conversation_id && (
                          <a href="#" className="flex items-center gap-1 text-[#c9a96e] hover:underline">
                            Trace <ExternalLink size={8} />
                          </a>
                        )}
                      </div>
                      <button className="text-[#c9a96e] hover:text-[#e8dcc8] transition-colors">Action</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
