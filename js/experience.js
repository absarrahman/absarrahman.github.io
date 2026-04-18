/* ============================
   EXPERIENCE DATA
============================ */
const experience = [
  {
    yr: "2026 — Present",
    role: "Student Grader",
    co: "University of Kansas",
    loc: "Lawrence, KS",
    bullets: [
      "Conduct in-person grading sessions for a comprehensive programming course covering HTML, CSS, JavaScript, and Haskell",
      "Develop automated grading scripts to increase efficiency and ensure consistent evaluation of full-stack and functional programming assignments",
      "Demonstrate alternative coding approaches and best practices to help students improve their logic and architectural thinking",
      "Provide technical feedback on web development standards and functional programming concepts to support student growth"
    ]
  },
  {
    yr: "2024 — Dec 2025",
    role: "Graduate Teaching Assistant",
    co: "University of Kansas",
    loc: "Lawrence, KS",
    bullets: [
      "Delivered lab lectures and facilitate discussions for undergrads in EECS 268 (Programming II)",
      "Supported and grade students in EECS 447 (Introduction to Database Systems)",
      "Hosted weekly office hours for one‑on‑one support"
    ]
  },
  {
    yr: "May — Aug 2025",
    role: "Mobile Intern",
    co: "Niched LLC",
    loc: "Kansas City, MO",
    bullets: [
      "Built iOS and Android features in React Native for an active, growing app",
      "Implemented Tap‑to‑Pay using the Adyen SDK on both iOS and Android",
      "Resolved high‑priority bugs and contributed to App Store / Play Store releases"
    ]
  },
  {
    yr: "Apr — Jun 2024",
    role: "Software Engineer · iOS",
    co: "GoZayaan",
    loc: "Bangladesh",
    bullets: [
      "Developed high‑performance iOS features used by 2k+ daily active users",
      "Resolved 30% of outstanding UI‑related issues in the sprint",
      "Translated design specs into native interfaces and integrated external APIs"
    ]
  },
  {
    yr: "2021 — 2023",
    role: "Mobile Developer",
    co: "Omnigate Systems Inc.",
    loc: "Montreal, QC",
    bullets: [
      "Delivered cross‑platform features in Flutter across a long‑running product",
      "Designed reusable components and ensured responsive layouts across form factors",
      "Reviewed team PRs and championed best practices in complex layout work"
    ]
  },
  {
    yr: "Nov 2022 — Mar 2023",
    role: "Software Engineer Trainee · iOS",
    co: "BJIT Academy",
    loc: "Bangladesh",
    bullets: [
      "Studied UIKit fundamentals end‑to‑end",
      "Built a sample app on MVVM architecture from scratch",
      "Ran system analysis exercises across the training cohort"
    ]
  }
];

/* ============================
   RENDER EXPERIENCE
============================ */
function renderExperience() {
  const xpList = document.getElementById('xpList');
  experience.forEach((e, i) => {
    const el = document.createElement('article');
    el.className = 'xp-item r';
    el.style.transitionDelay = (i * 60) + 'ms';
    el.innerHTML = `
      <div class="yr">${e.yr}</div>
      <div>
        <h3>${e.role}</h3>
        <div class="co"><em>${e.co}</em> · ${e.loc}</div>
        <ul class="bullets"><div>${e.bullets.map(b => `<li>${b}</li>`).join('')}</div></ul>
      </div>
      <button class="toggle" aria-expanded="false">
        <span class="label">Details</span>
        <span class="ic"></span>
      </button>
    `;
    const toggle = el.querySelector('.toggle');
    toggle.addEventListener('click', () => {
      const open = el.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.label').textContent = open ? 'Close' : 'Details';
    });
    // open first two by default
    if (i < 2) {
      el.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.querySelector('.label').textContent = 'Close';
    }
    xpList.appendChild(el);
  });
}
