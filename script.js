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

/* ── L'énergie : fixée à 100. Le curseur est parti de l'en-tête (Gauthier,
   25 septembre) ; la mécanique reste, `niveau` pilote toujours tout. ── */
let niveau = 1;
window.NIVEAU_ENERGIE = niveau;

/* ── Réunir la grappe : le visiteur arrive sur des gouttes éparses, et c'est
   lui qui les réunit. Rien n'est retenu : le geste est le message. ──────── */
const cohesion = document.getElementById("cohesion");
const reunir = document.getElementById("reunir");
const reunirMot = document.getElementById("reunir-mot");
window.COHESION = 0;
if (cohesion) {
  reunir.classList.add("attente");
  cohesion.value = 0; /* Chrome restaure la valeur d'un rechargement : non, on repart de zéro */
  const poser = (v) => {
    const c = Math.max(0, Math.min(100, Number(v)));
    window.COHESION = c / 100;
    cohesion.style.setProperty("--p", `${c}%`);
    const uni = c >= 92;
    reunir.classList.toggle("uni", uni);
    reunirMot.innerHTML = uni ? "Une grappe. <b>C'est ça, Grapper.</b>"
      : c > 40 ? "Ça pousse. <b>Continue.</b>"
      : "Des grains. <b>Fais-en une grappe.</b>";
  };
  poser(0);
  cohesion.addEventListener("input", () => { reunir.classList.remove("attente"); poser(cohesion.value); });
}

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
if (!window.MATIERE_WEBGL) {
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

}

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

/* ── Le manège des marques ───────────────────────────────────────────────── */
const logos = window.LOGOS || {};
const tuile = (m) => `<div class="tuile" data-nom="${m}"><span>${m}</span></div>`;
const anneaux = [document.getElementById("anneau-haut"), document.getElementById("anneau-bas")].filter(Boolean);
if (anneaux.length) {
  const moitie = Math.ceil(marques.length / 2);
  const parts = [marques.slice(0, moitie), marques.slice(moitie)];
  const etat = anneaux.map((a, k) => {
    a.innerHTML = parts[k].map(tuile).join("");
    const tuiles = [...a.children]; const n = tuiles.length;
    const rayon = Math.round((52 + 8) / Math.tan(Math.PI / n)); /* la tuile fait 104 px, on laisse 16 px entre deux */
    tuiles.forEach((el, i) => { el.style.transform = `rotateY(${(360 / n) * i}deg) translateZ(${rayon}px)`; });
    return { a, tuiles, n, angle: k === 0 ? 0 : 180 / n, vitesse: k === 0 ? 0.08 : -0.06, rayon };
  });
  const nom = document.getElementById("manege-nom");
  let tenu = false, dernierX = 0, elan = 0;
  const scene = document.querySelector(".manege-scene");
  scene.addEventListener("pointerdown", (e) => { tenu = true; dernierX = e.clientX; elan = 0; scene.setPointerCapture(e.pointerId); });
  scene.addEventListener("pointermove", (e) => { if (!tenu) return; const dx = e.clientX - dernierX; dernierX = e.clientX; elan = dx * 0.35; etat.forEach((r) => { r.angle += dx * 0.35; }); });
  const lacher = () => { tenu = false; };
  scene.addEventListener("pointerup", lacher); scene.addEventListener("pointercancel", lacher);
  let pause = false, aLEcran = true;
  scene.addEventListener("pointerenter", () => { pause = true; }); scene.addEventListener("pointerleave", () => { pause = false; });
  new IntersectionObserver((e) => { aLEcran = e[0].isIntersecting; }, { threshold: 0.05 }).observe(scene);
  let image = 0;
  (function tourner() {
    if (!aLEcran || document.hidden) { requestAnimationFrame(tourner); return; }
    image++;
    etat.forEach((r) => {
      if (!tenu) { r.angle += pause && !elan ? 0 : r.vitesse + elan; }
      r.a.style.transform = `rotateY(${r.angle}deg)`;
      /* la tuile de face est plus vive, celles de derrière s'estompent */
      if (image % 3 === 0) r.tuiles.forEach((el, i) => {
        const a = (((360 / r.n) * i + r.angle) % 360 + 360) % 360;
        const face = Math.cos(a * Math.PI / 180); /* 1 devant, -1 derrière */
        el.style.opacity = String(0.25 + 0.75 * Math.max(0, face));
      });
    });
    elan *= 0.94; if (Math.abs(elan) < 0.02) elan = 0;
    /* le nom de la marque qui passe devant, sur l'anneau du haut */
    const r = etat[0]; let meilleur = 0, meilleurFace = -2;
    r.tuiles.forEach((el, i) => { const a = (((360 / r.n) * i + r.angle) % 360 + 360) % 360; const f = Math.cos(a * Math.PI / 180); if (f > meilleurFace) { meilleurFace = f; meilleur = i; } });
    nom.textContent = r.tuiles[meilleur].dataset.nom;
    requestAnimationFrame(tourner);
  })();
}
const defileMarques = document.getElementById("marques-defile");
if (defileMarques) defileMarques.innerHTML = [...marques, ...marques].map((m) => `<span>${m}</span>`).join("");

