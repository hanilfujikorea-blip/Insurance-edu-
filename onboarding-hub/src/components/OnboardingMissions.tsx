import { CheckSquare, Square, Laptop, FileText, ShieldAlert, Coffee, User, Car, Award, ChevronRight } from 'lucide-react';
import { OnboardingMission, Employee } from '../types';
import { defaultMissions } from '../data/defaultData';

interface OnboardingMissionsProps {
  employee: Employee;
  onToggleMission: (missionId: string) => void;
}

export default function OnboardingMissions({ employee, onToggleMission }: OnboardingMissionsProps) {
  
  const completedCount = employee.completedMissions.filter(mId => 
    defaultMissions.some(m => m.id === mId)
  ).length;

  const totalCount = defaultMissions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Map category to styles
  const getCategoryStyles = (category: OnboardingMission['category']) => {
    switch (category) {
      case 'it':
        return { badge: 'bg-indigo-50 border-indigo-200 text-indigo-700', label: '업무 환경 구축' };
      case 'hr':
        return { badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: '인사 계약 서류' };
      case 'team':
        return { badge: 'bg-purple-50 border-purple-200 text-purple-700', label: '팀 웰컴 네트워킹' };
      case 'general':
        return { badge: 'bg-amber-50 border-amber-200 text-amber-700', label: '교통 및 사내 편의' };
      default:
        return { badge: 'bg-gray-50 border-gray-200 text-gray-700', label: '사내 공통 미션' };
    }
  };

  // Render correct category icon safely
  const renderCategoryIcon = (iconName: string) => {
    const iconSize = "w-5 h-5 flex-shrink-0";
    switch (iconName) {
      case 'Laptop': return <Laptop className={`${iconSize} text-indigo-600`} />;
      case 'FileText': return <FileText className={`${iconSize} text-emerald-600`} />;
      case 'ShieldAlert': return <ShieldAlert className={`${iconSize} text-indigo-600`} />;
      case 'Coffee': return <Coffee className={`${iconSize} text-purple-600`} />;
      case 'User': return <User className={`${iconSize} text-emerald-600`} />;
      case 'Car': return <Car className={`${iconSize} text-amber-600`} />;
      default: return <Award className={`${iconSize} text-gray-600`} />;
    }
  };

  return (
    <div id="onboarding-missions" className="space-y-6">
      
      {/* Dynamic Checklist Header Progress card */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs text-indigo-200 font-bold uppercase tracking-wider block">ONBOARDING CHALLENGE</span>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-300" />
              <span>{employee.name}님의 사내 적응 웰컴 미션</span>
            </h3>
            <p className="text-xs text-indigo-200">
              첫 한 달간 해결해야 할 주요 가이드를 완수해 주세요. 100% 도달 시 소소한 입사 축하 선물이 발송됩니다!
            </p>
          </div>

          <div className="text-right flex-shrink-0 bg-white/10 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-xs text-indigo-200 block">웰컴 미션 스코어</span>
            <strong className="text-xl font-mono text-white tracking-widest">{completedCount} / {totalCount}</strong>
            <span className="text-[10px] text-indigo-300 block">목표 완수율 ({progressPercent}%)</span>
          </div>
        </div>

        {/* Customized Progress Bar */}
        <div className="space-y-2">
          <div className="relative h-2.5 bg-indigo-950 rounded-full overflow-hidden border border-indigo-800/40">
            <div
              id="mission-progress-bar"
              style={{ width: `${progressPercent}%` }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
            />
          </div>
          
          <div className="flex justify-between text-[11px] text-indigo-300">
            <span>첫걸음 내딛기</span>
            {progressPercent === 100 ? (
              <span className="text-emerald-300 font-bold flex items-center gap-1">🙌 모든 온보딩 미션 완수 성공! 수고하셨습니다.</span>
            ) : (
              <span>목표도달률 {progressPercent}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid containing checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defaultMissions.map((mission) => {
          const isCompleted = employee.completedMissions.includes(mission.id);
          const meta = getCategoryStyles(mission.category);

          return (
            <div
              id={`mission-card-${mission.id}`}
              key={mission.id}
              onClick={() => onToggleMission(mission.id)}
              className={`border rounded-2xl p-5 cursor-pointer flex items-start gap-4 transition-all select-none group relative bg-white ${
                isCompleted 
                  ? 'border-emerald-200 bg-emerald-50/10 shadow-inner' 
                  : 'border-gray-150 hover:border-gray-300 hover:shadow-xs shadow-none'
              }`}
            >
              {/* Left selection checklist box */}
              <div className={`mt-1.5 transition flex-shrink-0 ${isCompleted ? 'text-emerald-600 scale-105' : 'text-gray-300 group-hover:text-gray-400'}`}>
                {isCompleted ? (
                  <CheckSquare className="w-5.5 h-5.5" />
                ) : (
                  <Square className="w-5.5 h-5.5" />
                )}
              </div>

              {/* Main Content Info */}
              <div className="space-y-2 flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category icon */}
                  {renderCategoryIcon(mission.icon)}
                  
                  {/* Category Badge */}
                  <span className={`text-[10px] font-bold border rounded px-1.5 py-0.5 uppercase ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>

                <strong className={`text-sm font-bold block truncate leading-tight ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                  {mission.title}
                </strong>

                <p className={`text-xs leading-relaxed ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                  {mission.desc}
                </p>
              </div>

              {/* Animated Right Arrow Indicator on hover */}
              {!isCompleted && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-indigo-500">
                  <ChevronRight className="w-4 h-4 translate-x-1 hover:translate-x-1.5 transition" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {progressPercent === 100 && (
        <div id="mission-completion-congrats" className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center space-y-3 shadow-inner">
          <span className="text-2xl block select-none">🎉 🎁 🎈</span>
          <strong className="text-base font-bold text-emerald-950 block">축하합니다! 한일후지코리아(주) 웰컴 챌린지 성공</strong>
          <p className="text-xs text-emerald-800 leading-relaxed max-w-[480px] mx-auto">
            정보기기 셋업부터 필수 전자 계약 체결 및 버디 미팅까지 신입사원이 이수해야 할 모든 미션을 차질없이 준비 완료하셨습니다. 등록해주신 연락처로 주말 내로 웰컴 버거 모바일 식사 기프티콘이 발송될 예정입니다!
          </p>
        </div>
      )}

    </div>
  );
}
