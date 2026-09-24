/* ── Les talents ──────────────────────────────────────────────────────────
   `photo` est FACULTATIF. Sans photo, le grain et la carte sont typographiques :
   initiales, pseudo, plateforme, univers. Mets une photo quand tu en as une. */
window.TALENTS = [
  /* Dix créatrices. `photo` est facultatif (mets le fichier dans photos/).
     `lien` : son Instagram ou TikTok. `univers` : deux ou trois mots. */
  { nom: "Anaïs",  pseudo: "@anaiswairyy",  univers: "Haircare, skincare",    plateforme: "Tiktok", lien: "https://www.instagram.com/", photo: "" },
  { nom: "Lily",  pseudo: "@lilyy.nl",  univers: "food · cuisine",   plateforme: "TikTok",    lien: "https://www.tiktok.com/",    photo: "" },
  { nom: "Laura",  pseudo: "@laudewit",  univers: "mode · street",        plateforme: "Instagram", lien: "https://www.instagram.com/", photo: "" },
  { nom: "Lucie",  pseudo: "@luciehzh",  univers: "sport · running",    plateforme: "YouTube",   lien: "https://www.youtube.com/",   photo: "" },
  { nom: "Chachou",  pseudo: "@chachouxchachou",  univers: "voyage · outdoor",   plateforme: "Instagram", lien: "https://www.instagram.com/", photo: "" },
  { nom: "Francesca",  pseudo: "@francesca.skincare",  univers: "tech · gaming",  plateforme: "TikTok",    lien: "https://www.tiktok.com/",    photo: "" },
  { nom: "Maeva",  pseudo: "@byvavou",  univers: "famille · maison",     plateforme: "Instagram", lien: "https://www.instagram.com/", photo: "" },
  { nom: "Orane",  pseudo: "@___oraane",  univers: "humour · sketchs",  plateforme: "Instagram", lien: "https://www.instagram.com/", photo: "" },
  { nom: "Sarah",  pseudo: "@sarah.bdii",  univers: "musique · scène",        plateforme: "TikTok",    lien: "https://www.tiktok.com/",    photo: "" },
  { nom: "Marine", pseudo: "@marinegxmes", univers: "bien-être · yoga", plateforme: "Instagram", lien: "https://www.instagram.com/", photo: "" },
];

/* Les mots de la grappe, mêlés aux talents : ce que l'agence fait pour eux.
   Vide la liste si tu veux une grappe de talents seulement. */
/* Les étapes d'une collab, dans l'ordre : clique un créateur dans la grappe
   et elles viennent se poser sur lui, une par une. */
window.ETAPES = ["brief", "contrat", "script", "validation", "post", "facture", "paiement"];

/* Une journée chez Grapper : le ruban. Pas une photo, que des faits. */
window.JOURNEE = [
  { heure: "07:40", quoi: "Brief reçu",            qui: "@lea.cuisine × Marque Une",   type: "marque" },
  { heure: "08:15", quoi: "Contrat envoyé",         qui: "@maxfit × Marque Deux",       type: "contrat" },
  { heure: "09:12", quoi: "Script validé",          qui: "par la marque, sans retouche", type: "ok" },
  { heure: "10:03", quoi: "Preview déposée",        qui: "@camille.lit, 38 secondes",   type: "prod" },
  { heure: "11:30", quoi: "Retour marque",          qui: "« l'end card, 9:16 »",        type: "marque" },
  { heure: "12:45", quoi: "Post en ligne",          qui: "@ines.mode, code ad posé",    type: "ok" },
  { heure: "14:20", quoi: "Facture envoyée",        qui: "Marque Trois, 30 jours",      type: "contrat" },
  { heure: "16:05", quoi: "Paiement reçu",          qui: "et le créateur prévenu",      type: "ok" },
  { heure: "17:30", quoi: "Gifting proposé",        qui: "à toute la grappe",           type: "prod" },
  { heure: "19:00", quoi: "Rien à relancer",        qui: "on ferme.",                   type: "fin" },
];

window.MARQUES = [
  "MARQUE UNE", "MARQUE DEUX", "MARQUE TROIS", "MARQUE QUATRE",
  "MARQUE CINQ", "MARQUE SIX", "MARQUE SEPT", "MARQUE HUIT",
];
