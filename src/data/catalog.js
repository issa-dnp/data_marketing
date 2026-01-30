const catalog = {
  analyse: {
    label: 'Analyse',
    color: '#FF3D00', // Deep orange for strategy
    files: [
      { id: 'mission-budget-strategy', label: 'Stratégie Budget (€2000)', path: '/data/ads/Campagnes(2025.08.03-2026.01.29).csv', type: 'csv' },
    ]
  },
  mission: {
    label: 'Mission',
    color: '#FFD700', // Gold color for distinctiveness
    files: [
      { id: 'campagnes', path: '/data/ads/Campagnes(2025.08.03-2026.01.29).csv', label: 'Analyse Campagnes', description: 'Classement et Performance' },
      { id: 'mission-appareils', path: '/data/ads/Appareils(2025.08.03-2026.01.29).csv', label: 'Comparatif Appareils', description: 'SEO vs ADS sur les types d\'appareils' },
      { id: 'mission-heatmap', path: '/data/ads/Jour_et_heure(Jour_Heure_2025.08.03-2026.01.29).csv', label: 'Heatmap Jour x Heure', description: 'Intensité des clics par créneau' },
      { id: 'mission-demographie', path: '/data/ads/Donnees_demographiques(Sexe_Age_2025.08.03-2026.01.29).csv', label: 'Profil Audience (Sexe x Âge)', description: 'Répartition par tranche d\'âge et sexe' },
      { id: 'mission-keywords', path: '/data/ads/Mots_cles_pour_le_Reseau_de_Recherche(2025.08.03-2026.01.29).csv', label: 'Cannibalisation Mots-Clés', description: 'Doublons SEO vs ADS' },
      { id: 'mission-ctr', path: '/data/ads/Mots_cles_pour_le_Reseau_de_Recherche(2025.08.03-2026.01.29).csv', label: 'Comparatif CTR (SEO vs ADS)', description: 'Performance relative SEO vs ADS' },
      { id: 'mission-correlation', path: '/data/analytics/Pages_et_ecrans_Chemin_de_la_page_et_classe_de_lecran (1).csv', label: 'Corrélation Analytics vs SEO', description: 'Impact du SEO sur les vues GA4' },
      { id: 'mission-ads-orders', path: '/data/ads/Serie_temporelle(2025.07.28-2026.01.29).csv', label: 'Ads vs Commandes', description: 'Impact des denses Ads sur les ventes' },
      { id: 'mission-money-pits', label: 'Top 10 Gouffres (Keywords)', path: '/data/ads/Mots_cles_pour_le_Reseau_de_Recherche(2025.08.03-2026.01.29).csv', type: 'csv' },
      { id: 'mission-seo-ctr', label: 'Opportunités SEO (CTR)', path: '/data/seo/Requetes.csv', type: 'csv' },
      { id: 'mission-seo-quick-wins', label: 'SEO Quick Wins (Pos. 5-15)', path: '/data/seo/ranktracker.csv', type: 'csv' },
      { id: 'mission-ads-profitability', label: 'Rentabilité Ads (Conv/Coût)', path: '/data/ads/Campagnes(2025.08.03-2026.01.29).csv', type: 'csv' },
      { id: 'mission-seo-country', label: 'Analyse Pays (Trafic & CTR)', path: '/data/seo/Pays.csv', type: 'csv' },
    ],
  },
  ads: {
    label: 'Google Ads',
    color: '#4285F4',
    files: [
      { id: 'campagnes', path: '/data/ads/Campagnes(2025.08.03-2026.01.29).csv', label: 'Campagnes', description: 'Performance par campagne (coût, clics, conversions)' },
      { id: 'mots-cles', path: '/data/ads/Mots_cles_pour_le_Reseau_de_Recherche(2025.08.03-2026.01.29).csv', label: 'Mots-clés', description: 'Performance des mots-clés (coût, clics, CTR)' },
      { id: 'recherches-mot', path: '/data/ads/Recherches(Mot_2025.08.03-2026.01.29).csv', label: 'Recherches (mots)', description: 'Mots déclencheurs et leur volume' },
      { id: 'recherches-requete', path: '/data/ads/Recherches(Rechercher_2025.08.03-2026.01.29).csv', label: 'Recherches (requêtes)', description: 'Requêtes exactes des utilisateurs' },
      { id: 'reseaux', path: '/data/ads/Reseaux(2025.08.03-2026.01.29).csv', label: 'Réseaux', description: 'Répartition par réseau (Search, Display…)' },
      { id: 'appareils', path: '/data/ads/Appareils(2025.08.03-2026.01.29).csv', label: 'Appareils', description: 'Performance par type d\'appareil' },
      { id: 'demo-sexe', path: '/data/ads/Donnees_demographiques(Sexe_2025.08.03-2026.01.29).csv', label: 'Démographie (sexe)', description: 'Répartition homme/femme' },
      { id: 'demo-age', path: '/data/ads/Donnees_demographiques(Age_2025.08.03-2026.01.29).csv', label: 'Démographie (âge)', description: 'Répartition par tranche d\'âge' },
      { id: 'demo-sexe-age', path: '/data/ads/Donnees_demographiques(Sexe_Age_2025.08.03-2026.01.29).csv', label: 'Démographie (sexe × âge)', description: 'Croisement sexe et âge' },
      { id: 'jour-heure', path: '/data/ads/Jour_et_heure(Jour_Heure_2025.08.03-2026.01.29).csv', label: 'Jour × Heure', description: 'Heatmap jour/heure des clics' },
      { id: 'jour', path: '/data/ads/Jour_et_heure(Jour_2025.08.03-2026.01.29).csv', label: 'Par jour', description: 'Clics par jour de la semaine' },
      { id: 'heure', path: '/data/ads/Jour_et_heure(Heure_2025.08.03-2026.01.29).csv', label: 'Par heure', description: 'Clics par créneau horaire' },
      { id: 'serie-temporelle', path: '/data/ads/Serie_temporelle(2025.07.28-2026.01.29).csv', label: 'Série temporelle (semaine)', description: 'Évolution hebdomadaire (clics, CPC, impressions, coût)' },
      { id: 'serie-temporelle-jour', path: '/data/ads/Graphique_de_serie_temporelle(2025.08.03-2026.01.29).csv', label: 'Série temporelle (jour)', description: 'Impressions quotidiennes' },
      { id: 'score-opti', path: '/data/ads/Score_doptimisation(2025.08.03-2026.01.29).csv', label: 'Score d\'optimisation', description: 'Score d\'optimisation par campagne' },
      { id: 'variations', path: '/data/ads/Plus_fortes_variations(2025.08.03-2026.01.29_par_rapport_a_2025.02.04-2025.08.02).csv', label: 'Plus fortes variations', description: 'Comparaison période précédente' },
    ],
  },
  analytics: {
    label: 'Analytics',
    color: '#E37400',
    files: [
      { id: 'acquisition', path: '/data/analytics/Vue_densemble_de_lacquisition (3).csv', label: 'Acquisition', description: 'Vue d\'ensemble de l\'acquisition (GA4)' },
      { id: 'retention', path: '/data/analytics/Vue_densemble_de_la_retention.csv', label: 'Rétention', description: 'Rétention des nouveaux utilisateurs (cohorte jour par jour)' },
      { id: 'pages-ecrans', path: '/data/analytics/Pages_et_ecrans_Chemin_de_la_page_et_classe_de_lecran (1).csv', label: 'Pages & écrans', description: 'Vues, utilisateurs actifs, durée d\'engagement, événements, revenu par page' },
      { id: 'engagement', path: '/data/analytics/Vue_densemble_de_lengagement.csv', label: 'Engagement', description: 'Durée d\'engagement moyenne par jour' },
      { id: 'snapshot', path: '/data/analytics/Instantane_des_rapports (2).csv', label: 'Instantané', description: 'Résumé global (utilisateurs actifs, nouveaux, sessions, engagement)' },
    ],
  },
  seo: {
    label: 'Search Console (SEO)',
    color: '#34A853',
    files: [
      { id: 'requetes', path: '/data/seo/Requetes.csv', label: 'Requêtes', description: 'Mots-clés organiques (clics, impressions, CTR, position)' },
      { id: 'pages', path: '/data/seo/Pages.csv', label: 'Pages', description: 'Performance par page' },
      { id: 'appareils-seo', path: '/data/seo/Appareils.csv', label: 'Appareils', description: 'Performance par appareil' },
      { id: 'pays', path: '/data/seo/Pays.csv', label: 'Pays', description: 'Performance par pays' },
      { id: 'apparence', path: '/data/seo/Apparence dans les resultats de recherche.csv', label: 'Apparence recherche', description: 'Types de résultats (extraits, fiches…)' },
      { id: 'graphique-seo', path: '/data/seo/Graphique.csv', label: 'Série temporelle', description: 'Évolution quotidienne (clics, impressions, CTR, position)' },
      { id: 'filtres', path: '/data/seo/Filtres.csv', label: 'Filtres', description: 'Filtres appliqués à l\'export' },
      { id: 'ranktracker', path: '/data/seo/ranktracker.csv', label: 'Rank Tracker', description: 'Positions Google (mobile + desktop), volume de recherche, visibilité' },
    ],
  },
  web: {
    label: 'Site web (commandes)',
    color: '#7B1FA2',
    files: [
      { id: 'commandes', path: '/data/web/request_sql_2.csv', label: 'Commandes', description: 'Historique des commandes (client, date, nb produits, montant TTC)' },
    ],
  },
}

export default catalog
