# 🐾 Paws & Preferences

A mobile-first cat swiping app — swipe right to like, left to pass — built with **React + Vite + Tailwind CSS**.

## Tech Stack

| Layer      | Choice            | Why                                    |
|------------|-------------------|----------------------------------------|
| Framework  | React 18          | Component model, hooks, fast re-renders |
| Bundler    | Vite 5            | Instant dev server, optimised builds   |
| Styling    | Tailwind CSS 3    | Utility-first, easy responsive design  |
| Cat API    | Cataas            | Free random cat image CDN              |

## Project Structure

```
paws-preferences/
├── index.html                  # HTML entry point (Google Fonts loaded here)
├── vite.config.js              # Vite config (base path for GitHub Pages)
├── tailwind.config.js          # Extended theme: colours, fonts, animations
├── postcss.config.js           # PostCSS plugins (Tailwind + Autoprefixer)
└── src/
    ├── main.jsx                # React mount point
    ├── App.jsx                 # Root – manages screen transitions & shared state
    ├── index.css               # Tailwind directives + custom CSS utilities
    ├── config/
    │   └── config.js           # All magic numbers in one place
    ├── hooks/
    │   └── useSwipe.js         # Reusable swipe gesture hook (mouse + touch)
    └── components/
        ├── IntroScreen.jsx     # Landing / welcome screen
        ├── DeckScreen.jsx      # Main swiping deck screen
        ├── CatCard.jsx         # Individual swipeable card
        └── ResultsScreen.jsx   # Summary screen with liked cat grid
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

## Building for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Deploying to GitHub Pages

1. In `vite.config.js`, set `base` to your repo name:
   ```js
   base: '/paws-preferences/'
   ```

2. Build and push the `dist/` folder to the `gh-pages` branch:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

## Configuration

All tunable parameters live in `src/config/config.js`:

| Constant           | Default | Description                             |
|--------------------|---------|-----------------------------------------|
| `TOTAL_CATS`       | 15      | Number of cat cards per session         |
| `SWIPE_THRESHOLD`  | 100     | Drag distance (px) to confirm a swipe   |
| `TILT_FACTOR`      | 0.07    | Rotation degrees per px of drag         |
| `MAX_TILT`         | 20      | Max card rotation angle                 |
| `RESULTS_DELAY`    | 800     | Ms before navigating to results screen  |
