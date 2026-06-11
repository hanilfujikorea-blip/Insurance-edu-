import React, { useState } from 'react';
import { UserPlus, Users, BadgeCheck, FileCheck, Info, MessageSquare, Trash2, Calendar, Phone, Mail, DollarSign, ExternalLink, Edit, Save, X, Send, Eye, Building2, FileText, BookOpenCheck, Bus, Download } from 'lucide-react';
import { Employee, CompanyTemplate, GuideTopic, BusRoute, BusStop } from '../types';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { generateLaborContract, generateSalaryContract, getCompanyStampText, getContractEndDate, replaceTemplates } from '../data/defaultData';

interface HRDashboardProps {
  employees: Employee[];
  companyTemplates: CompanyTemplate[];
  guideTopics: GuideTopic[];
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee: (employee: Employee) => void;
  onUpdateTemplate: (template: CompanyTemplate) => void;
  onUpdateGuideTopic: (topic: GuideTopic) => void;
  busRoutes: BusRoute[];
  onUpdateBusRoute: (route: BusRoute) => void;
  onRemoveEmployee: (id: string) => void;
  onSelectEmployeeForSimulation: (employee: Employee) => void;
}

export default function HRDashboard({
  employees,
  companyTemplates,
  guideTopics,
  onAddEmployee,
  onUpdateEmployee,
  onUpdateTemplate,
  onUpdateGuideTopic,
  busRoutes,
  onUpdateBusRoute,
  onRemoveEmployee,
  onSelectEmployeeForSimulation,
}: HRDashboardProps) {
  
  // Dashboard Tabs: 'members' | 'templates' | 'guide' | 'bus'
  const [activeTab, setActiveTab] = useState<'members' | 'templates' | 'guide' | 'bus'>('members');

  // States for adding user
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyTemplates[0]?.id || 'hanil-fuji');
  const [department, setDepartment] = useState('Software Engineering 1그룹');
  const [team, setTeam] = useState('');
  const [position, setPosition] = useState('사원');
  const [startDate, setStartDate] = useState(() => {
    // default next monday
    const date = new Date();
    date.setDate(date.getDate() + (1 + 7 - date.getDay()) % 7 || 7);
    return date.toISOString().split('T')[0];
  });
  const [salary, setSalary] = useState(4000); // 연봉 만원 단위 (예: 4500만원)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('010-');
  const [hireType, setHireType] = useState<'신입' | '경력'>('신입');
  const [probation, setProbation] = useState<'100%' | '80%' | '해당없음'>('해당없음');
  const [filterCompanyId, setFilterCompanyId] = useState<string>('all');

  // State for editing user
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [editSalary, setEditSalary] = useState<number>(0);
  const [editLaborText, setEditLaborText] = useState('');
  const [editSalaryText, setEditSalaryText] = useState('');
  const [editMemo, setEditMemo] = useState('');

  // State for editing templates
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editTempLabor, setEditTempLabor] = useState('');
  const [editTempSalary, setEditTempSalary] = useState('');

  // State for editing guide topics
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicContent, setEditTopicContent] = useState('');
  const [editTopicImageUrl, setEditTopicImageUrl] = useState('');

  // State for editing bus routes
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [editBusRouteName, setEditBusRouteName] = useState('');
  const [editBusStops, setEditBusStops] = useState<BusStop[]>([]);
  const [editBusDriver, setEditBusDriver] = useState('');
  const [editBusContact, setEditBusContact] = useState('');
  const [editBusPlate, setEditBusPlate] = useState('');
  const [editBusVehicle, setEditBusVehicle] = useState('');

  const handleEditStart = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setEditSalary(Math.floor(emp.salary / 10000));
    setEditLaborText(emp.laborContract.text);
    setEditSalaryText(emp.salaryContract.text);
    setEditMemo(emp.memo || '');
  };

  const handleEditSave = (emp: Employee) => {
    const updatedSalary = editSalary * 10000;
    const updatedEmp: Employee = {
      ...emp,
      salary: updatedSalary,
      laborContract: {
        ...emp.laborContract,
        text: editLaborText,
      },
      salaryContract: {
        ...emp.salaryContract,
        text: editSalaryText,
      },
      memo: editMemo,
    };
    onUpdateEmployee(updatedEmp);
    setEditingEmpId(null);
  };

  const handleTemplateEditStart = (temp: CompanyTemplate) => {
    setEditingTemplateId(temp.id);
    setEditTempLabor(temp.laborContractTemplate);
    setEditTempSalary(temp.salaryContractTemplate);
  };

  const handleTemplateEditSave = (temp: CompanyTemplate) => {
    onUpdateTemplate({
      ...temp,
      laborContractTemplate: editTempLabor,
      salaryContractTemplate: editTempSalary,
    });
    setEditingTemplateId(null);
  };

  const handleTopicEditStart = (topic: GuideTopic) => {
    setEditingTopicId(topic.id);
    setEditTopicTitle(topic.title);
    setEditTopicContent(topic.content);
    setEditTopicImageUrl(topic.imageUrl || '');
  };

  const handleTopicEditSave = (topic: GuideTopic) => {
    onUpdateGuideTopic({
      ...topic,
      title: editTopicTitle,
      content: editTopicContent,
      imageUrl: editTopicImageUrl,
    });
    setEditingTopicId(null);
  };

  const handleBusEditStart = (route: BusRoute) => {
    setEditingBusId(route.id);
    setEditBusRouteName(route.routeName || '');
    setEditBusStops(route.stops ? [...route.stops] : []);
    setEditBusDriver(route.driver || '');
    setEditBusContact(route.contact || '');
    setEditBusPlate(route.plate || '');
    setEditBusVehicle(route.vehicle || '');
  };

  const handleBusEditSave = (route: BusRoute) => {
    onUpdateBusRoute({
      ...route,
      routeName: editBusRouteName,
      driver: editBusDriver,
      contact: editBusContact,
      plate: editBusPlate,
      vehicle: editBusVehicle,
      stops: editBusStops,
    });
    setEditingBusId(null);
  };

  const handleSendInvitation = async (emp: Employee) => {
    if (!window.confirm(`${emp.name} 사원님께 알리고(Aligo) API 연동을 통해 카카오 알림톡을 발송하시겠습니까?`)) return;

    const updatedEmp: Employee = {
      ...emp,
      status: 'sent',
      sentAt: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toTimeString().slice(0, 5),
    };
    onUpdateEmployee(updatedEmp);

    await simulateAlimtalk(updatedEmp);
  };

  // Interactive mock notifications state
  const [invitationMessage, setInvitationMessage] = useState<React.ReactNode | null>(null);
  const [invitedEmployeeName, setInvitedEmployeeName] = useState('');
  const [isSendingAlimtalk, setIsSendingAlimtalk] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  const renderCompanyStampHtml = (stampText: string, stampId: string) => {
    // 텍스트 길이에 따라 letterSpacing 자동 계산 (빈칸 없이 원호에 꽉 차게)
    const charCount = stampText.length;
    const circleCirc = 2 * Math.PI * 34; // 원호 둘레 ≈ 213.6
    const charWidth = 8.5; // 글자 하나 평균 너비(px)
    const totalCharWidth = charCount * charWidth;
    const spacing = Math.max(0, (circleCirc - totalCharWidth) / Math.max(charCount - 1, 1));
    const letterSpacingVal = Math.min(spacing, 6).toFixed(1);

    return `
    <svg viewBox="0 0 100 100" width="96" height="96" style="display:block; overflow:visible; transform:rotate(-12deg);">
      <defs>
        <path id="${stampId}" d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
      </defs>
      <circle cx="50" cy="50" r="42" fill="rgba(254,242,242,0.4)" stroke="#ef4444" stroke-width="3" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2 2.5" />
      <text fill="#ef4444" font-size="8.5" font-weight="800" letter-spacing="${letterSpacingVal}">
        <textPath href="#${stampId}" startOffset="50%" text-anchor="middle">${stampText}</textPath>
      </text>
      <text x="50" y="57" text-anchor="middle" fill="#ef4444" font-size="22" font-weight="900" font-family="serif">印</text>
    </svg>
  `;
  };

  const renderSignatureHtml = (emp: Employee, signatureDataUrl: string | null) => {
    if (!signatureDataUrl) {
      return '<span style="color: #999; font-size: 12px;">(서명 없음)</span>';
    }

    if (signatureDataUrl.startsWith('typed:')) {
      const [, rawName = emp.name] = signatureDataUrl.split(':');
      return `
        <div style="
          display: inline-block;
          border: 2px solid #ef4444;
          border-radius: 8px;
          padding: 10px 18px 8px;
          min-height: 58px;
          box-sizing: border-box;
          color: #ef4444;
          font-size: 24px;
          font-weight: 700;
          font-family: 'Malgun Gothic', serif;
          font-style: italic;
          line-height: 1.1;
          transform: rotate(-5deg);
          transform-origin: center;
          background-color: rgba(254, 242, 242, 0.35);
          white-space: nowrap;
          overflow: hidden;
        ">
          ${rawName}(인)
        </div>
      `;
    }

    if (signatureDataUrl === 'stamped_simulated_image') {
      return `
        <div style="
          width: 56px;
          height: 56px;
          border: 2px dashed #ef4444;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #ef4444;
          font-family: 'Malgun Gothic', serif;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.1;
          transform: rotate(-12deg);
          background-color: rgba(254, 242, 242, 0.4);
        ">
          ${emp.name}
        </div>
      `;
    }

    return `<img src="${signatureDataUrl}" style="height: 50px; border-bottom: 1px solid #000; padding: 0 10px;" alt="서명" />`;
  };

  const downloadContractAsPdf = async (emp: Employee, type: 'labor' | 'salary') => {
    setIsGeneratingPdf(`${emp.id}-${type}`);
    
    const contract = type === 'labor' ? emp.laborContract : emp.salaryContract;
    const title = type === 'labor' ? '근로계약서' : '연봉계약서';
    const company = companyTemplates.find(c => c.id === emp.company)?.name || '한일후지코리아(주)';
    const companyStampHtml = renderCompanyStampHtml(getCompanyStampText(company), `company-stamp-${emp.id}-${type}`);

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 15px; font-family: 'Malgun Gothic', sans-serif; color: #333; line-height: 1.4; max-width: 750px; margin: 0 auto; background: white; box-sizing: border-box;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px;">${title}</h1>
        <div style="font-size: 13px; white-space: pre-wrap; margin-bottom: 20px;">${contract.text}</div>
        
        <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <p style="margin-bottom: 8px; font-weight: bold; font-size: 14px;">[사용자(회사)]</p>
              <p style="font-size: 14px; margin-bottom: 5px;">회사명: <strong>${company}</strong></p>
              <div style="margin-top: 5px;">
                ${companyStampHtml}
              </div>
            </div>
            <div style="text-align: right;">
              <p style="margin-bottom: 8px; font-weight: bold; font-size: 14px;">[근로자]</p>
              <p style="font-size: 14px; margin-bottom: 5px;">성명: <strong>${emp.name}</strong></p>
              <p style="font-size: 12px; color: #666; margin-bottom: 15px;">서명 일자: ${contract.signedAt}</p>
              <div style="margin-top: 5px; display: inline-block;">
                ${renderSignatureHtml(emp, contract.signatureDataUrl)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(element);

    const opt = {
      margin:       15,
      filename:     `${emp.name}_${title}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error(e);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      document.body.removeChild(element);
      setIsGeneratingPdf(null);
    }
  };

  const simulateAlimtalk = async (updatedEmp: Employee) => {
    setIsSendingAlimtalk(updatedEmp.id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSendingAlimtalk(null);

    const company = companyTemplates.find(c => c.id === updatedEmp.company)?.name || '한일후지코리아(주)';
    
    setInvitationMessage(
      <div className="bg-[#FAE100] rounded-xl p-5 text-[13px] text-[#371D1E] shadow-xl max-w-sm font-sans relative mx-auto sm:mx-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[#371D1E] text-[#FAE100] rounded-lg flex items-center justify-center text-[10px] font-black tracking-tighter">TALK</div>
          <strong className="font-bold text-sm">{company}</strong>
        </div>
        <div className="space-y-3 leading-relaxed mb-4">
          <p>안녕하세요, <strong>{updatedEmp.name}</strong>님.<br/>{company} 합격을 진심으로 축하드립니다!</p>
          <p>입사 전 작성하셔야 할 <strong>[근로계약서]</strong> 및 <strong>[연봉계약서] 전자서명</strong>과 신규 입사자 가이드가 준비되었습니다.</p>
          <p>아래 링크로 접속하시어 서명을 완료해주시기 바랍니다.</p>
        </div>
        <div className="bg-white/60 rounded-md p-3 mb-4 border border-yellow-400/30">
          <p className="text-[11px] text-gray-500 mb-0.5">🔗 접속 링크</p>
          <p className="text-blue-600 font-medium break-all underline underline-offset-2 text-xs">
            https://onboarding.hanil-fuji.com/invite/{updatedEmp.id}
          </p>
        </div>
        <button className="w-full bg-[#E5CB00] text-[#371D1E] font-bold py-3 rounded-lg text-center hover:bg-[#D4BC00] transition shadow-sm">
          온보딩 허브 접속하기
        </button>
      </div>
    );
    setInvitedEmployeeName(updatedEmp.name);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !startDate) return;

    const realSalaryNum = salary * 10000;
    const newId = `hire-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    
    const company = companyTemplates.find(c => c.id === selectedCompanyId) || companyTemplates[0];

    // Generate initial texts using the selected company's global template
    const [y, m, d] = startDate.split('-');
    const [startYear, startMonth, startDay] = startDate.split('-');
    const contractStartDate = `${startYear}년 ${startMonth}월 ${startDay}일`;
    const templateData = {
      name: name.trim(),
      dept: department,
      team: team.trim() || department,
      startDate: `${y}년 ${m}월 ${d}일`,
      today: contractStartDate,
      contractEndDate: getContractEndDate(startDate),
      salaryTotal: realSalaryNum.toLocaleString('ko-KR'),
      salaryMonthly: Math.floor(realSalaryNum / 12).toLocaleString('ko-KR'),
      salaryBase: Math.floor(realSalaryNum / 12 * 0.8).toLocaleString('ko-KR'),
      salaryOvertime: (Math.floor(realSalaryNum / 12) - Math.floor(realSalaryNum / 12 * 0.8)).toLocaleString('ko-KR'),
    };

    const laborText = replaceTemplates(company.laborContractTemplate, templateData);
    const salaryText = replaceTemplates(company.salaryContractTemplate, templateData);

    const newWorker: Employee = {
      id: newId,
      name: name.trim(),
      hireType,
      probation,
      company: company.id,
      department,
      team: team.trim(),
      position: position.trim(),
      startDate,
      email: email.trim(),
      phone: phone.trim(),
      salary: realSalaryNum,
      laborContract: {
        signed: false,
        signedAt: null,
        signatureDataUrl: null,
        text: laborText,
      },
      salaryContract: {
        signed: false,
        signedAt: null,
        signatureDataUrl: null,
        text: salaryText,
      },
      vehicleNumber: '',
      vehicleModel: '',
      parkingApproved: 'none',
      completedMissions: [],
      sentAt: '',
      status: 'draft',
      memo: '',
    };

    onAddEmployee(newWorker);

    // Reset Form
    setName('');
    setEmail('');
    setPhone('010-');
    setSalary(4000);
    setShowAddForm(false);
  };

  const handleSendSimulate = (emp: Employee) => {
    const company = companyTemplates.find(c => c.id === emp.company)?.name || '한일후지코리아(주)';
    
    setInvitationMessage(
      <div className="bg-[#FAE100] dark:bg-[#FAE100] rounded-xl p-5 text-[13px] text-[#371D1E] shadow-xl max-w-sm font-sans relative mx-auto sm:mx-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[#371D1E] text-[#FAE100] rounded-lg flex items-center justify-center text-[10px] font-black tracking-tighter">TALK</div>
          <strong className="font-bold text-sm text-[#371D1E]">{company}</strong>
        </div>
        <div className="space-y-3 leading-relaxed mb-4 text-[#371D1E]">
          <p>안녕하세요, <strong>{emp.name}</strong>님.<br/>{company} 합격을 진심으로 축하드립니다!</p>
          <p>입사 전 작성하셔야 할 <strong>[근로계약서]</strong> 및 <strong>[연봉계약서] 전자서명</strong>과 신규 입사자 가이드가 준비되었습니다.</p>
          <p>아래 링크로 접속하시어 서명을 완료해주시기 바랍니다.</p>
        </div>
        <div className="bg-white/60 rounded-md p-3 mb-4 border border-yellow-400/30">
          <p className="text-[11px] text-gray-500 mb-0.5">🔗 접속 링크</p>
          <p className="text-blue-600 font-medium break-all underline underline-offset-2 text-xs">
            https://ais-dev/onboarding/ref?id=${emp.id}
          </p>
        </div>
        <button 
          onClick={() => onSelectEmployeeForSimulation(emp)}
          className="w-full bg-[#371D1E] text-[#FAE100] font-bold py-3 rounded-lg text-center hover:opacity-90 transition shadow-sm cursor-pointer"
        >
          온보딩 허브 접속하기
        </button>
      </div>
    );
    setInvitedEmployeeName(emp.name);
  };

  // Math stats computation
  const totalEmployees = employees.length;
  const fullySignedCount = employees.filter(e => e.laborContract.signed && e.salaryContract.signed).length;

  const filteredEmployees = filterCompanyId === 'all' 
    ? employees 
    : employees.filter(emp => emp.company === filterCompanyId);

  return (
    <div id="hr-dashboard-layout" className="space-y-6">
      
      {/* Real-time stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-display font-semibold">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider block">총 신규 입사 예정자</span>
            <strong className="text-2xl font-mono text-gray-950 dark:text-slate-100">{totalEmployees}명</strong>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider block">전자 계약 완료 (2종 전부)</span>
            <strong className="text-2xl font-mono text-green-600 dark:text-green-400">
              {fullySignedCount} / {totalEmployees}명
            </strong>
          </div>
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit transition-colors">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'members' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          입사 예정자 관리
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'templates' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          계약서 양식 관리
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'guide' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <BookOpenCheck className="w-4 h-4" />
          가이드 내용 관리
        </button>
        <button
          onClick={() => setActiveTab('bus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'bus' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Bus className="w-4 h-4" />
          통근버스 관리
        </button>
      </div>

      {activeTab === 'members' ? (
        <>
          {/* Kakao Invitation Overlay simulator */}
          {invitationMessage && (
            <div id="sms-simulated-modal" className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 shadow-inner relative flex flex-col sm:flex-row gap-5 items-start animate-fadeIn">
              <div className="w-11 h-11 rounded-full bg-blue-200/50 dark:bg-blue-800/50 flex-shrink-0 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">📢</div>
              <div className="space-y-2 flex-grow min-w-0">
                <strong className="text-sm font-bold text-blue-950 dark:text-blue-100 block font-display">카카오 알림톡 전송 시뮬레이터 (알리고 API 연동 가상환경)</strong>
                <div className="mt-4">
                  {invitationMessage}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    id="btn-close-sms-modal"
                    onClick={() => setInvitationMessage(null)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
                  >
                    메시지 닫기
                  </button>
                  <span className="text-xs text-blue-400 dark:text-blue-500 pointer-events-none">• 위 노란색 링크를 누르면 해당 신입사원 모드로 원격 접근합니다.</span>
                </div>
              </div>
            </div>
          )}

          {/* Main List & Operations controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <strong className="text-lg font-bold text-gray-900 dark:text-slate-100 block font-display">신규 입사 예정 동료 명단</strong>
                <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">사내에 새롭게 조인하는 동료들의 온보딩 및 계약 체결 상태를 중앙에서 관리합니다.</p>
              </div>

              <div className="flex gap-2">
                <select
                  value={filterCompanyId}
                  onChange={(e) => setFilterCompanyId(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-xs font-bold rounded-2xl py-3 px-4 outline-none focus:border-blue-500 shadow-sm transition hover:border-blue-300 dark:hover:border-slate-600 cursor-pointer"
                >
                  <option value="all">전체 회사 보기</option>
                  {companyTemplates.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  id="btn-toggle-add-form"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 px-5 text-xs font-bold shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>신입 예정자 추가</span>
                </button>
              </div>
            </div>

            {/* Add User Hidden Panel */}
            {showAddForm && (
              <form onSubmit={handleAddSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-150 dark:border-slate-800 space-y-4 text-xs animate-fadeIn font-display transition-colors">
                <strong className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-2 uppercase tracking-wider">새로운 인력 프로필 양식</strong>
                
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">소속 법인</label>
                    <select
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 font-bold text-blue-600 dark:text-blue-400"
                    >
                      {companyTemplates.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">채용 구분</label>
                    <select
                      value={hireType}
                      onChange={(e) => setHireType(e.target.value as '신입' | '경력')}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 font-bold text-gray-700 dark:text-slate-200"
                    >
                      <option value="신입">신입</option>
                      <option value="경력">경력</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">성명</label>
                    <input
                      id="add-emp-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="예: 최진우"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">배속 부서</label>
                    <input
                      id="add-emp-dept"
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="예: Software Eng. 1그룹"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 font-semibold dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">배속 팀(선택)</label>
                    <input
                      id="add-emp-team"
                      type="text"
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      placeholder="예: 백엔드 파트"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 font-semibold dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">진급 직위</label>
                    <input
                      id="add-emp-position"
                      type="text"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="예: 사원 (공채 5기)"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">이메일 주소</label>
                    <input
                      id="add-emp-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@nextcorp.com"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">연락처</label>
                    <input
                      id="add-emp-phone"
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-XXXX-XXXX"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">입사 예정일</label>
                    <input
                      id="add-emp-start-date"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 font-semibold text-blue-700 dark:text-blue-400"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">최초 책정 연봉 (만원 단위)</label>
                    <div className="relative">
                      <input
                        id="add-emp-salary"
                        type="number"
                        min={2000}
                        max={15000}
                        required
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 pr-10 text-xs outline-none focus:border-blue-500 font-bold dark:text-slate-100"
                      />
                      <span className="absolute right-3.5 top-3 text-gray-400 dark:text-slate-500 font-semibold text-[11px]">만원</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 block mb-1">수습 구분</label>
                    <select
                      value={probation}
                      onChange={(e) => setProbation(e.target.value as '100%' | '80%' | '해당없음')}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 font-bold text-gray-700 dark:text-slate-200"
                    >
                      <option value="해당없음">해당없음</option>
                      <option value="100%">100%</option>
                      <option value="80%">80%</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    id="btn-cancel-add-emp"
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium cursor-pointer transition"
                  >
                    작성 취소
                  </button>
                  <button
                    id="btn-confirm-add-emp"
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-2.5 font-bold cursor-pointer transition shadow-lg shadow-blue-500/10"
                  >
                    신입 예정자 등록 (임시저장)
                  </button>
                </div>
              </form>
            )}

            {/* Dynamic Mobile/Desktop Layout for lists */}
            <div className="overflow-x-auto">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-slate-500 text-xs italic">
                  해당 조건에 부합하는 사원이 존재하지 않습니다. 전체 명단을 확인하거나 새롭게 추가해주세요.
                </div>
              ) : (
                <table className="w-full table-auto text-xs text-left text-gray-500 dark:text-slate-400">
                  <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-slate-800 transition-colors">
                    <tr>
                      <th className="px-6 py-4">사원 인적 사항</th>
                      <th className="px-6 py-4">입사 확정일</th>
                      <th className="px-6 py-4 text-center">근로계약서</th>
                      <th className="px-6 py-4 text-center">연봉계약서</th>
                      <th className="px-6 py-4 text-right">인사총무 작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors">
                    {filteredEmployees.map((emp) => {
                      const contractsSigned = emp.laborContract.signed && emp.salaryContract.signed;
                      const company = companyTemplates.find(c => c.id === emp.company) || companyTemplates[0];

                      return (
                        <tr id={`hr-employee-tr-${emp.id}`} key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          
                          {/* Name card */}
                          <td className="px-6 py-4.5">
                            <div className="flex flex-col">
                              <strong className="text-sm text-gray-900 dark:text-slate-100 font-bold flex items-center gap-1.5 leading-tight">
                                {emp.name}
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${emp.hireType === '경력' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                  {emp.hireType || '신입'}
                                </span>
                                {emp.probation && emp.probation !== '해당없음' && (
                                  <span className="text-[10px] bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                                    수습 {emp.probation}
                                  </span>
                                )}
                              </strong>
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">{company.name}</span>
                              <span className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">{emp.department}{emp.team ? ` ${emp.team}` : ''} • {emp.position}</span>
                              <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-3 mt-1.5">
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3 flex-shrink-0" /> {emp.phone}</span>
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3 flex-shrink-0" /> {emp.email}</span>
                              </span>
                              {emp.memo && (
                                <span className="mt-2 text-xs text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                  📝 {emp.memo}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Start Date */}
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            <span className="flex items-center gap-1 font-semibold text-gray-800 dark:text-slate-200">
                              <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                              {emp.startDate}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 block mt-1">계약서 발송: {emp.sentAt || '미등록'}</span>
                          </td>

                          {/* Labor Signed */}
                          <td className="px-6 py-4.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                id={`btn-hr-view-labor-${emp.id}`}
                                onClick={() => onSelectEmployeeForSimulation(emp)}
                                className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full font-semibold cursor-pointer transition ${
                                  emp.laborContract.signed
                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
                                    : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                <span>{emp.laborContract.signed ? '서명완료' : '검토중'}</span>
                              </button>
                              {emp.laborContract.signed && (
                                <button
                                  onClick={() => downloadContractAsPdf(emp, 'labor')}
                                  disabled={isGeneratingPdf === `${emp.id}-labor`}
                                  title="PDF 다운로드"
                                  className="p-1.5 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full transition disabled:opacity-50 cursor-pointer"
                                >
                                  {isGeneratingPdf === `${emp.id}-labor` ? (
                                    <div className="w-4 h-4 border-2 border-green-700/30 border-t-green-700 dark:border-green-400/30 dark:border-t-green-400 rounded-full animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Salary Signed */}
                          <td className="px-6 py-4.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                id={`btn-hr-view-salary-${emp.id}`}
                                onClick={() => onSelectEmployeeForSimulation(emp)}
                                className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full font-semibold cursor-pointer transition ${
                                  emp.salaryContract.signed
                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
                                    : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                <span>{emp.salaryContract.signed ? '서명완료' : '검토중'}</span>
                              </button>
                              {emp.salaryContract.signed && (
                                <button
                                  onClick={() => downloadContractAsPdf(emp, 'salary')}
                                  disabled={isGeneratingPdf === `${emp.id}-salary`}
                                  title="PDF 다운로드"
                                  className="p-1.5 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full transition disabled:opacity-50 cursor-pointer"
                                >
                                  {isGeneratingPdf === `${emp.id}-salary` ? (
                                    <div className="w-4 h-4 border-2 border-green-700/30 border-t-green-700 dark:border-green-400/30 dark:border-t-green-400 rounded-full animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4.5 text-right whitespace-nowrap space-x-1">
                            {emp.status === 'draft' ? (
                              <>
                                <button
                                  id={`btn-edit-emp-${emp.id}`}
                                  onClick={() => handleEditStart(emp)}
                                  title="계약 조건 및 내용 수정"
                                  className="p-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer inline-flex items-center gap-1 hover:bg-gray-50/50 dark:hover:bg-slate-700 transition font-semibold"
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                  <span>수정</span>
                                </button>
                                <button
                                  id={`btn-review-send-${emp.id}`}
                                  onClick={() => handleEditStart(emp)}
                                  className="p-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-500/10 cursor-pointer inline-flex items-center gap-1.5 transition font-bold"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>최종확인/발송</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  id={`btn-edit-emp-${emp.id}`}
                                  onClick={() => handleEditStart(emp)}
                                  title="계약 조건 및 내용 수정"
                                  className="p-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer inline-flex items-center gap-1 hover:bg-gray-50/50 dark:hover:bg-slate-700 transition font-semibold"
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                  <span>수정</span>
                                </button>

                                <button
                                  id={`btn-simulate-msg-${emp.id}`}
                                  onClick={() => handleSendSimulate(emp)}
                                  title="안내 문자 복사 발송 시뮬레이션"
                                  className="p-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer inline-flex items-center gap-1 hover:bg-gray-50/50 dark:hover:bg-slate-700 transition font-semibold"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                  <span>발송 시뮬</span>
                                </button>
                                
                                <button
                                  id={`btn-resend-${emp.id}`}
                                  onClick={() => handleSendInvitation(emp)}
                                  title="알림톡 재발송"
                                  className="p-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 cursor-pointer inline-flex items-center gap-1 transition font-semibold"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>재발송</span>
                                </button>

                                <button
                                  id={`btn-remote-login-${emp.id}`}
                                  onClick={() => onSelectEmployeeForSimulation(emp)}
                                  title="해당 사원으로 보기 모드 접근"
                                  className="p-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-800 cursor-pointer inline-flex items-center gap-1 transition font-bold"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                                  <span>사원대행</span>
                                </button>
                              </>
                            )}

                            <button
                              id={`btn-delete-emp-${emp.id}`}
                              onClick={() => onRemoveEmployee(emp.id)}
                              title="기안 취소 및 삭제"
                              className="p-1 px-2 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer inline-flex items-center transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : activeTab === 'templates' ? (
        /* Template Management Tab */
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyTemplates.map(temp => (
              <div key={temp.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => handleTemplateEditStart(temp)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100">{temp.name}</h4>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">대표이사: {temp.representative}</p>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <span className="text-[11px] font-bold text-gray-600 dark:text-slate-300">근로계약서 양식</span>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <span className="text-[11px] font-bold text-gray-600 dark:text-slate-300">연봉계약서 양식</span>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-5 rounded-3xl text-xs text-blue-800 dark:text-blue-200 flex gap-4 items-start shadow-xs transition-colors">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 transition-colors">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="font-bold block font-display">양식 관리 안내</span>
              <p className="leading-relaxed font-normal">
                각 법인별 계약서 양식에는 <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-[10px]">{`{name}`}</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-[10px]">{`{dept}`}</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-[10px]">{`{salaryTotal}`}</code> 등 치환 코드를 사용할 수 있습니다. 새로운 입사자 등록 시 해당 코드는 입력된 정보로 자동 변환됩니다.
              </p>
            </div>
          </div>
        </div>
      ) : activeTab === 'guide' ? (
        /* Guide Management Tab */
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guideTopics.map(topic => (
              <div key={topic.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
                      <BookOpenCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-slate-100">{topic.title}</h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors">{topic.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {topic.imageUrl && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        <img src={topic.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button
                      onClick={() => handleTopicEditStart(topic)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic transition-colors">
                  {topic.content.substring(0, 150)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'bus' ? (
        /* Bus Management Tab */
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {busRoutes.map(route => (
              <div key={route.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-slate-100">{route.routeName}</h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors">{route.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBusEditStart(route)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300 space-y-2 mt-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-slate-500 font-bold">담당 기사</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{route.driver} ({route.contact})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-slate-500 font-bold">차량 번호</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{route.plate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-slate-500 font-bold">차량 정보</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{route.vehicle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Edit Bus Modal */}
      {editingBusId && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fadeIn transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-display">통근버스 노선 수정</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500">노선명, 정류장, 기사님 연락처 및 차량 번호를 수정합니다.</p>
              </div>
              <button onClick={() => setEditingBusId(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2">노선명</label>
                <input type="text" value={editBusRouteName} onChange={e => setEditBusRouteName(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none focus:border-blue-500 dark:text-slate-100 transition-colors" />
              </div>
              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2">담당 기사님 성함</label>
                <input type="text" value={editBusDriver} onChange={e => setEditBusDriver(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none focus:border-blue-500 dark:text-slate-100 transition-colors" />
              </div>
              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2">연락처</label>
                <input type="text" value={editBusContact} onChange={e => setEditBusContact(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none focus:border-blue-500 dark:text-slate-100 transition-colors" />
              </div>
              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2">차량 번호</label>
                <input type="text" value={editBusPlate} onChange={e => setEditBusPlate(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none focus:border-blue-500 dark:text-slate-100 transition-colors" />
              </div>
              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2">차량 정보 (예: 45인승 리무진)</label>
                <input type="text" value={editBusVehicle} onChange={e => setEditBusVehicle(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none focus:border-blue-500 dark:text-slate-100 transition-colors" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 mt-4">
                  <label className="text-gray-500 dark:text-slate-400 font-bold">정류장</label>
                  <button
                    onClick={() => setEditBusStops([...editBusStops, { name: '', time: '', isMajor: false }])}
                    className="text-blue-500 dark:text-blue-400 text-xs font-bold flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    + 정류장 추가
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {editBusStops.map((stop, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={stop.name}
                        onChange={e => {
                          const newStops = [...editBusStops];
                          newStops[idx].name = e.target.value;
                          setEditBusStops(newStops);
                        }}
                        className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2 outline-none focus:border-blue-500 text-xs dark:text-slate-100 transition-colors"
                        placeholder="정류장명"
                      />
                      <input
                        type="text"
                        value={stop.time}
                        onChange={e => {
                          const newStops = [...editBusStops];
                          newStops[idx].time = e.target.value;
                          setEditBusStops(newStops);
                        }}
                        className="w-20 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2 outline-none focus:border-blue-500 text-xs dark:text-slate-100 transition-colors"
                        placeholder="시간 (예: 07:15)"
                      />
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stop.isMajor}
                          onChange={e => {
                            const newStops = [...editBusStops];
                            newStops[idx].isMajor = e.target.checked;
                            setEditBusStops(newStops);
                          }}
                        />
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">주요거점</span>
                      </label>
                      <button
                        onClick={() => {
                          const newStops = editBusStops.filter((_, i) => i !== idx);
                          setEditBusStops(newStops);
                        }}
                        className="p-1.5 text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 transition-colors">
              <button onClick={() => setEditingBusId(null)} className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold transition-colors">취소</button>
              <button onClick={() => handleBusEditSave(busRoutes.find(r => r.id === editingBusId)!)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-3 font-bold transition flex items-center gap-2"><Save className="w-4 h-4" /><span>저장</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (Simple overlay for contract editing) */}
      {editingEmpId && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-display">계약 조건 및 내용 수정</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500">사원별 맞춤 연봉 및 계약서 문구를 조정할 수 있습니다.</p>
              </div>
              <button onClick={() => setEditingEmpId(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider">책정 연봉 (만원 단위)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={editSalary}
                        onChange={(e) => setEditSalary(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 font-bold dark:text-slate-100 transition-colors"
                      />
                      <span className="absolute right-4 top-4 text-gray-400 dark:text-slate-500 font-semibold">만원</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider">비고 / 메모장</label>
                    <textarea
                      value={editMemo}
                      onChange={(e) => setEditMemo(e.target.value)}
                      placeholder="특이사항이나 메모를 입력하세요"
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider">근로계약서 본문 수정</label>
                    <textarea
                      value={editLaborText}
                      onChange={(e) => setEditLaborText(e.target.value)}
                      rows={12}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-[11px] font-mono leading-relaxed outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:text-slate-300 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-[76px] flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 p-4 rounded-2xl transition-colors">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p className="font-medium leading-snug">연봉 수정 시 아래 연봉계약서의 금액 관련 문구도 함께 수정해주시기 바랍니다.</p>
                  </div>

                  <div>
                    <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider">연봉계약서 본문 수정</label>
                    <textarea
                      value={editSalaryText}
                      onChange={(e) => setEditSalaryText(e.target.value)}
                      rows={12}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-[11px] font-mono leading-relaxed outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:text-slate-300 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 transition-colors">
              <button
                onClick={() => setEditingEmpId(null)}
                className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold cursor-pointer transition-colors"
              >
                취소
              </button>
              
              {(() => {
                const emp = employees.find(e => e.id === editingEmpId);
                if (!emp) return null;
                
                return emp.status === 'draft' ? (
                  <button
                    onClick={async () => {
                      if (!window.confirm(`${emp.name} 사원님께 알리고(Aligo) API 연동을 통해 카카오 알림톡을 발송하시겠습니까?`)) return;
                      const updatedSalary = editSalary * 10000;
                      const updatedEmp: Employee = {
                        ...emp,
                        salary: updatedSalary,
                        laborContract: { ...emp.laborContract, text: editLaborText },
                        salaryContract: { ...emp.salaryContract, text: editSalaryText },
                        status: 'sent',
                        sentAt: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toTimeString().slice(0, 5),
                      };
                      onUpdateEmployee(updatedEmp);
                      setEditingEmpId(null);
                      await simulateAlimtalk(updatedEmp);
                    }}
                    disabled={isSendingAlimtalk === emp.id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl px-8 py-3 font-bold cursor-pointer transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                  >
                    {isSendingAlimtalk === emp.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSendingAlimtalk === emp.id ? '알림톡 발송중...' : '최종 확인 및 알림톡 발송'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditSave(emp)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-3 font-bold cursor-pointer transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>변경 사항 저장</span>
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Global Template Edit Modal */}
      {editingTemplateId && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-display">전역 계약서 양식 수정</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500">"{companyTemplates.find(c => c.id === editingTemplateId)?.name}" 법인의 기본 계약서 템플릿을 관리합니다.</p>
              </div>
              <button onClick={() => setEditingTemplateId(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider">근로계약서 공통 양식</label>
                  <textarea
                    value={editTempLabor}
                    onChange={(e) => setEditTempLabor(e.target.value)}
                    rows={20}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-[10px] font-mono leading-relaxed outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:text-slate-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider">연봉계약서 공통 양식</label>
                  <textarea
                    value={editTempSalary}
                    onChange={(e) => setEditTempSalary(e.target.value)}
                    rows={20}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-[10px] font-mono leading-relaxed outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:text-slate-300 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 transition-colors">
              <button
                onClick={() => setEditingTemplateId(null)}
                className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold cursor-pointer transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  const temp = companyTemplates.find(c => c.id === editingTemplateId);
                  if (temp) handleTemplateEditSave(temp);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-3 font-bold cursor-pointer transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>양식 변경 사항 저장</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Topic Edit Modal */}
      {editingTopicId && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-display">가이드 항목 수정</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500">사원 가이드북에 표시될 내용을 편집합니다.</p>
              </div>
              <button onClick={() => setEditingTopicId(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider text-[10px]">제목</label>
                <input
                  type="text"
                  value={editTopicTitle}
                  onChange={(e) => setEditTopicTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 font-bold dark:text-slate-100 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider text-[10px]">대표 이미지 첨부파일 (자동 최적화)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataUrl = event.target?.result as string;
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const max = 800;
                        if (width > max || height > max) {
                          if (width > height) { height = Math.round(height * (max / width)); width = max; }
                          else { width = Math.round(width * (max / height)); height = max; }
                        }
                        canvas.width = width; canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, width, height);
                        setEditTopicImageUrl(canvas.toDataURL('image/jpeg', 0.8));
                      };
                      img.src = dataUrl;
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-blue-500 dark:text-slate-100 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {editTopicImageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                    <img src={editTopicImageUrl} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <button 
                      onClick={() => setEditTopicImageUrl('')} 
                      className="absolute top-2 right-2 bg-white/80 dark:bg-black/80 rounded-full p-1.5 shadow hover:bg-white dark:hover:bg-black"
                      title="이미지 삭제"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-gray-500 dark:text-slate-400 font-bold block mb-2 uppercase tracking-wider text-[10px]">본문 내용 (마크다운 지원)</label>
                <textarea
                  value={editTopicContent}
                  onChange={(e) => setEditTopicContent(e.target.value)}
                  rows={15}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-mono leading-relaxed outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:text-slate-300 transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 transition-colors">
              <button
                onClick={() => setEditingTopicId(null)}
                className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold cursor-pointer transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  const topic = guideTopics.find(t => t.id === editingTopicId);
                  if (topic) handleTopicEditSave(topic);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-3 font-bold cursor-pointer transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>가이드 저장</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HR help card for zero-trust */}
      <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl text-xs text-slate-500 dark:text-slate-400 flex gap-4 items-start shadow-xs transition-colors">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 block font-display">인사총무팀을 위한 법률 공고 (대한민국 근로기준법 17조)</span>
          <p className="leading-relaxed">
            사업주는 근로계약 체결 시 근로자에게 임금, 소정근로시간, 주휴일 및 연차유급휴가에 관한 주요 사항을 전자문서를 형식으로 전달할 수 있으며 정당히 합의된 전자 서명이 완료되는 즉시 계약서 교부 의무가 정상 처리됩니다. 연봉 보수 조항은 개별 서신 기밀사항이므로 상호 보호에 각별히 유의해주시기 바랍니다.
          </p>
        </div>
      </div>

    </div>
  );
}
