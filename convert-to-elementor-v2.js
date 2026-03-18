#!/usr/bin/env node
/**
 * convert-to-elementor-v2.js — v5
 * Le o index.html, aplica imagens reais, links WhatsApp,
 * footer atualizado, overrides WP e fixes mobile.
 */

const fs = require('fs');
const path = require('path');
const dir = __dirname;

// ── 1. Ler HTML ──
let src = fs.readFileSync(path.join(dir, 'preview/index.html'), 'utf-8');

// ── 2. Aplicar mudancas ──

// Hero BG
src = src.replace(
  "url('images/hero-bg.jpg')",
  "url('https://rodrigomaranhao.com/wp-content/uploads/2026/03/1-1.webp')"
);

// Expert photo
src = src.replace(
  'src="images/expert.jpg"',
  'src="https://rodrigomaranhao.com/wp-content/uploads/2026/03/MGL0339.jpg"'
);

// ── 2.1 Links WhatsApp em TODOS os botoes ──
const waLink = 'https://wa.link/q5ijol';
src = src.replace(/href="#cta-final"/g, `href="${waLink}" target="_blank"`);
src = src.replace(/href="#"/g, `href="${waLink}" target="_blank"`);

// ── 2.2 Footer: 2 logos ──
src = src.replace(
  /<div class="footer-logo"><img src="images\/logo\.png" alt="Vilanova Maranh[^"]*"><\/div>/,
  '<div class="footer-logo" style="display:flex;gap:32px;align-items:center;filter:none;margin-bottom:4px;"><img src="https://rodrigomaranhao.com/wp-content/uploads/2026/03/LOGO1-removebg-preview.png" alt="Vilanova Maranh&atilde;o Advogados" style="height:200px;width:auto;filter:invert(1);object-fit:contain;"><img src="https://rodrigomaranhao.com/wp-content/uploads/2026/03/LOGO2-1-scaled.png" alt="VMA Advogados" style="height:200px;width:auto;object-fit:contain;"></div>'
);

// ── 2.3 Footer: endereco, email, dados juridicos ──
src = src.replace('[ENDERECO_DO_ESCRITORIO]', 'Rua Mouzinho da Silveira, 27');
src = src.replace(/\[EMAIL\]/g, 'contato@rodrigomaranhao.com');
src = src.replace(
  'C&eacute;dula Profissional n.&ordm; [NUMERO_OA]',
  'C&eacute;dula Profissional n.&ordm; OA 605.54L'
);
// Remover NIF placeholder
src = src.replace(
  /<p>\s*<strong>NIF:<\/strong>[^<]*<br>\s*<strong>Forma/,
  '<p>\n            <strong>Forma'
);

// Footer copyright com disclaimer Facebook
src = src.replace(
  '&copy; 2026 Vilanova Maranh&atilde;o Advogados &mdash; Todos os direitos reservados.',
  '&copy; 2026 Vilanova Maranh&atilde;o Advogados &mdash; Todos os direitos reservados. Este site n&atilde;o faz parte do site do Facebook ou do Facebook Inc. Al&eacute;m disso, este site n&atilde;o &eacute; endossado pelo Facebook de forma alguma. Facebook &eacute; uma marca registrada da Facebook, Inc.'
);

// ── 3. Extrair CSS ──
const cssMatch = src.match(/<style>([\s\S]*?)<\/style>/);
let css = cssMatch ? cssMatch[1].trim() : '';

