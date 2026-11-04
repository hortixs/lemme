# Ressources de maths

Site de ressources de mathématiques pour la licence : cours complet, exercices avec indications et vidéos.

## Lancer le site

```bash
npm install
npm run dev
```

## Ajouter un chapitre

Créer un dossier `contenu/<niveau>/<matiere>/<NN-nom-du-chapitre>/` contenant, selon ce qui est prêt :

| Fichier | Rôle |
| --- | --- |
| `essentiel.mdx` | les définitions et résultats à retenir, affichés sur la page |
| `fondamentaux.mdx` | les exercices fondamentaux, affichés sur la page |
| `cours.tex` et `cours.pdf` | le cours complet |
| `exercices.tex` et `exercices.pdf` | les exercices et leurs indications |
| `videos.json` | la liste des vidéos |

Un fichier absent s'affiche « – » dans le tableau. Une nouvelle matière a aussi besoin d'un fichier `contenu/<niveau>/<matiere>/matiere.json` avec son titre.

Pour `videos.json` :

```json
[
  { "titre": "Notion de tribu", "url": "https://www.youtube.com/watch?v=...", "duree": "12:30", "auteur": "Nom de la chaîne" }
]
```

Dans `essentiel.mdx`, on écrit en Markdown et en LaTeX (`$...$` et `$$...$$`), avec les blocs `<Definition>`, `<Theoreme>`, `<Proposition>`, `<Lemme>`, `<Exemple>`, `<Remarque>` et `<IdeePreuve>`. Dans `fondamentaux.mdx`, on utilise `<Exercice numero="5" titre="...">` et `<Indication>`. Il faut laisser une ligne vide après la balise ouvrante et avant la balise fermante.

Pour recompiler les PDF (LaTeX et `latexmk` requis) : `npm run pdf`. Les PDF compilés sont versionnés avec le reste du contenu.

## Publication

Chaque push sur `main` publie le site sur GitHub Pages (Settings > Pages > Source : GitHub Actions).
