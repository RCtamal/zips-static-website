# Updating the ZEECO deck

1. Edit the slide's `<section class="slide">` block in `index.html` (text is plain HTML; styles are in `css/style.css`).
2. Copy `index.html`, `css/`, `js/`, `sw.js` into `deploy/`, then zip `deploy/` contents (forward-slash paths, files at zip root) as `zeeco-pitch-site.zip`.
3. In Netlify, open the zeeco-pitch project, then Deploys, and drop the zip. Bump `C = 'zeeco-v1'` in `sw.js` if offline users must refresh.
