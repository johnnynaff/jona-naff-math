# Jonathan Naffrichoux — academic website

A Jekyll site, which GitHub Pages builds for you. You never edit generated HTML: you edit
**settings** (`_config.yml`), **content** (`_data/*.yml` and the page files), and only touch
**templates** and **styles** when you want to change the look.

## Publish it on GitHub (once)

1. Create a repository named **`USERNAME.github.io`** (USERNAME = your GitHub user name).
2. Upload all the files in this folder to the repository (keep the folder structure).
3. In `_config.yml`, set `url: "https://USERNAME.github.io"`.
4. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`. The site appears at `https://USERNAME.github.io` after a minute.

Using another repository name (e.g. `website`)? Then also set `baseurl: "/website"`.

## Where things are

```
_config.yml              Name, email, lab, university, address, supervisors
_data/
  navigation.yml         Sidebar menu (order, titles, icons)
  social.yml             ORCID, HAL, arXiv, Scholar, GitHub, LinkedIn links
  research.yml           Research themes (Home list + Research page cards)
  publications.yml       Papers and preprints
  talks.yml              Talks (grouped by year automatically)
  teaching.yml           Teaching, grouped by academic year
  education.yml          Education timeline (About page)
  news.yml               News items on the Home page
  labels.yml             Names of publication/talk types (= filter buttons)

index.html               Home page        (hero: _includes/hero.html)
about.md                 About page       (plain Markdown, easy to edit)
research.html            Research page    (intro text + themes from research.yml)
publications.html        Publications     (entries from publications.yml)
talks.html               Talks
teaching.html            Teaching
contact.html             Contact
404.html                 "Page not found"

_layouts/
  default.html           Page skeleton: top bar + sidebar + content + footer
  page.html              Inner pages: title block + content
  home.html              Home page: hero + content

_includes/               Building blocks, one per file
  head.html              <head>: fonts, KaTeX, stylesheets
  sidebar.html           Sidebar (identity, menu, links, theme switch)
  navigation.html        Menu items
  social-links.html      Icon links in the sidebar
  theme-toggle.html      Light/dark button
  topbar.html            Mobile top bar with menu button
  page-header.html       Title block of inner pages
  hero.html              Home hero + interactive figure
  publication.html       One publication entry
  talk.html              One talk entry
  filter-bar.html        Filter buttons + search box
  icon.html              All SVG icons
  footer.html            Footer
  scripts.html           Script tags

assets/css/
  tokens.css             Colours (light + dark), fonts, sizes  ← change the palette here
  base.css               Typography and defaults
  layout.css             Two-column layout, page header, footer, mobile bar
  sidebar.css            Sidebar and mobile drawer
  components.css         Buttons, tags, cards, filter bar, timeline…
  pages/*.css            Styles used by one page only

assets/js/
  theme-init.js / theme.js   Light/dark mode (remembers the visitor's choice)
  nav.js                 Mobile menu drawer
  filter.js              Filtering/search on Publications and Talks
  copy.js                Copy buttons (BibTeX, email)
  math.js                KaTeX rendering
  sample-paths.js        Interactive SDE figure on the Home page
  research.js            Opens a research card when linked from Home

assets/img/              avatar.svg (placeholder portrait), favicon.svg
```

## Everyday edits

- **Add a paper**: copy an entry in `_data/publications.yml`, put it at the top, fill in the fields.
  Only fill the ones you have (`arxiv`, `hal`, `doi`, `pdf`…); empty ones are hidden.
- **Add a talk**: same in `_data/talks.yml`. Dates as `"2027-03-14"` (with quotes).
- **Remove the examples**: delete the entries marked `example: true` in publications, talks and teaching.
- **Your photo**: save a square image as `assets/img/photo.jpg` and set `avatar: /assets/img/photo.jpg` in `_config.yml`.
- **Your CV**: put `cv.pdf` in `assets/files/` and set `cv: /assets/files/cv.pdf` — a download button appears on About.
- **Mathematics**: in `.html` pages write `\( … \)` inline and `$$ … $$` on its own line for display.
  In `.md` files and in the `details`/`abstract` fields of the data files, use `$$ … $$` for both
  (kramdown makes it inline when it is inside a sentence).
- **Add a page**: create `newpage.md` with
  ```
  ---
  title: My page
  permalink: /my-page/
  ---
  ```
  and add it to `_data/navigation.yml`.

## Things to check before going live

- [ ] `url` in `_config.yml`
- [ ] email address in `_config.yml`
- [ ] education entries in `_data/education.yml`
- [ ] profile links in `_data/social.yml`
- [ ] example entries removed

## Preview on your own computer (optional)

Install Ruby, then in this folder:

```
bundle install
bundle exec jekyll serve
```

and open http://localhost:4000.
