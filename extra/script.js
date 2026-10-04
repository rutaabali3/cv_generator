
/* =========================================================
   Harvard CV Builder — app.js
   Pure vanilla JS: editor <-> live preview, drag & drop,
   inline editing on the preview, auto-save, JSON I/O, print.
   ========================================================= */

const STORAGE_KEY = "harvard-cv-builder/v1";

/* ---------- Default data model ---------- */
const defaultData = () => ({
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    other: "",
  },
  sections: [],
});

/* ---------- Sample CV (your CV) ---------- */
const sampleData = () => ({
  personal: {
    name: "Muhammad Rutaab Ali",
    title: "Web Developer · E-commerce & SEO Specialist",
    email: "rutaabali3@gmail.com",
    phone: "+92 319 2342358",
    location: "Nazimabad No.3, Karachi",
    website: "",
    github: "github.com/rutaabali3",
    other: "",
  },
  sections: [
    {
      id: uid(), type: "summary", title: "Profile",
      body:
        "I am Muhammad Rutaab Ali. I am currently studying at Aptech Learning " +
        "for a Diploma in Information Technology (IT), and I plan to start a BSCS soon.",
    },
    {
      id: uid(), type: "education", title: "Education",
      items: [
        { id: uid(), title: "SM Public Academy", sub: "Matriculation", date: "2022", body: "Marks: 966/1100 (87.82%)" },
        { id: uid(), title: "Govt. National College", sub: "Intermediate", date: "2024", body: "Marks: 557/1100 (50.64%)" },
        { id: uid(), title: "Aptech Learning", sub: "Diploma (IT)", date: "In Progress", body: "1.5 Years Completed" },
      ],
    },
    {
      id: uid(), type: "experience", title: "Experience",
      items: [
        {
          id: uid(), title: "Content Assistance", sub: "", date: "2025 – Present",
          body: "• I create basic video and image content to promote products while also managing and organizing digital assets.",
        },
        {
          id: uid(), title: "E-Commerce & Listing Management", sub: "Company Website", date: "2024 – Present",
          body: "• I manage product listings on the company website, optimizing them to ensure they have accurate descriptions and pricing, while updating the inventory as needed.",
        },
        {
          id: uid(), title: "Search Engine Optimization (SEO)", sub: "", date: "",
          body: "• I optimize product listings by applying best practices, targeted strategies, and keyword analysis, while also optimizing metadata for enhanced visibility and search rankings.",
        },
        {
          id: uid(), title: "E-Commerce & Listing Management", sub: "eBay", date: "",
          body: "• I list and manage products on eBay, updating stocks, descriptions and pricing when needed.",
        },
        {
          id: uid(), title: "Social Media Sales & Customer Support", sub: "", date: "2023 – 2024",
          body: "• I manage inquiries on social media and chat channels by resolving customer queries, responding to leads, and securing sales orders.",
        },
      ],
    },
    {
      id: uid(), type: "skills", title: "Skills & Interests",
      groups: [
        { id: uid(), label: "Core", items: [
          "MS Office","Prompt Optimization","Chat Support","SEO",
          "Product Listing Optimization","Inventory Management","Digital Asset Management",
        ]},
        { id: uid(), label: "Learning", items: [
          "Web Development","DevOps","AI Automation","Prompt Engineering",
        ]},
        { id: uid(), label: "Secondary", items: ["Video Editing","Graphic Design"]},
      ],
    },
    {
      id: uid(), type: "languages", title: "Languages",
      items: ["Urdu (Native)", "English (Conversational)"],
    },
  ],
});

/* ---------- Tiny helpers ---------- */
function uid(){ return Math.random().toString(36).slice(2,10); }
function $(sel, root=document){ return root.querySelector(sel); }
function $$(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
function el(tag, attrs={}, ...kids){
  const n = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)){
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  for (const kid of kids.flat()){
    if (kid == null || kid === false) continue;
    n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return n;
}
function deepClone(x){ return JSON.parse(JSON.stringify(x)); }

/* ---------- State ---------- */
let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw){
      const parsed = JSON.parse(raw);
      if (parsed && parsed.personal && Array.isArray(parsed.sections)) return parsed;
    }
  }catch{}
  return defaultData();
}
let saveTimer = null;
function saveState(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch{}
  }, 250);
}

