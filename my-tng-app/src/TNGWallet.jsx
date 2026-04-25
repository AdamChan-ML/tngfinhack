import { useState } from "react";
import cimbLogo from "./assets/CIMB-Logo.jpg";
import publicBankLogo from "./assets/public-bank.svg";
import maybankLogo from "./assets/maybank.png";
import { analyzeUserGoal } from "./api/plannerApi";

const COLORS = {
  blue: "#1450d0",
  darkBlue: "#001A3C",
  lightBlue: "#e8f0fe",
  red: "#e8192c",
  green: "#00a86b",
  orange: "#f5a623",
  yellow: "#fff8ed",
  bg: "#f0f2f5",
  white: "#ffffff",
  gray: "#888",
  lightGray: "#f4f6fb",
  border: "#e8eaf0",
  text: "#1a1a2e",
};

const PLANNER_STORAGE_KEY = "tng-wallet-planner-v1";
const DEFAULT_SAMPLE_FILE_NAME = "transaction_lines_sample.txt";

const buildUserBackgroundPayload = (goalText) => ({
  occupation: "Retail staff",
  monthly_income: 3000,
  monthly_expenses: 2400,
  savings_balance: 900,
  existing_debt: 500,
  risk_tolerance: "medium",
  notes: `UI onboarding goal context: ${goalText}`,
});

const fallbackMilestones = [
  {
    title: "Start GO+ weekly auto-save",
    hint: "Set RM50-RM100 weekly auto-save to build consistency.",
    status: "in_progress",
    optional: false,
    facility: "GO+",
    action_label: "Open GO+",
  },
  {
    title: "Build RM1,000 emergency buffer",
    hint: "Keep funds liquid in GO+ before considering any loan.",
    status: "pending",
    optional: false,
    facility: "GO+",
    action_label: "Open GO+",
  },
  {
    title: "Simulate RM200 monthly repayment",
    hint: "Do this for 3 months to test repayment discipline.",
    status: "pending",
    optional: false,
    facility: "GOpinjam",
    action_label: "Open CashLoan",
  },
  {
    title: "Recheck affordability before GOpinjam",
    hint: "Only proceed if repayment is within safe cashflow limits.",
    status: "pending",
    optional: false,
    facility: "GOpinjam",
    action_label: "Open CashLoan",
  },
];

const inferFacilityFromText = (text = "") => {
  const lower = text.toLowerCase();

  if (["go+", "buffer", "emergency", "autosave", "auto-save"].some((keyword) => lower.includes(keyword))) {
    return { facility: "GO+", action_label: "Open GO+" };
  }
  if (["gopinjam", "cashloan", "cash loan", "loan"].some((keyword) => lower.includes(keyword))) {
    return { facility: "GOpinjam", action_label: "Open CashLoan" };
  }
  if (["goinvest", "invest", "investment", "asnb", "e-mas", "principal", "e-trade"].some((keyword) => lower.includes(keyword))) {
    return { facility: "GOinvest", action_label: "Open GOinvest" };
  }
  if (["goinsure", "insure", "insurance", "protection"].some((keyword) => lower.includes(keyword))) {
    return { facility: "GOinsure", action_label: "Open GOinsure" };
  }

  return { facility: null, action_label: null };
};

const parseMilestonesFromText = (text = "") => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
  .filter((line) => /^[-•✅❗]/.test(line) || /^\d+[.)]/.test(line))
  .map((line) => line.replace(/^[-•✅❗\s]+/, "").replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);

  if (!lines.length) {
    return fallbackMilestones;
  }

  return lines.slice(0, 4).map((line, index) => ({
    ...inferFacilityFromText(line),
    title: line.slice(0, 90),
    hint: "Track this in your weekly review.",
    status: index === 0 ? "in_progress" : "pending",
    optional: false,
  }));
};

const normalizePlannerFromApi = (apiData, goalText) => {
  const planner = apiData?.planner;
  const milestones = Array.isArray(planner?.milestones) && planner.milestones.length
    ? planner.milestones.map((item, index) => {
        const inferred = inferFacilityFromText(item?.title || "");
        return {
          title: item?.title || `Step ${index + 1}`,
          hint: item?.hint || "Keep progressing with this step.",
          status: item?.status === "in_progress" || item?.status === "done" ? item.status : "pending",
          optional: Boolean(item?.optional),
          facility: item?.facility || inferred.facility,
          action_label: item?.action_label || inferred.action_label,
        };
      })
    : parseMilestonesFromText(`${apiData?.plan || ""}\n${apiData?.growth || ""}`);

  return {
    goalText,
    score: Number.isFinite(apiData?.score) ? apiData.score : 0,
    headline: planner?.headline || "Your personalized roadmap is ready.",
    quickSummary: Array.isArray(planner?.quick_summary) ? planner.quick_summary.slice(0, 3) : [],
    guardrails: Array.isArray(planner?.guardrails) ? planner.guardrails.slice(0, 4) : [],
    milestones,
  };
};

const loadStoredPlanner = () => {
  const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
  if (!raw) return null;

  try {
    const saved = JSON.parse(raw);
    if (!saved?.goalText || !Array.isArray(saved?.milestones)) {
      return null;
    }
    return saved;
  } catch {
    localStorage.removeItem(PLANNER_STORAGE_KEY);
    return null;
  }
};

