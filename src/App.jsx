import { useId, useState } from "react";

function LogoMark({ compact = false }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <div className={`logo-mark ${compact ? "compact" : ""}`} aria-label="FinVora logo">
      <svg viewBox="0 0 72 72" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#101b36" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="66" height="66" rx="18" fill={`url(#${gradientId})`} />
        <path d="M20 19h26v8H28v8h16v8H28v10H20V19z" fill="white" opacity="0.96" />
        <path d="M38 19l14 34h-9l-2.8-7h-12.4l-2.8 7H16L30 19h8zm-4.5 20h7.2L37 27.8 33.5 39z" fill="white" opacity="0.96" />
      </svg>
    </div>
  );
}

const navItems = [
  ["dashboard", "⌂ Dashboard"],
  ["profile", "♙ Profile"],
  ["loans", "◈ Loans"],
  ["documents", "▤ Documents"],
  ["kyc", "♢ KYC Verification"],
  ["services", "▦ Account Services"],
  ["transactions", "↔ Transactions"],
  ["insights", "▥ Spending Insights"],
  ["assistant", "✦ AI Assistant"]
];

const notifications = [
  ["documents", "Document verified", "Your Aadhaar Card is verified."],
  ["transactions", "New transaction", "Amazon payment of ₹2,499."]
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState(window.location.pathname === "/customer/loans" ? "loans" : window.location.pathname === "/customer/profile" ? "profile" : "dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("Jamuna Devi");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [toast, setToast] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unread, setUnread] = useState(notifications.length);
  const [chat, setChat] = useState([[
    "bot",
    "Hello! I can help with your balance, KYC, transactions, documents, and account services."
  ]]);
  const [chatInput, setChatInput] = useState("");
  const [documents, setDocuments] = useState([
    ["Aadhaar Card", "Uploaded on Sep 1, 2026", "Verified"],
    ["PAN Card", "Uploaded on Sep 1, 2026", "Verified"],
    ["Address Proof", "Uploaded on Aug 28, 2026", "Pending"]
  ]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const login = (event) => {
    event.preventDefault();
    if (!email || !password) {
      showToast("Please enter email and password");
      return;
    }
    const loginName = email.split("@")[0].replace(/[._-]+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
    if (loginName) setUserName(loginName);
    setLoggedIn(true);
    setPage("dashboard");
    window.history.pushState({}, "", "/");
    showToast("Login successful!");
  };

  const openPage = (pageName) => {
    setPage(pageName);
    setNotificationsOpen(false);
    const pagePath = pageName === "loans" ? "/customer/loans" : pageName === "profile" ? "/customer/profile" : "/";
    window.history.pushState({}, "", pagePath);
  };

  const uploadDocument = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const maxSize = 2 * 1024 * 1024;
    if (!isPdf) {
      showToast("Only PDF documents are allowed");
      event.target.value = "";
      return;
    }
    if (file.size > maxSize) {
      showToast("PDF must be smaller than 2 MB");
      event.target.value = "";
      return;
    }
    setDocuments((current) => [...current, [file.name, "AI verification in progress...", "Processing"]]);
    showToast("Document uploaded. AI verification started.");
    window.setTimeout(() => {
      setDocuments((current) => current.map((item) => item[0] === file.name ? [file.name, "AI verification completed", "Verified"] : item));
      showToast("Document verified successfully!");
    }, 2000);
  };

  const sendMessage = (event) => {
    event?.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    const text = message.toLowerCase();
    let response = "I can help you with your FinVora account.";
    if (text.includes("balance")) response = "Your available account balance is ₹85,420.";
    else if (text.includes("kyc")) response = "Your KYC status is Verified.";
    else if (text.includes("transaction")) response = "Your latest transaction was Amazon for ₹2,499.";
    else if (text.includes("document")) response = "You currently have 5 documents in your Document Wallet.";
    else if (text.includes("hello") || text.includes("hi")) response = "Hello! How can I help you today?";
    setChat((current) => [...current, ["user", message], ["bot", response]]);
    setChatInput("");
  };

  if (!loggedIn) {
    return <div className="login-page">
      <form className="login-card" onSubmit={login}>
        <LogoMark />
        <h1>FinVora</h1>
        <p>Smart Financial Customer Portal</p>
        <input type="email" placeholder="Email Address" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button type="submit">Login</button>
        <p className="demo">Demo: Enter any email and password</p>
      </form>
      {toast && <div className="toast">{toast}</div>}
    </div>;
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-logo"><LogoMark compact /></div><div className="brand-copy"><h2>FinVora</h2><small>Customer Portal</small></div></div>
      <nav>{navItems.map(([id, label]) => <button key={id} className={`nav-btn ${page === id ? "active" : ""}`} onClick={() => openPage(id)}>{label}</button>)}</nav>
      <a className="nav-btn external-app-link" href="http://localhost:3000" target="_blank" rel="noreferrer">▣ Operations Console <span aria-hidden="true">↗</span></a>
      <button className="logout" onClick={() => { setLoggedIn(false); showToast("Logged out successfully"); }}>↪ Logout</button>
    </aside>

    <main className="main">
      <header className="topbar">
        <div className="topbar-title"><div><h2>{pageTitle(page)}</h2><p>Welcome back, {userName} 👋</p></div></div>
        <div className="top-actions">
          <div className="notification-wrap">
            <button className="notification-button" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Open notifications">🔔︎{unread > 0 && <span className="notification-count">{unread}</span>}</button>
            {notificationsOpen && <div className="notification-panel">
              <div className="notification-header"><h3>Notifications</h3><div className="notification-actions"><button onClick={() => { setUnread(0); showToast("Notifications cleared"); }}>Clear all</button><button onClick={() => setNotificationsOpen(false)}>Close</button></div></div>
              {unread ? notifications.map(([target, title, detail]) => <button className="notification-item" key={title} onClick={() => openPage(target)}><span className="notification-dot" /><span><b>{title}</b><small>{detail}</small></span></button>) : <p className="empty-notifications">You are all caught up.</p>}
            </div>}
          </div>
          <button className="avatar profile-avatar-button" onClick={() => openPage("profile")} aria-label="Open profile">{profilePhoto ? <img src={profilePhoto} alt="Profile" /> : userName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</button>
        </div>
      </header>

      {page === "dashboard" && <Dashboard onPage={openPage} />}
      {page === "loans" && <Loans showToast={showToast} />}
      {page === "profile" && <Profile userName={userName} setUserName={setUserName} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} showToast={showToast} />}
      {page === "documents" && <Documents documents={documents} uploadDocument={uploadDocument} showToast={showToast} />}
      {page === "kyc" && <Kyc />}
      {page === "services" && <Services showToast={showToast} />}
      {page === "transactions" && <Transactions showToast={showToast} />}
      {page === "insights" && <Insights />}
      {page === "assistant" && <Assistant chat={chat} chatInput={chatInput} setChatInput={setChatInput} sendMessage={sendMessage} />}
    </main>
    {toast && <div className="toast">{toast}</div>}
  </div>;
}

function pageTitle(page) {
  return { dashboard: "Dashboard", loans: "Loan Services", profile: "Customer Profile", documents: "Document Wallet", kyc: "KYC Verification", services: "Account Services", transactions: "Transactions", insights: "Spending Insights", assistant: "AI Assistant" }[page];
}

const legacyLoanTypes = [
  ["Personal Loan", "Flexible funds for life\'s important moments", "8.5% onwards", "♙"],
  ["Education Loan", "Invest in your next chapter", "7.25% onwards", "▥"],
  ["Home Loan", "Make your dream home a reality", "8.35% onwards", "⌂"],
  ["Vehicle Loan", "Move forward with confidence", "8.75% onwards", "↗"],
  ["Business Loan", "Fuel your business growth", "10.5% onwards", "▦"]
];

function formatRupees(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function calculateEmi(amount, rate, tenure) {
  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  return monthlyRate === 0 ? amount / months : amount * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
}

function LegacyLoans({ showToast }) {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);
  const [employment, setEmployment] = useState("Salaried");
  const [eligibilityAmount, setEligibilityAmount] = useState(500000);
  const [application, setApplication] = useState({ type: "Personal Loan", amount: "500000", tenure: "5", income: "75000", employer: "", purpose: "" });
  const [reviewing, setReviewing] = useState(false);
  const monthlyEmi = calculateEmi(loanAmount, interestRate, tenure);
  const totalRepayment = monthlyEmi * tenure * 12;

  const updateApplication = (field, value) => setApplication((current) => ({ ...current, [field]: value }));
  const checkEligibility = (event) => {
    event.preventDefault();
    showToast(eligibilityAmount <= 1500000 ? "You are pre-qualified for this loan amount" : "Please try a lower requested amount");
  };
  const submitApplication = () => {
    setReviewing(false);
    showToast("Loan application submitted successfully!");
  };

  return <section className="page loans-page">
    <div className="loan-hero"><div><span className="eyebrow">FINVORA CREDIT</span><h1>Borrow with clarity.<br /><em>Build what matters.</em></h1><p>Compare your options, understand your repayment, and apply with confidence.</p></div><div className="hero-rate"><strong>8.5%</strong><span>Starting interest rate</span></div></div>

    <div className="section-heading"><div><span className="eyebrow">EXPLORE OPTIONS</span><h2>Loans designed around you</h2></div><span className="section-note">Simple terms. Transparent pricing.</span></div>
    <div className="loan-type-grid">{loanTypes.map(([name, description, rate, icon]) => <button className="loan-type-card" key={name} onClick={() => { updateApplication("type", name); showToast(`${name} selected`); }}><span className="loan-icon">{icon}</span><strong>{name}</strong><p>{description}</p><small>{rate} <span>→</span></small></button>)}</div>

    <div className="loan-columns">
      <div className="card calculator-card"><div className="card-kicker">01 / PLAN YOUR REPAYMENT</div><div className="card-header"><div><h2>Loan calculator</h2><p>See your estimated monthly commitment in real time.</p></div><span className="calculator-mark">⌁</span></div><div className="range-field"><div><label>Loan amount</label><b>{formatRupees(loanAmount)}</b></div><input type="range" min="50000" max="3000000" step="10000" value={loanAmount} onChange={(event) => setLoanAmount(Number(event.target.value))} /></div><div className="range-field"><div><label>Tenure</label><b>{tenure} years</b></div><input type="range" min="1" max="10" value={tenure} onChange={(event) => setTenure(Number(event.target.value))} /></div><div className="rate-control"><label>Interest rate</label><div><input type="number" min="1" max="30" step="0.1" value={interestRate} onChange={(event) => setInterestRate(Number(event.target.value) || 0)} /><span>% p.a.</span></div></div><div className="emi-result"><span>Estimated monthly EMI</span><strong>{formatRupees(monthlyEmi)}</strong><div><span>Total interest <b>{formatRupees(totalRepayment - loanAmount)}</b></span><span>Total repayment <b>{formatRupees(totalRepayment)}</b></span></div></div></div>

      <div className="card eligibility-card"><div className="card-kicker">02 / CHECK YOUR FIT</div><h2>Loan eligibility</h2><p>Get a quick, indicative result using your profile.</p><form onSubmit={checkEligibility}><div className="mini-form-grid"><Field label="Monthly income" value="75000" /><div><label>Employment type</label><select value={employment} onChange={(event) => setEmployment(event.target.value)}><option>Salaried</option><option>Self-employed</option><option>Business owner</option></select></div><Field label="Age" value="28" /><Field label="Credit score" value="742" /><Field label="Existing EMI" value="12000" /><div><label>Requested amount</label><input value={eligibilityAmount} type="number" onChange={(event) => setEligibilityAmount(Number(event.target.value))} /></div></div><button className="primary" type="submit">Check eligibility <span>→</span></button></form></div>
    </div>

    <div className="card application-card"><div className="card-kicker">03 / TAKE THE NEXT STEP</div><div className="section-heading"><div><h2>Apply for a loan</h2><p>Complete your details and we will take it from here.</p></div><span className="secure-note">🔒 Secure application</span></div><div className="application-grid"><div className="application-form"><div className="form-grid"><div><label>Loan type</label><select value={application.type} onChange={(event) => updateApplication("type", event.target.value)}>{loanTypes.map(([name]) => <option key={name}>{name}</option>)}</select></div><div><label>Amount</label><input value={application.amount} type="number" onChange={(event) => updateApplication("amount", event.target.value)} /></div><div><label>Tenure</label><select value={application.tenure} onChange={(event) => updateApplication("tenure", event.target.value)}><option value="3">3 years</option><option value="5">5 years</option><option value="7">7 years</option><option value="10">10 years</option></select></div><div><label>Monthly income</label><input value={application.income} type="number" onChange={(event) => updateApplication("income", event.target.value)} /></div></div><div className="form-grid"><Field label="Employer / business name" value={application.employer} onChange={(value) => updateApplication("employer", value)} /><Field label="Loan purpose" value={application.purpose} onChange={(value) => updateApplication("purpose", value)} /></div><div className="application-actions"><button className="secondary" onClick={() => setReviewing(true)}>Review application</button><button className="primary" onClick={submitApplication}>Submit application <span>→</span></button></div></div><div className="document-checklist"><h3>Required documents</h3><p>Have these ready for a smooth verification.</p>{["PAN Card", "Aadhaar Card", "Last 3 months bank statements", "Latest salary slips"].map((document) => <label key={document}><input type="checkbox" defaultChecked /> <span>{document}</span><b>✓</b></label>)}</div></div></div>

    {reviewing && <div className="review-banner"><div><b>Ready to review?</b><span>{application.type} for {formatRupees(Number(application.amount) || 0)} over {application.tenure} years.</span></div><button className="primary" onClick={submitApplication}>Confirm and submit</button></div>}

    <div className="card status-card"><div className="card-kicker">04 / TRACK PROGRESS</div><div className="section-heading"><div><h2>Application status</h2><p>Personal Loan · FV-LN-20260901</p></div><span className="badge pending">Under Review</span></div><div className="loan-status detailed-status">{["Application Submitted", "Document Verification", "KYC Verification", "Under Review", "Approved", "Disbursed"].map((step, index) => <div className={`loan-step ${index < 4 ? "active" : ""}`} key={step}><div>{index < 4 ? "✓" : index + 1}</div><span>{step}</span>{index < 5 && <i />}</div>)}</div></div>

    <div className="loan-columns bottom-loans"><div className="card"><div className="card-kicker">05 / YOUR BORROWING</div><div className="section-heading"><h2>Active loans</h2><span className="badge verified">1 active</span></div><div className="active-loan"><div className="loan-summary-top"><span className="loan-icon">♙</span><div><b>Personal Loan</b><small>FV-PL-20240812</small></div><strong>₹4,20,000</strong></div><div className="balance-bar"><span style={{ width: "38%" }} /></div><div className="active-loan-stats"><Detail label="Outstanding" value="₹2,64,800" /><Detail label="Monthly EMI" value="₹10,440" /><Detail label="Interest rate" value="10.5%" /><Detail label="Next payment" value="15 Sep 2026" /><Detail label="Remaining tenure" value="32 months" /></div></div></div><RepaymentSchedule /></div>
  </section>;
}

function RepaymentSchedule() {
  const rows = [["Sep 2026", "₹7,110", "₹3,330", "₹10,440", "₹2,57,690"], ["Oct 2026", "₹7,169", "₹3,271", "₹10,440", "₹2,50,521"], ["Nov 2026", "₹7,228", "₹3,212", "₹10,440", "₹2,43,293"], ["Dec 2026", "₹7,288", "₹3,152", "₹10,440", "₹2,36,005"]];
  return <div className="card schedule-card"><div className="card-kicker">06 / PLAN AHEAD</div><div className="section-heading"><h2>Repayment schedule</h2><button className="text-button">View all →</button></div><div className="schedule-table"><div className="schedule-row schedule-head"><span>Month</span><span>Principal</span><span>Interest</span><span>EMI</span><span>Balance</span></div>{rows.map((row) => <div className="schedule-row" key={row[0]}>{row.map((value, index) => <span key={`${row[0]}-${index}`}>{value}</span>)}</div>)}</div></div>;
}

function Dashboard({ onPage }) {
  return <section className="page dashboard-page"><div className="welcome-card"><div><p>Good morning!</p><h1>Welcome to FinVora</h1><p>Manage your account, documents and transactions from one place.</p></div><div className="welcome-icon">◉</div></div><div className="stats"><Stat label="Available Balance" value="₹85,420" note="↑ 8.4% this month" positive /><Stat label="KYC Status" value="Verified" note="All documents verified" positive /><Stat label="Documents" value="5" note="4 verified" /></div><div className="grid"><div className="card"><div className="card-header"><h3>Recent Transactions</h3><button onClick={() => onPage("transactions")}>View All</button></div><Transaction icon="→" name="Amazon" date="Today, 10:30 AM" amount="-₹2,499" /><Transaction icon="→" name="Food Delivery" date="Yesterday, 8:15 PM" amount="-₹650" /><Transaction icon="+" name="Salary Credit" date="Sep 1, 2026" amount="+₹45,000" income /></div><div className="card"><h3>AI Recommendations</h3><div className="ai-box">✦<div><b>Smart Financial Tip</b><p>Your food expenses increased by 18% this month. Consider setting a monthly limit.</p></div></div><button className="primary" onClick={() => onPage("assistant")}>Ask AI Assistant</button></div></div></section>;
}

function Stat({ label, value, note, positive }) { return <div className="stat-card"><span>{label}</span><h2 className={positive ? "success" : ""}>{value}</h2><small className={positive ? "positive" : ""}>{note}</small></div>; }
function Transaction({ icon, name, date, amount, income }) { return <div className="transaction"><div className="transaction-icon">{icon}</div><div><b>{name}</b><small>{date}</small></div><strong className={income ? "income" : "expense"}>{amount}</strong></div>; }

function Profile({ userName, setUserName, profilePhoto, setProfilePhoto, showToast }) {
  const nameParts = userName.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" "));

  const saveProfile = () => {
    const nextName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!nextName) {
      showToast("Please enter your full name");
      return;
    }
    setUserName(nextName);
    showToast("Profile updated successfully!");
  };

  const selectPhoto = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setProfilePhoto(URL.createObjectURL(file));
    showToast("Profile photo selected");
  };

  return <section className="page"><div className="card"><h2>Customer Profile</h2><p>Manage your personal information.</p><div className="profile-box"><div className="profile-photo-wrap">{profilePhoto ? <img className="profile-photo" src={profilePhoto} alt="Profile" /> : <div className="large-avatar">{userName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>}<label className="photo-upload">＋<input type="file" accept="image/*" onChange={selectPhoto} hidden /></label></div><div><h2>{userName}</h2><p>Customer ID: FV-204812</p><p>jamuna@example.com</p></div></div><div className="customer-details"><Detail label="Customer ID" value="FV-204812" /><Detail label="Account Type" value="Savings Account" /><Detail label="Gender" value="Female" /><Detail label="Member Since" value="June 2021" /><Detail label="Home Branch" value="Chennai Central" /><Detail label="Account Status" value="Active" success /><Detail label="Last Login" value="Today, 9:42 AM" /><Detail label="Address" value="24 Lake View Road, Adyar, Chennai, Tamil Nadu 600020" address /></div><div className="form-grid"><Field label="First Name" value={firstName} onChange={setFirstName} /><Field label="Last Name" value={lastName} onChange={setLastName} /><Field label="Email" value="jamuna@example.com" /><Field label="Phone" value="+91 9876543210" /><Field label="Date of Birth" value="15-06-2005" /><Field label="Gender" value="Female" /><Field label="Address" value="24 Lake View Road, Adyar, Chennai, Tamil Nadu 600020" /></div><button className="primary" onClick={saveProfile}>Save Changes</button></div></section>;
}
function Detail({ label, value, success, address }) { return <div className={address ? "customer-address" : ""}><span>{label}</span><b className={success ? "success" : ""}>{value}</b></div>; }
function Field({ label, value, onChange }) { return <div><label>{label}</label><input {...(onChange ? { value, onChange: (event) => onChange(event.target.value) } : { defaultValue: value })} aria-label={label} /></div>; }
function Documents({ documents, uploadDocument, showToast }) {
  return <section className="page"><div className="card"><div className="card-header"><div><h2>Document Wallet</h2><p>Upload and manage your documents.</p></div><label className="upload-btn">+ Upload PDF<input type="file" accept=".pdf,application/pdf" onChange={uploadDocument} hidden /></label></div><div>{documents.map(([name, detail, status]) => <div className="document" key={`${name}-${detail}`}><div><b>{name}</b><small>{detail}</small></div><span className={`badge ${status === "Verified" ? "verified" : "pending"}`}>{status}</span></div>)}<p className="upload-guidance">Accepted format: PDF only · Maximum file size: 2 MB per document.</p></div></div><DocumentMismatchPanel showToast={showToast} /><VerificationTimeline title="Document verification timeline" items={[["Documents uploaded", "07 Sep 2026 · 09:31 AM", "complete"], ["Text and field validation", "07 Sep 2026 · 09:32 AM", "complete"], ["Cross-document review", "07 Sep 2026 · 09:36 AM", "complete"], ["Mismatch detected", "07 Sep 2026 · 09:37 AM", "review"], ["Documents approved", "Pending review", "pending"], ["Rejected", "Only if review fails", "rejected"]]} /></section>;
}

