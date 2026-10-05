# Georgia's Project Notes

## Goals
Photography portfolio for DSDN142 Project 3. Georgia is an industrial
design student who is "deep down always a photographer" (her own hero
subtitle). Design and content are now being filled in together.

## Design decisions
- Style direction: **moody & cinematic**, inspired by a "Martha Lives"
  director's-reel reference (plus three other references — two romantic
  wedding sites and a soft sage/cream studio site — that were considered
  and set aside in favour of the cinematic one).
- Palette: near-black, plum-tinted background with a **lilac accent**
  (changed from an initial monochrome bone/off-white accent) carrying
  headings glow, links, buttons, dividers and corner marks.
- Type: Playfair Display for all regular headings (nav, section titles,
  project titles); UnifrakturCook (gothic blackletter) used once, big, for
  the hero name only — a film-title moment. Poppins stays as body text.
- Motifs: a plain cross mark and a four-point star stand in for the
  template's original botanical "sprig" details (photo-frame corners,
  dividers, footer). The hero's drifting cross decorations + cursor-follow
  effect were later removed entirely (Georgia wanted the hero calmer).
- Photo frames: minimal hairline frame (not the template's original
  ornate gilt one); the about-me photo has a rounded arch top as a nod
  to the arched photo frame in the reference.
- All of this lives in the design tokens at the top of `styles.css` —
  changing a token value there ripples across the whole site.
- Hero has a real full-bleed photo (`assets/header-image.png`, wisteria
  flowers) as a CSS background, with a dark plum gradient over it so the
  title stays readable — needed because the photo is bright throughout.
  Markup: `.hero` is a full-width section with `.hero__bg` (the photo)
  and `.hero__inner` (the centred content column) as separate children.
- Project 1's card image (`#work`) is an **automatic slideshow**
  (`assets/P1.png`–`P5.png`, bokeh-themed) instead of a single static
  image — script.js runs any `data-slideshow` element, adding
  prev/next controls only if it finds them, so leaving them out (as
  here) makes it fully automatic.
- There's no separate Gallery section any more — Georgia decided the
  photo collage (`assets/P6.png`–`P9.png`) belongs to "Exploration of
  Bokeh" too, so it's now PROJECT 1's second row, inside `#work`'s
  `.grid` right under the slideshow row. Nav simplified from
  Work/Gallery/About to just Work/About. The collage itself is a
  single row of photos (`.collage`, `grid-template-columns:
  repeat(auto-fit, minmax(140px, 1fr))`), no title/text next to it —
  wraps to 2 across on narrow screens rather than staying in one line.
- Work cards use a text+photo row layout (`.card`, in a `.grid` of
  rows rather than tiled thumbnails): title, meta and description text
  in `.card__body`, photo/slideshow at a fixed 520px. The `.card--reverse`
  modifier flips photo-left/text-right instead of the default
  photo-right — not currently used (the collage row has no text at
  all now) but still there for future rows.
- The site-wide `.section__divider` (the hairline-and-diamond rule)
  sits AFTER each section's heading/intro rather than before it — a
  real element in the HTML, not a `::before`, so it can be positioned
  after the text instead of always being first. The same element is
  reused BETWEEN the two projects in `#work`'s `.grid` (with a
  `.section__divider--between-projects` modifier for a bit of extra
  margin) to mark a clean break between them.
- **"Power of Paua"** (`assets/P10.png`–`P15.png`, 6 photos, 3-column
  grid via `.collage--grid3`) started as a third row of Project 1, but
  is now its OWN project — Georgia's call. It has a full `<h3
  class="card__title">` (same as every other project title, not the
  smaller `.collage__title` a sub-row would use) and a
  `.section__divider--between-projects` line both above it (breaking
  from "Exploration of Colour") and below it (the one that already
  existed before "Art in new forms" now serves this purpose). It has
  no card/link/page of its own though — just a title over a photo grid,
  unlike the other two projects.
- **Project 2** ("Art in new forms") — a second full project: a card
  in `#work`'s `.grid` (`.card--text-only`, no photo of its own since
  the real photos sit in the row below it — text spans the full width,
  not capped at the usual 45ch) linking to `project-2.html`
  (duplicated from `project.html`, still all REPLACE placeholders on
  that page itself).
- Project 2's photo row (`assets/P21.png`–`P25.png`, dreamy
  impressionistic blossom/water-reflection shots) is a hand-fitted
  **`.masonry`** — a CSS Grid "justified" tessellation matching a
  reference image Georgia shared: 4 columns, all one height, edge to
  edge (bare `<img>`s, no `.polaroid` frame/padding/corner-marks),
  with the 3rd column holding two photos stacked to match that height.
  Column widths (`1.504fr 1fr 1.132fr 1fr`) are each photo's actual
  aspect ratio, so the `object-fit: cover` crop needed to make the
  edges line up is gentle rather than a hard square crop. This is a
  one-off layout tuned to these specific five photos, not a flexible
  "add more and it adapts" pattern like `.collage` — a very different
  approach from Project 1's rows, which never crop at all.

## Content still to add
- Real About Me paragraph (current text is still placeholder/test copy).
- Alt text for P1–P15 and P21–P25 (all still "REPLACE: describe this
  photo").
- Project 2's description text and its card thumbnail (still generic
  REPLACE placeholders), plus all of `project-2.html`'s own content
  (title/meta/description/gallery images).
- Real photo for the about section (still a placeholder).

## Next steps
- Fill in the remaining REPLACE placeholders above.
- Keep new photos reasonably web-sized (the P1–P5 and header images are
  1.3–1.9MB each — fine for now, worth a mention before final hand-in).
