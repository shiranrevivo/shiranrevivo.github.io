/* Project data — the single source for the homepage, the projects page and (soon) the project page.
   Replace the placeholders with real content. `featured: true` puts a project on the homepage (first 4).

   `heading` / `sub` (optional): the page <h1> (product name) and its 'type · type' line; the card keeps `title`.
   `hero` (optional): { src, alt, w, h, meta: [[label, value], …] } → details left + transparent mockup right, under the title.
   A project with `images` and/or `embed` opens its own page (project.html?id=...): title, `subtitle`,
   then the embed (if any), then the images in order. `embed` is optional — only for the projects that need it:
   { src: 'https://…', ratio: '9 / 5', label: 'window title', tab: 'Desktop' }  (only the URL from the embed code is kept).
   Two or more embeds share one window with a tab each, named by `tab` (e.g. Desktop / Tablet / Mobile).
   `related` (optional): { href, label } → a quiet text link with an arrow under the subtitle (e.g. to the case study).
   `seamless: true` (optional): the images are slices of one long board → stacked with no gap or seams, one frame.
   `cover` is the card image (16:10 crop).
   A UX/UI case study has `page: 'case-<id>.html'` instead: the card links straight to that hand-built page.

   Set design entries don't open a project page — the card shows a `cover` image and plays `video` in a popup.
   `video` can be a local file (assets/video/name.mp4), a YouTube / Vimeo link, or a Behance video's
   Adobe player link (https://www-ccv.adobe.io/v1/player/ccv/<id>/embed?api_key=behance1).
   No `cover` + a YouTube video → the YouTube thumbnail is used until a real cover is added. */

window.CATEGORIES = {
  ux: 'UX Research',
  ui: 'UI Design',
  dashboard: 'Dashboards',    // complex systems / SaaS / B2B; always shown (ALWAYS in main.js), even while empty
  mobile: 'Mobile App',
  web: 'Web',
  graphic: 'Graphic Design',
  set: 'Set Design'            // always last
};

