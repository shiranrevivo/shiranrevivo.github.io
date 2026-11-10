# Brand Book & Design System (s.design) — "התנ"ך" של הפרויקט

**מקור האמת** לכל מה שנראה או נכתב בפרויקט: האתר, עמודים ורכיבים חדשים, גרפיקה וסושיאל. לפני כל עבודה ויזואלית קוראים את המקטע הרלוונטי, ומה שחסר מוסיפים קודם לתנ"ך (אחרי אישור של שירן).

שני מסמכים נפרדים בתיקייה `design-system/`. **הם לא חלק מהאתר ולא משנים אותו**: האתר לא מקשר אליהם ולא טוען מהם כלום (בקשה מפורשת של שירן: "לא לגעת באתר, שני קבצים נפרדים").

| קובץ | מה יש בו |
|---|---|
| `design-system/brand-book.html` | הזהות: מהות וערכים, לוגו (גרסאות, מרווח, מינימום, אסור), צבע (פלטה, יחסים, ניגודיות), טיפוגרפיה, שפה גרפית (אייקונים, סמן, ניצוץ, burst, dot matrix, scanlines, frame corners, חלון, קולאז', ספרייטים), קול וטון, **סושיאל** (5 תבניות + כללי פיד), Do/Don't. קובץ עצמאי: קורא רק את `tokens.css` ואת `assets/` |
| `design-system/design-system.html` | המפרט הטכני: טוקנים, סולם טיפוגרפיה, layout/breakpoints/z-index, רכיבים חיים עם מצבים ואנטומיה (btn, icon-btn, copy, chip, pager, card, window, terminal, section head, socials, tags, timeline), אייקונים, סמן, תנועה, נגישות, צ'קליסט. **טוען לקריאה בלבד** את `assets/css/style.css` ו-`assets/js/main.js` של האתר, כך שהרכיבים שמוצגים הם האמיתיים |
| `design-system/tokens.css` + `tokens.json` | העתק של `:root` מהאתר + שמות לצבעים שהאתר כותב כ-hex (`--pink-hover #FFA3FA`, `--yellow #FFE15C`, `--paper #F6EFF2`, `--kraft #F2D7A0`, `--amber #E8A33A`) + טוקני צל ותנועה. ל-Figma / Canva / סושיאל |
| `design-system/assets/` | SVG שיוצאו מהקוד: `icons/` (26, ורוד) + `icons/ink/` (כהה), `cursor/`, `sprites/` (cat, pen, laptop, coffee, camera, clapper), `graphics/` (sparkle, sparkle-sticker, burst, pixel-spark, dot-grid, scanlines, grain, frame-corners, dashed-rule) |
| `design-system/exports/` | PNG של תבניות הסושיאל |
| `design-system/tools/build-assets.mjs` | מייצא מחדש את ה-SVG ואת tokens.json **ישירות מ-main.js** (PX, arrow, ITEMS, ITEM_COLORS, FACT_SPRITES) ומ-tokens.css. `node design-system/tools/build-assets.mjs` |
| `design-system/tools/export-social.sh` | Headless Chrome → PNG של כל תבנית (`brand-book.html?only=<id>`). `bash design-system/tools/export-social.sh [post\|quote\|carousel\|story\|banner]` |

## Case study (v1.2, 2026-10-19)
- `brand-book.html` מקטע **08 Case study**: השפה (מה מותר ומה אסור בהצגת פרויקט UX/UI).
- `design-system.html` מקטע **09 Case study**: מבנה העמוד, רכיבים חיים (`.cs-*`, `.ia`, `.cs-pill`, `.cs-media`, `.cs-screen`) וטבלת המודיפיירים של תמונות.
- אייקונים חדשים: `eye`, `book`, `lotus`, `cloud` (Usability cards).
- כלי תמונות: `design-system/tools/case-study/` (Swift: solid, lift, polish, crop, blackkey, trim, center, alpha; `build.sh`).
- v1.2: קטגוריות לפי שיקול דעת + featured, קו מקווקו ב-features, תרשים בלי מפריד וממורכז במובייל, pill נקי והסימן הרספונסיבי לצידו, swipe קבוע, cache `?v=` בכל העמודים.
- v1.3: `.cs-proto` (טאבים לפרוטוטייפים לפי מכשיר, בכל פרויקט עם יותר מפרוטוטייפ אחד), טקסט רץ על כל רוחב הגריד.
- v1.4: רכיב `.scroll-cue` (Components ב-design-system.html): "Scroll for more" + חץ פיקסל קופץ ב-About.
- v1.5: View-Master במובייל (מתחת ל-720px) ברוחב 86%, בתוך הגריד (טבלת Other site components ב-design-system.html).
- v1.6: File count גמיש בסרגל הסינון (Chip & pager ב-design-system.html): אחרי ה-chips כשיש מקום, ויורד לשורה משלו כשהטקסט ארוך.
- v1.7: חץ הכרטיס מוצמד למעלה (אותו גובה בכל הכרטיסים) + כלל כותרת כרטיס קצרה (Project card ב-design-system.html).
- v1.7: תת-כותרת של עמוד פרויקט תמיד בסגנון tags, ו-`Responsive` בה בכל פרויקט רספונסיבי (גם ב-SKILL.md של case-study).
- v1.8: כרטיס העובדות של ה-View-Master בגובה קבוע (לפי העובדה הארוכה), בדסקטופ ובמובייל; והדיסק חצי בחוץ וחצי בפנים, כמו במציאות.
- v1.9: הניווט וסרגל הסינון מסתתרים בגלילה למטה וחוזרים בגלילה למעלה **בכל המסכים** (קודם רק במובייל). Chip & pager ב-design-system.html.
- v1.10: תרשים IA: כל קו יוצא מאמצע הצד ונוגע בקובייה, גבעול לכל הורה, צבע קו אטום (`--line-c: #793A74`, בלי קו על קו), ומעבר אוטומטי לעץ מוערם כשהמפה לא נכנסת (`initIA`, `.ia--stack`). סקיל נפרד: `.claude/skills/ia-diagram`. וגם: טבלת המתחרים (`.cs-matrix`) נשארת מטריצה במובייל.
- v1.11: `.cs-jump` — לינק טקסט שקט (סגנון "← All projects", חץ ימינה מימין), לא כפתור. מתחת לכותרת הסקשן ב-case study לעמוד הפרויקט הנפרד של אותו חלק (Myra → One Pager), ובחזרה מתחת לתת-הכותרת ב-project.html דרך `related` ב-data.js.
- v1.12: Levels בנקודת שבירה: עד 900px, יותר מ-6 נושאים = שורה אחת שנגללת לצד (swipe), עם פייד ו-`swipe →`. בכל עמודי הפרויקטים (Myra, Sola, Zenthor; Flamingo והוליווד עם 6 נשארים בשורות). design-system.html (Case study → Hero) ו-brand-book.html (Case study).
- v1.13: **Eyepiece** של ה-View-Master (design-system.html → Components → Eyepiece, ושורה ב-Other site components; brand-book.html → Elements): העדשות הן כפתורים עם תגית `click to peek in`, והשקופית נפתחת בחלון ממורכז עד 920px עם חלל כהה סביבה, חצים מסונכרנים וצליל reel בלבד. **כלל גורף: כל פופ-אפ נסגר ב-X, Esc וקליק בחוץ** (Accessibility ב-design-system.html). `--grain` עבר ל-`:root` (ונוסף ל-tokens.css).
- v1.14 (2026-10-24): **מרווחי כותרת ותת-כותרת** ב-case study: אחרי `.cs-sec__head` שבא אחריו `.cs-h3` המרווח קטן (`clamp(16px, 2vw, 24px)`), ומתחת ל-`.cs-h3` עד התוכן גדול יותר (`clamp(28px, 3vw, 40px)`, במקום 20px). תת-הכותרת שייכת לתוכן. design-system.html (Case study → Section head) ו-brand-book.html (Case study, case_do).
- v1.15 (2026-10-25, Dyson): **Brand identity** ב-design-system.html (Case study): `.cs-logos--pair` / `.cs-logos__box` (שתי גרסאות לוגו באותו גודל, גרסה שחורה בקופסה לבנה), פונט בלי רישיון web וקובץ = תמונה מהשקף (דיו → לבן / `#F7C4EE`) עם `.cs-type__ramp` לשורת המשקלים, ו-`.cs-colors--five` עם hex + RGB (אחד בשורה במובייל). brand-book.html: שורה ב-case_do.
- v1.16 (2026-10-25, Double Shesh): **Brand page** ב-design-system.html (Case study): פסקת קונספט בלי כותרת מתחת ל-`.cs-brandmarks`, צבעים כסימן הרספונסיבי בכל צבע (`.cs-colors--mark.cs-colors--five`, במובייל סימן משמאל וטקסט לצידו) עם `<small>` לשימוש, `.cs-ratio` (פס פרופורציות הפלטה), `.cs-quad` (גריד מוקאפים 2×2, 3:4, רק רקע ריק נחתך), פונט מותקן בלי רישיון כתמונה (Far Cry) עם שני ramps לשתי שפות. brand-book.html: שורה ב-case_do.
- v1.18 (2026-11-10): **קופי ה-hero**: כותרת UX/UI Designer, eyebrow Hi, I'm Shiran, תת-כותרת "for the person on the other side of the screen". brand-book.html: הטאגליין, דוגמת הטיפוגרפיה, טבלת הקול (כלל חדש: בלי משחקי מילים וקלישאות) ותבנית ה-banner.
- v1.19 (2026-11-10, The Hill of Memory): `.cs-colors--stack`: צבעים במובייל בשתי עמודות, הסימן מעל השם וה-hex וממורכז, כמו ב-Zenthor (design-system.html → Brand page).
- התהליך המלא: `.claude/skills/case-study/SKILL.md` (קישור גם מ-`Desktop/.claude/skills/`).

## מקור האמת
- הערכים של האתר: בלוק `:root` ב-`assets/css/style.css`. אם משתנה שם ערך, לעדכן גם את `design-system/tokens.css` ולהריץ `build-assets.mjs`.
- אייקון חדש: מפה ב-`PX` (main.js), ואז `build-assets.mjs`.
- כשמוסיפים רכיב לאתר: להוסיף אותו גם ל-`design-system.html` (מקטע Components) ול-`02-design-system.md`.

## עיקרי המותג (לסושיאל ולכל דבר חדש)
- **מהות:** Retro pixel UI עם לב עכשווי. ערכים: Playful · Pixel-precise · Analog heart. כותרת ה-hero (v1.18): *UX/UI / Designer* עם eyebrow *Hi, I'm Shiran* (החליפה את הטאגליין Pixeling joy into products). תת-כותרת ה-hero (2026-11-10): *I design apps and websites for the person on the other side of the screen…*; טקסט About: ההשוואה בין פריים בסרט למסך (הצופה = המשתמש). קול הקופי: רגוע, בוגר, בלי משחקי מילים וקלישאות (delightful, complex problems, last pixel).
- **צבע:** לילה `#0B0408` ~70%, ורוד `#FF7BF8` ~18%, טקסט `#F7C4EE`. צהוב רק לתגמולים; נייר/קראפט/ענבר רק בקולאז'. `--pink-dim`/`--pink-deep` לא לטקסט.
- **טיפוגרפיה:** Jersey 10 (כותרות, UPPER) · Pixelify Sans (תוויות, UPPER, ריווח) · Space Grotesk (טקסט) · VT323 (טרמינל). עברית בסושיאל: Heebo.
- **צורה:** מסגרות 2px, פינות ישרות, צל אטום offset בוורוד כהה, glow רק על כותרות. תנועה ב-`steps()`.
- **קול:** חם, קליל, בטוח; מטאפורות משחק (LVL, collect, achievement), שמות קבצים כתוויות (`PROJECT_03.FIG`), טרמינל באותיות קטנות. כפתורים 1–3 מילים.

## סושיאל
כל תבנית = האתר × 3 (`--u: 3px`). התבניות ב-`brand-book.html`, מקטע Social (מחפשים `data-id="post"` וכו'):
| id | גודל | שימוש | safe zone |
|---|---|---|---|
| post | 1080×1350 | הצגת פרויקט בחלון רטרו | 84px |
| quote | 1080×1080 | טיפ / משפט | 96px |
| carousel | 1080×1350 | שער case study (LVL 01, burst NEW, pips) | 90px |
| story | 1080×1920 | "loading..." + sneak peek + My work | 250 למעלה / 340 למטה |
| banner | 1584×396 | LinkedIn cover | x<420 פנוי |

כללי פיד: לוגו או handle + eyebrow אחד + כותרת אחת; עבודה תמיד בתוך חלון/מסגרת; רקע לילה + dot matrix + scanlines; ורוד מלא רק בשקופית שיא; מקסימום 1–2 קישוטים; בלי גרדיאנטים, פינות מעוגלות, צללים רכים או צבעים מחוץ לפלטה.

## תצוגה
הקבצים נפתחים ישירות מהדיסק (file://). ב-Preview של האפליקציה: `portfolio-ds` ב-`Desktop/.claude/launch.json` (פורט 5181, מגיש mirror מה-scratchpad של הסשן, צריך rsync לפני).

- v1.20 (2026-11-10): **תוספות קטנות**. design-system.html (Other site components): Next project (`a.cs-next`), HUD שעוקב אחרי הסקשן, Skip link, Trophy (אייקון `trophy` חדש, צהוב), Cheat code, 404, Page transition, Contact form. brand-book.html: תבנית סושיאל **06 Share** (1200×630, התצוגה המקדימה של קישור; `export-social.sh share` → `exports/share.png` → עותק ב-`assets/img/og/share.png`) והאייקון `trophy` ברשימה.
- v1.20 (המשך, 2026-11-10): Back to top מרחף (`.icon-btn.to-top`) וכרטיס achievement מוגדל, ב-design-system.html (Other site components).
