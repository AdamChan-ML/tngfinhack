import { useState } from "react";

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

const GoPlusAndPlanningRow = () => {
  const stages = [
    { label: "Starter", done: true },
    { label: "Saver", done: true },
    { label: "Investor", done: false },
    { label: "Planner", done: false },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 10px 0" }}>

      {/* GO+ Button Card */}
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
        {/* subtle glow blob */}
        <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "rgba(20,80,208,0.35)", top: -20, right: -20, pointerEvents: "none" }} />
        <GoPlusIcon />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 900, letterSpacing: 0.3 }}>GO+</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 600, marginTop: 2 }}>Savings Plan</div>
        </div>
        <div style={{ background: "rgba(74,222,128,0.15)", borderRadius: 8, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#4ADE80", fontSize: 12, fontWeight: 900 }}>2.80% p.a.</span>
        </div>
        <div style={{ width: "100%", background: COLORS.blue, borderRadius: 10, padding: "7px 0", textAlign: "center" }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>Start Saving ›</span>
        </div>
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
          <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.blue }}>View ›</span>
        </div>

        {/* Progress track */}
        <div style={{ position: "relative", paddingTop: 6 }}>
          {/* connector line */}
          <div style={{ position: "absolute", top: 17, left: 8, right: 8, height: 3, background: "#e8eaf0", borderRadius: 4, zIndex: 0 }} />
          <div style={{ position: "absolute", top: 17, left: 8, width: "45%", height: 3, background: COLORS.blue, borderRadius: 4, zIndex: 1 }} />

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {stages.map(({ label, done }, i) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: done ? COLORS.blue : "#e8eaf0",
                  border: `2px solid ${done ? COLORS.blue : "#ccc"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {done && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
                  {!done && i === 2 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.blue, display: "block" }} />}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: done ? COLORS.blue : "#bbb", textAlign: "center", lineHeight: 1.2 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current stage info */}
        <div style={{ background: "#eef2ff", borderRadius: 10, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600 }}>Current stage</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: COLORS.blue, marginTop: 1 }}>Saver ✦</div>
          <div style={{ fontSize: 10, color: COLORS.gray, fontWeight: 600, marginTop: 2 }}>Next: Investor</div>
          <div style={{ marginTop: 5, background: "#d0d9f8", borderRadius: 6, height: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "65%", background: COLORS.blue, borderRadius: 6 }} />
          </div>
          <div style={{ fontSize: 9, color: COLORS.gray, fontWeight: 600, marginTop: 3 }}>65% to next level</div>
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

const FinanceDashboard = () => {
  const [activeSection, setActiveSection] = useState("spending");
  const [userGoal, setUserGoal] = useState("Apply motorcycle loan of RM10,000 in one year time");
  const [isGoalEditing, setIsGoalEditing] = useState(false);
  const sections = ["spending", "categories", "goals", "go+"];

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
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "14px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: COLORS.text }}>My Finance</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.blue, cursor: "pointer" }}>April 2025 ▾</span>
      </div>

      {/* Tab Pills */}
      <div style={{ display: "flex", gap: 6, padding: "10px 14px", overflowX: "auto", scrollbarWidth: "none" }}>
        {sections.map((s) => (
          <button key={s} onClick={() => setActiveSection(s)} style={{
            flexShrink: 0, padding: "5px 13px", borderRadius: 20, border: "none",
            background: activeSection === s ? COLORS.blue : "#eef1f8",
            color: activeSection === s ? "#fff" : COLORS.gray,
            fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
            textTransform: "capitalize", transition: "all 0.2s",
          }}>
            {s === "go+" ? "GO+" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
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
            <GoalRing label="Emergency\nFund" current={3200} target={5000} color={COLORS.blue} icon="🏦" />
            <GoalRing label="Vacation\nBali" current={800} target={2000} color={COLORS.orange} icon="✈️" />
            <GoalRing label="New\nLaptop" current={1500} target={1800} color={COLORS.green} icon="💻" />
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

      {/* GO+ */}
      {activeSection === "go+" && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ background: "#001A3C", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>GO+ Balance</div>
                <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 2 }}>RM 1,205.00</div>
                <div style={{ color: "#4ADE80", fontSize: 11, fontWeight: 700, marginTop: 3 }}>+RM 2.82 earned today</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: "rgba(74,222,128,0.15)", borderRadius: 8, padding: "4px 10px" }}>
                  <div style={{ color: "#4ADE80", fontSize: 14, fontWeight: 900 }}>2.80%</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 700 }}>p.a.</div>
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

export default function TNGWallet() {
  const [balVisible, setBalVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

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
            <button style={styles.addMoneyBtn}>＋ Add money</button>
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

    {/* Finance Dashboard */}
    <FinanceDashboard />

    {/* GO+ Entry & Financial Planning */}
    <GoPlusAndPlanningRow />

        {/* Info Cards */}
        <div style={styles.cardsRow}>
          {/* Grow your money */}
          <div style={styles.miniCard}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e8f7ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🌱</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text, lineHeight: 1.2 }}>Grow your money</div>
              <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 600, marginTop: 2 }}>Start with just RM10</div>
            </div>
          </div>
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
