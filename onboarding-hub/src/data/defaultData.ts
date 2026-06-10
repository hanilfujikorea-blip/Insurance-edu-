import { Employee, BusRoute, MealDay, OnboardingMission, CompanyTemplate } from '../types';

export const defaultCompanyTemplates: CompanyTemplate[] = [
  {
    id: 'hanil-fuji',
    name: '한일후지코리아(주)',
    representative: '이배명',
    laborContractTemplate: `근 로 계 약 서\n\n사용자(갑): 한일후지코리아 주식회사 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 근로계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n\n1. 을의 소속은 {dept}(으)로 하고, 담당 업무는 {team} 관련 제반 업무(으)로 한다.\n   근로장소는 주식회사 한일후지코리아(주) 사무실 내로 한다.\n   업무상 필요한 경우 업무내용이나 근로장소를 변경하거나 배치 전환을 할 수 있다.\n\n2. 을의 기본근로시간은 1일 8시간 1주 40시간으로 하며, 근로시간 및 휴게시간에 관한 세부내용은\n   연봉계약서에 따르기로 한다.\n\n3. 주휴일은 1주 1회 부여하며, 1주 만근 시 유급으로 한다. 연차휴가는 근로기준법에 따라 부여하며,\n   휴일은 법정공휴일을 포함한 주휴일, 근로자의 날, 대체공휴일로 정한다.\n\n4. 을의 연봉은 연봉계약서에 따르며, 연봉계약에 따라 정해진 연봉을 12회 분할하여 당월 30일\n   (공휴일의 경우에는 전일)에 을의 계좌로 지급하기로 한다.\n\n5. 본 근로계약기간은 {startDate}부터 (기간의 정함이 없음) 까지로 한다.\n\n작성일자: {today}\n\n(갑) 한일후지코리아(주) 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
    salaryContractTemplate: `연 봉 계 약 서\n\n사용자(갑): 한일후지코리아 주식회사 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 연봉계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n또한, 연봉은 급여 및 상여금 합산 후, 12회 분할하여 기본급 및 법정제수당으로 월 지급한다.\n\n1. 을의 기본근로시간은 평일 09:00-18:00까지로 하며, 휴게시간은 12:00-13:00까지 1시간으로 한다.\n   근로시간을 확인하기 어려운 경우 업무수행에 통상 필요한 시간을 근로시간으로 한다.\n\n2. 을은 명시된 잔무시간 및 특근시간을 한도로 자유롭게 연장근로를 실시토록 한다.\n   연장근로에 대한 대가는 연봉 중 월액에 포함하여 지급하기로 한다. (포괄임금제)\n\n3. 을의 연봉은 아래와 같다.\n   - 1년 총액: 금 {salaryTotal}원 (₩{salaryTotal})\n\n4. 을의 월 지급액은 포괄역산제로 아래 세부내역과 같고, 매월 30일 을의 계좌로 지급한다.\n   - 기본급 (주휴포함): ₩{salaryBase}\n   - 연장/특근 수당 등: ₩{salaryOvertime}\n   - 월 지급 총액: ₩{salaryMonthly}\n\n5. 지각이나 조퇴 및 결근 등 근로제공이 없는 부분은 당해 부분만큼 공제할 수 있다.\n\n6. 을은 본인의 책정된 임금을 타인에게 공표하지 말아야 하며, 위배되는 행위에 따른 불이익에 대해서\n   갑은 그에 합당한 징계조치를 할 수 있다.\n\n7. 본 연봉계약기간은 {today}부터 {contractEndDate}까지로 한다.\n\n작성일자: {today}\n\n(갑) 한일후지코리아(주) 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
  },
  {
    id: 'fuji-global',
    name: '(주)후지글로벌로지스틱',
    representative: '이배명',
    laborContractTemplate: `근 로 계 약 서\n\n사용자(갑): (주)후지글로벌로지스틱 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 근로계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n\n1. 을의 소속은 {dept}(으)로 하고, 담당 업무는 {team} 관련 제반 업무(으)로 한다.\n   근로장소는 (주)후지글로벌로지스틱 사무실 내로 한다.\n   업무상 필요한 경우 업무내용이나 근로장소를 변경하거나 배치 전환을 할 수 있다.\n\n2. 을의 기본근로시간은 1일 8시간 1주 40시간으로 하며, 근로시간 및 휴게시간에 관한 세부내용은\n   연봉계약서에 따르기로 한다.\n\n3. 주휴일은 1주 1회 부여하며, 1주 만근 시 유급으로 한다. 연차휴가는 근로기준법에 따라 부여하며,\n   휴일은 법정공휴일을 포함한 주휴일, 근로자의 날, 대체공휴일로 정한다.\n\n4. 을의 연봉은 연봉계약서에 따르며, 연봉계약에 따라 정해진 연봉을 12회 분할하여 당월 30일\n   (공휴일의 경우에는 전일)에 을의 계좌로 지급하기로 한다.\n\n5. 본 근로계약기간은 {startDate}부터 (기간의 정함이 없음) 까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)후지글로벌로지스틱 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
    salaryContractTemplate: `연 봉 계 약 서\n\n사용자(갑): (주)후지글로벌로지스틱 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 연봉계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n또한, 연봉은 급여 및 상여금 합산 후, 12회 분할하여 기본급 및 법정제수당으로 월 지급한다.\n\n1. 을의 기본근로시간은 평일 09:00-18:00까지로 하며, 휴게시간은 12:00-13:00까지 1시간으로 한다.\n   근로시간을 확인하기 어려운 경우 업무수행에 통상 필요한 시간을 근로시간으로 한다.\n\n2. 을은 명시된 잔무시간 및 특근시간을 한도로 자유롭게 연장근로를 실시토록 한다.\n   연장근로에 대한 대가는 연봉 중 월액에 포함하여 지급하기로 한다. (포괄임금제)\n\n3. 을의 연봉은 아래와 같다.\n   - 1년 총액: 금 {salaryTotal}원 (₩{salaryTotal})\n\n4. 을의 월 지급액은 포괄역산제로 아래 세부내역과 같고, 매월 30일 을의 계좌로 지급한다.\n   - 기본급 (주휴포함): ₩{salaryBase}\n   - 연장/특근 수당 등: ₩{salaryOvertime}\n   - 월 지급 총액: ₩{salaryMonthly}\n\n5. 지각이나 조퇴 및 결근 등 근로제공이 없는 부분은 당해 부분만큼 공제할 수 있다.\n\n6. 을은 본인의 책정된 임금을 타인에게 공표하지 말아야 하며, 위배되는 행위에 따른 불이익에 대해서\n   갑은 그에 합당한 징계조치를 할 수 있다.\n\n7. 본 연봉계약기간은 {today}부터 {contractEndDate}까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)후지글로벌로지스틱 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
  },
  {
    id: 'kitos',
    name: '(주)키토스',
    representative: '이배명',
    laborContractTemplate: `근 로 계 약 서\n\n사용자(갑): (주)키토스 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 근로계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n\n1. 을의 소속은 {dept}(으)로 하고, 담당 업무는 {team} 관련 제반 업무(으)로 한다.\n   근로장소는 (주)키토스 사무실 내로 한다.\n   업무상 필요한 경우 업무내용이나 근로장소를 변경하거나 배치 전환을 할 수 있다.\n\n2. 을의 기본근로시간은 1일 8시간 1주 40시간으로 하며, 근로시간 및 휴게시간에 관한 세부내용은\n   연봉계약서에 따르기로 한다.\n\n3. 주휴일은 1주 1회 부여하며, 1주 만근 시 유급으로 한다. 연차휴가는 근로기준법에 따라 부여하며,\n   휴일은 법정공휴일을 포함한 주휴일, 근로자의 날, 대체공휴일로 정한다.\n\n4. 을의 연봉은 연봉계약서에 따르며, 연봉계약에 따라 정해진 연봉을 12회 분할하여 당월 30일\n   (공휴일의 경우에는 전일)에 을의 계좌로 지급하기로 한다.\n\n5. 본 근로계약기간은 {startDate}부터 (기간의 정함이 없음) 까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)키토스 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
    salaryContractTemplate: `연 봉 계 약 서\n\n사용자(갑): (주)키토스 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 연봉계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n또한, 연봉은 급여 및 상여금 합산 후, 12회 분할하여 기본급 및 법정제수당으로 월 지급한다.\n\n1. 을의 기본근로시간은 평일 09:00-18:00까지로 하며, 휴게시간은 12:00-13:00까지 1시간으로 한다.\n   근로시간을 확인하기 어려운 경우 업무수행에 통상 필요한 시간을 근로시간으로 한다.\n\n2. 을은 명시된 잔무시간 및 특근시간을 한도로 자유롭게 연장근로를 실시토록 한다.\n   연장근로에 대한 대가는 연봉 중 월액에 포함하여 지급하기로 한다. (포괄임금제)\n\n3. 을의 연봉은 아래와 같다.\n   - 1년 총액: 금 {salaryTotal}원 (₩{salaryTotal})\n\n4. 을의 월 지급액은 포괄역산제로 아래 세부내역과 같고, 매월 30일 을의 계좌로 지급한다.\n   - 기본급 (주휴포함): ₩{salaryBase}\n   - 연장/특근 수당 등: ₩{salaryOvertime}\n   - 월 지급 총액: ₩{salaryMonthly}\n\n5. 지각이나 조퇴 및 결근 등 근로제공이 없는 부분은 당해 부분만큼 공제할 수 있다.\n\n6. 을은 본인의 책정된 임금을 타인에게 공표하지 말아야 하며, 위배되는 행위에 따른 불이익에 대해서\n   갑은 그에 합당한 징계조치를 할 수 있다.\n\n7. 본 연봉계약기간은 {today}부터 {contractEndDate}까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)키토스 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
  },
  {
    id: 'imex',
    name: '(주)아이멕스',
    representative: '이배명',
    laborContractTemplate: `근 로 계 약 서\n\n사용자(갑): (주)아이멕스 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 근로계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n\n1. 을의 소속은 {dept}(으)로 하고, 담당 업무는 {team} 관련 제반 업무(으)로 한다.\n   근로장소는 (주)아이멕스 사무실 내로 한다.\n   업무상 필요한 경우 업무내용이나 근로장소를 변경하거나 배치 전환을 할 수 있다.\n\n2. 을의 기본근로시간은 1일 8시간 1주 40시간으로 하며, 근로시간 및 휴게시간에 관한 세부내용은\n   연봉계약서에 따르기로 한다.\n\n3. 주휴일은 1주 1회 부여하며, 1주 만근 시 유급으로 한다. 연차휴가는 근로기준법에 따라 부여하며,\n   휴일은 법정공휴일을 포함한 주휴일, 근로자의 날, 대체공휴일로 정한다.\n\n4. 을의 연봉은 연봉계약서에 따르며, 연봉계약에 따라 정해진 연봉을 12회 분할하여 당월 30일\n   (공휴일의 경우에는 전일)에 을의 계좌로 지급하기로 한다.\n\n5. 본 근로계약기간은 {startDate}부터 (기간의 정함이 없음) 까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)아이멕스 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
    salaryContractTemplate: `연 봉 계 약 서\n\n사용자(갑): (주)아이멕스 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 연봉계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n또한, 연봉은 급여 및 상여금 합산 후, 12회 분할하여 기본급 및 법정제수당으로 월 지급한다.\n\n1. 을의 기본근로시간은 평일 09:00-18:00까지로 하며, 휴게시간은 12:00-13:00까지 1시간으로 한다.\n   근로시간을 확인하기 어려운 경우 업무수행에 통상 필요한 시간을 근로시간으로 한다.\n\n2. 을은 명시된 잔무시간 및 특근시간을 한도로 자유롭게 연장근로를 실시토록 한다.\n   연장근로에 대한 대가는 연봉 중 월액에 포함하여 지급하기로 한다. (포괄임금제)\n\n3. 을의 연봉은 아래와 같다.\n   - 1년 총액: 금 {salaryTotal}원 (₩{salaryTotal})\n\n4. 을의 월 지급액은 포괄역산제로 아래 세부내역과 같고, 매월 30일 을의 계좌로 지급한다.\n   - 기본급 (주휴포함): ₩{salaryBase}\n   - 연장/특근 수당 등: ₩{salaryOvertime}\n   - 월 지급 총액: ₩{salaryMonthly}\n\n5. 지각이나 조퇴 및 결근 등 근로제공이 없는 부분은 당해 부분만큼 공제할 수 있다.\n\n6. 을은 본인의 책정된 임금을 타인에게 공표하지 말아야 하며, 위배되는 행위에 따른 불이익에 대해서\n   갑은 그에 합당한 징계조치를 할 수 있다.\n\n7. 본 연봉계약기간은 {today}부터 {contractEndDate}까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)아이멕스 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
  },
  {
    id: 'ktech',
    name: '(주)케이텍코퍼레이션',
    representative: '이배명',
    laborContractTemplate: `근 로 계 약 서\n\n사용자(갑): (주)케이텍코퍼레이션 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 근로계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n\n1. 을의 소속은 {dept}(으)로 하고, 담당 업무는 {team} 관련 제반 업무(으)로 한다.\n   근로장소는 (주)케이텍코퍼레이션 사무실 내로 한다.\n   업무상 필요한 경우 업무내용이나 근로장소를 변경하거나 배치 전환을 할 수 있다.\n\n2. 을의 기본근로시간은 1일 8시간 1주 40시간으로 하며, 근로시간 및 휴게시간에 관한 세부내용은\n   연봉계약서에 따르기로 한다.\n\n3. 주휴일은 1주 1회 부여하며, 1주 만근 시 유급으로 한다. 연차휴가는 근로기준법에 따라 부여하며,\n   휴일은 법정공휴일을 포함한 주휴일, 근로자의 날, 대체공휴일로 정한다.\n\n4. 을의 연봉은 연봉계약서에 따르며, 연봉계약에 따라 정해진 연봉을 12회 분할하여 당월 30일\n   (공휴일의 경우에는 전일)에 을의 계좌로 지급하기로 한다.\n\n5. 본 근로계약기간은 {startDate}부터 (기간의 정함이 없음) 까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)케이텍코퍼레이션 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
    salaryContractTemplate: `연 봉 계 약 서\n\n사용자(갑): (주)케이텍코퍼레이션 (대표이사 이배명)\n근로자(을): {name}\n\n양 당사자는 다음과 같이 연봉계약을 체결하고 상호 성실하게 준수할 것을 확약한다.\n또한, 연봉은 급여 및 상여금 합산 후, 12회 분할하여 기본급 및 법정제수당으로 월 지급한다.\n\n1. 을의 기본근로시간은 평일 09:00-18:00까지로 하며, 휴게시간은 12:00-13:00까지 1시간으로 한다.\n   근로시간을 확인하기 어려운 경우 업무수행에 통상 필요한 시간을 근로시간으로 한다.\n\n2. 을은 명시된 잔무시간 및 특근시간을 한도로 자유롭게 연장근로를 실시토록 한다.\n   연장근로에 대한 대가는 연봉 중 월액에 포함하여 지급하기로 한다. (포괄임금제)\n\n3. 을의 연봉은 아래와 같다.\n   - 1년 총액: 금 {salaryTotal}원 (₩{salaryTotal})\n\n4. 을의 월 지급액은 포괄역산제로 아래 세부내역과 같고, 매월 30일 을의 계좌로 지급한다.\n   - 기본급 (주휴포함): ₩{salaryBase}\n   - 연장/특근 수당 등: ₩{salaryOvertime}\n   - 월 지급 총액: ₩{salaryMonthly}\n\n5. 지각이나 조퇴 및 결근 등 근로제공이 없는 부분은 당해 부분만큼 공제할 수 있다.\n\n6. 을은 본인의 책정된 임금을 타인에게 공표하지 말아야 하며, 위배되는 행위에 따른 불이익에 대해서\n   갑은 그에 합당한 징계조치를 할 수 있다.\n\n7. 본 연봉계약기간은 {today}부터 {contractEndDate}까지로 한다.\n\n작성일자: {today}\n\n(갑) (주)케이텍코퍼레이션 대표이사 이 배 명\n(을) 근로자 성명: {name}`,
  },
];

export function replaceTemplates(template: string, data: any): string {
  let result = template;
  Object.keys(data).forEach(key => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), data[key]);
  });
  return result;
}

export function formatContractDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getContractEndDate(startDate: string): string {
  const [year, month, day] = startDate.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  const end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate() - 1);
  return formatContractDate(end);
}

export function getCompanyStampLines(companyName: string): string[] {
  const cleaned = companyName.replace(/\s+/g, '').replace(/주식회사/g, '').trim();

  if (cleaned === '한일후지코리아(주)') return ['한일후지', '코리아', '(주)인'];
  if (cleaned === '(주)후지글로벌로지스틱') return ['후지글로벌', '로지스틱', '(주)인'];
  if (cleaned === '(주)키토스') return ['키토스', '(주)인'];
  if (cleaned === '(주)아이멕스') return ['아이멕스', '(주)인'];
  if (cleaned === '(주)케이텍코퍼레이션') return ['케이텍', '코퍼레이션', '(주)인'];

  return [cleaned.replace(/\(주\)$/g, ''), '(주)인'];
}

export function getCompanyStampText(companyName: string): string {
  const base = companyName.replace(/주식회사/g, '(주)').replace(/\s+/g, '');
  return base;
}


// 근로계약서 템플릿 생성기 (샘플 내용 반영)
export function generateLaborContract(name: string, dept: string, startDate: string, companyId: string = 'hanil-fuji', team: string = ''): string {
  const company = defaultCompanyTemplates.find(c => c.id === companyId) || defaultCompanyTemplates[0];
  const [year, month, day] = startDate.split('-');
  
  return replaceTemplates(company.laborContractTemplate, {
    name,
    dept,
    team: team || dept, // 팀 정보가 없으면 부서명으로 대체
    startDate: `${year}년 ${month}월 ${day}일`,
    today: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  });
}

export function generateSalaryContract(name: string, salary: number, startDate: string, companyId: string = 'hanil-fuji'): string {
  const company = defaultCompanyTemplates.find(c => c.id === companyId) || defaultCompanyTemplates[0];
  const monthlySalary = Math.floor(salary / 12);
  const baseSalary = Math.floor(monthlySalary * 0.8);
  const overtimeAllowance = monthlySalary - baseSalary;
  const [year, month, day] = startDate.split('-');
  const contractStartDate = `${year}년 ${month}월 ${day}일`;

  return replaceTemplates(company.salaryContractTemplate, {
    name,
    salaryTotal: salary.toLocaleString('ko-KR'),
    salaryMonthly: monthlySalary.toLocaleString('ko-KR'),
    salaryBase: baseSalary.toLocaleString('ko-KR'),
    salaryOvertime: overtimeAllowance.toLocaleString('ko-KR'),
    today: contractStartDate,
    contractEndDate: getContractEndDate(startDate)
  });
}

export const defaultBusRoutes: BusRoute[] = [
  {
    id: 'route-dongrae',
    routeName: '동래방면 (만덕터널)',
    duration: '약 85분',
    driver: '김갑종 기사님',
    contact: '010-9999-1234',
    plate: '부산 70사 8301',
    vehicle: '45인승 최신형 하이쿠션 대형 리무진',
    stops: [
      { name: '시청역 (7번 출구 시청 옆)', time: '07:05', isMajor: true },
      { name: '연산 전철역 (16번 출구 지나 U+ 앞)', time: '07:09', isMajor: false },
      { name: '동래역 (4호선 5번 출구 세연정 앞)', time: '07:14', isMajor: true },
      { name: '덕천역 (3호선 12번 출구)', time: '07:32', isMajor: true },
      { name: '구포역 (1번 출구)', time: '07:35', isMajor: false },
      { name: '불암역 (1번 출구 건너편 정류장)', time: '07:50', isMajor: false },
      { name: '회사 본사 정문 (도착)', time: '08:30', isMajor: true },
    ],
  },
  {
    id: 'route-munhyeon',
    routeName: '문현동방면 (을숙도대교)',
    duration: '약 76분',
    driver: '이대성 기사님',
    contact: '010-8888-5678',
    plate: '부산 70아 2981',
    vehicle: '25인승 우등 리무진 미니버스',
    stops: [
      { name: '문현동 전철역 (1,3번 출구 사이)', time: '07:14', isMajor: true },
      { name: '부산진역BRT (7번 출구 앞)', time: '07:20', isMajor: false },
      { name: '부산역 전철역 (1번 출구)', time: '07:25', isMajor: true },
      { name: '동대신 시장 (미진축산 앞)', time: '07:30', isMajor: false },
      { name: '괴정 전철역 (1번 출구)', time: '07:38', isMajor: true },
      { name: '당리 (파리바게트 건너편)', time: '07:43', isMajor: false },
      { name: '하단 (공영주차장 뒤편)', time: '07:48', isMajor: true },
      { name: '신평 전철역 (4번 출구 앞)', time: '07:53', isMajor: false },
      { name: '포트빌 (맞은편 횡단보도)', time: '08:20', isMajor: false },
      { name: '회사 본사 정문 (도착)', time: '08:30', isMajor: true },
    ],
  },
  {
    id: 'route-jinhae',
    routeName: '진해/창원방면',
    duration: '약 60분',
    driver: '정삼순 기사님',
    contact: '010-7777-9012',
    plate: '경남 72배 4930',
    vehicle: '45인승 우등 대형 전세버스',
    stops: [
      { name: '포레나 대원아파트 (108동 앞)', time: '07:35', isMajor: true },
      { name: '시티세븐 (약국 앞)', time: '07:37', isMajor: false },
      { name: '용지더샾 트리비앙APT 정류장', time: '07:40', isMajor: false },
      { name: '정우상가 앞 정류장', time: '07:42', isMajor: true },
      { name: '은아아파트 (201동 건너편)', time: '07:44', isMajor: false },
      { name: '성원주상가 건너편 정류장', time: '07:45', isMajor: false },
      { name: '사파동성 (상남교회 맞은편)', time: '07:48', isMajor: false },
      { name: '남양동성아파트 정류장', time: '07:50', isMajor: false },
      { name: '국방기술품질원 정류장', time: '07:55', isMajor: true },
      { name: '진해 녹산현대아파트 건너편', time: '08:17', isMajor: false },
      { name: '풍림아파트 CU 편의점 앞', time: '08:19', isMajor: false },
      { name: '창원마린2차 (안청초 앞)', time: '08:23', isMajor: false },
      { name: '부산신항 부영 8단지 정문 우측', time: '08:27', isMajor: false },
      { name: '부산신항 부영 4단지 건너편', time: '08:30', isMajor: false },
      { name: '회사 본사 정문 (도착)', time: '08:35', isMajor: true },
    ],
  },
  {
    id: 'route-myeongji',
    routeName: '명지방면',
    duration: '약 50분',
    driver: '홍길동 기사님',
    contact: '010-0000-0000',
    plate: '부산 70가 0000',
    vehicle: '리무진 버스',
    stops: [
      { name: '명지퀸덤 (에디슨타운 101-102동)', time: '07:45', isMajor: true },
      { name: '명호고등학교 정류장', time: '07:48', isMajor: false },
      { name: '명지협성휴포레 (123-124동)', time: '07:58', isMajor: true },
      { name: '중흥S클래스 (훈훈약국 건너편)', time: '08:00', isMajor: false },
      { name: '명지국제롯데시네마 건너편', time: '08:02', isMajor: false },
      { name: '명지더웨스턴 103동 앞', time: '08:04', isMajor: false },
      { name: '더샵명지 2,3단지 (2단지 앞)', time: '08:07', isMajor: true },
      { name: '르노삼성자동차 정문 정류장', time: '08:12', isMajor: false },
      { name: '회사 본사 정문 (도착)', time: '08:35', isMajor: true },
    ],
  },
];

export interface GuideTopic {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown or simple text
}

export const defaultGuideTopics: GuideTopic[] = [
  {
    id: 'work-time',
    title: '출퇴근 및 티트리(Ttree) 사용',
    category: '기본수칙',
    content: `### 티트리(Ttree) 앱 설치 안내\n1. 앱스토어/플레이스토어에서 **“Ttree”** 검색 및 설치\n2. 회사코드: **CLOUD**\n3. ID: 본인 휴대폰 번호\n4. PW: 주민번호 앞 6자리 (로그인 후 변경 권장)\n\n### 업무 시작 체크\n- 출근 시 **9시 이전**에 앱에서 [업무시작] 버튼을 반드시 클릭해 주세요.\n- 연차, 휴가, 교육 등 모든 근태 신청도 이 앱을 통해 진행됩니다.`,
  },
  {
    id: 'focus-time',
    title: '집중 근무 시간 안내',
    category: '기본수칙',
    content: `### 집중 근무 시간\n- **오전: 09:30 ~ 11:30**\n- **오후: 13:30 ~ 15:30**\n\n### 해당 시간 내 금지 사항\n- 개인 휴식 및 흡연, 휴게시설 이용 금지\n- 업무와 무관한 통화 및 메신저(네이트온 등), SNS 자제\n- 업체 미팅 및 내부 회의 지양 (가급적 피해서 진행)`,
  },
  {
    id: 'cafeteria',
    title: '식당 및 매점 이용',
    category: '복지안내',
    content: `### 4층 식당 이용\n- 식사 시 **임시 사원증**을 단말기에 태그해 주세요. (식수 체크용)\n\n### 사내 매점 (자율결제)\n- 키오스크를 이용한 **페이/카드 결제**만 가능합니다.\n- ※ 현금 결제 불가`,
  },
  {
    id: 'parking',
    title: '주차 및 사원증',
    category: '시설안내',
    content: `### 주차 가능 구역\n- 주차장 내 **빨간색 구역**에 주차해 주세요.\n- ※ 회사 내부 주차장 일부는 업무용/임원용으로 제한됩니다.\n\n### 임시 사원증 수령처\n- **HFK:** 인사총무팀 문수민 사원\n- **FGL:** 총무팀 장진우 과장`,
  },
  {
    id: 'benefits',
    title: '연차 및 교육 안내',
    category: '복지안내',
    content: `### 연차 제도\n- **1년 미만:** 1개월 만근 시 1개 생성\n- **다음 해 1월 1일:** 근무일수에 따라 조정 개수 부여\n- **조정개수:** 1년(15개) 기준 근무일수 일할 계산\n\n### 법정 교육 수강\n- ENI 교육 입과 후 기간 내 **100% 수강 완료** 필수\n- (※ 안내 문자 수령 후 1일 이내 완료 권장)`,
  },
  {
    id: 'system',
    title: 'IT 시스템 및 인프라',
    category: 'IT지원',
    content: `### 사내 시스템 확인\n- K SYS 계정 부여 및 아카이브 메일 확인\n- 개인별 내선번호 확인\n\n### 회사 조직도 위치\n- **X:\\00조직도00**\n- ※ X드라이브는 사내 전체 공유 폴더입니다. (수정 금지)`,
  },
];

