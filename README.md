# DSC Complete Building Solutions

Website for [dsccbs.co.uk](https://www.dsccbs.co.uk). It's built with [Eleventy](https://www.11ty.dev/) and [Tailwind CSS v4](https://tailwindcss.com/) and deployed on Netlify. It replaces the old WordPress (Renovate theme) site.

## Development

Requires Node 20+ (`nvm use` picks up `.nvmrc`).

```sh
npm install
npm run dev     # http://localhost:8080 with live reload
npm run build   # production build into _site/
```

## Structure

```
src/
  _data/site.js        business details (phone, email, address, hours, GA ID)
  _data/nav.js         main menu
  _includes/           layouts, header/footer, macros (service card, feature item…)
  assets/css/main.css  Tailwind entry and brand tokens (@theme)
  assets/js/main.js    mobile menu, hero slider, gallery lightbox
  services/*.md        one file per service
  images/              photos (same year/month layout as the old wp-content/uploads)
```

### Editing a service

Each file in `src/services/` has front matter that sets:

- `title`: the service name.
- `order`: its position in menus and listings.
- `excerpt`: the text on the service card.
- `thumbnail`: the card image.
- `images`: the two header photos.
- `covered`: the "Services Covered" bullet list.
- `gallery`: thumbnail and full-size image pairs.

The Markdown body is the "Service Overview" text. The file name sets the URL (`roofing.md` → `/services/roofing/`).

### Brand

The colours are set in `src/assets/css/main.css`:

- `brand` `#82B541` is the DSC green.
- `body` `#444` is the body text colour.
- `mist` `#F5F5F5` is the grey section background.
- `line` `#E2E6E7` is the border colour.

The font is Raleway, self-hosted. Icons are [Lucide](https://lucide.dev/), inlined with `{% icon "name", "classes" %}`.

## Netlify

`netlify.toml` sets the build command, pins Node 22, adds security and cache headers, and sets up 301 redirects from the old WordPress URLs:

- `/?p=123` shortlinks
- `/wp-content/uploads/*`
- feeds

