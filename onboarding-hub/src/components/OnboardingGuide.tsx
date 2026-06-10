import { useState } from 'react';
import { BookOpen, Clock, Coffee, ShieldCheck, Car, Mail, Info, ChevronRight, Smartphone, UserCheck } from 'lucide-react';
import { GuideTopic } from '../types';

interface OnboardingGuideProps {
  topics: GuideTopic[];
}

export default function OnboardingGuide({ topics }: OnboardingGuideProps) {
  const [selectedTopic, setSelectedTab] = useState<string | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'work-time': return Clock;
      case 'focus-time': return ShieldCheck;
      case 'cafeteria': return Coffee;
      case 'parking': return Car;
      case 'benefits': return UserCheck;
      case 'system': return Mail;
      default: return Info;
    }
  };

  const getColor = (id: string) => {
    switch (id) {
      case 'work-time': return { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' };
      case 'focus-time': return { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30' };
      case 'cafeteria': return { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' };
      case 'parking': return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' };
      case 'benefits': return { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' };
      case 'system': return { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' };
      default: return { text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/50' };
    }
  };

  // Simple Markdown-like renderer for the content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h4 key={i} className="font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2 first:mt-0">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc text-xs text-slate-600 dark:text-slate-300 mb-1">{line.replace('- ', '')}</li>;
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return <li key={i} className="ml-4 list-decimal text-xs text-slate-600 dark:text-slate-300 mb-1">{line.substring(3)}</li>;
      }
      
      // Handle bold
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-blue-700 dark:text-blue-400">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return <p key={i} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-1">{renderedLine}</p>;
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">신규 입사자 가이드북</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Employee Essentials Guide</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-relaxed">
            한일후지코리아 사우님들의 빠른 적응을 돕기 위한 필수 안내 자료입니다.<br/>
            분실 걱정 없이 언제든 여기서 확인하세요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {topics.map((topic) => {
          const Icon = getIcon(topic.id);
          const colors = getColor(topic.id);
          const isOpen = selectedTopic === topic.id;

          return (
            <div 
              key={topic.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen ? 'border-blue-400 ring-4 ring-blue-50 dark:ring-blue-900/20 shadow-md' : 'border-slate-150 dark:border-slate-800'
              }`}
            >
              <button
                onClick={() => setSelectedTab(isOpen ? null : topic.id)}
                className="w-full flex items-center justify-between p-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <strong className="text-sm text-slate-800 dark:text-slate-100 block">{topic.title}</strong>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tighter">{topic.category}</span>
                  </div>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 pt-0 animate-fadeIn">
                  <div className="h-px bg-slate-100 dark:bg-slate-800 mb-4" />
                  
                  {topic.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-slate-150 dark:border-slate-800">
                      <img 
                        src={topic.imageUrl} 
                        alt={topic.title} 
                        className="w-full h-auto object-cover max-h-48"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    {renderContent(topic.content)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 dark:bg-black p-5 rounded-3xl text-white flex gap-4 items-center shadow-lg">
        <Info className="w-6 h-6 text-blue-400 shrink-0" />
        <p className="text-[10px] text-slate-300 leading-relaxed">
          가이드 내용 중 궁금하신 점은 각 담당 부서 혹은 <strong>인사총무팀(내선 2055)</strong>으로 문의해 주시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
