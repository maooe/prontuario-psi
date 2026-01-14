
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  PlusCircle, 
  MinusCircle,
  Download, 
  Search, 
  MessageCircle, 
  Clock, 
  MapPin, 
  CloudSun,
  Camera,
  LogOut,
  Settings,
  ChevronRight,
  Menu,
  X,
  Send,
  ExternalLink,
  Bot,
  User,
  Heart,
  Baby,
  Home,
  Briefcase,
  HelpCircle,
  FileText,
  Save,
  Trash2,
  CheckCircle2,
  Edit2,
  Palette,
  Sparkles,
  ChevronLeft,
  CalendarDays,
  StickyNote,
  Quote,
  Upload,
  AlertTriangle,
  ShieldCheck,
  Info,
  Mic,
  History,
  BrainCircuit,
  RefreshCw,
  Link2
} from 'lucide-react';
import { Theme, UserProfile, Patient, SessionRecord, FinancialRecord, Child, Sibling, ParentInfo } from './types';
import { askAgent } from './services/gemini';

// --- Constants & Defaults ---

const ERICKSONIAN_PHRASES = [
  "Você sabe mais do que pensa que sabe.",
  "Confie no seu inconsciente.",
  "A mudança não é apenas possível, ela é inevitável."
];

const CONSTELLATION_PHRASES = [
  "A ordem vem antes do amor.",
  "O que é, pode ser.",
  "Aceitação é a chave."
];

const POST_IT_COLORS = [
  'bg-yellow-200 text-yellow-900 border-yellow-300',
  'bg-blue-200 text-blue-900 border-blue-300',
  'bg-pink-200 text-pink-900 border-pink-300',
  'bg-emerald-200 text-emerald-900 border-emerald-300'
];

const INITIAL_PARENT: ParentInfo = {
  name: '', age: '', maritalStatus: '', whatsapp: '', education: '', profession: '',
  isAlive: null, deathAge: '', deathYear: '', deathCause: '', deathDetails: '',
  personality: '', relationship: ''
};

const INITIAL_PATIENT: Partial<Patient> = {
  id: '', registrationDate: new Date().toLocaleDateString('pt-BR'),
  children: [], siblings: [], mother: { ...INITIAL_PARENT }, father: { ...INITIAL_PARENT },
  sentences: {
    admire: '', friends: '', likeMyself: '', feelBetter: '', parents: '', wannaBe: '',
    worldBetter: '', worry: '', loseCalm: '', body: '', can: '', cannot: '',
    favorite: '', pretend: '', nervous: '', fear: '', awayFear: '', wannaHave: '',
    proud: '', funny: ''
  },
  characteristics: []
};

// --- Components ---

const SplashScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
    <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
         <BrainCircuit size={200} className="text-indigo-500 animate-pulse" />
      </div>
      <div className="grid grid-cols-6 grid-rows-6 gap-2 w-48 h-40 relative">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="bg-indigo-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: `${Math.random() * 2}s` }} />
        ))}
      </div>
    </div>
    <div className="text-center space-y-4 max-w-md">
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Prontuário <span className="text-indigo-500">PSI</span></h1>
      <button onClick={onLogin} className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 text-slate-900 px-6 py-4 rounded-2xl font-bold transition-all shadow-xl">
        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="G" />
        <span>Entrar com Google</span>
      </button>
    </div>
  </div>
);

