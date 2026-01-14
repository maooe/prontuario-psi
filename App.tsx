
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  DollarSign, 
  LayoutDashboard, 
  PlusCircle, 
  Clock as ClockIcon, 
  X, 
  Send, 
  ExternalLink, 
  Bot, 
  User, 
  MessageCircle, 
  Save, 
  Palette, 
  ChevronRight,
  BrainCircuit,
  Stethoscope,
  Users2,
  ClipboardList,
  Scale,
  Smile,
  Zap,
  Quote,
  HelpCircle,
  Plus,
  Trash2,
  Heart,
  Home,
  Briefcase,
  RefreshCw,
  Download,
  FileJson,
  FileSpreadsheet,
  Upload,
  Calendar as CalendarIcon,
  Settings,
  ChevronLeft,
  Camera,
  CheckCircle2,
  Sprout,
  Dog,
  Gamepad2
} from 'lucide-react';
import { Theme, UserProfile, Patient, SessionRecord, FinancialRecord, Child, Sibling, ParentInfo } from './types';
import { askAgent } from './services/gemini';

// --- Constantes e Avatares ---

const POST_IT_COLORS = [
  'bg-yellow-200 text-yellow-900 border-yellow-300',
  'bg-blue-200 text-blue-900 border-blue-300',
  'bg-pink-200 text-pink-900 border-pink-300',
  'bg-emerald-200 text-emerald-900 border-emerald-300'
];

const AVATAR_COLLECTIONS = {
  plants: ['monstera', 'cactus', 'flower', 'tree'],
  animals: ['cat', 'dog', 'owl', 'fox', 'butterfly'],
  people: ['persona1', 'persona2', 'persona3', 'persona4']
};

const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
const getPlantUrl = (seed: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

const INITIAL_PARENT: ParentInfo = {
  name: '', age: '', maritalStatus: '', whatsapp: '', education: '', profession: '',
  isAlive: true, deathAge: '', deathYear: '', deathCause: '', deathDetails: '',
  personality: '', relationship: ''
};

const INITIAL_PATIENT: Patient = {
  id: '',
  registrationDate: new Date().toLocaleDateString('pt-BR'),
  name: '', birthDate: '', age: '', naturalness: '', cpf: '', address: '', addressNumber: '', neighborhood: '', city: '', cep: '', whatsapp: '', phone: '', email: '', otherContact: '', education: '', gradYear: '', profession: '', employer: '', workTime: '', maritalStatus: '', maritalTime: '', spouseName: '', spouseAge: '', spouseProfession: '', spouseEducation: '', financialResponsible: '', familyIncome: '',
  hasChildren: false, childrenCount: '0', children: [], relationshipChildren: '',
  mother: { ...INITIAL_PARENT }, father: { ...INITIAL_PARENT },
  hasSiblings: false, siblingsCount: '0', siblings: [], relationshipSiblings: '',
  healthProblem: false, healthProblemDetail: '', medication: false, medicationDetail: '', medicalDiagnosis: '', familyPsychiatricHistory: '', religion: '', isStudent: false, studentDegree: '', studentCourse: '', studentSchedule: '', studentInstitution: '', environment: 'Urbano', environmentWhere: '', temperament: '',
  problemBrief: '', problemStart: '', behaviorBeforeAfter: '', usefulAttempts: '',
  friendships: '', communication: '', workRelations: '', complicatedRelations: '',
  romanticRelationshipDesc: '', romanticDuration: '', partnerAge: '', partnerProfession: '', partnerPersonality: '', partnerLike: '', partnerDislike: '',
  characteristics: [], otherCharacteristics: '',
  qWhatLikesToDo: '', qOkAlone: true, qOkInGroup: true, qPreferredCompanies: '', qLikesHearingStories: true, qLikesTellingStories: true, qLikesMusic: true, qLikesMovies: true, qMovieType: '', qParentsStatus: 'Casados', qFatherNewUnion: false, qMotherNewUnion: false, qParentsRelation: 'Normal', qChildCare: '', qOthersInterfere: false, qWhoInterferes: '',
  sentences: {
    admire: '', friends: '', likeMyself: '', feelBetter: '', parents: '', wannaBe: '', worldBetter: '', worry: '', loseCalm: '', body: '', can: '', cannot: '', favorite: '', pretend: '', nervous: '', fear: '', awayFear: '', wannaHave: '', proud: '', funny: ''
  },
  observations: '', sessionStartDate: '', sessionTime: '', sessionFrequency: 'semanais', sessionPrice: ''
};

const CHARACTERISTIC_OPTIONS = [
  'Ansioso', 'Calmo', 'Agressivo', 'Passivo', 'Comunicativo', 'Introvertido', 'Organizado', 'Desorganizado',
  'Líder', 'Seguidor', 'Otimista', 'Pessimista', 'Confiante', 'Inseguro', 'Impulsivo', 'Reflexivo'
];

// --- Utilitários ---

const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};