function VerificationTimeline({ title, items }) { return <div className="card verification-timeline"><div className="section-heading compact"><div><span className="eyebrow">AUDIT HISTORY</span><h2>{title}</h2><p>Every verification step includes the latest mock update time.</p></div></div><div className="verification-events">{items.map(([label, time, state], index) => <div className={`verification-event ${state}`} key={label}><div className="verification-marker">{state === "complete" ? "✓" : state === "rejected" ? "!" : index + 1}</div><div><b>{label}</b><small>{time}</small>{state === "review" && <span>Needs Review</span>}{state === "rejected" && <span>Outcome recorded only if verification fails</span>}</div></div>)}</div></div>; }

function DocumentMismatchPanel({ showToast }) {
  const comparison = [["Full Name", "JAMUNA DEVI", "JAMUNA D", "Minor Mismatch", "minor"], ["Date of Birth", "12/05/2005", "12/05/2005", "Match", "match"], ["Address", "Salem", "Salem", "Match", "match"], ["PAN Number", "ABCDE1234F", "ABCDE1234F", "Match", "match"], ["Aadhaar Number", "•••• 4821", "•••• 4821", "Match", "match"], ["Income", "₹45,000 / month", "₹45,000 / month", "Match", "match"], ["Document Expiry Date", "31 Dec 2028", "30 Dec 2028", "Minor Mismatch", "minor"]];
  return <div className="card mismatch-panel"><div className="mismatch-heading"><div><span className="eyebrow">DOCUMENT INTELLIGENCE</span><h2>Document comparison</h2><p>Compare extracted information across your submitted documents.</p></div><span className="mismatch-status minor"><i /> Minor Mismatch</span></div><div className="mismatch-message"><strong>⚠ Document Mismatch Detected</strong><p>Some information differs between your documents. Please review the details before continuing.</p></div><div className="mismatch-summary"><div><span>Match status</span><b>Minor mismatch</b></div><div><span>Documents compared</span><b>3 documents</b></div><div><span>Confidence</span><b>78%</b></div></div><div className="mismatch-detail"><h3>Mismatch details</h3><div className="mismatch-detail-grid"><div><span>Field</span><b>Full Name</b></div><div><span>PAN Card</span><b>JAMUNA DEVI</b></div><div><span>Aadhaar</span><b>JAMUNA D</b></div><div><span>Bank Statement</span><b>JAMUNA DEVI P</b></div><div><span>Status</span><b className="minor-text">Needs Review</b></div><div><span>Confidence</span><b>78%</b></div></div></div><div className="comparison-wrap"><h3>Compare documents</h3><div className="comparison-table"><div className="comparison-row comparison-head"><span>Field</span><span>Document 1</span><span>Document 2</span><span>Status</span></div>{comparison.map(([field, first, second, status, tone]) => <div className="comparison-row" key={field}><span>{field}</span><span>{first}</span><span>{second}</span><span className={tone}><i>{tone === "match" ? "✓" : "!"}</i>{status}</span></div>)}</div></div><div className="mismatch-legend"><span className="match">● Match</span><span className="minor">● Minor Mismatch</span><span className="major">● Major Mismatch</span></div><div className="mismatch-actions"><button className="secondary" onClick={() => showToast("Mismatch review opened")}>Review Mismatch</button><button className="secondary" onClick={() => showToast("Information edit mode opened")}>Edit Information</button><button className="secondary" onClick={() => showToast("Please select a document to resubmit")}>Resubmit Document</button><button className="primary" onClick={() => showToast("Documents accepted for continued review")}>Accept &amp; Continue</button></div></div>;
}
function FinancialImpactPreview({ title, action, summary, financialValues = [], positiveImpacts = [], negativeImpacts = [], warnings = [], recommendations = [], impact = "MODERATE IMPACT", onCancel, onConfirm }) {
  const impactClass = impact.toLowerCase().split(" ")[0];
  return <div className="impact-overlay" role="dialog" aria-modal="true" aria-label={`${title} preview`}><div className="impact-preview"><div className="impact-header"><div><span className="eyebrow">FINVORA IMPACT CHECK</span><h2>💡 Financial Impact Preview</h2></div><button className="impact-close" onClick={onCancel} aria-label="Close preview">×</button></div><p className="impact-intro">Here is what may happen if you continue. Review the possible impact before confirming.</p><div className={`impact-level ${impactClass}`}><span />{impact}</div><div className="impact-layout"><div className="impact-summary"><h3>{title}</h3><p>{summary}</p>{financialValues.map(([label, value]) => <div className="impact-value" key={label}><span>{label}</span><b>{value}</b></div>)}</div><div className="impact-details">{positiveImpacts.length > 0 && <ImpactList title="Positive / low impact" items={positiveImpacts} tone="positive" />}{negativeImpacts.length > 0 && <ImpactList title="What may change" items={negativeImpacts} tone="negative" />}{warnings.length > 0 && <ImpactList title="Important" items={warnings} tone="warning" />}{recommendations.length > 0 && <ImpactList title="Recommendation" items={recommendations} tone="info" />}</div></div><p className="impact-disclaimer">FinVora provides an estimated preview for informational purposes only. Actual financial outcomes may vary.</p><div className="impact-actions"><button className="secondary" onClick={onCancel}>Go back</button><button className="primary" onClick={onConfirm}>Continue <span>→</span></button></div></div></div>;
}

