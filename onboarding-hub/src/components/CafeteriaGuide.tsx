import React, { useState } from 'react';
import { Utensils, Award, ChefHat, Heart, Star, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { defaultCafeteriaMenus } from '../data/defaultData';
import { MealDay, MenuItem } from '../types';

export default function CafeteriaGuide() {
  const [selectedDay, setSelectedDay] = useState<string>('월');
  
  // Simulated feedback logs
  const [feedbacks, setFeedbacks] = useState([
    { name: '이민수 사원', rating: 5, comment: '월요일 수제 돈까스 소스가 정말 풍미가 깊네요! 밥 추가했습니다.', date: '오늘 12:40' },
    { name: '이나경 주임', rating: 4, comment: '점심 숙주볶음 매콤하고 불맛이 나요. 저녁 포케도 기대중입니다.', date: '오늘 12:55' },
    { name: '황지호 선임', rating: 5, comment: '비건 메뉴가 날이 갈수록 업그레이드되네요. 병아리콩 너무 고소합니다.', date: '어제 13:10' }
  ]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [userName, setUserName] = useState('');

  const currentMenu = defaultCafeteriaMenus.find(m => m.day === selectedDay) || defaultCafeteriaMenus[0];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setFeedbacks([
      {
        name: userName.trim() ? `${userName} 사원` : '익명의 신입사원',
        rating: newRating,
        comment: newComment,
        date: '방금 전'
      },
      ...feedbacks
    ]);
    setNewComment('');
    setUserName('');
  };

  const getTypeColor = (type: MenuItem['type']) => {
    switch (type) {
      case 'Korean':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Western':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'Salad/Healthy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getDayName = (day: string) => {
    switch (day) {
      case '월': return '월요일 (Monday)';
      case '화': return '화요일 (Tuesday)';
      case '수': return '수요일 (Wednesday)';
      case '목': return '목요일 (Thursday)';
      case '금': return '금요일 (Friday)';
      default: return day;
    }
  };

  return (
    <div id="cafeteria-guide" className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <span>임직원 사내 식당 & 웰빙 가이드</span>
          </h3>
          <p className="text-xs text-emerald-100">
            신선한 재료와 정갈한 조리 방식으로 매시간 영양가 넘치는 삼시세끼를 임직원 복지로 무상 제공합니다.
          </p>
        </div>

        <div className="flex gap-2 text-xs bg-white/10 p-2.5 rounded-xl border border-emerald-400/20">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span className="font-semibold">중·석식 전액 무료 (외부 게스트는 7,000원 대리결제)</span>
        </div>
      </div>

      {/* 2. Operations & Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-gray-900 block font-semibold mb-0.5">🍳 조식 (Breakfast)</strong>
            <span className="text-gray-500 block">08:00 ~ 08:50</span>
            <span className="text-gray-400">한강라면기, 브레드&우유, 시리얼, 과일팩 테이크아웃 가능</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-gray-900 block font-semibold mb-0.5">🍱 중식 (Lunch)</strong>
            <span className="text-gray-500 block">11:30 ~ 13:30</span>
            <span className="text-gray-400">한식 정찬 및 양식 특식 2개 코너 중 택 1 이용</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 flex-shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-gray-900 block font-semibold mb-0.5">🌙 석식 (Dinner)</strong>
            <span className="text-gray-500 block">18:00 ~ 19:30</span>
            <span className="text-gray-400">야근 근로자 및 저녁식사 권고 대상자 전원 무상 뷔페</span>
          </div>
        </div>
      </div>

      {/* 3. Weekday selector */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Diet Board side */}
        <div className="lg:col-span-8 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs text-emerald-600 font-bold uppercase block tracking-wider">WEEKLY DIET PLAN</span>
              <h4 className="text-lg font-bold text-gray-900">{getDayName(selectedDay)} 식단표</h4>
            </div>

            {/* Selector Buttons */}
            <div className="flex gap-1.5 p-1 bg-gray-100 rounded-lg">
              {['월', '화', '수', '목', '금'].map((d) => (
                <button
                  id={`btn-select-meal-day-${d}`}
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`w-9 h-9 text-xs font-semibold rounded-lg transition-all ${
                    selectedDay === d
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Lunch Card */}
            <div id="meal-card-lunch" className="border border-gray-150 rounded-2xl p-5 bg-gradient-to-b from-gray-50/50 to-white flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">
                    오늘의 LUNCH (중식)
                  </span>
                  <span className={`text-[10px] font-bold border px-2 py-0.5 rounded ${getTypeColor(currentMenu.lunch.type)}`}>
                    {currentMenu.lunch.type === 'Korean' ? '정통한식' : currentMenu.lunch.type === 'Western' ? '양식/퓨전' : '헬스/다이어트'}
                  </span>
                </div>

                <strong className="text-base text-gray-900 block mb-3 font-bold leading-relaxed">
                  {currentMenu.lunch.mainCourse}
                </strong>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">반찬 & 디저트 리스트</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentMenu.lunch.sideDishes.map((side, sIdx) => (
                      <span id={`lunch-side-${sIdx}`} key={sIdx} className="text-xs bg-white border border-gray-100 text-gray-700 rounded-lg py-1 px-2 shadow-sm">
                        {side}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-150 pt-3 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  칼로리 수치:
                </span>
                <span className="font-bold text-gray-900">{currentMenu.lunch.calories} kcal</span>
              </div>
            </div>

            {/* Dinner Card */}
            <div id="meal-card-dinner" className="border border-gray-150 rounded-2xl p-5 bg-gradient-to-b from-gray-50/50 to-white flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full">
                    오늘의 DINNER (석식)
                  </span>
                  <span className={`text-[10px] font-bold border px-2 py-0.5 rounded ${getTypeColor(currentMenu.dinner.type)}`}>
                    {currentMenu.dinner.type === 'Korean' ? '정통한식' : currentMenu.dinner.type === 'Western' ? '양식/퓨전' : '헬스/다이어트'}
                  </span>
                </div>

                <strong className="text-base text-gray-900 block mb-3 font-bold leading-relaxed">
                  {currentMenu.dinner.mainCourse}
                </strong>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">반찬 & 디저트 리스트</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentMenu.dinner.sideDishes.map((side, sIdx) => (
                      <span id={`dinner-side-${sIdx}`} key={sIdx} className="text-xs bg-white border border-gray-100 text-gray-700 rounded-lg py-1 px-2 shadow-sm">
                        {side}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-150 pt-3 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  칼로리 수치:
                </span>
                <span className="font-bold text-gray-900">{currentMenu.dinner.calories} kcal</span>
              </div>
            </div>

          </div>

          <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <AlertCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-950 block">알레르기 보유 임직원 성분 공지</span>
              <p className="leading-relaxed font-normal">
                당사의 모든 요리에는 난류, 우유, 땅콩, 대두, 밀, 게, 새우, 조개류가 직간접적으로 포함되어 정교히 조리될 수 있으니 특정 성분에 대한 알레르기 가이드가 필요하신 경우 영양사실에 사전 문의해주시면 전용 반찬 도시락을 매칭해 드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Live Feedback Communication Column */}
        <div id="cafeteria-feedback-panel" className="lg:col-span-4 bg-white border border-gray-100 p-6 rounded-2xl flex flex-col justify-between max-h-[640px] overflow-hidden lg:w-96 shadow-sm">
          
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div>
              <span className="text-xs text-indigo-600 font-bold block uppercase mb-1">식당 소통 및 리뷰방</span>
              <strong className="text-sm font-semibold text-gray-900 block">오늘 식사는 어떠셨나요?</strong>
              <p className="text-xs text-gray-400 mt-1">사원들이 실시간으로 작성하는 급식의 맛 평가입니다.</p>
            </div>

            {/* Scrollable Feedbacks */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 border-t border-b border-gray-100 py-3 text-xs">
              {feedbacks.map((fb, idx) => (
                <div id={`meal-feedback-card-${idx}`} key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-gray-700">{fb.name}</span>
                    <span className="text-gray-400">{fb.date}</span>
                  </div>
                  <p className="text-gray-600 leading-normal">{fb.comment}</p>
                  <div className="flex text-amber-400">
                    {Array.from({ length: fb.rating }).map((_, rIdx) => (
                      <Star key={rIdx} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Feedback Form */}
          <form onSubmit={handleSubmitFeedback} className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">성명 (선택)</label>
                <input
                  id="meal-comment-username"
                  type="text"
                  maxLength={5}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:bg-white focus:border-emerald-500"
                  placeholder="예: 최팀장"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">식사 별점</label>
                <select
                  id="meal-comment-rating"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-150 rounded-lg px-2.5 py-1.5 text-xs outline-none font-semibold text-amber-600 focus:bg-white"
                >
                  <option value={5}>⭐️⭐️⭐️⭐️⭐️ 5점</option>
                  <option value={4}>⭐️⭐️⭐️⭐️ 4점</option>
                  <option value={3}>⭐️⭐️⭐️ 3점</option>
                  <option value={2}>⭐️⭐️ 2점</option>
                  <option value={1}>⭐️ 1점</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">급식 한줄 평</label>
              <textarea
                id="meal-comment-text"
                rows={2}
                maxLength={80}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-emerald-500 resize-none leading-relaxed"
                placeholder="급식을 드신 후 한 줄 리뷰를 남겨주세요."
              />
            </div>

            <button
              id="btn-submit-meal-comment"
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>오늘의 급식 소통 평가 전송</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
