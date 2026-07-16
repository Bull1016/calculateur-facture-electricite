# ⚡ Simulateur de Facture Électrique — SBEE Bénin

> Calculateur interactif de facture d'électricité basse tension basé sur le barème officiel de la SBEE (Société Béninoise d'Énergie Électrique).

---

## 📋 Présentation

Ce projet est une application web permettant de simuler avec précision le montant d'une facture d'électricité basse tension au Bénin. Il prend en charge les trois types de tarification SBEE :

| Tarif | Usage | Description |
|-------|-------|-------------|
| **BT 1** | Domestique | Clients résidentiels, avec tranche sociale (≤ 20 kWh) et tranches générales |
| **BT 2** | Professionnel | Commerces, ateliers, PME et locaux professionnels |
| **BT 3** | Éclairage public | Collectivités et voirie |

L'application calcule l'ensemble des composantes de la facture : énergie par tranche, prime fixe d'abonnement, taxe sur l'électricité, fonds d'électrification rurale et TVA.

---

## ✨ Fonctionnalités

- 🔢 **Saisie de la consommation** en kWh ou en Wh, avec conversion automatique
- 📅 **Prise en compte de la durée de facturation** (en jours) pour la détermination de la tranche sociale
- 🏷️ **Sélection du type de tarif** : BT 1 (domestique), BT 2 (professionnel), BT 3 (éclairage public)
- 🧾 **Décompte détaillé de la facture** : toutes les lignes de calcul affichées (tranches d'énergie, prime fixe, taxes, TVA, total TTC)
- 📊 **Graphiques de simulation** : visualisation de l'évolution du coût en fonction de la consommation
- ⚙️ **Éditeur de paramètres tarifaires** : modification des taux et montants unitaires pour simuler des scénarios alternatifs
- 📖 **Documentation intégrée** : affichage du barème officiel SBEE directement dans l'interface

---

## 🛠️ Stack technique

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** — interface utilisateur et typage
- **[Vite 6](https://vitejs.dev/)** — bundler et serveur de développement
- **[Tailwind CSS 4](https://tailwindcss.com/)** — mise en forme et design
- **[Lucide React](https://lucide.dev/)** — icônes
- **[Motion](https://motion.dev/)** — animations

---

## 🚀 Lancer le projet en local

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Bull1016/calculateur-facture-electricite.git
cd calculateur-facture-electricite

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Renseigner votre GEMINI_API_KEY dans .env.local

# 4. Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## 🧮 Logique de calcul

Le calcul suit le barème officiel basse tension de la SBEE :

### BT 1 — Domestique

| Condition | Tarif | TVA |
|-----------|-------|-----|
| ≤ 20 kWh **et** durée ≥ 30 jours | **86 FCFA/kWh** (tranche sociale) | Exonéré |
| ≤ 20 kWh **et** durée < 30 jours | **125 FCFA/kWh** | 18% |
| 20 < consommation ≤ 250 kWh | **125 FCFA/kWh** | 18% |
| > 250 kWh | 250 × 125 + reste × **148 FCFA/kWh** | 18% |

### BT 2 — Professionnel

- Tarif unique : **125 FCFA/kWh** + TVA 18%

### BT 3 — Éclairage public

- Tarif unique : **133 FCFA/kWh** + TVA 18%

### Composantes communes

| Composante | Montant par défaut | TVA |
|------------|--------------------|-----|
| Prime fixe (D) | 500 FCFA/période | Oui (18%) |
| Taxe électricité (E) | 2 FCFA/kWh | Non |
| Fonds électrification rurale (F) | 3 FCFA/kWh | Non |

> **Devise :** Franc CFA (XOF)

---

## 📁 Structure du projet

```
src/
├── App.tsx                  # Composant racine, état global et layout
├── types.ts                 # Types TypeScript (TariffType, CalculationResult…)
├── utils.ts                 # Logique de calcul (calculateBill) et formatage
└── components/
    ├── TariffSelector.tsx   # Sélection du type de tarif (BT1 / BT2 / BT3)
    ├── ConsumptionInput.tsx # Saisie de la consommation et de la durée
    ├── ParameterEditor.tsx  # Éditeur des paramètres tarifaires
    ├── ReceiptBreakdown.tsx # Affichage du décompte de facture
    └── SimulationCharts.tsx # Graphiques de simulation par tranches
```

---

## ⚠️ Avertissement

Ce simulateur est un outil de modélisation mathématique indépendant, réalisé à titre informatif. Les montants calculés sont des estimations basées sur le barème publié. Pour toute contestation ou vérification officielle, référez-vous directement à la **SBEE** ou aux relevés de compteur officiels.

---

## 📄 Licence

Ce projet est distribué sous licence [MIT](./LICENSE).