function ImpactList({ title, items, tone }) { return <div className={`impact-list ${tone}`}><strong>{title}</strong>{items.map((item) => <p key={item}>{item}</p>)}</div>; }

function Kyc() {
  const [preview, setPreview] = useState(false);
  return <section className="page"><div className="card"><h2>KYC Verification</h2><div className="kyc-status"><div className="check">✓</div><div><h2>KYC Verified</h2><p>Your identity has been successfully verified.</p></div></div><h3>Verified Information</h3><div className="info-grid"><Detail label="Name" value="Jamuna Devi" /><Detail label="Date of Birth" value="15-06-2005" /><Detail label="Document" value="Aadhaar" /><Detail label="Status" value="Verified" success /></div><button className="secondary" onClick={() => setPreview(true)}>Update KYC</button></div><VerificationTimeline title="KYC verification timeline" items={[["KYC submitted", "07 Sep 2026 · 09:42 AM", "complete"], ["Document validation", "07 Sep 2026 · 09:44 AM", "complete"], ["Identity review", "07 Sep 2026 · 09:49 AM", "complete"], ["KYC approved", "07 Sep 2026 · 09:51 AM", "complete"], ["KYC rejected", "Only if verification fails", "rejected"]]} />{preview && <FinancialImpactPreview title="Update KYC details" action="Update KYC" summary="Review how updating your identity documents may affect your account." financialValues={[["Documents being updated", "Aadhaar + PAN"], ["Current KYC status", "Verified"], ["Verification status", "Re-check required"]]} negativeImpacts={["Some account actions may be limited during verification.", "You may need to confirm your identity again."]} recommendations={["Keep your original documents available for verification."]} impact="LOW IMPACT" onCancel={() => setPreview(false)} onConfirm={() => setPreview(false)} />}</section>;
}

