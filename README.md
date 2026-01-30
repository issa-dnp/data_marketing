# Dashboard Data Marketing - BricoMetal

Ce projet est un tableau de bord interactif conçu pour explorer et analyser les données marketing de BricoMetal (Ads, Analytics, SEO et Commandes).

## 🚀 Fonctionnalités

Le dashboard propose plusieurs missions d'analyse :
- **Mission 1 : Analyse Campagnes** - Classement et performance des campagnes Ads.
- **Mission 2 : Comparatif Appareils** - Comparaison SEO vs Ads par type d'appareil.
- **Mission 3 : Heatmap Jour x Heure** - Intensité des clics par créneau horaire.
- **Mission 4 : Profil Audience** - Répartition par sexe et âge.
- **Mission 5 : Cannibalisation Mots-Clés** - Identification des doublons SEO vs Ads.
- **Mission 6 : Comparatif CTR** - Performance relative du taux de clic.
- **Mission 7 : Corrélation Analytics vs SEO** - Impact du positionnement sur les vues.
- **Mission 8 : Ads vs Commandes** - Corrélation entre budget Ads et volume de ventes.

## 🛠️ Installation et Démarrage

Ce projet utilise **React** avec **Vite**.

1. **Installer les dépendances** :
```bash
npm install
```

2. **Lancer le serveur de développement** :
```bash
npm run dev
```

3. **Accéder au dashboard** :
Ouvrez votre navigateur sur `http://localhost:5173`.

## 📂 Structure des données

Les données sont stockées sous forme de fichiers CSV dans le dossier `public/data/` :
- `ads/` : Données Google Ads.
- `analytics/` : Données Google Analytics (GA4).
- `seo/` : Données Search Console.
- `web/` : Données des commandes du site web.

## 🧱 Architecture technique

- **Core** : React (JSX), Vite.
- **Visualisation** : Recharts.
- **Style** : Vanilla CSS.
- **Parsing** : PapaParse (via utilitaires personnalisés).