export const defaultMissions: OnboardingMission[] = []; // Placeholder to avoid breaking imports
export const defaultCafeteriaMenus: MealDay[] = []; // Placeholder to avoid breaking imports

export const defaultEmployees: Employee[] = [
  {
    id: 'hire-2026-001',
    name: '최은우',
    company: 'hanil-fuji',
    department: 'Software Engineering 1그룹',
    team: '플랫폼 개발팀',
    position: '사원 (Back-End)',
    startDate: '2026-06-08',
    email: 'ew.choi@nextcorp.com',
    phone: '010-1234-5678',
    salary: 48000000,
    laborContract: {
      signed: false,
      signedAt: null,
      signatureDataUrl: null,
      text: generateLaborContract('최은우', 'Software Engineering 1그룹', '2026-06-08', 'hanil-fuji', '플랫폼 개발팀'),
    },
    salaryContract: {
      signed: false,
      signedAt: null,
      signatureDataUrl: null,
      text: generateSalaryContract('최은우', 48000000, '2026-06-08', 'hanil-fuji'),
    },
    vehicleNumber: '',
    vehicleModel: '',
    parkingApproved: 'none',
    completedMissions: [],
    sentAt: '2026-06-04 14:12',
    status: 'sent',
  },
  {
    id: 'hire-2026-002',
    name: '이나경',
    company: 'hanil-fuji',
    department: 'UI/UX Design Lab',
    team: '서비스 디자인팀',
    position: '주임 (Product UI UX)',
    startDate: '2026-06-15',
    email: 'nk.lee@nextcorp.com',
    phone: '010-8765-4321',
    salary: 43000000,
    laborContract: {
      signed: false,
      signedAt: null,
      signatureDataUrl: null,
      text: generateLaborContract('이나경', 'UI/UX Design Lab', '2026-06-15', 'hanil-fuji', '서비스 디자인팀'),
    },
    salaryContract: {
      signed: false,
      signedAt: null,
      signatureDataUrl: null,
      text: generateSalaryContract('이나경', 43000000, '2026-06-15', 'hanil-fuji'),
    },
    vehicleNumber: '123가4567',
    vehicleModel: '아이오닉 5',
    parkingApproved: 'pending',
    completedMissions: [],
    sentAt: '2026-06-04 14:15',
    status: 'sent',
  },
  {
    id: 'hire-2026-003',
    name: '박도현',
    company: 'hanil-fuji',
    department: '브랜드 마케팅 스쿼드',
    team: '퍼포먼스 마케팅팀',
    position: '대리 (퍼포먼스 마케터)',
    startDate: '2026-06-01',
    email: 'dh.park@nextcorp.com',
    phone: '010-4567-8901',
    salary: 54000000,
    laborContract: {
      signed: true,
      signedAt: '2026-06-02 09:34:22',
      signatureDataUrl: 'stamped_simulated_image',
      text: generateLaborContract('박도현', '브랜드 마케팅 스쿼드', '2026-06-01', 'hanil-fuji', '퍼포먼스 마케팅팀'),
    },
    salaryContract: {
      signed: true,
      signedAt: '2026-06-02 09:36:11',
      signatureDataUrl: 'stamped_simulated_image',
      text: generateSalaryContract('박도현', 54000000, '2026-06-01', 'hanil-fuji'),
    },
    vehicleNumber: '44버8899',
    vehicleModel: 'GV70',
    parkingApproved: 'approved',
    completedMissions: ['sign-contracts', 'it-setup', 'buddy-coffee'],
    sentAt: '2026-06-01 10:00',
    status: 'sent',
  }
];
