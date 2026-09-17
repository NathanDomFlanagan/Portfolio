// One-off dev helper — NOT part of any build/deploy step. GitHub Pages serves
// the generated *.html files directly, unchanged. Run manually with `node
// scripts/generate-redirects.js` only when adding, renaming, or removing a
// page that needs an old-URL redirect stub.
const fs = require('fs');
const path = require('path');

const pages = [
  { slug: 'about', title: 'About' },
  { slug: 'contact', title: 'Contact' },
  { slug: 'projects', title: 'Projects' },
  { slug: 'game', title: 'Games' },
  { slug: 'resume', title: 'Resume' },
];

function stub({ slug, title }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title} — Nathan Flanagan</title>
    <!-- This page moved to /${slug}/ for a cleaner URL. Kept as a redirect stub
         (rather than deleted) so an old bookmark or indexed search result for
         ${slug}.html still lands somewhere, instead of 404ing. -->
    <meta http-equiv="refresh" content="0; url=${slug}/" />
    <link rel="canonical" href="https://nathandomflanagan.github.io/Portfolio/${slug}/" />
  </head>
  <body>
    <p>This page has moved to <a href="${slug}/">${slug}/</a>.</p>
  </body>
</html>
`;
}

for (const page of pages) {
  fs.writeFileSync(path.join(__dirname, '..', `${page.slug}.html`), stub(page));
  console.log(`wrote ${page.slug}.html`);
}