/* =========================================================
   SECTION META — describes each section kind
   ========================================================= */
const SECTION_TYPES = {
  summary:       { label: "Summary / Profile",  kind: "text" },
  experience:    { label: "Experience",         kind: "items" },
  education:     { label: "Education",          kind: "items" },
  projects:      { label: "Projects",           kind: "items" },
  skills:        { label: "Skills",             kind: "skills" },
  certifications:{ label: "Certifications",     kind: "list" },
  awards:        { label: "Awards",             kind: "list" },
  languages:     { label: "Languages",          kind: "list" },
  custom:        { label: "Custom",             kind: "text" },
};

function newSection(type){
  const base = { id: uid(), type, title: SECTION_TYPES[type].label };
  switch (SECTION_TYPES[type].kind){
    case "text":   return { ...base, body: "" };
    case "items":  return { ...base, items: [ newItem() ] };
    case "list":   return { ...base, items: [""] };
    case "skills": return { ...base, groups: [ { id:uid(), label:"Skill group", items:[""] } ] };
  }
  return base;
}
function newItem(){
  return { id: uid(), title: "", sub: "", date: "", body: "" };
}

/* =========================================================
   RENDER: EDITOR
   ========================================================= */
function renderEditor(){
  // Personal
  for (const input of $$("[data-field]")){
    const f = input.dataset.field;
    input.value = state.personal[f] ?? "";
    input.oninput = () => {
      state.personal[f] = input.value;
      renderPreview();
      saveState();
    };
  }
  // Sections
  const list = $("#section-list");
  list.innerHTML = "";
  state.sections.forEach((sec, idx) => list.appendChild(renderSectionCard(sec, idx)));
}

function renderSectionCard(sec, idx){
  const meta = SECTION_TYPES[sec.type] || SECTION_TYPES.custom;
  const card = el("div", { class:"section-card", draggable:"true", "data-sec-id": sec.id });

  card.addEventListener("dragstart", e => {
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/sec-id", sec.id);
  });
  card.addEventListener("dragend", () => card.classList.remove("dragging"));
  card.addEventListener("dragover", e => { e.preventDefault(); });
  card.addEventListener("drop", e => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData("text/sec-id");
    if (!fromId || fromId === sec.id) return;
    reorderSections(fromId, sec.id);
  });

  const row = el("div", { class:"row" },
    el("span", { class:"handle", title:"Drag to reorder" }, "⋮⋮"),
    el("input", {
      class:"title-input",
      value: sec.title,
      placeholder:"Section title",
      oninput: (e) => { sec.title = e.target.value; renderPreview(); saveState(); },
    }),
    el("button", {
      class:"del", title:"Remove section", type:"button",
      onclick: () => {
        if (confirm(`Remove section "${sec.title}"?`)){
          state.sections = state.sections.filter(s => s.id !== sec.id);
          renderEditor(); renderPreview(); saveState();
        }
      },
    }, "✕"),
  );
  card.append(row);

  const body = el("div", { class:"section-body" });

  if (meta.kind === "text"){
    const ta = el("textarea", {
      class:"big-textarea",
      placeholder: "Write a short paragraph...",
      oninput: (e) => { sec.body = e.target.value; renderPreview(); saveState(); },
    });
    ta.value = sec.body ?? "";
    body.append(ta);
  }
  else if (meta.kind === "items"){
    sec.items = sec.items || [];
    sec.items.forEach((item, i) => body.append(renderItemEditor(sec, item, i)));
    body.append(el("button", {
      class:"add-item-btn", type:"button",
      onclick: () => { sec.items.push(newItem()); renderEditor(); renderPreview(); saveState(); },
    }, "+ Add entry"));
  }
  else if (meta.kind === "list"){
    sec.items = sec.items || [];
    const wrap = el("div", { class:"simple-list" });
    sec.items.forEach((val, i) => {
      wrap.append(el("input", {
        type:"text", value: val, placeholder:"Enter item and press Enter",
        oninput: (e) => { sec.items[i] = e.target.value; renderPreview(); saveState(); },
        onkeydown: (e) => {
          if (e.key === "Enter"){
            e.preventDefault();
            sec.items.splice(i+1, 0, "");
            renderEditor(); renderPreview(); saveState();
          } else if (e.key === "Backspace" && e.target.value === "" && sec.items.length > 1){
            e.preventDefault();
            sec.items.splice(i,1);
            renderEditor(); renderPreview(); saveState();
          }
        },
      }));
    });
    body.append(wrap);
    body.append(el("button", {
      class:"add-item-btn", type:"button",
      onclick: () => { sec.items.push(""); renderEditor(); renderPreview(); saveState(); },
    }, "+ Add item"));
  }
  else if (meta.kind === "skills"){
    sec.groups = sec.groups || [];
    sec.groups.forEach((g, gi) => body.append(renderSkillsGroupEditor(sec, g, gi)));
    body.append(el("button", {
      class:"add-item-btn", type:"button",
      onclick: () => { sec.groups.push({ id:uid(), label:"Group", items:[""] });
                       renderEditor(); renderPreview(); saveState(); },
    }, "+ Add skill group"));
  }

  card.append(body);
  return card;
}

