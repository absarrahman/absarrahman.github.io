/* ============================
   SKILLS DATA
============================ */
const skills = [
  {
    group: "Frameworks",
    items:
      [
        ["UIKit", true],
        ["SwiftUI", true],
        ["Flutter", true],
        ["React Native", true]
      ]
  },
  {
    group: "Languages",
    items:
      [
        ["Swift", true],
        ["Dart", true],
        ["Java", false],
        ["Python", false],
        ["C++", false]
      ]
  },
  {
    group: "Databases",
    items: [
      ["Firebase", false],
      ["RealmDB", false],
      ["CoreData", false],
      ["HiveDB", false],
      ["MySQL", false]
    ]
  },
  {
    group: "Source",
    items:
      [
        ["Git", true],
        ["GitHub", true],
        ["Bitbucket", true],
        ["GitLab", false],
        ["Gerrit", false]
      ]
  },
  {
    group: "Extras",
    items: [
      ["Adyen SDK", false],
      ["LaTeX", false],
      ["Rotato", false],
      ["DaVinci Resolve", false],
      ["Adobe Illustrator", false]
    ]
  }
];

/* ============================
   RENDER SKILLS
============================ */
function renderSkills() {
  const skillsGrid = document.getElementById('skillsGrid');
  skills.forEach((s, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'skills-group';
    wrap.innerHTML = `
      <div class="g-label r">${String(i + 1).padStart(2, '0')} · ${s.group}</div>
      <div class="g-items r d1">
        ${s.items.map(([k, feat]) => `<span class="chip${feat ? ' featured' : ''}">${k}</span>`).join('')}
      </div>
    `;
    skillsGrid.appendChild(wrap);
  });
}