window.PROJECTS = [
  // UX/UI case study: its own hand-built page (`page`), translated from the project deck
  { id: 'zenthor', title: 'Zenthor — Complex B2B Dashboard UX/UI Case Study', subtitle: 'B2B cybersecurity monitoring dashboard for SOC analysts',
    categories: ['ux', 'ui', 'dashboard'], cover: 'assets/img/projects/zenthor/cover.jpg?v=2', page: 'case-zenthor.html', featured: true },
  // brand + website in one page (2026-11-10): UX, UI, Web and Graphic. The one real, live product: second on the homepage (Shiran 2026-11-10),
  // and first in Graphic Design
  { id: 'double-shesh', title: 'Double Shesh Productions — Brand Identity & Website', subtitle: 'Logo, visual language and a responsive website for a production company',
    categories: ['ux', 'ui', 'web', 'graphic'], cover: 'assets/img/projects/double-shesh/cover-web.jpg?v=3', page: 'double-shesh.html', featured: true },
  { id: 'myra', title: 'Myra — Mindfulness App UX/UI Case Study', subtitle: 'UX/UI case study for a mindfulness mobile app',
    categories: ['ux', 'ui', 'mobile'], cover: 'assets/img/projects/myra/cover.jpg', page: 'case-myra.html', featured: true },
  { id: 'sola-games', title: 'Sola Games — UX/UI Gaming E-Commerce Case Study', subtitle: 'Responsive e-commerce website for a gaming brand',
    categories: ['ux', 'ui', 'web'], cover: 'assets/img/projects/sola-games/cover.jpg', page: 'case-sola-games.html', featured: true },
  { id: 'atomic-blonde', title: 'Atomic Blonde — Movie One Pager UX/UI Case Study', subtitle: 'Responsive one-pager website for the film Atomic Blonde',
    categories: ['ux', 'ui', 'web'], cover: 'assets/img/projects/atomic-blonde/cover.jpg', page: 'case-atomic-blonde.html', featured: true },
  { id: 'the-hill-of-memory', title: 'The Hill of Memory — Memory Game UI Redesign', subtitle: 'Responsive UI redesign of a cognitive memory game',
    categories: ['ui', 'web', 'mobile'], cover: 'assets/img/projects/the-hill-of-memory/cover.jpg', page: 'case-the-hill-of-memory.html', featured: true },
  // a one pager shown like its deck (like hollywood), first after the case studies; not on the home page
  { id: 'far-cry-new-dawn', title: 'Far Cry New Dawn — UX/UI One Pager', subtitle: 'Neon post-apocalyptic landing page for a video game',
    categories: ['ui', 'web'], cover: 'assets/img/projects/far-cry-new-dawn/cover.jpg', page: 'far-cry-new-dawn.html' },
  { id: 'stamping', title: 'Stamping — Home Page UI', subtitle: 'Responsive website design for a digital document-signing platform',
    categories: ['ui', 'web'], cover: 'assets/img/projects/stamping/cover.jpg',
    hero: { meta: [['Project', 'Responsive website design for a digital document-signing platform'], ['Time frame', '4 days'], ['Tools', 'Figma · Claude']] },
    heading: 'Stamping', sub: 'UI Design · Responsive Website',
    embed: [                                             // after the images, in this order; screen: keeps the ratio on mobile too; mobileRatio: its own shape on mobile
      { src: 'https://embed.figma.com/proto/4wglXYQooWEILVLvsSS4k6/Stamping-Home-Page---UI--Shiran-revivo-?node-id=2-3&viewport=297%2C185%2C0.1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&embed-host=share', label: 'prototype_01.fig', tab: 'Desktop', ratio: '16 / 10', screen: true },
      { src: 'https://embed.figma.com/proto/4wglXYQooWEILVLvsSS4k6/Stamping-Home-Page---UI--Shiran-revivo-?node-id=143-3558&viewport=151%2C115%2C0.11&scaling=scale-down&content-scaling=fixed&page-id=142%3A3496&embed-host=share', label: 'prototype_02.fig', tab: 'Tablet' },
      { src: 'https://embed.figma.com/proto/4wglXYQooWEILVLvsSS4k6/Stamping-Home-Page---UI--Shiran-revivo-?node-id=317-18290&viewport=-178%2C116%2C0.51&scaling=scale-down-width&content-scaling=fixed&page-id=317%3A18289&embed-host=share', label: 'prototype_03.fig', tab: 'Mobile', mobileRatio: '2 / 3' }
    ] },
  { id: 'solara', title: 'Solara — Responsive UI One Pager', subtitle: 'Branding and landing page UI for a solar company',
    categories: ['ui', 'web'], cover: 'assets/img/projects/solara/cover.jpg',
    hero: { meta: [['Project', 'This project, created as a design test for a job interview, features the branding and landing page UI design for a solar company. My objective was to create a trustworthy and inviting user experience. To do this, I merged green, ecological aesthetics with an innovative, high-tech visual language.']] },
    heading: 'Solara', sub: 'UI Design · Responsive One Pager',
    embed: [
      { src: 'https://embed.figma.com/proto/jLkCRmcWXqVBAiX2DcxuMa/Responsive-UI-One-Pager---Solara_2?node-id=89-1371&viewport=269%2C79%2C0.11&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&embed-host=share', label: 'prototype_01.fig', tab: 'Desktop', ratio: '16 / 10', screen: true },
      { src: 'https://embed.figma.com/proto/jLkCRmcWXqVBAiX2DcxuMa/Responsive-UI-One-Pager---Solara_2?node-id=90-114&viewport=479%2C101%2C0.11&scaling=scale-down&content-scaling=fixed&page-id=90%3A113&embed-host=share', label: 'prototype_02.fig', tab: 'Mobile', mobileRatio: '2 / 3' }
    ] },
  // an app shown like its deck, on its own hand-built page (`page`), but not a case study
  { id: 'flamingo', title: 'Flamingo — Evening Dress Rental App UX/UI', subtitle: 'Mobile app for renting evening dresses',
    categories: ['mobile', 'ui'], cover: 'assets/img/projects/flamingo/cover.jpg', page: 'flamingo.html' },
  // a one pager shown like its deck, on its own hand-built page (`page`), but not a case study
  { id: 'hollywood', title: 'Once Upon a Time in Hollywood — UX/UI One Pager', subtitle: 'Cinematic landing page for a Tarantino film',
    categories: ['ui', 'web'], cover: 'assets/img/projects/hollywood/cover.jpg', page: 'hollywood.html' },
  { id: 'myra-one-pager', title: 'Myra Mindfulness App — One Pager', subtitle: 'Landing page UI for a mindfulness app',
    categories: ['ui', 'web'], cover: 'assets/img/projects/myra-one-pager/cover.jpg',
    hero: { meta: [['Project', 'A one-page landing site for Myra, a mindfulness app that blends meditation, AI and simplicity to help people unwind, sleep better and feel centred. The page carries the app’s calm, dark-purple visual language onto the web and leads visitors to download the app.']] },
    heading: 'Myra', sub: 'UI Design · Web One Pager',
    related: { href: 'case-myra.html', label: 'See the app case study' },   // quiet link under the subtitle
    embed: { src: 'https://embed.figma.com/proto/jIhqgv9x4HYh3u84Kc8ra3/Myra-Mindfulness-App?node-id=1100-6418&viewport=422%2C45%2C0.09&scaling=scale-down-width&content-scaling=fixed&page-id=4%3A4&embed-host=share', label: 'prototype.fig', ratio: '16 / 10', screen: true } },
  { id: 'zenthor-one-pager', title: 'Zenthor — UI One Pager for Phishing Defense System', subtitle: 'Landing page UI for a B2B phishing defense platform',
    categories: ['ui', 'web'], cover: 'assets/img/projects/zenthor-one-pager/cover.jpg',
    hero: { meta: [['Project', 'A landing page for Zenthor, a B2B phishing-defense platform. It turns a data-heavy security system into one clear page that gives security teams instant clarity.']] },
    heading: 'Zenthor', sub: 'UI Design · Web One Pager',
    related: { href: 'case-zenthor.html', label: 'See the dashboard case study' },   // quiet link under the subtitle
    embed: { src: 'https://embed.figma.com/proto/KdN80F4FM0PRtRUGXi8jPr/Zenthor-one-pager?node-id=0-447&viewport=400%2C60%2C0.11&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&embed-host=share', label: 'prototype.fig', ratio: '16 / 10', screen: true } },
  { id: 'dalidesign-ecommerce', title: 'DaliDesign E-commerce — Student Project', subtitle: 'E-commerce website design for a ’70s-inspired furniture brand',
    categories: ['ui', 'web'], cover: 'assets/img/projects/dalidesign-ecommerce/cover.jpg',
    images: [
      { src: 'assets/img/projects/dalidesign-ecommerce/01-mockup.webp', alt: 'DaliDesign full home page with the newsletter popup', w: 1125, h: 2000, bare: true }
    ],
    embed: { src: 'https://embed.figma.com/proto/XHhIyI2TueJMPxQqHghDZf/E-commerce-dali-design?page-id=0%3A1&node-id=1-2&p=f&viewport=423%2C223%2C0.07&scaling=scale-down-width&content-scaling=fixed&embed-host=share', label: 'prototype.fig', ratio: '16 / 10', screen: true } },
  // the last UX/UI work, right before graphic design (Shiran, 2026-10-25)
  { id: 'dyson', title: 'Dyson — Rebranding, E-Commerce & One Pager', subtitle: 'Rebranding team project for the Dyson Supersonic HD07',
    categories: ['ui', 'web'], cover: 'assets/img/projects/dyson/cover.jpg?v=2', page: 'dyson.html' },
  { id: 'dalidesign-brand-book', title: 'DaliDesign Brand Book — Student Project', subtitle: 'Brand identity and brand book',
    categories: ['graphic'], cover: 'assets/img/projects/dalidesign-brand-book/cover.jpg', seamless: true,   // the book's pages back to back, as on myportfolio (the flipbook embed broke on mobile)
    images: [
      { src: 'assets/img/projects/dalidesign-brand-book/01-cover.jpg', alt: 'Brand book cover: DaliDesign logo over a vintage desk against a concrete wall', w: 960, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/02-contents.jpg', alt: 'Table of contents with a leather sofa and orange ’70s wave', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/03-about.jpg', alt: 'About the brand', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/04-vision.jpg', alt: 'Our visions', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/05-values.jpg', alt: 'Brand values', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/06-logo.jpg', alt: 'The DaliDesign logo', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/07-logo-uses.jpg', alt: 'Permitted and prohibited logo uses', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/08-colors.jpg', alt: 'Brand colors', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/09-typography.jpg', alt: 'Typography', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/10-moodboard.jpg', alt: 'Moodboard', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/11-posters.jpg', alt: 'A3 posters', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/12-business-card.jpg', alt: 'Business card', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/13-rollup.jpg', alt: 'Roll-up banner', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/14-billboard.jpg', alt: 'Billboard', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/15-stationery.jpg', alt: 'Stationery', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/16-instagram-post.jpg', alt: 'Instagram post', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/17-instagram-story-1.jpg', alt: 'Instagram stories', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/18-instagram-story-2.jpg', alt: 'Instagram stories, continued', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/19-banners.jpg', alt: 'Web banners', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/20-ui-kit.jpg', alt: 'UI kit', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/21-ecommerce.jpg', alt: 'E-commerce website', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/22-products-1.jpg', alt: 'Products', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/23-products-2.jpg', alt: 'Products, continued', w: 1920, h: 1080 },
      { src: 'assets/img/projects/dalidesign-brand-book/24-back-cover.jpg', alt: 'Back cover: DaliDesign logo over a vintage Barcelona chair ad in plastic wrap', w: 960, h: 1080 }
    ] },
  { id: 'if-you-were-a-war', title: 'Film Poster Design — If You Were A War', subtitle: 'Poster design for a short film',
    categories: ['graphic'], cover: 'assets/img/projects/if-you-were-a-war/cover.jpg',
    images: [
      { src: 'assets/img/projects/if-you-were-a-war/01-poster-he.jpg', alt: 'If You Were A War film poster, Hebrew version', w: 1433, h: 2000 },
      { src: 'assets/img/projects/if-you-were-a-war/02-mockup-he.jpg', alt: 'Hebrew poster printed and lying on a surface', w: 2000, h: 1500 },
      { src: 'assets/img/projects/if-you-were-a-war/03-poster-en.jpg', alt: 'If You Were A War film poster, English version', w: 1433, h: 2000 },
      { src: 'assets/img/projects/if-you-were-a-war/04-mockup-en-curl.jpg', alt: 'Close-up of the English poster with a curled corner', w: 2000, h: 1500 },
      { src: 'assets/img/projects/if-you-were-a-war/05-mockup-en.jpg', alt: 'English poster hung on a concrete wall', w: 2000, h: 1500 }
    ] },
  { id: 'out-of-character', title: 'Film Poster Design — Out Of Character', subtitle: 'Poster design for a short film',
    categories: ['graphic'], cover: 'assets/img/projects/out-of-character/cover.jpg',
    images: [
      { src: 'assets/img/projects/out-of-character/01-poster-he.jpg', alt: 'Out Of Character film poster, Hebrew version', w: 1433, h: 2000 },
      { src: 'assets/img/projects/out-of-character/02-mockup-he.jpg', alt: 'Hebrew poster printed and hung on a wall', w: 2000, h: 1500 },
      { src: 'assets/img/projects/out-of-character/03-mockup-en.jpg', alt: 'English poster printed and lying on a surface', w: 2000, h: 1500 },
      { src: 'assets/img/projects/out-of-character/04-poster-en.jpg', alt: 'Out Of Character film poster, English version', w: 1433, h: 2000 }
    ] },
  { id: 'podcast-identity', title: 'Podcast Visual Identity & Digital Design', subtitle: 'Visual identity, cover art, banners and social story for a culture & tech podcast',
    categories: ['graphic'], cover: 'assets/img/projects/podcast-identity/cover.jpg', seamless: true,   // one long board cut into slides
    images: [
      { src: 'assets/img/projects/podcast-identity/01-intro.jpg?v=3', alt: 'Dr. Amir Levy\'s podcast title in coral Hebrew type on a dark background', w: 2000, h: 1261 },
      { src: 'assets/img/projects/podcast-identity/02-cover.jpg?v=3', alt: 'Square 3000px podcast cover with a chair and boom mic in a studio, shown in a phone player', w: 2000, h: 1490 },
      { src: 'assets/img/projects/podcast-identity/03-banners.jpg?v=3', alt: 'Two 1280×250 podcast banners', w: 2000, h: 1493 },
      { src: 'assets/img/projects/podcast-identity/04-story.jpg?v=3', alt: '1080×1920 Instagram story with the host portrait, shown on a phone', w: 2000, h: 1643 },
      { src: 'assets/img/projects/podcast-identity/05-player.jpg?v=3', alt: 'Episode player widget with the podcast cover', w: 2000, h: 1311 },
      { src: 'assets/img/projects/podcast-identity/06-process.jpg?v=3', alt: 'Design process notes and a thank-you closing slide', w: 2000, h: 1126 }
    ] },
  { id: 'podcast-cover', title: 'Digital Podcast Cover Design', subtitle: 'Cover art for a cinema podcast',
    categories: ['graphic'], cover: 'assets/img/projects/podcast-cover/cover.jpg',
    images: [
      { src: 'assets/img/projects/podcast-cover/01-cover-art.jpg', alt: 'Podcast cover art: a man laughing with a popcorn bucket, green podcast icons', w: 2000, h: 2000 },
      { src: 'assets/img/projects/podcast-cover/02-mockup-top.jpg', alt: 'Printed cover and phone player mockup, seen from above', w: 2000, h: 1333 },
      { src: 'assets/img/projects/podcast-cover/03-mockup-angle.jpg', alt: 'Printed cover and phone player mockup at an angle', w: 2000, h: 1333 },
      { src: 'assets/img/projects/podcast-cover/04-mockup-marble.jpg', alt: 'Phone and printed cover resting on a marble block', w: 1429, h: 2000 }
    ] },
  { id: 'white-rabbit', title: 'The White Rabbit — Live Rock Club Brand Identity', subtitle: 'Student brand identity for an Israeli live rock club',
    categories: ['graphic'], cover: 'assets/img/projects/white-rabbit/cover.jpg', page: 'case-white-rabbit.html' },
  { id: 'kino-live-in-kyiv', title: 'KINO: Live in Kyiv — Viktor Tsoi Poster Design', subtitle: 'Concert poster for Viktor Tsoi and KINO',
    categories: ['graphic'], cover: 'assets/img/projects/kino-live-in-kyiv/cover.jpg',
    images: [
      { src: 'assets/img/projects/kino-live-in-kyiv/01-poster.jpg', alt: 'Viktor Tsoi concert poster: black-and-white live photo under red Cyrillic type', w: 1414, h: 2000 },
      { src: 'assets/img/projects/kino-live-in-kyiv/02-mockup-wall.jpg', alt: 'The poster taped to a concrete wall', w: 2000, h: 1333 },
      { src: 'assets/img/projects/kino-live-in-kyiv/03-mockup-two-posters.jpg', alt: 'Two KINO posters side by side on a weathered concrete wall', w: 2000, h: 1333 }
    ] },
  { id: 'fictional-event-invitation', title: 'Fictional Event Invitation Design', subtitle: 'Invitation for a fictional Blood Oath Ceremony',
    categories: ['graphic'], cover: 'assets/img/projects/fictional-event-invitation/cover.jpg',
    images: [
      { src: 'assets/img/projects/fictional-event-invitation/01-invitation.jpg', alt: 'Blood Oath Ceremony invitation: a horned skull over a red cross and an inverted triangle, blackletter type', w: 1259, h: 1786 },
      { src: 'assets/img/projects/fictional-event-invitation/02-mockup.jpg', alt: 'The printed invitation lying on a dark textured surface', w: 2000, h: 1500 }
    ] },
  { id: 'theatre-production', title: 'Theatre Production — Social Media Poster & Flyer Design', subtitle: 'Instagram posters and a flyer for a Hebrew stage play',
    categories: ['graphic'], cover: 'assets/img/projects/theatre-production/cover.jpg',
    images: [
      { src: 'assets/img/projects/theatre-production/01-post-1.jpg', alt: 'Instagram poster for the play Beigale Ham: two actors face to face under orange Hebrew title type', w: 1080, h: 1350 },
      { src: 'assets/img/projects/theatre-production/02-mockup-social.jpg', alt: 'The poster as an Instagram post on a phone, beside the second poster', w: 2000, h: 1333 },
      { src: 'assets/img/projects/theatre-production/03-post-2.jpg', alt: 'Second Instagram poster: one actor resting his head on the other\'s shoulder', w: 1080, h: 1350 },
      { src: 'assets/img/projects/theatre-production/04-mockup-flyer.jpg', alt: 'Printed flyer, front and back, floating on a grey background', w: 2000, h: 1333 }
    ] },
  { id: 'recipe-pages', title: 'Two Recipe Pages Design', subtitle: 'Magazine spreads for an orange soup and a pasta recipe',
    categories: ['graphic'], cover: 'assets/img/projects/recipe-pages/cover.jpg',
    images: [
      { src: 'assets/img/projects/recipe-pages/01-orange-soup.jpg', alt: 'Open magazine spread: Orange Soup Recipe on yellow with coriander leaves, a bowl of soup on the facing page', w: 2000, h: 1500 },
      { src: 'assets/img/projects/recipe-pages/02-pasta.jpg', alt: 'Open magazine at an angle showing a pasta recipe spread over a photo of fettuccine', w: 2000, h: 1500 }
    ] },
  { id: 'mandy', title: 'Film Poster Design — Mandy', subtitle: 'Poster design for a feature film',
    categories: ['graphic'], cover: 'assets/img/projects/mandy/cover.jpg',
    images: [
      { src: 'assets/img/projects/mandy/01-poster.jpg', alt: 'Mandy film poster with Nicolas Cage, printed on paper', w: 2000, h: 1540 }
    ] },
  { id: 'hugo-coffee', title: 'HUGO Coffee — Concept Ad', subtitle: 'Self-initiated summer ad for HUGO Coffee Roasters',   // always the last graphic project
    categories: ['graphic'], cover: 'assets/img/projects/hugo-coffee/cover.jpg',
    images: [
      { src: 'assets/img/projects/hugo-coffee/01-mockup-frame.jpg', alt: 'The ad in a lit frame on a sunlit brick wall', w: 2000, h: 1500 },
      { src: 'assets/img/projects/hugo-coffee/02-ad.jpg', alt: 'HUGO Coffee summer ad: three coffee bags, an iced coffee with caramel and flying coffee beans on orange, Hebrew headline', w: 1414, h: 2000 },
      { src: 'assets/img/projects/hugo-coffee/03-mockup-instagram.jpg', alt: 'The ad as an Instagram post on a phone', w: 2000, h: 1333 }
    ] },
  { id: 'project-01', title: 'Project 01', year: 2026, categories: ['ux', 'mobile'], featured: true },
  { id: 'project-02', title: 'Project 02', year: 2026, categories: ['ui', 'web'], featured: true },
  { id: 'project-03', title: 'Project 03', year: 2025, categories: ['ui', 'mobile'], featured: true },
  { id: 'project-04', title: 'Project 04', year: 2025, categories: ['ux', 'web'], featured: true },
  { id: 'project-05', title: 'Project 05', year: 2025, categories: ['mobile', 'ui'] },
  { id: 'project-06', title: 'Project 06', year: 2024, categories: ['graphic'] },
  { id: 'project-07', title: 'Project 07', year: 2024, categories: ['ux'] },
  { id: 'project-08', title: 'Project 08', year: 2024, categories: ['web', 'graphic'] },
  { id: 'project-09', title: 'Project 09', year: 2024, categories: ['ui', 'web'] },
  { id: 'project-10', title: 'Project 10', year: 2024, categories: ['ux', 'mobile'] },

  // set design — cover image + video popup
  { id: 'set-01', title: 'I love you — Music video', categories: ['set'], cover: '', video: 'https://www.youtube.com/watch?v=m7gIYOPV8_s' },
  { id: 'set-02', title: 'Paradise Express — Short film', categories: ['set'], cover: '', video: 'https://www.youtube.com/watch?v=ksprLpwSe98' },
  { id: 'set-03', title: 'Death In Umm Al-Hiran', categories: ['set'], cover: '', video: 'https://www.youtube.com/watch?v=2rR1qQEh9QA' },
  { id: 'set-04', title: 'Click-to-Call — Commercial', categories: ['set'], cover: 'assets/img/set/click-to-call.jpg', video: 'https://www.youtube.com/watch?v=nlnZQXGmIyo' },
  { id: 'set-05', title: 'Love Letter to My Brother', categories: ['set'], cover: 'assets/img/set/love-letter.jpg', video: 'https://www.youtube.com/watch?v=RTm3Fk8ej-I' },
  { id: 'set-06', title: '30 and Trying — Short film', categories: ['set'], cover: 'assets/img/set/30-and-trying.jpg', video: 'https://www.youtube.com/watch?v=l15I1tzaS90' },
  { id: 'set-07', title: 'Floortime — Short film', categories: ['set'], cover: 'assets/img/set/floortime.jpg', video: 'https://www.youtube.com/watch?v=RcOX7nEz14Y' },
  { id: 'set-08', title: 'Hide and Seek — Short film', categories: ['set'], cover: 'assets/img/set/hide-and-seek.jpg', video: 'https://www-ccv.adobe.io/v1/player/ccv/HQ5w878qfzs/embed?api_key=behance1&bgcolor=%23191919' }
];
