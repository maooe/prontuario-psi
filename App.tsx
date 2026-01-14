
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Link2,
  Stethoscope,
  Users2,
  ClipboardList
} from 'lucide-react';
import { Theme, UserProfile, Patient, SessionRecord, FinancialRecord, Child, Sibling, ParentInfo } from './types';
import { askAgent } from './services/gemini';

// --- Constants & Defaults ---

const POST_IT_COLORS = [
  'bg-yellow-200 text-yellow-900 border-yellow-300',
  'bg-blue-200 text-blue-900 border-blue-300',
  'bg-pink-200 text-pink-900 border-pink-300',
  'bg-emerald-200 text-emerald-900 border-emerald-300'
];

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

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('psi_is_logged_in') === 'true');
  const [patients, setPatients] = useState<Patient[]>(() => JSON.parse(localStorage.getItem('psi_patients') || '[]'));
  const [sessions, setSessions] = useState<SessionRecord[]>(() => JSON.parse(localStorage.getItem('psi_sessions') || '[]'));
  const [financials, setFinancials] = useState<FinancialRecord[]>(() => JSON.parse(localStorage.getItem('psi_financials') || '[]'));
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('psi_theme') as Theme) || 'light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('psi_profile') || '{"name":"Psicólogo(a)","photo":"https://api.dicebear.com/7.x/avataaars/svg?seed=user_psi","crp":"00/0000"}'));
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

  const handleSavePatient = (p: Patient) => {
    setPatients(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) {
        return prev.map(item => item.id === p.id ? { ...item, ...p } : item);
      }
      return [...prev, p];
    });
    setEditingPatient(null);
    setActiveTab('dashboard');
  };

  const handleEditPatient = (p: Patient) => {
    setEditingPatient(p);
    setActiveTab('new-patient');
  };

  const deletePatient = (id: string) => {
    if(window.confirm("Tem certeza que deseja excluir permanentemente este paciente e todo o seu histórico?")) {
      setPatients(prev => prev.filter(p => p.id !== id));
      setSessions(prev => prev.filter(s => s.patientId !== id));
      setFinancials(prev => prev.filter(f => f.patientId !== id));
      setActiveTab('dashboard');
    }
  };

  if (!isLoggedIn) return <SplashScreen onLogin={() => {setIsLoggedIn(true); localStorage.setItem('psi_is_logged_in', 'true');}} />;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <aside className="w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col fixed h-full z-40">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30">P</div>
          <span className="text-xl font-black dark:text-white tracking-tighter uppercase">PSI ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={PlusCircle} label="Novo Prontuário" active={activeTab === 'new-patient'} onClick={() => { setEditingPatient(null); setActiveTab('new-patient'); }} />
          <SidebarItem icon={Users} label="Evoluções" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
          <SidebarItem icon={DollarSign} label="Financeiro" active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} />
        </nav>
        <div className="p-6 border-t dark:border-slate-800">
           <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
             <img src={profile.photo} className="w-10 h-10 rounded-xl border border-indigo-500" />
             <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-black dark:text-white truncate uppercase">{profile.name}</div>
                <div className="text-[8px] font-bold text-slate-400">CRP {profile.crp}</div>
             </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col ml-72 h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30">
          <div className="flex flex-col">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Painel de Controle</span>
             <h2 className="text-lg font-black dark:text-white uppercase tracking-tighter">
                {activeTab === 'new-patient' ? (editingPatient ? 'Editar Paciente' : 'Cadastro de Anamnese') : 
                 activeTab === 'sessions' ? 'Histórico de Atendimentos' :
                 activeTab === 'financial' ? 'Fluxo de Caixa' : 'Dashboard'}
             </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsAIModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
              <Bot size={18} /><span>AGENTE PSI IA</span>
            </button>
            
            <div className="relative">
              <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white hover:bg-slate-200 transition-all border dark:border-slate-700">
                <Palette size={20}/>
              </button>
              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border dark:border-slate-700 p-2 z-50 animate-scale-up">
                  {['light', 'dark', 'rose', 'retro', 'pride', 'bw', 'glass'].map((t) => (
                    <button key={t} onClick={() => { setTheme(t as Theme); setIsThemeMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all ${theme === t ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500'}`}>
                      {t === 'light' ? '⚪ Claro' : t === 'dark' ? '⚫ Escuro' : t === 'rose' ? '🌸 Rose Gold' : t === 'retro' ? '🕹️ Vaporwave' : t === 'pride' ? '🌈 Pride' : t === 'bw' ? '⬜ P&B' : '💎 Glass'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 space-y-8">
                 <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border dark:border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Base de Pacientes ({patients.length})</h3>
                        <button onClick={() => setActiveTab('new-patient')} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Ver Todos</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {patients.slice().reverse().map(p => (
                         <div key={p.id} className="group relative">
                            <div onClick={() => handleEditPatient(p)} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-[35px] border dark:border-slate-700 hover:border-indigo-500 cursor-pointer transition-all flex items-center space-x-4 shadow-sm hover:shadow-md">
                               <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center text-xl font-black">{p.name[0]}</div>
                               <div className="flex-1 overflow-hidden">
                                  <div className="font-black text-sm dark:text-white truncate uppercase tracking-tight">{p.name}</div>
                                  <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Entrada: {p.registrationDate}</div>
                               </div>
                               <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); deletePatient(p.id); }} className="absolute -top-2 -right-2 p-2 bg-white dark:bg-slate-700 text-rose-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all border dark:border-slate-600">
                               <Trash2 size={14} />
                            </button>
                         </div>
                       ))}
                       {patients.length === 0 && (
                         <div className="col-span-2 py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300"><Users size={40}/></div>
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Nenhum registro encontrado.</div>
                            <button onClick={() => setActiveTab('new-patient')} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black">COMEÇAR AGORA</button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
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
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-[25px] transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-105' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'}`}>
    <Icon size={20} /><span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
  </button>
);

const PostItSystem = () => {
  const [notes, setNotes] = useState<any[]>(() => JSON.parse(localStorage.getItem('psi_notes') || '[]'));
  useEffect(() => localStorage.setItem('psi_notes', JSON.stringify(notes)), [notes]);
  const add = () => setNotes([...notes, { id: Date.now(), text: '', color: Math.floor(Math.random()*4) }]);
  const remove = (id: number) => setNotes(notes.filter(n => n.id !== id));

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bloco de Notas</h3>
        <button onClick={add} className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl hover:scale-110 transition-transform"><PlusCircle size={20}/></button>
      </div>
      <div className="space-y-4">
        {notes.map(n => (
          <div key={n.id} className={`p-5 rounded-[30px] min-h-[100px] text-xs font-bold relative group shadow-sm transition-all hover:shadow-md ${POST_IT_COLORS[n.color]}`}>
            <textarea className="bg-transparent border-none w-full h-full focus:ring-0 placeholder:text-black/20 resize-none custom-scrollbar" value={n.text} onChange={e => setNotes(notes.map(note => note.id === n.id ? {...note, text: e.target.value} : note))} placeholder="Anotação rápida..." />
            <button onClick={() => remove(n.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-black/5 rounded-full hover:bg-black/10"><X size={12}/></button>
          </div>
        ))}
        {notes.length === 0 && <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[35px] text-[10px] font-black text-slate-300 uppercase">Lista vazia.</div>}
      </div>
    </div>
  );
};

const PatientForm = ({ initialData, onSave, onCancel }: any) => {
  const [data, setData] = useState<Patient>(initialData || { ...INITIAL_PATIENT, id: Date.now().toString() });
  const [subTab, setSubTab] = useState('pessoal');

  const handle = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof Patient] as any, [child]: val }
      }));
    } else {
      setData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleSentence = (field: string, val: string) => {
    setData(prev => ({
      ...prev,
      sentences: { ...prev.sentences, [field]: val }
    }));
  };

  const tabs = [
    { id: 'pessoal', icon: User, label: 'Identificação' },
    { id: 'familiar', icon: Users2, label: 'Estrutura Familiar' },
    { id: 'historico', icon: Stethoscope, label: 'Saúde & Hábitos' },
    { id: 'problemas', icon: ClipboardList, label: 'Queixas Atuais' },
    { id: 'frases', icon: Quote, label: 'Teste de Frases' }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-[60px] shadow-2xl overflow-hidden border dark:border-slate-800">
        <div className="flex bg-slate-50 dark:bg-slate-800 p-3 overflow-x-auto no-scrollbar border-b dark:border-slate-800">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setSubTab(t.id)} className={`flex-1 min-w-[140px] flex items-center justify-center space-x-3 py-5 rounded-[30px] transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${subTab === t.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
              <t.icon size={18} /><span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-10 md:p-16 space-y-12">
          {subTab === 'pessoal' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
              <div className="md:col-span-3 pb-4 border-b dark:border-slate-800 flex items-center space-x-3"><User className="text-indigo-600" size={16}/><h3 className="font-black text-indigo-600 text-[11px] uppercase tracking-widest">Informações Pessoais</h3></div>
              <FormField label="Nome Completo" name="name" value={data.name} onChange={handle} />
              <FormField label="Data Nascimento" name="birthDate" type="date" value={data.birthDate} onChange={handle} />
              <FormField label="Idade Atual" name="age" value={data.age} onChange={handle} />
              <FormField label="CPF" name="cpf" value={data.cpf} onChange={handle} />
              <FormField label="WhatsApp / Celular" name="whatsapp" value={data.whatsapp} onChange={handle} />
              <FormField label="E-mail" name="email" type="email" value={data.email} onChange={handle} />
              <FormField label="Profissão" name="profession" value={data.profession} onChange={handle} />
              <FormField label="Grau Escolaridade" name="education" value={data.education} onChange={handle} />
              <FormField label="Estado Civil" name="maritalStatus" value={data.maritalStatus} onChange={handle} />
              <div className="md:col-span-3 mt-4 pb-4 border-b dark:border-slate-800 flex items-center space-x-3"><MapPin className="text-indigo-600" size={16}/><h3 className="font-black text-indigo-600 text-[11px] uppercase tracking-widest">Localização</h3></div>
              <FormField label="CEP" name="cep" value={data.cep} onChange={handle} />
              <FormField label="Cidade / UF" name="city" value={data.city} onChange={handle} />
              <FormField label="Bairro" name="neighborhood" value={data.neighborhood} onChange={handle} />
            </div>
          )}

          {subTab === 'familiar' && (
            <div className="space-y-12 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[50px] space-y-8 border dark:border-slate-800">
                  <div className="flex items-center space-x-3"><Heart className="text-rose-500" size={20}/><h3 className="font-black text-rose-500 uppercase text-[11px] tracking-widest">Figura Materna</h3></div>
                  <FormField label="Nome" name="mother.name" value={data.mother.name} onChange={handle} />
                  <FormField label="Idade" name="mother.age" value={data.mother.age} onChange={handle} />
                  <FormField label="Perfil Psicológico" name="mother.personality" value={data.mother.personality} onChange={handle} />
                  <FormField label="Qualidade do Vínculo" name="mother.relationship" value={data.mother.relationship} onChange={handle} />
                </div>
                <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[50px] space-y-8 border dark:border-slate-800">
                  <div className="flex items-center space-x-3"><Briefcase className="text-blue-500" size={20}/><h3 className="font-black text-blue-500 uppercase text-[11px] tracking-widest">Figura Paterna</h3></div>
                  <FormField label="Nome" name="father.name" value={data.father.name} onChange={handle} />
                  <FormField label="Idade" name="father.age" value={data.father.age} onChange={handle} />
                  <FormField label="Perfil Psicológico" name="father.personality" value={data.father.personality} onChange={handle} />
                  <FormField label="Qualidade do Vínculo" name="father.relationship" value={data.father.relationship} onChange={handle} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <FormField label="Possui Filhos?" name="hasChildren" type="checkbox" value={data.hasChildren} onChange={handle} />
                 <FormField label="Tem Irmãos?" name="hasSiblings" type="checkbox" value={data.hasSiblings} onChange={handle} />
              </div>
            </div>
          )}

          {subTab === 'historico' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up">
              <div className="md:col-span-2 pb-4 border-b dark:border-slate-800 flex items-center space-x-3"><Stethoscope className="text-indigo-600" size={16}/><h3 className="font-black text-indigo-600 text-[11px] uppercase tracking-widest">Saúde Física e Mental</h3></div>
              <div className="space-y-4">
                <FormField label="Problemas de Saúde Crônicos?" name="healthProblem" type="checkbox" value={data.healthProblem} onChange={handle} />
                <textarea name="healthProblemDetail" value={data.healthProblemDetail} onChange={handle} className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl min-h-[120px] outline-none text-sm font-bold dark:text-white border-2 border-transparent focus:border-indigo-500/20" placeholder="Especifique se houver..." />
              </div>
              <div className="space-y-4">
                <FormField label="Uso de Medicações Contínuas?" name="medication" type="checkbox" value={data.medication} onChange={handle} />
                <textarea name="medicationDetail" value={data.medicationDetail} onChange={handle} className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl min-h-[120px] outline-none text-sm font-bold dark:text-white border-2 border-transparent focus:border-indigo-500/20" placeholder="Nome das medicações e dosagem..." />
              </div>
              <FormField label="Diagnósticos Psiquiátricos Anteriores" name="medicalDiagnosis" value={data.medicalDiagnosis} onChange={handle} />
              <FormField label="Casos Psiquiátricos na Família" name="familyPsychiatricHistory" value={data.familyPsychiatricHistory} onChange={handle} />
            </div>
          )}

          {subTab === 'problemas' && (
            <div className="space-y-10 animate-slide-up">
               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Relato da Queixa Principal</label>
                 <textarea name="problemBrief" value={data.problemBrief} onChange={handle} className="w-full p-8 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/20 rounded-[50px] min-h-[250px] outline-none text-sm font-bold dark:text-white shadow-inner" placeholder="Descreva os motivos que levaram à busca pela psicoterapia..." />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField label="Quando os sintomas iniciaram?" name="problemStart" value={data.problemStart} onChange={handle} />
                 <FormField label="O que já foi tentado para resolver?" name="usefulAttempts" value={data.usefulAttempts} onChange={handle} />
               </div>
            </div>
          )}

          {subTab === 'frases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-slide-up">
               <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[40px] flex items-center space-x-4">
                  <Sparkles className="text-indigo-600 shrink-0" size={24}/>
                  <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase leading-relaxed tracking-wider">Peça ao paciente para completar as frases seguintes sem pensar muito, de forma intuitiva.</p>
               </div>
               <SentenceInput label="1. Eu admiro..." value={data.sentences.admire} onChange={(v) => handleSentence('admire', v)} />
               <SentenceInput label="2. Meus amigos são..." value={data.sentences.friends} onChange={(v) => handleSentence('friends', v)} />
               <SentenceInput label="3. Eu gosto de mim quando..." value={data.sentences.likeMyself} onChange={(v) => handleSentence('likeMyself', v)} />
               <SentenceInput label="4. Me sinto melhor se..." value={data.sentences.feelBetter} onChange={(v) => handleSentence('feelBetter', v)} />
               <SentenceInput label="5. Meus pais..." value={data.sentences.parents} onChange={(v) => handleSentence('parents', v)} />
               <SentenceInput label="6. Eu gostaria de ser..." value={data.sentences.wannaBe} onChange={(v) => handleSentence('wannaBe', v)} />
               <SentenceInput label="7. O mundo seria melhor se..." value={data.sentences.worldBetter} onChange={(v) => handleSentence('worldBetter', v)} />
               <SentenceInput label="8. Minha maior preocupação..." value={data.sentences.worry} onChange={(v) => handleSentence('worry', v)} />
               <SentenceInput label="9. Eu perco a calma quando..." value={data.sentences.loseCalm} onChange={(v) => handleSentence('loseCalm', v)} />
               <SentenceInput label="10. Meu corpo..." value={data.sentences.body} onChange={(v) => handleSentence('body', v)} />
            </div>
          )}
        </div>

        <div className="p-12 bg-slate-50 dark:bg-slate-800 border-t dark:border-slate-800 flex justify-between items-center">
          <button onClick={onCancel} className="px-10 py-5 rounded-3xl font-black uppercase text-[10px] text-slate-400 hover:text-rose-500 transition-all tracking-widest">Cancelar</button>
          <button onClick={() => onSave(data)} className="px-16 py-6 bg-indigo-600 text-white rounded-[40px] font-black uppercase text-[10px] shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all tracking-widest flex items-center space-x-4">
             <Save size={20} /><span>Finalizar Prontuário</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, name, type = "text", value, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">{label}</label>
    {type === 'checkbox' ? (
      <div className="flex items-center space-x-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-800 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all">
        <input type="checkbox" name={name} checked={!!value} onChange={onChange} className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700" />
        <span className="text-xs font-black dark:text-white uppercase tracking-tighter">SIM / POSITIVO</span>
      </div>
    ) : (
      <input type={type} name={name} value={value || ''} onChange={onChange} className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/20 rounded-3xl outline-none text-sm font-bold dark:text-white shadow-sm transition-all focus:bg-white dark:focus:bg-slate-800" />
    )}
  </div>
);

const SentenceInput = ({ label, value, onChange }: any) => (
  <div className="space-y-3 group">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 group-hover:text-indigo-500 transition-colors">{label}</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-b-4 border-transparent focus:border-indigo-500 rounded-[35px] outline-none text-sm font-bold dark:text-white italic tracking-tight" placeholder="Responda espontaneamente..." />
  </div>
);

// --- AI Modal ---

const AIModal = ({ onClose, context }: any) => {
  const [messages, setMessages] = useState<Array<{ role: string, text: string, sources?: any[] }>>([{ role: 'bot', text: 'Olá! Sou o Agente PSI. Estou conectado à sua base de prontuários. Como posso te apoiar hoje?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input; 
    setInput(''); 
    setMessages(m => [...m, { role: 'user', text: txt }]);
    setLoading(true);
    
    try {
      const res = await askAgent(txt, context);
      setMessages(m => [...m, { role: 'bot', text: res.text, sources: res.sources || [] }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'bot', text: "Houve um erro na comunicação. Tente novamente em instantes." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
       <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-[60px] shadow-3xl flex flex-col overflow-hidden border dark:border-slate-800 animate-scale-up">
          <div className="p-10 bg-indigo-600 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-4"><Bot size={36} className="p-2 bg-white/20 rounded-2xl"/><div className="flex flex-col"><h2 className="font-black uppercase text-sm tracking-widest">Assistente IA Especializado</h2><span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Apoio à Decisão Clínica</span></div></div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X size={28}/></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950 space-y-8 custom-scrollbar">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-8 rounded-[45px] text-sm font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 dark:text-white rounded-bl-none border dark:border-slate-700'}`}>
                   {m.text}
                   {m.sources && m.sources.length > 0 && (
                     <div className="mt-6 pt-6 border-t dark:border-slate-700 space-y-3">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Referências Web:</div>
                        {m.sources.map((s:any, idx:number) => <a key={idx} href={s.uri} target="_blank" className="flex items-center space-x-2 text-[10px] text-indigo-500 hover:text-indigo-600 font-bold"><ExternalLink size={12}/><span>{s.title}</span></a>)}
                     </div>
                   )}
                 </div>
               </div>
             ))}
             {loading && (
               <div className="flex items-center space-x-3 p-6 animate-pulse bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full w-fit">
                 <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                 </div>
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-3">Processando base de dados...</span>
               </div>
             )}
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex space-x-4">
             <input className="flex-1 p-6 rounded-[35px] bg-slate-100 dark:bg-slate-800 dark:text-white outline-none font-bold text-sm border-2 border-transparent focus:border-indigo-500/20 shadow-inner" placeholder="Analisar paciente X ou buscar técnica clínica..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} />
             <button onClick={send} className="p-6 bg-indigo-600 text-white rounded-[35px] shadow-2xl hover:scale-105 active:scale-95 transition-all"><Send size={28}/></button>
          </div>
       </div>
    </div>
  );
};

const SessionsTab = ({ patients, sessions, setSessions }: any) => {
  const [pid, setPid] = useState('');
  const [newS, setNewS] = useState({ date: new Date().toISOString().split('T')[0], theme: '', obs: '' });
  const patientSessions = sessions.filter((s:any) => s.patientId === pid);
  
  const add = () => {
    if(!pid || !newS.theme) {
      alert("Selecione um paciente e informe o tema da sessão.");
      return;
    }
    const record = { id: Date.now().toString(), patientId: pid, date: newS.date, theme: newS.theme, observations: newS.obs };
    setSessions([...sessions, record]);
    setNewS({ date: new Date().toISOString().split('T')[0], theme: '', obs: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
       <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl"><ClipboardList size={24}/></div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Evolução do Caso</h2>
          </div>
          <select value={pid} onChange={e => setPid(e.target.value)} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-[25px] text-[10px] font-black uppercase text-indigo-600 border dark:border-slate-800 outline-none shadow-sm min-w-[250px]">
            <option value="">Selecione o Paciente...</option>
            {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
       </div>
       {pid && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="bg-white dark:bg-slate-800 p-12 rounded-[55px] space-y-8 border dark:border-slate-800 shadow-xl">
             <div className="flex items-center justify-between"><h3 className="text-[11px] font-black uppercase text-indigo-600 tracking-widest">Novo Registro</h3><Clock size={18} className="text-slate-300"/></div>
             <FormField label="Data da Sessão" type="date" value={newS.date} onChange={(e:any) => setNewS({...newS, date: e.target.value})} />
             <FormField label="Tema Central / Título" value={newS.theme} onChange={(e:any) => setNewS({...newS, theme: e.target.value})} />
             <div className="space-y-3">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Evolução e Observações</label>
               <textarea className="w-full p-8 bg-slate-50 dark:bg-slate-900 rounded-[45px] min-h-[220px] outline-none text-sm font-bold dark:text-white border dark:border-slate-800 shadow-inner" value={newS.obs} onChange={(e:any) => setNewS({...newS, obs: e.target.value})} placeholder="O que foi trabalhado nesta sessão?" />
             </div>
             <button onClick={add} className="w-full py-6 bg-indigo-600 text-white rounded-[35px] font-black uppercase text-[10px] shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">Salvar Evolução Clinica</button>
           </div>
           <div className="space-y-6 max-h-[750px] overflow-y-auto custom-scrollbar pr-4">
              {patientSessions.slice().reverse().map((s:any) => (
                <div key={s.id} className="bg-white dark:bg-slate-800 p-8 rounded-[45px] shadow-sm border dark:border-slate-800 group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full text-[10px] font-black uppercase">{s.date.split('-').reverse().join('/')}</div>
                    <History size={16} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h4 className="text-sm font-black dark:text-white mb-4 uppercase tracking-tight">{s.theme}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-wrap">{s.observations}</p>
                </div>
              ))}
              {patientSessions.length === 0 && <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[60px] text-slate-300 font-black uppercase text-[10px]">Sem registros de atendimento para este paciente.</div>}
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
    if(!p || !entry.val) {
      alert("Preencha o paciente e o valor do recebimento.");
      return;
    }
    setFinancials([...financials, { id: Date.now().toString(), patientId: p.id, patientName: p.name, value: entry.val, paymentMethod: entry.method, date: entry.date, status: 'Em dia' }]);
    setEntry({ pid: '', val: '', method: 'PIX', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="bg-white dark:bg-slate-800 p-12 rounded-[55px] space-y-8 shadow-xl border dark:border-slate-800">
             <div className="flex items-center space-x-3"><DollarSign className="text-emerald-500" size={24}/><h3 className="text-[11px] font-black uppercase text-indigo-600 tracking-widest">Lançar Honorário</h3></div>
             <select value={entry.pid} onChange={e => setEntry({...entry, pid: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-[25px] text-[10px] font-black uppercase border dark:border-slate-800 outline-none dark:text-white">
                <option value="">Selecione...</option>
                {patients.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
             <FormField label="Valor Recebido (R$)" value={entry.val} onChange={(e:any) => setEntry({...entry, val: e.target.value})} />
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Método</label>
                <select value={entry.method} onChange={e => setEntry({...entry, method: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-[25px] text-[10px] font-black uppercase border dark:border-slate-800 outline-none dark:text-white">
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Depósito">Depósito</option>
                </select>
             </div>
             <button onClick={add} className="w-full py-6 bg-emerald-600 text-white rounded-[35px] font-black uppercase text-[10px] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] transition-all">Registrar Pagamento</button>
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-12 rounded-[60px] border dark:border-slate-800 overflow-hidden shadow-sm">
             <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-8">Histórico de Receitas</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead><tr className="border-b dark:border-slate-700 text-slate-400 uppercase font-black tracking-widest text-[9px]"><th className="pb-6 px-4">Paciente</th><th className="pb-6 px-4">Data</th><th className="pb-6 px-4 text-right">Método</th><th className="pb-6 px-4 text-right">Valor</th></tr></thead>
                  <tbody className="divide-y dark:divide-slate-700">
                     {financials.slice().reverse().map((f:any) => (
                       <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                          <td className="py-6 px-4 font-black text-xs dark:text-white uppercase tracking-tight">{f.patientName}</td>
                          <td className="py-6 px-4 text-[10px] font-bold text-slate-400">{f.date.split('-').reverse().join('/')}</td>
                          <td className="py-6 px-4 text-right"><span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase">{f.paymentMethod}</span></td>
                          <td className="py-6 px-4 text-right font-black text-emerald-600 text-sm">R$ {f.value}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               {financials.length === 0 && <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px]">Nenhum lançamento financeiro.</div>}
             </div>
          </div>
       </div>
    </div>
  );
};