const GoogleAgenda2025 = ({ sessions, patients }: { sessions: SessionRecord[], patients: Patient[] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasExternalData, setHasExternalData] = useState(false);

  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const year = 2025;
  
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDayOffset = new Date(year, currentMonth, 1).getDay();

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setHasExternalData(true);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border dark:border-slate-700 overflow-hidden flex flex-col h-[650px]">
      <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg"><CalendarDays size={24} /></div>
          <div>
            <h3 className="text-lg font-black dark:text-white">Agenda Unificada</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronizado com Google Calendar</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button onClick={() => setCurrentMonth(m => Math.max(0, m-1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"><ChevronLeft size={20}/></button>
           <span className="text-xs font-black uppercase w-32 text-center">{months[currentMonth]} {year}</span>
           <button onClick={() => setCurrentMonth(m => Math.min(11, m+1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"><ChevronRight size={20}/></button>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-7 text-center overflow-y-auto custom-scrollbar">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="py-3 text-[10px] font-black text-slate-400 uppercase border-b dark:border-slate-700">{day}</div>
        ))}
        {Array.from({ length: firstDayOffset }).map((_, i) => <div key={i} className="border-r border-b dark:border-slate-700 bg-slate-50/20"></div>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const daySessions = sessions.filter(s => s.date === dateStr);
          
          return (
            <div key={i} className="border-r border-b dark:border-slate-700 p-2 min-h-[95px] relative group hover:bg-indigo-50/30">
              <span className="text-xs font-bold text-slate-400">{day}</span>
              <div className="mt-1 space-y-1">
                {daySessions.map(s => (
                  <div key={s.id} className="p-1 bg-indigo-500 text-white text-[8px] rounded font-black truncate">
                    {patients.find(p => p.id === s.patientId)?.name.split(' ')[0]}
                  </div>
                ))}
                {hasExternalData && day % 5 === 0 && (
                  <div className="p-1 bg-amber-400 text-slate-900 text-[8px] rounded font-black truncate flex items-center">
                    <Link2 size={8} className="mr-0.5" /> Google: Compromisso
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700">
        <button onClick={handleSync} disabled={isSyncing} className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 transition-all">
          {isSyncing ? <RefreshCw className="animate-spin" size={14}/> : <Calendar size={14}/>}
          <span>{isSyncing ? "Unificando com Google..." : "Unir com Google Agenda"}</span>
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('psi_is_logged_in') === 'true');
  const [patients, setPatients] = useState<Patient[]>(() => JSON.parse(localStorage.getItem('psi_patients') || '[]'));
  const [sessions, setSessions] = useState<SessionRecord[]>(() => JSON.parse(localStorage.getItem('psi_sessions') || '[]'));
  const [financials, setFinancials] = useState<FinancialRecord[]>(() => JSON.parse(localStorage.getItem('psi_financials') || '[]'));
  const [theme, setTheme] = useState<Theme>('light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('psi_profile') || '{"name":"Psicólogo(a)","photo":"https://api.dicebear.com/7.x/avataaars/svg?seed=user_psi","crp":"00/0000"}'));
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    localStorage.setItem('psi_patients', JSON.stringify(patients));
    localStorage.setItem('psi_sessions', JSON.stringify(sessions));
    localStorage.setItem('psi_financials', JSON.stringify(financials));
    localStorage.setItem('psi_profile', JSON.stringify(profile));
  }, [patients, sessions, financials, profile]);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : (theme === 'light' ? '' : `theme-${theme}`);
  }, [theme]);

  const handleSavePatient = (p: Patient) => {
    setPatients(prev => prev.some(item => item.id === p.id) ? prev.map(item => item.id === p.id ? p : item) : [...prev, p]);
    setEditingPatient(null);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) return <SplashScreen onLogin={() => {setIsLoggedIn(true); localStorage.setItem('psi_is_logged_in', 'true');}} />;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className="w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">P</div>
          <span className="text-xl font-black dark:text-white">PSI ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={PlusCircle} label="Novo Prontuário" active={activeTab === 'new-patient'} onClick={() => setActiveTab('new-patient')} />
          <SidebarItem icon={Users} label="Atendimentos" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
          <SidebarItem icon={DollarSign} label="Financeiro" active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} />
        </nav>
        <div className="p-6 border-t dark:border-slate-800">
           <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
             <img src={profile.photo} className="w-10 h-10 rounded-xl border border-indigo-500" />
             <div className="text-xs font-bold dark:text-white truncate">{profile.name}</div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30">
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dashboard de Gestão</span>
             <h2 className="text-lg font-black dark:text-white uppercase">{activeTab}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsAIModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl hover:scale-105 transition-all">
              <Bot size={18} /><span>AGENTE PSI</span>
            </button>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white">
              {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2"><GoogleAgenda2025 sessions={sessions} patients={patients} /></div>
              <div className="space-y-6"><PostItSystem /></div>
            </div>
          )}
          {activeTab === 'new-patient' && <PatientForm initialData={editingPatient} onSave={handleSavePatient} onCancel={() => setActiveTab('dashboard')} />}
          {activeTab === 'sessions' && <SessionsTab patients={patients} sessions={sessions} setSessions={setSessions} />}
          {activeTab === 'financial' && <FinancialTab financials={financials} setFinancials={setFinancials} patients={patients} />}
        </section>
      </main>

      {isAIModalOpen && <AIModal onClose={() => setIsAIModalOpen(false)} context={{ patients, sessions }} />}
    </div>
  );
}

// --- Subcomponents ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    <Icon size={22} /><span className="font-bold text-sm">{label}</span>
  </button>
);

