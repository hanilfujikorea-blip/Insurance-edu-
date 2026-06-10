// ==========================================
// 1. 공통 상수 및 Supabase 설정 (기존 유지)
// ==========================================
const STORAGE_KEY = "youthGrantTracker.people.v6";
const CLEARED_KEY = "youthGrantTracker.people.v3.cleared";
const PRIOR_STORAGE_KEYS = [
  "youthGrantTracker.people.v5",
  "youthGrantTracker.people.v4",
  "youthGrantTracker.people.v3",
  "youthGrantTracker.people.v2",
  "youthGrantTracker.people.v1",
];
const PREVIOUS_STORAGE_KEY = "youthGrantTracker.people.v2";
const LEGACY_STORAGE_KEY = "youthGrantTracker.people.v1";
const COMPANIES = ["HFK", "FGL", "KITOS", "IMEX", "KTECH"];
const MILESTONES = [
  { key: "m6", label: "6개월", months: 6, payrollOffset: 5, amount: 3600000 },
  { key: "m9", label: "9개월", months: 9, payrollOffset: 8, amount: 1800000 },
  { key: "m12", label: "12개월", months: 12, payrollOffset: 12, amount: 1800000 },
];
const SUPABASE_SETTINGS = window.YOUTH_GRANT_SUPABASE ?? {};
const SUPABASE_TABLE = SUPABASE_SETTINGS.table || "youth_grant_people";
const INSURANCE_TABLE = "insurances";
const TRAINING_TABLE = "trainings";

const supabaseClient =
  SUPABASE_SETTINGS.url && SUPABASE_SETTINGS.anonKey
    ? {
        url: SUPABASE_SETTINGS.url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, ""),
        anonKey: SUPABASE_SETTINGS.anonKey,
      }
    : null;

// ==========================================
// 2. 통합 상태 정의 (청년장려금 + 차량보험 + 외부교육)
// ==========================================
let people = [];
let viewMode = "table";
let statusFilter = "all";
let companyFilter = "all";
let yearFilter = "all";

// 차량보험 상태
let insurances = [];
let insSearchTerm = "";
let insFilterContractor = "all";
let insFilterInsurer = "all";
let insViewMode = "card";

// 외부교육 상태 (신규 고도화)
let trainings = [];
let trSearchTerm = "";
let trAffiliationFilter = "all";
let trSortKey = "date_iso";
let trViewMode = "card";

// ==========================================
// 3. UI 엘리먼트 & 필드 객체
// ==========================================
const elements = {
  // 탭 네비게이션
  tabBtnGrant: document.querySelector("#tabBtnGrant"),
  tabBtnInsurance: document.querySelector("#tabBtnInsurance"),
  tabBtnTraining: document.querySelector("#tabBtnTraining"),
  tabBtnOnboarding: document.querySelector("#tabBtnOnboarding"),
  grantView: document.querySelector("#grantView"),
  insuranceView: document.querySelector("#insuranceView"),
  trainingView: document.querySelector("#trainingView"),
  onboardingView: document.querySelector("#onboardingView"),

  // 청년장려금 엘리먼트 (기존 유지)
  addPersonBtn: document.querySelector("#addPersonBtn"),
  exportCsvBtn: document.querySelector("#exportCsvBtn"),
  searchInput: document.querySelector("#searchInput"),
  statusButtons: document.querySelectorAll("[data-status]"),
  companyButtons: document.querySelectorAll("[data-company]"),
  yearButtons: document.querySelectorAll("[data-year]"),
  viewButtons: document.querySelectorAll("[data-view]"),
  cardGrid: document.querySelector("#cardGrid"),
  tableBody: document.querySelector("#peopleTableBody"),
  dialog: document.querySelector("#personDialog"),
  form: document.querySelector("#personForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  closeDialogBtn: document.querySelector("#closeDialogBtn"),
  cancelDialogBtn: document.querySelector("#cancelDialogBtn"),
  totalPeople: document.querySelector("#totalPeople"),
  completedPeople: document.querySelector("#completedPeople"),
  dueThisMonth: document.querySelector("#dueThisMonth"),
  totalAmount: document.querySelector("#totalAmount"),

  // 차량보험 엘리먼트 (기존 유지)
  addInsuranceBtn: document.querySelector("#addInsuranceBtn"),
  exportInsuranceCsvBtn: document.querySelector("#exportInsuranceCsvBtn"),
  insuranceSearchInput: document.querySelector("#insuranceSearchInput"),
  insContractorButtons: document.querySelectorAll("[data-ins-contractor]"),
  insInsurerButtons: document.querySelectorAll("[data-ins-insurer]"),
  insViewButtons: document.querySelectorAll("[data-ins-view]"),
  insuranceCardGrid: document.querySelector("#insuranceCardGrid"),
  insuranceTableShell: document.querySelector("#insuranceTableShell"),
  insuranceTableBody: document.querySelector("#insuranceTableBody"),
  totalVehicles: document.querySelector("#totalVehicles"),
  hfkVehicles: document.querySelector("#hfkVehicles"),
  fglVehicles: document.querySelector("#fglVehicles"),
  totalPremium: document.querySelector("#totalPremium"),

  // 차량보험 다이얼로그 (기존 유지)
  insDialog: document.querySelector("#insuranceDialog"),
  insForm: document.querySelector("#insuranceForm"),
  insDialogTitle: document.querySelector("#insuranceDialogTitle"),
  closeInsDialogBtn: document.querySelector("#closeInsuranceDialogBtn"),
  cancelInsDialogBtn: document.querySelector("#cancelInsuranceDialogBtn"),

  // 외부교육 엘리먼트 (신규 고도화)
  addTrainingBtn: document.querySelector("#addTrainingBtn"),
  uploadTrainingTrigger: document.querySelector("#uploadTrainingTrigger"),
  trainingExcelUpload: document.querySelector("#trainingExcelUpload"),
  trainingSearchInput: document.querySelector("#trainingSearchInput"),
  trAffiliationButtons: document.querySelectorAll("[data-tr-affiliation]"),
  trSortSelect: document.querySelector("#trainingSortSelect"),
  trViewButtons: document.querySelectorAll("[data-tr-view]"),
  trainingCardGrid: document.querySelector("#trainingCardGrid"),
  trainingTableShell: document.querySelector("#trainingTableShell"),
  trainingTableBody: document.querySelector("#trainingTableBody"),
  totalTrainings: document.querySelector("#totalTrainings"),
  hfkTrainings: document.querySelector("#hfkTrainings"),
  fglTrainings: document.querySelector("#fglTrainings"),
  totalNetFee: document.querySelector("#totalNetFee"),

  // 외부교육 다이얼로그 (신규)
  trDialog: document.querySelector("#trainingDialog"),
  trForm: document.querySelector("#trainingForm"),
  trDialogTitle: document.querySelector("#trainingDialogTitle"),
  closeTrDialogBtn: document.querySelector("#closeTrainingDialogBtn"),
  cancelTrDialogBtn: document.querySelector("#cancelTrainingDialogBtn"),

  // 외부교육 공지 모달
  modalOverlay: document.querySelector("#modal-overlay"),
  upcomingTrainingsList: document.querySelector("#upcoming-trainings-list"),
  closeModalBtn: document.querySelector("#close-modal"),
  modalConfirmBtn: document.querySelector("#modal-confirm"),
};

// 청년장려금 다이얼로그 필드 (기존 유지)
const fields = {
  id: document.querySelector("#personId"),
  company: document.querySelector("#company"),
  department: document.querySelector("#department"),
  team: document.querySelector("#team"),
  position: document.querySelector("#position"),
  name: document.querySelector("#name"),
  hireDate: document.querySelector("#hireDate"),
  applicationPeriod: document.querySelector("#applicationPeriod"),
  insuranceApplied: document.querySelector("#insuranceApplied"),
  milestones: Object.fromEntries(
    MILESTONES.flatMap((milestone) => [
      [`${milestone.key}Applied`, document.querySelector(`#${milestone.key}Applied`)],
      [`${milestone.key}Received`, document.querySelector(`#${milestone.key}Received`)],
    ]),
  ),
};

// 차량보험 다이얼로그 필드 (기존 유지)
const insFields = {
  id: document.querySelector("#insuranceId"),
  contractor: document.querySelector("#insContractor"),
  insurer: document.querySelector("#insInsurer"),
  insurerCustom: document.querySelector("#insInsurerCustom"),
  insurerCustomLabel: document.querySelector("#insInsurerCustomLabel"),
  carNumber: document.querySelector("#insCarNumber"),
  carName: document.querySelector("#insCarName"),
  year: document.querySelector("#insYear"),
  startDate: document.querySelector("#insStartDate"),
  endDate: document.querySelector("#insEndDate"),
  premium: document.querySelector("#insPremium"),
  paymentStatus: document.querySelector("#insPaymentStatus"),
  memo: document.querySelector("#insMemo"),
};

// 외부교육 다이얼로그 필드 (신규 고도화)
const trFields = {
  id: document.querySelector("#trainingId"),
  affiliation: document.querySelector("#trAffiliation"),
  name: document.querySelector("#trName"),
  department: document.querySelector("#trDepartment"),
  team: document.querySelector("#trTeam"),
  course: document.querySelector("#trCourse"),
  vendor: document.querySelector("#trVendor"),
  dateStr: document.querySelector("#trDateStr"),
  dateIso: document.querySelector("#trDateIso"),
  fee: document.querySelector("#trFee"),
  refund: document.querySelector("#trRefund"),
  netFee: document.querySelector("#trNetFee"),
  paymentDate: document.querySelector("#trPaymentDate"),
  refundDate: document.querySelector("#trRefundDate"),
  reportDate: document.querySelector("#trReportDate"),
};

// ==========================================
// 4. 이벤트 리스너 등록
// ==========================================

// 탭 전환 핸들러
elements.tabBtnGrant.addEventListener("click", () => switchTab("grant"));
elements.tabBtnInsurance.addEventListener("click", () => switchTab("insurance"));
elements.tabBtnTraining.addEventListener("click", () => switchTab("training"));
elements.tabBtnOnboarding.addEventListener("click", () => switchTab("onboarding"));

// 청년장려금 리스너 (기존 유지)
elements.addPersonBtn.addEventListener("click", () => openDialog());
elements.closeDialogBtn.addEventListener("click", closeDialog);
elements.cancelDialogBtn.addEventListener("click", closeDialog);
elements.searchInput.addEventListener("input", render);
elements.exportCsvBtn.addEventListener("click", exportCsv);
elements.form.addEventListener("submit", savePerson);

elements.statusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    statusFilter = button.dataset.status;
    elements.statusButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

elements.companyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    companyFilter = button.dataset.company;
    elements.companyButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

elements.yearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    yearFilter = button.dataset.year;
    elements.yearButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

elements.viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewMode = button.dataset.view;
    elements.viewButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

// 차량보험 리스너 (기존 유지)
elements.addInsuranceBtn.addEventListener("click", () => openInsuranceDialog());
elements.closeInsDialogBtn.addEventListener("click", closeInsuranceDialog);
elements.cancelInsDialogBtn.addEventListener("click", closeInsuranceDialog);
elements.insuranceSearchInput.addEventListener("input", () => {
  insSearchTerm = elements.insuranceSearchInput.value.trim().toLowerCase();
  renderInsurance();
});
elements.exportInsuranceCsvBtn.addEventListener("click", exportInsuranceCsv);
elements.insForm.addEventListener("submit", saveInsurance);

insFields.insurer.addEventListener("change", () => {
  const isCustom = insFields.insurer.value === "custom";
  insFields.insurerCustomLabel.style.display = isCustom ? "block" : "none";
  if (isCustom) insFields.insurerCustom.setAttribute("required", "true");
  else insFields.insurerCustom.removeAttribute("required");
});

elements.insContractorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    insFilterContractor = button.dataset.insContractor;
    elements.insContractorButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderInsurance();
  });
});

