/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Users, User, ArrowLeftRight, HelpCircle, Bell, ArrowRight, ClipboardCheck, LogOut, Clock, Globe, Settings, Sun, Moon, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { Employee, CompanyTemplate, GuideTopic, BusRoute } from './types';
import { defaultEmployees, defaultCompanyTemplates, defaultGuideTopics, defaultBusRoutes, getContractEndDate } from './data/defaultData';
import HRDashboard from './components/HRDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import { supabase } from './supabaseClient';

function formatStartDateLabel(startDate: string): string {
  if (!startDate) return '';
  const parts = startDate.split('-');
  if (parts.length < 3) return startDate;
  const [year, month, day] = parts;
  return `${year}년 ${month}월 ${day}일`;
}

function normalizeEmployees(employees: Employee[]): Employee[] {
  return employees.map((employee) => ({
    ...employee,
    laborContract: {
      ...employee.laborContract,
      text: employee.laborContract?.text?.replaceAll('표준근로계약서', '근로계약서') || '',
    },
    salaryContract: {
      ...employee.salaryContract,
      text: employee.salaryContract?.text
        ?.replace(/7\. 본 연봉계약기간은 .*?부터 .*?까지로 한다\./, `7. 본 연봉계약기간은 ${formatStartDateLabel(employee.startDate)}부터 ${getContractEndDate(employee.startDate)}까지로 한다.`)
        .replace(/작성일자:\s*.*$/m, `작성일자: ${formatStartDateLabel(employee.startDate)}`)
        .replaceAll('{contractEndDate}', getContractEndDate(employee.startDate))
        .replaceAll('연봉보수계약서', '연봉계약서')
        .replaceAll('연봉보수조항계약서', '연봉계약서') || '',
    },
  }));
}

