const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const label = document.getElementById('themeLabel');
const icon = document.getElementById('themeIcon');

const getUtterancesTheme = () => (root.getAttribute('data-theme') === 'light' ? 'github-light' : 'github-dark');

const syncUtterancesTheme = () => {
  const utterancesFrame = document.querySelector('iframe.utterances-frame');
  if (utterancesFrame && utterancesFrame.contentWindow) {
    utterancesFrame.contentWindow.postMessage(
      { type: 'set-theme', theme: getUtterancesTheme() },
      'https://utteranc.es'
    );
  }
};

const setTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  const dark = theme === 'dark';
  if (label) {
    label.textContent = dark ? 'Dark mode' : 'Light mode';
  }
  if (icon) {
    icon.textContent = dark ? '☾' : '☀';
  }
  localStorage.setItem('portfolio-theme', theme);
  syncUtterancesTheme();
};

const saved = localStorage.getItem('portfolio-theme');
if (saved === 'light' || saved === 'dark') {
  setTheme(saved);
} else {
  // Default to dark theme for first-time visitors
  setTheme('dark');
}

if (toggle) {
  toggle.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const progressFill = document.getElementById('scrollProgressFill');
const nav = document.querySelector('.nav');

const updateViewportState = () => {
  const scrolled = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrolled / docHeight) * 100)) : 0;

  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }

  if (window.innerWidth >= 768 && nav) {
    if (scrolled > 96) {
      nav.classList.add('nav-side');
      document.body.classList.add('nav-left');
    } else {
      nav.classList.remove('nav-side');
      document.body.classList.remove('nav-left');
    }
  } else {
    nav && nav.classList.remove('nav-side');
    document.body.classList.remove('nav-left');
  }
};

window.addEventListener('scroll', updateViewportState);
window.addEventListener('resize', updateViewportState);
updateViewportState();

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('collapsed', isExpanded);
    navLinks.classList.toggle('nav-open', !isExpanded);
  });

  navLinks.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      if (window.innerWidth <= 760) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('nav-open');
        navLinks.classList.add('collapsed');
      }
    });
  });
}

