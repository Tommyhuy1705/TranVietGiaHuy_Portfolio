import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import "./App.css";
import {
  articles,
  credentials,
  education,
  experience,
  honorsAwards,
  profile,
  projects,
  skills,
} from "./data/portfolioData";

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const height =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setProgress(Math.min(1, Math.max(0, window.scrollY / height)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

function Reveal({ children, className = "" }) {
  const [node, setNode] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return undefined;
    const fallback = window.setTimeout(() => setVisible(true), 900);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [node]);

  return (
    <div
      ref={setNode}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" />
        </svg>
      )}
    </button>
  );
}

function Header({ theme, onThemeToggle }) {
  const progress = useScrollProgress();
  return (
    <>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
      />
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Home">
          {profile.initials}.
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="/#">Home</a>
          <a href="/#about">About</a>
          <a href="/#skills">Skills</a>
          <a href="/#projects">Projects</a>
          <a href="/#experience">Experience</a>
        </nav>
        <div className="nav-actions">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <a className="nav-cta" href={`mailto:${profile.email}`}>
            Let's Talk
            <span
              className="iconify"
              data-icon="lucide:arrow-right"
              aria-hidden="true"
            />
          </a>
        </div>
      </header>
    </>
  );
}

function SectionHeading({ eyebrow, title, accent, children }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>
        {title} <span>{accent}</span>
      </h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="hero-portrait" aria-label="Profile visual">
      <div className="portrait-ring">
        <div className="portrait-core">
          <img src={profile.photo} alt={`${profile.name} profile`} />
        </div>
      </div>
      <div className="portrait-orbit portrait-orbit-a" />
      <div className="portrait-orbit portrait-orbit-b" />
    </div>
  );
}

