# Hearth & Hem — Front-End Website Prototype

A responsive, accessible front-end prototype for **Hearth & Hem**, a fictional
small-batch clothing retailer, built for Assessment 2 (Design and
Implementation of a Responsive Front-End Web Interface).

**Industry:** Retail (fashion / clothing)

## Live demo

Deployed URL: _add your GitHub Pages (or other host) URL here before submission_

## Assessment evidence

The final prototype is designed to evidence semantic HTML, responsive CSS, keyboard-accessible interactions, client-side validation, and maintainable vanilla JavaScript. Before submission, run the site at 320px, 375px, 768px, 1024px and 1440px widths and record screenshots/results from an accessibility checker. The repository should also retain meaningful Git commits showing development and refinement.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, featured products, brand values, newsletter sign-up |
| Shop | `shop.html` | Full product grid with category filtering, live search, and a quick-view modal |
| About | `about.html` | Brand story, process, and an FAQ accordion |
| Contact | `contact.html` | Contact form with inline validation, studio details |

## Tech used

- **HTML5** — semantic elements (`header`, `nav`, `main`, `section`, `article`, `footer`, `dl`, `ol`)
- **CSS3** — custom properties (design tokens), Flexbox, CSS Grid, `clamp()` for fluid type, mobile-first media queries
- **Vanilla JavaScript** — no frameworks or libraries

No build step is required — the site is plain static HTML/CSS/JS.

## Interactive features (JavaScript)

1. **Mobile navigation toggle** — accessible hamburger menu (`js/main.js`), collapses to a single button under 56rem and expands to a horizontal nav above it.
2. **Category filter + live search** (`js/shop.js`) — the shop grid filters dynamically as you click a category chip or type in the search box, with a live results count and an empty state.
3. **Quick-view modal** (`js/shop.js`) — clicking "Quick view" on a product opens an accessible dialog (focus trap, `Escape` to close, focus returned to the trigger on close).
4. **FAQ accordion** (`js/about.js`) — single-open accordion built from native `<button>` elements with `aria-expanded`/`aria-controls`.
5. **Contact form validation** (`js/contact.js`) — inline, per-field validation on blur and on submit, with error text tied to each input via `aria-describedby` and an `aria-live` status region.
6. **Dark / light theme toggle** (`js/main.js`, optional extension) — persisted with `localStorage` and respects the user's `prefers-color-scheme` on first visit.

## Accessibility notes

- One `<h1>` per page with a logical heading hierarchy beneath it.
- All form fields have associated `<label>` elements; errors are announced via `aria-live` and linked with `aria-describedby`.
- All interactive controls (nav toggle, chips, accordion, modal, theme toggle) are real `<button>` elements, so they are keyboard operable and have visible `:focus-visible` outlines by default.
- A "Skip to main content" link is the first focusable element on every page.
- The quick-view modal traps keyboard focus while open, closes with Escape or the close control, closes when the backdrop is clicked, and returns focus to the triggering button on close.
- The colour palette is designed for readable contrast in both themes; contrast should be verified with a recognised checker as part of final assessment evidence.
- `prefers-reduced-motion` is respected — all transitions are disabled for users who request it.
- Decorative SVGs use `aria-hidden="true"`; meaningful illustrations use `role="img"` with a text alternative.

## Project structure

```
hearth-and-hem/
├── index.html
├── shop.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js      # shared: nav toggle, theme toggle, newsletter form
│   ├── shop.js       # shop page: filter, search, quick-view modal
│   ├── about.js      # about page: FAQ accordion
│   └── contact.js    # contact page: form validation
└── README.md
```

## Running locally

No server is required — open `index.html` directly in a browser, or serve the
folder with any static server, e.g.:

```
npx serve .
```

## Deploying (GitHub Pages)

1. Push this folder to a public GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   choose the `main` branch and the `/ (root)` folder, then save.
4. GitHub will publish the site at `https://<username>.github.io/<repo-name>/`
   within a minute or two — add that URL to the top of this README and to
   your assessment report.

## Design notes

- **Palette:** warm oat background, espresso ink text, moss-green accent, and
  a muted blush secondary — chosen to reflect the brand's "natural fibres,
  made to last" positioning rather than a generic storefront look.
- **Type:** Fraunces (display serif) for headings paired with Work Sans
  (grotesk sans) for body text and UI chrome.
- **Layout:** left-aligned, editorial-style sections; CSS Grid for the
  product grid and value/process blocks, Flexbox for the header and forms.
- Product imagery is original flat SVG illustration (not stock photography),
  keeping the prototype dependency-free and fast to load.


## Photography sources
The placeholder product illustrations were replaced with real retail/fashion photography for the front-end prototype. Images are loaded from their original public image hosts; check each source's current licence/usage terms before commercial use.

Sources used include Unsplash and public product/editorial image hosts: Unsplash clothing boutique photo (Clark Street Mercantile), Unsplash fashion/coat and knitwear photos, and image-search results for linen dress, trousers and scarf imagery.


## ICT203 responsive design notes
- Industry context: Australian retail fashion prototype.
- Mobile-first CSS is used: the base layout targets small screens first.
- CSS Grid and Flexbox are used for navigation, hero, product cards, forms and footer layouts.
- Responsive breakpoints progressively enhance the layout for tablet (40rem), desktop (60rem) and large desktop (75rem).
- No prohibited framework is used. The site uses HTML5, CSS3 and vanilla JavaScript only.
- Interactive controls use approximately 44px minimum touch targets, mobile overflow is constrained, and responsive layouts use minmax(0, 1fr) where appropriate.

## Final visual polish and QA

The final refinement adds a more editorial product-card system, richer quick-view detail presentation, saved-piece micro-interactions, resilient image loading/error states, refined tablet/desktop spacing, consistent focus treatment, reduced-motion support, and polished empty/loading feedback. The shop quick view remains keyboard accessible with focus trapping, Escape-to-close and focus restoration.

Responsive live evidence is stored in `qa/LIVE-TEST-EVIDENCE.md`, with Chromium-rendered screenshots at 320px, 375px, 768px, 1024px and 1440px in `qa/screenshots/`.
