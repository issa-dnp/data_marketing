# � Guide du Projet Dashboard Bricométal
*Pour le Data Marketer Néophyte*

Bienvenue dans ce projet ! Ce document a pour but de t'expliquer de façon **simple et claire** ce qu'est cette application, comment elle est organisée, et comment elle fonctionne, sans jargon technique complexe.

---

## 1. C'est quoi ce projet ? 🎯

Imagine que ce projet est un **tableau de bord interactif** (Dashboard).

Son but est simple : **Transformer des données brutes** (fichiers CSV, listes de produits, chiffres de ventes) en **visuels compréhensibles** (graphiques, tableaux triables).

Pour un Data Marketer, c'est l'outil qui te permet de piloter l'activité. Au lieu de regarder des fichiers Excel interminables, tu navigues dans une interface web propre pour voir les performances, les stocks, ou toute autre métrique clé de "Bricométal".

---

## 2. L'Archétype : Comment c'est construit ? 🏗️

Ce projet utilise une architecture moderne appelée **"Single Page Application" (SPA)** basée sur des **Composants**.

### L'analogie du LEGO 🧱
Imagine que cette application est construite en LEGO.
Au lieu d'écrire une seule page immense et complexe, les développeurs ont créé des petites briques indépendantes qu'on appelle des **Composants**.

*   Une brique "Graphique" 📊
*   Une brique "Tableau de données" 🔢
*   Une brique "Menu latéral" (Sidebar) 🗂️

L'application (`App.jsx`) est simplement le plan de montage qui assemble ces briques pour former l'écran que tu vois.

**Pourquoi c'est bien ?**
Si tu veux changer la couleur de tous les graphiques, tu changes juste la brique "Graphique", et ça se met à jour partout !

---

## 3. La Structure du Dossier (L'anatomie) 📂

Voici comment te repérer dans les dossiers, comme si tu visitais une maison :

### 🏠 La Racine (`/`)
C'est l'entrée. Tu y trouves les fichiers de configuration administrative.
*   `package.json` : C'est la **carte d'identité** du projet. Il liste le nom du projet et tous les outils qu'il utilise (les "dépendances").
*   `README.md` : Le mode d'emploi technique (pour les développeurs).

### 🛠️ Le dossier `src` (La Cuisine)
C'est ici que tout se prépare. "Src" veut dire "Source". 99% du travail se passe ici.

*   � **`src/components` (Les Ustensiles)** :
    *   C'est ici que sont rangées nos briques LEGO.
    *   `Sidebar.jsx` : Le menu de gauche pour naviguer.
    *   `QuickChart.jsx` : Le composant qui dessine les graphiques.
    *   `DataTable.jsx` : Le composant qui affiche les jolis tableaux.
    
*   � **`src/data` (Les Ingrédients)** :
    *   C'est ici que sont stockées les données ou la configuration des catégories.
    *   `catalog.js` : C'est le **sommaire** de ton dashboard. Il dit "Voici les sections disponibles (ex: Ventes, Marketing) et voici les fichiers à afficher dedans".

*   📂 **`src/utils` (Les Robots Ménagers)** :
    *   Des petits outils invisibles qui aident à calculer des choses, formater un prix, ou trier des données.

*   📄 **`src/App.jsx` (Le Chef Cuisinier)** :
    *   C'est le fichier principal. Il décide : "Si l'utilisateur clique sur 'Ventes', alors j'affiche le composant `FileViewer` avec les données de ventes".

### 🖼️ Le dossier `public` (La Vitrine)
*   Ici, on met les images, les logos, les icônes qui ne changent pas. Ce sont les éléments statiques qui sont directement accessibles.

---

## 4. Résumé du flux (Data Flow) 🔄

Voici ce qui se passe quand tu lances l'application :

1.  **Lancement** : L'application lit `catalog.js` pour savoir quelles sections afficher dans le menu.
2.  **Affichage** : Le Chef (`App.jsx`) affiche le Menu (`Sidebar`) à gauche.
3.  **Action** : Tu cliques sur un dossier dans le menu.
4.  **Réaction** : L'application va chercher les données correspondantes et demande au composant d'affichage (`FileViewer`) de se dessiner à l'écran, soit en tableau (`DataTable`), soit en graphique (`QuickChart`).

---

**En bref :**
*   **C'est quoi ?** Un site web pour visualiser des données marketing.
*   **C'est fait comment ?** En React (technologie web performante), assemblé via des composants réutilisables.
*   **Où sont mes données ?** Référencées dans `src/data` et affichées par `src/components`.