elements.insInsurerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    insFilterInsurer = button.dataset.insInsurer;
    elements.insInsurerButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderInsurance();
  });
});

elements.insViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    insViewMode = button.dataset.insView;
    elements.insViewButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderInsurance();
  });
});

// 외부교육 리스너 (신규 고도화)
elements.addTrainingBtn.addEventListener("click", () => openTrainingDialog(null));
elements.closeTrDialogBtn.addEventListener("click", closeTrainingDialog);
elements.cancelTrDialogBtn.addEventListener("click", closeTrainingDialog);
elements.trForm.addEventListener("submit", saveTraining);

// 실부담금 자동계산 리스너
const calcNetFee = () => {
  const fee = parseInt(trFields.fee.value, 10) || 0;
  const refund = parseInt(trFields.refund.value, 10) || 0;
  trFields.netFee.value = Math.max(0, fee - refund);
};
trFields.fee.addEventListener("input", calcNetFee);
trFields.refund.addEventListener("input", calcNetFee);

elements.uploadTrainingTrigger.addEventListener("click", () => elements.trainingExcelUpload.click());
elements.trainingExcelUpload.addEventListener("change", importTrainingExcel);

elements.trainingSearchInput.addEventListener("input", () => {
  trSearchTerm = elements.trainingSearchInput.value.trim().toLowerCase();
  renderTraining();
});

elements.trAffiliationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trAffiliationFilter = button.dataset.trAffiliation;
    elements.trAffiliationButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTraining();
  });
});

elements.trSortSelect.addEventListener("change", () => {
  trSortKey = elements.trSortSelect.value;
  renderTraining();
});

elements.trViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trViewMode = button.dataset.trView;
    elements.trViewButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTraining();
  });
});

// 외부교육 모달 닫기
const hideTrainingModal = () => elements.modalOverlay.style.display = "none";
elements.closeModalBtn.addEventListener("click", hideTrainingModal);
elements.modalConfirmBtn.addEventListener("click", hideTrainingModal);
elements.modalOverlay.addEventListener("click", (e) => {
  if (e.target === elements.modalOverlay) hideTrainingModal();
});

// ==========================================
// 5. 초기화 및 통합 로직
// ==========================================

initialize();
startLiveClock();

function startLiveClock() {
  const el = document.querySelector("#liveClock");
  if (!el) return;

  const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

  function tick() {
    const now = new Date();
    const y = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const day = DAYS[now.getDay()];
    const h = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    el.innerHTML = `
      <span class="clock-date">${y}.${mo}.${d} (${day})</span>
      <span class="clock-time">${h}:${mi}:${s}</span>
    `;
  }

  tick();
  setInterval(tick, 1000);
}

async function initialize() {
  // 청년장려금 로드
  people = await loadPeople();
  render();

  // 차량보험 로드
  if (supabaseClient) {
    insurances = await loadInsurancesFromSupabase();
    renderInsurance();
  }

  // 외부교육 로드
  if (supabaseClient) {
    trainings = await loadTrainingsFromSupabase();
    renderTraining();
    showUpcomingTrainingsPopup();
  }
}

// 탭 전환 기능
function switchTab(tabName) {
  elements.tabBtnGrant.classList.remove("active");
  elements.tabBtnInsurance.classList.remove("active");
  elements.tabBtnTraining.classList.remove("active");
  elements.tabBtnOnboarding.classList.remove("active");
  elements.grantView.classList.remove("active");
  elements.insuranceView.classList.remove("active");
  elements.trainingView.classList.remove("active");
  elements.onboardingView.classList.remove("active");
  document.body.classList.remove("tab-grant", "tab-insurance", "tab-training", "tab-onboarding");

  if (tabName === "grant") {
    elements.tabBtnGrant.classList.add("active");
    elements.grantView.classList.add("active");
    document.body.classList.add("tab-grant");
    render();
  } else if (tabName === "insurance") {
    elements.tabBtnInsurance.classList.add("active");
    elements.insuranceView.classList.add("active");
    document.body.classList.add("tab-insurance");
    renderInsurance();
  } else if (tabName === "training") {
    elements.tabBtnTraining.classList.add("active");
    elements.trainingView.classList.add("active");
    document.body.classList.add("tab-training");
    renderTraining();
  } else if (tabName === "onboarding") {
    elements.tabBtnOnboarding.classList.add("active");
    elements.onboardingView.classList.add("active");
    document.body.classList.add("tab-onboarding");
    
    // Theme sync for iframe
    const iframe = document.querySelector("#onboardingIframe");
    if (iframe && iframe.contentWindow) {
      // The onboarding hub uses 'light' | 'dark' classes on its html element
      // and 'next_onboarding_theme' in its localStorage.
      // Since it's a separate app, we can't easily reach inside if it's on a different origin,
      // but here it's on the same origin.
      try {
        iframe.contentWindow.localStorage.setItem('next_onboarding_theme', 'dark');
        iframe.contentWindow.document.documentElement.classList.add('dark');
      } catch (e) {
        console.warn("Could not sync theme to onboarding hub iframe", e);
      }
    }
  }
}

// ==========================================
// 6. 청년장려금 핵심 로직 (기존 유지)
// ==========================================

async function loadPeople() {
  if (supabaseClient) {
    const remotePeople = await loadPeopleFromSupabase();
    if (remotePeople.length > 0) return remotePeople;

    const localPeople = loadPeopleFromLocalStorage();
    if (localPeople.length > 0) {
      people = localPeople;
      await persist();
    }
    return localPeople;
  }

  return loadPeopleFromLocalStorage();
}

function loadPeopleFromLocalStorage() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(current) && (current.length > 0 || localStorage.getItem(CLEARED_KEY) === "true")) {
      return current.map(normalizePerson);
    }
  } catch {
    // Fall through
  }

  const merged = [];
  for (const key of PRIOR_STORAGE_KEYS) {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved)) merged.push(...saved.map(normalizePersonForMigration));
    } catch {
      // Ignore
    }
  }

  return mergePeople([...starterPeople(), ...merged]);
}

async function loadPeopleFromSupabase() {
  const { data, error } = await supabaseRequest(`${SUPABASE_TABLE}?select=*&order=hire_date.desc`);
  if (error) {
    console.error(error);
    alert("Supabase 데이터를 불러오지 못했습니다. 설정과 테이블 권한을 확인해주세요.");
    return loadPeopleFromLocalStorage();
  }
  return (data ?? []).map(fromSupabaseRow).map(normalizePerson);
}

