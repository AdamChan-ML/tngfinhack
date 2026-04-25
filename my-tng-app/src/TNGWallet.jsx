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
