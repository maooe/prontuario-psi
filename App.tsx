
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
  Gamepad2,
  Bird,
  Leaf
} from 'lucide-react';
import { Theme, UserProfile, Patient, SessionRecord, FinancialRecord, Child, Sibling, ParentInfo } from './types';
import { askAgent } from './services/gemini';

// --- Constantes e Configurações ---

const POST_IT_COLORS = [
  'bg-yellow-200 text-yellow-900 border-yellow-300',
  'bg-blue-200 text-blue-900 border-blue-300',
  'bg-pink-200 text-pink-900 border-pink-300',
  'bg-emerald-200 text-emerald-900 border-emerald-300'
];

const AVATAR_SEEDS = {
  plants: ['monstera', 'cactus', 'lily', 'fern', 'rose', 'succulent', 'oak'],
  animals: ['owl', 'fox', 'cat', 'dog', 'butterfly', 'lion', 'rabbit'],
  characters: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Skyler']
};

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

// --- Utilitários de Arquivo ---

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
  const rows = data.map(obj => 
    Object.values(obj).map(val => {
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    }).join(",")
  ).join("\n");
  return `${headers}\n${rows}`;
};

// --- Componentes Compartilhados ---

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

// --- Aplicação Principal ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('psi_is_logged_in') === 'true');
  const [patients, setPatients] = useState<Patient[]>(() => JSON.parse(localStorage.getItem('psi_patients') || '[]'));
  const [sessions, setSessions] = useState<SessionRecord[]>(() => JSON.parse(localStorage.getItem('psi_sessions') || '[]'));
  const [financials, setFinancials] = useState<FinancialRecord[]>(() => JSON.parse(localStorage.getItem('psi_financials') || '[]'));
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('psi_theme') as Theme) || 'light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('psi_profile') || '{"name":"Psicóloga Clínica","photo":"https://api.dicebear.com/7.x/avataaars/svg?seed=Félix&backgroundColor=f1f5f9","crp":"00/0000"}'));
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    localStorage.setItem('psi_patients', JSON.stringify(patients));
    localStorage.setItem('psi_sessions', JSON.stringify(sessions));
    localStorage.setItem('psi_financials', JSON.stringify(financials));
    localStorage.setItem('psi_profile', JSON.stringify(profile));
    localStorage.setItem('psi_theme', theme);
    document.documentElement.className = theme === 'dark' ? 'dark' : (theme === 'light' ? '' : `theme-${theme}`);
  }, [patients, sessions, financials, profile, theme]);

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
    if (type === 'json') {
      const allData = { patients, sessions, financials, profile };
      downloadFile(JSON.stringify(allData, null, 2), `backup_psi_${new Date().toLocaleDateString()}.json`, 'application/json');
    } else {
      const csv = convertToCSV(patients);
      downloadFile(csv, `pacientes_psi_${new Date().toLocaleDateString()}.csv`, 'text/csv');
    }
  };

  if (!isLoggedIn) return <SplashScreen onLogin={() => {setIsLoggedIn(true); localStorage.setItem('psi_is_logged_in', 'true');}} />;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex-col fixed h-full z-40">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30">P</div>
          <span className="text-xl font-black dark:text-white tracking-tighter uppercase">PSI ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
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
                <div className="text-[10px] font-black dark:text-white truncate uppercase tracking-tighter">{profile.name}</div>
                <div className="text-[8px] font-bold text-slate-400">CRP {profile.crp}</div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:ml-72 h-screen overflow-hidden">
        <header className="h-24 flex items-center justify-between px-6 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sistema de Prontuário</span>
               <h2 className="text-sm md:text-lg font-black dark:text-white uppercase tracking-tighter truncate max-w-[120px] md:max-w-none">
                  {activeTab === 'new-patient' ? (editingPatient ? 'Editar Prontuário' : 'Nova Anamnese') : 
                   activeTab === 'sessions' ? 'Evoluções Clínicas' :
                   activeTab === 'financial' ? 'Gestão Financeira' : 
                   activeTab === 'calendar' ? 'Agenda Semanal' : 
                   activeTab === 'profile' ? 'Configurações de Perfil' : 'Painel'}
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

        {/* Tab View */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-12">
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
                                  <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Última sessão: {p.registrationDate}</div>
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
                 {/* Mini Calendário na Home */}
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

      {/* Nav Mobile */}
      <nav className="lg:hidden h-20 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex items-center justify-around px-4 fixed bottom-0 left-0 right-0 z-40">
        <MobileNavItem icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <MobileNavItem icon={CalendarIcon} active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
        <MobileNavItem icon={PlusCircle} active={activeTab === 'new-patient'} onClick={() => setActiveTab('new-patient')} />
        <MobileNavItem icon={User} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>

      {isAIModalOpen && <AIModal onClose={() => setIsAIModalOpen(false)} context={{ patients, sessions }} />}
    </div>
  );
}