function renderItemEditor(sec, item, i){
  const card = el("div", { class:"item-card" });
  card.append(
    el("div", { class:"line" },
      labelInput("Role / Award / Title", item.title, v => { item.title = v; }),
      labelInput("Organization / Subtitle", item.sub, v => { item.sub = v; }),
    ),
    el("div", { class:"line" },
      labelInput("Date / Period", item.date, v => { item.date = v; }),
      el("div"),
    ),
  );
  const ta = el("textarea", {
    placeholder: "Description / bullets. Start a line with • to make a bullet.",
    oninput: (e) => { item.body = e.target.value; renderPreview(); saveState(); },
  });
  ta.value = item.body ?? "";
  card.append(ta);
  card.append(el("div", { class:"item-foot" },
    el("button", {
      class:"mini-btn", type:"button",
      onclick: () => {
        sec.items = sec.items.filter(x => x.id !== item.id);
        renderEditor(); renderPreview(); saveState();
      },
    }, "Remove entry"),
  ));
  return card;
}

function labelInput(label, value, onVal){
  const wrap = el("label", { class:"field" },
    label,
    el("input", {
      type:"text", value,
      oninput: (e) => { onVal(e.target.value); renderPreview(); saveState(); },
    }),
  );
  return wrap;
}

function renderSkillsGroupEditor(sec, group, gi){
  const wrap = el("div", { class:"item-card" });
  wrap.append(
    el("input", {
      type:"text", value: group.label, placeholder:"Group name (e.g. Core, Learning)",
      style:"font-weight:600",
      oninput: (e) => { group.label = e.target.value; renderPreview(); saveState(); },
    }),
  );

  const chips = el("div", { class:"chips-input" });
  group.items.forEach((skill, si) => {
    if (skill === "" && si !== group.items.length - 1) return;
    chips.append(renderChip(group, si, skill));
  });
  const input = el("input", {
    type:"text", placeholder:"Type a skill and press Enter",
    onkeydown: (e) => {
      if (e.key === "Enter" && e.target.value.trim()){
        e.preventDefault();
        group.items.push(e.target.value.trim());
        if (!group.items.includes("")) group.items.push("");
        renderEditor(); renderPreview(); saveState();
      } else if (e.key === "Backspace" && e.target.value === ""){
        e.preventDefault();
        group.items = group.items.filter((x,i) => i !== group.items.length-1);
        if (!group.items.length) group.items = [""];
        renderEditor(); renderPreview(); saveState();
      }
    },
  });
  chips.append(input);
  wrap.append(chips);

  wrap.append(el("div", { class:"item-foot" },
    el("button", {
      class:"mini-btn", type:"button",
      onclick: () => {
        sec.groups = sec.groups.filter(g => g.id !== group.id);
        renderEditor(); renderPreview(); saveState();
      },
    }, "Remove group"),
  ));
  return wrap;
}
function renderChip(group, si, skill){
  return el("span", { class:"chip" },
    skill || el("span", { class:"empty-ph" }, "(empty)"),
    el("button", {
      type:"button", title:"Remove",
      onclick: () => {
        group.items.splice(si,1);
        if (!group.items.length) group.items.push("");
        renderEditor(); renderPreview(); saveState();
      },
    }, "×"),
  );
}