const styles = {
  phone: {
    width: 390,
    margin: "0 auto",
    background: COLORS.white,
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
  },
  // Status bar
  statusBar: {
    background: COLORS.blue,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px 6px",
  },
  timePill: {
    background: "#4caf50",
    color: "#fff",
    fontSize: 11,
    fontWeight: 800,
    padding: "2px 9px",
    borderRadius: 20,
  },
  statusRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
  },
  batteryBadge: {
    background: COLORS.orange,
    color: "#fff",
    fontSize: 11,
    fontWeight: 800,
    padding: "2px 7px",
    borderRadius: 4,
  },
  // Header
  header: {
    background: COLORS.blue,
    padding: "10px 14px 0",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  flagPill: {
    background: "rgba(255,255,255,0.18)",
    borderRadius: 30,
    padding: "5px 10px 5px 6px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
    border: "none",
  },
  searchBox: {
    flex: 1,
    background: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: "7px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  avatarWrap: { position: "relative", cursor: "pointer" },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#d0d8e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  notifDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    background: COLORS.red,
    borderRadius: "50%",
    border: `2px solid ${COLORS.blue}`,
  },
  coinDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    background: COLORS.orange,
    borderRadius: "50%",
    border: `2px solid ${COLORS.blue}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 7,
    color: "#fff",
    fontWeight: 900,
  },
  // Balance
  balanceArea: {
    background: COLORS.blue,
    padding: "18px 16px 32px",
  },
  balRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  shieldIcon: {
    width: 28,
    height: 28,
    background: "rgba(255,255,255,0.15)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },
  balAmount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: -0.5,
  },
  eyeBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
    cursor: "pointer",
    marginLeft: 4,
    padding: 0,
  },
  viewAssets: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    marginBottom: 16,
    background: "none",
    border: "none",
    fontFamily: "inherit",
  },
  balBtns: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  addMoneyBtn: {
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.8)",
    borderRadius: 30,
    color: "#fff",
    fontSize: 13,
    fontWeight: 800,
    padding: "8px 20px",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  txnLink: {
    color: "#fff",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "none",
    border: "none",
    fontFamily: "inherit",
  },
  // Quick actions
  quickActions: {
    background: COLORS.white,
    margin: "0 10px",
    borderRadius: 16,
    marginTop: -16,
    padding: "18px 10px",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  qaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 4,
  },
  qaItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    padding: "6px 4px",
    background: "none",
    border: "none",
    fontFamily: "inherit",
  },
  qaLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.text,
    textAlign: "center",
  },
  // Cards
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    margin: "10px 10px 0",
  },
  miniCard: {
    background: COLORS.lightGray,
    borderRadius: 14,
    padding: "12px 14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  fuelCard: {
    background: COLORS.lightGray,
    borderRadius: 14,
    padding: "12px 14px",
    cursor: "pointer",
  },
  // Section
  sectionTitle: {
    fontSize: 15,
    fontWeight: 900,
    color: COLORS.text,
    padding: "14px 14px 10px",
  },
  scrollRow: {
    display: "flex",
    gap: 16,
    padding: "0 14px 14px",
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  // Tab bar
  tabBar: {
    background: COLORS.white,
    borderTop: `1px solid ${COLORS.border}`,
    display: "flex",
    padding: "10px 0 18px",
    position: "sticky",
    bottom: 0,
    zIndex: 10,
  },
};

// SVG Icons
const ApplyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="6" width="22" height="18" rx="3" stroke={COLORS.blue} strokeWidth="2" />
    <line x1="8" y1="12" x2="20" y2="12" stroke={COLORS.blue} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="16" x2="20" y2="16" stroke={COLORS.blue} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="20" x2="14" y2="20" stroke={COLORS.blue} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="27" cy="25" r="6" fill={COLORS.blue} />
    <path d="M25 25h4M27 23v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CashFlowIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="12" stroke={COLORS.blue} strokeWidth="2" />
    <path d="M18 8v10" stroke={COLORS.blue} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 18l6 3.5" stroke={COLORS.blue} strokeWidth="2" strokeLinecap="round" />
    <path d="M10 25a10 10 0 0 1 0-14" stroke={COLORS.blue} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M9 22l1 3 3-1" stroke={COLORS.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TransferIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="13" stroke={COLORS.blue} strokeWidth="2" />
    <path d="M13 18h10M19 14l4 4-4 4" stroke={COLORS.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardsIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="5" y="10" width="26" height="16" rx="3" stroke={COLORS.blue} strokeWidth="2" />
    <rect x="5" y="15" width="26" height="4" fill={COLORS.blue} />
    <circle cx="11" cy="21" r="2" fill={COLORS.blue} />
  </svg>
);

const QRIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#fff" strokeWidth="2" />
    <rect x="5" y="5" width="3" height="3" fill="#fff" />
    <rect x="16" y="5" width="3" height="3" fill="#fff" />
    <rect x="5" y="16" width="3" height="3" fill="#fff" />
    <rect x="14" y="14" width="3" height="3" fill="#fff" />
    <rect x="18" y="14" width="3" height="3" fill="#fff" />
    <rect x="14" y="18" width="3" height="3" fill="#fff" />
    <rect x="18" y="18" width="3" height="3" fill="#fff" />
  </svg>
);

const FuelRing = ({ percent = 0.75 }) => {
  const r = 17;
  const circ = 2 * Math.PI * r;
  const dash = circ * percent;
  return (
    <div style={{ position: "relative", width: 44, height: 44 }}>
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="#e0e8f8" strokeWidth="5" />
        <circle
          cx="22" cy="22" r={r} fill="none"
          stroke={COLORS.blue} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", fontSize: 14,
      }}>⛽</div>
    </div>
  );
};

const PromoCarousel = () => {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      tag: "Remittance",
      title: <>Get <span style={{ color: COLORS.orange }}>RM5</span> when you refer family &amp; friends to use Remittance</>,
      sub: "Find out more",
      emoji: "👨‍👩‍👧‍👦",
      badge: "GO finance",
    },
    {
      tag: "Travel",
      title: <>Fly now, pay later with <span style={{ color: COLORS.orange }}>GOfinance</span></>,
      sub: "Learn more",
      emoji: "✈️",
      badge: "GO finance",
    },
    {
      tag: "Rewards",
      title: <>Earn <span style={{ color: COLORS.orange }}>3x points</span> every weekend this April</>,
      sub: "Check deals",
      emoji: "🎁",
      badge: "GOrewards",
    },
  ];
  return (
    <div style={{ margin: "10px 10px 0" }}>
      <div
        style={{
          borderRadius: 14, overflow: "hidden", background: COLORS.blue,
          padding: 16, position: "relative", minHeight: 110, cursor: "pointer",
        }}
        onClick={() => setSlide((slide + 1) % slides.length)}
      >
        <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>Info</span>
          <span style={{ background: COLORS.orange, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 4 }}>{slides[slide].tag}</span>
        </div>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, lineHeight: 1.3, maxWidth: 200 }}>{slides[slide].title}</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, marginTop: 6 }}>{slides[slide].sub}</div>
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "3px 7px" }}>
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>{slides[slide].badge}</span>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>
          {slides[slide].emoji}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingTop: 8 }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setSlide(i)}
            style={{
              height: 8, borderRadius: 4, cursor: "pointer",
              width: i === slide ? 20 : 8,
              background: i === slide ? COLORS.blue : "#ccc",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const GoPlusIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="20" stroke="#1450d0" strokeWidth="2.5" />
    <circle cx="22" cy="22" r="14" fill="#f5c800" />
    <text x="19" y="27" fontSize="13" fontWeight="900" fill="#1a1a2e" fontFamily="Nunito,sans-serif">$</text>
    <circle cx="32" cy="12" r="6" fill="#1450d0" />
    <text x="29.5" y="16" fontSize="11" fontWeight="900" fill="#fff" fontFamily="Nunito,sans-serif">+</text>
  </svg>
);

const GoInvestIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 19h16" stroke="#1450d0" strokeWidth="2" strokeLinecap="round" />
    <path d="M5.5 19V8.8" stroke="#1450d0" strokeWidth="2" strokeLinecap="round" />
    <path d="M7.2 16.8l3.3-4.1 2.8 2.2 4.8-6" stroke="#1450d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.2 16.8l3.3-4.1 2.8 2.2 4.8-6v8.6H7.2z" fill="#f5cf17" opacity="0.9" />
    <circle cx="18.1" cy="8.9" r="1.5" fill="#1450d0" />
  </svg>
);

const CashLoanIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3.2 15.2h4.6c1.2 0 2-.8 2.8-1.4.8-.6 1.8-1.1 3.1-1.1h1.7c1.6 0 2.8 1.1 2.8 2.5v2.9H10.3c-1.2 0-2.3.4-3.3 1.1l-2 .2" stroke="#0a66d9" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="15.8" cy="7.7" r="3.6" fill="#f5cf17" stroke="#0a66d9" strokeWidth="1.8" />
    <path d="M15.8 6.2v3" stroke="#0a66d9" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14.3 7.7h3" stroke="#0a66d9" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CashLoanCardIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="20" stroke="#1450d0" strokeWidth="2.5" />
    <circle cx="22" cy="22" r="14" fill="#f5c800" />
    <rect x="14" y="16" width="16" height="12" rx="2" fill="#1450d0" />
    <circle cx="22" cy="22" r="3" fill="#f5c800" />
    <path d="M14 19h16M14 25h16" stroke="#fff" strokeWidth="1" strokeDasharray="2 2"/>
    <circle cx="32" cy="12" r="6" fill="#1450d0" />
    <path d="M29 12l2 2 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GoPlusAndPlanningRow = ({ isDemoAchieved, onApplyNow, onStartSaving }) => {
  // Switch to green colors when the demo goal is achieved to differentiate it completely
  const activeColor = isDemoAchieved ? COLORS.green : COLORS.blue;
  const activeBg = isDemoAchieved ? "#e8f8ee" : "#eef2ff";
  const activeBarBg = isDemoAchieved ? "#bcf0d4" : "#d0d9f8";

  const stages = isDemoAchieved
    ? [
        { label: "Plan", done: true },
        { label: "Save", done: true },
        { label: "Invest", done: true },
        { label: "Finance", done: true },
      ]
    : [
        { label: "Plan", done: true },
        { label: "Save", done: true },
        { label: "Invest", done: false },
        { label: "Finance", done: false },
      ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 10px 0" }}>

      {/* Dynamic GO+ / CashLoan Card */}
      <div
        style={{
          background: "#001A3C",
          borderRadius: 16,
          padding: "14px 14px 12px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "rgba(20,80,208,0.35)", top: -20, right: -20, pointerEvents: "none" }} />
        {isDemoAchieved ? <CashLoanCardIcon /> : <GoPlusIcon />}
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 900, letterSpacing: 0.3 }}>
            {isDemoAchieved ? "CashLoan" : "GO+"}
          </div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 600, marginTop: 2 }}>
            {isDemoAchieved ? "Personal Financing" : "Savings Plan"}
          </div>
        </div>
        <div style={{ background: "rgba(74,222,128,0.15)", borderRadius: 8, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4, minHeight: 22 }}>
          <span style={{ color: "#4ADE80", fontSize: isDemoAchieved ? 10 : 12, fontWeight: 900, textAlign: "center", lineHeight: 1.2 }}>
            {isDemoAchieved ? "Ready for Application" : "2.80% p.a."}
          </span>
        </div>
        <button
          onClick={() => {
            if (isDemoAchieved && onApplyNow) {
              onApplyNow();
              return;
            }
            if (!isDemoAchieved && onStartSaving) {
              onStartSaving();
            }
          }}
          style={{
            width: "100%",
            background: COLORS.blue,
            borderRadius: 10,
            padding: "7px 0",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>
            {isDemoAchieved ? "Apply Now ›" : "Start Saving ›"}
          </span>
        </button>
      </div>

      {/* Financial Planning Stages Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8eaf0",
          borderRadius: 16,
          padding: "14px 14px 12px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 900, color: COLORS.text }}>My Journey</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: activeColor, transition: "color 0.5s ease" }}>View ›</span>
        </div>

        {/* Progress track */}
        <div style={{ position: "relative", paddingTop: 6 }}>
          <div style={{ position: "absolute", top: 17, left: 8, right: 8, height: 3, background: "#e8eaf0", borderRadius: 4, zIndex: 0 }} />
          <div style={{ 
            position: "absolute", 
            top: 17, 
            left: 8, 
            width: isDemoAchieved ? "100%" : "45%", 
            height: 3, 
            background: activeColor, 
            borderRadius: 4, 
            zIndex: 1, 
            transition: "all 0.5s ease" 
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {stages.map(({ label, done }, i) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: done ? activeColor : "#e8eaf0",
                  border: `2px solid ${done ? activeColor : "#ccc"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.5s ease"
                }}>
                  {done && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
                  {!done && i === 2 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeColor, display: "block" }} />}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: done ? activeColor : "#bbb", textAlign: "center", lineHeight: 1.2, transition: "color 0.5s ease" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current stage info */}
        <div style={{ background: activeBg, borderRadius: 10, padding: "8px 10px", transition: "background 0.5s ease" }}>
          <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600 }}>Current stage</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: activeColor, marginTop: 1, transition: "color 0.5s ease" }}>
            {isDemoAchieved ? "Ready to Finance ✦" : "Saver ✦"}
          </div>
          <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600, marginTop: 2 }}>
            {isDemoAchieved ? "Goal Achieved" : "Next: Investor"}
          </div>
          <div style={{ marginTop: 5, background: activeBarBg, borderRadius: 6, height: 4, overflow: "hidden", transition: "background 0.5s ease" }}>
            <div style={{ 
              height: "100%", 
              width: isDemoAchieved ? "100%" : "35%", 
              background: activeColor, 
              borderRadius: 6,
              transition: "width 0.5s ease"
            }} />
          </div>
          <div style={{ fontSize: 9, color: COLORS.gray, fontWeight: 600, marginTop: 3 }}>
            {isDemoAchieved ? "100% completed" : "35% to next level"}
          </div>
        </div>
      </div>

    </div>
  );
};

