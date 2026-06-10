import React, { useState } from 'react';
import { Bus, MapPin, Clock, ShieldCheck, Phone, Search, HelpCircle, ArrowRight } from 'lucide-react';
import { BusRoute } from '../types';

interface ShuttleBusGuideProps {
  busRoutes: BusRoute[];
}

export default function ShuttleBusGuide({ busRoutes }: ShuttleBusGuideProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(busRoutes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const activeRoute = busRoutes.find(r => r.id === selectedRouteId) || busRoutes[0];

  if (!activeRoute) return null;

  // Search for stops across all routes
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const matchingStops = searchQuery.trim() === '' ? [] : busRoutes.flatMap(route => 
    route.stops.map(stop => ({
      ...stop,
      routeName: route.routeName,
      routeId: route.id
    })).filter(stop => stop.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="shuttle-bus-guide" className="space-y-6">
      
      {/* Search and Header Header */}
      <div className="flex flex-col justify-between gap-4 bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-sm">
        <div className="space-y-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Bus className="w-5 h-5 text-indigo-400" />
            <span>임직원 통근 버스 안내</span>
          </h3>
        </div>

        {/* Dynamic Bus Search Input */}
        <form onSubmit={handleSearch} className="relative w-full">
          <div className="relative">
            <input
              id="search-shuttle-stops"
              type="text"
              placeholder="내 인근 정류장명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white bg-opacity-10 hover:bg-opacity-15 border border-indigo-400/30 rounded-xl py-2 pl-10 pr-4 text-xs text-indigo-100 placeholder-indigo-300 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white focus:text-indigo-900 focus:placeholder-indigo-400 transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-indigo-300" />
          </div>
        </form>
      </div>

      {/* Query Search Results Dropdown-Like Overlay inside flow */}
      {searchQuery.trim() !== '' && (
        <div id="shuttle-search-results" className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs">
          <strong className="text-amber-900 block mb-2 font-semibold">🔍 정류장 정밀 검색 결과 ({matchingStops.length}건):</strong>
          {matchingStops.length > 0 ? (
            <div className="flex flex-col gap-3">
              {matchingStops.map((stop, sIdx) => (
                <div
                  id={`search-stop-card-${sIdx}`}
                  key={sIdx} 
                  onClick={() => {
                    setSelectedRouteId(stop.routeId);
                    setSearchQuery('');
                  }}
                  className="bg-white p-3 rounded-lg border border-amber-200 hover:border-indigo-400 transition cursor-pointer flex justify-between items-center group"
                >
                  <div>
                    <span className="font-semibold text-gray-900 block group-hover:text-indigo-600 font-medium">{stop.name}</span>
                    <span className="text-[10px] text-gray-400 block">{stop.routeName}</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">
                    {stop.time} 출발
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 italic block">검색 결과가 존재하지 않습니다. 동 이름이나 역 이름을 간단히 입력바랍니다.</span>
          )}
        </div>
      )}

      {/* Main Bus Guides Grid */}
      <div className="flex flex-col gap-6">
        
        {/* Navigation / List Side */}
        <div id="shuttle-routes-rail" className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">상행 주요 노선 라인업</h4>
          
          <div className="space-y-2">
            {busRoutes.map((route) => {
              const active = selectedRouteId === route.id;
              return (
                <button
                  id={`btn-select-route-${route.id}`}
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/10'
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                      active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {route.id === 'route-gangnam' ? 'A LINE' : route.id === 'route-bundang' ? 'B LINE' : 'C LINE'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {route.duration}
                    </span>
                  </div>
                  
                  <span className="text-sm font-semibold text-gray-900 block my-1">
                    {route.routeName}
                  </span>

                  <span className="text-xs text-gray-400 block truncate">
                    {route.plate} • {route.driver}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Boarding FAQ Card */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-1 text-amber-800 font-semibold mb-1">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>통근버스 탑승 주의사항</span>
            </div>
            <p className="leading-relaxed">
              정원 초과 시 서서 운행할 수 없으므로(고속도로 통과 노선), 정해진 출발 시각보다 최소 3분 전에 여유있게 대기해주시기 바랍니다.
            </p>
            <p className="leading-relaxed font-medium text-amber-700">
              ※ 전 노선 요금은 무료(사원증 스캔 불필요)입니다.
            </p>
          </div>
        </div>

        {/* Visual Route Timeline Details */}
        <div id="shuttle-route-detail-panel" className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
          
          {/* Top Panel Banner */}
          <div className="flex flex-col justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider block">SELECTED ROUTE</span>
              <h4 className="text-lg font-bold text-gray-900">{activeRoute.routeName}</h4>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Bus className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-800">{activeRoute.plate}</span>
            </div>
          </div>

          {/* Bus Driver & Vehicle Info */}
          <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm text-gray-500">
                <Phone className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">운행 담당 / 비상 연락처</span>
                <span className="text-xs font-semibold text-gray-800 block">{activeRoute.driver} ({activeRoute.contact})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">차량 기종 정보</span>
                <span className="text-xs font-semibold text-gray-800 block truncate">{activeRoute.vehicle}</span>
              </div>
            </div>
          </div>

          {/* Custom Graphical Stop Timeline */}
          <div>
            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">정류장</h5>
            
            <div id="shuttle-timeline" className="relative pl-6 space-y-6">
              
              {/* Vertical Connector Line */}
              <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-indigo-100" />

              {activeRoute.stops.map((stop, idx) => (
                <div id={`timeline-stop-step-${idx}`} key={idx} className="relative flex items-start gap-4">
                  
                  {/* Pin Circle Indicator */}
                  <div className={`absolute -left-[23px] w-[18px] h-[18px] rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                    stop.isMajor 
                      ? 'border-indigo-600 ring-4 ring-indigo-50' 
                      : 'border-indigo-300'
                  }`}>
                    {stop.isMajor && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </div>

                  {/* Station Details */}
                  <div className="bg-gray-50/50 hover:bg-gray-50 hover:border-gray-150 p-3.5 rounded-xl border border-gray-100 flex-1 flex flex-col gap-3 transition">
                    <div>
                      <span className="text-xs text-gray-400 uppercase block mb-1">STOP 0{idx + 1} {stop.isMajor && '• 주요 거점'}</span>
                      <strong className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        {stop.name}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 shadow-sm rounded-lg py-1.5 px-3 w-fit text-xs text-indigo-700 font-bold self-start">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{stop.time} 정시 출발</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Guide Help Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-100 text-xs text-teal-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 font-bold">!</div>
            <div>
              <p className="font-semibold text-teal-950 mb-0.5">퇴근 버스 운행 안내</p>
              <p className="text-teal-900/80 leading-relaxed">
                하행(퇴근) 셔틀버스는 <strong>매주 월요일~금요일 저녁 18:10(본사 사무동 앞)</strong>에 동시 일괄 상행의 역순으로 출발 운행합니다.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
