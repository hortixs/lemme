// Copie les PDF de contenu/ vers public/pdf/ pour qu'ils soient servis par le site.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

const racine = 'contenu';
const sortie = 'public/pdf';

async function* parcourir(dossier) {
  for (const entree of await readdir(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) yield* parcourir(chemin);
    else yield chemin;
  }
}

await rm(sortie, { recursive: true, force: true });
for await (const fichier of parcourir(racine)) {
  if (!fichier.endsWith('.pdf')) continue;
  const cible = join(sortie, relative(racine, fichier));
  await mkdir(dirname(cible), { recursive: true });
  await cp(fichier, cible);
}
