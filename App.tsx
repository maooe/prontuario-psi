
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
  BrainCircuit
} from 'lucide-react';
import { Theme, UserProfile, Patient, SessionRecord, FinancialRecord, Child, Sibling, ParentInfo } from './types';
import { askAgent } from './services/gemini';

// --- Constants & Phrases ---

const ERICKSONIAN_PHRASES = [
  "Você sabe mais do que pensa que sabe.",
  "Cada pessoa é um indivíduo único. Portanto, a psicoterapia deve ser formulada para atender à singularidade das necessidades do indivíduo.",
  "O transe é aquela condição em que a aprendizagem e a abertura para a mudança têm maior probabilidade de ocorrer.",
  "Confie no seu inconsciente.",
  "A mudança não é apenas possível, ela é inevitável.",
  "Não tente entender. Apenas sinta o que acontece.",
  "Permita-se ser quem você é."
];

const CONSTELLATION_PHRASES = [
  "A ordem vem antes do amor.",
  "O que é, pode ser.",
  "Aquele que exclui, torna-se o que excluiu.",
  "A aceitação é a chave para a transformação.",
  "Honrar os antepassados é dar lugar a eles no coração.",
  "Diga sim a tudo como foi.",
  "Onde o amor flui, a vida prospera."
];

const POST_IT_COLORS = [
  'bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 border-yellow-300',
  'bg-blue-200 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border-blue-300',
  'bg-pink-200 dark:bg-pink-900/40 text-pink-900 dark:text-pink-100 border-pink-300',
  'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 border-emerald-300',
  'bg-purple-200 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100 border-purple-300'
];

const CHARACTERISTICS_OPTIONS = [
  "Carinhosa", "Impaciente", "Atenta", "Insegura", 
  "Dorminhoca", "Amiga", "Ansiosa", "Observadora", 
  "Autoritária", "Bem Humorada", "Tímida", "Agitada", 
  "Dependente", "Medrosa", "Falante", "Teimosa", 
  "Alegre", "Autônoma", "Impulsiva", "Sensível"
];

const INITIAL_PARENT: ParentInfo = {
  name: '', age: '', maritalStatus: '', whatsapp: '', education: '', profession: '',
  isAlive: null, deathAge: '', deathYear: '', deathCause: '', deathDetails: '',
  personality: '', relationship: ''
};

const INITIAL_PATIENT: Partial<Patient> = {
  id: '', registrationDate: new Date().toLocaleDateString('pt-BR'),
  children: [], siblings: [], mother: { ...INITIAL_PARENT }, father: { ...INITIAL_PARENT },
  sessionFrequency: 'semanais',
  sentences: {
    admire: '', friends: '', likeMyself: '', feelBetter: '', parents: '', wannaBe: '',
    worldBetter: '', worry: '', loseCalm: '', body: '', can: '', cannot: '',
    favorite: '', pretend: '', nervous: '', fear: '', awayFear: '', wannaHave: '',
    proud: '', funny: ''
  },
  characteristics: []
};

const THEMES: { id: Theme; label: string; icon: any; color: string }[] = [
  { id: 'light', label: 'Claro', icon: Sun, color: 'bg-white border-slate-200' },
  { id: 'dark', label: 'Escuro', icon: Moon, color: 'bg-slate-900 border-slate-800' },
  { id: 'rose', label: 'Rose Gold', icon: Sparkles, color: 'bg-[#b76e79] border-[#a05a65]' },
  { id: 'retro', label: 'Retro', icon: Palette, color: 'bg-[#ff00ff] border-[#cc00cc]' },
  { id: 'pride', label: 'Pride', icon: Heart, color: 'bg-gradient-to-r from-red-500 via-green-500 to-purple-500' },
  { id: 'bw', label: 'B&W', icon: MinusCircle, color: 'bg-black border-white' },
  { id: 'glass', label: 'Glass', icon: CloudSun, color: 'bg-indigo-500/50 backdrop-blur-sm' },
];

// --- Splash Component ---

const SplashScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Particle Brain Animation */}
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
           <BrainCircuit size={200} className="text-indigo-500 animate-pulse" />
        </div>
        {/* Simulating particles forming a brain with multiple dots */}
        <div className="grid grid-cols-6 grid-rows-6 gap-2 w-48 h-40 relative">
          {Array.from({ length: 36 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-indigo-400 rounded-full w-2 h-2 animate-bounce"
              style={{ 
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.4 + Math.random() * 0.6,
                transform: `scale(${0.5 + Math.random()})`
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md animate-fade-in">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
          Seja Bem-Vindo ao <br/> <span className="text-indigo-500">Prontuário PSI</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          Gestão Clínica Inteligente com tecnologia sistêmica e segurança de dados.
        </p>
      </div>

      <div className="mt-12 space-y-4 w-full max-w-xs">
        <button 
          onClick={onLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 text-slate-900 px-6 py-4 rounded-2xl font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
          <span>Entrar com Google</span>
        </button>
        <p className="text-[10px] text-slate-500 text-center uppercase font-black tracking-widest">
          Acesso Seguro & Criptografado
        </p>
      </div>

      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px]"></div>
    </div>
  );
};

// --- Helper UI Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none translate-x-1' 
        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    } ${collapsed ? 'justify-center' : 'space-x-3 rounded-xl'}`}
    title={label}
  >
    <Icon size={22} />
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

const Widget = ({ icon: Icon, title, value, subValue, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-opacity-10 ${color}`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{title}</div>
    </div>
    <div>
      <div className="text-2xl font-black dark:text-white tracking-tight">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{subValue}</div>
    </div>
  </div>
);

const PostItSystem = () => {
  const [notes, setNotes] = useState<Array<{id: string, text: string, colorIdx: number}>>(() => {
    const saved = localStorage.getItem('psi_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Revisar anamnese do Paciente A antes da sessão de terça.', colorIdx: 0 },
      { id: '2', text: 'Lembrar de conferir honorários pendentes.', colorIdx: 2 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('psi_notes', JSON.stringify(notes));
  }, [notes]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const addNote = () => {
    const newNote = { id: Date.now().toString(), text: '', colorIdx: Math.floor(Math.random() * POST_IT_COLORS.length) };
    setNotes([...notes, newNote]);
    setEditingId(newNote.id);
  };

  const updateNote = (id: string, text: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center space-x-2">
          <StickyNote size={18} className="text-yellow-500" />
          <span>Post-its / Lembretes</span>
        </h3>
        <button onClick={addNote} className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl hover:scale-110 transition-all">
          <PlusCircle size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div 
            key={note.id} 
            className={`p-5 rounded-3xl border-2 transition-all shadow-sm flex flex-col justify-between min-h-[140px] relative group ${POST_IT_COLORS[note.colorIdx]}`}
          >
            {editingId === note.id ? (
              <textarea
                autoFocus
                className="bg-transparent border-none focus:ring-0 resize-none w-full text-xs font-bold h-full placeholder:text-black/20"
                value={note.text}
                placeholder="Clique para escrever..."
                onBlur={() => setEditingId(null)}
                onChange={(e) => updateNote(note.id, e.target.value)}
              />
            ) : (
              <div 
                className="text-xs font-bold leading-relaxed cursor-text h-full overflow-hidden"
                onClick={() => setEditingId(note.id)}
              >
                {note.text || <span className="opacity-30 italic font-medium">Nota vazia...</span>}
              </div>
            )}
            <div className="flex justify-end pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="p-1 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GoogleAgenda2026 = ({ patients }: { patients: Patient[] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); 
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const getDaysInMonth = (month: number) => new Date(2026, month + 1, 0).getDate();
  const getFirstDayOffset = (month: number) => new Date(2026, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOffset = getFirstDayOffset(currentMonth);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[650px]">
      <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
            <CalendarDays size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black dark:text-white tracking-tight leading-none">Agenda Integrada</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronização 2026</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all"><ChevronLeft size={20} /></button>
          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
             <span className="text-sm font-black uppercase tracking-widest w-32 inline-block">{months[currentMonth]}</span>
          </div>
          <button onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-7 text-center overflow-y-auto custom-scrollbar">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="py-3 text-[10px] font-black text-slate-400 uppercase border-b dark:border-slate-700">{day}</div>
        ))}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`offset-${i}`} className="border-r border-b dark:border-slate-700 p-2 bg-slate-50/30 dark:bg-slate-900/20"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const weekday = (firstDayOffset + i) % 7;
          return (
            <div key={i} className="border-r border-b dark:border-slate-700 p-2 min-h-[90px] hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors relative group overflow-hidden">
              <span className={`text-xs font-bold ${weekday === 0 || weekday === 6 ? 'text-red-400' : 'text-slate-400'}`}>{dayNumber}</span>
              {(weekday === 1 || weekday === 3) && dayNumber < 25 && (
                <div className="mt-1 p-1 bg-indigo-500 text-white text-[8px] rounded font-bold truncate shadow-sm">Sessão PSI</div>
              )}
              <button className="absolute bottom-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white rounded-md"><PlusCircle size={10} /></button>
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center border-t dark:border-slate-700">
        <button onClick={() => window.open('https://calendar.google.com', '_blank')} className="text-[10px] font-black text-white bg-indigo-600 px-6 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-all w-full uppercase tracking-widest">Sincronizar Google Calendar</button>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('psi_is_logged_in') === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('psi_is_logged_in', 'true');
  };

  const handleLogout = () => {
    if(confirm("Deseja realmente sair?")) {
      setIsLoggedIn(false);
      localStorage.removeItem('psi_is_logged_in');
    }
  };

  // Persistence Engine
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('psi_patients');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<SessionRecord[]>(() => {
    const saved = localStorage.getItem('psi_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [financials, setFinancials] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('psi_financials');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastBackupDate, setLastBackupDate] = useState<string>(() => {
    return localStorage.getItem('psi_last_backup') || '';
  });

  useEffect(() => localStorage.setItem('psi_patients', JSON.stringify(patients)), [patients]);
  useEffect(() => localStorage.setItem('psi_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('psi_financials', JSON.stringify(financials)), [financials]);
  useEffect(() => localStorage.setItem('psi_last_backup', lastBackupDate), [lastBackupDate]);

  const [theme, setTheme] = useState<Theme>('light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('psi_profile');
    return saved ? JSON.parse(saved) : {
      name: "Psicólogo(a)",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=user_psi",
      crp: "00/000000"
    };
  });

  useEffect(() => localStorage.setItem('psi_profile', JSON.stringify(profile)), [profile]);

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({ temp: 24, city: "São Paulo" });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.className = '';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else if (theme !== 'light') document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const patientsCount = useMemo(() => patients.length, [patients]);
  const sessionsCount = useMemo(() => sessions.length, [sessions]);
  const financialTotal = useMemo(() => {
    return financials.reduce((acc, curr) => acc + (parseFloat(curr.value?.toString().replace(/[^\d,-]/g, '').replace(',', '.')) || 0), 0);
  }, [financials]);

  const needsBackupToday = useMemo(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    return lastBackupDate !== today;
  }, [lastBackupDate]);

  const clinicalInsight = useMemo(() => {
    const isErickson = Math.random() > 0.5;
    const list = isErickson ? ERICKSONIAN_PHRASES : CONSTELLATION_PHRASES;
    return { 
      phrase: list[Math.floor(Math.random() * list.length)], 
      author: isErickson ? "Milton Erickson" : "Bert Hellinger" 
    };
  }, [activeTab]);

  const exportData = (format: 'json' | 'csv') => {
    const data = { patients, sessions, financials, profile };
    const dateStr = new Date().toISOString().split('T')[0];
    const todayStr = new Date().toLocaleDateString('pt-BR');
    
    let content: string;
    let type: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      type = 'application/json';
    } else {
      content = "ID,Nome,Data Registro,CPF,WhatsApp\n" + patients.map(p => `${p.id},${p.name},${p.registrationDate},${p.cpf},${p.whatsapp}`).join('\n');
      type = 'text/csv';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_psi_${dateStr}.${format}`;
    a.click();
    
    setLastBackupDate(todayStr);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.patients) setPatients(data.patients);
        if (data.sessions) setSessions(data.sessions);
        if (data.financials) setFinancials(data.financials);
        if (data.profile) setProfile(data.profile);
        alert("Backup restaurado com sucesso!");
      } catch (err) {
        alert("Erro ao importar arquivo. Verifique se o formato é JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  const handlePatientSave = (patient: Patient) => {
    setPatients(prev => prev.some(p => p.id === patient.id) ? prev.map(p => p.id === patient.id ? patient : p) : [...prev, patient]);
    setEditingPatient(null);
    setActiveTab('dashboard');
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setActiveTab('new-patient');
  };

  const handleDeletePatient = (id: string) => {
    if (confirm("Deseja realmente excluir este paciente? Esta ação não pode ser desfeita sem backup.")) {
      setPatients(prev => prev.filter(p => p.id !== id));
      setSessions(prev => prev.filter(s => s.patientId !== id));
      setFinancials(prev => prev.filter(f => f.patientId !== id));
    }
  };

  if (!isLoggedIn) {
    return <SplashScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-['Inter']`}>
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-800 transition-all duration-500 shadow-2xl z-40 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <div className="p-8 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">P</div>
              <span className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">PSI ADMIN</span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Menu size={20} className="text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setEditingPatient(null); }} collapsed={sidebarCollapsed} />
          <SidebarItem icon={PlusCircle} label="Novo Paciente" active={activeTab === 'new-patient'} onClick={() => { setActiveTab('new-patient'); setEditingPatient(null); }} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Users} label="Sessões" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={DollarSign} label="Financeiro" active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} collapsed={sidebarCollapsed} />
        </nav>

        <div className="p-6 border-t dark:border-slate-800 space-y-4">
           <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center space-x-3 w-full p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
             <img src={profile.photo} className="w-12 h-12 rounded-2xl border-2 border-indigo-500 object-cover shadow-sm" alt="Avatar" />
             {!sidebarCollapsed && (
               <div className="flex-1 text-left overflow-hidden">
                 <div className="text-sm font-bold dark:text-white truncate">{profile.name}</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">CRP: {profile.crp}</div>
               </div>
             )}
           </button>
           {!sidebarCollapsed && (
             <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-2 text-[10px] font-black uppercase text-red-400 hover:text-red-500 transition-colors">
               <LogOut size={14} />
               <span>Sair do Sistema</span>
             </button>
           )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Modern Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <Menu size={24} className="dark:text-white text-slate-600" />
            </button>
            <span className="font-black text-indigo-600 text-lg uppercase">PSI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Profissional Logado</span>
              <span className="text-xl font-black text-slate-800 dark:text-white">{profile.name}</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <Calendar size={18} className="text-indigo-500" />
                <span>{currentTime.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <Clock size={18} className="text-indigo-500" />
                <span>{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsThemePanelOpen(!isThemePanelOpen)} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:text-white border dark:border-slate-700">
              <Palette size={20} />
            </button>
            {isThemePanelOpen && (
              <div className="absolute right-8 mt-64 w-64 p-4 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border dark:border-slate-700 z-50 animate-slide-up">
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Temas Modernos</h4>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((t) => (
                    <button key={t.id} onClick={() => { setTheme(t.id); setIsThemePanelOpen(false); }} className={`flex items-center space-x-2 p-2 rounded-xl border-2 transition-all ${theme === t.id ? 'border-indigo-600 scale-105' : 'border-transparent'}`}>
                      <div className={`w-6 h-6 rounded-lg ${t.color}`}><t.icon size={12} className="text-white mx-auto mt-1" /></div>
                      <span className="text-[10px] font-bold">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setIsAIModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-all">
              <Bot size={20} />
              <span className="hidden sm:inline">AGENTE PSI</span>
            </button>
          </div>
        </header>

        {/* Viewport */}
        <section className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar flex flex-col">
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-fade-in">
                {/* Clinical Insight */}
                <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[40px] border dark:border-slate-800 relative group overflow-hidden">
                  <div className="relative z-10 flex items-start space-x-6">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-[30px]"><Quote size={32} className="text-indigo-600" /></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Insight Sistêmico do Dia</p>
                      <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight italic">"{clinicalInsight.phrase}"</h2>
                      <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">— {clinicalInsight.author}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Widget icon={Users} title="Pacientes" value={patientsCount} subValue="Ativos" color="bg-blue-500" />
                  <Widget icon={Calendar} title="Sessões" value={sessionsCount} subValue="Registradas" color="bg-purple-500" />
                  <Widget icon={DollarSign} title="Faturamento" value={`R$ ${financialTotal.toLocaleString('pt-BR')}`} subValue="Mês" color="bg-emerald-500" />
                  {needsBackupToday ? (
                    <div onClick={() => exportData('json')} className="bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl border border-red-200 dark:border-red-800 flex flex-col justify-between hover:scale-105 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-red-500 bg-opacity-10 text-red-600"><AlertTriangle size={24} /></div>
                        <div className="text-[10px] uppercase tracking-widest text-red-500 font-black">Segurança</div>
                      </div>
                      <div>
                        <div className="text-xl font-black dark:text-white tracking-tight">Backup Pendente</div>
                        <div className="text-[10px] text-red-400 font-bold uppercase">Clique para salvar agora</div>
                      </div>
                    </div>
                  ) : (
                    <Widget icon={ShieldCheck} title="Segurança" value="Protegido" subValue={`Último: ${lastBackupDate}`} color="bg-emerald-500" />
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <GoogleAgenda2026 patients={patients} />
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Prontuários Recentes</h3>
                        <button onClick={() => setActiveTab('new-patient')} className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl uppercase tracking-widest">Novo Registro</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-slate-400 border-b dark:border-slate-700">
                            <tr className="text-left"><th className="pb-4 uppercase text-[10px] font-black">Paciente</th><th className="pb-4 uppercase text-[10px] font-black">WhatsApp</th><th className="pb-4 text-right uppercase text-[10px] font-black">Ações</th></tr>
                          </thead>
                          <tbody className="divide-y dark:divide-slate-700">
                            {patients.length > 0 ? patients.map(p => (
                              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-5 font-bold dark:text-white">{p.name || "Paciente"}</td>
                                <td className="py-5"><a href={`https://wa.me/${p.whatsapp?.replace(/\D/g, '')}`} target="_blank" className="text-emerald-500 flex items-center space-x-1 font-bold"><MessageCircle size={14} /> <span>Conversar</span></a></td>
                                <td className="py-5 text-right"><div className="flex items-center justify-end space-x-2"><button onClick={() => handleEditPatient(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button><button onClick={() => handleDeletePatient(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div></td>
                              </tr>
                            )) : (
                              <tr><td colSpan={3} className="py-10 text-center text-slate-300 italic font-medium uppercase tracking-widest text-[10px]">Nenhum paciente cadastrado.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <PostItSystem />
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border dark:border-slate-800 shadow-sm space-y-6">
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Segurança & Backup Diário</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => exportData('json')} className="p-4 bg-indigo-600 text-white rounded-2xl flex flex-col items-center shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all"><Download size={20} className="mb-2" /><span className="text-[9px] font-black uppercase tracking-widest">Salvar Backup</span></button>
                        <label className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl flex flex-col items-center cursor-pointer hover:bg-slate-200 transition-all border-2 border-dashed border-slate-300 dark:border-slate-600">
                          <Upload size={20} className="mb-2 text-slate-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Importar Dados</span>
                          <input type="file" accept=".json" onChange={importData} className="hidden" />
                        </label>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                        <ShieldCheck size={14} className="inline mr-2 text-indigo-500" />
                        Último backup: {lastBackupDate || 'Nunca realizado'}
                      </div>
                    </div>
                    <button onClick={() => window.open('https://meet.google.com', '_blank')} className="w-full py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[30px] shadow-sm flex items-center justify-center space-x-3 text-sm font-black text-slate-700 dark:text-white hover:scale-105 active:scale-95 transition-all">
                       <Camera className="text-red-500" />
                       <span className="uppercase tracking-widest">Iniciar Teleconsulta</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'new-patient' && <PatientRegistration initialData={editingPatient} onSave={handlePatientSave} onCancel={() => { setActiveTab('dashboard'); setEditingPatient(null); }} />}
            {activeTab === 'sessions' && <SessionsTab patients={patients} sessions={sessions} setSessions={setSessions} />}
            {activeTab === 'financial' && <FinancialTab financials={financials} setFinancials={setFinancials} patients={patients} />}
          </div>

          <footer className="mt-20 py-8 border-t dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-4">
             <div className="flex items-center space-x-2">
                <span>Desenvolvido por Anderson | Maooeweb</span>
                <span className="opacity-30">•</span>
                <a href="https://wa.me/5532984124860" target="_blank" className="text-indigo-500 hover:text-indigo-600 flex items-center space-x-1">
                   <MessageCircle size={12} />
                   <span>3298412-4860</span>
                </a>
             </div>
             <div>© 2026 Prontuário PSI - Gestão Clínica Inteligente</div>
          </footer>
        </section>
      </main>

      {isAIModalOpen && <AIModal onClose={() => setIsAIModalOpen(false)} context={{ patients, sessions, financials }} />}
      {isProfileModalOpen && <ProfileModal profile={profile} setProfile={setProfile} onClose={() => setIsProfileModalOpen(false)} />}
    </div>
  );
}

// --- Form & Tab Components ---

const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, required }: any) => (
  <div className="space-y-1 w-full group">
    <label className="text-[9px] font-black text-slate-400 group-focus-within:text-indigo-500 uppercase tracking-widest transition-colors">{label} {required && '*'}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl focus:outline-none dark:text-white transition-all text-sm font-bold shadow-sm" />
  </div>
);

const FormTextArea = ({ label, name, value, onChange, placeholder }: any) => (
  <div className="space-y-1 w-full">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl focus:outline-none dark:text-white transition-all text-sm font-bold min-h-[100px]" />
  </div>
);

const FormCheckGroup = ({ label, name, checked, onChange }: any) => (
  <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" />
    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{label}</span>
  </label>
);

const SessionsTab = ({ patients, sessions, setSessions }: any) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [newSession, setNewSession] = useState<Partial<SessionRecord>>({
    sessionNumber: '',
    date: new Date().toISOString().split('T')[0],
    theme: '',
    observations: '',
    homework: '',
    learning: '',
    finalPhrase: '',
    audioTranscription: ''
  });

  const selectedPatient = useMemo(() => patients.find((p: Patient) => p.id === selectedPatientId), [patients, selectedPatientId]);
  const patientSessions = useMemo(() => sessions.filter((s: SessionRecord) => s.patientId === selectedPatientId), [sessions, selectedPatientId]);

  const handleAddSession = () => {
    if (!selectedPatientId) return;
    const session: SessionRecord = {
      ...newSession as SessionRecord,
      id: Date.now().toString(),
      patientId: selectedPatientId,
      sessionNumber: newSession.sessionNumber || (patientSessions.length + 1).toString()
    };
    setSessions([...sessions, session]);
    setNewSession({ sessionNumber: '', date: new Date().toISOString().split('T')[0], theme: '', observations: '', homework: '', learning: '', finalPhrase: '', audioTranscription: '' });
  };

  return (
    <div className="animate-fade-in py-10 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border dark:border-slate-700">
         <h2 className="text-2xl font-black uppercase tracking-tighter">2- SESSÕES - Registro de Atendimentos</h2>
         <select 
           value={selectedPatientId} 
           onChange={(e) => setSelectedPatientId(e.target.value)}
           className="p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none text-xs font-black uppercase tracking-widest text-indigo-600"
         >
           <option value="">Selecionar Paciente...</option>
           {patients.map((p: Patient) => <option key={p.id} value={p.id}>{p.name}</option>)}
         </select>
      </div>

      {selectedPatientId && selectedPatient ? (
        <div className="space-y-10">
          {/* Cabeçalho do Paciente */}
          <div className="bg-indigo-600 text-white p-10 rounded-[50px] shadow-xl relative overflow-hidden">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                   <p className="text-[10px] font-black uppercase opacity-60 mb-1">Nome do Paciente</p>
                   <p className="text-xl font-black tracking-tight">{selectedPatient.name}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase opacity-60 mb-1">Dados de Contato</p>
                   <p className="text-sm font-bold">{selectedPatient.phone || selectedPatient.whatsapp || 'Não informado'}</p>
                   <p className="text-xs opacity-80">{selectedPatient.email || 'E-mail não informado'}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase opacity-60 mb-1">Nascimento / Idade</p>
                   <p className="text-sm font-bold">{selectedPatient.birthDate || '--/--/----'}</p>
                   <p className="text-xs opacity-80">{selectedPatient.age ? `${selectedPatient.age} anos` : 'Idade não informada'}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase opacity-60 mb-1">Plano de Trabalho</p>
                   <p className="text-sm font-bold capitalize">Sessões {selectedPatient.sessionFrequency || 'Não definida'}</p>
                   <p className="text-xs opacity-80">Início: {selectedPatient.sessionStartDate || '--/--/----'}</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Formulário Detalhado */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[50px] shadow-sm border dark:border-slate-700 space-y-6">
              <div className="flex items-center space-x-3 text-indigo-600 mb-4">
                 <Edit2 size={24} />
                 <h3 className="text-sm font-black uppercase tracking-widest">Novo Registro de Atendimento</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <FormInput label="Nº Sessão" placeholder="Ex: 01" value={newSession.sessionNumber} onChange={(e: any) => setNewSession({...newSession, sessionNumber: e.target.value})} />
                <FormInput label="Data da Sessão" type="date" value={newSession.date} onChange={(e: any) => setNewSession({...newSession, date: e.target.value})} />
              </div>

              <FormInput label="Tema Trabalhado" placeholder="Descreva o foco principal da sessão..." value={newSession.theme} onChange={(e: any) => setNewSession({...newSession, theme: e.target.value})} />
              <FormTextArea label="Observações Clínicas" placeholder="Detalhes técnicos e clínicos do atendimento..." value={newSession.observations} onChange={(e: any) => setNewSession({...newSession, observations: e.target.value})} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormTextArea label="Tarefa da Sessão" placeholder="Atividades propostas para o intervalo..." value={newSession.homework} onChange={(e: any) => setNewSession({...newSession, homework: e.target.value})} />
                <FormTextArea label="Aprendizado do Paciente" placeholder="O que o paciente integrou hoje?" value={newSession.learning} onChange={(e: any) => setNewSession({...newSession, learning: e.target.value})} />
              </div>

              <div className="space-y-6 pt-4 border-t dark:border-slate-700">
                <FormInput label="Frase Final" placeholder="A frase que encerrou o processo hoje..." value={newSession.finalPhrase} onChange={(e: any) => setNewSession({...newSession, finalPhrase: e.target.value})} />
                <div className="space-y-1 group">
                   <label className="text-[9px] font-black text-slate-400 group-focus-within:text-indigo-500 uppercase tracking-widest flex items-center">
                     <Mic size={12} className="mr-1" /> Transcrição do Áudio / Notas Rápidas
                   </label>
                   <textarea 
                     className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/30 rounded-3xl focus:outline-none dark:text-white transition-all text-sm font-bold min-h-[120px]"
                     placeholder="Cole aqui a transcrição do áudio ou notas de voz..."
                     value={newSession.audioTranscription}
                     onChange={(e: any) => setNewSession({...newSession, audioTranscription: e.target.value})}
                   />
                </div>
              </div>

              <button onClick={handleAddSession} className="w-full py-5 bg-indigo-600 text-white rounded-[30px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                Salvar Atendimento Completo
              </button>
            </div>

            {/* Lista de Sessões Anteriores */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center">
                    <History size={18} className="mr-2" /> Histórico Evolutivo
                  </h3>
                  <span className="text-[10px] font-black text-white bg-slate-400 px-3 py-1 rounded-full">{patientSessions.length} registros</span>
               </div>
               <div className="space-y-6 h-[800px] overflow-y-auto custom-scrollbar pr-4 pb-20">
                  {patientSessions.length > 0 ? patientSessions.slice().reverse().map((s: SessionRecord) => (
                    <div key={s.id} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border dark:border-slate-700 relative group hover:shadow-lg transition-shadow">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black rounded-lg uppercase">Sessão {s.sessionNumber}</span>
                             <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.date}</span>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                       </div>
                       
                       <div className="space-y-4">
                          <h4 className="text-lg font-black dark:text-white leading-tight">{s.theme || "Sessão sem tema definido"}</h4>
                          <div className="grid grid-cols-1 gap-3">
                             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                                <p className="text-[9px] font-black uppercase text-indigo-500 mb-1">Observações</p>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">{s.observations}</p>
                             </div>
                             {s.homework && (
                               <div className="flex items-start space-x-2 text-xs font-bold text-slate-500">
                                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>Tarefa: {s.homework}</span>
                               </div>
                             )}
                             {s.finalPhrase && (
                               <div className="pt-4 mt-4 border-t dark:border-slate-700 text-center italic font-black text-indigo-600 text-sm">
                                  "{s.finalPhrase}"
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  )) : <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/20 rounded-[40px] border-4 border-dashed dark:border-slate-800 text-slate-300 italic font-black uppercase tracking-widest text-xs">Aguardando primeiro registro...</div>}
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-40 bg-white dark:bg-slate-800 rounded-[50px] border-4 border-dashed dark:border-slate-700 shadow-sm animate-pulse">
           <Users size={64} className="mx-auto text-slate-200 mb-6" />
           <p className="text-slate-400 font-black uppercase tracking-widest">Selecione um paciente para iniciar o registro de sessão.</p>
        </div>
      )}
    </div>
  );
};

const FinancialTab = ({ financials, setFinancials, patients }: any) => {
  const [newEntry, setNewEntry] = useState<Partial<FinancialRecord>>({
    patientId: '',
    value: '',
    paymentMethod: 'PIX',
    date: new Date().toISOString().split('T')[0],
    status: 'Em dia'
  });

  const handleAdd = () => {
    const patient = patients.find((p: Patient) => p.id === newEntry.patientId);
    const entry: FinancialRecord = {
      ...newEntry as FinancialRecord,
      id: Date.now().toString(),
      patientName: patient?.name || 'Desconhecido'
    };
    setFinancials([...financials, entry]);
    setNewEntry({ patientId: '', value: '', paymentMethod: 'PIX', date: new Date().toISOString().split('T')[0], status: 'Em dia' });
  };

  return (
    <div className="animate-fade-in py-10 max-w-6xl mx-auto space-y-10">
      <h2 className="text-3xl font-black uppercase tracking-tighter">Módulo Financeiro</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border dark:border-slate-700 h-fit space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Lançar Recebimento</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Paciente</label>
              <select 
                value={newEntry.patientId} 
                onChange={(e) => setNewEntry({...newEntry, patientId: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl text-xs font-bold"
              >
                <option value="">Selecionar...</option>
                {patients.map((p: Patient) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <FormInput label="Valor (R$)" value={newEntry.value} onChange={(e: any) => setNewEntry({...newEntry, value: e.target.value})} />
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Pagamento</label>
              <select 
                value={newEntry.paymentMethod} 
                onChange={(e) => setNewEntry({...newEntry, paymentMethod: e.target.value as any})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl text-xs font-bold"
              >
                <option>PIX</option><option>Depósito</option><option>Dinheiro</option><option>Cartão</option><option>Outro</option>
              </select>
            </div>
            <FormInput label="Data" type="date" value={newEntry.date} onChange={(e: any) => setNewEntry({...newEntry, date: e.target.value})} />
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Status</label>
              <select 
                value={newEntry.status} 
                onChange={(e) => setNewEntry({...newEntry, status: e.target.value as any})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl text-xs font-bold"
              >
                <option>Em dia</option><option>Aguardando</option><option>Agendado</option><option>Em atraso</option><option>Outro</option>
              </select>
            </div>
            <button onClick={handleAdd} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Lançar Honorário</button>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border dark:border-slate-700">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 tracking-widest">Fluxo de Honorários</h3>
           <div className="overflow-x-auto">
              <table className="w-full text-sm">
                 <thead className="text-slate-400 border-b dark:border-slate-700">
                    <tr className="text-left">
                       <th className="pb-4 uppercase text-[9px] font-black">Paciente</th>
                       <th className="pb-4 uppercase text-[9px] font-black">Valor</th>
                       <th className="pb-4 uppercase text-[9px] font-black">Método</th>
                       <th className="pb-4 uppercase text-[9px] font-black">Data</th>
                       <th className="pb-4 text-right uppercase text-[9px] font-black">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-slate-700">
                    {financials.length > 0 ? financials.map((f: FinancialRecord) => (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                         <td className="py-4 font-bold dark:text-white">{f.patientName}</td>
                         <td className="py-4 text-slate-600 dark:text-slate-400">R$ {f.value}</td>
                         <td className="py-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px] font-black">{f.paymentMethod}</span></td>
                         <td className="py-4 text-xs">{f.date}</td>
                         <td className="py-4 text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              f.status === 'Em dia' ? 'bg-emerald-100 text-emerald-700' : 
                              f.status === 'Em atraso' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>{f.status}</span>
                         </td>
                      </tr>
                    )) : <tr><td colSpan={5} className="py-20 text-center text-slate-300 italic uppercase tracking-widest text-[10px]">Nenhum lançamento registrado.</td></tr>}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

const PatientRegistration = ({ initialData, onSave, onCancel }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Patient>>(initialData || INITIAL_PATIENT);

  const handleInput = useCallback((e: any) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ 
        ...prev, 
        [parent]: { ...(prev[parent as keyof Patient] as any), [child]: type === 'checkbox' ? checked : value } 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  }, []);

  const handleToggleCharacteristic = (char: string) => {
    const current = formData.characteristics || [];
    setFormData({ ...formData, characteristics: current.includes(char) ? current.filter(c => c !== char) : [...current, char] });
  };

  const steps = [
    { id: 1, label: "Dados Básicos", icon: User },
    { id: 2, label: "Estrutura Familiar", icon: Home },
    { id: 3, label: "Saúde & Contexto", icon: HelpCircle },
    { id: 4, label: "Relacionamentos", icon: Heart },
    { id: 5, label: "Dinâmica & Estilo", icon: Sparkles },
    { id: 6, label: "Sessões & Sentenças", icon: Briefcase }
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({ ...formData, id: formData.id || Date.now().toString() } as Patient);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-[50px] shadow-2xl border dark:border-slate-700 flex flex-col md:flex-row overflow-hidden min-h-[850px] animate-slide-up">
      <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 p-10 border-r dark:border-slate-700 flex flex-col justify-between">
         <div className="space-y-8">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-widest leading-none">Anamnese Psicológica Adulto</h2>
            <div className="space-y-3">
               {steps.map(s => (
                 <button key={s.id} onClick={() => setStep(s.id)} type="button" className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all ${step === s.id ? 'bg-white dark:bg-slate-800 shadow-xl scale-105 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <s.icon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                 </button>
               ))}
            </div>
         </div>
         <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
               <span className="text-[9px] font-black uppercase text-indigo-500">Progresso</span>
               <span className="text-[9px] font-black text-indigo-500">{Math.round((step/6)*100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(step/6)*100}%` }}></div>
            </div>
         </div>
      </div>

      <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar">
         <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1">
               {step === 1 && (
                 <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center space-x-4"><User className="text-indigo-600" size={24} /><h3 className="text-xl font-black uppercase tracking-tighter">Identificação do Cliente</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <FormInput label="Nome Completo" name="name" value={formData.name || ''} onChange={handleInput} required />
                       <FormInput label="Data Nascimento" name="birthDate" type="date" value={formData.birthDate || ''} onChange={handleInput} />
                       <FormInput label="Idade" name="age" type="number" value={formData.age || ''} onChange={handleInput} />
                       <FormInput label="Naturalidade" name="naturalness" value={formData.naturalness || ''} onChange={handleInput} />
                       <FormInput label="CPF" name="cpf" value={formData.cpf || ''} onChange={handleInput} />
                       <FormInput label="WhatsApp" name="whatsapp" value={formData.whatsapp || ''} onChange={handleInput} />
                       <FormInput label="E-mail" name="email" value={formData.email || ''} onChange={handleInput} />
                    </div>
                    <FormTextArea label="Endereço Completo" name="address" value={formData.address || ''} onChange={handleInput} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       <FormInput label="Graduação" name="education" value={formData.education || ''} onChange={handleInput} />
                       <FormInput label="Profissão" name="profession" value={formData.profession || ''} onChange={handleInput} />
                       <FormInput label="Empresa" name="employer" value={formData.employer || ''} onChange={handleInput} />
                    </div>
                 </div>
               )}
               {step === 2 && (
                 <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center space-x-4"><Home className="text-indigo-600" size={24} /><h3 className="text-xl font-black uppercase tracking-tighter">Estrutura Familiar</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="space-y-4 border-r dark:border-slate-700 pr-8">
                          <p className="text-[10px] font-black uppercase text-indigo-500">Mãe</p>
                          <FormInput label="Nome" name="mother.name" value={formData.mother?.name || ''} onChange={handleInput} />
                          <FormCheckGroup label="Mãe Viva" name="mother.isAlive" checked={formData.mother?.isAlive || false} onChange={handleInput} />
                          <FormInput label="WhatsApp Mãe" name="mother.whatsapp" value={formData.mother?.whatsapp || ''} onChange={handleInput} />
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-indigo-500">Pai</p>
                          <FormInput label="Nome" name="father.name" value={formData.father?.name || ''} onChange={handleInput} />
                          <FormCheckGroup label="Pai Vivo" name="father.isAlive" checked={formData.father?.isAlive || false} onChange={handleInput} />
                          <FormInput label="WhatsApp Pai" name="father.whatsapp" value={formData.father?.whatsapp || ''} onChange={handleInput} />
                       </div>
                    </div>
                    <FormTextArea label="Relacionamento com a Família" name="relationshipSiblings" value={formData.relationshipSiblings || ''} onChange={handleInput} />
                 </div>
               )}
               {step === 3 && (
                 <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center space-x-4"><HelpCircle className="text-indigo-600" size={24} /><h3 className="text-xl font-black uppercase tracking-tighter">Saúde e Contexto</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <FormCheckGroup label="Problema de Saúde?" name="healthProblem" checked={formData.healthProblem || false} onChange={handleInput} />
                       <FormInput label="Qual?" name="healthProblemDetail" value={formData.healthProblemDetail || ''} onChange={handleInput} />
                       <FormCheckGroup label="Uso de Medicação?" name="medication" checked={formData.medication || false} onChange={handleInput} />
                       <FormInput label="Qual?" name="medicationDetail" value={formData.medicationDetail || ''} onChange={handleInput} />
                    </div>
                    <FormTextArea label="Histórico de Transtornos na Família" name="familyPsychiatricHistory" value={formData.familyPsychiatricHistory || ''} onChange={handleInput} />
                 </div>
               )}
               {step === 4 && (
                 <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center space-x-4"><Heart className="text-indigo-600" size={24} /><h3 className="text-xl font-black uppercase tracking-tighter">Relacionamentos</h3></div>
                    <FormTextArea label="Problemas Atuais" name="problemBrief" value={formData.problemBrief || ''} onChange={handleInput} />
                    <FormTextArea label="Relacionamento Amoroso" name="romanticRelationshipDesc" value={formData.romanticRelationshipDesc || ''} onChange={handleInput} />
                 </div>
               )}
               {step === 5 && (
                 <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center space-x-4"><Sparkles className="text-indigo-600" size={24} /><h3 className="text-xl font-black uppercase tracking-tighter">Personalidade</h3></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                       {CHARACTERISTICS_OPTIONS.map(c => (
                         <button key={c} type="button" onClick={() => handleToggleCharacteristic(c)} className={`p-3 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${formData.characteristics?.includes(c) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-indigo-200'}`}>{c}</button>
                       ))}
                    </div>
                    <FormTextArea label="Atividades Favoritas" name="qWhatLikesToDo" value={formData.qWhatLikesToDo || ''} onChange={handleInput} />
                 </div>
               )}
               {step === 6 && (
                 <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center space-x-4"><Briefcase className="text-indigo-600" size={24} /><h3 className="text-xl font-black uppercase tracking-tighter">Sessões & Sentenças</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       <FormInput label="Início Trabalho" name="sessionStartDate" type="date" value={formData.sessionStartDate || ''} onChange={handleInput} />
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Periodicidade</label>
                          <select 
                            name="sessionFrequency" 
                            value={formData.sessionFrequency} 
                            onChange={handleInput}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl text-xs font-bold"
                          >
                             <option value="diárias">Diárias</option>
                             <option value="semanais">Semanais</option>
                             <option value="quinzenais">Quinzenais</option>
                             <option value="mensais">Mensais</option>
                             <option value="pontuais">Pontuais</option>
                          </select>
                       </div>
                       <FormInput label="Valor Sessão" name="sessionPrice" value={formData.sessionPrice || ''} onChange={handleInput} />
                    </div>
                    <div className="space-y-4">
                       <FormInput label="Gosto de mim porque..." name="sentences.likeMyself" value={formData.sentences?.likeMyself || ''} onChange={handleInput} />
                       <FormInput label="Gostaria de ser..." name="sentences.wannaBe" value={formData.sentences?.wannaBe || ''} onChange={handleInput} />
                       <FormInput label="Mundo seria melhor se..." name="sentences.worldBetter" value={formData.sentences?.worldBetter || ''} onChange={handleInput} />
                    </div>
                 </div>
               )}
            </div>

            <div className="mt-12 flex justify-between items-center border-t dark:border-slate-700 pt-8">
               <button type="button" onClick={onCancel} className="text-xs font-black uppercase text-slate-400 hover:text-red-500 transition-colors">Descartar</button>
               <div className="flex space-x-4">
                  {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Anterior</button>}
                  {step < 6 ? (
                    <button type="button" onClick={() => setStep(step + 1)} className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Próximo</button>
                  ) : (
                    <button type="submit" className="px-10 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Salvar Prontuário</button>
                  )}
               </div>
            </div>
         </form>
      </div>
    </div>
  );
};

const AIModal = ({ onClose, context }: any) => {
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Agente PSI Conectado. Como posso ajudar?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input; setInput(''); setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true); const res = await askAgent(msg, context);
    setMessages(prev => [...prev, { role: 'bot', text: res.text }]); setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
       <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-[50px] shadow-2xl flex flex-col border dark:border-slate-800 overflow-hidden">
          <div className="p-8 bg-indigo-600 text-white flex justify-between items-center font-black uppercase tracking-widest text-sm"><span>Assistente de IA</span><button onClick={onClose}><X size={24} /></button></div>
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950 space-y-4 custom-scrollbar">
             {messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[75%] p-5 rounded-3xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 dark:text-white border dark:border-slate-700 shadow-sm'}`}>{m.text}</div></div>))}
             {loading && <div className="text-indigo-600 animate-pulse text-[10px] font-black uppercase">Pensando...</div>}
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 flex space-x-4"><input className="flex-1 p-5 rounded-3xl bg-slate-100 dark:bg-slate-800 dark:text-white focus:outline-none" placeholder="Pergunte qualquer coisa..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} /><button onClick={handleSend} className="p-5 bg-indigo-600 text-white rounded-3xl shadow-xl hover:scale-105 transition-all"><Send size={24} /></button></div>
       </div>
    </div>
  );
};

const ProfileModal = ({ profile, setProfile, onClose }: any) => {
  const [temp, setTemp] = useState(profile);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
       <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[50px] p-12 shadow-2xl border dark:border-slate-800 animate-scale-up">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Meu Perfil</h2>
          <div className="space-y-6">
            <FormInput label="Nome" value={temp.name} onChange={(e:any) => setTemp({...temp, name: e.target.value})} />
            <FormInput label="CRP" value={temp.crp} onChange={(e:any) => setTemp({...temp, crp: e.target.value})} />
          </div>
          <div className="mt-12 flex space-x-4">
             <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Voltar</button>
             <button onClick={() => { setProfile(temp); onClose(); }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl font-black uppercase text-[10px]">Salvar</button>
          </div>
       </div>
    </div>
  );
};
