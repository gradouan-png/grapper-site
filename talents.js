/* ── Les talents ──────────────────────────────────────────────────────────
   `photo` est FACULTATIF. Sans photo, le grain et la carte sont typographiques :
   initiales, pseudo, plateforme, univers. Mets une photo quand tu en as une. */
window.TALENTS = [
  /* Dix créatrices. `photo` est facultatif (mets le fichier dans photos/).
     `lien` : son Instagram ou TikTok. `univers` : deux ou trois mots. */
  { nom: "Anaïs",  pseudo: "@anaiswairyy",  univers: "haircare · skincare",   plateforme: "TikTok", lien: "https://www.tiktok.com/@anaiswairyy", photo: "photos/anais.jpg" },
  { nom: "Lily",  pseudo: "@lilyy.nl",  univers: "make-up · skincare · DIY",   plateforme: "TikTok",    lien: "https://www.tiktok.com/@lilyy.nl",    photo: "photos/lily.jpg" },
  { nom: "Laura",  pseudo: "@laudewit",  univers: "skincare · haircare · sport",        plateforme: "TikTok", lien: "https://www.tiktok.com/@laudewit", photo: "photos/laura.jpg" },
  { nom: "Lucie",  pseudo: "@luciehzh",  univers: "études · skincare · sport",    plateforme: "TikTok",   lien: "https://www.tiktok.com/@luciehzh",   photo: "photos/lucie.jpg" },
  { nom: "Chachou",  pseudo: "@chachouxchachou",  univers: "beauté · lifestyle · humour",   plateforme: "TikTok", lien: "https://www.tiktok.com/@chachouxchachou", photo: "photos/chachou.jpg" },
  { nom: "Francesca",  pseudo: "@francesca.skincare",  univers: "skincare · haircare",  plateforme: "TikTok",    lien: "https://www.tiktok.com/@francesca.skincare",    photo: "photos/francesca.jpg" },
  { nom: "Maeva",  pseudo: "@byvavou",  univers: "skincare · sport",     plateforme: "TikTok", lien: "https://www.tiktok.com/@byvavou", photo: "photos/maeva.jpg" },
  { nom: "Orane",  pseudo: "@___oraane",  univers: "études · sport · skincare",  plateforme: "TikTok", lien: "https://www.tiktok.com/@___oraane", photo: "photos/orane.jpg" },
  { nom: "Sarah",  pseudo: "@sarah.bdii",  univers: "skincare · haircare · make-up",        plateforme: "TikTok",    lien: "https://www.tiktok.com/@sarah.bdii",    photo: "photos/sarah.jpg" },
  { nom: "Marine", pseudo: "@marinegxmes", univers: "sport · outfit · beauté", plateforme: "TikTok", lien: "https://www.tiktok.com/@marinegxmes", photo: "photos/marine.jpg" },
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
  "Prime Video", "Avène", "Urgo", "Nike", "ESR", "Holy", "NYX", "Erborian", "Sanytol",
  "Shark", "Emma", "CyberGhost", "iGraal", "Aroma-Zone", "Fruitz", "Haus Labs",
  "Monopoly Go", "Burger King", "McDonald's", "Jow", "DOP", "Soundcore", "Shokz",
  "CapCut", "Nocibé", "Sephora", "Tinder", "Dreame", "Biodance", "SKIN1004",
  "Garnier", "Mixa", "Ducray", "Miniso", "Hema", "DJI",
];

/* Celles qui tournent dans l'anneau (toutes n'y tiendraient pas lisiblement) ;
   la liste complète s'affiche en pastilles dessous. */
window.MARQUES_ANNEAU = ["Sephora", "Nike", "Prime Video", "Burger King", "McDonald's", "Garnier", "NYX", "Tinder", "Nocibé", "CapCut"];