const certDetails = {
  isc2: {
    name: 'ISC2 Certified in Cybersecurity (CC)',
    issuer: 'ISC2',
    meta: 'Issued Mar 2026 · Expires Feb 2029 · Credential ID 3555082',
    skills: 'Cybersecurity, Information Security, Risk Management, Incident Response, Cloud Security',
    description: 'Foundational knowledge in security principles, access controls, network security, incident response, disaster recovery, and security operations.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/ISC2_Logo.svg/500px-ISC2_Logo.svg.png',
  },
  'azure-dev': {
    name: 'Microsoft Certified: Azure Developer Associate',
    issuer: 'Microsoft',
    meta: 'Issued Apr 2024 · Expires Apr 2027 · Credential ID 49B8509E489A7C3E',
    skills: 'Microsoft Azure, Azure compute solutions, app services, CI/CD, security',
    description: 'Hands-on development on Azure platforms, including building compute solutions, APIs, and secure cloud-native services.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  },
  comptia: {
    name: 'CompTIA Security+ ce',
    issuer: 'CompTIA',
    meta: 'Issued Dec 2023 · Expires Dec 2026 · Credential ID 1K7P08W6L1V41F9W',
    skills: 'Security fundamentals, threat detection, incident response, risk management',
    description: 'Industry-recognized certification covering network security, threat management, and identity management.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Comptia-logo.svg/500px-Comptia-logo.svg.png',
  },
  'google-cyber': {
    name: 'Google Cybersecurity Certificate',
    issuer: 'Coursera / Google',
    meta: 'Issued Oct 2023 · Credential ID UW9MWVKY9S6H',
    skills: 'Cybersecurity foundations, network security, security operations',
    description: 'Practical introduction to cybersecurity operations, threat detection, and risk assessment for organizational protection.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  },
  'azure-fund': {
    name: 'Microsoft Certified: Azure Fundamentals',
    issuer: 'Microsoft',
    meta: 'Issued May 2021',
    skills: 'Azure cloud concepts, core services, pricing, security fundamentals',
    description: 'Entry-level certification validating core Azure concepts and cloud best practices for teams adopting Microsoft cloud solutions.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  },
  'ms-70-480': {
    name: 'Microsoft Exam 70-480: Programming in HTML5 with JavaScript and CSS3',
    issuer: 'Microsoft',
    meta: 'Issued Mar 2020',
    skills: 'HTML5, JavaScript, CSS3, modern front-end development',
    description: 'Demonstrates expertise in building responsive, standards-based web experiences using modern browser technologies.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  },
  'ms-70-761': {
    name: 'Microsoft Exam 70-761: Querying Data with Transact-SQL',
    issuer: 'Microsoft',
    meta: 'Issued Jan 2020',
    skills: 'T-SQL, data querying, database logic, reporting',
    description: 'Covers extracting and manipulating data with Transact-SQL in SQL Server environments.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  },
  'aws-dev': {
    name: 'AWS Developer - Associate',
    issuer: 'Amazon Web Services',
    meta: 'Issued May 2019 · Expires May 2022 · Credential ID GC31K991B1F4QGC9',
    skills: 'AWS architecture, serverless development, CI/CD, security, monitoring',
    description: 'Validates building and maintaining applications on AWS with cloud-native deployment patterns.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  },
  'aws-sa': {
    name: 'AWS Solutions Architect Associate',
    issuer: 'Amazon Web Services',
    meta: 'Issued Apr 2019 · Expires Apr 2022 · Credential ID BREDN492DJR11CCP',
    skills: 'AWS design, infrastructure, resilience, cost optimization',
    description: 'Proves skill in designing secure, scalable systems on AWS that meet business requirements.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  },
  'aws-cloud': {
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    meta: 'Issued Mar 2019 · Expires Mar 2022 · Credential ID YQV7BKL1BJBE1ZWH',
    skills: 'AWS basics, cloud concepts, security, billing, architecture',
    description: 'Foundational AWS certification for understanding cloud fundamentals and services.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  },
  sabio: {
    name: 'Sabio Full Stack Software Development Certificate',
    issuer: 'Sabio Enterprises Inc.',
    meta: 'Full stack curriculum covering JS, .NET, Azure, CI/CD',
    skills: 'Full stack development, Agile teamwork, modern architecture',
    description: 'Intense, hands-on program emphasizing production-quality full stack engineering on real teams.',
    logo: 'https://via.placeholder.com/48?text=Sabio',
  },
  cisco: {
    name: 'Cisco Certified Network Associate: Routing and Switching',
    issuer: 'Cisco',
    meta: 'Networking fundamentals including routing, switching, and WANs',
    skills: 'Networking, routing, switching, enterprise network design',
    description: 'Industry standard networking certification for scalable and secure enterprise network operations.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/500px-Cisco_logo_blue_2016.svg.png',
  },
  oracle: {
    name: 'Oracle Certified Java Programmer I',
    issuer: 'Oracle',
    meta: 'Java programming concepts, OOP, language fundamentals',
    skills: 'Java, OOP, data structures, coding best practices',
    description: 'Validates core Java SE programming skill and fundamental object-oriented design.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/960px-Oracle_logo.svg.png',
  },
};

const eduDetails = {
  master: {
    name: 'Master of Science in Information Technology',
    issuer: 'Yerevan State University',
    meta: 'Completed graduate studies · IERF evaluated as equivalent to U.S. Master of Science in Information Technology',
    description: 'Relevant coursework included:',
    coursework: [
      'Information Technologies in Professional Research (Foundations of Programming Languages)',
      'Contemporary Issues of the Profession (Foundations of Database Systems)',
      'English',
      'Fundamental Algorithms',
      'Operating Systems',
      'Managing the Digital Firm',
      'Basics of Database Systems',
      'C# and .Net Platform',
      'Extensible Markup Language (XML) and Databases',
      'Design of Web-Based Systems',
      'Principles of Compilation',
      'Data Communication and Computer Networking II',
      'Theory of Computing Systems Design',
      'Principles of Database Systems',
      'Data Communication and Computer Networking I',
      'Methodology of Object-Oriented Design',
      'Design of Embedded Systems',
      'Testing of Electronic Devices and Systems',
      'Software Testing and Quality Assurance',
      'Extended Programming in C++',
      'Scientific Seminar',
      'Research Work',
      'Pedagogical Internship',
      'Research Internship',
      'Master’s Thesis: The Consistency Between Unified Modeling Language (UML) Class and Objects Diagrams'
    ],
    logo: 'https://www.ysu.am/themes/custom/ysu_main/images/logo-armenian.svg',
  },
  bachelor: {
    name: 'Bachelor of Science in Applied Mathematics',
    issuer: 'Yerevan State University',
    meta: 'Completed Diplom in Information and Applied Mathematics · IERF evaluated as equivalent to U.S. Bachelor of Science in Mathematics with Computer Science concentration',
    description: 'Relevant coursework included:',
    coursework: [
      'Mathematical Analysis',
      'Computer and Programming',
      'Algebra',
      'Discrete Mathematics',
      'Theory of Algorithms',
      'Data Constructions',
      'Differential Equations',
      'Complex Analysis',
      'Mathematical Physics Equations',
      'Functional Programming Systems',
      'Digital Methods',
      'Mathematical Logic',
      'Functional Analysis',
      'Theory of Translation',
      'Principles of Mathematical Cybernetics',
      'Database',
      'Combinatorial Algorithms Analysis',
      'Optimization Methods',
      'Operations Research',
      'Theory of Probability',
      'Architecture of Computer and Assembler Language',
      'Physics',
      'Russian Language',
      'Operating Systems',
      'Geometry',
      'Armenian Language and Basics of Culture of Speech',
      'Foreign Language (Unspecified)',
      'Physical Education',
      'History of Religions',
      'Basic Issues of Armenian History',
      'Principles of Philosophy',
      'Principles of Ecology and Environment Preservation',
      'Principles of Economics',
      'Principles of Political Science',
      'Principles of Jurisprudence',
      'Medical First Aid in Emergency Situations',
      'Civil Defense and Emergency Situations Basic Issues',
      'Mathematical Statistics',
      'Modern Natural Science Concepts',
      'System Programming in C Environment',
      'Computer Network',
      'Graphs Theory',
      'Principles of Object-Oriented Design',
      'Fourier Transform',
      'Coding Theory',
      'Markup Languages',
      'Integral Equations and Their Applications',
      'Principles of Information Security',
      'Course Paper (Unspecified)',
      'Course Paper (Unspecified)',
      'State Graduation Examination in General Mathematics',
      'Graduation Project / Thesis'
    ],
    logo: 'https://www.ysu.am/themes/custom/ysu_main/images/logo-armenian.svg',
  },
};

const modal = document.getElementById('certModal');
const modalTitle = document.getElementById('certModalTitle');
const modalIssuer = document.getElementById('certModalIssuer');
const modalMeta = document.getElementById('certModalMeta');
const modalDesc = document.getElementById('certModalDesc');
const modalSkills = document.getElementById('certModalSkills');
const modalLogo = document.getElementById('certModalLogo');

const openCertModal = (certId) => {
  if (!modal || !modalTitle || !modalIssuer || !modalMeta || !modalDesc || !modalSkills || !modalLogo) {
    return;
  }

  const cert = certDetails[certId];
  if (!cert) return;

  modalTitle.textContent = cert.name;
  modalIssuer.textContent = cert.issuer;
  modalMeta.textContent = cert.meta;
  modalDesc.textContent = cert.description;
  modalSkills.textContent = `Skills: ${cert.skills}`;
  modalLogo.src = cert.logo;
  modalLogo.alt = `${cert.issuer} logo`;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
};

const openEduModal = (eduId) => {
  if (!modal || !modalTitle || !modalIssuer || !modalMeta || !modalDesc || !modalSkills || !modalLogo) {
    return;
  }

  const edu = eduDetails[eduId];
  if (!edu) return;

  modalTitle.textContent = edu.name;
  modalIssuer.textContent = edu.issuer;
  modalMeta.textContent = edu.meta;
  modalDesc.innerHTML = `${edu.description}<br><br>${edu.coursework.map(course => `• ${course}`).join('<br>')}`;
  modalSkills.textContent = '';
  modalLogo.src = edu.logo;
  modalLogo.alt = `${edu.issuer} logo`;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
};

const closeCertModal = () => {
  if (!modal) {
    return;
  }

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
};

document.querySelectorAll('.cert-card').forEach((el) => {
  el.addEventListener('click', () => openCertModal(el.dataset.cert));
});

document.querySelectorAll('.edu-card-button').forEach((el) => {
  el.addEventListener('click', () => openEduModal(el.dataset.edu));
});

if (modal) {
  modal.querySelectorAll('[data-action="close-modal"]').forEach((el) => {
    el.addEventListener('click', closeCertModal);
  });
}

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const honeypot = contactForm.querySelector('input[name="_gotcha"]');

    if (honeypot && honeypot.value) {
      if (contactStatus) {
        contactStatus.textContent = 'Unable to send this message. Please email directly instead.';
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    if (contactStatus) {
      contactStatus.textContent = 'Sending your message...';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        contactForm.reset();
        if (contactStatus) {
          contactStatus.textContent = 'Thanks. Your message was sent successfully.';
        }
      } else {
        if (contactStatus) {
          contactStatus.textContent = 'Message could not be sent. Please use the direct email link.';
        }
      }
    } catch (error) {
      if (contactStatus) {
        contactStatus.textContent = 'Network error while sending. Please use the direct email link.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send message';
      }
    }
  });
}
