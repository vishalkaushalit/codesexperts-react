import app from './app.ts';

// Local / self-hosted entry point. On Vercel the app is exported as a function instead (see scripts/vercel-build.mjs).
const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
    console.log(`CodesExperts API running on http://localhost:${port}`);
});