function reorderSections(fromId, toId){
  const from = state.sections.findIndex(s => s.id === fromId);
  const to   = state.sections.findIndex(s => s.id === toId);
  if (from < 0 || to < 0) return;
  const [moved] = state.sections.splice(from,1);
  state.sections.splice(to, 0, moved);
  renderEditor(); renderPreview(); saveState();
}

/* =========================================================
   RENDER: PREVIEW (the actual CV paper)
   ========================================================= */
function renderPreview(){
  const headerNode = renderHeader();
  const sectionFlows = state.sections.map(sec => buildSectionFlow(sec));
  const pages = paginate(headerNode, sectionFlows);

  const cv = $("#cv");
  cv.innerHTML = "";
  pages.forEach(nodes => {
    const page = el("article", { class:"cv-page" });
    nodes.forEach(n => page.append(n));
    cv.append(page);
  });

  attachInlineEditing();
}

/* Lays the header + sections out across as many A4 pages as needed.
   Measures real (live) nodes off-screen in a page-sized box, then greedily
   distributes them into pages, keeping section headings attached to at
   least their first item so a heading never sits alone at page bottom. */
function paginate(headerNode, sectionFlows){
  // Fixed A4 page box, used only to read its rendered height + padding
  const ref = document.createElement("div");
  ref.className = "cv-page";
  ref.style.cssText = "position:absolute; visibility:hidden; left:-99999px; top:0; margin:0; box-shadow:none; transform:none;";
  document.body.appendChild(ref);
  const fullHeight = ref.getBoundingClientRect().height;
  const cs = getComputedStyle(ref);
  const padV = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  document.body.removeChild(ref);
  const available = fullHeight - padV;

  // Growable measuring box holding the live nodes while we measure them
  const measure = document.createElement("div");
  measure.className = "cv-page";
  measure.style.cssText = "position:absolute; visibility:hidden; left:-99999px; top:0; height:auto; min-height:0; margin:0; box-shadow:none; transform:none;";
  document.body.appendChild(measure);

  let cum = 0;
  function measureDelta(node){
    measure.append(node);
    const total = measure.scrollHeight - padV;
    const delta = total - cum;
    cum = total;
    return delta;
  }

  const headerHeight = measureDelta(headerNode);
  const flows = sectionFlows.map(({ heading, items }) => ({
    heading,
    headingHeight: measureDelta(heading),
    items: items.map(node => ({ node, height: measureDelta(node) })),
  }));

  document.body.removeChild(measure); // nodes stay valid, just detached for now

  const pages = [[]];
  let used = 0;
  function startNewPage(){ pages.push([]); used = 0; }
  function place(node, h){ pages[pages.length - 1].push(node); used += h; }

  place(headerNode, headerHeight);

  flows.forEach(({ heading, headingHeight, items }) => {
    const firstItemHeight = items.length ? items[0].height : 0;
    if (used > 0 && used + headingHeight + firstItemHeight > available){
      startNewPage();
      heading.classList.add("page-top");
    }
    place(heading, headingHeight);
    items.forEach(({ node, height }) => {
      if (used > 0 && used + height > available) startNewPage();
      place(node, height);
    });
  });

  return pages;
}

function renderHeader(){
  const p = state.personal;
  const header = el("header", { class:"cv-header" });

  header.append(el("h1", {
    class:"cv-name editable", "data-path":`personal.name`, contenteditable:"true",
  }, p.name || el("span", { class:"empty-ph" }, "Your Name")));

  if (p.title || !p.name){
    header.append(el("p", {
      class:"cv-title editable", "data-path":"personal.title", contenteditable:"true",
    }, p.title || el("span", { class:"empty-ph" }, "Your title / role")));
  }

  const contact = el("div", { class:"cv-contact" });
  const pieces = [];
  if (p.location) pieces.push(contactSpan(p.location, "personal.location"));
  if (p.dob) pieces.push(contactSpan(p.dob, "personal.dob"));
  if (p.nationality) pieces.push(contactSpan(p.nationality, "personal.nationality"));
  if (p.email)    pieces.push(contactSpan(p.email,    "personal.email"));
  if (p.phone)    pieces.push(contactSpan(p.phone,    "personal.phone"));
  if (p.website)  pieces.push(contactSpan(p.website,  "personal.website"));
  if (p.github)   pieces.push(contactSpan(p.github,   "personal.github"));
  if (p.other)    pieces.push(contactSpan(p.other,    "personal.other"));
  pieces.forEach((node, i) => {
    if (i) contact.append(el("span", { class:"sep" }, "•"));
    contact.append(node);
  });
  header.append(contact);
  return header;
}
function contactSpan(text, path){
  return el("span", { class:"editable", "data-path":path, contenteditable:"true" }, text);
}

