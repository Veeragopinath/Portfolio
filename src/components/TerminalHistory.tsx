import React, { useState } from 'react';


// 1. JSON Viewer for skills.json
export const JSONViewer: React.FC = () => {
  const skillsData = {
    programming: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3 / Sass'],
    clientSide: ['React.js', 'Vue.js (Vue 3)', 'Nuxt.js', 'Redux Toolkit', 'Pinia'],
    backEnd: ['Node.js', 'Express.js', 'SQL / PostgreSQL', 'Sequelize ORM'],
    testingQA: ['Vitest', 'Playwright', 'Cypress', 'Jest'],
    architecture: ['REST APIs', 'Microservices', 'System Design', 'SOLID Principles']
  };

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", color: 'var(--text-secondary)' }}>
      <span className="highlight-bracket">{'{'}</span>
      <div style={{ paddingLeft: '20px' }}>
        {Object.entries(skillsData).map(([key, list], index, arr) => (
          <div key={key}>
            <span className="highlight-key">"{key}"</span><span className="highlight-bracket">:</span> <span className="highlight-bracket">[</span>
            <div style={{ paddingLeft: '20px' }}>
              {list.map((item, i) => (
                <span key={item}>
                  <span className="highlight-val">"{item}"</span>
                  {i < list.length - 1 && <span className="highlight-bracket">, </span>}
                </span>
              ))}
            </div>
            <span className="highlight-bracket">]</span>
            {index < arr.length - 1 && <span className="highlight-bracket">,</span>}
          </div>
        ))}
      </div>
      <span className="highlight-bracket">{'}'}</span>
    </div>
  );
};