function Services({ showToast }) {
  const [preview, setPreview] = useState(null);
  const [reviewForm, setReviewForm] = useState(null);
  const serviceDetails = { "Minor → Major": { summary: "See what changes when your account becomes independent.", values: [["Current status", "Minor account"], ["New status", "Major account"]], positive: ["Access to expanded banking services."], negative: ["Fresh KYC updates may be required."], impact: "LOW IMPACT" }, "Joint → Individual": { summary: "Review ownership and access changes before requesting conversion.", values: [["Current ownership", "Joint account"], ["New ownership", "Individual account"]], negative: ["The other holder may lose account access.", "New ownership documents will be required."], warnings: ["Confirm all account holders agree before continuing."], impact: "MODERATE IMPACT" }, "Account Upgrade": { summary: "Compare your current account with the upgraded service level.", values: [["Current account", "Savings Account"], ["New account", "Premium Savings"], ["Possible fee", "₹499 / year"], ["Minimum balance", "₹25,000"]], positive: ["Higher service limits and priority support."], negative: ["A minimum balance and annual fee may apply."], impact: "MODERATE IMPACT" }, "Account Closure": { summary: "Review linked balances and services before closing this account.", values: [["Current balance", "₹85,420"], ["Pending transactions", "2"], ["Pending fees", "₹0"], ["Linked loans", "1"]], negative: ["Cards and linked services may stop working."], warnings: ["Closing this account may affect linked services and cards."], impact: "HIGH IMPACT" } };
  const detail = preview ? serviceDetails[preview] : null;
  return <section className="page"><h2>Account Services</h2><div className="service-grid">{Object.keys(serviceDetails).map((name) => <button className="service-card" key={name} onClick={() => setPreview(name)}>✦<h3>{name}</h3><p>Review the possible impact before confirming.</p></button>)}</div>{detail && <FinancialImpactPreview title={preview} action={preview} summary={detail.summary} financialValues={detail.values} positiveImpacts={detail.positive} negativeImpacts={detail.negative} warnings={detail.warnings} impact={detail.impact} recommendations={["This is a mock preview based on the information currently available."]} onCancel={() => setPreview(null)} onConfirm={() => { setReviewForm(preview); setPreview(null); }} />}{reviewForm && <AutoFilledServiceForm service={reviewForm} onCancel={() => setReviewForm(null)} onSubmit={() => { setReviewForm(null); showToast(`${reviewForm} request submitted successfully!`); }} />}</section>;
}