// ── 3.1 Overrides WordPress/Elementor ──
const wpOverrides = `

/* ========================================================
   WordPress / Elementor Compatibility Overrides v5
   ======================================================== */

/* Reset defaults do Elementor */
.elementor-widget-html { margin-bottom: 0 !important; }
.elementor-widget-html * { box-sizing: border-box; }
.elementor-widget-html h1, .elementor-widget-html h2, .elementor-widget-html h3,
.elementor-widget-html h4, .elementor-widget-html h5, .elementor-widget-html h6 {
  margin: 0 !important; padding: 0 !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  text-transform: none !important;
}
.elementor-widget-html p { margin: 0 !important; font-family: 'Inter', sans-serif !important; }
.elementor-widget-html a { text-decoration: none !important; }
.elementor-widget-html ul, .elementor-widget-html ol { margin: 0 !important; padding: 0 !important; list-style: none !important; }

/* Container fix */
.elementor-widget-html .container {
  max-width: 1200px !important; margin: 0 auto !important;
  padding: 0 24px !important; position: relative !important;
}
.elementor-widget-html .hero .container {
  max-width: 1200px !important; margin: 0 !important;
  padding: 0 24px 0 400px !important; z-index: 2 !important;
}

/* ===== HERO ===== */
.elementor-widget-html .hero-content { max-width: 620px !important; }
.elementor-widget-html .hero h1 {
  font-size: 52px !important; font-weight: 900 !important; color: #fff !important;
  line-height: 1.08 !important; letter-spacing: -2.5px !important; margin-bottom: 28px !important;
}
.elementor-widget-html .hero h1 .gradient-text {
  background: linear-gradient(135deg, #007FEB, #4DA3F0) !important;
  -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
}
.elementor-widget-html .hero-badge {
  font-size: 13px !important; font-weight: 500 !important; color: rgba(255,255,255,0.8) !important;
  padding: 12px 26px !important;
}
.elementor-widget-html .hero-subtitle {
  font-size: 17px !important; color: rgba(255,255,255,0.6) !important; line-height: 1.7 !important;
  margin-bottom: 40px !important;
}
.elementor-widget-html .hero-subtitle strong { color: rgba(255,255,255,0.9) !important; }

/* ===== BOTOES ===== */
.elementor-widget-html .btn-primary {
  display: inline-flex !important; align-items: center !important; gap: 10px !important;
  background: #03B01E !important; color: #fff !important;
  padding: 18px 40px !important; border-radius: 50px !important;
  text-decoration: none !important; font-size: 16px !important; font-weight: 600 !important;
  border: none !important; cursor: pointer !important; line-height: 1.4 !important;
  font-family: 'Inter', sans-serif !important; position: relative !important; overflow: hidden !important;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1) !important;
}
.elementor-widget-html .btn-primary:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 12px 40px rgba(3,176,30,0.35) !important;
}

/* ===== TITULOS ===== */
.elementor-widget-html .section-title {
  font-size: 48px !important; font-weight: 900 !important;
  letter-spacing: -2px !important; line-height: 1.08 !important; margin-bottom: 20px !important;
}
.elementor-widget-html .section-label {
  font-size: 12px !important; font-weight: 700 !important; color: #007FEB !important;
  text-transform: uppercase !important; letter-spacing: 3px !important; margin-bottom: 20px !important;
}
.elementor-widget-html .section-subtitle {
  font-size: 18px !important; color: #86868B !important; line-height: 1.7 !important;
  max-width: 560px !important; text-align: center !important; margin: 0 auto !important;
}
.elementor-widget-html .section-header {
  text-align: center !important; margin-bottom: 40px !important;
}

/* ===== INTRO ===== */
.elementor-widget-html .intro .container { max-width: 960px !important; }
.elementor-widget-html .intro-content p:first-child {
  font-size: 22px !important; font-weight: 900 !important; color: #1D1D1F !important;
  letter-spacing: -0.5px !important; margin-bottom: 20px !important;
}
.elementor-widget-html .intro-content p {
  font-size: 18px !important; color: #86868B !important; line-height: 1.8 !important;
}
.elementor-widget-html .intro-check {
  font-size: 16px !important; font-weight: 600 !important; color: #1D1D1F !important;
}

/* ===== PROBLEMA / SOLUCAO ===== */
.elementor-widget-html .ps-side.problem { background: #0A0A0B !important; color: #fff !important; }
.elementor-widget-html .ps-side.problem h3 { color: #fff !important; font-size: 26px !important; font-weight: 900 !important; margin-bottom: 28px !important; text-transform: none !important; }
.elementor-widget-html .ps-side.problem .ps-side-label { color: #ff6b6b !important; }
.elementor-widget-html .ps-side.problem .ps-list li { color: rgba(255,255,255,0.65) !important; font-size: 15px !important; padding-left: 32px !important; margin-bottom: 4px !important; }
.elementor-widget-html .ps-side.problem .ps-note { color: rgba(255,255,255,0.5) !important; }
.elementor-widget-html .ps-side.solution h3 { color: #1D1D1F !important; font-size: 26px !important; font-weight: 900 !important; margin-bottom: 12px !important; text-transform: none !important; }
.elementor-widget-html .ps-side.solution .ps-side-label { color: #03B01E !important; }
.elementor-widget-html .ps-side.solution .ps-list li { color: #86868B !important; font-size: 15px !important; padding-left: 32px !important; margin-bottom: 4px !important; }
.elementor-widget-html .ps-list { gap: 14px !important; }
.elementor-widget-html .ps-list li { position: relative !important; line-height: 1.5 !important; }
.elementor-widget-html .ps-cta-row { margin-top: 56px !important; }
.elementor-widget-html .ps-cta-row p { margin-bottom: 24px !important; }

/* ===== PROCESSO ===== */
.elementor-widget-html .process .section-title { color: #fff !important; }
.elementor-widget-html .process .section-subtitle { color: rgba(255,255,255,0.5) !important; }
.elementor-widget-html .process .section-label { color: #4DA3F0 !important; }
.elementor-widget-html .timeline-content h3 { font-size: 20px !important; font-weight: 900 !important; color: #fff !important; margin-bottom: 8px !important; }
.elementor-widget-html .timeline-content p { font-size: 15px !important; color: rgba(255,255,255,0.5) !important; }
.elementor-widget-html .process-note { margin-top: 20px !important; }

/* ===== TIPOS SOCIEDADE ===== */
.elementor-widget-html .bento-card h3 { font-size: 22px !important; font-weight: 900 !important; color: #1D1D1F !important; margin-bottom: 20px !important; }
.elementor-widget-html .bento-list { gap: 14px !important; }
.elementor-widget-html .bento-list li { font-size: 15px !important; color: #86868B !important; padding-left: 28px !important; }
.elementor-widget-html .bento-card-wide p { font-size: 17px !important; color: rgba(255,255,255,0.6) !important; }

/* ===== DEPOIMENTOS ===== */
.elementor-widget-html .testimonials .section-title { color: #1D1D1F !important; }
.elementor-widget-html .t-card { display: flex !important; flex-direction: column !important; }
.elementor-widget-html .t-card-quote { font-size: 32px !important; color: #007FEB !important; opacity: 0.3 !important; line-height: 1 !important; margin-bottom: 12px !important; }
.elementor-widget-html .t-card p { font-size: 15px !important; color: #1D1D1F !important; line-height: 1.7 !important; margin-bottom: 24px !important; }
.elementor-widget-html .t-card-author { display: flex !important; align-items: center !important; gap: 14px !important; margin-top: auto !important; }
.elementor-widget-html .t-card-avatar { width: 42px !important; height: 42px !important; min-width: 42px !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 700 !important; font-size: 16px !important; color: #fff !important; flex-shrink: 0 !important; }
.elementor-widget-html .t-card-name { font-weight: 600 !important; font-size: 14px !important; color: #1D1D1F !important; line-height: 1.4 !important; }
.elementor-widget-html .t-card-role { font-size: 12px !important; color: #86868B !important; line-height: 1.4 !important; }

/* ===== DIFERENCIAIS ===== */
.elementor-widget-html .why-us .section-title { color: #fff !important; }
.elementor-widget-html .why-us .section-label { color: #4DA3F0 !important; }
.elementor-widget-html .why-us .section-subtitle { color: rgba(255,255,255,0.5) !important; }
.elementor-widget-html .why-layout { align-items: center !important; }
.elementor-widget-html .why-photo { max-width: 380px !important; flex: 0 0 380px !important; }
.elementor-widget-html .why-items { gap: 12px !important; }
.elementor-widget-html .why-item { padding: 18px 20px !important; }
.elementor-widget-html .why-item h4 { font-size: 16px !important; font-weight: 900 !important; color: rgba(255,255,255,0.9) !important; }
.elementor-widget-html .why-item-text p { font-size: 14px !important; color: rgba(255,255,255,0.45) !important; }
.elementor-widget-html .why-footer-text { margin-top: 72px !important; }
.elementor-widget-html .why-footer-text p { font-size: 18px !important; color: rgba(255,255,255,0.4) !important; margin-bottom: 12px !important; line-height: 1.7 !important; }
.elementor-widget-html .why-footer-text strong { font-size: 22px !important; font-weight: 900 !important; color: #fff !important; display: block !important; line-height: 1.4 !important; }

/* ===== FAQ: hover AZUL, SEM ROSA ===== */
.elementor-widget-html .faq .section-title { color: #1D1D1F !important; font-size: 48px !important; }
.elementor-widget-html .faq-left .section-subtitle { text-align: left !important; margin: 0 !important; }
.elementor-widget-html .faq-question {
  font-size: 16px !important; font-weight: 600 !important; color: #1D1D1F !important;
  font-family: 'Inter', sans-serif !important; background: none !important;
  background-color: transparent !important;
}
.elementor-widget-html .faq-question:hover,
.elementor-widget-html .faq-question:focus,
.elementor-widget-html .faq-question:active { color: #007FEB !important; background: none !important; background-color: transparent !important; }
.elementor-widget-html .faq-item { background: #fff !important; background-color: #fff !important; }
.elementor-widget-html .faq-item:hover { background: #fff !important; background-color: #fff !important; }
.elementor-widget-html .faq-item.active { background: #fff !important; background-color: #fff !important; }
.elementor-widget-html .faq-item.active .faq-question { color: #007FEB !important; background: transparent !important; background-color: transparent !important; }
.elementor-widget-html .faq-item.active .faq-icon { background: #007FEB !important; color: #fff !important; }
.elementor-widget-html .faq-answer p { font-size: 15px !important; color: #86868B !important; line-height: 1.7 !important; }
/* Matar QUALQUER rosa/pink */
.elementor-widget-html .faq-item,
.elementor-widget-html .faq-item *,
.elementor-widget-html .faq-item.active,
.elementor-widget-html .faq-item.active *,
.elementor-widget-html .faq-item:hover,
.elementor-widget-html .faq-item:hover *,
.elementor-widget-html .faq-question,
.elementor-widget-html .faq-question *,
.elementor-widget-html button.faq-question,
.elementor-widget-html button.faq-question:hover,
.elementor-widget-html button.faq-question:focus,
.elementor-widget-html button.faq-question:active {
  background-image: none !important;
}

/* ===== CTA FINAL ===== */
.elementor-widget-html .final-cta .section-title { color: #fff !important; font-size: 52px !important; }
.elementor-widget-html .final-cta p { color: rgba(255,255,255,0.5) !important; font-size: 18px !important; max-width: 600px !important; margin: 0 auto 44px !important; text-align: center !important; }
.elementor-widget-html .final-cta .btn-primary { font-size: 18px !important; padding: 22px 52px !important; }

/* ===== FOOTER ===== */
.elementor-widget-html .footer-logo { margin-bottom: 4px !important; }
.elementor-widget-html .footer-logo img { object-fit: contain !important; }
.elementor-widget-html .footer-col h4 {
  font-size: 14px !important; font-weight: 700 !important; color: rgba(255,255,255,0.9) !important;
  text-transform: uppercase !important; letter-spacing: 1.5px !important; margin-bottom: 20px !important;
}
.elementor-widget-html .footer-col p, .elementor-widget-html .footer-col a {
  font-size: 14px !important; color: rgba(255,255,255,0.5) !important; line-height: 1.8 !important;
}
.elementor-widget-html .footer-col a:hover { color: #007FEB !important; }
.elementor-widget-html .footer-bottom p { font-size: 13px !important; color: rgba(255,255,255,0.3) !important; }

/* ===== RESPONSIVE — MOBILE ===== */
@media (max-width: 900px) {
  /* Hero mobile — background com expert */
  .elementor-widget-html .hero { min-height: auto !important; padding: 0 !important; display: flex !important; flex-direction: column !important; }
  .elementor-widget-html .hero-bg {
    background-image: url('https://rodrigomaranhao.com/wp-content/uploads/2026/03/mobile-scaled.png') !important;
    background-position: top center !important;
    background-size: cover !important;
  }
  .elementor-widget-html .hero .container { padding: 380px 24px 60px !important; position: relative !important; z-index: 2 !important; }
  .elementor-widget-html .hero-content { max-width: 100% !important; }
  .elementor-widget-html .hero h1 { font-size: 36px !important; letter-spacing: -1.5px !important; line-height: 1.12 !important; }
  .elementor-widget-html .hero-subtitle { margin-bottom: 32px !important; }
  .elementor-widget-html .hero-buttons .btn-primary { padding: 16px 32px !important; font-size: 15px !important; white-space: nowrap !important; }

  /* Intro mobile — textos alinhados a esquerda */
  .elementor-widget-html .intro-content { text-align: left !important; padding: 40px 28px !important; }
  .elementor-widget-html .intro-content p:first-child { font-size: 20px !important; line-height: 1.3 !important; margin-bottom: 16px !important; }
  .elementor-widget-html .intro-content p { font-size: 16px !important; line-height: 1.7 !important; word-spacing: normal !important; }
  .elementor-widget-html .intro-checks { justify-content: flex-start !important; flex-direction: column !important; gap: 12px !important; }

  /* Section titles mobile */
  .elementor-widget-html .section-title { font-size: 32px !important; letter-spacing: -1px !important; }
  .elementor-widget-html .section-header { text-align: left !important; }
  .elementor-widget-html .section-header .section-subtitle { text-align: left !important; margin: 0 !important; }
  .elementor-widget-html .section-subtitle { text-align: left !important; margin: 0 !important; }

  /* PS mobile */
  .elementor-widget-html .ps-side { padding: 40px 28px !important; }
  .elementor-widget-html .ps-side h3 { font-size: 22px !important; }
  .elementor-widget-html .ps-cta-row { margin-top: 40px !important; }

  /* Process mobile — manter centralizado */
  .elementor-widget-html .process .section-header { text-align: center !important; }
  .elementor-widget-html .process .section-subtitle { text-align: center !important; margin: 0 auto !important; }
  .elementor-widget-html .timeline-content h3 { font-size: 18px !important; }
  .elementor-widget-html .process-cta .btn-primary { padding: 16px 32px !important; font-size: 15px !important; }

  /* Types mobile */
  .elementor-widget-html .bento-card { padding: 36px 28px !important; }
  .elementor-widget-html .bento-card h3 { font-size: 20px !important; }

  /* Diferenciais mobile */
  .elementor-widget-html .why-layout { gap: 32px !important; }
  .elementor-widget-html .why-photo { max-width: 300px !important; flex: 0 0 auto !important; margin: 0 auto !important; }
  .elementor-widget-html .why-us .section-header { text-align: center !important; }
  .elementor-widget-html .why-us .section-subtitle { text-align: center !important; margin: 0 auto !important; }
  .elementor-widget-html .why-footer-text { margin-top: 48px !important; }
  .elementor-widget-html .why-footer-text p { font-size: 16px !important; line-height: 1.7 !important; margin-bottom: 8px !important; }
  .elementor-widget-html .why-footer-text strong { font-size: 18px !important; line-height: 1.4 !important; }

  /* FAQ mobile — sem overflow */
  .elementor-widget-html .faq .section-title { font-size: 32px !important; }
  .elementor-widget-html .faq-split { gap: 24px !important; }
  .elementor-widget-html .faq-list { max-width: 100% !important; overflow: hidden !important; }
  .elementor-widget-html .faq-item { max-width: 100% !important; overflow: hidden !important; }
  .elementor-widget-html .faq-question { padding: 18px 20px !important; font-size: 15px !important; word-break: break-word !important; }
  .elementor-widget-html .faq-answer p { padding: 0 20px 18px !important; font-size: 14px !important; }
  .elementor-widget-html .faq-icon { min-width: 28px !important; }

  /* CTA Final mobile */
  .elementor-widget-html .final-cta .section-title { font-size: 32px !important; }
  .elementor-widget-html .final-cta p { font-size: 16px !important; max-width: 100% !important; margin: 0 auto 32px !important; }
  .elementor-widget-html .final-cta .btn-primary { padding: 18px 36px !important; font-size: 16px !important; }

  /* Footer mobile */
  .elementor-widget-html .footer-logo { gap: 16px !important; margin-top: -8px !important; margin-bottom: 4px !important; }
  .elementor-widget-html .footer-logo img { height: 140px !important; }
  .elementor-widget-html .footer-bottom p { font-size: 11px !important; line-height: 1.6 !important; }
}

@media (max-width: 600px) {
  .elementor-widget-html .hero .container { padding: 320px 20px 48px !important; }
  .elementor-widget-html .hero h1 { font-size: 30px !important; }
  .elementor-widget-html .section-title { font-size: 28px !important; }
  .elementor-widget-html .why-photo { max-width: 240px !important; }
  .elementor-widget-html .footer-logo img { height: 100px !important; }
  .elementor-widget-html .footer-logo { gap: 12px !important; }
}
`;