// 2. Markdown Viewer for experience.md
export const MarkdownViewer: React.FC = () => {
  const experience = [
    {
      date: 'April 2025 — Present',
      company: 'Optimum Info System Pvt Ltd',
      role: 'Senior Software Developer',
      bullets: [
        'Built full-stack UI & API systems for 20+ reusable components, earning Standard Chartered Bank renewals.',
        'Mentored 3 developers, reviewed 100+ PRs, and reduced production defects.'
      ]
    },
    {
      date: 'May 2024 — Feb 2025',
      company: 'Lobb Logistics',
      role: 'Software Development Engineer',
      bullets: [
        'Architected and implemented cargo dispatch boards using Vue 3 and Pinia.',
        'Improved UI load times and coverage using strict TDD guidelines.'
      ]
    },
    {
      date: 'Feb 2023 — May 2024',
      company: 'Phantom Smart Solutions',
      role: 'Software Developer',
      bullets: [
        'Co-led full-stack development scaling web applications for 100k+ MAU.',
        'Maintained 90%+ satisfaction rate through client requirement alignments.'
      ]
    },
    {
      date: 'Dec 2021 — Jan 2023',
      company: 'Wynwy Technologies',
      role: 'Junior Software Developer',
      bullets: [
        'Integrated API endpoints and customized React hook architectures.',
        'Resolved critical product tickets in collaboration with SDE leads.'
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '650px' }}>
      <div className="markdown-header"># WORK_EXPERIENCE_DISPATCHES.md</div>
      {experience.map((job, idx) => (
        <div key={idx} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--color-indigo)', fontWeight: 'bold' }}>
            <span>## {job.company}</span>
            <span>&mdash;</span>
            <span style={{ color: 'var(--color-green)' }}>{job.role}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Timeframe: {job.date}
          </div>
          <ul style={{ listStyle: 'none', paddingLeft: '14px', marginTop: '6px' }}>
            {job.bullets.map((b, i) => (
              <li key={i} style={{ position: 'relative', paddingLeft: '14px', marginBottom: '4px' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--color-cyan)' }}>-</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// 3. YAML Viewer for projects.yaml
export const YAMLViewer: React.FC<{ playHover: () => void }> = ({ playHover }) => {
  const projects = [
    {
      name: 'Smart Reporting Insight',
      tech: 'React, Node, SQL, Highcharts',
      img: './assets/project_smart_reporting.png',
      desc: 'Enterprise regulatory compliance reporting dashboards for Standard Chartered Bank.'
    },
    {
      name: 'Lobb Console',
      tech: 'Vue 3, TypeScript, Pinia',
      img: './assets/project_lobb_console.png',
      desc: 'Real-time cargo dispatcher map platform managing freight brokerage loads.'
    },
    {
      name: 'FINA-HQ',
      tech: 'React, Node, Zoho integration',
      img: './assets/project_fina_hq.png',
      desc: 'Corporate financial analytics sheet ledgers and document automation tools.'
    },
    {
      name: 'WATTAWOW',
      tech: 'Vue 3, Fabric.js, Leaflet',
      img: './assets/project_wattawow.png',
      desc: 'Cycling routes map tracker integrating rider statistics and safety stamps.'
    },
    {
      name: 'INCONN Console',
      tech: 'React, Redux, PostgreSQL',
      img: './assets/project_inconn.png',
      desc: 'Enterprise asset registers suite containing 70+ sheets tracking utilization logs.'
    }
  ];

  return (
    <div>
      <div style={{ color: 'var(--text-muted)', marginBottom: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        --- # featured_projects.yaml
      </div>
      <div className="terminal-project-grid">
        {projects.map((proj, idx) => (
          <div key={idx} className="terminal-project-card" onMouseEnter={playHover}>
            <div className="terminal-project-img-box">
              <img src={proj.img} alt={proj.name} className="terminal-project-img" />
              <span className="terminal-project-tech">{proj.tech}</span>
            </div>
            <div className="terminal-project-body">
              <h4 className="terminal-project-title">{proj.name}</h4>
              <p className="terminal-project-desc">{proj.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. XML Viewer for education.xml
export const XMLViewer: React.FC = () => {
  return (
    <div style={{ color: 'var(--text-secondary)' }}>
      <div>
        <span className="highlight-key">&lt;academic_records&gt;</span>
      </div>
      
      <div style={{ paddingLeft: '20px' }}>
        <div>
          <span className="highlight-key">&lt;degree</span> <span className="highlight-val">course</span>=<span className="highlight-num">"Bachelor of Engineering (B.E.)"</span>
        </div>
        <div style={{ paddingLeft: '20px' }}>
          <span className="highlight-val">institution</span>=<span className="highlight-num">"College of Engineering Guindy, Anna University"</span>
        </div>
        <div style={{ paddingLeft: '20px' }}>
          <span className="highlight-val">grade</span>=<span className="highlight-num">"CGPA 8.06/10"</span> <span className="highlight-key">/&gt;</span>
        </div>

        <div style={{ marginTop: '8px' }}>
          <span className="highlight-key">&lt;certificate</span> <span className="highlight-val">level</span>=<span className="highlight-num">"HSC"</span>
        </div>
        <div style={{ paddingLeft: '20px' }}>
          <span className="highlight-val">institution</span>=<span className="highlight-num">"Vasan Matric Hr Secondary School"</span>
        </div>
        <div style={{ paddingLeft: '20px' }}>
          <span className="highlight-val">score</span>=<span className="highlight-num">"93%"</span> <span className="highlight-key">/&gt;</span>
        </div>

        <div style={{ marginTop: '8px' }}>
          <span className="highlight-key">&lt;certificate</span> <span className="highlight-val">level</span>=<span className="highlight-num">"SSLC"</span>
        </div>
        <div style={{ paddingLeft: '20px' }}>
          <span className="highlight-val">institution</span>=<span className="highlight-num">"Vasan Matric Hr Secondary School"</span>
        </div>
        <div style={{ paddingLeft: '20px' }}>
          <span className="highlight-val">score</span>=<span className="highlight-num">"98%"</span> <span className="highlight-key">/&gt;</span>
        </div>
      </div>

      <div>
        <span className="highlight-key">&lt;/academic_records&gt;</span>
      </div>
    </div>
  );
};

// 5. Config Form Viewer for contact.cfg
export const ConfigFormViewer: React.FC<{ 
  onSubmit: (status: 'success' | 'error' | 'sending') => void; 
  playHover: () => void 
}> = ({
  onSubmit,
  playHover
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit('sending');

    const googleFormId = import.meta.env.VITE_GOOGLE_FORM_ID;
    const entryName = import.meta.env.VITE_GOOGLE_ENTRY_NAME;
    const entryEmail = import.meta.env.VITE_GOOGLE_ENTRY_EMAIL;
    const entryMsg = import.meta.env.VITE_GOOGLE_ENTRY_MSG;

    // 1. Check if Google Forms config is set
    if (googleFormId && entryName && entryEmail && entryMsg) {
      try {
        const formDataBody = new URLSearchParams();
        formDataBody.append(entryName, formData.name);
        formDataBody.append(entryEmail, formData.email);
        formDataBody.append(entryMsg, formData.message);

        // We use mode: 'no-cors' because Google Forms does not return CORS response headers.
        // It successfully registers the submission, and no-cors lets the fetch resolve instead of blocking.
        await fetch(`https://docs.google.com/forms/u/0/d/e/${googleFormId}/formResponse`, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formDataBody.toString()
        });

        // Since no-cors doesn't return response metadata, we assume success on completion
        setIsSubmitting(false);
        onSubmit('success');
        setFormData({ name: '', email: '', message: '' });
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        onSubmit('error');
      }
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE';
    
    // 2. Fall back to Web3Forms or simulation
    if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
      setTimeout(() => {
        setIsSubmitting(false);
        onSubmit('success');
        setFormData({ name: '', email: '', message: '' });
      }, 800);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: 'New Portfolio Contact Message'
        })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setIsSubmitting(false);
        onSubmit('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.message || 'Transmission failed.');
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      onSubmit('error');
    }
  };

  return (
    <div>
      <div className="terminal-form-title"># SYSTEM CONFIG: contact_form.cfg</div>
      <form onSubmit={handleSubmit} className="terminal-form">
        <div className="terminal-form-row">
          <label className="terminal-form-label">NAME =</label>
          <input
            type="text"
            className="terminal-form-input"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isSubmitting}
            onMouseEnter={playHover}
          />
        </div>
        <div className="terminal-form-row">
          <label className="terminal-form-label">EMAIL =</label>
          <input
            type="email"
            className="terminal-form-input"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isSubmitting}
            onMouseEnter={playHover}
          />
        </div>
        <div className="terminal-form-row" style={{ alignItems: 'start' }}>
          <label className="terminal-form-label" style={{ marginTop: '4px' }}>MSG =</label>
          <textarea
            className="terminal-form-input"
            rows={3}
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            required
            disabled={isSubmitting}
            onMouseEnter={playHover}
            style={{ resize: 'none' }}
          />
        </div>
        <button type="submit" className="terminal-form-btn" onMouseEnter={playHover} disabled={isSubmitting}>
          {isSubmitting ? 'TRANSMITTING...' : 'RUN TRANSMISSION'}
        </button>
      </form>
    </div>
  );
};

// 6. About Viewer for about.txt
export const AboutViewer: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', maxWidth: '750px', alignItems: 'center', marginTop: '10px' }}>
      <div style={{ position: 'relative', border: '1px solid var(--border-color)', padding: '6px', backgroundColor: 'rgba(255, 255, 255, 0.01)', borderRadius: '8px', width: '140px', height: '140px', overflow: 'hidden' }}>
        <img 
          src="./assets/photo.jpg" 
          alt="Veeragopinath M" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', filter: 'grayscale(15%) contrast(105%)' }} 
        />
        {/* CRT scanline scan bar overlay */}
        <div style={{ position: 'absolute', inset: '6px', background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 100%)', pointerEvents: 'none', borderRadius: '4px' }}></div>
      </div>
      <div style={{ flex: '1', minWidth: '280px' }}>
        <h3 style={{ color: 'var(--color-green)', fontSize: '1.25rem', marginBottom: '4px', fontWeight: 'bold' }}>VEERAGOPINATH M</h3>
        <div style={{ color: 'var(--color-cyan)', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>
          Senior Software Developer // Chennai, IN
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '10px' }}>
          Highly effective Software Developer with 4+ years of full-stack experience, specializing in scalable web systems across the React.js, Vue.js, and Node.js ecosystems. Proven track record of delivering high-quality, high-performance solutions and leading technical innovation in collaborative team environments.
        </p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>LOC: Chennai, IN</span>
          <span>SYSTEM: macOS x86_64</span>
          <span>SHELL: zsh</span>
        </div>
      </div>
    </div>
  );
};