/* Returns a section's heading node plus its atomic body nodes (each of
   which pagination is free to move to a new page independently). */
function buildSectionFlow(sec){
  const heading = el("h2", {
    class:"cv-section-head editable", "data-path":`sections:${sec.id}:title`,
    contenteditable:"true",
  }, sec.title || el("span", { class:"empty-ph" }, "Section title"));

  const meta = SECTION_TYPES[sec.type] || SECTION_TYPES.custom;
  let items = [];
  switch (meta.kind){
    case "text":   items = [ renderTextSection(sec) ]; break;
    case "items":  items = (sec.items||[]).map(it => renderItem(sec, it)); break;
    case "list":   items = [ renderSimpleList(sec) ]; break;
    case "skills": items = [ renderSkills(sec) ]; break;
  }
  return { heading, items };
}
function renderTextSection(sec){
  return el("p", {
    class:"cv-summary editable", "data-path":`sections:${sec.id}:body`, contenteditable:"true",
  }, sec.body ? sec.body : el("span", { class:"empty-ph" }, "Add your text here..."));
}
function renderItem(sec, item){
  const node = el("div", { class:"cv-item" });

  const titleSpan = () => el("span", {
    class:"cv-item-title editable", "data-path":`items:${item.id}:title`,
    contenteditable:"true",
  }, item.title || el("span", { class:"empty-ph" }, "Title"));

  const dateSpan = () => el("span", {
    class:"cv-item-date editable", "data-path":`items:${item.id}:date`, contenteditable:"true",
  }, item.date || "");

  if (item.sub){
    // Title alone on its own line; subtitle + date share the line below it
    node.append(el("div", { class:"cv-item-title-row" }, titleSpan()));
    node.append(el("div", { class:"cv-item-sub-row" },
      el("span", {
        class:"cv-item-sub editable", "data-path":`items:${item.id}:sub`, contenteditable:"true",
      }, item.sub),
      dateSpan(),
    ));
  } else {
    // No subtitle: title and date share one line
    node.append(el("div", { class:"cv-item-head" }, titleSpan(), dateSpan()));
  }

  node.append(el("div", {
    class:"cv-item-body editable", "data-path":`items:${item.id}:body`, contenteditable:"true",
  }, item.body ? item.body : el("span", { class:"empty-ph" }, "Description / bullets...")));
  return node;
}
function renderSimpleList(sec){
  const ul = el("ul", { class:"cv-simple" });
  (sec.items || []).forEach((it, i) => {
    if (!it && i !== (sec.items.length - 1)) return;
    ul.append(el("li", {
      class:"editable", "data-path":`list:${sec.id}:${i}`, contenteditable:"true",
    }, it || el("span", { class:"empty-ph" }, "Item")));
  });
  return ul;
}
function renderSkills(sec){
  const ul = el("ul", { class:"cv-skills" });
  (sec.groups || []).forEach((g, gi) => {
    const li = el("li", { class:"editable", "data-path":`skg:${g.id}:label`, contenteditable:"true" });
    li.append(el("span", { class:"k" }, g.label || "Group"), ": ");
    li.append(document.createTextNode((g.items||[]).filter(Boolean).join(", ") || "—"));
    ul.append(li);
  });
  return ul;
}

/* =========================================================
   INLINE EDITING ON PREVIEW
   Map data-path -> {get, set} and persist as the user types.
   ========================================================= */
