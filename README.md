# AWIT Tlemcen — Association Website

Website for **AWIT** (Association de Wilaya pour l'Insertion des Trisomiques de Tlemcen), a nonprofit based in Tlemcen, Algeria, supporting children and young people with Down syndrome and their families. Built with plain HTML5 / CSS3 / JavaScript (no framework) and Firebase (Firestore + Authentication) for the admin backend.

## Folder structure

```
/
├── index.html            Home
├── a-propos.html         History, vision, mission, team, partners
├── actions.html          The association's 8 programs
├── galerie.html          Filterable photo gallery + lightbox
├── actualites.html       News / events
├── don.html              Donation page (amounts, goal, bank details)
├── benevole.html         Volunteer application form
├── contact.html          Map, contact details, contact form
├── espace-famille.html   Advice, guides, FAQ for families
├── admin-login.html      Admin sign-in
├── admin.html            Admin dashboard (protected)
├── admin.js              Admin dashboard logic
├── firebase-config.js    Firebase project configuration
├── style.css             Stylesheet (design tokens, responsive)
├── script.js             Mobile nav, accessibility, animations, gallery, forms, phone field
└── images/                Photos (logo, activities, workshops, sports, events)
```

## Features

- **Responsive**: mobile, tablet, desktop.
- **Accessibility**: dark mode, high contrast, 3 text sizes, text-to-speech (Web Speech API), keyboard navigation, visible focus, skip link.
- **Animations**: scroll-reveal, animated counters, donation progress bar, smooth transitions.
- **Gallery**: category filters + fullscreen lightbox viewer.
- **International phone field**: country-code selector covering 248 countries (dial code + name), digits-only input filtering, and normalization that strips the local leading zero before combining with the dial code.
- **Forms** (donation, volunteering, contact): HTML5 validation, character limits with live counters, confirmation message, and data is sent to Firestore.
- **Admin dashboard** (`admin.html`, protected by Firebase Authentication):
  - Manage news articles and gallery photos (published live on the public pages).
  - Review volunteer applications, contact messages, and declared donations.
  - Live updates via Firestore `onSnapshot` listeners — tables refresh automatically, no page reload needed.
  - Notification badges for new/unhandled volunteers, messages, and donations.
- **SEO**: meta tags, Open Graph, JSON-LD (schema.org NGO).

See **`ADMIN-SETUP.md`** for full backend setup instructions (Firebase project creation, admin account, security rules).

## Quick deployment (static site)

- **Vercel / Netlify**: drag and drop the folder as-is, no build step needed (100% static site plus Firebase).
- **Traditional hosting**: copy all files to your server's document root.

⚠️ Since `firebase-config.js` will be public once pushed to GitHub, make sure your Firestore security rules restrict writes/reads appropriately before deploying — the config values themselves are not secret, but your rules are what actually protect your data.

## Quick customization

- Colors: edit the CSS variables at the top of `style.css` (`:root`).
- Contact details (phone, email, address, bank account/IBAN): replace the placeholder values on each page.
- Donation goal: in `don.html`, `data-goal` / `data-current` attributes on `.progress-fill`.

## Tech stack

- HTML5, CSS3, vanilla JavaScript — no build tools, no framework.
- [Firebase](https://firebase.google.com/) — Firestore (database) + Authentication (admin login).