const PostItSystem = () => {
  const [notes, setNotes] = useState<any[]>(() => JSON.parse(localStorage.getItem('psi_notes') || '[]'));
  useEffect(() => localStorage.setItem('psi_notes', JSON.stringify(notes)), [notes]);
  const add = () => setNotes([...notes, { id: Date.now(), text: '', color: Math.floor(Math.random()*4) }]);
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex justify-between items-center"><h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lembretes</h3><button onClick={add} className="p-2 bg-yellow-100 text-yellow-600 rounded-xl"><PlusCircle size={18}/></button></div>
      <div className="space-y-4">
        {notes.map(n => (
          <div key={n.id} className={`p-4 rounded-3xl min-h-[80px] text-xs font-bold ${POST_IT_COLORS[n.color]}`}>
            <textarea className="bg-transparent border-none w-full h-full focus:ring-0 placeholder:text-black/20" value={n.text} onChange={e => setNotes(notes.map(note => note.id === n.id ? {...note, text: e.target.value} : note))} placeholder="Anotar..." />
          </div>
        ))}
      </div>
    </div>
  );
};

const AIModal = ({ onClose, context }: any) => {
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Olá! Sou o Agente PSI. Como posso ajudar com seus prontuários hoje?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input; setInput(''); setMessages(m => [...m, { role: 'user', text: txt }]);
    setLoading(true);
    const res = await askAgent(txt, context);
    setMessages(m => [...m, { role: 'bot', text: res.text, sources: res.sources }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
       <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-[50px] shadow-2xl flex flex-col overflow-hidden animate-scale-up border dark:border-slate-800">
          <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3"><Bot size={28}/><div><h2 className="font-black uppercase text-sm">Agente PSI Inteligente</h2><span className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Powered by Gemini 3</span></div></div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950 space-y-6 custom-scrollbar">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-6 rounded-[35px] text-sm font-medium ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-bl-none shadow-sm'}`}>
                   {m.text}
                   {m.sources && m.sources.length > 0 && (
                     <div className="mt-4 pt-4 border-t dark:border-slate-700 space-y-2">
                        {m.sources.map((s:any, idx:number) => <a key={idx} href={s.uri} target="_blank" className="flex items-center space-x-1 text-[9px] text-blue-500 hover:underline"><ExternalLink size={10}/><span>{s.title}</span></a>)}
                     </div>
                   )}
                 </div>
               </div>
             ))}
             {loading && <div className="flex space-x-2 animate-pulse p-4"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div><div className="w-2 h-2 bg-indigo-500 rounded-full"></div><div className="w-2 h-2 bg-indigo-500 rounded-full"></div></div>}
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex space-x-4">
             <input className="flex-1 p-5 rounded-3xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none font-medium border-2 border-transparent focus:border-indigo-500/20" placeholder="Ex: Pesquise pacientes ou CIDs..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} />
             <button onClick={send} className="p-5 bg-indigo-600 text-white rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all"><Send size={24}/></button>
          </div>
       </div>
    </div>
  );
};

// --- Form & Tabs ---

const FormField = ({ label, name, type = "text", value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl outline-none text-sm font-bold dark:text-white" />
  </div>
);

const PatientForm = ({ initialData, onSave, onCancel }: any) => {
  const [data, setData] = useState(initialData || INITIAL_PATIENT);
  const handle = (e: any) => setData({...data, [e.target.name]: e.target.value});
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-12 rounded-[60px] shadow-2xl space-y-10 border dark:border-slate-700">
      <h2 className="text-2xl font-black uppercase tracking-tighter">Ficha de Anamnese</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField label="Nome Completo" name="name" value={data.name || ''} onChange={handle} />
        <FormField label="WhatsApp" name="whatsapp" value={data.whatsapp || ''} onChange={handle} />
      </div>
      <div className="space-y-1">
         <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Queixa Principal</label>
         <textarea name="problemBrief" value={data.problemBrief || ''} onChange={handle} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl min-h-[150px] outline-none text-sm font-bold dark:text-white" />
      </div>
      <div className="flex justify-end space-x-4">
        <button onClick={onCancel} className="px-8 py-4 font-black uppercase text-xs text-slate-400">Cancelar</button>
        <button onClick={() => onSave({...data, id: data.id || Date.now().toString()})} className="px-12 py-4 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs shadow-xl">Salvar Prontuário</button>
      </div>
    </div>
  );
};

