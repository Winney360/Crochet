# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Landing page (Fruitables port)

I added a Tailwind-based landing page modeled after the Fruitables theme. Replace placeholder images in `src/assets/` with your crochet images.

Run dev server:

```powershell
pnpm install
pnpm run dev
```

Files added:
- `src/components/Landing.jsx` - landing page wrapper
- `src/components/landing/*` - Hero, Features, Products, Testimonials, Footer
- `src/assets/*` - placeholder images

Next steps:
- Replace `src/assets/hero-placeholder.png` and `product-placeholder.png` with your crochet images.
- Tweak text, colors, and layout in the components as needed.