function AutoFilledServiceForm({ service, onCancel, onSubmit }) {
  const fields = [["Full Name", "Jamuna Devi", "Aadhaar Card"], ["Date of Birth", "15-06-2005", "Aadhaar Card"], ["Address", "24 Lake View Road, Adyar, Chennai", "Address Proof"], ["PAN Number", "ABCDE1234F", "PAN Card"], ["Account Number", "FV-204812", "Bank Statement"], ["KYC Status", "Verified", "Aadhaar + PAN"]];
  return <div className="impact-overlay" role="dialog" aria-modal="true" aria-label={`${service} review form`}><div className="impact-preview service-review-form"><div className="impact-header"><div><span className="eyebrow">DOCUMENT-FILLED REQUEST</span><h2>Review {service}</h2></div><button className="impact-close" onClick={onCancel} aria-label="Close review">×</button></div><p className="impact-intro">Your information was automatically filled from your verified documents. Review it before submitting.</p><div className="auto-fill-note"><span>✓</span><div><b>Automatically filled from documents</b><small>No manual entry is required. Values are read-only for this review.</small></div></div><div className="auto-fill-grid">{fields.map(([label, value, source]) => <label key={label}>{label}<input value={value} readOnly /><small>Source: {source}</small></label>)}</div><div className="document-review"><b>Document review</b><span>✓ Aadhaar Card verified</span><span>✓ PAN Card verified</span><span>✓ Address Proof matched</span></div><p className="impact-disclaimer">Please confirm that the extracted information is correct. You can go back to review the source documents.</p><div className="impact-actions"><button className="secondary" onClick={onCancel}>Go back</button><button className="primary" onClick={onSubmit}>Submit request <span>→</span></button></div></div></div>;
}