export default function App() {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('next_onboarding_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('next_onboarding_theme', theme);
  }, [theme]);

  // Master state starting with pre-loaded mock candidates
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Supabase
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('onboarding_employees')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: Employee[] = data.map(item => ({
            id: item.id,
            name: item.name,
            company: item.company,
            department: item.department,
            team: item.team,
            position: item.position,
            startDate: item.start_date,
            email: item.email,
            phone: item.phone,
            salary: Number(item.salary),
            hireType: item.hire_type,
            probation: item.probation,
            laborContract: item.labor_contract,
            salaryContract: item.salary_contract,
            vehicleNumber: item.vehicle_number,
            vehicleModel: item.vehicle_model,
            parkingApproved: item.parking_approved,
            completedMissions: item.completed_missions,
            sentAt: item.sent_at,
            status: item.status,
            memo: item.memo,
          }));
          setEmployees(normalizeEmployees(mapped));
        } else {
          // If Supabase is empty, use defaults but we won't auto-save them to cloud to prevent clutter
          // Unless the user explicitly interacts.
          setEmployees(normalizeEmployees(defaultEmployees));
        }
      } catch (err) {
        console.error("Error loading from Supabase:", err);
        setEmployees(normalizeEmployees(defaultEmployees));
      } finally {
        setLoading(false);
      }
    }
    loadFromSupabase();
  }, []);

  const [companyTemplates, setCompanyTemplates] = useState<CompanyTemplate[]>(() => {
    return defaultCompanyTemplates; 
  });

  const [guideTopics, setGuideTopics] = useState<GuideTopic[]>(() => {
    const saved = localStorage.getItem('next_onboarding_guide');
    return saved ? JSON.parse(saved) : defaultGuideTopics;
  });

  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(() => {
    const saved = localStorage.getItem('next_onboarding_bus');
    return saved ? JSON.parse(saved) : defaultBusRoutes;
  });

  // Role switching: 'hr_admin' or employee id (e.g. 'hire-2026-001')
  const [activeRole, setActiveRole] = useState<string>('hr_admin');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [empDropdownOpen, setEmpDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setEmpDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persist other state in localStorage
  useEffect(() => {
    localStorage.setItem('next_onboarding_templates', JSON.stringify(companyTemplates));
  }, [companyTemplates]);

  useEffect(() => {
    localStorage.setItem('next_onboarding_guide', JSON.stringify(guideTopics));
  }, [guideTopics]);

  useEffect(() => {
    localStorage.setItem('next_onboarding_bus', JSON.stringify(busRoutes));
  }, [busRoutes]);

  // Clock Update loop
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Style time in KST/Local format
      const kstTime = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }) + ' ' + now.toTimeString().slice(0, 8);
      setCurrentTime(kstTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for state updates (Supabase Integrated)
  const handleAddEmployee = async (newWorker: Employee) => {
    try {
      const { data, error } = await supabase
        .from('onboarding_employees')
        .insert([{
          name: newWorker.name,
          company: newWorker.company,
          department: newWorker.department,
          team: newWorker.team,
          position: newWorker.position,
          start_date: newWorker.startDate,
          email: newWorker.email,
          phone: newWorker.phone,
          salary: newWorker.salary,
          hire_type: newWorker.hireType,
          probation: newWorker.probation,
          labor_contract: newWorker.laborContract,
          salary_contract: newWorker.salaryContract,
          vehicle_number: newWorker.vehicleNumber,
          vehicle_model: newWorker.vehicleModel,
          parking_approved: newWorker.parkingApproved,
          completed_missions: newWorker.completedMissions,
          sent_at: newWorker.sentAt,
          status: newWorker.status,
          memo: newWorker.memo,
        }])
        .select();

      if (error) throw error;
      if (data) {
        const item = data[0];
        const added: Employee = {
          ...newWorker,
          id: item.id,
        };
        setEmployees(prev => [added, ...prev]);
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("데이터 저장 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateEmployee = async (updatedEmp: Employee) => {
    try {
      const { error } = await supabase
        .from('onboarding_employees')
        .update({
          name: updatedEmp.name,
          company: updatedEmp.company,
          department: updatedEmp.department,
          team: updatedEmp.team,
          position: updatedEmp.position,
          start_date: updatedEmp.startDate,
          email: updatedEmp.email,
          phone: updatedEmp.phone,
          salary: updatedEmp.salary,
          hire_type: updatedEmp.hireType,
          probation: updatedEmp.probation,
          labor_contract: updatedEmp.laborContract,
          salary_contract: updatedEmp.salaryContract,
          vehicle_number: updatedEmp.vehicleNumber,
          vehicle_model: updatedEmp.vehicleModel,
          parking_approved: updatedEmp.parkingApproved,
          completed_missions: updatedEmp.completedMissions,
          sent_at: updatedEmp.sentAt,
          status: updatedEmp.status,
          memo: updatedEmp.memo,
        })
        .eq('id', updatedEmp.id);

      if (error) throw error;
      setEmployees(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleUpdateTemplate = (updatedTemplate: CompanyTemplate) => {
    setCompanyTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  const handleUpdateGuideTopic = (updatedTopic: GuideTopic) => {
    setGuideTopics(prev => prev.map(t => t.id === updatedTopic.id ? updatedTopic : t));
  };

  const handleUpdateBusRoute = (updatedRoute: BusRoute) => {
    setBusRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
  };

  const handleRemoveEmployee = async (id: string) => {
    if (window.confirm('정말로 해당 신규 입사 후보 정보를 삭제하시겠습니까?')) {
      try {
        // Supabase UUIDs are 36 chars long
        if (id.length === 36) {
          const { error } = await supabase
            .from('onboarding_employees')
            .delete()
            .eq('id', id);

          if (error) throw error;
        }
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        if (activeRole === id) {
          setActiveRole('hr_admin');
        }
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSignContract = async (employeeId: string, contractType: 'labor' | 'salary', signatureDataUrl: string) => {
    const signedTimestamp = new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toTimeString().slice(0, 8);
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const updated = { ...emp };
    if (contractType === 'labor') {
      updated.laborContract = {
        signed: true,
        signedAt: signedTimestamp,
        signatureDataUrl,
        text: emp.laborContract.text,
      };
    } else {
      updated.salaryContract = {
        signed: true,
        signedAt: signedTimestamp,
        signatureDataUrl,
        text: emp.salaryContract.text,
      };
    }
    
    // Also automatically tick the checklist mission for contracts
    if (updated.laborContract.signed && updated.salaryContract.signed) {
      if (!updated.completedMissions.includes('sign-contracts')) {
        updated.completedMissions = [...updated.completedMissions, 'sign-contracts'];
      }
    }
    
    await handleUpdateEmployee(updated);
  };

  const handleToggleMission = async (employeeId: string, missionId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const isCompleted = emp.completedMissions.includes(missionId);
    const updated = {
      ...emp,
      completedMissions: isCompleted
        ? emp.completedMissions.filter(mId => mId !== missionId)
        : [...emp.completedMissions, missionId],
    };
    await handleUpdateEmployee(updated);
  };

  const handleResetDemoData = () => {
    if (window.confirm('데모 데이터 및 모든 서명을 초기 표준값으로 복원하시겠습니까? (로컬 캐시만 초기화됩니다)')) {
      localStorage.removeItem('next_onboarding_employees');
      window.location.reload();
    }
  };

  // Get active employee object for the candidate mode
  const currentEmployee = employees.find(emp => emp.id === activeRole);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-400 font-bold animate-pulse">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans select-none transition-colors duration-300">
      
      {/* Top Header Utilities: Switch Role and Live Clock */}
      <header id="main-utility-header" className="bg-slate-900 dark:bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo Brand titles */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-500/20">
              H
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight font-display">한일후지코리아(주)</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block font-mono">HANIL-FUJI(KOREA) ONBOARDING HUB</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Interactive Role Switcher Rail (The highlight for testing both flows!) */}
            <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-300 font-semibold select-none border-r border-slate-800 mr-1">
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">시뮬레이션 모드 전환:</span>
              </div>

              {/* HR Admin Choice */}
              <button
                id="switcher-role-hr-admin"
                onClick={() => setActiveRole('hr_admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                  activeRole === 'hr_admin'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>인사총무팀</span>
              </button>

              {/* Employee Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  id="switcher-role-emp-dropdown-btn"
                  onClick={() => setEmpDropdownOpen(!empDropdownOpen)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                    activeRole !== 'hr_admin'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-white bg-slate-800/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {activeRole !== 'hr_admin' && employees.find(e => e.id === activeRole)
                      ? `${employees.find(e => e.id === activeRole)!.name}`
                      : `입사자 선택`
                    }
                  </span>
                  <span className="text-[10px] ml-0.5 opacity-70">
                    ({employees.length}명)
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${empDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown List */}
                {empDropdownOpen && (
                  <div
                    id="emp-dropdown-list"
                    className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[999]"
                  >
                    <div className="p-2 border-b border-slate-800">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2">입사 예정자 목록</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {employees.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">등록된 입사자가 없습니다</p>
                      ) : (
                        employees.map((emp) => {
                          const isSigned = emp.laborContract.signed && emp.salaryContract.signed;
                          const isActive = activeRole === emp.id;
                          return (
                            <button
                              id={`switcher-role-emp-${emp.id}`}
                              key={emp.id}
                              onClick={() => { setActiveRole(emp.id); setEmpDropdownOpen(false); }}
                              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-800 transition cursor-pointer ${
                                isActive ? 'bg-emerald-900/30' : ''
                              }`}
                            >
                              {isSigned
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                              }
                              <div className="min-w-0">
                                <p className={`text-xs font-bold leading-tight ${
                                  isActive ? 'text-emerald-300' : 'text-slate-200'
                                }`}>
                                  {emp.name}
                                  {isSigned && <span className="ml-1 text-emerald-400">✓</span>}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {emp.startDate} · {emp.department}
                                </p>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Top level real clock & Theme Toggle */}
            <div className="hidden lg:flex flex-col items-end gap-2 min-w-[200px]">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all text-[10px] font-bold cursor-pointer"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3 h-3 text-blue-400" />
                    <span>다크모드로 전환</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3 text-yellow-400" />
                    <span>라이트모드로 전환</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* View switching logic */}
        {activeRole === 'hr_admin' ? (
          // Option 1: Render Admin Suite
          <div id="view-admin-dashboard" className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-150 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-display">신규 영입 인재 온보딩 관제 센터</h2>
              </div>
              <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                인사총무팀 권한 작동 중
              </span>
            </div>

            <HRDashboard
              employees={employees}
              companyTemplates={companyTemplates}
              guideTopics={guideTopics}
              busRoutes={busRoutes}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onUpdateTemplate={handleUpdateTemplate}
              onUpdateGuideTopic={handleUpdateGuideTopic}
              onUpdateBusRoute={handleUpdateBusRoute}
              onRemoveEmployee={handleRemoveEmployee}
              onSelectEmployeeForSimulation={(emp) => setActiveRole(emp.id)}
            />
          </div>
        ) : currentEmployee ? (
          // Option 2: Render selected employee dashboard
          <div id="view-employee-dashboard" className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-150 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">{currentEmployee.name} {currentEmployee.position.split(/[\s(]/)[0]}의 온보딩 허브</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">근로자는 계약 내용을 체결하고 사내 복지 일정을 확인하십시오.</p>
              </div>
              
              {/* Back to admin button */}
              <button
                id="btn-return-to-admin"
                onClick={() => setActiveRole('hr_admin')}
                className="bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-xl py-1.5 px-3 border border-gray-200 dark:border-slate-700 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-gray-400" />
                <span>관리자 모드로 돌아가기</span>
              </button>
            </div>

            <EmployeeDashboard
              employee={currentEmployee}
              guideTopics={guideTopics}
              busRoutes={busRoutes}
              onSignContract={(contractType, signatureDataUrl) => handleSignContract(currentEmployee.id, contractType, signatureDataUrl)}
              onToggleMission={(missionId) => handleToggleMission(currentEmployee.id, missionId)}
            />
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 italic text-xs">
            해당 사원을 찾을 수 없거나 데이터베이스가 삭제되었습니다. 대행 관리자 모드로 진입합니다.
            <button
              onClick={() => setActiveRole('hr_admin')}
              className="mt-4 bg-blue-600 text-white rounded-xl py-2 px-4 block mx-auto text-xs font-semibold cursor-pointer"
            >
              어드민 바로가기
            </button>
          </div>
        )}

      </main>

      {/* Footer Branding credits */}
      <footer id="main-footer" className="bg-white dark:bg-slate-900 border-t border-gray-150 dark:border-slate-800 py-8 text-center text-xs text-gray-400 mt-12 space-y-2">
        <p className="font-semibold text-gray-500 dark:text-slate-400">© {new Date().getFullYear()} 한일후지코리아(주) All Rights Reserved.</p>
        <p className="leading-relaxed font-normal max-w-md mx-auto scale-90">
          본 플랫폼은 사내 보안 망을 경유하여 접근되며 모든 서명 기록 및 승인 내역은 암호화 데이터베이스에 백업 관리 보존됩니다.
        </p>
      </footer>

    </div>
  );
}
