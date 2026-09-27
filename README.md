# emma-ia-front — Interface Utilisateur

## Description

Application web React pour discuter avec Emma IA, l'assistante d'analyse de crédit de SecureFinance-RAG, et consulter le rapport détaillé généré après une analyse complète. Interface de démonstration publique, responsive, avec Redux pour la gestion d'état de la conversation.

🔗 **Lien de démonstration :** https://emma-ia-front.vercel.app/ *

## Fonctionnalités

- **Discussion** : chat en temps réel avec Emma IA, mémoire de conversation côté client (aucune base de données), effet de frappe progressive sur les réponses, chrono et statuts d'attente pendant la génération
- **Détection automatique de dossier** : coller un JSON de dossier n'importe où dans un message (au début, au milieu, à la fin, avec ou sans texte d'accompagnement) suffit à ce qu'Emma l'exploite pour toute la suite de la conversation
- **Analyse complète** : sur demande, génère un rapport structuré (métriques officielles, ratios ABD/ATD si applicables, bureau de crédit, dettes, documents fournis/manquants) et propose un accès direct à la page détails
- **Page Détails** : rendu générique qui s'adapte au type de crédit réellement analysé (marge personnelle, HELOC, prêt personnel, prêt hypothécaire, carte de crédit) sans supposer une structure fixe
- **Page Comment tester** : explique le fonctionnement de la démo, la structure du JSON attendu, et fournit un JSON d'exemple copiable pour chacun des 5 types de crédit pris en charge
- **Sidebar de conversations** : historique de session, création de nouvelle discussion avec confirmation si la discussion en cours contient déjà des messages
- **Interface responsive** : adaptée mobile, tablette et desktop, avec gestion correcte du clavier virtuel mobile

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | React 18 |
| Langage | TypeScript |
| État | Redux Toolkit |
| Styling | Tailwind CSS v4 |
| Icônes | React Icons |
| Routage | React Router |
| Build | Vite |
| Déploiement | Vercel |

## Architecture Frontend

```
┌─────────────────────────────────────────────────────────────────┐
│                       React Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│   │    Pages     │    │  Components  │    │    Hooks     │      │
│   │ (Discussion, │    │  (chat,      │    │  (chat API,  │      │
│   │  Details,    │    │  sidebar,    │    │  typewriter, │      │
│   │  Instructions)│   │  header)     │    │  timer)      │      │
│   └──────────────┘    └──────────────┘    └──────────────┘      │
│          │                   │                   │              │
│          └───────────────────┴───────────────────┘              │
│                              │                                  │
│                     ┌────────▼────────┐                         │
│                     │   Redux Store   │                         │
│                     │ (conversation,  │                         │
│                     │  dossier,       │                         │
│                     │  analyse)       │                         │
│                     └────────┬────────┘                         │
│                              │                                  │
│                     ┌────────▼────────┐                         │
│                     │  API Service    │                         │
│                     │    (fetch)      │                         │
│                     └─────────────────┘                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  demo-backend    │
                    │   (Render.com)   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ emma-ia-service  │
                    │   (Render.com)   │
                    └──────────────────┘
```