/* ── L'adresse qui frémit ────────────────────────────────────────────────── */
const mail = document.querySelector("#mail span");
mail.innerHTML = [...mail.textContent].map((c) => `<i class="lettre">${c}</i>`).join("");
mail.addEventListener("pointerenter", () => {
  mail.querySelectorAll(".lettre").forEach((l, i) => {
    l.style.transitionDelay = `${i * 16}ms`; l.style.transform = `translateY(${(i % 2 ? -1 : 1) * 6 * niveau}px)`;
    setTimeout(() => { l.style.transform = ""; }, 400 + i * 16);
  });
});

/* ── Copier l'adresse : un clic, et le bouton le dit ─────────────────────── */
const copier = document.getElementById("copier");
if (copier) copier.addEventListener("click", async () => {
  const adresse = copier.dataset.adresse; const mot = copier.querySelector("span");
  try { await navigator.clipboard.writeText(adresse); mot.textContent = "Copiée ✓"; }
  catch { /* navigateur sans presse-papiers : on sélectionne l'adresse, Cmd + C fera le reste */
    const zone = document.querySelector("#mail span"); const sel = window.getSelection(); const r = document.createRange();
    r.selectNodeContents(zone); sel.removeAllRanges(); sel.addRange(r); mot.textContent = "Sélectionnée, Cmd + C";
  }
  copier.classList.add("fait");
  setTimeout(() => { mot.textContent = "Copier l'adresse"; copier.classList.remove("fait"); }, 1800);
});

/* ── L'aperçu de l'espace : quatre écrans qui se relaient ────────────────── */
const apercu = document.getElementById("apercu");
if (apercu) {
  const vues = [...apercu.querySelectorAll(".apercu-vue")];
  const points = [...apercu.querySelectorAll(".apercu-points i")];
  const titre = document.getElementById("apercu-titre");
  let i = 0, minuteur = 0;
  const montrer = (k) => {
    vues[i].classList.remove("actif"); vues[i].classList.add("sort"); const ancien = i;
    setTimeout(() => vues[ancien].classList.remove("sort"), 500);
    i = k; vues[i].classList.add("actif"); titre.innerHTML = vues[i].dataset.titre;
    points.forEach((p, n) => p.classList.toggle("actif", n === i));
  };
  const tourner = () => { minuteur = setInterval(() => { if (niveau > 0) montrer((i + 1) % vues.length); }, 2600); };
  tourner();
  /* la souris arrête le défilé, un clic sur un point choisit l'écran */
  apercu.addEventListener("pointerenter", () => clearInterval(minuteur));
  apercu.addEventListener("pointerleave", tourner);
  points.forEach((p, n) => p.addEventListener("click", () => montrer(n)));
}