function Transactions({ showToast }) {
  const [preview, setPreview] = useState(false);
  const [transaction, setTransaction] = useState("Amazon · ₹2,499 · 05 Sep 2026");
  const [reason, setReason] = useState("Unauthorized transaction");
  const transactionDetails = { "Amazon · ₹2,499 · 05 Sep 2026": ["₹2,499", "05 Sep 2026", "Card purchase"], "Food Delivery · ₹650 · 04 Sep 2026": ["₹650", "04 Sep 2026", "Card purchase"], "Electricity Bill · ₹1,850 · 30 Aug 2026": ["₹1,850", "30 Aug 2026", "Bill payment"] };
  const selected = transactionDetails[transaction];
  return <section className="page"><div className="card"><h2>Transaction History</h2><div className="transaction-table"><div className="table-row table-head"><span>Date</span><span>Description</span><span>Category</span><span>Amount</span></div>{[["Sep 5", "Amazon", "Shopping", "-₹2,499"], ["Sep 4", "Food Delivery", "Food", "-₹650"], ["Sep 1", "Salary", "Income", "+₹45,000"], ["Aug 30", "Electricity Bill", "Utilities", "-₹1,850"]].map(([date, description, category, amount]) => <div className="table-row" key={date}><span>{date}</span><span>{description}</span><span>{category}</span><span className={amount.startsWith("+") ? "income" : "expense"}>{amount}</span></div>)}</div></div><div className="card dispute-card"><h2>Transaction Dispute</h2><p>Choose a transaction and reason before reviewing your dispute.</p><div className="dispute-form"><label>Transaction<select value={transaction} onChange={(event) => setTransaction(event.target.value)}>{Object.keys(transactionDetails).map((item) => <option key={item}>{item}</option>)}</select></label><label>Dispute reason<select value={reason} onChange={(event) => setReason(event.target.value)}><option>Unauthorized transaction</option><option>Duplicate charge</option><option>Wrong amount</option><option>Cash not received</option></select></label></div><button className="primary" onClick={() => setPreview(true)}>Review dispute <span>→</span></button></div>{preview && <FinancialImpactPreview title="Submit transaction dispute" action="Submit dispute" summary="Review the selected transaction and mock dispute process before sending your request." financialValues={[["Transaction amount", selected[0]], ["Transaction date", selected[1]], ["Transaction type", selected[2]], ["Dispute reason", reason]]} negativeImpacts={["The transaction may be temporarily reviewed or reversed."]} recommendations={["Keep any receipts or supporting details available."]} warnings={["A temporary credit may be applied while the dispute is investigated."]} impact="MODERATE IMPACT" onCancel={() => setPreview(false)} onConfirm={() => { setPreview(false); showToast("Transaction dispute submitted successfully!"); }} />}</section>;
}