function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = profile.rotating[phraseIndex];
    const isComplete = typedText === phrase;
    const isEmpty = typedText === "";
    const delay = isComplete && !isDeleting ? 1300 : isDeleting ? 32 : 58;

    const timeout = window.setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (isEmpty && isDeleting) {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % profile.rotating.length);
        return;
      }

      const nextLength = typedText.length + (isDeleting ? -1 : 1);
      setTypedText(phrase.slice(0, nextLength));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [phraseIndex, typedText, isDeleting]);

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Hello, I am</span>
        <h1>
          Tran Viet <span>Gia Huy</span>
        </h1>
        <p className="hero-nickname">(Tommy)</p>
        <p className="hero-role">{profile.role}</p>
        <p className="rotating-text" aria-live="polite">
          {typedText}
          <span className="typing-cursor" aria-hidden="true" />
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            View My Work
          </a>
          <Link className="secondary-button" to="/resume">
            <span
              className="iconify"
              data-icon="lucide:clipboard-list"
              aria-hidden="true"
            />
            Resume
          </Link>
        </div>
        <div className="social-row">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <span
              className="iconify"
              data-icon="mdi:github"
              aria-hidden="true"
            />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <span
              className="iconify"
              data-icon="mdi:linkedin"
              aria-hidden="true"
            />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email">
            <span
              className="iconify"
              data-icon="lucide:mail"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
      <HeroVisual />
      <div className="hero-stats">
        {profile.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <span className="scroll-cue">Scroll</span>
    </section>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <Reveal>
        <SectionHeading
          eyebrow="About me"
          title="Engineering"
          accent="Data Solutions"
        />
        <div className="about-card">
          {profile.about.map((paragraph, index) => (
            <p key={`about-${index}`}>
              {Array.isArray(paragraph)
                ? paragraph.map((part, partIndex) =>
                    part.strong ? (
                      <strong key={`about-${index}-${partIndex}`}>
                        {part.text}
                      </strong>
                    ) : (
                      <React.Fragment key={`about-${index}-${partIndex}`}>
                        {part.text}
                      </React.Fragment>
                    )
                  )
                : paragraph}
            </p>
          ))}
          <span className="availability">
            Available for Data Analyst and Data Engineer opportunities
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function Skills() {
  return (
    <section className="section alt-section" id="skills">
      <Reveal>
        <SectionHeading eyebrow="Skills" title="Technical" accent="Expertise">
          Specialized across analytics, engineering, BI, and applied AI tooling.
        </SectionHeading>
        <div className="skill-divider">
          <span>Core Expertise</span>
        </div>
        <div className="core-skill-grid">
          {skills.core.map((skill) => (
            <article className="feature-card" key={skill.title}>
              <div className="core-skill-head">
                <span
                  className="tool-icon core-icon iconify"
                  data-icon={skill.icon}
                  style={{ color: skill.color }}
                />
                <div>
                  <div className="card-topline">
                    <span>{skill.eyebrow}</span>
                    <b>{skill.badge}</b>
                  </div>
                  <h3>{skill.title}</h3>
                </div>
              </div>
              <p>{skill.description}</p>
              <div className="tag-row">
                {skill.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="skill-divider supporting-divider">
          <span>Supporting Technologies</span>
        </div>
        <div className="support-grid">
          {skills.supporting.map((group) => (
            <article className="mini-card" key={group.title}>
              <h3>
                <span
                  className="tool-icon group-icon iconify"
                  data-icon={group.icon}
                />
                {group.title}
              </h3>
              <div className="tool-grid">
                {group.items.map((item) => (
                  <div className="tool-cell" key={item.name}>
                    <span
                      className="tool-icon iconify"
                      data-icon={item.icon}
                      style={{ color: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Experience() {
  return (
    <section className="section" id="experience">
      <Reveal>
        <SectionHeading eyebrow="Experience" title="Career" accent="Journey" />
        <div className="timeline-grid">
          {experience.map((item) => (
            <article
              className="timeline-card"
              key={`${item.company}-${item.role}`}
            >
              <div className="timeline-meta">
                <span>{item.company}</span>
                <b>{item.period}</b>
              </div>
              <h3>{item.role}</h3>
              <p className="muted">{item.meta}</p>
              <p>{item.description}</p>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="tag-row">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ProjectVisual({ project }) {
  if (project.image) {
    return <img src={project.image} alt={`${project.title} preview`} />;
  }

  if (project.visual === "agent") {
    return (
      <div className="abstract-visual agent-visual">
        <div className="agent-node">LLM</div>
        <div className="agent-line" />
        <div className="agent-panel">
          <span>Text-to-SQL</span>
          <strong>SSE Stream</strong>
          <span>dbt Mart</span>
        </div>
        <div className="agent-node small">AWS</div>
      </div>
    );
  }

  if (project.visual === "warehouse") {
    return (
      <div className="abstract-visual warehouse-visual">
        <div className="warehouse-layer">Raw CSV</div>
        <div className="warehouse-layer">Star Schema</div>
        <div className="warehouse-layer">API + BI</div>
        <div className="warehouse-orbit" />
      </div>
    );
  }

  if (project.visual === "saas") {
    return (
      <div className="abstract-visual saas-visual">
        <div className="saas-window">
          <span />
          <strong>Tenant CRM</strong>
          <b>SMS + Email</b>
        </div>
        <div className="saas-badge">AWS</div>
      </div>
    );
  }

  if (project.visual === "cell") {
    return (
      <div className="abstract-visual cell-visual">
        <div className="cell-scope">
          <span />
          <span />
          <span />
          <b>YOLOv8</b>
        </div>
        <div className="cell-score">R2 0.92</div>
      </div>
    );
  }

  if (project.visual === "nlp") {
    return (
      <div className="abstract-visual nlp-visual">
        <div className="entity-card">LOC</div>
        <div className="relation-line" />
        <div className="entity-card price">PRICE</div>
        <div className="nlp-caption">PhoBERT IE</div>
      </div>
    );
  }

  return (
    <div className="abstract-visual signature-visual">
      <div className="signature-paper">
        <span />
        <span />
        <b>verify</b>
      </div>
      <div className="signature-score">AUC 0.9467</div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-image">
        <ProjectVisual project={project} />
      </div>
      <div className="project-body">
        <span className="project-category">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row compact">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Link to={`/projects/${project.slug}`} className="text-link">
          View Case Study
        </Link>
      </div>
    </article>
  );
}

function Projects() {
  const roleOptions = [
    "Business Data Analyst",
    "Data Engineering",
    "Scientific Research",
  ];
  const [activeRole, setActiveRole] = useState(roleOptions[0]);
  const visibleProjects = projects.filter((project) =>
    project.roles.includes(activeRole)
  );

  return (
    <section className="section alt-section" id="projects">
      <Reveal>
        <SectionHeading eyebrow="Projects" title="Featured" accent="Work">
          Choose the work samples that best match the role you are targeting.
        </SectionHeading>
        <div
          className="role-tabs"
          role="tablist"
          aria-label="Project role filter"
        >
          {roleOptions.map((role) => (
            <button
              type="button"
              className={activeRole === role ? "active" : ""}
              onClick={() => setActiveRole(role)}
              key={role}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Credentials() {
  return (
    <section className="section">
      <Reveal>
        <SectionHeading
          eyebrow="Certifications"
          title="Verified"
          accent="Credentials"
        />
        <div className="credential-grid">
          {credentials.map((item) => {
            const Wrapper = item.link ? "a" : "article";
            return (
              <Wrapper
                className="credential-card"
                href={item.link}
                target={item.link ? "_blank" : undefined}
                rel={item.link ? "noopener noreferrer" : undefined}
                key={item.title}
              >
                <span>{item.issuer}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Wrapper>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function HonorsAwards() {
  return (
    <section className="section alt-section">
      <Reveal>
        <SectionHeading
          eyebrow="Recognition"
          title="Honors and"
          accent="Awards"
        />
        <div className="credential-grid">
          {honorsAwards.map((item) => (
            <article className="credential-card" key={item.title}>
              <span>{item.issuer}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Education() {
  return (
    <section className="section alt-section">
      <Reveal>
        <SectionHeading
          eyebrow="Education"
          title="Academic"
          accent="Background"
        />
        <div className="education-card">
          <span>{education.location}</span>
          <h3>{education.degree}</h3>
          <p>{education.school}</p>
          <div className="education-meta">
            <b>{education.period}</b>
            <b>GPA {education.gpa}</b>
            <b>{education.language}</b>
          </div>
          <div className="tag-row">
            {education.coursework.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Articles() {
  return (
    <section className="section">
      <Reveal>
        <SectionHeading eyebrow="Blog" title="Latest" accent="Articles">
          Short notes that turn project work into reusable thinking.
        </SectionHeading>
        <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.title}>
              <span>{article.readTime}</span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <div className="tag-row compact">
                {article.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  return (
    <section className="section alt-section" id="contact">
      <Reveal>
        <SectionHeading eyebrow="Contact" title="Let's" accent="Connect">
          Have a data role, analytics project, or collaboration in mind? I would
          love to hear from you.
        </SectionHeading>
        <div className="contact-card">
          <form
            action={`mailto:${profile.email}`}
            method="post"
            encType="text/plain"
          >
            <label>
              Full Name
              <input name="name" type="text" placeholder="Your name" />
            </label>
            <label>
              Email Address
              <input
                name="email"
                type="email"
                placeholder="your.email@example.com"
              />
            </label>
            <label>
              Inquiry Type
              <select name="type" defaultValue="">
                <option value="" disabled>
                  Select inquiry type
                </option>
                <option>Job / Recruitment</option>
                <option>Freelance Project</option>
                <option>Collaboration</option>
                <option>General Inquiry</option>
              </select>
            </label>
            <label>
              Message
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                rows="5"
              />
            </label>
            <button type="submit" className="primary-button">
              Send Message
            </button>
          </form>
          <div className="contact-details">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span>{profile.phone}</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Credentials />
      <HonorsAwards />
      <Education />
      <Articles />
      <Contact />
    </main>
  );
}

function MetricStrip({ metrics }) {
  return (
    <div className="detail-metrics">
      {metrics.map((metric) => (
        <div className="stat" key={`${metric.value}-${metric.label}`}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </div>
  );
}

function Phase({ number, label, title, children }) {
  return (
    <Reveal className="phase">
      <div className="phase-marker">
        <strong>{number}</strong>
        <span>{label}</span>
      </div>
      <div className="phase-content">
        <h2>{title}</h2>
        {children}
      </div>
    </Reveal>
  );
}

function ProjectDetailPage() {
  const { slug } = useParams();
  const project = useMemo(() => projects.find((item) => item.slug === slug), [
    slug,
  ]);

  if (!project) {
    return (
      <main className="detail-page">
        <section className="project-hero">
          <Link to="/#projects" className="text-link">
            View all projects
          </Link>
          <h1>Project not found</h1>
          <p>The requested case study is not available.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <section className="project-hero">
        <div className="detail-actions">
          <Link to="/#projects" className="text-link">
            View all projects
          </Link>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            GitHub Repo
          </a>
        </div>
        <span className="project-category">{project.category}</span>
        <h1>{project.title}</h1>
        <p>{project.subtitle}</p>
        <MetricStrip metrics={project.metrics} />
        <div className="tag-row center">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      <Phase number="1" label="Phase 1" title="The Challenge">
        <p>{project.challenge}</p>
        <div className="insight-grid">
          {project.pains.map((pain) => (
            <article className="mini-card problem-card" key={pain}>
              <span className="problem-icon">!</span>
              <p>{pain}</p>
            </article>
          ))}
        </div>
      </Phase>

      <Phase number="2" label="Phase 2" title="The Solution">
        <p>{project.solution}</p>
        <div className="step-list">
          {project.steps.map((step, index) => (
            <article className="step-card" key={step}>
              <span>
                Step {index + 1}/{project.steps.length}
              </span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </Phase>

      <Phase number="3" label="Phase 3" title="Solution Architecture">
        <div className="architecture-flow">
          {project.architecture.map((item) => (
            <div className="flow-node" key={item}>
              {item}
            </div>
          ))}
        </div>
        <div className="before-after">
          <article>
            <h3>Before</h3>
            <ul>
              {project.before.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>After</h3>
            <ul>
              {project.after.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </Phase>

      <Phase number="4" label="Phase 4" title="Technical Implementation">
        {project.gallery ? (
          <div className="gallery-grid">
            {project.gallery.map((image) => (
              <img src={image} alt={`${project.title} artifact`} key={image} />
            ))}
          </div>
        ) : (
          <div className="detail-visual">
            <ProjectVisual project={project} />
          </div>
        )}
        <div className="spec-grid">
          {project.technical.map(([key, value]) => (
            <article className="spec-card" key={key}>
              <span>{key}</span>
              <p>{value}</p>
            </article>
          ))}
        </div>
      </Phase>

      <Phase number="5" label="Phase 5" title="Results & Impact">
        <div className="outcome-grid">
          <article className="feature-card">
            <h3>Business Outcomes</h3>
            <ul>
              {project.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="feature-card">
            <h3>Acceptance Criteria Met</h3>
            <ul>
              {project.acceptance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="detail-bottom">
          <Link to="/#projects" className="secondary-button">
            View All Projects
          </Link>
        </div>
      </Phase>
    </main>
  );
}

function ResumePage() {
  return (
    <main className="resume-page-shell">
      <section className="resume-hero">
        <Link to="/" className="text-link">
          Back to Home
        </Link>
        <h1>Resume</h1>
        <p>
          {profile.role} with hands-on projects in analytics, BI, data
          engineering, and research.
        </p>
        <a
          className="primary-button"
          href={profile.resume}
          download="TranVietGiaHuy_Resume.pdf"
        >
          Download Resume
        </a>
      </section>
      <section className="resume-preview-card">
        <h2>Resume Preview</h2>
        <iframe
          title="Tran Viet Gia Huy Resume Preview"
          src={profile.resume}
          className="resume-frame"
        />
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 {profile.name} · Crafted with Data</span>
      <div className="footer-links">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <span className="iconify" data-icon="mdi:github" aria-hidden="true" />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <span
            className="iconify"
            data-icon="mdi:linkedin"
            aria-hidden="true"
          />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email">
          <span
            className="iconify"
            data-icon="lucide:mail"
            aria-hidden="true"
          />
        </a>
      </div>
    </footer>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("portfolio-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter basename="/">
      <div className="app-shell">
        <Header theme={theme} onThemeToggle={toggleTheme} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/resume" component={ResumePage} />
          <Route path="/projects/:slug" component={ProjectDetailPage} />
          <Route path="*" component={HomePage} />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
