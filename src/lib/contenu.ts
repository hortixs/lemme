// Construit l'arborescence du site à partir du dossier contenu/.
// contenu/<niveau>/<matiere>/<NN-chapitre>/ avec essentiel.mdx, cours.pdf, exercices.pdf, videos.json.
import { existsSync, readdirSync } from 'node:fs';

export type Video = { titre: string; url: string; duree?: string; auteur?: string };

export type Chapitre = {
  niveau: string;
  matiere: string;
  slug: string;
  numero: string;
  titre: string;
  url: string;
  cours?: string;
  exercices?: string;
  videos: Video[];
  Contenu?: any;
  Fondamentaux?: any;
};

export type Matiere = { slug: string; titre: string; niveau: string; chapitres: Chapitre[] };
export type Niveau = { slug: string; nom: string; annee: string; matieres: Matiere[] };

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const lien = (chemin: string) => `${base}${chemin}`;

const mdx = import.meta.glob<any>('/contenu/*/*/*/essentiel.mdx', { eager: true });
const fondamentaux = import.meta.glob<any>('/contenu/*/*/*/fondamentaux.mdx', { eager: true });
const videos = import.meta.glob<Video[]>('/contenu/*/*/*/videos.json', { eager: true, import: 'default' });
const infos = import.meta.glob<{ titre: string }>('/contenu/*/*/matiere.json', { eager: true, import: 'default' });

const decrire = [
  { slug: 'l1', nom: 'L1', annee: '1re année' },
  { slug: 'l2', nom: 'L2', annee: '2e année' },
  { slug: 'l3', nom: 'L3', annee: '3e année' },
];

function lireChapitres(niveau: string, matiere: string): Chapitre[] {
  const prefixe = `/contenu/${niveau}/${matiere}/`;
  const dossiers = readdirSync(`.${prefixe}`, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  return dossiers.sort().map((slug) => {
    const dossier = `${prefixe}${slug}`;
    const page = mdx[`${dossier}/essentiel.mdx`];
    const chemin = `/${niveau}/${matiere}/${slug}`;
    return {
      niveau,
      matiere,
      slug,
      numero: slug.split('-')[0],
      titre: page?.frontmatter?.titre ?? slug,
      url: lien(`${chemin}/`),
      cours: existsSync(`.${dossier}/cours.pdf`) ? lien(`/pdf${chemin}/cours.pdf`) : undefined,
      exercices: existsSync(`.${dossier}/exercices.pdf`) ? lien(`/pdf${chemin}/exercices.pdf`) : undefined,
      videos: videos[`${dossier}/videos.json`] ?? [],
      Contenu: page?.Content,
      Fondamentaux: fondamentaux[`${dossier}/fondamentaux.mdx`]?.Content,
    };
  });
}

export function lireNiveaux(): Niveau[] {
  return decrire.map((n) => {
    const slugs = Object.keys(infos)
      .filter((f) => f.startsWith(`/contenu/${n.slug}/`))
      .map((f) => f.split('/')[3])
      .sort();
    return {
      ...n,
      matieres: slugs.map((slug) => ({
        slug,
        niveau: n.slug,
        titre: infos[`/contenu/${n.slug}/${slug}/matiere.json`].titre,
        chapitres: lireChapitres(n.slug, slug),
      })),
    };
  });
}