// --- Componentes de Sub-Seções ---

const ProfileEditor = ({ profile, setProfile }: any) => {
  const [activeCat, setActiveCat] = useState('characters');
  
  const updateProfile = (field: string, val: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: val }));
  };

  const getUrl = (cat: string, seed: string) => {
    let style = 'avataaars';
    if (cat === 'plants') style = 'bottts'; // Estilo robótico que parece flores/plantas com cores certas
    if (cat === 'animals') style = 'adventurer'; // Estilo aventura com elementos de natureza/animais
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=f1f5f9`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24">
       <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[60px] border dark:border-slate-800 shadow-2xl space-y-12">
          <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
             <div className="relative group">
                <div className="w-44 h-44 bg-slate-50 dark:bg-slate-800 rounded-[50px] border-4 border-indigo-100 dark:border-indigo-900 overflow-hidden flex items-center justify-center p-3">
                   <img src={profile.photo} className="w-full h-full object-contain bg-white rounded-[40px]" alt="avatar" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl">
                   <Camera size={20} />
                </div>
             </div>
             <div className="flex-1 space-y-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Nome da Psicóloga</label>
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-bold dark:text-white transition-all shadow-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Registro / CRP</label>
                      <input 
                        type="text" 
                        value={profile.crp} 
                        onChange={(e) => updateProfile('crp', e.target.value)}
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-bold dark:text-white transition-all shadow-sm"
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between border-b dark:border-slate-800 pb-6 gap-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tighter">Galeria de Identidade</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Escolha um avatar que combine com seu consultório</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                   {[
                     { id: 'characters', icon: User, label: 'Personagens' },
                     { id: 'plants', icon: Leaf, label: 'Botânico' },
                     { id: 'animals', icon: Bird, label: 'Fauna' }
                   ].map(cat => (
                     <button 
                       key={cat.id} 
                       onClick={() => setActiveCat(cat.id)}
                       className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${activeCat === cat.id ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       <cat.icon size={14} />
                       <span className="hidden sm:inline">{cat.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-4 md:grid-cols-7 gap-5">
                {AVATAR_SEEDS[activeCat as keyof typeof AVATAR_SEEDS].map(seed => {
                  const url = getUrl(activeCat, seed);
                  const isSelected = profile.photo === url;
                  return (
                    <button 
                      key={seed}
                      onClick={() => updateProfile('photo', url)}
                      className={`relative aspect-square p-2 bg-slate-50 dark:bg-slate-800 rounded-3xl border-4 transition-all hover:scale-110 active:scale-95 ${isSelected ? 'border-indigo-600 bg-white shadow-xl' : 'border-transparent'}`}
                    >
                       <img src={url} className="w-full h-full object-contain" alt={seed} />
                       {isSelected && (
                         <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                            <CheckCircle2 size={14} />
                         </div>
                       )}
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="pt-8 flex justify-center">
             <button 
                onClick={() => alert("Configurações atualizadas com sucesso!")}
                className="px-14 py-6 bg-emerald-600 text-white rounded-[40px] font-black uppercase text-[11px] shadow-2xl hover:scale-105 transition-all flex items-center space-x-3 tracking-widest"
             >
                <Save size={20} />
                <span>Salvar Perfil</span>
             </button>
          </div>
       </div>
    </div>
  );
};

const CalendarFull = ({ sessions, patients, onAddSession }: any) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in pb-24">
       <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[60px] border dark:border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
             <h2 className="text-2xl font-black uppercase tracking-tighter">Agenda Semanal</h2>
             <button onClick={() => setIsAdding(true)} className="w-full md:w-auto flex items-center justify-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-3xl text-[10px] font-black shadow-lg hover:scale-105 transition-all uppercase tracking-widest">
                <Plus size={18}/><span>Novo Agendamento</span>
             </button>
          </div>
          <div className="grid grid-cols-7 gap-4">
             {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
               <div key={d} className="space-y-4">
                 <div className="text-[10px] font-black uppercase text-slate-400 text-center pb-4 border-b dark:border-slate-800">{d}</div>
                 <div className="min-h-[450px] bg-slate-50/50 dark:bg-slate-800/20 rounded-[35px] p-2 space-y-3">
                    {sessions.map((s:any) => (
                      <div key={s.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-l-4 border-indigo-500 group relative hover:shadow-md transition-all">
                         <div className="text-[8px] font-black uppercase text-indigo-500 mb-1">{s.time || '08:00'}</div>
                         <div className="text-[9px] font-bold dark:text-white truncate uppercase">{patients.find((p:any) => p.id === s.patientId)?.name || 'Paciente'}</div>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </div>
       </div>
       <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border dark:border-slate-800 shadow-sm space-y-6">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center space-x-2">
                <CalendarIcon size={14}/><span>Integração Google</span>
             </h3>
             <button 
                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-slate-100 hover:bg-slate-50 p-5 rounded-3xl transition-all shadow-sm"
                onClick={async () => {
                  try { await window.aistudio.openSelectKey(); } catch(e) { console.error(e); }
                }}
             >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="G" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Sincronizar Agenda</span>
             </button>
             <p className="text-[9px] font-bold text-slate-400 leading-relaxed text-center italic">Conecte sua conta Google para sincronizar horários e enviar lembretes automáticos.</p>
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
          if (confirm("ATENÇÃO: Isso substituirá todos os dados locais. Deseja prosseguir com a importação?")) {
            onImport(json);
            alert("Sincronização concluída com sucesso!");
          }
        } catch (err) { alert("Arquivo inválido. Certifique-se de usar um backup JSON gerado pelo sistema."); }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-24">
       <div className="bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[70px] border dark:border-slate-800 shadow-2xl text-center space-y-10">
          <div className="w-28 h-28 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[45px] flex items-center justify-center mx-auto shadow-inner">
             <RefreshCw size={54} className="animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Gestão de Dados & Segurança</h2>
            <p className="text-slate-400 font-bold max-w-lg mx-auto leading-relaxed">Seus dados são privados e ficam salvos apenas no seu navegador. Recomendamos exportar um backup regularmente.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
             <button onClick={() => onExport('json')} className="group p-10 bg-white dark:bg-slate-800 rounded-[50px] border dark:border-slate-700 hover:scale-105 hover:shadow-3xl transition-all text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><FileJson size={32} /></div>
                <h4 className="text-[12px] font-black uppercase dark:text-white">Backup JSON</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dados completos</p>
             </button>
             <button onClick={() => onExport('csv')} className="group p-10 bg-white dark:bg-slate-800 rounded-[50px] border dark:border-slate-700 hover:scale-105 hover:shadow-3xl transition-all text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><FileSpreadsheet size={32} /></div>
                <h4 className="text-[12px] font-black uppercase dark:text-white">Exportar CSV</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Planilha Excel</p>
             </button>
             <div onClick={() => fileInputRef.current?.click()} className="group p-10 bg-slate-100 dark:bg-slate-800 rounded-[50px] border-4 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 cursor-pointer transition-all flex flex-col items-center justify-center">
                <Upload size={36} className="text-slate-300 group-hover:text-indigo-500 mb-5" />
                <h4 className="text-[12px] font-black uppercase dark:text-white">Restaurar</h4>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Componentes Menores e Auxiliares ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-5 rounded-[30px] transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-105' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'}`}>
    <Icon size={22} /><span className="font-black text-[11px] uppercase tracking-widest">{label}</span>
  </button>
);

