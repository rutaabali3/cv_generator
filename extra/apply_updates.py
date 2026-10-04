import os
import re

html_path = "1.html"
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update CSS
css_injections = """
/* Profiles */
.profile-bar { display:flex; gap:8px; margin-bottom:10px; align-items:center; }
.profile-bar select { flex:1; padding:6px; border:1px solid var(--line); border-radius:6px; font-size:13px; }
/* Floating Toolbar */
#floating-toolbar {
  position: absolute; display: none; background: #fff; border: 1px solid var(--line);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 6px; padding: 4px; z-index: 10000;
}
#floating-toolbar button {
  background: transparent; border: none; cursor: pointer; padding: 4px 8px; font-weight: 600; border-radius: 4px; font-family:serif; font-size:14px;
}
#floating-toolbar button:hover { background: #f0f0f0; }
/* JD Matcher */
.jd-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.jd-chips .chip { font-size: 11px; padding: 2px 6px; border-radius: 4px; border: 1px solid; }
.chip-green { background: #dcfce7 !important; color: #166534 !important; border-color: #bbf7d0 !important; }
.chip-red { background: #fee2e2 !important; color: #991b1b !important; border-color: #fecaca !important; }
#jd-score { font-weight: bold; font-size: 14px; margin-top: 8px; }
/* Weak bullets */
.bullet-warnings { background: #fdf2f2; padding: 8px; border-radius: 6px; border: 1px solid #f8cbcb; margin-top: 10px; display: none;}
.bullet-warnings ul { margin: 4px 0 0; padding-left: 16px; font-size:12px; color: var(--danger); }
"""
content = content.replace("</style>", css_injections + "\n</style>")

# 2. Add DOB and Nationality to Personal Info
personal_info_replacement = """
          <label>Location
            <input data-field="location" type="text" placeholder="Karachi, Pakistan" />
          </label>
          <label>Date of Birth
            <input data-field="dob" type="text" placeholder="01 Jan 1990" />
          </label>
          <label>Nationality
            <input data-field="nationality" type="text" placeholder="Pakistani" />
          </label>
"""
content = content.replace("""<label>Location
            <input data-field="location" type="text" placeholder="Karachi, Pakistan" />
          </label>""", personal_info_replacement)

# 3. Add Panels to HTML (Profiles, JD, Bullets, Checklist)
panels_html = """
      <div class="panel">
        <h2 class="panel-title">CV Profiles</h2>
        <div class="profile-bar">
          <select id="profile-select" aria-label="Select Profile"></select>
          <button id="btn-profile-new" class="btn ghost" type="button" title="New">New</button>
          <button id="btn-profile-dup" class="btn ghost" type="button" title="Duplicate">Dup</button>
          <button id="btn-profile-del" class="btn danger" type="button" title="Delete">Del</button>
        </div>
      </div>
      
      <div class="panel">
        <h2 class="panel-title">Job Description Matcher</h2>
        <textarea id="jd-input" class="big-textarea" placeholder="Paste job description here..." style="min-height:60px"></textarea>
        <button id="btn-jd-match" class="btn ghost" style="margin-top:8px; width:100%">Analyze Keywords</button>
        <div id="jd-score"></div>
        <div id="jd-chips-container" class="jd-chips"></div>
      </div>
      
      <div class="panel" id="bullet-warnings-panel" style="display:none; border-color:var(--danger)">
        <h2 class="panel-title" style="color:var(--danger)">Weak Bullets Detected</h2>
        <div class="bullet-warnings" id="bullet-warnings-content" style="display:block; margin-top:0"></div>
      </div>

      <div class="panel">
        <h2 class="panel-title">Region-aware Checklist</h2>
        <select id="region-select" style="width:100%; padding:6px; border-radius:6px; margin-bottom:8px">
          <option value="us">US / UK / Europe (Strict)</option>
          <option value="asia">South Asia / Gulf (Expected Details)</option>
        </select>
        <ul id="checklist-items" class="tips ul" style="margin:0; padding-left:18px; font-size:12px; line-height:1.6"></ul>
      </div>
"""
content = content.replace('<div class="editor-scroll">', '<div class="editor-scroll">\n' + panels_html)