css += wpOverrides;

// ── 4. Extrair Body (sem scripts) ──
const bodyMatch = src.match(/<body>([\s\S]*?)<\/body>/);
let body = bodyMatch ? bodyMatch[1].trim() : '';

const jsMatch = body.match(/<script>([\s\S]*?)<\/script>/);
const js = jsMatch ? jsMatch[1].trim() : '';
body = body.replace(/<script>[\s\S]*?<\/script>/g, '').trim();

// ── 5. Dividir por secoes ──
const knownSections = [
  'HERO', 'INTRO', 'PROBLEMA E SOLUCAO', 'PROCESSO',
  'TIPOS DE SOCIEDADE', 'DEPOIMENTOS', 'POR QUE ESCOLHER',
  'FAQ', 'CTA FINAL', 'FOOTER'
];

const commentRegex = /<!--\s*(.*?)\s*-->/g;
const allMarkers = [];
let m;
while ((m = commentRegex.exec(body)) !== null) {
  if (knownSections.includes(m[1].trim())) {
    allMarkers.push({ title: m[1].trim(), index: m.index, end: m.index + m[0].length });
  }
}

const sections = [];
for (let i = 0; i < allMarkers.length; i++) {
  const start = allMarkers[i].end;
  const end = i < allMarkers.length - 1 ? allMarkers[i + 1].index : body.length;
  sections.push({ title: allMarkers[i].title, html: body.substring(start, end).trim() });
}