function Insights() { return <section className="page"><div className="card"><h2>Spending Insights</h2>{[["Shopping", "70%", "progress-70"], ["Food", "85%", "progress-85"], ["Utilities", "45%", "progress-45"], ["Travel", "30%", "progress-30"]].map(([name, amount, className]) => <div className="progress-item" key={name}><div><b>{name}</b><span>{amount}</span></div><div className="progress"><div className={className} /></div></div>)}</div></section>; }
function Assistant({ chat, chatInput, setChatInput, sendMessage }) { return <section className="page"><div className="card assistant"><div className="assistant-header"><div className="bot-icon">✦</div><div><h2>FinVora AI Assistant</h2><p>Ask about your account.</p></div></div><div id="chat">{chat.map(([type, message], index) => <div className={`message ${type}`} key={`${message}-${index}`}>{message}</div>)}</div><form className="chat-input" onSubmit={sendMessage}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about your account..." /><button type="submit">Send</button></form></div></section>; }

const loanTypes = [
  ["Personal Loan", "Flexible funds for your everyday goals", "₹5L", "From 10.5%"],
  ["Education Loan", "Invest in your next chapter", "₹25L", "From 8.5%"],
  ["Home Loan", "Make space for what matters", "₹1Cr", "From 8.4%"],
  ["Vehicle Loan", "Move forward with confidence", "₹30L", "From 9.2%"],
  ["Business Loan", "Fuel your business momentum", "₹50L", "From 11.0%"]
];

const scheduleRows = [
  ["Oct 2026", "₹7,482", "₹2,518", "₹10,000", "₹4,92,518"],
  ["Nov 2026", "₹7,544", "₹2,456", "₹10,000", "₹4,84,974"],
  ["Dec 2026", "₹7,606", "₹2,394", "₹10,000", "₹4,77,368"],
  ["Jan 2027", "₹7,669", "₹2,331", "₹10,000", "₹4,69,699"],
  ["Feb 2027", "₹7,732", "₹2,268", "₹10,000", "₹4,61,967"]
];

function money(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function Loans({ showToast }) {
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(10.5);
  const [eligibility, setEligibility] = useState({ income: "75000", employment: "Salaried", age: "28", score: "762", existingEmi: "12000", requested: "500000" });
  const [application, setApplication] = useState({ type: "Personal Loan", amount: "500000", tenure: "60", income: "75000", employment: "Salaried", purpose: "Home renovation" });
  const [reviewing, setReviewing] = useState(false);
  const [loanPreview, setLoanPreview] = useState(false);
  const eligible = Number(eligibility.income) - Number(eligibility.existingEmi) > 30000 && Number(eligibility.score) >= 700 && Number(eligibility.age) >= 21;
  const monthlyRate = rate / 1200;
  const emi = Math.round((amount * monthlyRate * (1 + monthlyRate) ** tenure) / ((1 + monthlyRate) ** tenure - 1));
  const totalRepayment = emi * tenure;
  const updateEligibility = (key, value) => setEligibility((current) => ({ ...current, [key]: value }));
  const updateApplication = (key, value) => setApplication((current) => ({ ...current, [key]: value }));
  const applicationTimeline = [["Application Submitted", "07 Sep 2026 · 09:42 AM", "complete"], ["Document Validation", "07 Sep 2026 · 09:48 AM", "complete"], ["KYC Verification", "07 Sep 2026 · 10:05 AM", "complete"], ["Under Review", "07 Sep 2026 · 10:22 AM", "active"], ["Approved", "Pending review", "pending"], ["Disbursed", "Pending approval", "pending"]];

  return <section className="page loans-page">
    <div className="loans-hero"><div><span className="eyebrow">BORROW WITH CLARITY</span><h1>Funding for your next move.</h1><p>Explore flexible financing built around your plans, with transparent rates and a simple digital application.</p><button className="hero-button" onClick={() => document.getElementById("loan-apply").scrollIntoView({ behavior: "smooth" })}>Start an application <span>→</span></button></div><div className="hero-stat"><span>Pre-approved limit</span><strong>₹12,50,000</strong><small>Available for you today</small></div></div>

    <div className="loan-columns">
      <div className="card calculator-card"><div className="section-heading compact"><div><span className="eyebrow">PLAN YOUR REPAYMENT</span><h2>Loan calculator</h2></div><span className="live-pill"><i /> Live estimate</span></div><div className="slider-field"><div><label>Loan amount</label><output>{money(amount)}</output></div><input type="range" min="50000" max="2500000" step="10000" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></div><div className="range-labels"><span>₹50K</span><span>₹25L</span></div><div className="slider-field"><div><label>Tenure</label><output>{tenure} months</output></div><input type="range" min="12" max="84" step="6" value={tenure} onChange={(event) => setTenure(Number(event.target.value))} /></div><div className="range-labels"><span>12 months</span><span>84 months</span></div><label className="rate-field">Interest rate <div><input type="number" min="1" max="30" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value))} /><span>% p.a.</span></div></label><div className="emi-result"><span>Monthly EMI</span><strong>{money(emi)}</strong><small>for {tenure} months at {rate}% interest</small></div><div className="calculator-summary"><div><span>Total interest</span><b>{money(totalRepayment - amount)}</b></div><div><span>Total repayment</span><b>{money(totalRepayment)}</b></div></div></div>

      <div className="card eligibility-card"><div className="section-heading compact"><div><span className="eyebrow">A QUICK CHECK</span><h2>Loan eligibility</h2></div><span className={`score-badge ${eligible ? "good" : "review"}`}>{eligible ? "Likely eligible" : "Needs review"}</span></div><div className="eligibility-grid"><label>Monthly income<input value={eligibility.income} onChange={(event) => updateEligibility("income", event.target.value)} /></label><label>Employment type<select value={eligibility.employment} onChange={(event) => updateEligibility("employment", event.target.value)}><option>Salaried</option><option>Self-employed</option><option>Business owner</option></select></label><label>Age<input type="number" value={eligibility.age} onChange={(event) => updateEligibility("age", event.target.value)} /></label><label>Credit score<input type="number" value={eligibility.score} onChange={(event) => updateEligibility("score", event.target.value)} /></label><label>Existing EMI<input value={eligibility.existingEmi} onChange={(event) => updateEligibility("existingEmi", event.target.value)} /></label><label>Requested amount<input value={eligibility.requested} onChange={(event) => updateEligibility("requested", event.target.value)} /></label></div><div className={`eligibility-result ${eligible ? "eligible" : "needs-review"}`}><div className="result-mark">{eligible ? "✓" : "!"}</div><div><b>{eligible ? "You may be eligible for this loan" : "A little more information is needed"}</b><p>{eligible ? "Based on the details provided, you could qualify for up to ₹12,50,000." : "Try lowering the requested amount or updating your details for a clearer result."}</p></div></div></div>
    </div>

    <div className="card application-card" id="loan-apply"><div className="section-heading compact"><div><span className="eyebrow">DIGITAL APPLICATION</span><h2>Apply for a loan</h2><p>Complete the details below. It takes about 3 minutes.</p></div><span className="step-count">01 <span>/ 03</span></span></div><div className="application-grid"><label>Loan type<select value={application.type} onChange={(event) => updateApplication("type", event.target.value)}>{loanTypes.map(([name]) => <option key={name}>{name}</option>)}</select></label><label>Amount<input value={application.amount} onChange={(event) => updateApplication("amount", event.target.value)} /></label><label>Tenure<select value={application.tenure} onChange={(event) => updateApplication("tenure", event.target.value)}><option value="24">24 months</option><option value="36">36 months</option><option value="60">60 months</option><option value="84">84 months</option></select></label><label>Monthly income<input value={application.income} onChange={(event) => updateApplication("income", event.target.value)} /></label><label>Employment details<input value={application.employment} onChange={(event) => updateApplication("employment", event.target.value)} /></label><label>Loan purpose<input value={application.purpose} onChange={(event) => updateApplication("purpose", event.target.value)} /></label></div><div className="document-checklist"><h3>Required documents</h3><label><input type="checkbox" defaultChecked /> PAN card</label><label><input type="checkbox" defaultChecked /> Aadhaar / address proof</label><label><input type="checkbox" /> Latest salary slips</label><label><input type="checkbox" /> Bank statements</label></div>{reviewing && <div className="review-note"><b>Ready to review</b><span>{application.type} · {money(Number(application.amount) || 0)} · {application.tenure} months</span></div>}<div className="application-actions"><button className="secondary" onClick={() => setReviewing(true)}>Review application</button><button className="primary" onClick={() => setLoanPreview(true)}>Submit application <span>→</span></button></div></div>

    <div className="card status-card"><div className="section-heading compact"><div><span className="eyebrow">APPLICATION FV-LOAN-2048</span><h2>Application status</h2><p>Each status includes the latest mock update time.</p></div></div><div className="loan-status detailed-status">{applicationTimeline.map(([step, time, state], index) => <div className={`loan-step ${state === "complete" || state === "active" ? "active" : ""} ${state}`} key={step}><div>{state === "complete" ? "✓" : index + 1}</div><span>{step}<small>{time}</small></span>{index < applicationTimeline.length - 1 && <i />}</div>)}</div><div className="status-outcome"><span className="status-dot rejected" />Rejected: only shown if eligibility or verification fails, with the exact review time recorded.</div></div>

    <div className="section-heading"><div><span className="eyebrow">YOUR BORROWINGS</span><h2>Active loans</h2></div><button className="text-button" onClick={() => showToast("Showing all active loans")}>View all →</button></div><div className="active-loan"><div className="active-loan-title"><div className="loan-type-icon">✦</div><div><h3>Personal Loan</h3><span>Loan ID: FVPL-908431</span></div><span className="badge verified">Active</span></div><div className="loan-metrics"><div><span>Loan amount</span><b>₹5,00,000</b></div><div><span>Outstanding amount</span><b>₹4,61,967</b></div><div><span>Monthly EMI</span><b>₹10,000</b></div><div><span>Interest rate</span><b>10.5% p.a.</b></div><div><span>Next payment</span><b>05 Oct 2026</b></div><div><span>Remaining tenure</span><b>55 months</b></div></div></div>

    <div className="card schedule-card"><div className="section-heading compact"><div><span className="eyebrow">PERSONAL LOAN · FVPL-908431</span><h2>Repayment schedule</h2></div><button className="secondary" onClick={() => showToast("Repayment schedule downloaded")}>↓ Download</button></div><div className="schedule-table"><div className="schedule-row schedule-head"><span>Month</span><span>Principal</span><span>Interest</span><span>EMI</span><span>Remaining balance</span></div>{scheduleRows.map((row) => <div className="schedule-row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div><button className="load-more" onClick={() => showToast("All 55 repayment months are shown in your statement")}>View full schedule <span>→</span></button></div>
    {loanPreview && <FinancialImpactPreview title={`${application.type} application`} action="Submit loan application" summary="Review your estimated repayment and monthly affordability before submitting." financialValues={[["Requested loan amount", money(Number(application.amount) || 0)], ["Estimated monthly EMI", money(emi)], ["Interest rate", `${rate}% p.a.`], ["Loan tenure", `${application.tenure} months`], ["Total repayment", money(totalRepayment)], ["Total interest", money(totalRepayment - (Number(application.amount) || 0))], ["Existing EMI", "₹12,000"], ["Total monthly EMI", money(emi + 12000)], ["Estimated EMI increase", `+ ${money(emi)}`]]} negativeImpacts={[`Your monthly EMI may increase by ${money(emi)}.`, `Estimated disposable income after EMI: ${money(Math.max(0, Number(application.income) - emi - 12000))}.`]} recommendations={["Make sure the new EMI fits comfortably within your monthly budget.", "This affordability result is based on mock information currently available."]} impact={emi < Number(application.income) * .2 ? "LOW IMPACT" : emi < Number(application.income) * .35 ? "MODERATE IMPACT" : "HIGH IMPACT"} onCancel={() => setLoanPreview(false)} onConfirm={() => { setLoanPreview(false); setReviewing(false); showToast("Loan application submitted successfully!"); }} />}
  </section>;
}

export default App;
