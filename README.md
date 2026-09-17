# Portfolio

My personal portfolio website — built to showcase the projects I've made, a bit about me, and a couple of fun extras along the way.

## Overview

A multi-page site built with vanilla HTML, CSS, and JavaScript (no framework required to run it). It includes:

- **Home** (`/`) — landing page
- **About** (`/about/`) — background and skills
- **Projects** (`/projects/`) — case studies for personal projects, each with a screenshot, write-up, and tech tags
- **Resume** (`/resume/`) — resume viewable inline (PDF embed) with a direct download link
- **Contact** (`/contact/`) — ways to get in touch
- **Game** (`/game/`) — a few playable browser games (Snake, Tic-Tac-Toe, and a Number Guesser) as a fun extra
- **404** (`404.html`) — custom not-found page

## Tech Stack

- HTML5 / CSS3
- Vanilla JavaScript
- No build step required — pages run directly in the browser
- Favicon + Open Graph/Twitter card metadata on every page for rich link previews when shared
- Clean, extension-less URLs (`/about/` rather than `/about.html`) — see **URL structure** below

## Project Structure

```
Portfolio/
├── index.html                    # Home page (stays at root — GitHub Pages
│                                  # serves it for "/" with no filename shown)
├── about/index.html              # About page
├── projects/index.html           # Projects showcase (case studies)
├── resume/index.html             # Résumé viewer page
├── contact/index.html            # Contact page
├── game/index.html               # Mini-games page
├── 404.html                      # Custom 404 page (must stay at root — GitHub
│                                  # Pages looks for it there specifically)
├── about.html                    # Redirect stub → /about/ (keeps old links working)
├── projects.html                 # Redirect stub → /projects/
├── resume.html                   # Redirect stub → /resume/
├── contact.html                  # Redirect stub → /contact/
├── game.html                     # Redirect stub → /game/
├── scripts/generate-redirects.js # Dev-only helper that (re)generates the 5
│                                  # redirect stubs above — not part of the live site
├── theme-init.js                 # Shared "avoid a flash of the wrong theme" script,
│                                  # loaded in every page's <head>
├── storage.js                    # Shared localStorage read/write helpers used by
│                                  # navbar.js, snake.js, and random.js
├── navbar.js                     # Shared navigation bar + theme toggle logic
├── lightbox.js                   # Full-screen image viewer for project screenshots
├── github-stats.js               # Swaps GitHub widgets to match light/dark theme
├── random.js                     # Number Guesser game logic
├── snake.js                      # Snake game logic
├── tictactoe.js                  # Tic-Tac-Toe game logic
├── styles.css                    # Site-wide styling
├── favicon.png                   # Site favicon
├── robots.txt                    # Search engine crawl rules
├── sitemap.xml                   # Search engine sitemap
├── images/                       # Project screenshots + social share preview image
└── files/                        # Downloadable documents (résumé PDF, vCard)
```

## URL Structure

Every page except the homepage and `404.html` lives in its own folder as `index.html`
(e.g. `about/index.html`), which is what lets GitHub Pages serve it at a clean URL
like `/about/` with no `.html` visible — a static host only hides a filename like
that for a directory's `index.html`, never for an arbitrary file. `404.html` has to
stay at the repo root because GitHub Pages specifically looks for it there.

The original flat filenames (`about.html`, `projects.html`, etc.) still exist as
tiny redirect stubs pointing at the new clean URLs, so any bookmark or previously
indexed search result for the old paths keeps working instead of 404ing.

## Live Site

https://nathandomflanagan.github.io/Portfolio/

## About Me

I'm a graduate with a Bachelor of Computer and Information Sciences (Software Development, Networks & Cybersecurity) from AUT, based in Auckland, New Zealand. This site is where I collect the projects I build as I grow my skills across software development and cybersecurity.

## Contact

Feel free to reach out via the [contact page](https://nathandomflanagan.github.io/Portfolio/contact/) on the site, or find me on GitHub [@NathanDomFlanagan](https://github.com/NathanDomFlanagan).
