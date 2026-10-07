import { FormEvent, useEffect, useRef, useState } from "react";

const services = [
  ["01", "BUSINESS WEBSITES", "Professional websites designed to build trust, showcase your business and turn visitors into enquiries."],
  ["02", "E-COMMERCE WEBSITES", "Beautiful online stores designed to make products easy to discover, trust and buy."],
  ["03", "LANDING PAGES", "Focused, high-converting pages designed around one clear goal."],
  ["04", "PORTFOLIO WEBSITES", "Personal websites that turn your work, skills and identity into a powerful digital presence."],
  ["05", "WEB APPLICATIONS", "Custom web experiences built for ideas that need more than a traditional website."],
  ["06", "CUSTOM WEBSITES", "No templates. No limitations. Completely custom digital experiences designed from scratch."],
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    if (topRef.current) {
      const rect = topRef.current.getBoundingClientRect();
      if (rect.top < 60 || rect.top > 320) {
        const targetY = window.scrollY + rect.top - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      }
    }
  };

  const update = (key: string, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setValidationError("");
  };

  const choose = (key: string, value: string) => update(key, value);

  const go = (nextStep: number) => {
    setStep(nextStep);
    setFieldErrors({});
    setValidationError("");
    scrollToForm();
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

  const input = (key: string, placeholder: string, type = "text", required = true) => (
    <input
      type={type}
      required={required}
      aria-required={required}
      className={fieldErrors[key] ? "input-error" : ""}
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
      if (!data.industry?.trim()) errs.industry = "Please specify your industry.";
      if (!data.businessOverview?.trim()) errs.businessOverview = "Please tell us what your business does.";
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

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setValidationError("Please fill in all required fields marked with * to continue.");
      scrollToForm();
      return false;
    }
    setValidationError("");
    return true;
  }

  const next = () => {
    if (validateStep(step)) {
      go(Math.min(6, step + 1));
    }
  };

  const back = () => {
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
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          name: data.name || "",
          brand: data.brand || "",
          industry: data.industry || "",
          businessOverview: data.businessOverview || "",
          websiteType: data.websiteType || "",
          goals: data.goals || "",
          existingWebsite: data.existingWebsite || "",
          domain: data.domain || "",
          style: data.style || "",
          inspiration: data.inspiration || "",
          budget: data.budget || "",
          timeline: data.timeline || "",
          email: data.email || "",
          phone: data.phone || "",
          contactMethod: data.contactMethod || "",
        }),
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
        <button
          className="cta"
          type="button"
          onClick={() => {
            setData({});
            setFieldErrors({});
            setValidationError("");
            setStatus("idle");
            setStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span>BACK TO HOME</span><Arrow />
        </button>
      </div>
    );
  }

  return (
    <form className="project-form" onSubmit={submit} noValidate>
      <div className="form-top" ref={topRef}>
        <div>
          <p className="step-label">PROJECT BRIEF</p>
          <p className="progress">0{step} <span>/ 06</span></p>
        </div>
        <p className="required-note"><span>*</span> REQUIRED</p>
        <div className="progress-track"><i style={{ width: `${(step / 6) * 100}%` }} /></div>
      </div>

      {step === 1 && <div className="form-step">
        <h3>FIRST, TELL US<br />ABOUT YOU.</h3>
        <label>What's your name? <sup>*</sup>
          {input("name", "Enter your name")}
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </label>
        <label>What's your business or brand name? <sup>*</sup>
          {input("brand", "Enter your business / brand name")}
          {fieldErrors.brand && <span className="field-error">{fieldErrors.brand}</span>}
        </label>
        <label>What industry are you in? <sup>*</sup>
          {input("industry", "For example: Technology, fashion, hospitality...")}
          {fieldErrors.industry && <span className="field-error">{fieldErrors.industry}</span>}
        </label>
        <label>What does your business do? <sup>*</sup>
          <textarea
            required
            aria-required="true"
            className={fieldErrors.businessOverview ? "input-error" : ""}
            value={data.businessOverview || ""}
            onChange={(e) => update("businessOverview", e.target.value)}
            placeholder="Give us a short introduction to your business, audience and what you offer..."
          />
          {fieldErrors.businessOverview && <span className="field-error">{fieldErrors.businessOverview}</span>}
        </label>
        {validationError && <p className="validation-error">{validationError}</p>}
        <button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button>
      </div>}

      {step === 2 && <div className="form-step">
        <h3>WHAT ARE WE<br />BUILDING?</h3>
        <label>What type of website do you need? <sup>*</sup></label>
        {options("websiteType", ["BUSINESS WEBSITE", "E-COMMERCE", "PORTFOLIO", "LANDING PAGE", "WEB APPLICATION", "OTHER"])}
        {fieldErrors.websiteType && <span className="field-error">{fieldErrors.websiteType}</span>}
        {validationError && <p className="validation-error">{validationError}</p>}
        <div className="form-actions">
          <button type="button" onClick={back}>← BACK</button>
          <button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button>
        </div>
      </div>}

      {step === 3 && <div className="form-step">
        <h3>TELL US ABOUT<br />YOUR PROJECT.</h3>
        <label>What do you want your website to achieve? <sup>*</sup>
          <textarea
            required
            aria-required="true"
            className={fieldErrors.goals ? "input-error" : ""}
            value={data.goals || ""}
            onChange={(e) => update("goals", e.target.value)}
            placeholder="Tell us about your business, your idea and what you want your website to achieve..."
          />
          {fieldErrors.goals && <span className="field-error">{fieldErrors.goals}</span>}
        </label>
        <label>Do you already have a website? <sup>*</sup></label>
        {options("existingWebsite", ["YES", "NO"])}
        {fieldErrors.existingWebsite && <span className="field-error">{fieldErrors.existingWebsite}</span>}
        <label>Do you already have a domain? <sup>*</sup></label>
        {options("domain", ["YES", "NO", "NOT SURE"])}
        {fieldErrors.domain && <span className="field-error">{fieldErrors.domain}</span>}
        {validationError && <p className="validation-error">{validationError}</p>}
        <div className="form-actions">
          <button type="button" onClick={back}>← BACK</button>
          <button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button>
        </div>
      </div>}

      {step === 4 && <div className="form-step">
        <h3>WHAT SHOULD IT<br />LOOK LIKE?</h3>
        <label>What style are you looking for? <sup>*</sup></label>
        {options("style", ["MINIMAL", "MODERN", "PREMIUM", "BOLD", "COLORFUL", "DARK", "NOT SURE"])}
        {fieldErrors.style && <span className="field-error">{fieldErrors.style}</span>}
        <label>
          Do you have any websites you like? <span className="optional-label">OPTIONAL</span>
          {input("inspiration", "Paste website links for inspiration", "text", false)}
        </label>
        <p className="field-note">Don't worry if you don't have any. We can help define the visual direction.</p>
        {validationError && <p className="validation-error">{validationError}</p>}
        <div className="form-actions">
          <button type="button" onClick={back}>← BACK</button>
          <button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button>
        </div>
      </div>}

      {step === 5 && <div className="form-step">
        <h3>LET'S TALK ABOUT<br />YOUR PLAN.</h3>
        <label>What's your approximate budget? <sup>*</sup></label>
        {options("budget", ["UNDER ₹10K", "₹10K – ₹25K", "₹25K – ₹50K", "₹50K+", "NOT DECIDED"])}
        {fieldErrors.budget && <span className="field-error">{fieldErrors.budget}</span>}
        <label>When do you want your website? <sup>*</sup></label>
        {options("timeline", ["ASAP", "1–2 WEEKS", "1 MONTH", "FLEXIBLE"])}
        {fieldErrors.timeline && <span className="field-error">{fieldErrors.timeline}</span>}
        {validationError && <p className="validation-error">{validationError}</p>}
        <div className="form-actions">
          <button type="button" onClick={back}>← BACK</button>
          <button className="form-next" type="button" onClick={next}>NEXT <Arrow /></button>
        </div>
      </div>}

      {step === 6 && <div className="form-step">
        <h3>WHERE CAN WE<br />REACH YOU?</h3>
        <label>What's your email? <sup>*</sup>
          {input("email", "you@example.com", "email")}
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>What's your phone / WhatsApp number? <sup>*</sup>
          {input("phone", "+91 XXXXX XXXXX", "tel")}
          {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
        </label>
        <label>How would you like us to contact you? <sup>*</sup></label>
        {options("contactMethod", ["WHATSAPP", "PHONE CALL", "EMAIL"])}
        {fieldErrors.contactMethod && <span className="field-error">{fieldErrors.contactMethod}</span>}
        {validationError && <p className="validation-error">{validationError}</p>}
        {status === "error" && <p className="form-error">{errorMessage || "Something went wrong. Please try again."}</p>}
        <div className="form-actions">
          <button type="button" onClick={back}>← BACK</button>
          <button className="form-next" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "SENDING..." : "SUBMIT MY PROJECT"} <Arrow />
          </button>
        </div>
        <p className="privacy">Your information is only used to contact you about your project.</p>
      </div>}
    </form>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const nav = ["SERVICES", "ABOUT", "WHY US"];

  const handleInternalNavigation = (event: React.MouseEvent<HTMLElement>) => {
    const anchor = (event.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;
    const id = href.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setMenuOpen(false);
    const top = target.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const getNavTarget = (item: string) => {
    if (item === "WHY US") return "why";
    return item.toLowerCase();
  };

  return (
    <main id="top" onClick={handleInternalNavigation}>
      <header className={scrolled ? "scrolled" : ""}>
        <a className="logo" href="#top">D3 STUDIO<span>®</span></a>
        <nav>
          {nav.map((item) => (
            <a key={item} href={`#${getNavTarget(item)}`}>{item}</a>
          ))}
        </nav>
        <a className="nav-cta" href="#enquiry">START A PROJECT <Arrow /></a>
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          {nav.map((item) => (
            <a key={item} href={`#${getNavTarget(item)}`}>{item}</a>
          ))}
          <a href="#enquiry">START A PROJECT ↗</a>
        </div>
      )}

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
          <div className="hero-actions">
            <CTA>START YOUR PROJECT</CTA>
            <a className="text-link" href="#services">EXPLORE SERVICES ↓</a>
          </div>
        </div>
        <div className="hero-art">
          <div className="showcase-label">
            <span>INTERACTIVE PREVIEW</span>
            <b>D3 / 001</b>
          </div>
          <div className="browser">
            <div className="browser-bar">
              <span /><span /><span />
              <b>D3 STUDIO — DIGITAL WORKSHOP / 2026</b>
            </div>
            <div className="browser-content">
              <div className="mock-grid" />
              <div className="mock-nav">
                <b>D3/®</b>
                <span>SELECTED EXPERIMENT — 001</span>
                <i>LIVE</i>
              </div>
              <div className="mock-copy">
                <small>DIGITAL EXPERIENCES FOR AMBITIOUS PEOPLE</small>
                <strong>IDEAS<br /><em>IN MOTION.</em></strong>
                <p>Strategy, identity and technology moving in the same direction.</p>
              </div>
              <div className="motion-object">
                <span>D3</span>
                <i /><i /><i />
              </div>
              <div className="stage-stack">
                <span><b>01</b> DESIGN</span>
                <span><b>02</b> DEVELOP</span>
                <span><b>03</b> DEPLOY</span>
              </div>
              <div className="mock-cursor">VIEW<br />PROJECT ↗</div>
            </div>
          </div>
          <div className="float-tag">DESIGN.<br />DEVELOP. DEPLOY.</div>
        </div>
      </section>

      <div className="ticker">
        <div>WE BUILD WEBSITES THAT BUILD BUSINESSES — WE BUILD WEBSITES THAT BUILD BUSINESSES — </div>
      </div>

      <section className="trust" id="about">
        <SectionIntro
          label="TRUSTED BY AMBITIOUS BUSINESSES"
          title="BUILT FOR BUSINESSES THAT WANT TO STAND OUT."
          copy="We combine strategy, design and technology to create digital experiences that make businesses look credible, modern and memorable."
        />
        <div className="stats">
          {[
            ["50+", "WEBSITES LAUNCHED"],
            ["30+", "BUSINESSES SERVED"],
            ["10+", "INDUSTRIES"],
            ["99%", "CLIENT SATISFACTION"],
          ].map(([n, l]) => (
            <div className="stat reveal" key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="services" id="services">
        <SectionIntro
          label="WHAT WE BUILD"
          title="WE DON'T JUST BUILD WEBSITES. WE BUILD DIGITAL EXPERIENCES."
          copy="From focused landing pages to complete digital platforms, we create websites around your business, your audience and your goals."
        />
        <div className="service-list">
          {services.map(([n, title, copy]) => (
            <article className="service reveal" key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#enquiry">EXPLORE <Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="why" id="why">
        <SectionIntro
          label="WHY WORK WITH US?"
          title="YOUR WEBSITE SHOULD WORK AS HARD AS YOU DO."
        />
        <div className="reason-grid">
          {reasons.map(([n, title, lead, copy]) => (
            <article className="reason reveal" key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <b>{lead}</b>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="enquiry" id="enquiry">
        <div className="enquiry-intro">
          <Label>START YOUR PROJECT</Label>
          <h2 className="display reveal">LET'S BUILD<br />YOUR WEBSITE.</h2>
          <p>Tell us a little about your project. We'll review your requirements and get back to you.</p>
          <div className="project-signal reveal">
            <div className="signal-top">
              <span><i /> ACCEPTING NEW PROJECTS</span>
              <b>2026</b>
            </div>
            <strong>GOOD IDEAS<br />START HERE.</strong>
            <div className="signal-orbit"><span>D3</span></div>
          </div>
          <div className="next-steps reveal">
            <p>WHAT HAPPENS NEXT</p>
            <ol>
              <li><span>01</span><div><b>WE REVIEW YOUR BRIEF</b><small>We study your goals, scope and requirements.</small></div></li>
              <li><span>02</span><div><b>WE GET IN TOUCH</b><small>Expect a personal reply within one business day.</small></div></li>
              <li><span>03</span><div><b>WE PLAN THE PROJECT</b><small>Clear scope, timeline and next steps. No pressure.</small></div></li>
            </ol>
          </div>
          <div className="response-note">
            <b>USUALLY REPLIES IN 24 HOURS</b>
            <span>YOUR DETAILS STAY PRIVATE</span>
          </div>
        </div>
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
          <div>
            <b>NAVIGATE</b>
            {[...nav, "CONTACT"].map((x) => {
              const target = x === "CONTACT" ? "enquiry" : getNavTarget(x);
              return <a href={`#${target}`} key={x}>{x}</a>;
            })}
          </div>
          <div>
            <b>SOCIAL</b>
            <a
              href="https://www.instagram.com/mastermadhesh?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              INSTAGRAM ↗
            </a>
            <a
              href="https://www.linkedin.com/in/madheshi/?isSelfProfile=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              LINKEDIN ↗
            </a>
          </div>
          <div>
            <b>CONTACT</b>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=madheshsec@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              EMAIL: madheshsec@gmail.com ↗
            </a>
            <a href="#enquiry">START AN ENQUIRY ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <a className="logo" href="#top">D3 STUDIO<span>®</span></a>
          <p>© 2026 D3 STUDIO. ALL RIGHTS RESERVED.</p>
          <p>PRIVACY POLICY &nbsp; TERMS</p>
        </div>
      </footer>
    </main>
  );
}
