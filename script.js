const talents = window.TALENTS || [];
const marques = window.MARQUES || [];
const racine = document.documentElement;

/* ── Le curseur : le point suit, l'anneau rattrape ───────────────────────── */
const point = document.querySelector(".curseur-point");
const anneau = document.querySelector(".curseur-anneau");
let sx = innerWidth / 2, sy = innerHeight / 2, ax = sx, ay = sy;
window.addEventListener("pointermove", (e) => { sx = e.clientX; sy = e.clientY; point.style.left = `${sx}px`; point.style.top = `${sy}px`; });
(function suivre() {
  ax += (sx - ax) * 0.18; ay += (sy - ay) * 0.18;
  anneau.style.left = `${ax}px`; anneau.style.top = `${ay}px`;
  requestAnimationFrame(suivre);
})();
document.addEventListener("pointerover", (e) => { document.body.classList.toggle("sur-lien", Boolean(e.target.closest("a, button, .carte, .creatrice, input"))); });

/* ── L'énergie ───────────────────────────────────────────────────────────── */
const energie = document.getElementById("energie");
const sortie = document.getElementById("energie-valeur");
let niveau = 0.7;
function poserEnergie(v) {
  niveau = Math.max(0, Math.min(100, Number(v))) / 100;
  sortie.value = Math.round(niveau * 100);
  racine.style.setProperty("--vitesse", niveau === 0 ? 0.0001 : (0.3 + niveau * 1.7).toFixed(2));
  racine.style.setProperty("--gris", niveau === 0 ? 1 : 0);
  try { localStorage.setItem("energie", String(Math.round(niveau * 100))); } catch {}
}
try { const m = localStorage.getItem("energie"); if (m !== null) energie.value = m; } catch {}
poserEnergie(energie.value);
energie.addEventListener("input", () => poserEnergie(energie.value));

