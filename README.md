# Portfolio

My personal portfolio website — built to showcase the projects I've made, a bit about me, and a couple of fun extras along the way.

## Overview

A multi-page site built with vanilla HTML, CSS, and JavaScript (no framework required to run it). It includes:

- **Home** (`index.html`) — landing page
- **About** (`about.html`) — background and skills
- **Projects** (`projects.html`) — showcase of projects I've built
- **Contact** (`contact.html`) — ways to get in touch
- **Game** (`game.html`) — a few playable browser games (Snake, Tic-Tac-Toe, and a random number generator game) as a fun extra
- **404** (`404.html`) — custom not-found page

## Tech Stack

- HTML5 / CSS3
- Vanilla JavaScript
- No build step required — pages run directly in the browser

## Project Structure

```
Portfolio/
├── index.html          # Home page
├── about.html           # About page
├── projects.html         # Projects showcase
├── contact.html          # Contact page
├── game.html             # Mini-games page
├── 404.html               # Custom 404 page
├── navbar.js              # Shared navigation bar logic
├── smoothScrolling.js      # Smooth scroll behaviour
├── random.js                # Random number generator game logic
├── snake.js                   # Snake game logic
├── tictactoe.js                # Tic-Tac-Toe game logic
├── styles.css                    # Site-wide styling
└── package.json                    # Project dependencies
```

## Running Locally

No build tools required for the core site. Clone the repo and open `index.html` in your browser:

```bash
git clone https://github.com/NathanDomFlanagan/Portfolio.git
cd Portfolio
```

Then open `index.html` directly, or serve it locally, e.g.:

```bash
npx serve .
```

## Live Site

https://nathandomflanagan.github.io/Portfolio/

## About Me

I'm a recent graduate with a Bachelor of Computer and Information Sciences (Software Development, Networks & Cybersecurity) from AUT, based in Auckland, New Zealand. This site is where I collect the projects I build as I grow my skills across software development and cybersecurity.

## Contact

Feel free to reach out via the [contact page](./contact.html) on the site, or find me on GitHub [@NathanDomFlanagan](https://github.com/NathanDomFlanagan).
