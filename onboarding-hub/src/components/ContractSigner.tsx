import React, { useState, useRef, useEffect } from 'react';
import { FileText, Edit3, Trash2, CheckSquare, Square, ThumbsUp, AlertCircle, FileSignature } from 'lucide-react';
import { Employee } from '../types';
import { defaultCompanyTemplates, getCompanyStampText } from '../data/defaultData';

interface ContractSignerProps {
  employee: Employee;
  onSign: (contractType: 'labor' | 'salary', signatureDataUrl: string) => void;
}

export default function ContractSigner({ employee, onSign }: ContractSignerProps) {
  const [activeType, setActiveType] = useState<'labor' | 'salary'>('labor');
  const [signMethod, setSignMethod] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(employee.name);
  const [selectedFont, setSelectedFont] = useState<string>('font-serif italic text-blue-600');
  const [agree, setAgree] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHasData, setCanvasHasData] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const contract = activeType === 'labor' ? employee.laborContract : employee.salaryContract;
  const oppositeContract = activeType === 'labor' ? employee.salaryContract : employee.laborContract;
  const companyName = defaultCompanyTemplates.find((company) => company.id === employee.company)?.name || '한일후지코리아(주)';
  const companyStampText = getCompanyStampText(companyName);

  const employmentTypeLabel = (() => {
    if (!employee.probation || employee.probation === '해당없음') {
      return '정규직';
    }

    return `정규직 (수습 3개월, ${employee.probation})`;
  })();

  // Initialize canvas context
  useEffect(() => {
    if (signMethod === 'draw' && !contract.signed) {
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [signMethod, activeType, contract.signed]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Support high DPI screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    const isDarkMode = document.documentElement.classList.contains('dark');

    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = isDarkMode ? '#e2e8f0' : '#1e293b'; // slate-200 in dark, slate-800 in light
    context.lineWidth = 3;
    contextRef.current = context;
    clearCanvas();
  };

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      if (event.touches.length === 0) return null;
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(event);
    if (!coords) return;

    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(coords.x, coords.y);
      setIsDrawing(true);
      setCanvasHasData(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    event.preventDefault(); // Prevents scrolling on mobile

    const coords = getCoordinates(event);
    if (!coords) return;

    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasHasData(false);
  };

  const handleSignSubmit = () => {
    if (!agree) return;

    let finalSignatureUrl = '';

    if (signMethod === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !canvasHasData) return;
      finalSignatureUrl = canvas.toDataURL();
    } else {
      if (!typedName.trim()) return;
      finalSignatureUrl = `typed:${typedName}:${selectedFont}`;
    }

    onSign(activeType, finalSignatureUrl);
    setAgree(false); // Reset for next
    clearCanvas();
  };

  const renderSignature = (sigUrl: string | null) => {
    if (!sigUrl) return null;

    if (sigUrl.startsWith('typed:')) {
      const parts = sigUrl.split(':');
      const text = parts[1] || employee.name;
      const fontClass = parts[2] || 'font-serif italic';
      return (
        <span id={`signature-typed-${employee.id}`} className={`text-xl font-bold border-2 border-red-500 rounded px-3 py-1 text-red-500 transform -rotate-6 select-none bg-red-50/30 inline-block dark:border-red-400 dark:text-red-400 dark:bg-red-900/20 ${fontClass}`}>
          {text} (인)
        </span>
      );
    }

    if (sigUrl === 'stamped_simulated_image') {
      return (
        <span id={`signature-default-${employee.id}`} className="text-lg font-bold border-2 border-dashed border-red-500 rounded-full w-14 h-14 flex items-center justify-center text-red-500 font-serif transform -rotate-12 bg-red-50/40 select-none dark:border-red-400 dark:text-red-400 dark:bg-red-900/20">
          {employee.name}
        </span>
      );
    }

    return (
      <img
        id={`signature-image-${employee.id}`}
        src={sigUrl}
        alt="Handwritten signature"
        className="max-h-16 max-w-full object-contain pointer-events-none filter drop-shadow dark:invert-[0.15] dark:brightness-150"
      />
    );
  };

  return (
    <div id="contract-signer-panel" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col space-y-4 p-4 transition-colors">
      
      {/* 1. Document Selection Group */}
      <div id="contract-selector" className="space-y-3">
        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block font-display">
          근로·연봉 전자기술 계약 문서선택
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'labor' as const, label: '근로계약서', state: employee.laborContract },
            { id: 'salary' as const, label: '연봉계약서', state: employee.salaryContract },
          ].map((btn) => {
            const isActive = activeType === btn.id;
            return (
              <button
                id={`btn-toggle-contract-${btn.id}`}
                key={btn.id}
                onClick={() => setActiveType(btn.id)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-slate-350 dark:hover:border-slate-500'
                }`}
              >
                <span className="text-[11px] block">{btn.label}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  btn.state.signed
                    ? isActive ? 'bg-blue-700 text-blue-100' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold border border-green-200 dark:border-green-800'
                    : isActive ? 'bg-blue-500 text-blue-100' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800 animate-pulse'
                }`}>
                  {btn.state.signed ? '서명완료' : '날인대기'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Compact Contract Summary Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-150 dark:border-slate-800 text-[10px] grid grid-cols-[0.88fr_1.12fr] gap-x-2.5 gap-y-1 text-slate-600 dark:text-slate-300 font-display transition-colors">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-1 border-b border-slate-100 dark:border-slate-800 pb-1 min-w-0">
          <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap">대상 사원:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{employee.name}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-1 border-b border-slate-100 dark:border-slate-800 pb-1 min-w-0">
          <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap">소속 부서:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-right truncate">{employee.department}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-1 pt-0.5 min-w-0">
          <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap">입사 예정:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">{employee.startDate}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-start gap-x-1 pt-0.5 min-w-0">
          <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap">근로 형태:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap text-[9px]">{employmentTypeLabel}</span>
        </div>
        {activeType === 'salary' && (
          <div className="col-span-2 flex justify-between border-t border-dashed border-slate-250 dark:border-slate-700 pt-1.5 text-blue-600 dark:text-blue-400 font-bold">
            <span>책정 연봉 보수액:</span>
            <span>₩{employee.salary.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* 3. Paper Document Viewer */}
      <div id="contract-view" className="flex flex-col space-y-2">
        <div className="flex justify-between items-center text-xs px-1 font-display">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <FileSignature className="w-3.5 h-3.5 text-blue-500" />
            {activeType === 'labor' ? '근로계약서' : '연봉계약서'}
          </span>
          {contract.signed && contract.signedAt && (
            <span className="text-[10px] text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/30 border border-green-150 dark:border-green-800 px-2 py-0.5 rounded-full">
              {contract.signedAt}
            </span>
          )}
        </div>

        {/* Paper Backdrop */}
        <div id="contract-paper" className="bg-amber-50/15 dark:bg-slate-950 border border-amber-900/10 dark:border-slate-800 p-4 rounded-xl font-sans text-[11px] leading-relaxed whitespace-pre-line shadow-inner max-h-[175px] overflow-y-auto relative select-text selection:bg-amber-100 dark:selection:bg-blue-900 text-slate-700 dark:text-slate-300 transition-colors">
          {contract.text}
          
          <div className="mt-6 flex justify-between items-end border-t border-gray-200/60 dark:border-slate-800 pt-4 text-[10px]">
            <div>
              <span className="text-gray-450 dark:text-slate-500 text-[9px] block">사업주 (갑)</span>
              <span className="font-semibold text-gray-700 dark:text-slate-200">{companyName}</span>
              <div className="mt-2 flex justify-end">
                {(() => {
                  // PDF와 동일한 letterSpacing 자동 계산 (빈칸 없이 원호에 꽉 차게)
                  const charCount = companyStampText.length;
                  const circleCirc = 2 * Math.PI * 34;
                  const charWidth = 8.5;
                  const totalCharWidth = charCount * charWidth;
                  const spacing = Math.max(0, (circleCirc - totalCharWidth) / Math.max(charCount - 1, 1));
                  const letterSpacingVal = Math.min(spacing, 6).toFixed(1);
                  return (
                    <div className="w-24 h-24 text-red-500 dark:text-red-400 transform -rotate-12 select-none drop-shadow-sm">
                      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        <defs>
                          <path id={`company-stamp-ring-${employee.id}`} d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
                        </defs>
                        {/* 외곽 원 */}
                        <circle cx="50" cy="50" r="42" fill="rgba(254, 242, 242, 0.4)" stroke="currentColor" strokeWidth="3" />
                        {/* 내부 점선 원 */}
                        <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2.5" />
                        {/* 회사명 텍스트 (원호 따라 배치) */}
                        <text fill="currentColor" fontSize="8.5" fontWeight="800" letterSpacing={letterSpacingVal}>
                          <textPath href={`#company-stamp-ring-${employee.id}`} startOffset="50%" textAnchor="middle">
                            {companyStampText}
                          </textPath>
                        </text>
                        {/* 중앙 인 텍스트 */}
                        <text x="50" y="57" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="900" fontFamily="serif">
                          印
                        </text>
                      </svg>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div id="signee-stamp-area" className="text-right">
              <span className="text-gray-450 dark:text-slate-500 text-[9px] block">근로자 (을)</span>
              <span className="font-semibold text-gray-700 dark:text-slate-200">{employee.name}</span>
              <div className="mt-1 h-10 flex items-center justify-end">
                {contract.signed ? (
                  renderSignature(contract.signatureDataUrl)
                ) : (
                  <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-400/60 dark:border-amber-800 border-dashed rounded bg-amber-50 dark:bg-amber-950 px-2 py-0.5 select-none animate-pulse">
                    날인 대기
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {!contract.signed && (
          <div className="flex items-start gap-1.5 text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-900/20 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 text-[10px] leading-snug">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <span>하단 합의 날인판에서 합의 서화 도안 또는 날인명을 선택 완료한 뒤 승인하실 수 있습니다.</span>
          </div>
        )}
      </div>

      {/* 4. Interactive Signing Canvas/Form Stack */}
      <div id="contract-acting-area" className="bg-white dark:bg-slate-900 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors">
        {contract.signed ? (
          // Signed Success State
          <div id="already-signed-display" className="bg-emerald-50/45 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center shadow-inner">
              <CheckSquare className="w-5 h-5 animate-bounce" />
            </div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100 font-display">본 문서 합의 및 날인 완료</h4>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-snug max-w-[280px]">
              {employee.name}님의 {activeType === 'labor' ? '근로계약서' : '연봉계약서'} 수기 날인이 완료되었습니다.
            </p>
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg p-2.5 w-full text-left">
              <span className="text-[8px] font-bold text-gray-400 dark:text-slate-500 block uppercase font-mono tracking-wider">전자 인증 해시코드</span>
              <span className="font-mono text-[8.5px] text-slate-400 dark:text-slate-500 break-all select-all block leading-tight">
                SECURE_HASH_{employee.id}_{activeType.toUpperCase()}_SIGNED_PASS
              </span>
            </div>
            {!oppositeContract.signed && (
              <button
                id="btn-goto-other-contract"
                onClick={() => setActiveType(activeType === 'labor' ? 'salary' : 'labor')}
                className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold cursor-pointer underline decoration-dotted font-display"
              >
                남은 계약서 서명 바로가기 →
              </button>
            )}
          </div>
        ) : (
          // Active Signing Panel
          <div className="space-y-4">
            {/* Toggle Draw / Type Stamp */}
            <div id="sign-method-toggle-group" className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[11px] font-semibold transition-colors">
              <button
                id="tab-sign-method-draw"
                onClick={() => setSignMethod('draw')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  signMethod === 'draw'
                    ? 'bg-white dark:bg-slate-700 text-gray-950 dark:text-white shadow-sm font-bold'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-950 dark:hover:text-slate-200'
                }`}
              >
                가비 서명 그리기
              </button>
              <button
                id="tab-sign-method-type"
                onClick={() => setSignMethod('type')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  signMethod === 'type'
                    ? 'bg-white dark:bg-slate-700 text-gray-950 dark:text-white shadow-sm font-bold'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-950 dark:hover:text-slate-200'
                }`}
              >
                도장 자동생성
              </button>
            </div>

            {/* Signing Container */}
            {signMethod === 'draw' ? (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 px-1">
                  <span>터치 스크린 또는 마우스로 그리세요</span>
                  <button
                    id="btn-clear-canvas"
                    onClick={clearCanvas}
                    className="text-gray-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition flex items-center gap-1 font-semibold cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 전체 지우기
                  </button>
                </div>
                <div className="relative border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden h-32 transition-colors">
                  <canvas
                    id="signature-draw-canvas"
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 cursor-crosshair w-full h-full touch-none"
                  />
                  {!canvasHasData && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-gray-350 dark:text-slate-600 text-[11px]">
                      여기에 수기 서명을 하십시오
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">인장 문구 입력</label>
                  <input
                    id="input-type-name"
                    type="text"
                    maxLength={6}
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500 dark:text-slate-100 transition-colors"
                    placeholder="예: 홍길동"
                  />
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'font-serif italic text-blue-600 dark:text-blue-400', label: '필기 싸인체', text: typedName || '서명예시' },
                      { id: 'font-mono tracking-widest font-bold text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900 rounded p-1.5 text-center bg-red-50/40 dark:bg-red-900/10', label: '정식도장체', text: `${typedName || '서명'}(인)` },
                    ].map((fontItem) => (
                      <button
                        id={`btn-select-font-${fontItem.id.split(' ')[0]}`}
                        key={fontItem.id}
                        onClick={() => setSelectedFont(fontItem.id)}
                        className={`border text-[10px] rounded-lg p-2 text-left relative transition-all cursor-pointer ${
                          selectedFont === fontItem.id
                            ? 'border-blue-500 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-900/20 ring-1 ring-blue-500 font-bold'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <span className="block text-gray-400 dark:text-slate-500 text-[8px] mb-0.5">{fontItem.label}</span>
                        <span className={`block font-semibold truncate ${fontItem.id}`}>{fontItem.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Verification and Submission Buttons */}
            <div className="space-y-3 pt-1">
              <div
                id="checkbox-agreement-wrapper"
                onClick={() => setAgree(!agree)}
                className={`flex gap-2 items-start p-2.5 rounded-xl border text-[10.5px] cursor-pointer select-none transition-all ${
                  agree ? 'border-blue-100 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-900/30' : 'border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0">
                  {agree ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-300 dark:text-slate-700" />}
                </div>
                <p className="text-gray-500 dark:text-slate-400 leading-snug text-[10px]">
                  본인은 본 계약서를 충분히 숙지하였으며, 입력 서명이 본인의 것임을 승인하며 상호 전자인증 계약 체결에 동의합니다.
                </p>
              </div>

              <button
                id="btn-submit-signature"
                onClick={handleSignSubmit}
                disabled={!agree || (signMethod === 'draw' && !canvasHasData) || (signMethod === 'type' && !typedName.trim())}
                className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  agree && ((signMethod === 'draw' && canvasHasData) || (signMethod === 'type' && typedName.trim()))
                    ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md active:scale-98'
                    : 'bg-slate-150 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>합의 서명 및 전자날인 전송</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