/* ── Le menu (téléphone) ─────────────────────────────────────────────────── */
const menu = document.getElementById("menu");
const boutonMenu = document.getElementById("ouvrir-menu");
function basculerMenu(ouvrir) {
  const etat = ouvrir ?? !menu.classList.contains("ouvert");
  menu.classList.toggle("ouvert", etat);
  menu.setAttribute("aria-hidden", String(!etat));
  boutonMenu.setAttribute("aria-expanded", String(etat));
  document.body.style.overflow = etat ? "hidden" : "";
}
boutonMenu.addEventListener("click", () => basculerMenu());
menu.querySelectorAll("[data-ferme]").forEach((a) => a.addEventListener("click", () => basculerMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") basculerMenu(false); });

/* ── La matière : des gouttes violettes qui fusionnent (metaballs) ────────
   Le canvas est flouté puis contrasté par le CSS (.goo) : les gouttes
   deviennent une matière liquide, avec des bords nets. Elles dérivent, se
   rejoignent, se séparent ; la souris en attire une. C'est la grappe. */
const toile = document.getElementById("grappe");
const ctx = toile.getContext("2d");
let largeur = 0, hauteur = 0;
let souris = { x: null, y: null };
const gouttes = [];
function tailler() {
  const dpr = 1; /* flouté ensuite : inutile de dessiner fin */
  largeur = toile.clientWidth; hauteur = toile.clientHeight;
  toile.width = largeur * dpr; toile.height = hauteur * dpr;
}
tailler(); window.addEventListener("resize", tailler);
const N = 9;
for (let i = 0; i < N; i++) {
  gouttes.push({
    x: largeur * (0.55 + Math.random() * 0.4), y: hauteur * (0.2 + Math.random() * 0.6),
    r: 70 + Math.random() * 90, a: Math.random() * Math.PI * 2, v: 0.4 + Math.random() * 0.6,
    teinte: "#ffffff",
  });
}
toile.closest(".hero").addEventListener("pointermove", (e) => { const b = toile.getBoundingClientRect(); souris = { x: e.clientX - b.left, y: e.clientY - b.top }; });
toile.closest(".hero").addEventListener("pointerleave", () => { souris = { x: null, y: null }; });
function boucle(t) {
  ctx.clearRect(0, 0, largeur, hauteur);
  const cx = largeur * (window.innerWidth < 900 ? 0.5 : 0.72), cy = hauteur * 0.48;
  gouttes.forEach((g, i) => {
    /* une dérive lente autour du cœur, chacune sur son orbite */
    const orbite = 90 + (i % 4) * 70;
    const ax = cx + Math.cos(t / (9000 / g.v) + g.a) * orbite;
    const ay = cy + Math.sin(t / (7000 / g.v) + g.a * 1.3) * orbite * 0.7;
    const k = 0.012 + niveau * 0.02;
    g.x += (ax - g.x) * k; g.y += (ay - g.y) * k;
    /* la première goutte suit la souris */
    if (i === 0 && souris.x !== null) { g.x += (souris.x - g.x) * 0.12; g.y += (souris.y - g.y) * 0.12; }
    const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
    grad.addColorStop(0, "#fff"); grad.addColorStop(0.55, "rgba(255,255,255,.6)"); grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.fill();
  });
  requestAnimationFrame(boucle);
}
requestAnimationFrame(boucle);

/* ── Apparitions : lignes du titre, blocs ────────────────────────────────── */
const obs = new IntersectionObserver((entrees) => {
  entrees.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vu"); obs.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal, .lignes").forEach((el) => obs.observe(el));

/* ── Les boutons aimantés ────────────────────────────────────────────────── */
document.querySelectorAll(".aimant").forEach((b) => {
  b.addEventListener("pointermove", (e) => {
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * 0.35 * niveau, dy = (e.clientY - r.top - r.height / 2) * 0.35 * niveau;
    b.style.transform = `translate(${dx}px, ${dy}px)`;
    b.querySelector("span").style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`;
  });
  b.addEventListener("pointerleave", () => { b.style.transform = ""; b.querySelector("span").style.transform = ""; });
});

/* ── Le bento : la lumière suit la souris, le chiffre se compte ──────────── */
document.querySelectorAll(".carte").forEach((c) => {
  c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`); });
});
const compteurs = document.querySelectorAll("[data-compte]");
const obsCompte = new IntersectionObserver((entrees) => {
  entrees.forEach((e) => {
    if (!e.isIntersecting) return; obsCompte.unobserve(e.target);
    const cible = Number(e.target.dataset.compte), suffixe = e.target.dataset.suffixe || "", debut = performance.now();
    if (!cible) return; /* pas encore renseigné : on laisse le tiret */
    const prefixe = e.target.dataset.prefixe || "";
    const tick = (t) => { const p = Math.min(1, (t - debut) / 1400), v = Math.round(cible * (1 - Math.pow(1 - p, 3))); e.target.textContent = prefixe + v.toLocaleString("fr-FR") + suffixe; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
compteurs.forEach((c) => obsCompte.observe(c));

/* ── Nos créatrices : une carte par personne, photo si elle existe ─────── */
const initiale = (t) => (t.nom || t.pseudo || "?").replace(/^@/, "")[0].toUpperCase();
document.getElementById("creatrices-grille").innerHTML = talents.map((t, i) => `
  <a class="creatrice reveal" href="${t.lien || "#"}" target="_blank" rel="noopener" style="--i:${i}">
    <div class="creatrice-visu">${t.photo ? `<img src="${t.photo}" alt="${t.nom}" loading="lazy">` : `<span>${initiale(t)}</span>`}</div>
    <div class="creatrice-texte">
      <b>${t.nom}</b>
      <span>${t.pseudo || ""}</span>
      <small>${[t.univers, t.plateforme].filter(Boolean).join(" · ")}</small>
    </div>
  </a>`).join("");
document.querySelectorAll(".creatrice").forEach((el) => obs.observe(el));

/* ── L'anneau des marques ────────────────────────────────────────────────── */
const anneauTexte = document.getElementById("anneau-textpath");
anneauTexte.textContent = marques.join("  ·  ") + "  ·  ";
anneauTexte.setAttribute("textLength", String(Math.round(2 * Math.PI * 160)));
anneauTexte.setAttribute("lengthAdjust", "spacingAndGlyphs");
document.getElementById("marques-liste").innerHTML = marques.map((m) => `<li>${m}</li>`).join("");

/* ── L'adresse qui frémit ────────────────────────────────────────────────── */
const mail = document.querySelector("#mail span");
mail.innerHTML = [...mail.textContent].map((c) => `<i class="lettre">${c}</i>`).join("");
mail.addEventListener("pointerenter", () => {
  mail.querySelectorAll(".lettre").forEach((l, i) => {
    l.style.transitionDelay = `${i * 16}ms`; l.style.transform = `translateY(${(i % 2 ? -1 : 1) * 6 * niveau}px)`;
    setTimeout(() => { l.style.transform = ""; }, 400 + i * 16);
  });
});
