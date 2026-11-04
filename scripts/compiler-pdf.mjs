// Compile tous les cours.tex et exercices.tex de contenu/ (nécessite LaTeX et latexmk).
import { execFileSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

async function* parcourir(dossier) {
  for (const entree of await readdir(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) yield* parcourir(chemin);
    else yield chemin;
  }
}

for await (const fichier of parcourir('contenu')) {
  if (!['cours.tex', 'exercices.tex'].includes(basename(fichier))) continue;
  const options = { cwd: dirname(fichier), stdio: 'inherit' };
  execFileSync('latexmk', ['-pdf', '-interaction=nonstopmode', '-halt-on-error', basename(fichier)], options);
  execFileSync('latexmk', ['-c', basename(fichier)], options);
}