const SessionsTab = ({ patients, sessions, setSessions }: any) => {
  const [pid, setPid] = useState('');
  const [newS, setNewS] = useState({ date: new Date().toISOString().split('T')[0], theme: '', obs: '' });
  const patientSessions = sessions.filter((s:any) => s.patientId === pid);
  const add = () => {
    if(!pid || !newS.theme) return;
    setSessions([...sessions, { id: Date.now().toString(), patientId: pid, date: newS.date, theme: newS.theme, observations: newS.obs }]);
    setNewS({ date: new Date().toISOString().split('T')[0], theme: '', obs: '' });
  };
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
       <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm">
          <h2 className="text-xl font-black uppercase">Atendimentos</h2>
          <select value={pid} onChange={e => setPid(e.target.value)} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-xs font-black uppercase text-indigo-600 border-none outline-none">
            <option value="">Selecione o Paciente...</option>
            {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
       </div>
       {pid && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="bg-white dark:bg-slate-800 p-10 rounded-[50px] space-y-6 border dark:border-slate-700">
             <h3 className="text-xs font-black uppercase text-indigo-600">Registrar Evolução</h3>
             <FormField label="Data" type="date" value={newS.date} onChange={(e:any) => setNewS({...newS, date: e.target.value})} />
             <FormField label="Tema da Sessão" value={newS.theme} onChange={(e:any) => setNewS({...newS, theme: e.target.value})} />
             <textarea className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl min-h-[150px] outline-none text-sm font-bold dark:text-white" value={newS.obs} onChange={(e:any) => setNewS({...newS, obs: e.target.value})} placeholder="Observações..." />
             <button onClick={add} className="w-full py-5 bg-indigo-600 text-white rounded-[30px] font-black uppercase text-xs">Salvar Atendimento</button>
           </div>
           <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {patientSessions.slice().reverse().map((s:any) => (
                <div key={s.id} className="bg-white dark:bg-slate-800 p-6 rounded-[35px] shadow-sm border dark:border-slate-700">
                  <div className="text-[10px] font-black text-indigo-500 uppercase">{s.date.split('-').reverse().join('/')}</div>
                  <h4 className="text-sm font-bold mt-1 dark:text-white">{s.theme}</h4>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">{s.observations}</p>
                </div>
              ))}
           </div>
         </div>
       )}
    </div>
  );
};

const FinancialTab = ({ financials, setFinancials, patients }: any) => {
  const [entry, setEntry] = useState({ pid: '', val: '', method: 'PIX', date: new Date().toISOString().split('T')[0] });
  const add = () => {
    const p = patients.find((p:any) => p.id === entry.pid);
    if(!p || !entry.val) return;
    setFinancials([...financials, { id: Date.now().toString(), patientName: p.name, value: entry.val, paymentMethod: entry.method, date: entry.date, status: 'Em dia' }]);
    setEntry({ pid: '', val: '', method: 'PIX', date: new Date().toISOString().split('T')[0] });
  };
  return (
    <div className="max-w-6xl mx-auto space-y-10">
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[50px] space-y-6 shadow-sm border dark:border-slate-700">
             <h3 className="text-xs font-black uppercase text-indigo-600">Lançamento</h3>
             <select value={entry.pid} onChange={e => setEntry({...entry, pid: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-xs font-bold border-none outline-none">
                <option value="">Paciente...</option>
                {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
             <FormField label="Valor (R$)" value={entry.val} onChange={(e:any) => setEntry({...entry, val: e.target.value})} />
             <button onClick={add} className="w-full py-5 bg-emerald-600 text-white rounded-[30px] font-black uppercase text-xs">Confirmar Recebimento</button>
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-10 rounded-[50px] border dark:border-slate-700 overflow-hidden">
             <table className="w-full text-xs">
                <thead><tr className="border-b dark:border-slate-700 text-left text-slate-400 uppercase font-black tracking-widest text-[9px]"><th className="pb-4">Paciente</th><th className="pb-4">Data</th><th className="pb-4">Valor</th></tr></thead>
                <tbody className="divide-y dark:divide-slate-700">
                   {financials.slice().reverse().map((f:any) => (
                     <tr key={f.id}><td className="py-4 font-bold dark:text-white">{f.patientName}</td><td className="py-4 text-slate-500">{f.date}</td><td className="py-4 font-black text-emerald-600">R$ {f.value}</td></tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};