const convertToCSV = (data: any[]) => {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(",")).join("\n");
  return `${headers}\n${rows}`;
};

// --- Componentes de UI ---

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="flex flex-col items-center md:items-end text-center md:text-right min-w-[100px]">
      <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
        <ClockIcon size={14} className="animate-pulse" />
        <span className="text-[13px] font-black tabular-nums tracking-tighter uppercase">{formatTime(time)}</span>
      </div>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{formatDate(time)}</span>
    </div>
  );
};

// --- App Principal ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('psi_is_logged_in') === 'true');
  const [patients, setPatients] = useState<Patient[]>(() => JSON.parse(localStorage.getItem('psi_patients') || '[]'));
  const [sessions, setSessions] = useState<SessionRecord[]>(() => JSON.parse(localStorage.getItem('psi_sessions') || '[]'));
  const [financials, setFinancials] = useState<FinancialRecord[]>(() => JSON.parse(localStorage.getItem('psi_financials') || '[]'));
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('psi_theme') as Theme) || 'light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('psi_profile') || '{"name":"Psicóloga Nome","photo":"https://api.dicebear.com/7.x/avataaars/svg?seed=Félix","crp":"00/0000"}'));
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    localStorage.setItem('psi_patients', JSON.stringify(patients));
    localStorage.setItem('psi_sessions', JSON.stringify(sessions));
    localStorage.setItem('psi_financials', JSON.stringify(financials));
    localStorage.setItem('psi_profile', JSON.stringify(profile));
    localStorage.setItem('psi_theme', theme);
  }, [patients, sessions, financials, profile, theme]);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : (theme === 'light' ? '' : `theme-${theme}`);
  }, [theme]);

  const handleSavePatient = (p: Patient, isAutoSave = false) => {
    setPatients(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? { ...item, ...p } : item);
      return [...prev, p];
    });
    if (!isAutoSave) {
      setEditingPatient(null);
      setActiveTab('dashboard');
    }
  };

  const handleExportData = (type: 'json' | 'csv') => {
    const allData = { patients, sessions, financials, profile };
    if (type === 'json') {
      downloadFile(JSON.stringify(allData, null, 2), `backup_psi_${new Date().toLocaleDateString()}.json`, 'application/json');
    } else {
      const csv = convertToCSV(patients);
      downloadFile(csv, `pacientes_psi_${new Date().toLocaleDateString()}.csv`, 'text/csv');
    }
  };

  if (!isLoggedIn) return <SplashScreen onLogin={() => {setIsLoggedIn(true); localStorage.setItem('psi_is_logged_in', 'true');}} />;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex-col fixed h-full z-40">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30">P</div>
          <span className="text-xl font-black dark:text-white tracking-tighter uppercase">PSI ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={CalendarIcon} label="Calendário" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <SidebarItem icon={PlusCircle} label="Novo Prontuário" active={activeTab === 'new-patient'} onClick={() => { setEditingPatient(null); setActiveTab('new-patient'); }} />
          <SidebarItem icon={Users} label="Evoluções" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
          <SidebarItem icon={DollarSign} label="Financeiro" active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} />
          <SidebarItem icon={User} label="Meu Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SidebarItem icon={Settings} label="Dados & Backup" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
        </nav>
        <div className="p-6 border-t dark:border-slate-800">
           <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-all" onClick={() => setActiveTab('profile')}>
             <img src={profile.photo} className="w-10 h-10 rounded-xl border border-indigo-500 bg-white" alt="avatar" />
             <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-black dark:text-white truncate uppercase">{profile.name}</div>
                <div className="text-[8px] font-bold text-slate-400">CRP {profile.crp}</div>
             </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col lg:ml-72 h-screen overflow-hidden">
        <header className="h-24 flex items-center justify-between px-6 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sistema de Prontuário</span>
               <h2 className="text-sm md:text-lg font-black dark:text-white uppercase tracking-tighter truncate max-w-[120px] md:max-w-none">
                  {activeTab === 'new-patient' ? (editingPatient ? 'Editar Prontuário' : 'Nova Anamnese') : 
                   activeTab === 'sessions' ? 'Evoluções Clínicas' :
                   activeTab === 'financial' ? 'Gestão Financeira' : 
                   activeTab === 'calendar' ? 'Agenda de Sessões' : 
                   activeTab === 'profile' ? 'Configurações de Perfil' : 'Painel de Controle'}
               </h2>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
            <RealTimeClock />
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={() => setIsAIModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 text-white p-3 md:px-6 md:py-3 rounded-2xl text-[10px] font-black shadow-xl hover:scale-105 transition-all">
              <Bot size={18} /><span className="hidden md:inline">AGENTE PSI IA</span>
            </button>
            <div className="relative">
              <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white border dark:border-slate-700">
                <Palette size={20}/>
              </button>
              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border dark:border-slate-700 p-2 z-50 animate-scale-up">
                  {['light', 'dark', 'rose', 'retro', 'pride', 'bw', 'glass'].map((t) => (
                    <button key={t} onClick={() => { setTheme(t as Theme); setIsThemeMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all ${theme === t ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 space-y-8">
                 <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[50px] shadow-sm border dark:border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Base de Pacientes ({patients.length})</h3>
                        <div className="flex space-x-2">
                           <button onClick={() => handleExportData('json')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Download size={16}/></button>
                           <button onClick={() => { setEditingPatient(null); setActiveTab('new-patient'); }} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Novo Prontuário</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {patients.slice().reverse().map(p => (
                         <div key={p.id} className="group">
                            <div onClick={() => { setEditingPatient(p); setActiveTab('new-patient'); }} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-[35px] border dark:border-slate-700 hover:border-indigo-500 cursor-pointer transition-all flex items-center space-x-4 shadow-sm hover:shadow-md">
                               <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black">{p.name[0]}</div>
                               <div className="flex-1 overflow-hidden">
                                  <div className="font-black text-xs md:text-sm dark:text-white truncate uppercase tracking-tight">{p.name}</div>
                                  <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Reg: {p.registrationDate}</div>
                               </div>
                               <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500" />
                            </div>
                         </div>
                       ))}
                       {patients.length === 0 && (
                         <div className="col-span-2 py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Nenhum paciente cadastrado</div>
                       )}
                    </div>
                 </div>
                 <MiniCalendar sessions={sessions} patients={patients} />
              </div>
              <div className="space-y-6"><PostItSystem /></div>
            </div>
          )}
          {activeTab === 'calendar' && <CalendarFull sessions={sessions} patients={patients} onAddSession={(s:any) => setSessions([...sessions, s])} />}
          {activeTab === 'new-patient' && <PatientForm initialData={editingPatient} onSave={handleSavePatient} onCancel={() => setActiveTab('dashboard')} />}
          {activeTab === 'sessions' && <SessionsTab patients={patients} sessions={sessions} setSessions={setSessions} />}
          {activeTab === 'financial' && <FinancialTab financials={financials} setFinancials={setFinancials} patients={patients} />}
          {activeTab === 'profile' && <ProfileEditor profile={profile} setProfile={setProfile} />}
          {activeTab === 'data' && <DataManagement onExport={handleExportData} onImport={(data:any) => { setPatients(data.patients); setSessions(data.sessions); setFinancials(data.financials); setProfile(data.profile); }} />}
        </section>
      </main>

      {isAIModalOpen && <AIModal onClose={() => setIsAIModalOpen(false)} context={{ patients, sessions }} />}
    </div>
  );
}

// --- Componentes Adicionais ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-[25px] transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-105' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'}`}>
    <Icon size={20} /><span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
  </button>
);

const MiniCalendar = ({ sessions, patients }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] border dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Próximos Atendimentos</h3>
        <div className="flex items-center space-x-2">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"><ChevronLeft size={16}/></button>
          <span className="text-[10px] font-black uppercase">{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"><ChevronRight size={16}/></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => <div key={d} className="text-[8px] font-black text-slate-300 uppercase">{d}</div>)}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasSession = sessions.some((s:any) => new Date(s.date).getDate() === day && new Date(s.date).getMonth() === currentDate.getMonth());
          return (
            <div key={day} className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-xl ${hasSession ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProfileEditor = ({ profile, setProfile }: any) => {
  const [activeCat, setActiveCat] = useState('people');
  
  const updateProfile = (field: string, val: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: val }));
  };

  const seeds = {
    people: ['Félix', 'Léo', 'Ana', 'Bia', 'Cris', 'Duda', 'Eva'],
    plants: ['Borrachudo', 'Cacto', 'Aloe', 'Violeta', 'Samambaia'],
    animals: ['Coruja', 'Raposa', 'Gato', 'Cachorro', 'Borboleta', 'Leão']
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
       <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[60px] border dark:border-slate-800 shadow-2xl space-y-12">
          <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
             <div className="relative group">
                <div className="w-40 h-40 bg-slate-50 dark:bg-slate-800 rounded-[45px] border-4 border-indigo-100 dark:border-indigo-900 overflow-hidden flex items-center justify-center">
                   <img src={profile.photo} className="w-full h-full object-cover p-2 bg-white" alt="avatar" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl">
                   <Camera size={20} />
                </div>
             </div>
             <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Nome de Exibição</label>
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl outline-none font-bold dark:text-white"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">CRP / Registro</label>
                      <input 
                        type="text" 
                        value={profile.crp} 
                        onChange={(e) => updateProfile('crp', e.target.value)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl outline-none font-bold dark:text-white"
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4">
                <h3 className="text-sm font-black uppercase tracking-tighter">Galeria de Avatares</h3>
                <div className="flex space-x-2">
                   {[
                     { id: 'people', icon: User, label: 'Pessoas' },
                     { id: 'plants', icon: Sprout, label: 'Plantas' },
                     { id: 'animals', icon: Dog, label: 'Animais' }
                   ].map(cat => (
                     <button 
                       key={cat.id} 
                       onClick={() => setActiveCat(cat.id)}
                       className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeCat === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500'}`}
                     >
                       <cat.icon size={14} />
                       <span>{cat.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                {seeds[activeCat as keyof typeof seeds].map(seed => {
                  const url = activeCat === 'plants' 
                    ? `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=f1f5f9`
                    : activeCat === 'animals'
                    ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=f1f5f9`
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=f1f5f9`;
                    
                  return (
                    <button 
                      key={seed}
                      onClick={() => updateProfile('photo', url)}
                      className={`relative aspect-square p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 transition-all hover:scale-110 ${profile.photo === url ? 'border-indigo-600 shadow-lg' : 'border-transparent'}`}
                    >
                       <img src={url} className="w-full h-full" alt={seed} />
                       {profile.photo === url && (
                         <div className="absolute -top-1 -right-1 bg-indigo-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                            <CheckCircle2 size={10} />
                         </div>
                       )}
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="pt-8 flex justify-center">
             <button 
                onClick={() => alert("Perfil salvo com sucesso!")}
                className="px-12 py-5 bg-emerald-600 text-white rounded-[30px] font-black uppercase text-[11px] shadow-2xl hover:scale-105 transition-all flex items-center space-x-3"
             >
                <Save size={18} />
                <span>Confirmar Alterações</span>
             </button>
          </div>
       </div>
    </div>
  );
};

const CalendarFull = ({ sessions, patients, onAddSession }: any) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in pb-20">
       <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-10 rounded-[60px] border dark:border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-black uppercase tracking-tighter">Agenda Semanal</h2>
             <button onClick={() => setIsAdding(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black shadow-lg hover:scale-105 transition-all">
                <Plus size={16}/><span>Agendar Atendimento</span>
             </button>
          </div>
          <div className="grid grid-cols-7 gap-4">
             {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
               <div key={d} className="space-y-4">
                 <div className="text-[10px] font-black uppercase text-slate-400 text-center pb-4 border-b dark:border-slate-800">{d}</div>
                 <div className="min-h-[400px] bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl p-2 space-y-2">
                    {sessions.map((s:any) => (
                      <div key={s.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 border-indigo-500 group relative">
                         <div className="text-[8px] font-black uppercase text-indigo-500">{s.time || '08:00'}</div>
                         <div className="text-[9px] font-bold dark:text-white truncate">{patients.find((p:any) => p.id === s.patientId)?.name || 'Paciente'}</div>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </div>
       </div>
       <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border dark:border-slate-800 shadow-sm space-y-6">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Integração Google</h3>
             <button 
                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-slate-100 hover:bg-slate-50 p-4 rounded-2xl transition-all shadow-sm"
                onClick={async () => {
                  try { await window.aistudio.openSelectKey(); } catch(e) {}
                }}
             >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="G" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Conectar Agenda Google</span>
             </button>
             <p className="text-[8px] font-bold text-slate-400 leading-relaxed text-center">Permita que o sistema sincronize seus atendimentos para enviar lembretes automáticos.</p>
          </div>
          <PostItSystem />
       </div>
    </div>
  );
};

const DataManagement = ({ onExport, onImport }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (confirm("Isso substituirá todos os dados atuais. Deseja continuar?")) {
            onImport(json);
            alert("Dados importados com sucesso!");
          }
        } catch (err) { alert("Erro ao ler backup."); }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
       <div className="bg-white dark:bg-slate-900 p-12 rounded-[60px] border dark:border-slate-800 shadow-2xl text-center space-y-8">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-[40px] flex items-center justify-center mx-auto">
             <RefreshCw size={48} className="animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Dados & Segurança</h2>
            <p className="text-slate-400 font-bold mt-2">Sua base de dados está armazenada localmente para máxima privacidade.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <button onClick={() => onExport('json')} className="group p-8 bg-white dark:bg-slate-800 rounded-[45px] border dark:border-slate-700 hover:scale-105 hover:shadow-2xl transition-all text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-indigo-50 text-indigo-600"><FileJson size={28} /></div>
                <h4 className="text-[11px] font-black uppercase dark:text-white">Backup JSON</h4>
                <p className="text-[9px] font-bold text-slate-400">Dados estruturados</p>
             </button>
             <button onClick={() => onExport('csv')} className="group p-8 bg-white dark:bg-slate-800 rounded-[45px] border dark:border-slate-700 hover:scale-105 hover:shadow-2xl transition-all text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-emerald-50 text-emerald-600"><FileSpreadsheet size={28} /></div>
                <h4 className="text-[11px] font-black uppercase dark:text-white">Relatório CSV</h4>
                <p className="text-[9px] font-bold text-slate-400">Excel / Planilhas</p>
             </button>
             <div onClick={() => fileInputRef.current?.click()} className="group p-8 bg-slate-50 dark:bg-slate-800 rounded-[45px] border-2 border-dashed dark:border-slate-700 hover:border-indigo-500 cursor-pointer transition-all">
                <Upload size={32} className="text-slate-300 group-hover:text-indigo-500 mx-auto mb-4" />
                <h4 className="text-[11px] font-black uppercase dark:text-white">Importar Backup</h4>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Componentes Legados Restaurados ---

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

const FormField = ({ label, name, type = "text", value, onChange, placeholder = "", options = [] }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">{label}</label>
    {type === 'checkbox' ? (
      <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all">
        <input type="checkbox" name={name} checked={!!value} onChange={onChange} className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500" />
        <span className="text-[10px] font-black dark:text-white uppercase tracking-tighter">SIM</span>
      </div>
    ) : type === 'select' ? (
      <select name={name} value={value || ''} onChange={onChange} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl outline-none text-sm font-bold dark:text-white shadow-sm transition-all focus:bg-white dark:focus:bg-slate-800">
        <option value="">Selecione...</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input 
        type={type} 
        name={name} 
        value={value || ''} 
        onChange={onChange} 
        placeholder={placeholder}
        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl outline-none text-sm font-bold dark:text-white shadow-sm transition-all focus:bg-white dark:focus:bg-slate-800" 
      />
    )}
  </div>
);

const ParentSection = ({ title, prefix, data, onChange, color }: any) => (
  <div className={`p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] space-y-4 border-l-4 ${color === 'rose' ? 'border-rose-400' : 'border-blue-400'}`}>
    <h3 className={`font-black uppercase text-[11px] tracking-widest ${color === 'rose' ? 'text-rose-500' : 'text-blue-500'}`}>{title}</h3>
    <FormField label="Nome" name={`${prefix}.name`} value={data.name} onChange={onChange} />
    <div className="grid grid-cols-2 gap-4">
      <FormField label="Idade" name={`${prefix}.age`} value={data.age} onChange={onChange} />
      <FormField label="Profissão" name={`${prefix}.profession`} value={data.profession} onChange={onChange} />
    </div>
    <FormField label="Vivo?" name={`${prefix}.isAlive`} type="checkbox" value={data.isAlive} onChange={onChange} />
    <FormField label="Qualidade da Relação" name={`${prefix}.relationship`} value={data.relationship} onChange={onChange} />
  </div>
);

const SentenceInput = ({ label, name, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      className="w-full p-3 bg-white dark:bg-slate-800 border-b-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none text-sm italic font-medium dark:text-white transition-all"
    />
  </div>
);

const PatientForm = ({ initialData, onSave, onCancel }: any) => {
  const [data, setData] = useState<Patient>(initialData || { ...INITIAL_PATIENT, id: Date.now().toString() });
  const [subTab, setSubTab] = useState('identificacao');
  const [autoSaveStatus, setAutoSaveStatus] = useState<{saving: boolean, lastTime: string | null}>({ saving: false, lastTime: null });

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoSaveStatus(prev => ({ ...prev, saving: true }));
      onSave(data, true);
      setTimeout(() => {
        setAutoSaveStatus({
          saving: false,
          lastTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
      }, 1500);
    }, 30000);
    return () => clearInterval(interval);
  }, [data, onSave]);

  const handle = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts[0] === 'sentences') {
        setData(prev => ({ ...prev, sentences: { ...prev.sentences, [parts[1]]: val } }));
      } else {
        setData(prev => ({
          ...prev,
          [parts[0]]: { ...prev[parts[0] as keyof Patient] as any, [parts[1]]: val }
        }));
      }
    } else {
      setData(prev => ({ ...prev, [name]: val }));
    }
  };

  const tabs = [
    { id: 'identificacao', icon: User, label: 'Identificação' },
    { id: 'familia', icon: Users2, label: 'Família' },
    { id: 'saude', icon: Stethoscope, label: 'Saúde' },
    { id: 'social', icon: MessageCircle, label: 'Social' },
    { id: 'queixas', icon: ClipboardList, label: 'Queixas' },
    { id: 'psicologico', icon: Zap, label: 'Psicológico' },
    { id: 'questionario', icon: HelpCircle, label: 'Questionário' },
    { id: 'frases', icon: Quote, label: 'Frases' },
    { id: 'contrato', icon: Scale, label: 'Contrato' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fade-in relative">
      <div className="absolute top-[-30px] right-8 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest transition-opacity duration-500">
        {autoSaveStatus.saving ? (
          <div className="flex items-center space-x-2 text-indigo-500 animate-pulse"><RefreshCw size={12} className="animate-spin" /><span>Auto-salvando...</span></div>
        ) : autoSaveStatus.lastTime ? (
          <div className="flex items-center space-x-2 text-emerald-500 opacity-60"><Save size={12} /><span>Salvo às {autoSaveStatus.lastTime}</span></div>
        ) : null}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[60px] shadow-3xl overflow-hidden border dark:border-slate-800">
        <div className="flex bg-slate-50 dark:bg-slate-800 p-2 overflow-x-auto no-scrollbar border-b dark:border-slate-800">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setSubTab(t.id)} className={`flex-shrink-0 flex items-center justify-center space-x-2 px-6 py-4 rounded-[30px] transition-all font-black text-[9px] uppercase tracking-widest ${subTab === t.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-indigo-500'}`}>
              <t.icon size={16} /><span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8 md:p-16 space-y-12 min-h-[500px]">
          {subTab === 'identificacao' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
              <FormField label="Nome Completo" name="name" value={data.name} onChange={handle} />
              <FormField label="Nascimento" name="birthDate" type="date" value={data.birthDate} onChange={handle} />
              <FormField label="Idade" name="age" value={data.age} onChange={handle} />
              <FormField label="WhatsApp" name="whatsapp" value={data.whatsapp} onChange={handle} />
              <FormField label="Profissão" name="profession" value={data.profession} onChange={handle} />
              <FormField label="CPF" name="cpf" value={data.cpf} onChange={handle} />
              <div className="md:col-span-3">
                 <FormField label="Endereço Completo" name="address" value={data.address} onChange={handle} />
              </div>
            </div>
          )}

          {subTab === 'familia' && (
            <div className="space-y-12 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <ParentSection title="Pai / Figura Paterna" prefix="father" data={data.father} onChange={handle} color="blue" />
                 <ParentSection title="Mãe / Figura Materna" prefix="mother" data={data.mother} onChange={handle} color="rose" />
              </div>
            </div>
          )}

          {subTab === 'social' && (
            <div className="space-y-10 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[40px] space-y-6">
                    <h4 className="flex items-center space-x-2 text-[11px] font-black uppercase text-indigo-600"><Users size={16}/><span>Interação Social</span></h4>
                    <FormField label="Amizades" name="friendships" value={data.friendships} onChange={handle} placeholder="Como são as amizades?" />
                    <FormField label="Comunicação" name="communication" value={data.communication} onChange={handle} placeholder="Facilidade de expressão?" />
                 </div>
                 <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[40px] space-y-6">
                    <h4 className="flex items-center space-x-2 text-[11px] font-black uppercase text-indigo-600"><Heart size={16}/><span>Relacionamento Amoroso</span></h4>
                    <FormField label="Status / Descrição" name="romanticRelationshipDesc" value={data.romanticRelationshipDesc} onChange={handle} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Duração" name="romanticDuration" value={data.romanticDuration} onChange={handle} />
                      <FormField label="Idade Parceiro" name="partnerAge" value={data.partnerAge} onChange={handle} />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {subTab === 'saude' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up">
              <FormField label="Problemas de Saúde?" name="healthProblem" type="checkbox" value={data.healthProblem} onChange={handle} />
              <FormField label="Usa Medicações?" name="medication" type="checkbox" value={data.medication} onChange={handle} />
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Histórico Psiquiátrico Familiar</label>
                <textarea name="familyPsychiatricHistory" value={data.familyPsychiatricHistory} onChange={handle} className="w-full mt-2 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl min-h-[120px] outline-none text-sm font-bold dark:text-white border dark:border-slate-800" />
              </div>
            </div>
          )}

          {subTab === 'psicologico' && (
             <div className="space-y-8 animate-slide-up">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] border dark:border-slate-700 space-y-6">
                   <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-widest">Exame do Estado Mental (Características)</h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {CHARACTERISTIC_OPTIONS.map(opt => (
                        <button 
                          key={opt}
                          onClick={() => {
                            const current = data.characteristics || [];
                            const next = current.includes(opt) ? current.filter(c => c !== opt) : [...current, opt];
                            setData({...data, characteristics: next});
                          }}
                          className={`p-4 rounded-2xl text-[9px] font-black uppercase transition-all border ${data.characteristics?.includes(opt) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-transparent hover:border-slate-200'}`}
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </div>
                <FormField label="Temperamento Predominante" name="temperament" value={data.temperament} onChange={handle} placeholder="Ex: Sanguíneo, Melancólico..." />
             </div>
          )}

          {subTab === 'queixas' && (
             <div className="space-y-6 animate-slide-up">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Relato da Queixa Principal</label>
                <textarea name="problemBrief" value={data.problemBrief} onChange={handle} className="w-full p-8 bg-slate-50 dark:bg-slate-900 rounded-[40px] min-h-[250px] outline-none text-sm font-bold dark:text-white border-2 border-transparent focus:border-indigo-500/20" />
             </div>
          )}

          {subTab === 'questionario' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
               <FormField label="O que gosta de fazer?" name="qWhatLikesToDo" value={data.qWhatLikesToDo} onChange={handle} />
               <FormField label="Fica bem sozinho?" name="qOkAlone" type="checkbox" value={data.qOkAlone} onChange={handle} />
               <FormField label="Fica bem em grupo?" name="qOkInGroup" type="checkbox" value={data.qOkInGroup} onChange={handle} />
               <FormField label="Relação entre os pais" name="qParentsRelation" type="select" options={['Normal', 'Difícil', 'Inexistente']} value={data.qParentsRelation} onChange={handle} />
            </div>
          )}

          {subTab === 'frases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-slide-up">
               <SentenceInput label="Eu admiro..." name="sentences.admire" value={data.sentences.admire} onChange={handle} />
               <SentenceInput label="Meus amigos..." name="sentences.friends" value={data.sentences.friends} onChange={handle} />
               <SentenceInput label="Gosto de mim quando..." name="sentences.likeMyself" value={data.sentences.likeMyself} onChange={handle} />
               <SentenceInput label="Sinto-me melhor se..." name="sentences.feelBetter" value={data.sentences.feelBetter} onChange={handle} />
               <SentenceInput label="Meus pais..." name="sentences.parents" value={data.sentences.parents} onChange={handle} />
            </div>
          )}

          {subTab === 'contrato' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
               <FormField label="Valor da Sessão (R$)" name="sessionPrice" value={data.sessionPrice} onChange={handle} placeholder="0,00" />
               <FormField label="Frequência" name="sessionFrequency" type="select" options={['diárias', 'semanais', 'quinzenais', 'mensais']} value={data.sessionFrequency} onChange={handle} />
               <FormField label="Dia/Horário Fixo" name="sessionTime" value={data.sessionTime} onChange={handle} />
               <FormField label="Data Início" name="sessionStartDate" type="date" value={data.sessionStartDate} onChange={handle} />
            </div>
          )}
        </div>

        <div className="p-10 bg-slate-50 dark:bg-slate-800 border-t dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <button onClick={onCancel} className="px-12 py-5 rounded-3xl font-black uppercase text-[10px] text-slate-400 hover:text-rose-500 tracking-widest">Cancelar</button>
          <button onClick={() => onSave(data)} className="w-full md:w-auto px-16 py-6 bg-indigo-600 text-white rounded-[40px] font-black uppercase text-[11px] shadow-2xl hover:scale-105 transition-all tracking-widest flex items-center justify-center space-x-4">
             <Save size={20} /><span>Salvar Ficha Completa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const PostItSystem = () => {
  const [notes, setNotes] = useState<any[]>(() => JSON.parse(localStorage.getItem('psi_notes') || '[]'));
  useEffect(() => localStorage.setItem('psi_notes', JSON.stringify(notes)), [notes]);
  const add = () => setNotes([...notes, { id: Date.now(), text: '', color: Math.floor(Math.random()*4) }]);
  const remove = (id: number) => setNotes(notes.filter(n => n.id !== id));

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lembretes Rápidos</h3>
        <button onClick={add} className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl hover:scale-110 transition-transform"><Plus size={20}/></button>
      </div>
      <div className="space-y-4">
        {notes.map(n => (
          <div key={n.id} className={`p-5 rounded-[30px] min-h-[120px] text-xs font-bold relative group shadow-sm transition-all hover:shadow-md ${POST_IT_COLORS[n.color]}`}>
            <textarea className="bg-transparent border-none w-full h-full focus:ring-0 placeholder:text-black/20 resize-none" value={n.text} onChange={e => setNotes(notes.map(note => note.id === n.id ? {...note, text: e.target.value} : note))} placeholder="Anotar lembrete..." />
            <button onClick={() => remove(n.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-black/5 rounded-full"><X size={12}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SessionsTab = ({ patients, sessions, setSessions }: any) => {
  const [pid, setPid] = useState('');
  const [newS, setNewS] = useState({ theme: '', obs: '', date: new Date().toISOString().split('T')[0] });
  const add = () => {
    if(!pid || !newS.theme) return;
    setSessions([...sessions, { id: Date.now().toString(), patientId: pid, ...newS }]);
    setNewS({ theme: '', obs: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
       <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-tighter">Registros de Sessão</h2>
          <select value={pid} onChange={e => setPid(e.target.value)} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase outline-none w-full md:w-64 border dark:border-slate-700">
            <option value="">Escolher Paciente...</option>
            {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
       </div>
       {pid && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-slate-800 p-10 rounded-[50px] space-y-6 shadow-xl border dark:border-slate-800">
             <FormField label="Tema Central" value={newS.theme} onChange={(e:any) => setNewS({...newS, theme: e.target.value})} />
             <textarea className="w-full p-6 bg-slate-50 dark:bg-slate-900 rounded-[30px] min-h-[200px] outline-none text-sm font-bold dark:text-white border dark:border-slate-800" value={newS.obs} onChange={(e:any) => setNewS({...newS, obs: e.target.value})} placeholder="Evolução detalhada..." />
             <button onClick={add} className="w-full py-6 bg-indigo-600 text-white rounded-[35px] font-black uppercase text-[11px] shadow-2xl">Salvar Evolução</button>
           </div>
           <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {sessions.filter((s:any) => s.patientId === pid).slice().reverse().map((s:any) => (
                <div key={s.id} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border dark:border-slate-800 hover:scale-[1.01] transition-all">
                  <div className="text-[10px] font-black text-indigo-500 uppercase mb-2">{s.date}</div>
                  <div className="text-sm font-black dark:text-white uppercase mb-4">{s.theme}</div>
                  <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{s.obs}</p>
                </div>
              ))}
           </div>
         </div>
       )}
    </div>
  );
};

const FinancialTab = ({ financials, setFinancials, patients }: any) => {
  const [entry, setEntry] = useState({ pid: '', val: '', date: new Date().toISOString().split('T')[0] });
  const add = () => {
    const p = patients.find((p:any) => p.id === entry.pid);
    if(!p || !entry.val) return;
    setFinancials([...financials, { id: Date.now().toString(), patientId: p.id, patientName: p.name, value: entry.val, date: entry.date }]);
    setEntry({ pid: '', val: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[45px] space-y-6 shadow-xl">
             <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Honorários</h3>
             <select value={entry.pid} onChange={e => setEntry({...entry, pid: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase border dark:border-slate-800">
                <option value="">Paciente...</option>
                {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
             <FormField label="Valor (R$)" value={entry.val} onChange={(e:any) => setEntry({...entry, val: e.target.value})} placeholder="0,00" />
             <button onClick={add} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase text-[10px] shadow-lg">Registrar</button>
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-10 rounded-[50px] shadow-sm overflow-x-auto border dark:border-slate-800">
             <table className="w-full text-left">
                <thead><tr className="border-b dark:border-slate-700 text-[9px] font-black uppercase text-slate-400"><th className="pb-4">Paciente</th><th className="pb-4">Data</th><th className="pb-4 text-right">Valor</th></tr></thead>
                <tbody>
                  {financials.slice().reverse().map((f:any) => (
                    <tr key={f.id} className="border-b dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-5 font-black text-xs uppercase dark:text-white">{f.patientName}</td>
                      <td className="py-5 text-[10px] text-slate-400 font-bold">{f.date}</td>
                      <td className="py-5 text-right font-black text-emerald-600 text-sm">R$ {f.value}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

const AIModal = ({ onClose, context }: any) => {
  const [messages, setMessages] = useState<Array<{ role: string, text: string, sources?: any[] }>>([{ role: 'bot', text: 'Olá! Sou o Agente PSI. Estou aqui para ajudar com análises de casos, CID-11 ou técnicas clínicas. Como posso ser útil?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input; setInput(''); setMessages(m => [...m, { role: 'user', text: txt }]);
    setLoading(true);
    try {
      const res = await askAgent(txt, context);
      setMessages(m => [...m, { role: 'bot', text: res.text, sources: res.sources }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'bot', text: "Erro ao processar. Tente novamente." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
       <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-[60px] shadow-3xl flex flex-col overflow-hidden border dark:border-slate-800 animate-scale-up">
          <div className="p-8 md:p-10 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center space-x-4"><Bot size={32} /><h2 className="font-black uppercase text-sm tracking-widest">Agente PSI</h2></div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full"><X size={24}/></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-6 md:p-8 rounded-[40px] text-xs md:text-sm font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-bl-none border dark:border-slate-700'}`}>
                   {m.text}
                 </div>
               </div>
             ))}
             {loading && <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-full w-fit text-[10px] font-black text-indigo-600 animate-pulse">Consultando...</div>}
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex space-x-4">
             <input className="flex-1 p-6 rounded-[35px] bg-slate-100 dark:bg-slate-800 dark:text-white outline-none font-bold text-sm" placeholder="Perguntar ao Agente PSI..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} />
             <button onClick={send} className="p-6 bg-indigo-600 text-white rounded-[35px] shadow-2xl"><Send size={24}/></button>
          </div>
       </div>
    </div>
  );
};