// ── 6. Gerar JSON ──
let idN = 0;
const uid = () => 'a' + (++idN).toString(16).padStart(7, '0');
const noPad = { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: false };

const makeSection = (title, htmlContent) => ({
  id: uid(), elType: 'container', isInner: false,
  settings: { content_width: 'full', padding: noPad, _title: title },
  elements: [{
    id: uid(), elType: 'widget', widgetType: 'html',
    settings: { html: htmlContent }, elements: []
  }]
});

const elements = [];

// CSS Global
elements.push(makeSection('CSS Global',
  `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${css}</style>`
));

for (const sec of sections) {
  elements.push(makeSection(sec.title, sec.html));
}

elements.push(makeSection('JavaScript', `<script>${js}</script>`));

// ── 7. Validar e salvar ──
try { JSON.parse(JSON.stringify(elements)); }
catch (e) { console.error('ERRO JSON:', e.message); process.exit(1); }

fs.writeFileSync(path.join(dir, 'elementor-data.json'), JSON.stringify(elements));
fs.writeFileSync(path.join(dir, 'elementor-data-pretty.json'), JSON.stringify(elements, null, 2));

const tpl = {
  content: elements, page_settings: [], version: '0.4',
  title: 'LP Rodrigo ADV - Vilanova Maranhao Advogados', type: 'page'
};
fs.writeFileSync(path.join(dir, 'elementor-template.json'), JSON.stringify(tpl));

console.log('=== JSON Elementor v5 ===');
console.log(`Secoes: ${sections.length}`);
sections.forEach((s, i) => console.log(`  ${i + 1}. ${s.title}`));
console.log('');
console.log('Mudancas aplicadas:');
console.log('  - Todos os botoes -> WhatsApp: ' + waLink);
console.log('  - Footer: 2 logos, endereco, email, OA, disclaimer FB');
console.log('  - Mobile: hero padding, intro left-align, FAQ overflow, logos');
console.log('  - FAQ: hover azul (sem rosa)');