const SpendingBar = ({ label, amount, max, color, icon }) => {
  const pct = Math.min((amount / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.text }}>RM {amount.toFixed(0)}</span>
      </div>
      <div style={{ height: 7, background: "#eef1f8", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 10, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
};

const GoalRing = ({ label, current, target, color, icon }) => {
  const pct = Math.min(current / target, 1);
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{ position: "relative", width: 58, height: 58 }}>
        <svg width="58" height="58" viewBox="0 0 58 58" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="29" cy="29" r={r} fill="none" stroke="#eef1f8" strokeWidth="6" />
          <circle cx="29" cy="29" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 18 }}>{icon}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.text, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600 }}>{Math.round(pct * 100)}%</div>
      </div>
    </div>
  );
};

const FinanceDashboard = ({ userGoal, setUserGoal, onOpenOnboarding, isDemoAchieved, onApplyNow }) => {
  const [activeSection, setActiveSection] = useState("spending");
  const [isGoalEditing, setIsGoalEditing] = useState(false);
  
  // Dynamically change the 4th tab depending on the demo state
  const sections = ["spending", "categories", "goals", isDemoAchieved ? "cashloan" : "go+"];

  return (
    <div style={{ margin: "12px 10px 0", background: COLORS.white, borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" }}>
      {/* Financial Goal Snapshot */}
      <div style={{ padding: "12px 14px 6px" }}>
        <div style={{
          background: "#f6f8ff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: "10px 12px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: COLORS.text }}>Financial Goal Snapshot</span>
            <button
              onClick={() => setIsGoalEditing((prev) => !prev)}
              style={{
                border: "none",
                background: "none",
                color: COLORS.blue,
                fontSize: 10,
                fontWeight: 900,
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              {isGoalEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13 }}>🎯</span>
            <input
              value={userGoal}
              onChange={(e) => setUserGoal(e.target.value)}
              disabled={!isGoalEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsGoalEditing(false);
                }
              }}
              style={{
                width: "100%",
                border: `1px solid ${COLORS.border}`,
                outline: "none",
                background: COLORS.white,
                fontSize: 11,
                fontWeight: 800,
                color: COLORS.text,
                fontFamily: "inherit",
                borderRadius: 8,
                padding: "8px 10px",
                opacity: isGoalEditing ? 1 : 0.8,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            <button
              onClick={onOpenOnboarding}
              style={{
                border: "none",
                background: "none",
                color: COLORS.blue,
                fontSize: 10,
                fontWeight: 900,
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              Run onboarding ↗
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "14px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: COLORS.text }}>My Finance</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.blue, cursor: "pointer" }}>April 2025 ▾</span>
      </div>

      {/* Tab Pills */}
      <div style={{ display: "flex", gap: 6, padding: "10px 14px", overflowX: "auto", scrollbarWidth: "none" }}>
        {sections.map((s) => {
          let labelText = s.charAt(0).toUpperCase() + s.slice(1);
          if (s === "go+") labelText = "GO+";
          if (s === "cashloan") labelText = "CashLoan";

          return (
            <button key={s} onClick={() => setActiveSection(s)} style={{
              flexShrink: 0, padding: "5px 13px", borderRadius: 20, border: "none",
              background: activeSection === s ? COLORS.blue : "#eef1f8",
              color: activeSection === s ? "#fff" : COLORS.gray,
              fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
              textTransform: "capitalize", transition: "all 0.2s",
            }}>
              {labelText}
            </button>
          )
        })}
      </div>

      {/* Spending Trends */}
      {activeSection === "spending" && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            {[
              { month: "Feb", amt: 820, active: false },
              { month: "Mar", amt: 1140, active: false },
              { month: "Apr", amt: 680, active: true },
            ].map(({ month, amt, active }) => (
              <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: active ? COLORS.blue : COLORS.gray }}>{month}</span>
                <div style={{ width: 36, background: "#eef1f8", borderRadius: 8, height: 60, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                  <div style={{ width: "100%", borderRadius: 8, background: active ? COLORS.blue : "#c8d5f0", height: `${(amt / 1200) * 100}%`, transition: "height 0.5s ease" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? COLORS.text : COLORS.gray }}>RM {amt}</span>
              </div>
            ))}
            <div style={{ flex: 2, paddingLeft: 14 }}>
              <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 600, marginBottom: 4 }}>This month</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.text, lineHeight: 1 }}>RM 680</div>
              <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700, marginTop: 3 }}>▼ 40% vs last month</div>
              <div style={{ marginTop: 8, background: "#eef1f8", borderRadius: 8, height: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "45%", background: COLORS.green, borderRadius: 8 }} />
              </div>
              <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600, marginTop: 3 }}>RM 680 of RM 1,500 budget</div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      {activeSection === "categories" && (
        <div style={{ padding: "0 16px 16px" }}>
          <SpendingBar label="Food & Drinks" amount={234} max={600} color="#f5a623" icon="🍔" />
          <SpendingBar label="Transport" amount={156} max={600} color={COLORS.blue} icon="🚗" />
          <SpendingBar label="Shopping" amount={189} max={600} color={COLORS.red} icon="🛍️" />
          <SpendingBar label="Bills & Utilities" amount={78} max={600} color={COLORS.green} icon="💡" />
          <SpendingBar label="Entertainment" amount={23} max={600} color="#9b59b6" icon="🎮" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: COLORS.text }}>Total: <span style={{ color: COLORS.blue }}>RM 680</span></span>
          </div>
        </div>
      )}

      {/* Goals */}
      {activeSection === "goals" && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 14 }}>
            <GoalRing label={<>Emergency<br/>Fund</>} current={3200} target={5000} color={COLORS.blue} icon="🏦" />
            <GoalRing label={<>Vacation<br/>Bali</>} current={800} target={2000} color={COLORS.orange} icon="✈️" />
            <GoalRing label={<>New<br/>Laptop</>} current={1500} target={1800} color={COLORS.green} icon="💻" />
          </div>
          <div style={{ background: "#eef1f8", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 600 }}>Total saved</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.text }}>RM 5,500</div>
            </div>
            <button style={{ background: COLORS.blue, color: "#fff", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
              + New Goal
            </button>
          </div>
        </div>
      )}

      {/* GO+ Info Tab */}
      {activeSection === "go+" && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ background: "#001A3C", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  GO+ Balance
                </div>
                <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 2 }}>RM 1,205.00</div>
                <div style={{ color: "#4ADE80", fontSize: 11, fontWeight: 700, marginTop: 3 }}>
                  +RM 2.82 earned today
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: "rgba(74,222,128,0.15)", borderRadius: 8, padding: "4px 10px" }}>
                  <div style={{ color: "#4ADE80", fontSize: 14, fontWeight: 900 }}>
                    2.80%
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 700 }}>
                    p.a.
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{ flex: 1, background: COLORS.blue, color: "#fff", border: "none", borderRadius: 10, padding: "8px 0", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                + Top Up
              </button>
              <button style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 0", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                Withdraw
              </button>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "This month earned", val: "RM 2.34", color: COLORS.green, icon: "📈" },
              { label: "Total earned", val: "RM 18.90", color: COLORS.blue, icon: "💰" },
              { label: "Days active", val: "87 days", color: COLORS.orange, icon: "📅" },
              { label: "Projected annual", val: "RM 33.74", color: "#9b59b6", icon: "🎯" },
            ].map(({ label, val, color, icon }) => (
              <div key={label} style={{ background: "#eef1f8", borderRadius: 12, padding: "10px 12px" }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <div style={{ fontSize: 14, fontWeight: 900, color, marginTop: 4 }}>{val}</div>
                <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CashLoan Info Tab (Shown when demo achieved) */}
      {activeSection === "cashloan" && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ background: "#001A3C", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Pre-Approved Offer
                </div>
                <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 2 }}>RM 10,000.00</div>
                <div style={{ color: "#4ADE80", fontSize: 11, fontWeight: 700, marginTop: 3 }}>
                  Ready for Application
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: "rgba(74,222,128,0.15)", borderRadius: 8, padding: "4px 10px" }}>
                  <div style={{ color: "#4ADE80", fontSize: 14, fontWeight: 900 }}>
                    8.00%
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 700 }}>
                    p.a.
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={onApplyNow}
                style={{ flex: 1, background: COLORS.blue, color: "#fff", border: "none", borderRadius: 10, padding: "8px 0", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
              >
                Apply Now
              </button>
              <button style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 0", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                View Details
              </button>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Max Term", val: "60 Months", color: COLORS.green, icon: "📅" },
              { label: "Est. Monthly", val: "RM 233", color: COLORS.blue, icon: "💵" },
              { label: "Processing", val: "Fast Approval", color: COLORS.orange, icon: "⚡" },
              { label: "Interest Rate", val: "8.0% p.a.", color: "#9b59b6", icon: "🎯" },
            ].map(({ label, val, color, icon }) => (
              <div key={label} style={{ background: "#eef1f8", borderRadius: 12, padding: "10px 12px" }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <div style={{ fontSize: 14, fontWeight: 900, color, marginTop: 4 }}>{val}</div>
                <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Tab = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      gap: 3, cursor: "pointer", border: "none", background: "none",
      fontFamily: "inherit", padding: "4px 0",
    }}
  >
    <span style={{ fontSize: 20, filter: active ? "none" : "grayscale(1)", opacity: active ? 1 : 0.4 }}>{icon}</span>
    <span style={{ fontSize: 10, fontWeight: 700, color: active ? COLORS.blue : "#999" }}>{label}</span>
  </button>
);

const MilestoneProductIcon = ({ title, facility }) => {
  const normalized = (title || "").toLowerCase();
  const normalizedFacility = (facility || "").toLowerCase();
  const BLUE = "#0a66d9";

  const baseWrap = {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  if (normalizedFacility) {
    return (
      <div style={baseWrap}>
        <FacilityActionIcon facility={normalizedFacility} size={28} />
      </div>
    );
  }

  if (normalized.includes("insurance")) {
    return (
      <div style={baseWrap}>
        <FacilityActionIcon facility="goinsure" size={28} />
      </div>
    );
  }

  if (normalized.includes("cashloan") || normalized.includes("loan")) {
    return (
      <div style={baseWrap}>
        <FacilityActionIcon facility="gopinjam" size={28} />
      </div>
    );
  }

  if (normalized.includes("invest")) {
    return (
      <div style={baseWrap}>
        <FacilityActionIcon facility="goinvest" size={28} />
      </div>
    );
  }

  if (normalized.includes("go+")) {
    return (
      <div style={baseWrap}>
        <FacilityActionIcon facility="go+" size={28} />
      </div>
    );
  }

  return (
    <div style={baseWrap}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="7" stroke={BLUE} strokeWidth="1.8" />
        <path d="M12 8.2v7.6M8.2 12h7.6" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const InsuranceOptionIcon = ({ label }) => {
  const key = (label || "").toLowerCase();
  const BLUE = "#0a66d9";
  const YELLOW = "#f5cf17";

  const shield = (
    <>
      <path d="M14.2 12.4l5 2v2.8c0 2.2-1.5 3.8-3.4 5-1.9-1.2-3.4-2.8-3.4-5v-2.8l1.8-.8z" fill={YELLOW} stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14.6 16.7l1 1 2-2" stroke={BLUE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );

  if (key.includes("car")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M4.2 14.2h11.5l1.8 1.8v2.2H3.2V16l1-1.8z" stroke={BLUE} strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="7.2" cy="18.2" r="1.2" fill={BLUE} />
        <circle cx="13.8" cy="18.2" r="1.2" fill={BLUE} />
        <path d="M5.2 14.2l1.5-2.6h6.5l1.8 2.6" stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("moto")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="16.8" r="2" stroke={BLUE} strokeWidth="1.7" />
        <circle cx="13.2" cy="16.8" r="2" stroke={BLUE} strokeWidth="1.7" />
        <path d="M7 16.8h3l1.3-2.4h2.2" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.8 11.8h2.4M9.8 10.4h1.8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("safetrip")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M4.2 8.2h12.5v9.8H4.2z" stroke={BLUE} strokeWidth="1.8" />
        <path d="M8 8.2V6.1h5V8.2" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M6.5 12.4h3.8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("wallet")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="8" width="13.5" height="8.8" rx="2" stroke={BLUE} strokeWidth="1.8" />
        <path d="M4 10.2h9.8" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="15.1" cy="12.4" r="0.9" fill={BLUE} />
        {shield}
      </svg>
    );
  }

  if (key.includes("ci insure")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M8.8 17.5c-2.7 0-4.7-1.8-4.7-4.3 0-2.4 1.7-4.2 4-4.2 1 0 1.9.3 2.6.9.8-1.4 2.2-2.3 3.9-2.3 2.5 0 4.5 2 4.5 4.4 0 3.1-2.6 5.5-5.8 5.5H8.8z" stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8.8 12.4h3.8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10.7 10.5v3.8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("med insure")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="8.3" cy="8" r="2.2" stroke={BLUE} strokeWidth="1.7" />
        <path d="M5.8 15.8v-2.2c0-1.5 1.1-2.8 2.6-2.8s2.6 1.3 2.6 2.8v2.2" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8.3 12.8v3M6.8 14.3h3" stroke={BLUE} strokeWidth="1.4" strokeLinecap="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("tenang")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="9.2" r="2" stroke={BLUE} strokeWidth="1.7" />
        <circle cx="11.3" cy="8.2" r="1.8" stroke={BLUE} strokeWidth="1.7" />
        <path d="M4.8 15.8c.3-2.1 1.9-3.4 3.8-3.4s3.5 1.3 3.8 3.4" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("ge insure")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="8.2" r="2" stroke={BLUE} strokeWidth="1.7" />
        <path d="M5.8 15.8v-2c0-1.6 1.1-3 2.5-3s2.5 1.4 2.5 3v2" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M7.8 13l2.2 2.8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("safehome")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M4.6 11.2L11 6l6.4 5.2" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.2 10.8v6.6h9.6v-6.6" stroke={BLUE} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10.2 17.4v-3h1.6v3" stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" />
        {shield}
      </svg>
    );
  }

  if (key.includes("bubblebuddy")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="4.3" y="5" width="13.4" height="13.4" rx="2" stroke={BLUE} strokeWidth="1.7" />
        <circle cx="13.8" cy="11.6" r="4" fill={YELLOW} stroke={BLUE} strokeWidth="1.4" />
        <circle cx="10" cy="9" r="1" stroke={BLUE} strokeWidth="1.3" />
        <path d="M12.6 13.2c.6.7 1.7.8 2.4.2" stroke={BLUE} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  if (key.includes("my policies")) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="4.5" width="9.8" height="14.8" rx="1.8" stroke={BLUE} strokeWidth="1.8" />
        <path d="M8.5 8.2h4.8M8.5 11h4.8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        {shield}
      </svg>
    );
  }

  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="7" stroke={BLUE} strokeWidth="1.8" />
      {shield}
    </svg>
  );
};

const FacilityActionIcon = ({ facility, size = 18 }) => {
  const normalized = (facility || "").toLowerCase();

  if (normalized === "go+") {
    const scale = size / 44;
    return (
      <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
          <GoPlusIcon />
        </div>
      </div>
    );
  }

  if (normalized === "goinvest") {
    return <GoInvestIcon size={size} />;
  }

  if (normalized === "gopinjam") {
    return <CashLoanIcon size={size} />;
  }

  if (normalized === "goinsure") {
    const scale = size / 30;
    return (
      <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
          <InsuranceOptionIcon label="My Policies" />
        </div>
      </div>
    );
  }

  return <span style={{ fontSize: Math.max(12, size - 2) }}>🎯</span>;
};

const FinancialJourneyPage = ({ goalText, milestones, plannerData, onBackHome, onRefineGoal, onUseFacility }) => {
  const totalMilestones = milestones.length;
  const doneCount = milestones.filter((item) => item.status === "done").length;
  const inProgressCount = milestones.filter((item) => item.status === "in_progress").length;
  const pendingCount = Math.max(totalMilestones - doneCount - inProgressCount, 0);
  const progress = totalMilestones ? Math.round((doneCount / totalMilestones) * 100) : 0;
  const insuranceOptions = [
    "CarInsure",
    "MotoInsure",
    "SafeTrip",
    "WalletSafe",
    "CI Insure",
    "Med Insure",
    "Tenang",
    "GE Insure",
    "SafeHome",
    "BubbleBuddy",
    "My Policies",
  ];

  return (
    <div style={{ padding: "14px 12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0f2f7d 0%, #1450d0 60%, #1f63e0 100%)",
          borderRadius: 16,
          padding: "14px 14px 12px",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(20,80,208,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.2, opacity: 0.92 }}>Your Financial Journey Plan</div>
          <div style={{ fontSize: 10, fontWeight: 900, background: "rgba(255,255,255,0.22)", padding: "4px 8px", borderRadius: 999 }}>
            {inProgressCount} in-progress
          </div>
        </div>

        <div style={{ marginTop: 6, fontSize: 15, fontWeight: 900, lineHeight: 1.35 }}>{goalText}</div>
        {plannerData?.headline && (
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.92, lineHeight: 1.5 }}>{plannerData.headline}</div>
        )}

        <div style={{ marginTop: 12, background: "rgba(255,255,255,0.2)", borderRadius: 8, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#4ADE80", borderRadius: 8, transition: "width 0.35s ease" }} />
        </div>

        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>{progress}%</div>
            <div style={{ fontSize: 9, opacity: 0.85, fontWeight: 700 }}>Progress</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>{inProgressCount}</div>
            <div style={{ fontSize: 9, opacity: 0.85, fontWeight: 700 }}>In-Progress</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>{pendingCount}</div>
            <div style={{ fontSize: 9, opacity: 0.85, fontWeight: 700 }}>Pending</div>
          </div>
        </div>

        {plannerData?.score !== undefined && (
          <div style={{ marginTop: 8, fontSize: 10, fontWeight: 800, opacity: 0.88 }}>
            Readiness score: {plannerData.score}/100
          </div>
        )}
      </div>

      {(plannerData?.quickSummary?.length || plannerData?.guardrails?.length) ? (
        <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "12px" }}>
          {plannerData?.quickSummary?.length ? (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: COLORS.text, marginBottom: 6 }}>Quick insights</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {plannerData.quickSummary.map((point, idx) => (
                  <div key={`summary-${idx}`} style={{ fontSize: 10, fontWeight: 700, color: COLORS.text, background: "#f6f8ff", borderRadius: 8, padding: "7px 8px" }}>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {plannerData?.guardrails?.length ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: COLORS.text, marginBottom: 6 }}>Guardrails</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {plannerData.guardrails.map((rule, idx) => (
                  <div key={`guardrail-${idx}`} style={{ fontSize: 10, fontWeight: 700, color: "#8a5a00", background: "#fff8ed", borderRadius: 8, padding: "7px 8px" }}>
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.text }}>Milestone Timeline</div>
          <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 700 }}>Step by step roadmap</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {milestones.map((item, idx) => (
            (() => {
              const status = item.status || (idx === 0 ? "in_progress" : "pending");
              const isDone = status === "done";
              const isInProgress = status === "in_progress";
              const statusLabel = isDone ? "Done" : isInProgress ? "In-Progress" : "Pending";
              const statusColor = isDone ? "#0c7f53" : isInProgress ? "#9a6b00" : "#5b6475";
              const statusBg = isDone ? "#e8f8ee" : isInProgress ? COLORS.yellow : "#e9edf6";
              const cardBg = isDone ? "#f2fbf7" : isInProgress ? "#fffaf0" : "#f8f9fd";
              const cardBorder = isDone ? "#cdeedc" : isInProgress ? "#f9e7bb" : "#edf0f6";
              const dotBg = isDone ? COLORS.green : isInProgress ? "#f5c800" : "#d5dcef";

              return (
            <div
              key={`${item.title}-${idx}`}
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 10,
                padding: "10px",
                background: cardBg,
                borderRadius: 12,
                border: `1px solid ${cardBorder}`,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 22, flexShrink: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: dotBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>{idx + 1}</span>
                </div>
                {idx < milestones.length - 1 && (
                  <div style={{ marginTop: 5, width: 2, flex: 1, borderRadius: 999, background: "#dce3f2", minHeight: 12 }} />
                )}
              </div>

              <div style={{ minWidth: 0, width: "100%" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <button
                    onClick={() => item.facility && onUseFacility?.(item.facility)}
                    disabled={!item.facility}
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: item.facility ? "pointer" : "default",
                      opacity: item.facility ? 1 : 0.8,
                    }}
                    title={item.facility ? `Open ${item.facility}` : "No feature mapped"}
                  >
                    <MilestoneProductIcon title={item.title} facility={item.facility} />
                  </button>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text, lineHeight: 1.35 }}>{item.title}</div>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 900,
                          color: statusColor,
                          background: statusBg,
                          borderRadius: 999,
                          padding: "2px 7px",
                        }}
                      >
                        {statusLabel}
                      </span>
                      {item.optional && (
                        <span style={{ fontSize: 9, fontWeight: 900, color: COLORS.orange, background: "#fff4dd", borderRadius: 999, padding: "2px 7px" }}>
                          Optional
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600, marginTop: 4, lineHeight: 1.45 }}>{item.hint}</div>

                {item.facility && (
                  <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-start" }}>
                    <button
                      onClick={() => onUseFacility?.(item.facility)}
                      style={{
                        border: "none",
                        background: COLORS.blue,
                        color: "#fff",
                        borderRadius: 999,
                        padding: "5px 10px",
                        fontSize: 10,
                        fontWeight: 800,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <FacilityActionIcon facility={item.facility} size={14} />
                      {item.action_label || `Open ${item.facility}`}
                    </button>
                  </div>
                )}

                {item.showInvestmentIcons && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 4,
                      marginTop: 10,
                      padding: "12px 6px",
                      background: "#fff",
                      borderRadius: 10,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <GoInvestIcon size={28} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.text }}>e-Mas</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, justifyContent: "center" }}>
                      <div style={{ height: 28, display: "flex", alignItems: "center", color: "#1450d0", fontSize: 13, fontWeight: 900, fontFamily: "sans-serif", letterSpacing: -0.5 }}>ASNB</div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.text }}>ASNB</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M9 4h6.5c3.5 0 6.5 2.5 6.5 6.5S19 17 15.5 17H13v4H9V4z" fill="#0072b5" />
                        <circle cx="15.5" cy="10.5" r="2.5" fill="#fff" />
                      </svg>
                      <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.text }}>Principal®</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M6 18h14M6 6v12" stroke="#1450d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 18h14v-7l-4 3-5-6-5 5v5z" fill="#f5c800" />
                        <path d="M6 13l5-5 5 6 4-3" stroke="#1450d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.text }}>e-Trade</span>
                    </div>
                  </div>
                )}

                {item.showInsuranceOptions && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 6,
                      marginTop: 10,
                      padding: "10px 6px",
                      background: "#fff",
                      borderRadius: 10,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    {insuranceOptions.map((label) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <InsuranceOptionIcon label={label} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: COLORS.text, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {item.showCashLoanOptions && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "10px",
                      background: "#fff",
                      borderRadius: 10,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <CashLoanIcon size={30} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: COLORS.text }}>CashLoan</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
              );
            })()
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button
          onClick={onBackHome}
          style={{ flex: 1, border: "none", background: COLORS.blue, color: "#fff", borderRadius: 10, padding: "9px 10px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
        >
          Continue to Home
        </button>
        <button
          onClick={onRefineGoal}
          style={{ flex: 1, border: `1px solid ${COLORS.border}`, background: "#fff", color: COLORS.text, borderRadius: 10, padding: "9px 10px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
        >
          Refine Goal
        </button>
      </div>
    </div>
  );
};

const BankBadge = ({ bankName, bankCode }) => {
  const code = (bankCode || "").toUpperCase();
  const logoSrcByCode = {
    CIMB: cimbLogo,
    PBB: publicBankLogo,
    MBB: maybankLogo,
  };
  const src = logoSrcByCode[code];

  if (!src) {
    return (
      <div
        style={{
          marginTop: 6,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "3px 8px",
          background: "#eef3ff",
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 900, color: COLORS.blue }}>{bankName}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 6,
        width: 164,
        height: 40,
        borderRadius: 8,
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 6px",
      }}
    >
      <img
        src={src}
        alt={bankName}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

const LoanSelectionPage = ({ loanOptions, selectedLoanId, onSelectLoan, onProceed, onBack }) => {
  return (
    <div style={{ padding: "14px 12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0f2f7d 0%, #1450d0 60%, #1f63e0 100%)",
          borderRadius: 16,
          padding: "14px 14px 12px",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(20,80,208,0.25)",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.2, opacity: 0.92 }}>Loan Application</div>
        <div style={{ marginTop: 6, fontSize: 17, fontWeight: 900, lineHeight: 1.35 }}>Choose a loan to apply now</div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.9 }}>
          We’ll generate your TnG underwritten report and continue to the application portal.
        </div>
      </div>

      <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "12px" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.text, marginBottom: 10 }}>Available Loan Products</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {loanOptions.map((loan) => {
            const isSelected = selectedLoanId === loan.id;

            return (
              <button
                key={loan.id}
                onClick={() => onSelectLoan(loan.id)}
                style={{
                  borderRadius: 12,
                  border: isSelected ? `1.5px solid ${COLORS.blue}` : `1px solid ${COLORS.border}`,
                  background: isSelected ? "#edf3ff" : "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "10px",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: COLORS.text }}>{loan.name}</div>
                  <BankBadge
                    bankName={loan.bankName}
                    bankCode={loan.bankCode}
                  />
                  <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Up to RM {Number(loan.maxAmount).toLocaleString()}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Rate from {loan.rate}% p.a.</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Tenure up to {loan.maxTenureMonths} months</span>
                  </div>
                </div>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? COLORS.blue : "#bcc7df"}`,
                    background: isSelected ? COLORS.blue : "transparent",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            border: `1px solid ${COLORS.border}`,
            background: "#fff",
            color: COLORS.text,
            borderRadius: 10,
            padding: "9px 10px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Back
        </button>
        <button
          onClick={onProceed}
          disabled={!selectedLoanId}
          style={{
            flex: 1,
            border: "none",
            background: selectedLoanId ? COLORS.blue : "#b5c6ea",
            color: "#fff",
            borderRadius: 10,
            padding: "9px 10px",
            fontSize: 12,
            fontWeight: 800,
            cursor: selectedLoanId ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}
        >
          Continue to Portal
        </button>
      </div>
    </div>
  );
};

const LoanApplicationPortal = ({ selectedLoan, report, onBackToSelection, onSubmitApplication }) => {
  if (!selectedLoan) return null;

  const scorePct = Math.max(0, Math.min((report.estimatedCreditScore / 850) * 100, 100));
  const scoreColor = report.estimatedCreditScore >= 720 ? COLORS.green : report.estimatedCreditScore >= 650 ? COLORS.orange : COLORS.red;

  return (
    <div style={{ padding: "14px 12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0f2f7d 0%, #1450d0 60%, #1f63e0 100%)",
          borderRadius: 16,
          padding: "14px 14px 12px",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(20,80,208,0.25)",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.2, opacity: 0.92 }}>Loan Application Portal</div>
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 900, lineHeight: 1.35 }}>{selectedLoan.name}</div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.92 }}>
          Requested amount: RM {Number(selectedLoan.requestAmount).toLocaleString()} · Tenure: {selectedLoan.requestTenureMonths} months · Est. rate {selectedLoan.rate}% p.a.
        </div>
      </div>

      <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.text }}>TnG Underwritten Report</div>
            <div style={{ marginTop: 2, fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Based on your repayment readiness and wallet activity</div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 900, color: "#1450d0", background: "#eef3ff", borderRadius: 999, padding: "3px 8px" }}>
            PRE-ASSESSMENT
          </span>
        </div>

        <div style={{ marginTop: 10, background: "#f8faff", borderRadius: 10, padding: "10px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Estimated Credit Score</div>
          <div style={{ marginTop: 5, display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: scoreColor }}>{report.estimatedCreditScore}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray }}>/ 850 ({report.scoreBand})</span>
          </div>
          <div style={{ marginTop: 8, background: "#e8edf8", borderRadius: 8, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${scorePct}%`, height: "100%", background: scoreColor, borderRadius: 8 }} />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.text, marginBottom: 8 }}>Loan Repayment Period Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {report.metrics.map((item) => (
              <div key={item.label} style={{ background: "#f6f8ff", borderRadius: 10, padding: "9px 10px" }}>
                <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 700 }}>{item.label}</div>
                <div style={{ marginTop: 3, fontSize: 14, fontWeight: 900, color: COLORS.text }}>{item.value}</div>
                <div style={{ marginTop: 2, fontSize: 10, color: item.deltaColor || COLORS.green, fontWeight: 700 }}>{item.delta}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 10, borderTop: `1px dashed ${COLORS.border}`, paddingTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.text, marginBottom: 6 }}>Underwriter Notes</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.gray, fontSize: 10, fontWeight: 700, lineHeight: 1.5 }}>
            {report.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
        <button
          onClick={onBackToSelection}
          style={{
            flex: 1,
            border: `1px solid ${COLORS.border}`,
            background: "#fff",
            color: COLORS.text,
            borderRadius: 10,
            padding: "9px 10px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Change Loan
        </button>
        <button
          onClick={onSubmitApplication}
          style={{
            flex: 1,
            border: "none",
            background: COLORS.blue,
            color: "#fff",
            borderRadius: 10,
            padding: "9px 10px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

const LoanSubmissionPage = ({ selectedLoan, report, onApplyAnother, onBackHome }) => {
  if (!selectedLoan) return null;

  return (
    <div style={{ padding: "14px 12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0c7a4d 0%, #00a86b 70%, #24c781 100%)",
          borderRadius: 16,
          padding: "14px 14px 12px",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(0,168,107,0.25)",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.2, opacity: 0.95 }}>Application Submitted</div>
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 900, lineHeight: 1.35 }}>
          {selectedLoan.name} sent for review ✅
        </div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.95 }}>
          Ref: TNG-{selectedLoan.id.toUpperCase()}-2026 · Estimated review within 5 days
        </div>
      </div>

      <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "12px" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.text }}>Submitted Underwritten Snapshot</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#f6f8ff", borderRadius: 10, padding: "9px 10px" }}>
            <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 700 }}>Loan Product</div>
            <div style={{ marginTop: 3, fontSize: 13, fontWeight: 900, color: COLORS.text }}>{selectedLoan.name}</div>
          </div>
          <div style={{ background: "#f6f8ff", borderRadius: 10, padding: "9px 10px" }}>
            <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 700 }}>Estimated Credit Score</div>
            <div style={{ marginTop: 3, fontSize: 13, fontWeight: 900, color: COLORS.text }}>
              {report.estimatedCreditScore} / 850 ({report.scoreBand})
            </div>
          </div>
          <div style={{ background: "#f6f8ff", borderRadius: 10, padding: "9px 10px" }}>
            <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 700 }}>Requested Amount</div>
            <div style={{ marginTop: 3, fontSize: 13, fontWeight: 900, color: COLORS.text }}>
              RM {Number(selectedLoan.requestAmount).toLocaleString()}
            </div>
          </div>
          <div style={{ background: "#f6f8ff", borderRadius: 10, padding: "9px 10px" }}>
            <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 700 }}>Repayment Loan Amount per Month</div>
            <div style={{ marginTop: 3, fontSize: 13, fontWeight: 900, color: COLORS.text }}>
              {report.metrics.find((item) => item.label.includes("Repayment Loan Amount per Month"))?.value || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
        <button
          onClick={onApplyAnother}
          style={{
            flex: 1,
            border: `1px solid ${COLORS.border}`,
            background: "#fff",
            color: COLORS.text,
            borderRadius: 10,
            padding: "9px 10px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Apply Another Loan
        </button>
        <button
          onClick={onBackHome}
          style={{
            flex: 1,
            border: "none",
            background: COLORS.blue,
            color: "#fff",
            borderRadius: 10,
            padding: "9px 10px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default function TNGWallet() {
  const [restoredPlanner] = useState(() => loadStoredPlanner());
  const [balVisible, setBalVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [userGoal, setUserGoal] = useState(restoredPlanner?.goalText || "Apply motorcycle loan of RM10,000 in one year time");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [goalFocus, setGoalFocus] = useState("loan");
  const [loanType, setLoanType] = useState("motorcycle");
  const [loanAmount, setLoanAmount] = useState("10000");
  const [loanTimeline, setLoanTimeline] = useState("1 year");
  const [otherGoalDetail, setOtherGoalDetail] = useState("");
  const [showJourneyPage, setShowJourneyPage] = useState(Boolean(restoredPlanner));
  const [journeyMilestones, setJourneyMilestones] = useState(restoredPlanner?.milestones || []);
  const [loanFlowStep, setLoanFlowStep] = useState("none");
  const [selectedLoanId, setSelectedLoanId] = useState("personal-flexi");
  const [plannerData, setPlannerData] = useState(restoredPlanner);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState("");
  const [preferredFinanceSection, setPreferredFinanceSection] = useState("spending");
  
  // State to control main vs secondary homepage simulation
  const [isDemoAchieved, setIsDemoAchieved] = useState(false);

  const loanOptions = [
    {
      id: "personal-flexi",
      name: "Personal Flexi Loan",
      bankName: "CIMB Bank",
      bankCode: "CIMB",
      bankPrimary: "#ed1c24",
      bankBg: "#fff1f3",
      maxAmount: 20000,
      rate: 7.6,
      maxTenureMonths: 60,
      requestAmount: 10000,
      requestTenureMonths: 48,
    },
    {
      id: "motorcycle-plus",
      name: "Motorcycle Plus Loan",
      bankName: "Public Bank",
      bankCode: "PBB",
      bankPrimary: "#d31245",
      bankBg: "#fff0f5",
      maxAmount: 15000,
      rate: 6.9,
      maxTenureMonths: 48,
      requestAmount: 10000,
      requestTenureMonths: 36,
    },
    {
      id: "cash-express",
      name: "CashExpress Loan",
      bankName: "Maybank",
      bankCode: "MBB",
      bankPrimary: "#f2b400",
      bankBg: "#fff8dd",
      maxAmount: 12000,
      rate: 8,
      maxTenureMonths: 36,
      requestAmount: 8000,
      requestTenureMonths: 24,
    },
  ];

  const selectedLoan = loanOptions.find((loan) => loan.id === selectedLoanId) || loanOptions[0];

  const openLoanSelection = () => {
    setShowOnboarding(false);
    setShowJourneyPage(false);
    setLoanFlowStep("select");
  };

  const switchToSecondaryHome = () => {
    setIsDemoAchieved(true);
  };

  const underwritingReport = {
    estimatedCreditScore: isDemoAchieved ? 723 : 688,
    scoreBand: isDemoAchieved ? "Good" : "Fair",
    metrics: [
      { label: "Budget Discipline", value: isDemoAchieved ? "91%" : "78%", delta: isDemoAchieved ? "↑ +12% vs start" : "↑ +5% vs start", deltaColor: COLORS.green },
      { label: "On-time Bill Payments", value: isDemoAchieved ? "12 / 12" : "9 / 12", delta: isDemoAchieved ? "No missed payments" : "1 late payment", deltaColor: isDemoAchieved ? COLORS.green : COLORS.orange },
      { label: "Savings Consistency", value: isDemoAchieved ? "10 months" : "6 months", delta: isDemoAchieved ? "Strong monthly trend" : "Improving trend", deltaColor: COLORS.green },
      {
        label: "Repayment Loan Amount per Month",
        value: isDemoAchieved ? "RM 233 / month" : "RM 318 / month",
        deltaColor: isDemoAchieved ? COLORS.green : COLORS.orange,
      },
    ],
    notes: [
      "Stable spending behavior observed during the financial plan period.",
      "Cash flow trend indicates sufficient repayment buffer for the selected loan tier.",
      "No high-risk transaction volatility detected in recent cycles.",
    ],
  };

  const focusOptions = [
    { value: "loan", label: "Loan", icon: "🏍️" },
    { value: "saving", label: "Saving", icon: "💰" },
    { value: "passive-income", label: "Passive Income", icon: "📈" },
    { value: "investment", label: "Investment", icon: "📊" },
  ];

  const buildGoalTextFromInputs = () => {
    if (goalFocus === "loan") {
      const normalizedAmount = Number(loanAmount || 0).toLocaleString();
      return `Apply ${loanType} loan of RM${normalizedAmount} in ${loanTimeline} time`;
    }

    const label = focusOptions.find((o) => o.value === goalFocus)?.label || "Financial";
    const detail = otherGoalDetail.trim() || "Build consistency and reach my target";
    return `${label} Goal: ${detail}`;
  };

  const requestPlannerData = async (goalText) => {
    return analyzeUserGoal({
      goal: goalText,
      userBackground: buildUserBackgroundPayload(goalText),
      sampleFileName: DEFAULT_SAMPLE_FILE_NAME,
      months: 3,
      transactionsPerMonth: 18,
    });
  };

  const handleUseFacility = (facility) => {
    if (!facility) return;

    const normalized = facility.toLowerCase();
    let nextSection = "spending";

    if (normalized === "go+") {
      setIsDemoAchieved(false);
      nextSection = "go+";
    } else if (normalized === "gopinjam") {
      setIsDemoAchieved(true);
      nextSection = "cashloan";
    } else if (normalized === "goinvest") {
      nextSection = "goals";
    } else if (normalized === "goinsure") {
      nextSection = "categories";
    }

    setPreferredFinanceSection(nextSection);
    setShowJourneyPage(false);
    setActiveTab("home");
  };

  const completeOnboarding = async () => {
    const goalText = buildGoalTextFromInputs();
    setUserGoal(goalText);
    setPlannerLoading(true);
    setPlannerError("");

    try {
      const apiData = await requestPlannerData(goalText);
      const normalizedPlanner = normalizePlannerFromApi(apiData, goalText);
      setJourneyMilestones(normalizedPlanner.milestones);
      setPlannerData(normalizedPlanner);
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(normalizedPlanner));
    } catch {
      const fallbackPlanner = {
        goalText,
        score: 0,
        headline: "Plan ready. We’ll refine recommendations when the service is reachable.",
        quickSummary: [],
        guardrails: ["Keep repayments below a safe share of your lowest monthly income."],
        milestones: fallbackMilestones,
      };
      setJourneyMilestones(fallbackPlanner.milestones);
      setPlannerData(fallbackPlanner);
      setPlannerError("Using offline planner template for now.");
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(fallbackPlanner));
    } finally {
      setPlannerLoading(false);
      setShowOnboarding(false);
      setShowJourneyPage(true);
      setOnboardingStep(1);
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={styles.phone}>
        {/* Status Bar */}
        <div style={styles.statusBar}>
          <span style={styles.timePill}>4:55</span>
          <div style={styles.statusRight}>
            <span>▌▌▌▌</span>
            <span>4G</span>
            <span style={styles.batteryBadge}>39</span>
          </div>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerRow}>
            <button style={{ ...styles.flagPill, background: "rgba(255,255,255,0.18)" }}>
              <span style={{ fontSize: 16 }}>🇲🇾</span>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>MY</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>▼</span>
              <span style={{ fontSize: 14 }}>🏙️</span>
            </button>
            <div style={styles.searchBox}>
              <span style={{ fontSize: 13, color: "#999" }}>🔍</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>BUDI95</span>
            </div>
            <div style={styles.avatarWrap}>
              <div style={styles.avatarCircle}><span style={{ fontSize: 18 }}>👤</span></div>
              <div style={styles.notifDot} />
              <div style={styles.coinDot}>$</div>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div style={styles.balanceArea}>
          <div style={styles.balRow}>
            <div style={styles.shieldIcon}><span style={{ fontSize: 13 }}>🛡️</span></div>
            <span style={styles.balAmount}>
              {balVisible ? "RM 16.54" : "RM ••••"}
            </span>
            <button style={styles.eyeBtn} onClick={() => setBalVisible(!balVisible)}>
              {balVisible ? "👁" : "🙈"}
            </button>
          </div>
          <button style={styles.viewAssets}>
            View asset details <span>›</span>
          </button>
          <div style={styles.balBtns}>
            <button style={styles.addMoneyBtn}>
              ＋ Add money
            </button>
            <button style={styles.txnLink}>Transactions ›</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <div style={styles.qaGrid}>
            {[
              { icon: <ApplyIcon />, label: "Apply" },
              { icon: <CashFlowIcon />, label: "Cash flow" },
              { icon: <TransferIcon />, label: "Transfer" },
              { icon: <CardsIcon />, label: "Cards" },
            ].map(({ icon, label }) => (
              <button key={label} style={styles.qaItem}>
                <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {icon}
                </div>
                <span style={styles.qaLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {loanFlowStep === "select" ? (
          <LoanSelectionPage
            loanOptions={loanOptions}
            selectedLoanId={selectedLoanId}
            onSelectLoan={setSelectedLoanId}
            onProceed={() => setLoanFlowStep("portal")}
            onBack={() => setLoanFlowStep("none")}
          />
        ) : loanFlowStep === "portal" ? (
          <LoanApplicationPortal
            selectedLoan={selectedLoan}
            report={underwritingReport}
            onBackToSelection={() => setLoanFlowStep("select")}
            onSubmitApplication={() => setLoanFlowStep("submitted")}
          />
        ) : loanFlowStep === "submitted" ? (
          <LoanSubmissionPage
            selectedLoan={selectedLoan}
            report={underwritingReport}
            onApplyAnother={() => setLoanFlowStep("select")}
            onBackHome={() => setLoanFlowStep("none")}
          />
        ) : showJourneyPage ? (
          <FinancialJourneyPage
            goalText={userGoal}
            milestones={journeyMilestones}
            plannerData={plannerData}
            onUseFacility={handleUseFacility}
            onBackHome={() => setShowJourneyPage(false)}
            onRefineGoal={() => {
              setShowJourneyPage(false);
              setShowOnboarding(true);
              setOnboardingStep(1);
            }}
          />
        ) : (
          <>
            {/* Finance Dashboard */}
            <FinanceDashboard
              key={`finance-${isDemoAchieved}-${preferredFinanceSection}`}
              userGoal={userGoal}
              setUserGoal={setUserGoal}
              onOpenOnboarding={() => setShowOnboarding(true)}
              isDemoAchieved={isDemoAchieved}
              onApplyNow={openLoanSelection}
            />

            {/* GO+ Entry & Financial Planning */}
            <GoPlusAndPlanningRow
              isDemoAchieved={isDemoAchieved}
              onApplyNow={openLoanSelection}
              onStartSaving={switchToSecondaryHome}
            />

            {/* Info Cards */}
            <div style={styles.cardsRow}>
              {/* Grow your money */}
              <button
                onClick={() => setIsDemoAchieved((prev) => !prev)}
                style={{
                  ...styles.miniCard,
                  width: "100%",
                  border: "none",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e8f7ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🌱</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text, lineHeight: 1.2 }}>Grow your money</div>
                  <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 600, marginTop: 2 }}>
                    {isDemoAchieved ? "Grow your wealth effortlessly with GO+" : "See how GO+ can help you reach your financial goals."}
                  </div>
                </div>
              </button>
              {/* Fuel card */}
              <div style={styles.fuelCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#fff", lineHeight: 1.1, textAlign: "center", flexShrink: 0 }}>
                    BUDI<br />MADANI
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>BUDI95</div>
                    <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 600 }}>RON95 at RM1.99</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 600 }}>Fuel balance</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.text }}>138 litres</div>
                  </div>
                  <FuelRing percent={0.72} />
                </div>
              </div>
            </div>

            {/* GOrewards */}
            <div style={{ margin: "10px 10px 0" }}>
              <div style={{ ...styles.miniCard, background: "#fff8ed" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff0d6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎁</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text }}>GOrewards</div>
                  <div style={{ fontSize: 11, color: COLORS.orange, fontWeight: 800, marginTop: 2 }}>Expiring: 30 pts</div>
                </div>
              </div>
            </div>

            {/* Promo Carousel */}
            <PromoCarousel />

            {/* Recommended */}
            <div style={styles.sectionTitle}>Recommended</div>
            <div style={{ ...styles.scrollRow, msOverflowStyle: "none" }}>
              {[
                { icon: "💳", label: "CardMatch", bg: "#e8f0fe", badge: "NEW", badgeColor: COLORS.red },
                { icon: "📅", label: "Payday", bg: "#e8f8ee", badge: "$$ IN", badgeColor: COLORS.green },
                { icon: "🏖️", label: "Travel", bg: "#fff0d6", badge: null },
                { icon: "🛒", label: "Taobao", bg: "#fff0e8", badge: null },
                { icon: "🏥", label: "Medical", bg: "#fce8ea", badge: null },
              ].map(({ icon, label, bg, badge, badgeColor }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer", flexShrink: 0, width: 64 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, position: "relative" }}>
                    <span style={{ fontSize: 26 }}>{icon}</span>
                    {badge && (
                      <span style={{ position: "absolute", top: -5, right: -5, fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 6, color: "#fff", background: badgeColor }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.text, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* My Favourites */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 14px 10px" }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: COLORS.text }}>My Favourites</span>
              <button style={{ background: "none", border: "none", color: COLORS.blue, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
            </div>
            <div style={{ ...styles.scrollRow, msOverflowStyle: "none" }}>
              {[
                { icon: "🅿️", label: "Parking", bg: "#e8f0fe", badge: null },
                { icon: "⭐", label: "Rewards", bg: "#fff0d6", badge: null },
                { icon: "💰", label: "NAK$$", bg: "#e8f8ee", badge: "NAK$$" },
                { icon: "🔄", label: "AutoPay", bg: "#fce8ea", badge: null },
                { icon: "📱", label: "Topup", bg: "#f3e8fe", badge: null },
              ].map(({ icon, label, bg, badge }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer", flexShrink: 0, width: 64 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, position: "relative" }}>
                    <span style={{ fontSize: 26 }}>{icon}</span>
                    {badge && (
                      <span style={{ position: "absolute", top: -5, right: -5, fontSize: 8, fontWeight: 800, padding: "2px 4px", borderRadius: 5, color: "#fff", background: COLORS.red }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.text, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Spacer above tab bar */}
            <div style={{ height: 16 }} />
          </>
        )}

        {showOnboarding && (
          <div
            style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "flex-start", // 👈 move content to top
            justifyContent: "flex-start",
            zIndex: 30,
            padding: "100% 14px 14px", // 👈 increase top padding to push it down
          }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 340,
                background: COLORS.white,
                borderRadius: 16,
                boxShadow: "0 18px 45px rgba(0,0,0,0.2)",
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.text }}>Goal Onboarding</div>
                  <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 700 }}>Let’s personalize your financial plan</div>
                </div>
                <button
                  onClick={() => setShowOnboarding(false)}
                  style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: COLORS.gray }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: 10, display: "flex", gap: 6 }}>
                <div style={{ height: 5, borderRadius: 6, flex: 1, background: COLORS.blue }} />
                <div style={{ height: 5, borderRadius: 6, flex: 1, background: onboardingStep === 2 ? COLORS.blue : "#e5e9f2" }} />
              </div>

              {onboardingStep === 1 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
                    What’s your upcoming financial goal?
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {focusOptions.map((option) => {
                      const active = goalFocus === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setGoalFocus(option.value)}
                          style={{
                            borderRadius: 10,
                            border: active ? `1.5px solid ${COLORS.blue}` : `1px solid ${COLORS.border}`,
                            background: active ? "#eef3ff" : COLORS.white,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            padding: "10px 8px",
                            textAlign: "left",
                          }}
                        >
                          <div style={{ fontSize: 18 }}>{option.icon}</div>
                          <div style={{ marginTop: 4, fontSize: 11, fontWeight: 800, color: COLORS.text }}>{option.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button
                      onClick={() => setOnboardingStep(2)}
                      style={{
                        border: "none",
                        background: COLORS.blue,
                        color: COLORS.white,
                        borderRadius: 10,
                        padding: "8px 14px",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {onboardingStep === 2 && (
                <>
                  {plannerError && (
                    <div style={{ fontSize: 10, color: "#8a5a00", background: "#fff8ed", borderRadius: 8, padding: "6px 8px", marginBottom: 8, fontWeight: 700 }}>
                      {plannerError}
                    </div>
                  )}
                  {goalFocus === "loan" ? (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
                        Tell us your loan plan details
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Loan type</label>
                        <select
                          value={loanType}
                          onChange={(e) => setLoanType(e.target.value)}
                          style={{ width: "100%", marginTop: 4, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", fontFamily: "inherit", fontSize: 12 }}
                        >
                          <option value="motorcycle">Motorcycle</option>
                          <option value="car">Car</option>
                          <option value="personal">Personal</option>
                          <option value="home">Home</option>
                        </select>
                      </div>

                      <div style={{ width: "95%", marginBottom: 8 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Target amount (RM)</label>
                        <input
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9]/g, ""))}
                          style={{ width: "100%", marginTop: 4, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", fontFamily: "inherit", fontSize: 12 }}
                        />
                      </div>

                      <div style={{ width: "95%", marginBottom: 8 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray }}>Timeline</label>
                        <input
                          value={loanTimeline}
                          onChange={(e) => setLoanTimeline(e.target.value)}
                          placeholder="e.g. 1 year"
                          style={{ width: "100%", marginTop: 4, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", fontFamily: "inherit", fontSize: 12 }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
                        Tell us more about your {focusOptions.find((o) => o.value === goalFocus)?.label?.toLowerCase()} goal
                      </div>
                      <textarea
                        value={otherGoalDetail}
                        onChange={(e) => setOtherGoalDetail(e.target.value)}
                        placeholder="Example: Save RM20,000 for emergency buffer in 18 months"
                        rows={4}
                        style={{ width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", fontFamily: "inherit", fontSize: 12, resize: "none" }}
                      />
                    </>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                    <button
                      onClick={() => setOnboardingStep(1)}
                      style={{ border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.text, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Back
                    </button>
                    <button
                      onClick={completeOnboarding}
                      disabled={plannerLoading}
                      style={{ border: "none", background: COLORS.blue, color: COLORS.white, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      {plannerLoading ? "Saving..." : "Save goal"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab Bar */}
        <div style={styles.tabBar}>
          <Tab icon="🏠" label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <Tab icon="🛒" label="Lazada" active={activeTab === "lazada"} onClick={() => setActiveTab("lazada")} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", marginTop: -18 }}
            onClick={() => setActiveTab("scan")}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: COLORS.blue,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(20,80,208,0.4)", border: "3px solid #fff",
            }}>
              <QRIcon />
            </div>
          </div>
          <Tab icon="💲" label="GOfinance" active={activeTab === "gofinance"} onClick={() => setActiveTab("gofinance")} />
          <Tab icon="📍" label="Near Me" active={activeTab === "nearme"} onClick={() => setActiveTab("nearme")} />
        </div>
      </div>
    </div>
  );
}