const MobileNavItem = ({ icon: Icon, active, onClick }: any) => (
  <button onClick={onClick} className={`p-4 rounded-3xl transition-all ${active ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'text-slate-400'}`}>
    <Icon size={26} />
  </button>
);

const MiniCalendar = ({ sessions, patients }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] border dark:border-slate-800 shadow-sm space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Atendimentos Agendados</h3>
        <div className="flex items-center space-x-3">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"><ChevronLeft size={18}/></button>
          <span className="text-[11px] font-black uppercase tracking-tighter">{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"><ChevronRight size={18}/></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3 text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => <div key={d} className="text-[9px] font-black text-slate-300 uppercase">{d}</div>)}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasSession = sessions.some((s:any) => {
            const d = new Date(s.date);
            return d.getDate() === day && d.getMonth() === currentDate.getMonth();
          });
          return (
            <div key={day} className={`aspect-square flex items-center justify-center text-[11px] font-black rounded-2xl transition-all ${hasSession ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100 dark:ring-indigo-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}>
              {day}
            </div>
          );
        })}
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
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border dark:border-slate-800 shadow-sm space-y-8 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Bloco de Notas</h3>
        <button onClick={add} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl hover:scale-110 transition-transform shadow-sm"><Plus size={20}/></button>
      </div>
      <div className="space-y-5 overflow-y-auto max-h-[500px] no-scrollbar">
        {notes.map(n => (
          <div key={n.id} className={`p-6 rounded-[35px] min-h-[140px] text-xs font-bold relative group shadow-sm transition-all hover:shadow-md hover:-rotate-1 ${POST_IT_COLORS[n.color]}`}>
            <textarea className="bg-transparent border-none w-full h-full focus:ring-0 placeholder:text-black/10 resize-none font-medium leading-relaxed" value={n.text} onChange={e => setNotes(notes.map(note => note.id === n.id ? {...note, text: e.target.value} : note))} placeholder="Digite seu lembrete..." />
            <button onClick={() => remove(n.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-all"><X size={14}/></button>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="py-20 text-center border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[40px]">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sem anotações</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SplashScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
    <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
         <BrainCircuit size={220} className="text-indigo-500 animate-pulse" />
      </div>
      <div className="grid grid-cols-6 grid-rows-6 gap-2 w-48 h-40 relative">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="bg-indigo-400 rounded-full w-2.5 h-2.5 animate-bounce" style={{ animationDelay: `${Math.random() * 2}s` }} />
        ))}
      </div>
    </div>
    <div className="text-center space-y-6 max-w-md">
      <h1 className="text-5xl font-black text-white uppercase tracking-tighter">PSI <span className="text-indigo-500">ADMIN</span></h1>
      <p className="text-slate-400 text-sm font-medium uppercase tracking-widest leading-relaxed">Gestão Inteligente & Prontuário Ético</p>
      <button onClick={onLogin} className="w-full flex items-center justify-center space-x-4 bg-white hover:bg-slate-100 text-slate-900 px-8 py-5 rounded-[30px] font-black transition-all shadow-2xl active:scale-95">
        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="G" />
        <span className="uppercase tracking-widest text-[11px]">Entrar no Consultório</span>
      </button>
    </div>
  </div>
);

// --- Componentes Legados Restaurados (Formulários) ---

const FormField = ({ label, name, type = "text", value, onChange, placeholder = "", options = [] }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">{label}</label>
    {type === 'checkbox' ? (
      <div className="flex items-center space-x-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-800 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
        <input type="checkbox" name={name} checked={!!value} onChange={onChange} className="w-6 h-6 rounded-xl text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700" />
        <span className="text-[11px] font-black dark:text-white uppercase tracking-tighter">SIM</span>
      </div>
    ) : type === 'select' ? (
      <select name={name} value={value || ''} onChange={onChange} className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none text-sm font-bold dark:text-white shadow-sm transition-all focus:bg-white dark:focus:bg-slate-800">
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
        className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none text-sm font-bold dark:text-white shadow-sm transition-all focus:bg-white dark:focus:bg-slate-800" 
      />
    )}
  </div>
);

const ParentSection = ({ title, prefix, data, onChange, color }: any) => (
  <div className={`p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[50px] space-y-6 border-l-8 ${color === 'rose' ? 'border-rose-400' : 'border-blue-400'} shadow-sm`}>
    <h3 className={`font-black uppercase text-[12px] tracking-widest ${color === 'rose' ? 'text-rose-500' : 'text-blue-500'}`}>{title}</h3>
    <FormField label="Nome Completo" name={`${prefix}.name`} value={data.name} onChange={onChange} />
    <div className="grid grid-cols-2 gap-6">
      <FormField label="Idade" name={`${prefix}.age`} value={data.age} onChange={onChange} />
      <FormField label="Profissão" name={`${prefix}.profession`} value={data.profession} onChange={onChange} />
    </div>
    <div className="grid grid-cols-2 gap-6">
      <FormField label="Está Vivo?" name={`${prefix}.isAlive`} type="checkbox" value={data.isAlive} onChange={onChange} />
      <FormField label="Qualidade da Relação" name={`${prefix}.relationship`} value={data.relationship} onChange={onChange} />
    </div>
  </div>
);

const SentenceInput = ({ label, name, value, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      className="w-full p-4 bg-white dark:bg-slate-800 border-b-4 border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none text-sm italic font-semibold dark:text-white transition-all"
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
      <div className="absolute top-[-40px] right-8 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest transition-opacity duration-500">
        {autoSaveStatus.saving ? (
          <div className="flex items-center space-x-2 text-indigo-500 animate-pulse"><RefreshCw size={14} className="animate-spin" /><span>Sincronizando...</span></div>
        ) : autoSaveStatus.lastTime ? (
          <div className="flex items-center space-x-2 text-emerald-500 opacity-70"><CheckCircle2 size={14} /><span>Backup em {autoSaveStatus.lastTime}</span></div>
        ) : null}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[70px] shadow-3xl overflow-hidden border dark:border-slate-800">
        <div className="flex bg-slate-50 dark:bg-slate-800 p-3 overflow-x-auto no-scrollbar border-b dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setSubTab(t.id)} className={`flex-shrink-0 flex items-center justify-center space-x-3 px-8 py-5 rounded-[35px] transition-all font-black text-[10px] uppercase tracking-widest ${subTab === t.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-700'}`}>
              <t.icon size={18} /><span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-10 md:p-20 space-y-16 min-h-[600px]">
          {subTab === 'identificacao' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-slide-up">
              <FormField label="Nome Completo" name="name" value={data.name} onChange={handle} />
              <FormField label="Nascimento" name="birthDate" type="date" value={data.birthDate} onChange={handle} />
              <FormField label="Idade Atual" name="age" value={data.age} onChange={handle} />
              <FormField label="WhatsApp Contato" name="whatsapp" value={data.whatsapp} onChange={handle} />
              <FormField label="Ocupação / Profissão" name="profession" value={data.profession} onChange={handle} />
              <FormField label="CPF" name="cpf" value={data.cpf} onChange={handle} />
              <div className="md:col-span-3">
                 <FormField label="Logradouro Completo" name="address" value={data.address} onChange={handle} />
              </div>
            </div>
          )}

          {subTab === 'familia' && (
            <div className="space-y-12 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <ParentSection title="Pai ou Referência Paterna" prefix="father" data={data.father} onChange={handle} color="blue" />
                 <ParentSection title="Mãe ou Referência Materna" prefix="mother" data={data.mother} onChange={handle} color="rose" />
              </div>
            </div>
          )}

          {subTab === 'social' && (
            <div className="space-y-12 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="p-10 bg-slate-50 dark:bg-slate-800/40 rounded-[50px] space-y-8 shadow-inner">
                    <h4 className="flex items-center space-x-3 text-[12px] font-black uppercase text-indigo-600 tracking-widest"><Users size={20}/><span>Círculo Social</span></h4>
                    <FormField label="Relacionamento com Amigos" name="friendships" value={data.friendships} onChange={handle} placeholder="Descreva o convívio social..." />
                    <FormField label="Expressividade & Comunicação" name="communication" value={data.communication} onChange={handle} />
                 </div>
                 <div className="p-10 bg-slate-50 dark:bg-slate-800/40 rounded-[50px] space-y-8 shadow-inner">
                    <h4 className="flex items-center space-x-3 text-[12px] font-black uppercase text-indigo-600 tracking-widest"><Heart size={20}/><span>Afetividade / Amoroso</span></h4>
                    <FormField label="Estado Civil / Descritivo" name="romanticRelationshipDesc" value={data.romanticRelationshipDesc} onChange={handle} />
                    <div className="grid grid-cols-2 gap-6">
                      <FormField label="Tempo de União" name="romanticDuration" value={data.romanticDuration} onChange={handle} />
                      <FormField label="Idade Parceiro(a)" name="partnerAge" value={data.partnerAge} onChange={handle} />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {subTab === 'saude' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-slide-up">
              <FormField label="Problemas Físicos?" name="healthProblem" type="checkbox" value={data.healthProblem} onChange={handle} />
              <FormField label="Uso de Medicamentos?" name="medication" type="checkbox" value={data.medication} onChange={handle} />
              <div className="md:col-span-2 space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-3 tracking-widest">Antecedentes Psiquiátricos na Família</label>
                <textarea name="familyPsychiatricHistory" value={data.familyPsychiatricHistory} onChange={handle} className="w-full p-8 bg-slate-50 dark:bg-slate-900 rounded-[40px] min-h-[150px] outline-none text-sm font-bold dark:text-white border-4 border-transparent focus:border-indigo-500/10 shadow-inner" placeholder="Relate histórico relevante..." />
              </div>
            </div>
          )}

          {subTab === 'psicologico' && (
             <div className="space-y-12 animate-slide-up">
                <div className="p-10 bg-white dark:bg-slate-800 rounded-[50px] border dark:border-slate-700 space-y-8 shadow-lg">
                   <h4 className="text-[12px] font-black uppercase text-indigo-600 tracking-widest flex items-center space-x-3"><Zap size={20} /><span>Exame do Estado Mental</span></h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {CHARACTERISTIC_OPTIONS.map(opt => {
                        const isSelected = data.characteristics?.includes(opt);
                        return (
                          <button 
                            key={opt}
                            onClick={() => {
                              const current = data.characteristics || [];
                              const next = current.includes(opt) ? current.filter(c => c !== opt) : [...current, opt];
                              setData({...data, characteristics: next});
                            }}
                            className={`p-5 rounded-[25px] text-[10px] font-black uppercase transition-all border-4 ${isSelected ? 'bg-indigo-600 text-white border-indigo-200 shadow-xl scale-105' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-transparent hover:border-slate-200'}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                   </div>
                </div>
                <FormField label="Temperamento Predominante (Auto-relato)" name="temperament" value={data.temperament} onChange={handle} placeholder="Ex: Melancólico, Explosivo, etc..." />
             </div>
          )}

          {subTab === 'queixas' && (
             <div className="space-y-8 animate-slide-up">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-4 tracking-widest">Descritivo da Queixa Principal</label>
                <textarea name="problemBrief" value={data.problemBrief} onChange={handle} className="w-full p-10 bg-slate-50 dark:bg-slate-900 rounded-[50px] min-h-[300px] outline-none text-sm font-bold dark:text-white border-4 border-transparent focus:border-indigo-500/10 shadow-inner leading-relaxed" placeholder="Como o paciente descreve sua dor?" />
             </div>
          )}

          {subTab === 'questionario' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up">
               <FormField label="Habilidades / Lazer" name="qWhatLikesToDo" value={data.qWhatLikesToDo} onChange={handle} />
               <FormField label="Tolerância ao Isolamento" name="qOkAlone" type="checkbox" value={data.qOkAlone} onChange={handle} />
               <FormField label="Tolerância em Grupo" name="qOkInGroup" type="checkbox" value={data.qOkInGroup} onChange={handle} />
               <FormField label="Dinâmica entre Pais" name="qParentsRelation" type="select" options={['Normal', 'Conflituosa', 'Nula']} value={data.qParentsRelation} onChange={handle} />
            </div>
          )}

          {subTab === 'frases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10 animate-slide-up">
               <SentenceInput label="Eu admiro profundamente..." name="sentences.admire" value={data.sentences.admire} onChange={handle} />
               <SentenceInput label="Meus amigos são..." name="sentences.friends" value={data.sentences.friends} onChange={handle} />
               <SentenceInput label="Gosto de mim quando..." name="sentences.likeMyself" value={data.sentences.likeMyself} onChange={handle} />
               <SentenceInput label="Sinto-me melhor quando..." name="sentences.feelBetter" value={data.sentences.feelBetter} onChange={handle} />
               <SentenceInput label="Meus pais para mim..." name="sentences.parents" value={data.sentences.parents} onChange={handle} />
            </div>
          )}

          {subTab === 'contrato' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up">
               <FormField label="Valor Acordado (R$)" name="sessionPrice" value={data.sessionPrice} onChange={handle} placeholder="000,00" />
               <FormField label="Frequência Base" name="sessionFrequency" type="select" options={['semanais', 'quinzenais', 'mensais', 'pontuais']} value={data.sessionFrequency} onChange={handle} />
               <FormField label="Horário de Atendimento" name="sessionTime" value={data.sessionTime} onChange={handle} placeholder="Ex: Terças às 14h" />
               <FormField label="Início do Vínculo" name="sessionStartDate" type="date" value={data.sessionStartDate} onChange={handle} />
            </div>
          )}
        </div>

        <div className="p-12 bg-slate-50 dark:bg-slate-800 border-t dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <button onClick={onCancel} className="px-14 py-6 rounded-[35px] font-black uppercase text-[11px] text-slate-400 hover:text-rose-500 tracking-widest transition-all">Descartar Alterações</button>
          <button onClick={() => onSave(data)} className="w-full md:w-auto px-20 py-7 bg-indigo-600 text-white rounded-[45px] font-black uppercase text-[12px] shadow-2xl hover:scale-105 transition-all tracking-widest flex items-center justify-center space-x-4">
             <Save size={24} /><span>Confirmar Prontuário</span>
          </button>
        </div>
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
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
       <div className="bg-white dark:bg-slate-800 p-10 rounded-[50px] flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Histórico de Evoluções</h2>
          <select value={pid} onChange={e => setPid(e.target.value)} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl text-[11px] font-black uppercase outline-none w-full md:w-72 border-2 border-transparent focus:border-indigo-500 transition-all">
            <option value="">Selecione o Paciente...</option>
            {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
       </div>
       {pid && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="bg-white dark:bg-slate-800 p-12 rounded-[60px] space-y-8 shadow-xl border dark:border-slate-800">
             <FormField label="Tema da Sessão" value={newS.theme} onChange={(e:any) => setNewS({...newS, theme: e.target.value})} />
             <textarea className="w-full p-8 bg-slate-50 dark:bg-slate-900 rounded-[40px] min-h-[250px] outline-none text-sm font-bold dark:text-white border-2 border-transparent focus:border-indigo-500 transition-all leading-relaxed" value={newS.obs} onChange={(e:any) => setNewS({...newS, obs: e.target.value})} placeholder="Escreva a evolução clínica..." />
             <button onClick={add} className="w-full py-7 bg-indigo-600 text-white rounded-[40px] font-black uppercase text-[12px] shadow-2xl tracking-widest hover:scale-105 transition-all">Registrar Evolução</button>
           </div>
           <div className="space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar pr-2">
              {sessions.filter((s:any) => s.patientId === pid).slice().reverse().map((s:any) => (
                <div key={s.id} className="bg-white dark:bg-slate-800 p-10 rounded-[50px] border dark:border-slate-800 hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[11px] font-black text-indigo-500 uppercase">{s.date}</div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                  <div className="text-base font-black dark:text-white uppercase mb-4 tracking-tight">{s.theme}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed italic">{s.obs}</p>
                </div>
              ))}
              {sessions.filter((s:any) => s.patientId === pid).length === 0 && (
                <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Nenhum registro para este paciente</div>
              )}
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
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="bg-white dark:bg-slate-800 p-12 rounded-[60px] space-y-8 shadow-xl">
             <h3 className="text-[12px] font-black uppercase text-indigo-600 tracking-widest flex items-center space-x-2"><DollarSign size={16}/><span>Honorários</span></h3>
             <select value={entry.pid} onChange={e => setEntry({...entry, pid: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl text-[11px] font-black uppercase border-2 border-transparent focus:border-indigo-500">
                <option value="">Paciente...</option>
                {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
             <FormField label="Valor Recebido" value={entry.val} onChange={(e:any) => setEntry({...entry, val: e.target.value})} placeholder="00,00" />
             <button onClick={add} className="w-full py-6 bg-emerald-600 text-white rounded-[35px] font-black uppercase text-[11px] shadow-lg tracking-widest hover:scale-105 transition-all">Salvar Entrada</button>
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-12 rounded-[60px] shadow-sm overflow-x-auto border dark:border-slate-800">
             <table className="w-full text-left">
                <thead><tr className="border-b-2 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400"><th className="pb-6">Identificação</th><th className="pb-6">Data de Liquidação</th><th className="pb-6 text-right">Valor Final</th></tr></thead>
                <tbody>
                  {financials.slice().reverse().map((f:any) => (
                    <tr key={f.id} className="border-b dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-6 font-black text-xs uppercase dark:text-white">{f.patientName}</td>
                      <td className="py-6 text-[11px] text-slate-400 font-bold uppercase">{f.date}</td>
                      <td className="py-6 text-right font-black text-emerald-600 text-base">R$ {f.value}</td>
                    </tr>
                  ))}
                  {financials.length === 0 && (
                    <tr><td colSpan={3} className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Nenhum registro financeiro</td></tr>
                  )}
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
      setMessages(m => [...m, { role: 'bot', text: "Erro na conexão. Verifique sua chave de API ou conexão." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
       <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-[70px] shadow-3xl flex flex-col overflow-hidden border dark:border-slate-800 animate-scale-up">
          <div className="p-10 md:p-12 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center space-x-5"><Bot size={36} /><h2 className="font-black uppercase text-base tracking-widest">Agente PSI Inteligente</h2></div>
            <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-full transition-all"><X size={28}/></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 md:p-14 space-y-10 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-8 md:p-10 rounded-[50px] text-xs md:text-sm font-semibold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-bl-none border dark:border-slate-700'}`}>
                   {m.text}
                 </div>
               </div>
             ))}
             {loading && <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-full w-fit text-[11px] font-black text-indigo-600 animate-pulse uppercase tracking-widest">Processando Resposta...</div>}
          </div>
          <div className="p-10 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex space-x-6">
             <input className="flex-1 p-7 rounded-[40px] bg-slate-100 dark:bg-slate-800 dark:text-white outline-none font-bold text-sm shadow-inner" placeholder="Qual sua dúvida clínica hoje? (Ex: Critérios do TDAH no CID-11)" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} />
             <button onClick={send} className="p-7 bg-indigo-600 text-white rounded-[40px] shadow-2xl hover:scale-105 active:scale-95 transition-all"><Send size={28}/></button>
          </div>
       </div>
    </div>
  );
};
