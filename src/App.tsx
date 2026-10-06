import { FormEvent, useEffect, useRef, useState } from "react";

const photos = [
  "https://images.unsplash.com/photo-1664831750337-a2fdb43794a5?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1684292113684-abb20a8bcbc0?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1628417076407-638e6a88a62e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1678850123695-2af08edf754b?auto=format&fit=crop&w=1600&q=85",
];

const services = [
  ["01", "BUSINESS WEBSITES", "Professional websites designed to build trust, showcase your business and turn visitors into enquiries."],
  ["02", "E-COMMERCE WEBSITES", "Beautiful online stores designed to make products easy to discover, trust and buy."],
  ["03", "LANDING PAGES", "Focused, high-converting pages designed around one clear goal."],
  ["04", "PORTFOLIO WEBSITES", "Personal websites that turn your work, skills and identity into a powerful digital presence."],
  ["05", "WEB APPLICATIONS", "Custom web experiences built for ideas that need more than a traditional website."],
  ["06", "CUSTOM WEBSITES", "No templates. No limitations. Completely custom digital experiences designed from scratch."],
];

const projects = [
  ["NOVA", "TECHNOLOGY • SAAS", "A modern SaaS website designed to simplify a complex product and turn visitors into customers."],
  ["CASA", "INTERIOR DESIGN • ARCHITECTURE", "A premium visual experience created to showcase spaces, projects and craftsmanship."],
  ["KOFFEE", "FOOD • HOSPITALITY", "A warm and engaging digital experience designed to bring a local brand online."],
  ["VELO", "FASHION • E-COMMERCE", "A bold e-commerce experience designed to turn products into a memorable shopping journey."],
];

const process = [
  ["01", "DISCOVER", "First, we understand you.", "We learn about your business, your audience, your goals and what you want your website to achieve."],
  ["02", "DESIGN", "Then, we make it look incredible.", "We create the visual direction, user experience and interface around your brand."],
  ["03", "DEVELOP", "Then, we bring the design to life.", "We turn the approved design into a fast, responsive and functional website."],
  ["04", "TEST", "Before the world sees it, we test everything.", "We check responsiveness, performance, usability and functionality across devices."],
  ["05", "LAUNCH", "Your website is ready to go live.", "We launch your website and make sure everything is working as expected."],
];

const reasons = [
  ["01", "CUSTOM DESIGN", "No generic templates.", "Every website is designed around your brand, your audience and your goals."],
  ["02", "MOBILE FIRST", "Beautiful on every screen.", "A seamless experience on phone, tablet and desktop."],
  ["03", "FAST PERFORMANCE", "Because nobody likes waiting.", "Fast, smooth and efficient digital experiences."],
  ["04", "CONVERSION FOCUSED", "Beautiful is not enough.", "Turn attention into enquiries, customers and business."],
  ["05", "END-TO-END", "From idea to launch.", "Design, development, testing and deployment in one place."],
];

type FormData = Record<string, string>;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow reveal">{children}</p>;
}

function CTA({ children, href = "#enquiry", light = false }: { children: React.ReactNode; href?: string; light?: boolean }) {
  return (
    <a className={`cta ${light ? "cta-light" : ""}`} href={href}>
      <span>{children}</span><Arrow />
    </a>
  );
}

function SectionIntro({ label, title, copy }: { label: string; title: string; copy?: string }) {
  return (
    <div className="section-intro">
      <Label>{label}</Label>
      <h2 className="display reveal">{title}</h2>
      {copy && <p className="section-copy reveal">{copy}</p>}
    </div>
  );
}

function Choice({ value, selected, onClick }: { value: string; selected: boolean; onClick: () => void }) {
  return (
    <button className={`choice ${selected ? "selected" : ""}`} type="button" onClick={onClick}>
      <span className="choice-dot" />{value}
    </button>
  );
}

function EnquiryForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const update = (key: string, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const choose = (key: string, value: string) => update(key, value);

  const go = (nextStep: number) => {
    setStep(nextStep);
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      if (rect.top < 60 || rect.top > 300) {
        const targetY = window.scrollY + rect.top - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      }
    }
  };

  const options = (key: string, values: string[]) => (
    <div className="choices">
      {values.map((value) => (
        <Choice
          key={value}
          value={value}
          selected={data[key] === value}
          onClick={() => choose(key, value)}
        />
      ))}
    </div>
  );

  const input = (key: string, placeholder: string, type = "text") => (
    <input
      type={type}
      className={errors[key] ? "input-error" : ""}
      value={data[key] || ""}
      placeholder={placeholder}
      onChange={(e) => update(key, e.target.value)}
    />
  );

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 1) {
      if (!data.name?.trim()) errs.name = "Please enter your name.";
      if (!data.brand?.trim()) errs.brand = "Please enter your business or brand name.";
    } else if (s === 2) {
      if (!data.websiteType) errs.websiteType = "Please select what type of website you need.";
    } else if (s === 3) {
      if (!data.goals?.trim()) errs.goals = "Please share what you want your website to achieve.";
      if (!data.existingWebsite) errs.existingWebsite = "Please select whether you currently have a website.";
      if (!data.domain) errs.domain = "Please select whether you already have a domain.";
    } else if (s === 4) {
      if (!data.style) errs.style = "Please choose a visual style direction.";
    } else if (s === 5) {
      if (!data.budget) errs.budget = "Please select your approximate budget.";
      if (!data.timeline) errs.timeline = "Please select when you want the website.";
    } else if (s === 6) {
      if (!data.email?.trim()) {
        errs.email = "Please enter your email address.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
      if (!data.phone?.trim()) {
        errs.phone = "Please enter your phone or WhatsApp number.";
      } else if (data.phone.trim().replace(/\D/g, "").length < 7) {
        errs.phone = "Please enter a valid phone number (at least 7 digits).";
      }
      if (!data.contactMethod) errs.contactMethod = "Please select your preferred contact method.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const next = () => {
    if (validateStep(step)) {
      go(Math.min(6, step + 1));
    }
  };

  const back = () => {
    setErrors({});
    go(Math.max(1, step - 1));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep(6)) return;

    const endpoint =
      import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbzUmqQ99M5jev-aqz-JZyesoKlJAqDblgmdmChc6geEEI0EiFEWAi_pZoUMuqlA0NrJ/exec";

    if (!endpoint) {
      setErrorMessage("The form endpoint isn't configured yet. Add VITE_GOOGLE_APPS_SCRIPT_URL to your environment and try again.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      });
      setStatus("success");
    } catch {
      setErrorMessage("Something went wrong while submitting your brief. Please check your internet connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success">
        <span className="success-mark">✓</span>
        <h3>PROJECT<br />RECEIVED.</h3>
        <p>Thanks for sharing your requirements. We'll review your project and contact you shortly.</p>
        <p className="muted">Something exciting could be about to start.</p>
        <CTA href="#top">BACK TO HOME</CTA>
      </div>
    );
  }

  return (
    <form className="project-form" ref={formRef} onSubmit={submit} noValidate>
      <div className="form-top">
        <div>
          <p className="step-label">PROJECT BRIEF</p>
          <p className="progress">0{step} <span>/ 06</span></p>
        </div>
        <div className="progress-track"><i style={{ width: `${(step / 6) * 100}%` }} /></div>
      </div>

      {step === 1 && <div className="form-step">
        <h3>FIRST, TELL US<br />ABOUT YOU.</h3>
        <label>What's your name? <span className="req">*</span>
          {input("name", "Enter your name")}
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>What's your business or brand name? <span className="req">*</span>
          {input("brand", "Enter your business / brand name")}
          {errors.brand && <span className="field-error">{errors.brand}</span>}
        </label>
        <button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button>
      </div>}

      {step === 2 && <div className="form-step">
        <h3>WHAT ARE WE<br />BUILDING?</h3>
        <label>What type of website do you need? <span className="req">*</span></label>
        {options("websiteType", ["BUSINESS WEBSITE", "E-COMMERCE", "PORTFOLIO", "LANDING PAGE", "WEB APPLICATION", "OTHER"])}
        {errors.websiteType && <span className="field-error">{errors.websiteType}</span>}
        <div className="form-actions"><button type="button" onClick={back}>← BACK</button><button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button></div>
      </div>}

      {step === 3 && <div className="form-step">
        <h3>TELL US ABOUT<br />YOUR PROJECT.</h3>
        <label>What do you want your website to achieve? <span className="req">*</span>
          <textarea
            className={errors.goals ? "input-error" : ""}
            value={data.goals || ""}
            onChange={(e) => update("goals", e.target.value)}
            placeholder="Tell us about your business, your idea and what you want your website to achieve..."
          />
          {errors.goals && <span className="field-error">{errors.goals}</span>}
        </label>
        <label>Do you already have a website? <span className="req">*</span></label>
        {options("existingWebsite", ["YES", "NO"])}
        {errors.existingWebsite && <span className="field-error">{errors.existingWebsite}</span>}
        <label>Do you already have a domain? <span className="req">*</span></label>
        {options("domain", ["YES", "NO", "NOT SURE"])}
        {errors.domain && <span className="field-error">{errors.domain}</span>}
        <div className="form-actions"><button type="button" onClick={back}>← BACK</button><button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button></div>
      </div>}

      {step === 4 && <div className="form-step">
        <h3>WHAT SHOULD IT<br />LOOK LIKE?</h3>
        <label>What style are you looking for? <span className="req">*</span></label>
        {options("style", ["MINIMAL", "MODERN", "PREMIUM", "BOLD", "COLORFUL", "DARK", "NOT SURE"])}
        {errors.style && <span className="field-error">{errors.style}</span>}
        <label>Do you have any websites you like? <small className="field-note">(Optional)</small>
          {input("inspiration", "Paste website links for inspiration")}
        </label>
        <p className="field-note">Don't worry if you don't have any. We can help define the visual direction.</p>
        <div className="form-actions"><button type="button" onClick={back}>← BACK</button><button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button></div>
      </div>}

      {step === 5 && <div className="form-step">
        <h3>LET'S TALK ABOUT<br />YOUR PLAN.</h3>
        <label>What's your approximate budget? <span className="req">*</span></label>
        {options("budget", ["UNDER ₹10K", "₹10K – ₹25K", "₹25K – ₹50K", "₹50K+", "NOT DECIDED"])}
        {errors.budget && <span className="field-error">{errors.budget}</span>}
        <label>When do you want your website? <span className="req">*</span></label>
        {options("timeline", ["ASAP", "1–2 WEEKS", "1 MONTH", "FLEXIBLE"])}
        {errors.timeline && <span className="field-error">{errors.timeline}</span>}
        <div className="form-actions"><button type="button" onClick={back}>← BACK</button><button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button></div>
      </div>}

      {step === 6 && <div className="form-step">
        <h3>WHERE CAN WE<br />REACH YOU?</h3>
        <label>What's your email? <span className="req">*</span>
          {input("email", "you@example.com", "email")}
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>What's your phone / WhatsApp number? <span className="req">*</span>
          {input("phone", "+91 XXXXX XXXXX", "tel")}
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>
        <label>How would you like us to contact you? <span className="req">*</span></label>
        {options("contactMethod", ["WHATSAPP", "PHONE CALL", "EMAIL"])}
        {errors.contactMethod && <span className="field-error">{errors.contactMethod}</span>}
        {status === "error" && <p className="form-error">{errorMessage || "Something went wrong. Please try again."}</p>}
        <div className="form-actions"><button type="button" onClick={back}>← BACK</button><button className="form-next" type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING..." : "SUBMIT MY PROJECT"} <Arrow /></button></div>
        <p className="privacy">Your information is only used to contact you about your project.</p>
      </div>}
    </form>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quote, setQuote] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  const nav = ["WORK", "SERVICES", "PROCESS", "ABOUT"];
  const quotes = [
    ["“From the first design to launch, the entire process felt professional. Our new website completely changed how customers perceive our brand.”", "ARUN KUMAR", "FOUNDER • NOVA"],
    ["“They didn't just build us a website. They understood our business and turned our idea into something we were proud to show our customers.”", "PRIYA S", "FOUNDER • CASA"],
  ];

  return <main id="top">
    <header className={scrolled ? "scrolled" : ""}>
      <a className="logo" href="#top">D3 STUDIO<span>®</span></a>
      <nav>{nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
      <a className="nav-cta" href="#enquiry">START A PROJECT <Arrow /></a>
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? "CLOSE" : "MENU"}</button>
    </header>
    {menuOpen && <div className="mobile-menu">{nav.map((item) => <a key={item} onClick={() => setMenuOpen(false)} href={`#${item.toLowerCase()}`}>{item}</a>)}<a href="#enquiry">START A PROJECT ↗</a></div>}

    <section className="hero">
      <div className="hero-grid">
        <Label>WEB DESIGN • DEVELOPMENT • DIGITAL EXPERIENCES</Label>
        <p className="hero-index">INDEPENDENT DIGITAL STUDIO<br />INDIA / WORLDWIDE</p>
      </div>
      <h1>
        <span className="hero-line">YOUR BUSINESS</span>
        <span className="hero-line outline">DESERVES MORE</span>
        <span className="hero-line indent">THAN A WEBSITE.</span>
      </h1>
      <div className="hero-bottom">
        <p>Custom websites designed, developed and launched for businesses, brands, creators and ambitious startups.</p>
        <div className="hero-actions"><CTA>START YOUR PROJECT</CTA><a className="text-link" href="#work">VIEW OUR WORK ↓</a></div>
      </div>
      <div className="hero-art reveal">
        <div className="browser">
          <div className="browser-bar"><span /><span /><span /><b>NOVA — DIGITAL FUTURES</b></div>
          <div className="browser-content">
            <div className="mock-nav"><b>NOVA</b><span>PLATFORM &nbsp; SOLUTIONS &nbsp; ABOUT</span></div>
            <div className="mock-copy"><small>BUILD / SCALE / LEAD</small><strong>FUTURE,<br />UNFOLDED.</strong><p>Smarter infrastructure for the ideas changing tomorrow.</p></div>
            <div className="orb"><i /></div>
          </div>
        </div>
        <div className="float-tag">DESIGN. DEVELOP.<br />LAUNCH. GROW.</div>
      </div>
    </section>

    <div className="ticker"><div>WE BUILD WEBSITES THAT BUILD BUSINESSES — WE BUILD WEBSITES THAT BUILD BUSINESSES — </div></div>

    <section className="trust" id="about">
      <SectionIntro label="TRUSTED BY AMBITIOUS BUSINESSES" title="BUILT FOR BUSINESSES THAT WANT TO STAND OUT." copy="We combine strategy, design and technology to create digital experiences that make businesses look credible, modern and memorable." />
      <div className="stats">
        {[["50+", "WEBSITES LAUNCHED"], ["30+", "BUSINESSES SERVED"], ["10+", "INDUSTRIES"], ["99%", "CLIENT SATISFACTION"]].map(([n, l]) => <div className="stat reveal" key={l}><strong>{n}</strong><span>{l}</span></div>)}
      </div>
    </section>

    <section className="services" id="services">
      <SectionIntro label="WHAT WE BUILD" title="WE DON'T JUST BUILD WEBSITES. WE BUILD DIGITAL EXPERIENCES." copy="From focused landing pages to complete digital platforms, we create websites around your business, your audience and your goals." />
      <div className="service-list">
        {services.map(([n, title, copy]) => <article className="service reveal" key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p><a href="#enquiry">EXPLORE <Arrow /></a></article>)}
      </div>
    </section>

    <section className="work" id="work">
      <SectionIntro label="SELECTED WORK" title="WE MAKE IDEAS LOOK REAL." copy="A selection of websites and digital experiences we've designed and built for ambitious brands." />
      <div className="projects">
        {projects.map(([name, category, copy], i) => <article className={`project project-${i + 1} reveal`} key={name}>
          <div className="project-image"><img src={photos[i]} alt="" /><span>0{i + 1}</span><div className="image-word">{name}</div></div>
          <div className="project-meta"><div><p>{category}</p><h3>{name}</h3></div><p>{copy}</p><a href="#enquiry"><Arrow /></a></div>
        </article>)}
      </div>
    </section>

    <section className="process" id="process">
      <SectionIntro label="HOW WE WORK" title="FROM IDEA TO ONLINE." copy="A simple process designed to take your idea from the first conversation to a website that is ready for the world." />
      <div className="process-list">
        {process.map(([n, title, lead, copy]) => <article className="process-row reveal" key={n}><span>{n}</span><h3>{title}</h3><div><b>{lead}</b><p>{copy}</p></div></article>)}
      </div>
      <div className="process-flow reveal">IDEA <span>→</span> DESIGN <span>→</span> DEVELOP <span>→</span> TEST <span>→</span> LAUNCH</div>
    </section>

    <section className="why">
      <SectionIntro label="WHY WORK WITH US?" title="YOUR WEBSITE SHOULD WORK AS HARD AS YOU DO." />
      <div className="reason-grid">
        {reasons.map(([n, title, lead, copy]) => <article className="reason reveal" key={n}><span>{n}</span><h3>{title}</h3><b>{lead}</b><p>{copy}</p></article>)}
      </div>
    </section>

    <section className="testimonials">
      <div><Label>CLIENT STORIES</Label><h2 className="display reveal">WHAT<br />CLIENTS SAY.</h2></div>
      <div className="quote reveal">
        <span className="quote-mark">“</span>
        <blockquote>{quotes[quote][0]}</blockquote>
        <div className="quote-bottom"><p><b>{quotes[quote][1]}</b><span>{quotes[quote][2]}</span></p><div><button onClick={() => setQuote((quote + 1) % 2)}>←</button><button onClick={() => setQuote((quote + 1) % 2)}>→</button></div></div>
      </div>
    </section>

    <section className="pricing">
      <SectionIntro label="START YOUR PROJECT" title="CHOOSE YOUR STARTING POINT." copy="Every business is different. Start with what you need and we'll build from there." />
      <div className="price-grid">
        {[
          ["STARTER", "FOR SMALL BUSINESSES", ["Custom landing page", "Responsive design", "Contact form", "Basic SEO", "Deployment"]],
          ["GROWTH", "FOR GROWING BUSINESSES", ["Multi-page website", "Custom UI/UX", "Premium animations", "SEO setup", "Analytics", "Deployment"]],
          ["CUSTOM", "FOR UNIQUE REQUIREMENTS", ["Fully custom design", "Advanced interactions", "Custom functionality", "Third-party integrations", "Priority support"]],
        ].map(([name, label, features], i) => <article className={`price-card reveal ${i === 1 ? "featured" : ""}`} key={name as string}>
          {i === 1 && <span className="badge">POPULAR</span>}<p>{label as string}</p><h3>{name as string}</h3>
          <ul>{(features as string[]).map((f) => <li key={f}><span>+</span>{f}</li>)}</ul><CTA light={i !== 1}>{i === 2 ? "DISCUSS YOUR PROJECT" : `START WITH ${name}`}</CTA>
        </article>)}
      </div>
    </section>

    <section className="pre-cta">
      <p>YOUR IDEA / OUR CRAFT</p>
      <h2 className="reveal">READY TO BUILD<br />SOMETHING <em>GREAT?</em></h2>
      <p>Tell us what you're building. We'll take it from idea to launch.</p>
      <CTA>START YOUR PROJECT</CTA><small>NO PRESSURE. JUST TELL US ABOUT YOUR IDEA.</small>
    </section>

    <section className="enquiry" id="enquiry">
      <div className="enquiry-intro"><Label>START YOUR PROJECT</Label><h2 className="display reveal">LET'S BUILD<br />YOUR WEBSITE.</h2><p>Tell us a little about your project. We'll review your requirements and get back to you.</p></div>
      <EnquiryForm />
    </section>

    <section className="final-cta">
      <div className="asterisk">✳</div>
      <p>LET'S BUILD SOMETHING WORTH REMEMBERING.</p>
      <h2>YOUR NEXT WEBSITE<br /><i>STARTS HERE.</i></h2>
      <p>You have the idea. We have the tools to bring it to life.</p>
      <CTA>START YOUR PROJECT</CTA>
    </section>

    <footer>
      <h2>LET'S BUILD SOMETHING<br />WORTH REMEMBERING.</h2>
      <div className="footer-grid">
        <div><b>NAVIGATE</b>{[...nav, "CONTACT"].map((x) => <a href={x === "CONTACT" ? "#enquiry" : `#${x.toLowerCase()}`} key={x}>{x}</a>)}</div>
        <div>
          <b>SOCIAL</b>
          <a href="https://www.instagram.com/mastermadhesh?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a>
          <a href="https://www.linkedin.com/in/madheshi/?isSelfProfile=true" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>
        </div>
        <div>
          <b>CONTACT</b>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=madheshsec@gmail.com" target="_blank" rel="noopener noreferrer">EMAIL: madheshsec@gmail.com ↗</a>
        </div>
      </div>
      <div className="footer-bottom"><a className="logo" href="#top">D3 STUDIO<span>®</span></a><p>© 2026 D3 STUDIO. ALL RIGHTS RESERVED.</p><p>PRIVACY POLICY &nbsp; TERMS</p></div>
    </footer>
  </main>;
}
