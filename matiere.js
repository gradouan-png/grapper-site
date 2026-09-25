/* ── La matière : du métal liquide, calculé image par image sur la carte
   graphique (WebGL, raymarching). Des sphères qui fusionnent (union lisse),
   éclairées par un environnement violet / lime, avec un reflet de Fresnel et
   un voile blanc satiné sur les bords, aux couleurs du logo. La souris attire
   une goutte ; l'énergie règle la vitesse. Sans WebGL, le liquide 2D reprend. */
(function () {
  const toile = document.getElementById("grappe");
  const gl = toile.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: Boolean(window.MATIERE_CAPTURE) });
  if (!gl) { window.MATIERE_WEBGL = false; return; }
  window.MATIERE_WEBGL = true;
  toile.closest(".hero").classList.add("webgl");

  const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FS = `
precision highp float;
uniform vec2 R; uniform float T; uniform vec2 M; uniform float E; uniform int S; uniform float C;
uniform vec3 G[16];

float sm(float a, float b, float k){ float h = clamp(.5 + .5*(b-a)/k, 0., 1.); return mix(b, a, h) - k*h*(1.-h); }
float sdf(vec3 p){
  float d = 1e9;
  float r = mix(0.11, 0.30, C), k = mix(0.08, 0.42, C);
  for (int i = 0; i < 16; i++) { d = sm(d, length(p - G[i]) - (r + 0.10*C*float(i==0)), k); }
  return d;
}
vec3 nrm(vec3 p){ vec2 e = vec2(.002, 0.); return normalize(vec3(sdf(p+e.xyy)-sdf(p-e.xyy), sdf(p+e.yxy)-sdf(p-e.yxy), sdf(p+e.yyx)-sdf(p-e.yyx))); }
/* l'environnement : un ciel violet en haut, lime rasant en bas, un spot blanc */
vec3 env(vec3 d){
  /* l'environnement aux couleurs du logo : le violet Grapper (#6828f8) et du blanc, rien d'autre */
  float h = d.y*.5+.5;
  vec3 c = mix(vec3(.10,.03,.30), vec3(.41,.16,.97), smoothstep(.1,.95,h));
  c += vec3(1.) * pow(max(0., dot(d, normalize(vec3(.45,.8,.35)))), 28.) * 2.4;
  c += vec3(1.) * pow(max(0., dot(d, normalize(vec3(-.7,-.3,.6)))), 60.) * .9;
  c += vec3(.62,.45,1.) * pow(max(0., dot(d, normalize(vec3(.8,-.2,-.5)))), 10.) * .5;
  return c;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - .5*R) / R.y;
  vec3 ro = vec3(0., 0., 5.6);
  vec3 rd = normalize(vec3(uv, -1.9));
  float t = 0., d;
  vec3 p;
  bool hit = false;
  for (int i = 0; i < 56; i++) { p = ro + rd*t; d = sdf(p); if (d < .003) { hit = true; break; } t += d; if (t > 9.) break; }
  if (!hit) { gl_FragColor = vec4(0.); return; }
  vec3 n = nrm(p);
  vec3 v = -rd;
  float fres = pow(1. - max(0., dot(n, v)), 3.);
  vec3 refl = reflect(rd, n);
  vec3 violet = vec3(.41,.16,.97);
  vec3 col;
  if (S == 0) {
    /* chrome : le métal liquide, reflets d'environnement, bords satinés */
    vec3 base = mix(violet, vec3(.86,.80,1.), fres);
    col = mix(base * (0.45 + 0.55*env(n)), env(refl), 0.5 + 0.45*fres);
    col += vec3(1.) * fres * fres * .35;
  } else if (S == 1) {
    /* velours : mat, profond, la lumière n'accroche que les bords */
    float lum = max(0., dot(n, normalize(vec3(.4,.8,.5))));
    col = violet * (0.18 + 0.55*lum);
    col += vec3(.75,.62,1.) * pow(fres, 1.6) * .9;
  } else if (S == 2) {
    /* verre dépoli : translucide, l'environnement passe à travers, un liseré blanc */
    vec3 refr = refract(rd, n, 0.72);
    col = mix(violet * .35, env(refr) * .8 + violet * .25, 0.6);
    col += vec3(1.) * pow(fres, 2.) * .8;
    col *= 0.85;
  } else {
    /* plastique : la couleur pleine du logo, un reflet blanc net et petit */
    float lum = max(0., dot(n, normalize(vec3(.4,.8,.5))));
    vec3 h = normalize(normalize(vec3(.4,.8,.5)) + v);
    col = violet * (0.35 + 0.65*lum);
    col += vec3(1.) * pow(max(0., dot(n, h)), 90.) * 1.2;
    col += vec3(.7,.6,1.) * fres * .25;
  }
  col = pow(col, vec3(.92));
  gl_FragColor = vec4(col, 1.);
}`;
  function shader(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); } return s; }
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uS = gl.getUniformLocation(prog, "S"), uC = gl.getUniformLocation(prog, "C");
  const uR = gl.getUniformLocation(prog, "R"), uT = gl.getUniformLocation(prog, "T"), uM = gl.getUniformLocation(prog, "M"), uG = gl.getUniformLocation(prog, "G"), uE = gl.getUniformLocation(prog, "E");

  let souris = { x: null, y: null };
  const hero = toile.closest(".hero");
  hero.addEventListener("pointermove", (e) => { const b = toile.getBoundingClientRect(); souris = { x: (e.clientX - b.left) / b.width, y: (e.clientY - b.top) / b.height }; });
  hero.addEventListener("pointerleave", () => { souris = { x: null, y: null }; });

  const gouttes = Array.from({ length: 16 }, (_, i) => ({ a: i * 0.9 + (i > 7 ? 0.45 : 0), v: 0.5 + (i % 3) * 0.25, r: 0.5 + (i % 4) * 0.35, x: 0, y: 0, z: 0 }));
  /* La résolution s'adapte à la machine : on part à 1×, et si les images
     mettent trop longtemps (ordinateur sans vraie carte graphique), on
     descend à 0,75× puis 0,5×. Le liquide est doux, l'agrandissement ne se
     voit pas ; la fluidité, si. */
  let echelle = 1;
  function tailler() {
    const dpr = Math.min(1.25, window.devicePixelRatio || 1) * echelle;
    toile.width = Math.max(1, Math.floor(toile.clientWidth * dpr)); toile.height = Math.max(1, Math.floor(toile.clientHeight * dpr));
    gl.viewport(0, 0, toile.width, toile.height);
  }
  tailler(); window.addEventListener("resize", tailler);
  let visible = true, derniere = 0, lentes = 0, mesures = 0;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0.02 }).observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) derniere = 0; });

  function boucle(t) {
    /* hors écran ou onglet caché : on ne calcule rien */
    if (!visible || document.hidden) { derniere = 0; requestAnimationFrame(boucle); return; }
    if (derniere) {
      const dt = t - derniere; mesures++;
      if (dt > 34) lentes++; /* moins de 30 images par seconde */
      if (mesures === 90) { if (lentes > 30 && echelle > 0.5) { echelle = echelle === 1 ? 0.75 : 0.5; tailler(); } mesures = 0; lentes = 0; }
    }
    derniere = t;
    const e = (window.NIVEAU_ENERGIE ?? 0.7);
    const s = t * 0.001 * (0.25 + e * 1.1);
    /* téléphone : la matière est un bandeau, centrée ; tablette : à droite, plus près ; bureau : à droite */
    const w = window.innerWidth;
    const cx = window.MATIERE_CENTRE ? window.MATIERE_CENTRE.cx : (w <= 700 ? 0 : w <= 1100 ? 1.5 : 1.35), cy = window.MATIERE_CENTRE ? window.MATIERE_CENTRE.cy : 0.1;
    const C = window.COHESION ?? 1;
    const etroit = window.innerWidth <= 700;
    const G = new Float32Array(48);
    gouttes.forEach((g, i) => {
      /* éparse : les orbites s'ouvrent (jusqu'à tout l'écran) ; unie : elles se resserrent */
      const ouverture = (0.9 + (1 - C) * 1.9) * (etroit ? 0.75 : window.innerWidth <= 1100 ? 0.7 : 1);
      const ax = cx * (1 - (1 - C) * 0.55) + Math.cos(s * g.v + g.a) * g.r * ouverture;
      const ay = cy + Math.sin(s * g.v * 1.3 + g.a * 1.7) * g.r * 0.55 * (1 + (1 - C) * 1.6);
      const az = Math.sin(s * g.v * 0.7 + g.a) * 0.5;
      const k = 0.04 + e * 0.05;
      g.x += (ax - g.x) * k; g.y += (ay - g.y) * k; g.z += (az - g.z) * k;
      if (i === 0 && souris.x !== null) {
        const asp = toile.clientWidth / toile.clientHeight;
        const mx = (souris.x - 0.5) * 2 * asp * 2.95 / 1.9, my = (0.5 - souris.y) * 2 * 2.95 / 1.9;
        g.x += (mx - g.x) * 0.15; g.y += (my - g.y) * 0.15; g.z += (0.6 - g.z) * 0.1;
      }
      G[i * 3] = g.x; G[i * 3 + 1] = g.y; G[i * 3 + 2] = g.z;
    });
    gl.uniform1i(uS, window.MATIERE_STYLE ?? 0); gl.uniform1f(uC, C);
    gl.uniform2f(uR, toile.width, toile.height); gl.uniform1f(uT, s); gl.uniform1f(uE, e);
    gl.uniform2f(uM, souris.x ?? -1, souris.y ?? -1); gl.uniform3fv(uG, G);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);

  /* La texture retenue par Gauthier : le plastique. Les autres (chrome, velours,
     verre dépoli) restent dans le shader, S = 0, 1, 2. */
  window.MATIERE_STYLE = 3;
})();
