import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/** Enregistre le service worker (sauf en développement local, où il servirait des fichiers périmés). */
const REGISTER_SW = `
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  });
}`;

const BACKGROUND = `
html, body { background-color: #ECEDF0; }
@media (prefers-color-scheme: dark) { html, body { background-color: #0A0B0E; } }`;

/** Page HTML racine de la version web : métadonnées d'installation (PWA), couleurs et service worker. */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Gym Addict</title>
        <meta name="description" content="Full assist app : Suivi d'entraînement" />
        <meta name="theme-color" content="#ECEDF0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0A0B0E" media="(prefers-color-scheme: dark)" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="GymAddict" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: BACKGROUND }} />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: REGISTER_SW }} />
      </body>
    </html>
  );
}