function getByPath(path){
  const [kind, id, field] = path.split(":");
  if (kind === "personal") return { obj: state.personal, field: id };
  if (kind === "sections"){
    const s = state.sections.find(x => x.id === id);
    return s ? { obj: s, field } : null;
  }
  if (kind === "items"){
    for (const s of state.sections){
      const it = (s.items||[]).find(x => x.id === id);
      if (it) return { obj: it, field };
    }
  }
  if (kind === "list"){
    const s = state.sections.find(x => x.id === id);
    if (!s) return null;
    return {
      obj: { __index: Number(field) },
      field: "value",
      proxyGet: () => s.items[Number(field)] ?? "",
      proxySet: (v) => { s.items[Number(field)] = v; },
    };
  }
  if (kind === "skg"){
    for (const s of state.sections){
      const g = (s.groups||[]).find(x => x.id === id);
      if (g) return { obj: g, field };
    }
  }
  return null;
}
function attachInlineEditing(){
  for (const node of $$(".editable", $("#cv"))){
    node.addEventListener("blur", () => commitInline(node));
    node.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey && node.dataset.path.startsWith("personal") === false
          && !node.classList.contains("cv-summary")
          && !node.classList.contains("cv-item-body")){
        e.preventDefault();
        node.blur();
      }
    });
  }
}
function commitInline(node){
  const path = node.dataset.path;
  if (!path) return;
  const text = node.innerText.replace(/\u00A0/g, " ").trim();
  const info = getByPath(path);
  if (!info) return;

  // Handle placeholders
  if (info.proxySet){
    info.proxySet(text);
  } else {
    info.obj[info.field] = text;
  }
  saveState();

  // Update editor fields (without re-rendering the whole preview while user is typing nearby)
  syncEditorFromState();
  // Re-render preview to keep placeholders & formatting consistent, but preserve focus less aggressively
  renderPreview();
}
function syncEditorFromState(){
  for (const input of $$("[data-field]")){
    const f = input.dataset.field;
    if (input.value !== (state.personal[f] ?? "")) input.value = state.personal[f] ?? "";
  }
}

/* =========================================================
   TOP BAR ACTIONS
   ========================================================= */
$("#btn-load-sample").addEventListener("click", () => {
  if (state.sections.length && !confirm("Replace current CV with the sample?")) return;
  state = sampleData();
  saveState();
  renderEditor(); renderPreview();
});
$("#btn-clear").addEventListener("click", () => {
  if (!confirm("Clear all fields? This cannot be undone.")) return;
  state = defaultData();
  saveState();
  renderEditor(); renderPreview();
});
$("#btn-print").addEventListener("click", () => {
  // ensure no stray empty-ph text prints
  $$(".empty-ph").forEach(n => n.textContent = "");
  window.print();
});
$("#btn-export-json").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = (state.personal.name || "cv").replace(/[^\w\d]+/g,"-").toLowerCase() + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
});
$("#input-import-json").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try{
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.personal || !Array.isArray(data.sections)) throw new Error("Invalid file");
    state = data;
    saveState();
    renderEditor(); renderPreview();
  } catch(err){
    alert("Could not read JSON file: " + err.message);
  } finally {
    e.target.value = "";
  }
});
$("#btn-add-section").addEventListener("click", () => {
  const type = $("#add-section-type").value;
  state.sections.push(newSection(type));
  renderEditor(); renderPreview(); saveState();
});

/* Zoom */
$("#zoom").addEventListener("input", e => {
  const z = Number(e.target.value) / 100;
  $("#cv").style.transform = `scale(${z})`;
});

/* Sidebar toggle — works the same way on mobile and desktop */
const sidebarToggleBtn = $("#btn-toggle-sidebar");
const sidebarCloseBtn  = $("#btn-close-sidebar");
const sidebarBackdrop  = $("#sidebar-backdrop");

function setSidebarOpen(open){
  document.body.classList.toggle("sidebar-collapsed", !open);
  sidebarToggleBtn.setAttribute("aria-pressed", String(open));
}
function isSidebarOpen(){ return !document.body.classList.contains("sidebar-collapsed"); }

sidebarToggleBtn.addEventListener("click", () => setSidebarOpen(!isSidebarOpen()));
sidebarCloseBtn.addEventListener("click", () => setSidebarOpen(false));
sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && window.innerWidth <= 960 && isSidebarOpen()) setSidebarOpen(false);
});

/* =========================================================
   BOOT
   ========================================================= */
renderEditor();
renderPreview();


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
    const lines = text.split('\n');
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