function normalizePersonForMigration(person) {
  const normalized = normalizePerson(person);
  if (["김재영", "최승희"].includes(normalized.name)) {
    normalized.milestones = completedMilestones();
  }
  if (normalized.name === "조성호") {
    normalized.milestones = emptyMilestones();
  }
  return normalized;
}

function normalizePerson(person) {
  const milestones = person.milestones ?? {};
  const legacyGrantCompleted = Boolean(person.grantCompleted);

  return {
    id: person.id ?? crypto.randomUUID(),
    company: normalizeCompany(person.company),
    department: person.department ?? "",
    team: person.team ?? "",
    position: person.position ?? "",
    name: person.name ?? "",
    hireDate: person.hireDate ?? "",
    resignationDate: person.resignationDate ?? "",
    applicationPeriod: person.applicationPeriod ?? "",
    insuranceApplied: Boolean(person.insuranceApplied),
    milestones: Object.fromEntries(
      MILESTONES.map((milestone) => {
        const state = milestones[milestone.key] ?? {};
        return [
          milestone.key,
          {
            applied: Boolean(state.applied ?? legacyGrantCompleted),
            received: Boolean(state.received ?? legacyGrantCompleted),
          },
        ];
      }),
    ),
  };
}

function normalizeCompany(company) {
  if (COMPANIES.includes(company)) return company;
  const text = String(company ?? "").toUpperCase();
  if (text.includes("FGL")) return "FGL";
  if (text.includes("KITOS")) return "KITOS";
  if (text.includes("IMEX")) return "IMEX";
  if (text.includes("KTECH")) return "KTECH";
  return "HFK";
}

