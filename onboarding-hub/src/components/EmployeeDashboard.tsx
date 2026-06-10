import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, FileSignature, Bus, Utensils, Award, ChevronRight, Calendar, Bell, ShieldCheck, ArrowLeft, RefreshCw, Smartphone, LogOut, BookOpen } from 'lucide-react';
import { Employee, GuideTopic, BusRoute } from '../types';
import ContractSigner from './ContractSigner';
import ShuttleBusGuide from './ShuttleBusGuide';
import CafeteriaGuide from './CafeteriaGuide';
import OnboardingMissions from './OnboardingMissions';
import OnboardingGuide from './OnboardingGuide';
import { defaultMissions } from '../data/defaultData';

interface EmployeeDashboardProps {
  employee: Employee;
  guideTopics: GuideTopic[];
  busRoutes: BusRoute[];
  onSignContract: (contractType: 'labor' | 'salary', signatureDataUrl: string) => void;
  onToggleMission: (missionId: string) => void;
}

export default function EmployeeDashboard({
  employee,
  guideTopics,
  busRoutes,
  onSignContract,
  onToggleMission,
}: EmployeeDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'contracts' | 'bus' | 'meal' | 'missions' | 'guide'>('home');

  // Compute stats
  const laborSigned = employee.laborContract.signed;
  const salarySigned = employee.salaryContract.signed;
  const isContractsCompleted = laborSigned && salarySigned;

  const totalMissionsCount = defaultMissions.length;
  const completedMissionsCount = employee.completedMissions.length;
  const missionProgressPercent = Math.round((completedMissionsCount / totalMissionsCount) * 100);

  // Return to Home helper for deep links
  const handleGoBackToHome = () => {
    setActiveTab('home');
  };

  return (
    <div id="employee-mobile-wrapper" className="w-full flex flex-col items-center justify-center py-4 md:py-8 transition-colors">
      
      {/* Desktop Mode Screen Info label */}
      <div className="hidden md:flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans tracking-wide">
        <Smartphone className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
        <span>실시간 모바일 시뮬레이터 (사원 전용 화면)</span>
      </div>

      {/* Adaptive Smartphone Container */}
      <div className="w-full md:max-w-[420px] md:h-[840px] md:rounded-[54px] md:border-[12px] md:border-slate-900 md:shadow-2xl md:relative md:bg-white dark:md:bg-slate-900 md:overflow-hidden md:flex md:flex-col border-slate-900 shadow-xl bg-slate-50 dark:bg-slate-950 transition-colors">
        
        {/* iOS / S25 Simulated Status Bar */}
        <div className="bg-slate-950 text-white px-6 pt-3.5 pb-2.5 flex items-center justify-between text-[11px] font-semibold tracking-wider select-none shrink-0 z-20 sticky top-0">
          <span className="font-sans font-medium">09:41</span>
          
          {/* Smartphone Camera Notch Bezel Component */}
          <div className="hidden md:block w-28 h-4.5 bg-slate-950 rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2 z-30" />

          <div className="flex items-center gap-1.5 text-slate-300 font-mono scale-90">
            <span className="text-[9px] font-bold border border-slate-700 px-1 rounded-sm">5G</span>
            <div className="flex gap-0.5 items-end h-2.5 pb-0.5">
              <div className="w-0.5 h-1 bg-white rounded-xs" />
              <div className="w-0.5 h-1.5 bg-white rounded-xs" />
              <div className="w-0.5 h-2 bg-white rounded-xs" />
              <div className="w-0.5 h-2.5 bg-white rounded-xs" />
            </div>
            <span className="text-[10px] font-sans">100%</span>
            <div className="w-5 h-2.5 border border-slate-600 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-full bg-emerald-500 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Custom Mobile Header */}
        <div className="bg-slate-900 border-b border-gray-800 text-white px-4 py-3 flex items-center justify-between shrink-0 z-20 relative transition-colors">
          <div className="flex items-center gap-2">
            {activeTab !== 'home' ? (
              <button
                id="btn-mobile-nav-back"
                onClick={handleGoBackToHome}
                className="p-1 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md">
                H
              </div>
            )}
            <div>
              <h3 className="text-xs font-bold leading-tight">
                {activeTab === 'home' && '한일후지 온보딩 홈'}
                {activeTab === 'contracts' && '근로/연봉 전자서명'}
                {activeTab === 'bus' && '통근버스 셔틀 안내'}
                {activeTab === 'meal' && '웰빙 사내 식단표'}
                {activeTab === 'missions' && '사내 적응 웰컴 미션'}
                {activeTab === 'guide' && '신규 입사자 가이드북'}
              </h3>
              <p className="text-[9px] text-blue-400 font-bold font-mono uppercase tracking-widest">
                {activeTab === 'home' ? 'Hanil-Fuji(Korea)' : `${activeTab.toUpperCase()}_SECTION`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative p-1">
              <Bell className="w-4 h-4 text-slate-300" />
              {!isContractsCompleted && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Smartphone Display viewport */}
        <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-slate-950 relative scrollbar-none md:max-h-[715px] transition-colors">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="p-4 space-y-5"
            >
              {activeTab === 'home' && (
                // TAB 1: Onboarding Home
                <div id="mobile-welcome-home" className="space-y-4">
                  
                  {/* Premium Stories/Insta welcome header */}
                  <div className="bg-gradient-to-br from-slate-900 via-zinc-950 to-indigo-950 border border-slate-800 dark:border-slate-700 p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-blue-500/10 to-transparent pointer-events-none" />
                    <div className="space-y-3 relative z-10">
                      <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded-full px-2 py-0.5 uppercase tracking-wider inline-block">
                        웰컴 {employee.name}님 🎉
                      </span>
                      <h2 className="text-base font-bold tracking-tight leading-snug">
                        사우님의 신규 입사를<br />
                        진심으로 환영합니다!
                      </h2>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
                        정식 배속일 <strong className="text-blue-300">{employee.startDate}</strong> 전까지 아래의 필수 전자 계약을 서명 완료해 주세요.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                        <div className="bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg">
                          <span className="text-zinc-400 block">지정 부서</span>
                          <strong className="text-zinc-100 truncate block">{employee.department}</strong>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg">
                          <span className="text-zinc-400 block">지정 직급</span>
                          <strong className="text-zinc-100 truncate block">{employee.position}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary Task Indicator: Documents to sign */}
                  <div className={`border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition bg-white dark:bg-slate-900 shadow-sm ${
                    isContractsCompleted ? 'border-green-100 dark:border-green-900/30 bg-green-50/10 dark:bg-green-900/10' : 'border-amber-200 dark:border-amber-900/30'
                  }`}>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                          isContractsCompleted ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                        }`}>
                          {isContractsCompleted ? '전자서명 완료인증' : '합의서 날인 필요'}
                        </span>
                        <FileSignature className="w-4 h-4 text-blue-500" />
                      </div>
                      <strong className="text-xs font-bold text-slate-800 dark:text-slate-100 block">표준근로 및 연봉 계약 체결</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        계정 발급과 정상 급여 소득 배정이 지연되지 않도록 두 가지 계약 합의 문서 모두 서명을 채워주세요.
                      </p>
                      
                      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] transition-colors">
                        <div className="flex justify-between">
                          <span className="text-slate-550 dark:text-slate-400">1. 표준 근로계약서:</span>
                          <strong className={laborSigned ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                            {laborSigned ? '✓ 서명완료' : '✗ 미서명'}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-550 dark:text-slate-400">2. 연봉 보수계약서:</span>
                          <strong className={salarySigned ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                            {salarySigned ? '✓ 서명완료' : '✗ 미서명'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <button
                      id="btn-welcome-contracts"
                      onClick={() => setActiveTab('contracts')}
                      className="w-full bg-blue-600 hover:bg-blue-750 text-white rounded-xl py-2.5 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1 shadow"
                    >
                      <span>{isContractsCompleted ? '서명된 계약 재검토' : '계약 검토 및 친필 서명'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>


                  {/* Mobile Bento Guide Buttons */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 uppercase font-bold tracking-wider block px-1">실시간 생활정복 백서</span>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        id="bento-onboarding-guide"
                        onClick={() => setActiveTab('guide')}
                        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition cursor-pointer flex flex-col justify-between h-28 hover:shadow-xs transition-colors"
                      >
                        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <strong className="text-xs font-bold text-slate-800 dark:text-slate-100 block">📘 신입사원 필수 가이드</strong>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 block leading-tight mt-0.5">회사 생활에 필요한 모든 수칙과 정보</span>
                        </div>
                      </div>

                      <div
                        id="bento-shuttle-bus"
                        onClick={() => setActiveTab('bus')}
                        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition cursor-pointer flex flex-col justify-between h-28 hover:shadow-xs transition-colors"
                      >
                        <Bus className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        <div>
                          <strong className="text-xs font-bold text-slate-800 dark:text-slate-100 block">🚌 통근버스 셔틀</strong>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 block leading-tight mt-0.5">노선 시간 및 버스 정거장</span>
                        </div>
                      </div>


                    </div>
                  </div>



                </div>
              )}

              {activeTab === 'contracts' && (
                // TAB 2: Contract signing
                <div id="mobile-contracts-tab" className="space-y-4">
                  <div className="bg-slate-100 dark:bg-slate-800/50 p-2.5 rounded-xl text-[10px] text-slate-550 dark:text-slate-400 flex items-center justify-between transition-colors">
                    <span>이전 단계: 모바일 홈</span>
                    <button
                      onClick={handleGoBackToHome}
                      className="bg-white dark:bg-slate-900 dark:text-slate-200 px-2 py-1 rounded border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold active:scale-95 transition"
                    >
                      홈으로 돌려보내기
                    </button>
                  </div>
                  <ContractSigner employee={employee} onSign={onSignContract} />
                </div>
              )}

              {activeTab === 'bus' && (
                // TAB 3: Shuttle guide
                <div id="mobile-bus-tab" className="space-y-4">
                  <ShuttleBusGuide busRoutes={busRoutes} />
                </div>
              )}

              {activeTab === 'meal' && (
                // TAB 4: Cafeteria diet guide
                <div id="mobile-meal-tab" className="space-y-4">
                  <CafeteriaGuide />
                </div>
              )}

              {activeTab === 'missions' && (
                // TAB 6: Welcome checklists
                <div id="mobile-missions-tab" className="space-y-4">
                  <OnboardingMissions employee={employee} onToggleMission={onToggleMission} />
                </div>
              )}

              {activeTab === 'guide' && (
                // TAB 7: Essential guide
                <div id="mobile-guide-tab" className="space-y-4">
                  <OnboardingGuide topics={guideTopics} />
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Real-world Sticky Navigation Tab Bar inside simulated Smartphone frame */}
        <div id="mobile-bottom-tabs" className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-5 pt-2.5 px-1.5 flex justify-around select-none text-[10px] text-slate-450 dark:text-slate-500 z-30 shadow-lg transition-colors">
          {[
            { id: 'home' as const, label: '홈', icon: Home },
            { id: 'contracts' as const, label: '전자계약', icon: FileSignature, highlightBadge: !isContractsCompleted ? 'N' : undefined },
            { id: 'guide' as const, label: '가이드', icon: BookOpen },
            { id: 'bus' as const, label: '통근버스', icon: Bus },
          ].map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                id={`btn-nav-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-1 transition relative cursor-pointer active:scale-95 ${
                  active ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-all ${active ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
                  {tab.highlightBadge && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                  )}
                  {tab.progress && (
                    <span className="absolute -top-1.5 -right-2 bg-indigo-150 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[8px] font-bold px-1 rounded-sm leading-none py-0.5 scale-90">
                      {completedMissionsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Elegant physical Swipe indicator */}
        <div className="hidden md:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-950 dark:bg-slate-700 rounded-full z-40 pointer-events-none transition-colors" />

      </div>

    </div>
  );
}