# 4. Add floating toolbar to body
toolbar_html = """
  <div id="floating-toolbar">
    <button type="button" id="ft-bold" style="font-weight:bold" title="Bold">B</button>
    <button type="button" id="ft-italic" style="font-style:italic" title="Italic">I</button>
    <button type="button" id="ft-underline" style="text-decoration:underline" title="Underline">U</button>
  </div>
"""
content = content.replace('</main>', '</main>\n' + toolbar_html)


# 5. JS Updates

js_injections = """

/* =========================================================
   UPDATES JS (Profiles, JD Match, Toolbar, Checklist, Bullets)
   ========================================================= */

// 1. Profiles Override
let profilesData = {
  activeId: 'default',
  profiles: { 'default': { id: 'default', name: 'My CV', data: defaultData() } }
};

function loadProfilesState() {
  try {
    const raw = localStorage.getItem('harvard-cv-builder/v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.profiles) return parsed;
    }
    // Migrate V1
    const v1Raw = localStorage.getItem('harvard-cv-builder/v1');
    if (v1Raw) {
      const v1Parsed = JSON.parse(v1Raw);
      if (v1Parsed.personal) {
        return {
          activeId: 'default',
          profiles: { 'default': { id: 'default', name: 'My CV', data: v1Parsed } }
        };
      }
    }
  } catch(e) {}
  return profilesData;
}

profilesData = loadProfilesState();
state = profilesData.profiles[profilesData.activeId].data;

// Override saveState
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    profilesData.profiles[profilesData.activeId].data = state;
    try { localStorage.setItem('harvard-cv-builder/v2', JSON.stringify(profilesData)); } catch(e) {}
    checkBullets();
  }, 250);
}

function renderProfileUI() {
  const sel = $('#profile-select');
  sel.innerHTML = '';
  Object.values(profilesData.profiles).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    if (p.id === profilesData.activeId) opt.selected = true;
    sel.appendChild(opt);
  });
}

$('#profile-select').addEventListener('change', (e) => {
  profilesData.activeId = e.target.value;
  state = profilesData.profiles[profilesData.activeId].data;
  renderEditor(); renderPreview();
});

$('#btn-profile-new').addEventListener('click', () => {
  const name = prompt("Enter new CV name:");
  if (!name) return;
  const id = uid();
  profilesData.profiles[id] = { id, name, data: defaultData() };
  profilesData.activeId = id;
  state = profilesData.profiles[id].data;
  renderProfileUI(); renderEditor(); renderPreview(); saveState();
});

$('#btn-profile-dup').addEventListener('click', () => {
  const name = prompt("Enter name for duplicated CV:", profilesData.profiles[profilesData.activeId].name + " (Copy)");
  if (!name) return;
  const id = uid();
  profilesData.profiles[id] = { id, name, data: deepClone(state) };
  profilesData.activeId = id;
  state = profilesData.profiles[id].data;
  renderProfileUI(); renderEditor(); renderPreview(); saveState();
});

$('#btn-profile-del').addEventListener('click', () => {
  if (Object.keys(profilesData.profiles).length <= 1) return alert("Cannot delete your only CV profile.");
  if (confirm("Delete this CV profile?")) {
    delete profilesData.profiles[profilesData.activeId];
    profilesData.activeId = Object.keys(profilesData.profiles)[0];
    state = profilesData.profiles[profilesData.activeId].data;
    renderProfileUI(); renderEditor(); renderPreview(); saveState();
  }
});

renderProfileUI();

// 2. Floating Toolbar & Bug Fix
const fToolbar = $('#floating-toolbar');
const cvArea = $('#cv');

document.addEventListener('selectionchange', () => {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) {
    fToolbar.style.display = 'none';
    return;
  }
  
  // Check if selection is inside cv
  let node = sel.anchorNode;
  let inCv = false;
  while (node && node !== document.body) {
    if (node.id === 'cv') { inCv = true; break; }
    node = node.parentNode;
  }
  if (!inCv) {
    fToolbar.style.display = 'none';
    return;
  }
  
  // Bug fix: Hide bold button for fields already bold
  const isBold = sel.anchorNode.parentElement.closest('.cv-name, .cv-section-head, .cv-item-title-row, .cv-item-title, .cv-item-head, .k');
  if (isBold) {
    $('#ft-bold').style.display = 'none';
  } else {
    $('#ft-bold').style.display = 'inline-block';
  }
  
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  fToolbar.style.display = 'flex';
  fToolbar.style.top = (rect.top + window.scrollY - 36) + 'px';
  fToolbar.style.left = (rect.left + window.scrollX + (rect.width/2) - (fToolbar.offsetWidth/2)) + 'px';
});

$('#ft-bold').addEventListener('mousedown', (e) => { e.preventDefault(); document.execCommand('bold', false, null); });
$('#ft-italic').addEventListener('mousedown', (e) => { e.preventDefault(); document.execCommand('italic', false, null); });
$('#ft-underline').addEventListener('mousedown', (e) => { e.preventDefault(); document.execCommand('underline', false, null); });

// 3. JD Matcher
$('#btn-jd-match').addEventListener('click', () => {
  const jdText = $('#jd-input').value.toLowerCase();
  const cvText = $('#cv').innerText.toLowerCase();
  if (!jdText.trim()) return;
  
  // Simple extraction: words > 3 chars
  let words = jdText.match(/[a-z]+/g) || [];
  const stopWords = new Set(["this", "that", "with", "from", "your", "have", "will", "what", "when", "where", "they", "their"]);
  words = [...new Set(words.filter(w => w.length > 3 && !stopWords.has(w)))];
  
  let matchCount = 0;
  const container = $('#jd-chips-container');
  container.innerHTML = '';
  
  words.forEach(w => {
    const hasWord = cvText.includes(w);
    if (hasWord) matchCount++;
    const chip = document.createElement('span');
    chip.className = 'chip ' + (hasWord ? 'chip-green' : 'chip-red');
    chip.textContent = w;
    container.appendChild(chip);
  });
  
  const score = words.length ? Math.round((matchCount / words.length) * 100) : 0;
  $('#jd-score').textContent = score + "% Match";
});

// 4. Weak Bullet Checker
function checkBullets() {
  const warnings = [];
  const items = $$('.cv-item-body');
  items.forEach(el => {
    const text = el.innerText.trim();
    if (!text) return;
    const lines = text.split('\\n');
    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('•')) {
        const content = line.substring(1).trim();
        const weakRegex = /^(I |Responsible for|Helped|Worked|Assisted|Handled|Did)/i;
        if (weakRegex.test(content)) {
          warnings.push(`Weak opening: "${content.substring(0, 20)}..." (Use strong action verbs)`);
        }
        if (!/\d/.test(content)) {
          warnings.push(`No metrics/numbers: "${content.substring(0, 20)}..."`);
        }
      }
    });
  });
  
  const panel = $('#bullet-warnings-panel');
  const content = $('#bullet-warnings-content');
  if (warnings.length > 0) {
    panel.style.display = 'block';
    let html = '<ul>';
    warnings.forEach(w => html += '<li>' + w + '</li>');
    html += '</ul>';
    content.innerHTML = html;
  } else {
    panel.style.display = 'none';
  }
}
// Trigger initial check
setTimeout(checkBullets, 500);

// 5. Region Checklist
function updateChecklist() {
  const region = $('#region-select').value;
  const ul = $('#checklist-items');
  if (region === 'us') {
    ul.innerHTML = `
      <li><b>Photo:</b> Skip (Discrimination risks)</li>
      <li><b>Date of Birth:</b> Skip</li>
      <li><b>Nationality:</b> Skip</li>
      <li><b>Length:</b> Typically 1 page (unless senior)</li>
    `;
  } else {
    ul.innerHTML = `
      <li><b>Photo:</b> Expected in many roles</li>
      <li><b>Date of Birth:</b> Expected to show age</li>
      <li><b>Nationality:</b> Often required for visa purposes</li>
      <li><b>Length:</b> 2 pages is standard</li>
    `;
  }
}
$('#region-select').addEventListener('change', updateChecklist);
updateChecklist();

// Update rendering to include DOB and Nationality in personal info headers
// I will patch renderHeader in JS below
"""

content = content.replace("</script>", js_injections + "\n</script>")

# Patch renderHeader to include DOB and Nationality in contact
render_header_old = """  if (p.location) pieces.push(contactSpan(p.location, "personal.location"));"""
render_header_new = """  if (p.location) pieces.push(contactSpan(p.location, "personal.location"));
  if (p.dob) pieces.push(contactSpan(p.dob, "personal.dob"));
  if (p.nationality) pieces.push(contactSpan(p.nationality, "personal.nationality"));"""
content = content.replace(render_header_old, render_header_new)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated 1.html successfully.")
