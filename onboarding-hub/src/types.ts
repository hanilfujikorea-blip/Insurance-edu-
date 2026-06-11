export interface ContractState {
  signed: boolean;
  signedAt: string | null;
  signatureDataUrl: string | null;
  text: string;
}

export interface Employee {
  id: string;
  name: string;
  company: string; // 소속 회사명
  department: string;
  team?: string;
  position: string;
  startDate: string;
  email: string;
  phone: string;
  salary: number; // 연봉 (원 단위)
  laborContract: ContractState;
  salaryContract: ContractState;
  hireType?: '신입' | '경력';
  probation?: '100%' | '80%' | '해당없음';
  vehicleNumber: string;
  vehicleModel: string;
  parkingApproved: 'none' | 'pending' | 'approved';
  completedMissions: string[]; // 완수한 미션 id 목록
  sentAt: string;
  status: 'draft' | 'sent';
  memo?: string;
}

export interface CompanyTemplate {
  id: string;
  name: string;
  representative: string;
  laborContractTemplate: string;
  salaryContractTemplate: string;
}

export interface GuideTopic {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl?: string;
}

export interface BusStop {
  name: string;
  time: string;
  isMajor: boolean;
}

export interface BusRoute {
  id: string;
  routeName: string;
  duration: string;
  stops: BusStop[];
  driver: string;
  contact: string;
  plate: string;
  vehicle: string;
}

export interface MenuItem {
  mainCourse: string;
  sideDishes: string[];
  calories: number;
  type: 'Korean' | 'Western' | 'Salad/Healthy';
}

export interface MealDay {
  day: string; // "월", "화", "수", "목", "금"
  lunch: MenuItem;
  dinner: MenuItem;
}

export interface OnboardingMission {
  id: string;
  title: string;
  desc: string;
  category: 'it' | 'hr' | 'team' | 'general';
  icon: string;
}
