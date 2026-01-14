
export type Theme = 'light' | 'dark' | 'rose' | 'retro' | 'pride' | 'bw' | 'glass';

export interface UserProfile {
  name: string;
  photo: string;
  crp: string;
}

export interface Child {
  name: string;
  age: string;
  education: string;
}

export interface Sibling {
  name: string;
  age: string;
  education: string;
}

export interface ParentInfo {
  name: string;
  age: string;
  maritalStatus: string;
  whatsapp: string;
  education: string;
  profession: string;
  isAlive: boolean | null;
  deathAge: string;
  deathYear: string;
  deathCause: string;
  deathDetails: string;
  personality: string;
  relationship: string;
}

export interface Patient {
  id: string;
  registrationDate: string;
  // DADOS PESSOAIS
  name: string;
  birthDate: string;
  age: string;
  naturalness: string;
  cpf: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  city: string;
  cep: string;
  whatsapp: string;
  phone: string;
  email: string;
  otherContact: string;
  education: string;
  gradYear: string;
  profession: string;
  employer: string;
  workTime: string;
  maritalStatus: string;
  maritalTime: string;
  spouseName: string;
  spouseAge: string;
  spouseProfession: string;
  spouseEducation: string;
  financialResponsible: string;
  familyIncome: string;
  
  // FILHOS
  hasChildren: boolean | null;
  childrenCount: string;
  children: Child[];
  relationshipChildren: string;

  // PAIS
  mother: ParentInfo;
  father: ParentInfo;

  // IRMÃOS
  hasSiblings: boolean | null;
  siblingsCount: string;
  siblings: Sibling[];
  relationshipSiblings: string;

  // DADOS COMPLEMENTARES
  healthProblem: boolean | null;
  healthProblemDetail: string;
  medication: boolean | null;
  medicationDetail: string;
  medicalDiagnosis: string;
  familyPsychiatricHistory: string;
  religion: string;
  isStudent: boolean | null;
  studentDegree: string;
  studentCourse: string;
  studentSchedule: string;
  studentInstitution: string;
  environment: 'Urbano' | 'Rural' | null;
  environmentWhere: string;
  temperament: string;

  // DESCRIÇÃO DOS PROBLEMAS ATUAIS
  problemBrief: string;
  problemStart: string;
  behaviorBeforeAfter: string;
  usefulAttempts: string;

  // RELAÇÕES INTERPESSOAIS
  friendships: string;
  communication: string;
  workRelations: string;
  complicatedRelations: string;

  // RELACIONAMENTO AMOROSO
  romanticRelationshipDesc: string;
  romanticDuration: string;
  partnerAge: string;
  partnerProfession: string;
  partnerPersonality: string;
  partnerLike: string;
  partnerDislike: string;

  // CARACTERISTICAS
  characteristics: string[];
  otherCharacteristics: string;

  // QUESTIONÁRIO
  qWhatLikesToDo: string;
  qOkAlone: boolean | null;
  qOkInGroup: boolean | null;
  qPreferredCompanies: string;
  qLikesHearingStories: boolean | null;
  qLikesTellingStories: boolean | null;
  qLikesMusic: boolean | null;
  qLikesMovies: boolean | null;
  qMovieType: string;
  qParentsStatus: 'Casados' | 'Separados' | null;
  qFatherNewUnion: boolean | null;
  qMotherNewUnion: boolean | null;
  qParentsRelation: 'Normal' | 'Difícil' | 'Inexistente' | null;
  qChildCare: string;
  qOthersInterfere: boolean | null;
  qWhoInterferes: string;

  // COMPLETE AS FRASES
  sentences: {
    admire: string;
    friends: string;
    likeMyself: string;
    feelBetter: string;
    parents: string;
    wannaBe: string;
    worldBetter: string;
    worry: string;
    loseCalm: string;
    body: string;
    can: string;
    cannot: string;
    favorite: string;
    pretend: string;
    nervous: string;
    fear: string;
    awayFear: string;
    wannaHave: string;
    proud: string;
    funny: string;
  };

  observations: string;
  sessionStartDate: string;
  sessionTime: string;
  sessionFrequency: 'diárias' | 'semanais' | 'quinzenais' | 'mensais' | 'pontuais';
  sessionPrice: string;
}

export interface SessionRecord {
  id: string;
  patientId: string;
  sessionNumber: string;
  date: string;
  theme: string;
  observations: string;
  homework: string;
  learning: string;
  finalPhrase: string;
  audioTranscription: string;
}

export interface FinancialRecord {
  id: string;
  patientId: string;
  patientName: string;
  value: string;
  paymentMethod: 'PIX' | 'Depósito' | 'Dinheiro' | 'Cartão' | 'Outro';
  date: string;
  status: 'Em dia' | 'Aguardando' | 'Agendado' | 'Em atraso' | 'Outro';
}