async function persist() {
  if (people.length > 0) localStorage.removeItem(CLEARED_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));

  if (!supabaseClient) return;
  if (people.length === 0) return;

  const { error } = await supabaseRequest(`${SUPABASE_TABLE}?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(people.map(toSupabaseRow)),
  });

  if (error) {
    console.error(error);
    alert("Supabase 저장에 실패했습니다. 네트워크와 RLS 정책을 확인해주세요.");
  }
}

function openDialog(person = null) {
  const target = person ? normalizePerson(person) : null;
  elements.form.reset();
  elements.dialogTitle.textContent = target ? "직원 수정" : "직원 추가";
  fields.id.value = target?.id ?? "";
  fields.company.value = target?.company ?? "HFK";
  fields.department.value = target?.department ?? "";
  fields.team.value = target?.team ?? "";
  fields.position.value = target?.position ?? "사원";
  fields.name.value = target?.name ?? "";
  fields.hireDate.value = target?.hireDate ?? "";
  fields.applicationPeriod.value = target?.applicationPeriod ?? "26년도 신청";
  fields.insuranceApplied.checked = Boolean(target?.insuranceApplied);

  MILESTONES.forEach((milestone) => {
    fields.milestones[`${milestone.key}Applied`].checked = Boolean(target?.milestones?.[milestone.key]?.applied);
    fields.milestones[`${milestone.key}Received`].checked = Boolean(target?.milestones?.[milestone.key]?.received);
  });

  elements.dialog.showModal();
}

function closeDialog() {
  elements.dialog.close();
}

async function savePerson(event) {
  event.preventDefault();
  const id = fields.id.value || crypto.randomUUID();
  const person = {
    id,
    company: fields.company.value,
    department: fields.department.value.trim(),
    team: fields.team.value.trim(),
    position: fields.position.value.trim(),
    name: fields.name.value.trim(),
    hireDate: fields.hireDate.value,
    resignationDate: people.find((item) => item.id === id)?.resignationDate ?? "",
    applicationPeriod: fields.applicationPeriod.value.trim(),
    insuranceApplied: fields.insuranceApplied.checked,
    milestones: Object.fromEntries(
      MILESTONES.map((milestone) => [
        milestone.key,
        {
          applied: fields.milestones[`${milestone.key}Applied`].checked,
          received: fields.milestones[`${milestone.key}Received`].checked,
        },
      ]),
    ),
  };

  people = people.some((item) => item.id === id)
    ? people.map((item) => (item.id === id ? person : item))
    : [person, ...people];

  await persist();
  closeDialog();
  render();
}

function render() {
  const rows = filteredPeople();
  document.body.classList.toggle("table-view", viewMode === "table");
  document.body.classList.toggle("card-view", viewMode === "card");
  renderSummary();

  if (rows.length === 0) {
    elements.tableBody.innerHTML = `<tr><td colspan="14" class="empty-state">표시할 직원이 없습니다.</td></tr>`;
    elements.cardGrid.innerHTML = `<div class="empty-state">표시할 직원이 없습니다.</div>`;
    return;
  }

  elements.cardGrid.innerHTML = rows.map(renderCard).join("");
  elements.tableBody.innerHTML = rows.map(renderRow).join("");

  document.querySelectorAll("[data-card-edit], [data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      openDialog(people.find((person) => person.id === (button.dataset.cardEdit || button.dataset.edit)));
    });
  });

  elements.tableBody.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      deletePerson(button.dataset.delete);
    });
  });
  elements.tableBody.querySelectorAll("[data-resign]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      resignPerson(button.dataset.resign);
    });
  });
}

function renderCard(person) {
  const receivedTotal = receivedAmount(person);
  const appliedCount = countMilestoneState(person, "applied");
  const receivedCount = countMilestoneState(person, "received");
  const next = nextMilestone(person.hireDate);
  const due = hasDueThisMonth(person);
  const complete = receivedCount === MILESTONES.length;
  const cardClass = complete ? "done-card" : due ? "due-card" : "";

  return `
    <article class="grant-card ${cardClass} ${person.resignationDate ? "resigned-card" : ""}" data-card-edit="${person.id}">
      <div class="card-head">
        <div>
          <h3 class="card-title">${escapeHtml(person.name)}</h3>
          <div class="card-subtitle">${escapeHtml(person.company)} · ${escapeHtml(person.department)} · ${escapeHtml(person.team || "-")}</div>
        </div>
        <div class="badge-row">
          <span class="status-pill ${complete ? "done" : "open"}">${complete ? "수령완료" : "진행중"}</span>
          ${due ? '<span class="status-pill due">확인필요</span>' : ""}
        </div>
      </div>

      <div class="card-meta">
        <div><span>직위</span><strong>${escapeHtml(person.position)}</strong></div>
        <div><span>입사일</span><strong>${formatDate(person.hireDate)}</strong></div>
        <div><span>근속</span><strong>입사 ${monthsWorked(person.hireDate)}개월</strong></div>
        <div><span>신청기간</span><strong>${escapeHtml(person.applicationPeriod)}</strong></div>
        <div><span>신청/수령</span><strong>${appliedCount}/3 신청 · ${receivedCount}/3 수령</strong></div>
        <div><span>4대보험</span><strong>${person.insuranceApplied ? "신청완료" : "미신청"}</strong></div>
      </div>

      <div class="milestone-strip">
        ${MILESTONES.map((milestone) => renderMilestoneBadges(person, milestone)).join("")}
      </div>

      <div class="card-footer">
        <div>
          <span>수령완료 금액</span>
          <strong>${formatMoney(receivedTotal)}</strong>
        </div>
        <div>
          <span>다음 확인</span>
          <strong>${next}</strong>
        </div>
      </div>
    </article>
  `;
}

function renderMilestoneBadges(person, milestone) {
  const state = person.milestones[milestone.key];
  const schedule = applicationSchedule(person.hireDate, milestone);
  return `
    <div>
      <strong>${milestone.label}</strong>
      <small>${schedule}</small>
      <span class="${state.applied ? "done-text" : "open-text"}">${state.applied ? "신청" : "미신청"}</span>
      <span class="${state.received ? "done-text" : "open-text"}">${state.received ? "수령" : "미수령"}</span>
    </div>
  `;
}

function renderRow(person) {
  const receivedTotal = receivedAmount(person);
  const allApplied = countMilestoneState(person, "applied") === MILESTONES.length;

  return `
    <tr class="${person.resignationDate ? "resigned-row" : ""}">
      <td>${escapeHtml(person.company)}</td>
      <td>${escapeHtml(person.department)}</td>
      <td>${escapeHtml(person.team || "-")}</td>
      <td>${escapeHtml(person.position)}</td>
      <td>${escapeHtml(person.name)}</td>
      <td>${formatDate(person.hireDate)}</td>
      <td>${escapeHtml(person.applicationPeriod)}</td>
      ${MILESTONES.map((milestone) => renderMilestoneCell(person, milestone)).join("")}
      <td class="money">${formatMoney(receivedTotal)}</td>
      <td><span class="status-pill ${allApplied ? "done" : "open"}">${allApplied ? "완료" : "진행중"}</span></td>
      <td><span class="status-pill ${person.insuranceApplied ? "done" : "open"}">${person.insuranceApplied ? "완료" : "미완료"}</span></td>
      <td>
        <div class="row-actions">
          <button class="secondary-button" type="button" data-edit="${person.id}">수정</button>
          <button class="resign-button" type="button" data-resign="${person.id}">${person.resignationDate ? "퇴사일" : "퇴사"}</button>
          <button class="danger-button" type="button" data-delete="${person.id}">삭제</button>
        </div>
      </td>
    </tr>
  `;
}

function renderMilestoneCell(person, milestone) {
  const state = person.milestones[milestone.key];
  const eligible = monthsWorked(person.hireDate) >= milestone.months;
  const due = isApplicationDueThisMonth(person.hireDate, milestone);
  const amount = state.received ? formatMoney(milestone.amount) : eligible ? "대상" : "-";

  return `
    <td>
      <div class="milestone-cell ${due ? "due-cell" : ""}">
        <strong>${amount}</strong>
        <small>${applicationSchedule(person.hireDate, milestone)}</small>
        <span class="${state.applied ? "done-text" : "open-text"}">${state.applied ? "신청완료" : "미신청"}</span>
        <span class="${state.received ? "done-text" : "open-text"}">${state.received ? "수령완료" : "미수령"}</span>
      </div>
    </td>
  `;
}

function renderSummary() {
  const rows = filteredPeople();
  const total = rows.reduce((sum, person) => sum + receivedAmount(person), 0);
  const completed = rows.filter((person) => countMilestoneState(person, "received") === MILESTONES.length).length;
  const dueCount = rows.filter(hasDueThisMonth).length;

  elements.totalPeople.textContent = rows.length.toLocaleString("ko-KR");
  elements.completedPeople.textContent = completed.toLocaleString("ko-KR");
  elements.dueThisMonth.textContent = dueCount.toLocaleString("ko-KR");
  elements.totalAmount.textContent = formatMoney(total);
}

function filteredPeople() {
  const query = elements.searchInput.value.trim().toLowerCase();

  return people.filter((rawPerson) => {
    const person = normalizePerson(rawPerson);
    const haystack = [person.company, person.department, person.team, person.position, person.name, person.applicationPeriod]
      .join(" ")
      .toLowerCase();
    const queryMatches = query === "" || haystack.includes(query);
    const companyMatches = companyFilter === "all" || person.company === companyFilter;
    const yearMatches = yearFilter === "all" || getBusinessYear(person) === yearFilter;
    const statusMatches =
      statusFilter === "all" ||
      (statusFilter === "done" && countMilestoneState(person, "received") === MILESTONES.length) ||
      (statusFilter === "open" && countMilestoneState(person, "received") < MILESTONES.length) ||
      (statusFilter === "due" && hasDueThisMonth(person));

    return queryMatches && companyMatches && yearMatches && statusMatches;
  });
}

function getBusinessYear(person) {
  const text = String(person.applicationPeriod ?? "");
  const match = text.match(/(\d{2,4})/);
  if (!match) return "";
  const value = match[1];
  return value.length === 2 ? `20${value}` : value;
}

function receivedAmount(person) {
  const normalized = normalizePerson(person);
  return MILESTONES.reduce((sum, milestone) => {
    return normalized.milestones[milestone.key].received ? sum + milestone.amount : sum;
  }, 0);
}

// 엑셀 내보내기 복원
function exportCsv() {
  const headers = [
    "회사",
    "부서명",
    "팀명",
    "직위",
    "성명",
    "입사일",
    "퇴사일",
    "신청기간",
    "6개월 신청완료",
    "6개월 수령완료",
    "9개월 신청완료",
    "9개월 수령완료",
    "12개월 신청완료",
    "12개월 수령완료",
    "수령완료 금액",
    "4대보험 신청",
  ];

  const rows = people.map((rawPerson) => {
    const person = normalizePerson(rawPerson);
    return [
      person.company,
      person.department,
      person.team,
      person.position,
      person.name,
      person.hireDate,
      person.resignationDate,
      person.applicationPeriod,
      ...MILESTONES.flatMap((milestone) => [
        person.milestones[milestone.key].applied ? "완료" : "미완료",
        person.milestones[milestone.key].received ? "완료" : "미완료",
      ]),
      receivedAmount(person),
      person.insuranceApplied ? "완료" : "미완료",
    ];
  });

  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `청년일자리도약장려금_신청이력_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function countMilestoneState(person, key) {
  const normalized = normalizePerson(person);
  return MILESTONES.filter((milestone) => normalized.milestones[milestone.key][key]).length;
}

function nextMilestone(hireDate) {
  if (!hireDate) return "-";
  const months = monthsWorked(hireDate);
  const next = MILESTONES.find((milestone) => months < milestone.months);
  if (!next) return "12개월 완료";
  return `${next.months}개월차`;
}

async function deletePerson(id) {
  if (!confirm("이 직원을 삭제할까요?")) return;
  people = people.filter((person) => person.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));

  if (supabaseClient) {
    const { error } = await supabaseRequest(`${SUPABASE_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (error) {
      console.error(error);
      alert("Supabase 삭제에 실패했습니다. 권한을 확인해주세요.");
    }
  }

  render();
}

async function resignPerson(id) {
  const person = people.find((item) => item.id === id);
  if (!person) return;

  const value = prompt(`${person.name} 퇴사일을 입력하세요. 예: 2026-05-31`, person.resignationDate || "");
  if (value === null) return;

  const resignationDate = value.trim();
  if (resignationDate && !/^\d{4}-\d{2}-\d{2}$/.test(resignationDate)) {
    alert("퇴사일은 2026-05-31 형식으로 입력해주세요.");
    return;
  }

  people = people.map((item) => (item.id === id ? { ...item, resignationDate } : item));
  await persist();
  render();
}

function starterPeople() {
  return [
    {
      id: crypto.randomUUID(),
      company: "IMEX",
      department: "-",
      team: "-",
      position: "사원",
      name: "김재영",
      hireDate: "2025-03-10",
      applicationPeriod: "25년도 신청",
      insuranceApplied: true,
      milestones: completedMilestones(),
    },
    {
      id: crypto.randomUUID(),
      company: "IMEX",
      department: "-",
      team: "-",
      position: "사원",
      name: "최승희",
      hireDate: "2025-03-04",
      applicationPeriod: "25년도 신청",
      insuranceApplied: true,
      milestones: completedMilestones(),
    },
    {
      id: crypto.randomUUID(),
      company: "KITOS",
      department: "-",
      team: "-",
      position: "주임",
      name: "조성호",
      hireDate: "2025-05-07",
      applicationPeriod: "25년도 신청",
      insuranceApplied: false,
      milestones: emptyMilestones(),
    },
    ...additionalHfkPeople(),
    ...additionalHfk2026People(),
  ];
}

function additionalHfkPeople() {
  return [
    ["부품사업부", "특수영업2팀", "사원", "김은빈", "2025-12-11"],
    ["국내사업부", "국내영업2팀", "사원", "박소연", "2025-12-01"],
    ["부품사업부", "전략기획팀", "사원", "노희연", "2025-11-17"],
    ["부품사업부", "특수영업1팀", "사원", "김준현", "2025-11-17"],
    ["선박서비스사업부", "울산사무소", "사원", "진영명", "2025-07-07"],
    ["F&B사업부", "마린케터링3팀", "사원", "장민솔", "2025-06-16"],
    ["국내사업부", "국내영업1팀", "사원", "황남규", "2025-05-19"],
    ["엔진부품사업부", "엔진부품영업1팀", "사원", "이유정", "2025-04-01"],
    ["선용사업부", "영업지원팀", "사원", "문경준", "2025-04-01"],
    ["국내사업부", "국내영업3팀", "사원", "김민정", "2025-03-24"],
    ["부품사업부", "영업물류1팀", "사원", "안현아", "2025-03-10"],
    ["엔진부품사업부", "엔진부품영업1팀", "사원", "윤도빈", "2025-02-03"],
    ["재무관리사업부", "운항선2팀", "사원", "김성현", "2025-02-03"],
  ].map(([department, team, position, name, hireDate]) => ({
    id: crypto.randomUUID(),
    company: "HFK",
    department,
    team,
    position,
    name,
    hireDate,
    applicationPeriod: "25년도 신청",
    insuranceApplied: false,
    milestones: emptyMilestones(),
  }));
}

function additionalHfk2026People() {
  return [
    ["F&B 1사업부", "F&B1팀", "사원", "최윤희", "2026-05-18"],
    ["F&B 2사업부", "F&B3팀", "사원", "장은서", "2026-05-18"],
    ["부품사업부", "영업물류1팀", "사원", "권영아", "2026-04-13"],
    ["F&B 2사업부", "크루즈팀", "사원", "박준현", "2026-04-06"],
    ["F&B 2사업부", "품질원가관리팀", "사원", "박문성", "2026-04-01"],
    ["부품사업부", "부품영업2팀", "사원", "최수지", "2026-04-01"],
    ["선용사업부", "영업지원팀", "사원", "성경원", "2026-04-01"],
    ["국내사업부", "국내기부속2팀", "사원", "박혜빈", "2026-03-03"],
    ["부품사업부", "부품영업3팀", "사원", "이수연", "2026-03-03"],
    ["선용사업부", "신조선팀", "사원", "손강호", "2026-03-03"],
  ].map(([department, team, position, name, hireDate]) => ({
    id: crypto.randomUUID(),
    company: "HFK",
    department,
    team,
    position,
    name,
    hireDate,
    applicationPeriod: "26년도 신청",
    insuranceApplied: false,
    milestones: emptyMilestones(),
  }));
}

function mergePeople(items) {
  const byKey = new Map();
  items.map(normalizePerson).forEach((person) => {
    const key = `${person.company}|${person.name}|${person.hireDate}`;
    if (!byKey.has(key)) byKey.set(key, person);
  });
  return Array.from(byKey.values());
}

function completedMilestones() {
  return Object.fromEntries(MILESTONES.map((milestone) => [milestone.key, { applied: true, received: true }]));
}

function emptyMilestones() {
  return Object.fromEntries(MILESTONES.map((milestone) => [milestone.key, { applied: false, received: false }]));
}

// ==========================================
// 7. 차량보험 핵심 CRUD 및 렌더링 로직 (기존 유지)
// ==========================================

async function loadInsurancesFromSupabase() {
  const { data, error } = await supabaseRequest(`${INSURANCE_TABLE}?select=*&order=end_date.asc`);
  if (error) {
    console.error("Insurance load error:", error);
    return [];
  }
  return data ?? [];
}

// 만료 상태 판정
function getExpiryStatus(endDate) {
  if (!endDate) return "OK";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(endDate);
  expiry.setHours(0, 0, 0, 0);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);

  if (today > expiry) return "EXPIRED";
  if (thirtyDaysFromNow >= expiry) return "SOON";
  return "OK";
}

// 만료 D-Day 계산
function getDaysUntilExpiry(endDate) {
  if (!endDate) return 0;
  const expiry = new Date(endDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  expiry.setHours(0,0,0,0);
  const diffMs = expiry.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

// 소속 사업장 단축 라벨 추출
function getContractorShortLabel(contractor) {
  const text = String(contractor || "");
  if (text.includes("FGL") || text.includes("후지글로벌") || text.includes("에프지엘")) {
    return "FGL";
  }
  return "HFK";
}

// 보험 요약 업데이트
function renderInsuranceSummary() {
  const rows = filteredInsurances();
  const total = rows.reduce((sum, item) => sum + (Number(item.premium) || 0), 0);
  const hfkCount = rows.filter((item) => getContractorShortLabel(item.contractor) === "HFK").length;
  const fglCount = rows.filter((item) => getContractorShortLabel(item.contractor) === "FGL").length;

  elements.totalVehicles.textContent = `${rows.length}대`;
  elements.hfkVehicles.textContent = `${hfkCount}대`;
  elements.fglVehicles.textContent = `${fglCount}대`;
  elements.totalPremium.textContent = formatMoney(total);
}

// 차량 필터링
function filteredInsurances() {
  return insurances.filter((item) => {
    // 1. 검색어 필터링
    const haystack = [item.car_number, item.car_name, item.insurer, item.memo]
      .join(" ")
      .toLowerCase();
    const queryMatches = insSearchTerm === "" || haystack.includes(insSearchTerm);

    // 2. 소속 필터링
    const shortLabel = getContractorShortLabel(item.contractor);
    const contractorMatches = insFilterContractor === "all" || shortLabel === insFilterContractor;

    // 3. 보험사 필터링
    const insurerMatches = insFilterInsurer === "all" || item.insurer === insFilterInsurer;

    return queryMatches && contractorMatches && insurerMatches;
  });
}

// 차량보험 렌더링
function renderInsurance() {
  const list = filteredInsurances();
  renderInsuranceSummary();

  const isCard = insViewMode === "card";
  elements.insuranceCardGrid.style.display = isCard ? "grid" : "none";
  elements.insuranceTableShell.style.display = isCard ? "none" : "block";

  if (list.length === 0) {
    const emptyMsg = `<div class="empty-state" style="grid-column: 1/-1;">조회된 차량 보험 데이터가 없습니다.</div>`;
    elements.insuranceCardGrid.innerHTML = emptyMsg;
    elements.insuranceTableBody.innerHTML = `<tr><td colspan="9" class="empty-state">조회된 차량 보험 데이터가 없습니다.</td></tr>`;
    return;
  }

  // 카드 렌더링
  elements.insuranceCardGrid.innerHTML = list.map((item) => {
    const status = getExpiryStatus(item.end_date);
    const contractorLabel = getContractorShortLabel(item.contractor);
    const dDay = getDaysUntilExpiry(item.end_date);

    let statusLabel = "정상";
    let statusClass = "status-ok";
    let cardTheme = "ins-status-ok";
    if (status === "EXPIRED") {
      statusLabel = "만료";
      statusClass = "status-expired";
      cardTheme = "ins-status-expired";
    } else if (status === "SOON") {
      statusLabel = `만료임박 (D-${dDay})`;
      statusClass = "status-soon";
      cardTheme = "ins-status-soon";
    }

    return `
      <article class="ins-card ${cardTheme}" onclick="openInsuranceDialog('${item.id}')">
        <div class="ins-card-head">
          <div class="ins-badge-row">
            <span class="ins-badge ${contractorLabel.toLowerCase()}">${contractorLabel}</span>
            <span class="ins-badge ${statusClass}">${statusLabel}</span>
          </div>
          <span style="font-size: 13px; color: var(--muted); font-weight: 700;">
            ${formatDate(item.end_date)}
          </span>
        </div>

        <h3 class="ins-card-title">${escapeHtml(item.insurer)} / ${escapeHtml(item.car_number)}</h3>
        <p class="ins-card-subtitle">${escapeHtml(item.car_name)}</p>

        <div class="ins-card-details">
          <div class="item">
            <label>보험기간</label>
            <span>${formatDate(item.start_date)} ~ ${formatDate(item.end_date)}</span>
          </div>
          <div class="item">
            <label>연식</label>
            <span>${item.year}년형</span>
          </div>
          <div class="item" style="grid-column: 1/-1;">
            <label>메모</label>
            <span style="font-weight: 500; color: var(--muted); font-size: 12px; line-height:1.4;">
              ${escapeHtml(item.memo || "-")}
            </span>
          </div>
        </div>

        <div class="ins-card-footer">
          <div class="ins-price-box">
            <label>보험료</label>
            <strong>${formatMoney(item.premium)}</strong>
          </div>
          <span class="ins-pay-badge ${item.payment_status === "O" ? "paid" : "unpaid"}">
            ${item.payment_status === "O" ? "완납" : "미납"}
          </span>
        </div>
      </article>
    `;
  }).join("");

  // 리스트 렌더링
  elements.insuranceTableBody.innerHTML = list.map((item) => {
    const status = getExpiryStatus(item.end_date);
    const contractorLabel = getContractorShortLabel(item.contractor);
    const dDay = getDaysUntilExpiry(item.end_date);

    let statusPill = `<span class="status-pill done">정상</span>`;
    if (status === "EXPIRED") {
      statusPill = `<span class="status-pill resign-button">만료</span>`;
    } else if (status === "SOON") {
      statusPill = `<span class="status-pill open">임박(D-${dDay})</span>`;
    }

    return `
      <tr>
        <td style="font-weight:800;">${contractorLabel}</td>
        <td style="text-align:left; font-weight:800;">${escapeHtml(item.insurer)} / ${escapeHtml(item.car_number)}</td>
        <td style="text-align:left;">${escapeHtml(item.car_name)}</td>
        <td>${item.year}년형</td>
        <td style="font-weight:700;">${formatDate(item.start_date)} ~ ${formatDate(item.end_date)}</td>
        <td class="money" style="font-weight:800; color:#60a5fa;">${formatMoney(item.premium)}</td>
        <td><span class="status-pill ${item.payment_status === "O" ? "done" : "open"}">${item.payment_status === "O" ? "완납" : "미납"}</span></td>
        <td style="text-align:left; max-width:200px; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(item.memo)}">
          ${escapeHtml(item.memo || "-")}
        </td>
        <td>
          <div class="ins-row-actions">
            <button class="secondary-button" type="button" onclick="event.stopPropagation(); openInsuranceDialog('${item.id}')">수정</button>
            <button class="danger-button" type="button" onclick="event.stopPropagation(); deleteInsurance('${item.id}')">삭제</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// 차량 모달 열기
function openInsuranceDialog(id = null) {
  elements.insForm.reset();
  insFields.insurerCustomLabel.style.display = "none";
  insFields.insurerCustom.removeAttribute("required");

  if (id) {
    const item = insurances.find((x) => x.id === id);
    if (!item) return;

    elements.insDialogTitle.textContent = "차량 보험 수정";
    insFields.id.value = item.id;
    insFields.contractor.value = item.contractor;

    // 보험사 맵핑
    const predefined = ["삼성화재", "현대해상", "메리츠화재"];
    if (predefined.includes(item.insurer)) {
      insFields.insurer.value = item.insurer;
    } else {
      insFields.insurer.value = "custom";
      insFields.insurerCustomLabel.style.display = "block";
      insFields.insurerCustom.value = item.insurer;
      insFields.insurerCustom.setAttribute("required", "true");
    }

    insFields.carNumber.value = item.car_number;
    insFields.carName.value = item.car_name;
    insFields.year.value = item.year;
    insFields.startDate.value = item.start_date;
    insFields.endDate.value = item.end_date;
    insFields.premium.value = item.premium;
    insFields.paymentStatus.value = item.payment_status;
    insFields.memo.value = item.memo;
  } else {
    elements.insDialogTitle.textContent = "신규 차량 등록";
    insFields.id.value = "";
    insFields.contractor.value = "한일후지코리아(HFK)";
    insFields.insurer.value = "삼성화재";
    insFields.year.value = "2026";
    
    const todayStr = new Date().toISOString().slice(0, 10);
    insFields.startDate.value = todayStr;
    
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    insFields.endDate.value = nextYear.toISOString().slice(0, 10);
    insFields.premium.value = "";
    insFields.paymentStatus.value = "X";
    insFields.memo.value = "";
  }

  elements.insDialog.showModal();
}

function closeInsuranceDialog() {
  elements.insDialog.close();
}

// 차량보험 저장
async function saveInsurance(event) {
  event.preventDefault();
  
  const id = insFields.id.value || crypto.randomUUID();
  const insurerVal = insFields.insurer.value;
  const insurer = insurerVal === "custom" ? insFields.insurerCustom.value.trim() : insurerVal;

  const draft = {
    id,
    insurer,
    category: "자동차",
    insurance_details: "차량 보험",
    start_date: insFields.startDate.value,
    end_date: insFields.endDate.value,
    payment_status: insFields.paymentStatus.value,
    contractor: insFields.contractor.value,
    insured: insFields.contractor.value,
    car_name: insFields.carName.value.trim(),
    car_number: insFields.carNumber.value.trim(),
    year: parseInt(insFields.year.value, 10) || 2026,
    premium: parseInt(insFields.premium.value, 10) || 0,
    memo: insFields.memo.value.trim(),
    owner_id: "team_user",
  };

  const isEdit = insurances.some((x) => x.id === id);

  if (supabaseClient) {
    let response;
    if (isEdit) {
      response = await supabaseRequest(`${INSURANCE_TABLE}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...draft,
          updated_at: new Date().toISOString(),
        }),
      });
    } else {
      response = await supabaseRequest(INSURANCE_TABLE, {
        method: "POST",
        body: JSON.stringify(draft),
      });
    }

    if (response.error) {
      console.error(response.error);
      alert("차량 보험 저장에 실패했습니다. Supabase 설정을 확인해주세요.");
      return;
    }
  }

  // 로컬 상태 동기화 및 리렌더링
  if (isEdit) {
    insurances = insurances.map((x) => (x.id === id ? { ...x, ...draft } : x));
  } else {
    insurances = [draft, ...insurances];
  }

  closeInsuranceDialog();
  renderInsurance();
}

// 차량보험 삭제
async function deleteInsurance(id) {
  if (!confirm("이 차량 보험 내역을 영구 삭제하시겠습니까?")) return;

  if (supabaseClient) {
    const { error } = await supabaseRequest(`${INSURANCE_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (error) {
      console.error(error);
      alert("차량 보험 삭제에 실패했습니다. RLS 정책을 확인해주세요.");
      return;
    }
  }

  insurances = insurances.filter((x) => x.id !== id);
  renderInsurance();
}

// 차량보험 CSV 내보내기
function exportInsuranceCsv() {
  const headers = [
    "소속",
    "보험사",
    "차량번호",
    "차량명",
    "연식",
    "시작일",
    "만료일",
    "보험료",
    "납부상태",
    "메모",
  ];

  const rows = insurances.map((item) => [
    getContractorShortLabel(item.contractor),
    item.insurer,
    item.car_number,
    item.car_name,
    item.year,
    item.start_date,
    item.end_date,
    item.premium,
    item.payment_status === "O" ? "완납" : "미납",
    item.memo,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `차량보험_통합이력_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// 8. 외부교육 핵심 CRUD 및 렌더링 로직 (신규 고도화)
// ==========================================

async function loadTrainingsFromSupabase() {
  const { data, error } = await supabaseRequest(`${TRAINING_TABLE}?select=*`);
  if (error) {
    console.error("Training load error:", error);
    return [];
  }
  return data ?? [];
}

// D-day 산출
function getTrainingDDay(dateIso) {
  if (!dateIso || dateIso === "9999-12-31") return null;
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(dateIso);
  target.setHours(0,0,0,0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// 정밀 정렬 알고리즘 통합 (종료 일정 분리 및 가까운 순 정렬)
function sortTrainings(list) {
  const todayStr = new Date().toISOString().slice(0, 10);
  
  return list.sort((a, b) => {
    const isOverA = a.date_iso < todayStr;
    const isOverB = b.date_iso < todayStr;
    
    // 1. 종료 여부가 다르면 종료 안된 것(남은 교육)이 우선 위로
    if (isOverA !== isOverB) {
      return isOverA ? 1 : -1;
    }
    
    // 2. 남은 교육(오늘 포함 이후)인 경우: 오늘과 가장 가까운 빠른 일정 순
    if (!isOverA) {
      if (a.date_iso !== b.date_iso) {
        return a.date_iso < b.date_iso ? -1 : 1;
      }
    } 
    // 3. 이미 종료된 교육인 경우: 종료일이 가장 최신인 순 (역순 정렬)
    else {
      if (a.date_iso !== b.date_iso) {
        return a.date_iso > b.date_iso ? -1 : 1;
      }
    }
    
    // 4. 날짜가 동일하면 교육과정명순
    return (a.course || "") < (b.course || "") ? -1 : 1;
  });
}

// 교육 필터링 & 정렬
function filteredTrainings() {
  let list = trainings.filter((item) => {
    // 1. 검색어
    const haystack = [item.name, item.course, item.department, item.team, item.vendor]
      .join(" ")
      .toLowerCase();
    const queryMatches = trSearchTerm === "" || haystack.includes(trSearchTerm);

    // 2. 소속
    const trAffShort = (item.affiliation === "한일후지코리아" || item.affiliation === "HFK") ? "한일후지코리아" : "후지글로벌로지스틱";
    const trAffMatches = trAffiliationFilter === "all" || trAffShort === trAffiliationFilter;

    return queryMatches && trAffMatches;
  });

  // 3. 정렬 처리 (정렬 옵션 적용)
  if (trSortKey === "date_iso") {
    // 요구사항: 종료된건 밑으로 가고 남은건 가장 최근(오늘과 가까운)이 위로 오도록 정렬
    return sortTrainings(list);
  } else {
    // 과정명 혹은 성명순 정렬
    list.sort((a, b) => {
      const valA = a[trSortKey] ?? "";
      const valB = b[trSortKey] ?? "";
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
    return list;
  }
}

// 교육 서머리 업데이트
function renderTrainingSummary() {
  const list = filteredTrainings();
  const totalNet = list.reduce((sum, item) => sum + (Number(item.net_fee) || 0), 0);
  const hfkCount = list.filter((item) => item.affiliation === "한일후지코리아" || item.affiliation === "HFK").length;
  const fglCount = list.filter((item) => item.affiliation === "후지글로벌로지스틱" || item.affiliation === "FGL").length;

  elements.totalTrainings.textContent = `${list.length}건`;
  elements.hfkTrainings.textContent = `${hfkCount}건`;
  elements.fglTrainings.textContent = `${fglCount}건`;
  elements.totalNetFee.textContent = formatMoney(totalNet);
}

// 외부교육 렌더링
function renderTraining() {
  const list = filteredTrainings();
  renderTrainingSummary();

  const isCard = trViewMode === "card";
  elements.trainingCardGrid.style.display = isCard ? "grid" : "none";
  elements.trainingTableShell.style.display = isCard ? "none" : "block";

  if (list.length === 0) {
    const emptyMsg = `<div class="empty-state" style="grid-column: 1/-1;">조회된 교육 계획 데이터가 없습니다.</div>`;
    elements.trainingCardGrid.innerHTML = emptyMsg;
    elements.trainingTableBody.innerHTML = `<tr><td colspan="13" class="empty-state">조회된 교육 계획 데이터가 없습니다.</td></tr>`;
    return;
  }

  // 카드 렌더링
  elements.trainingCardGrid.innerHTML = list.map((item) => {
    const dDay = getTrainingDDay(item.date_iso);
    const contractorShort = (item.affiliation === "한일후지코리아" || item.affiliation === "HFK") ? "HFK" : "FGL";
    
    // D-Day 뱃지 결정
    let dDayText = "";
    let dDayClass = "";
    let cardAlert = "";
    if (dDay !== null) {
      if (dDay === 0) {
        dDayText = "D-Day";
        dDayClass = "d-day-urgent";
        cardAlert = "alert-d3";
      } else if (dDay < 0) {
        dDayText = `종료 (D+${Math.abs(dDay)})`;
        dDayClass = "d-day-normal";
      } else {
        dDayText = `D-${dDay}`;
        if (dDay <= 3) {
          dDayClass = "d-day-urgent";
          cardAlert = "alert-d3";
        } else if (dDay <= 7) {
          dDayClass = "d-day-warning";
          cardAlert = "alert-d7";
        } else {
          dDayClass = "d-day-normal";
        }
      }
    }

    return `
      <article class="ins-card ${cardAlert}" style="min-height: 270px;" onclick="openTrainingDialog('${item.id}')">
        <div class="ins-card-head" style="margin-bottom:14px;">
          <div class="ins-badge-row">
            <span class="ins-badge ${contractorShort.toLowerCase()}">${contractorShort}</span>
            ${dDayText ? `<span class="d-day-badge ${dDayClass}">${dDayText}</span>` : ""}
          </div>
          <span style="font-size: 12px; color: var(--muted); font-weight: 700;">
            ${escapeHtml(item.date_str)}
          </span>
        </div>

        <h3 class="ins-card-title" style="font-size:16px; min-height: 42px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;" title="${escapeHtml(item.course)}">
          ${escapeHtml(item.course)}
        </h3>

        <div class="ins-card-details" style="margin-bottom:16px; font-size:12px; grid-template-columns: 1fr 1fr;">
          <div class="item">
            <label>교육 대상자</label>
            <span style="color:#fff; font-weight:800;">${escapeHtml(item.name)}</span>
          </div>
          <div class="item">
            <label>부서 / 팀</label>
            <span>${escapeHtml(item.department)} ${item.team ? `/ ${escapeHtml(item.team)}` : ""}</span>
          </div>
          <div class="item">
            <label>입금일</label>
            <span style="color:#60a5fa;">${item.payment_date ? formatDate(item.payment_date) : "미입력"}</span>
          </div>
          <div class="item">
            <label>환급일</label>
            <span style="color:#34d399;">${item.refund_date ? formatDate(item.refund_date) : "미입력"}</span>
          </div>
          <div class="item" style="grid-column: 1 / -1;">
            <label>수료보고서 제출일</label>
            <span style="color:#fbbf24;">${item.report_date ? formatDate(item.report_date) : "미제출"}</span>
          </div>
        </div>

        <div class="ins-card-footer" style="padding-top:10px;">
          <div class="ins-price-box">
            <label>실 부담금</label>
            <strong style="color: #34d399; font-size: 15px;">${formatMoney(item.net_fee)}</strong>
          </div>
          <div style="font-size: 11px; color: var(--muted); text-align:right;">
            교육비 ${formatMoney(item.fee)}<br>
            환급금 ${formatMoney(item.refund)}
          </div>
        </div>
      </article>
    `;
  }).join("");

  // 리스트 렌더링
  elements.trainingTableBody.innerHTML = list.map((item) => {
    const contractorShort = (item.affiliation === "한일후지코리아" || item.affiliation === "HFK") ? "HFK" : "FGL";
    const dDay = getTrainingDDay(item.date_iso);
    
    let dDayBadge = "";
    if (dDay !== null) {
      if (dDay === 0) dDayBadge = `<span class="d-day-badge d-day-urgent">D-Day</span>`;
      else if (dDay < 0) dDayBadge = `<span class="d-day-badge d-day-normal" style="font-size:10px; padding:2px 5px;">종료</span>`;
      else dDayBadge = `<span class="d-day-badge ${dDay <= 3 ? "d-day-urgent" : dDay <= 7 ? "d-day-warning" : "d-day-normal"}">D-${dDay}</span>`;
    }

    return `
      <tr onclick="openTrainingDialog('${item.id}')" style="cursor:pointer;">
        <td style="font-weight:800;">${contractorShort}</td>
        <td style="text-align:left; font-weight:800;" title="${escapeHtml(item.course)}">
          ${escapeHtml(item.course)}
        </td>
        <td style="font-weight:800; color:#fff;">${escapeHtml(item.name)}</td>
        <td style="text-align:left;">${escapeHtml(item.department)} ${item.team ? `/ ${escapeHtml(item.team)}` : ""}</td>
        <td>
          ${escapeHtml(item.date_str)}
          ${dDayBadge}
        </td>
        <td class="money" style="color:var(--muted);">${formatMoney(item.fee)}</td>
        <td class="money" style="color:var(--muted);">${formatMoney(item.refund)}</td>
        <td class="money" style="font-weight:800; color:#34d399;">${formatMoney(item.net_fee)}</td>
        <td style="text-align:left;" title="${escapeHtml(item.vendor)}">
          ${escapeHtml(item.vendor || "-")}
        </td>
        
        <!-- 입금여부 날짜 다이렉트 셀렉트 -->
        <td onclick="event.stopPropagation();">
          <input type="date" value="${item.payment_date || ''}" 
            onchange="updateTrainingDate('${item.id}', 'payment_date', this.value)"
            style="min-height:28px; min-width:120px; font-size:11px; padding:0 6px; border-radius:6px; background:rgba(255,255,255,0.06); border:1px solid var(--line); color:#60a5fa;" />
        </td>
        
        <!-- 환급여부 날짜 다이렉트 셀렉트 -->
        <td onclick="event.stopPropagation();">
          <input type="date" value="${item.refund_date || ''}" 
            onchange="updateTrainingDate('${item.id}', 'refund_date', this.value)"
            style="min-height:28px; min-width:120px; font-size:11px; padding:0 6px; border-radius:6px; background:rgba(255,255,255,0.06); border:1px solid var(--line); color:#34d399;" />
        </td>
        
        <!-- 수료보고서 제출일 -->
        <td onclick="event.stopPropagation();">
          <input type="date" value="${item.report_date || ''}" 
            onchange="updateTrainingDate('${item.id}', 'report_date', this.value)"
            style="min-height:28px; min-width:120px; font-size:11px; padding:0 6px; border-radius:6px; background:rgba(255,255,255,0.06); border:1px solid var(--line); color:#fbbf24;" />
        </td>
        
        <td onclick="event.stopPropagation();">
          <div class="ins-row-actions">
            <button class="secondary-button" type="button" onclick="event.stopPropagation(); openTrainingDialog('${item.id}')">수정</button>
            <button class="danger-button" type="button" onclick="event.stopPropagation(); deleteTraining('${item.id}')">삭제</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// 입금일 및 환급일 변경 즉시 Supabase 동적 저장 API 구현 (신규)
async function updateTrainingDate(id, field, value) {
  const item = trainings.find(x => x.id === id);
  if (!item) return;

  // 로컬 데이터 선반영
  item[field] = value;

  if (supabaseClient) {
    const updatePayload = {};
    updatePayload[field] = value;
    updatePayload["updated_at"] = new Date().toISOString();

    const { error } = await supabaseRequest(`${TRAINING_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(updatePayload),
    });

    if (error) {
      console.error(error);
      alert("Supabase 실시간 날짜 저장에 실패했습니다.");
    }
  }
}

// 외부교육 상세 다이얼로그 열기
function openTrainingDialog(id = null) {
  if (id) {
    const item = trainings.find((x) => x.id === id);
    if (!item) return;

    elements.trDialogTitle.textContent = "교육 정보 수정";
    trFields.id.value = item.id;
    trFields.affiliation.value = item.affiliation;
    trFields.name.value = item.name;
    trFields.department.value = item.department;
    trFields.team.value = item.team || "";
    trFields.course.value = item.course;
    trFields.vendor.value = item.vendor;
    trFields.dateStr.value = item.date_str;
    trFields.dateIso.value = item.date_iso;
    trFields.fee.value = item.fee;
    trFields.refund.value = item.refund;
    trFields.netFee.value = item.net_fee;
    trFields.paymentDate.value = item.payment_date || "";
    trFields.refundDate.value = item.refund_date || "";
    trFields.reportDate.value = item.report_date || "";
  } else {
    elements.trDialogTitle.textContent = "교육 정보 추가";
    trFields.id.value = "";
    trFields.affiliation.value = "한일후지코리아";
    trFields.name.value = "";
    trFields.department.value = "";
    trFields.team.value = "";
    trFields.course.value = "";
    trFields.vendor.value = "";
    trFields.dateStr.value = "";
    trFields.dateIso.value = new Date().toISOString().slice(0, 10);
    trFields.fee.value = "";
    trFields.refund.value = "";
    trFields.netFee.value = "";
    trFields.paymentDate.value = "";
    trFields.refundDate.value = "";
    trFields.reportDate.value = "";
  }

  elements.trDialog.showModal();
}

function closeTrainingDialog() {
  elements.trDialog.close();
}

// 외부교육 수정/추가 저장
async function saveTraining(event) {
  event.preventDefault();
  const id = trFields.id.value || crypto.randomUUID();
  const isEdit = trainings.some((x) => x.id === id);

  const draft = {
    id,
    affiliation: trFields.affiliation.value,
    name: trFields.name.value.trim(),
    department: trFields.department.value.trim(),
    team: trFields.team.value.trim(),
    course: trFields.course.value.trim(),
    vendor: trFields.vendor.value.trim(),
    date_str: trFields.dateStr.value.trim(),
    date_iso: trFields.dateIso.value,
    fee: parseInt(trFields.fee.value, 10) || 0,
    refund: parseInt(trFields.refund.value, 10) || 0,
    net_fee: parseInt(trFields.netFee.value, 10) || 0,
    payment_date: trFields.paymentDate.value || null,
    refund_date: trFields.refundDate.value || null,
    report_date: trFields.reportDate.value || null,
  };

  if (supabaseClient) {
    let response;
    if (isEdit) {
      response = await supabaseRequest(`${TRAINING_TABLE}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...draft,
          updated_at: new Date().toISOString(),
        }),
      });
    } else {
      response = await supabaseRequest(TRAINING_TABLE, {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
    }

    if (response.error) {
      console.error("Supabase Save Error Details:", response.error);
      alert(`교육 정보 저장에 실패했습니다. (사유: ${response.error.message || "알 수 없는 오류"})`);
      return;
    }
  }

  // 로컬 상태 동기화 및 렌더링
  if (isEdit) {
    trainings = trainings.map((x) => (x.id === id ? { ...x, ...draft } : x));
  } else {
    trainings = [draft, ...trainings];
  }
  closeTrainingDialog();
  renderTraining();
}

// 외부교육 삭제
async function deleteTraining(id) {
  if (!confirm("이 교육 계획 내역을 데이터베이스에서 영구 삭제하시겠습니까?")) return;

  if (supabaseClient) {
    const { error } = await supabaseRequest(`${TRAINING_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (error) {
      console.error(error);
      alert("교육 정보 삭제에 실패했습니다.");
      return;
    }
  }

  trainings = trainings.filter((x) => x.id !== id);
  renderTraining();
}

// 엑셀 날짜 파싱 유틸
function parseExcelDate(dateVal) {
  if (!dateVal) return "9999-12-31";
  const dateStr = String(dateVal).trim();

  let match = dateStr.match(/(\d{1,2})\/(\d{1,2})/);
  if (match) {
    return `2026-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
  }

  match = dateStr.match(/(\d{1,2})월\s*(\d{1,2})일/);
  if (match) {
    return `2026-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
  }

  return "9999-12-31";
}

// 엑셀 업로드 임포트 처리 (payment_date 및 refund_date 컬럼을 빈 값으로 초기화)
async function importTrainingExcel(e) {
  const file = e.target.files[0];
  if (!file) return;

  const confirmUpload = confirm("엑셀에서 교육 계획을 불러와 Supabase 데이터베이스에 반영하시겠습니까?");
  if (!confirmUpload) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const records = [];

      if (wb.SheetNames.includes("HFK")) {
        const hfkSheet = XLSX.utils.sheet_to_json(wb.Sheets["HFK"]);
        hfkSheet.forEach((row) => {
          if (!row["성명"]) return;
          records.push({
            affiliation: "한일후지코리아",
            department: row["부서명"] || "",
            team: row["팀명"] || "",
            name: row["성명"],
            course: String(row["교육과정명"] || "").trim(),
            date_str: row["날짜"] || "",
            date_iso: parseExcelDate(row["날짜"]),
            fee: Number(row["금액"]) || 0,
            refund: Number(row["예상 환급"]) || 0,
            net_fee: Number(row["예상 실 부담금"]) || Number(row["예상 실 부담액"]) || 0,
            vendor: row["업체"] || "",
            payment_date: "",
            refund_date: "",
          });
        });
      }

      if (wb.SheetNames.includes("FGL")) {
        const fglSheet = XLSX.utils.sheet_to_json(wb.Sheets["FGL"]);
        fglSheet.forEach((row) => {
          if (!row["성명"]) return;
          records.push({
            affiliation: "후지글로벌로지스틱",
            department: row["부서명"] || "",
            team: row["팀명"] || "",
            name: row["성명"],
            course: String(row["교육과정명"] || "").trim(),
            date_str: row["날짜"] || "",
            date_iso: parseExcelDate(row["날짜"]),
            fee: Number(row["금액"]) || 0,
            refund: Number(row["예상 환급"]) || 0,
            net_fee: Number(row["예상 실 부담금"]) || Number(row["예상 실 부담액"]) || 0,
            vendor: row["업체"] || "",
            payment_date: "",
            refund_date: "",
          });
        });
      }

      if (records.length === 0) {
        alert("시트(HFK, FGL)를 찾을 수 없거나 파싱할 수 있는 임직원 데이터가 없습니다.");
        return;
      }

      if (supabaseClient) {
        await supabaseRequest(`${TRAINING_TABLE}?id=neq.00000000-0000-0000-0000-000000000000`, {
          method: "DELETE",
        });

        const chunkSize = 50;
        for (let i = 0; i < records.length; i += chunkSize) {
          const chunk = records.slice(i, i + chunkSize);
          const { error } = await supabaseRequest(TRAINING_TABLE, {
            method: "POST",
            body: JSON.stringify(chunk),
          });
          if (error) {
            console.error("Bulk upload error:", error);
          }
        }
      }

      trainings = records;
      renderTraining();
      showUpcomingTrainingsPopup();
      alert(`총 ${records.length}건의 외부교육 일정이 성공적으로 Supabase에 업데이트되었습니다!`);

    } catch (err) {
      console.error(err);
      alert("엑셀 파일 파싱 중 예외가 발생하였습니다.");
    } finally {
      elements.trainingExcelUpload.value = "";
    }
  };
  reader.readAsBinaryString(file);
}

// 이번 주 임박 교육 일정 공지 팝업 연동
function showUpcomingTrainingsPopup() {
  const upcoming = trainings.filter((item) => {
    const dDay = getTrainingDDay(item.date_iso);
    return dDay !== null && dDay >= 0 && dDay <= 7;
  }).sort((a, b) => getTrainingDDay(a.date_iso) - getTrainingDDay(b.date_iso));

  if (upcoming.length > 0) {
    elements.upcomingTrainingsList.innerHTML = upcoming.map((item) => {
      const dDay = getTrainingDDay(item.date_iso);
      const color = dDay <= 3 ? "#ef4444" : "#fbbf24";
      return `
        <div class="upcoming-item">
          <div class="upcoming-info">
            <h4>${escapeHtml(item.course)}</h4>
            <p>${escapeHtml(item.affiliation)} | ${escapeHtml(item.name)} (${escapeHtml(item.department)})</p>
          </div>
          <div class="upcoming-days" style="color: ${color};">
            D-${dDay === 0 ? "Day" : dDay}
          </div>
        </div>
      `;
    }).join("");
    elements.modalOverlay.style.display = "flex";
  }
}

// ==========================================
// 9. 날짜 및 기타 헬퍼 함수 (기존 유지)
// ==========================================

function milestoneDate(hireDate, months) {
  const date = new Date(`${hireDate}T00:00:00`);
  date.setMonth(date.getMonth() + months);
  return date;
}

function isDueThisMonth(hireDate, months) {
  if (!hireDate) return false;
  const due = milestoneDate(hireDate, months);
  const today = new Date();
  return due.getFullYear() === today.getFullYear() && due.getMonth() === today.getMonth();
}

function hasDueThisMonth(person) {
  return MILESTONES.some((milestone) => {
    const state = normalizePerson(person).milestones[milestone.key];
    return isApplicationDueThisMonth(person.hireDate, milestone) && (!state.applied || !state.received);
  });
}

function applicationSchedule(hireDate, milestone) {
  if (!hireDate) return "-";
  const payrollMonth = addMonths(hireDate, milestone.payrollOffset);
  return `${formatYearMonth(payrollMonth)} 급여 후 신청`;
}

function applicationDueDate(hireDate, milestone) {
  return addMonths(hireDate, milestone.payrollOffset);
}

function isApplicationDueThisMonth(hireDate, milestone) {
  if (!hireDate) return false;
  const due = applicationDueDate(hireDate, milestone);
  const today = new Date();
  return due.getFullYear() === today.getFullYear() && due.getMonth() === today.getMonth();
}

function addMonths(hireDate, offset) {
  const date = new Date(`${hireDate}T00:00:00`);
  date.setMonth(date.getMonth() + offset);
  return date;
}

function formatYearMonth(date) {
  return `${String(date.getFullYear()).slice(2)}년 ${date.getMonth() + 1}월`;
}

function formatDate(value) {
  if (!value) return "";
  return value.replaceAll("-", ".");
}

function formatMoney(value) {
  return `${Number(value).toLocaleString("ko-KR")}원`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function monthsWorked(hireDate) {
  if (!hireDate) return 0;
  const start = new Date(`${hireDate}T00:00:00`);
  const today = new Date();
  let months = (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth();
  if (today.getDate() < start.getDate()) months -= 1;
  return Math.max(months, 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Supabase REST API 통신용 공통 함수
async function supabaseRequest(path, options = {}) {
  if (!supabaseClient) {
    return { data: null, error: { message: "Supabase 설정이 올바르지 않습니다." } };
  }
  const headers = {
    apikey: supabaseClient.anonKey,
    Authorization: `Bearer ${supabaseClient.anonKey}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(`${supabaseClient.url}/rest/v1/${path}`, {
      ...options,
      headers,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return { data: null, error: data || { message: response.statusText, status: response.status } };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

function toSupabaseRow(person) {
  const normalized = normalizePerson(person);
  return {
    id: normalized.id,
    company: normalized.company,
    department: normalized.department,
    team: normalized.team,
    position: normalized.position,
    name: normalized.name,
    hire_date: normalized.hireDate,
    resignation_date: normalized.resignationDate || null,
    application_period: normalized.applicationPeriod,
    insurance_applied: normalized.insuranceApplied,
    milestones: normalized.milestones,
  };
}

function fromSupabaseRow(row) {
  return {
    id: row.id,
    company: row.company,
    department: row.department,
    team: row.team,
    position: row.position,
    name: row.name,
    hireDate: row.hire_date,
    resignationDate: row.resignation_date ?? "",
    applicationPeriod: row.application_period,
    insuranceApplied: row.insurance_applied,
    milestones: row.milestones,
  };
}
