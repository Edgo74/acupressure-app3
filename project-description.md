🎯 Objectif

Construire une app iOS/Android qui permet :

de rechercher des points d’acupression par symptômes (ex. “mal de tête”),

d’afficher les images + descriptions de chaque point,

de mettre en favori des points,

d’utiliser une recherche sémantique (RAG) via embeddings stockés dans Supabase.

🧱 Stack

Frontend : React Native (Expo), TypeScript, expo-router

Backend : Supabase (Postgres + pgvector, Auth, Storage, Edge Functions)

Embeddings : OpenAI text-embedding-3-small (⚠️ côté Edge Function, jamais dans l’app)

Images : Supabase Buckets

🔐 Secrets / env

L’OpenAI API key ne doit pas être exposée côté mobile. Utiliser une Supabase Edge Function pour générer l’embedding des requêtes et interroger la base vectorielle.

L’app mobile utilise uniquement SUPABASE_URL et SUPABASE_ANON_KEY.

📱 Écrans MVP

Onboarding/Login (optionnel au début) : anonyme pour MVP.

Recherche (écran principal)

Input texte → envoi à l’Edge Function /query → liste de résultats (image, nom, résumé, score).

Détail d’un point

Image HD, nom/code, description complète, tags/zone du corps, bouton Favori.

Favoris

Liste locale (AsyncStorage) pour MVP, table favorites si Auth activée plus tard.

Paramètres

Langue (FR/EN), taille du texte, thème clair/sombre.

🗂️ Structure projet (côté app)

app/
  _layout.tsx
  index.tsx                  // écran Recherche
  point/[id].tsx             // écran Détail
  favorites.tsx              // écran Favoris
lib/
  supabase.ts                // client supabase
  api.ts                     // appels à l’Edge Function
  types.ts                   // types TS
components/
  SearchBar.tsx
  PointCard.tsx
  EmptyState.tsx
state/
  favorites.ts               // store (zustand) ou AsyncStorage


🎨 UI (composants clés)

SearchBar : TextInput + debounce 300ms → searchPoints()

PointCard : Image (resizeMode='cover'), Titre, résumé (2–3 lignes), badge similarity (optionnel), bouton Favori

Liste virtualisée (FlashList ou FlatList) + lazy loading d’images