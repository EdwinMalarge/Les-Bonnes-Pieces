import {
  ajoutListenersAvis,
  ajoutListenerEnvoyerAvis,
  afficherAvis,
  afficherGraphiqueAvis,
} from "./avis.js";
// Récupération des pièces
let pieces = window.localStorage.getItem("pieces");

if (pieces === null) {
  const reponse = await fetch("http://localhost:8081/pieces/");
  pieces = await reponse.json();
  //save localstorage
  const valeurPieces = JSON.stringify(pieces);
  window.localStorage.setItem("pieces", valeurPieces);
} else {
  pieces = JSON.parse(pieces);
}

ajoutListenerEnvoyerAvis();

function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i];
    const sectionFiches = document.querySelector(".fiches");
    const pieceElement = document.createElement("article");
    pieceElement.dataset.id = pieces[i].id;
    const imageElement = document.createElement("img");
    imageElement.src = article.image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;
    const prixElement = document.createElement("p");
    prixElement.innerText = `Prix: ${article.prix} €(${
      article.prix < 35 ? "€" : "€€€"
    })`;
    const categorieElement = document.createElement("p");
    categorieElement.innerText = article.categorie ?? "(Aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      article.description ?? "Pas de description pour le moment";
    const disponibiliteElement = document.createElement("p");
    disponibiliteElement.innerText = article.disponibilite
      ? "En stock"
      : "Rupture de stock";
    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.textContent = "Afficher les avis";

    sectionFiches.appendChild(pieceElement);

    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(disponibiliteElement);
    pieceElement.appendChild(avisBouton);
  }
  ajoutListenersAvis();
}

genererPieces(pieces);

for (let i = 0; i < pieces.length; i++) {
  const id = pieces[i].id;
  const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
  const avis = JSON.parse(avisJSON);

  if (avis !== null) {
    const pieceElement = document.querySelector(`article[data-id="${id}"]`);
    afficherAvis(pieceElement, avis);
  }
}

// liste des boutons
const boutonTrierCr = document.querySelector(".btn-trierCr");
boutonTrierCr.addEventListener("click", function () {
  const piecesOrdonneesCr = Array.from(pieces);
  piecesOrdonneesCr.sort(function (a, b) {
    return a.prix - b.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonneesCr);
});

const boutonTrierDcr = document.querySelector(".btn-trierDcr");
boutonTrierDcr.addEventListener("click", function () {
  const piecesOrdonneesDcr = Array.from(pieces);
  piecesOrdonneesDcr.sort(function (a, b) {
    return b.prix - a.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonneesDcr);
});

const boutonFiltrer = document.querySelector(".btn-filter");
boutonFiltrer.addEventListener("click", function () {
  const piecesPrixBas = pieces.filter(function (piece) {
    return piece.prix <= 35;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesPrixBas);
});

const boutonDescription = document.querySelector(".btn-description");
boutonDescription.addEventListener("click", function () {
  const articleDecrit = pieces.filter(function (piece) {
    return piece.description;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(articleDecrit);
});

const inputPrix = document.querySelector("#prix");
inputPrix.addEventListener("input", function () {
  const piecesPrixInput = pieces.filter(function (piece) {
    return piece.prix <= inputPrix.value;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesPrixInput);
});

const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces");
});

// Liste de tri abordables
const noms = pieces.map((piece) => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].prix > 35) {
    noms.splice(i, 1);
  }
}
const pElement = document.createElement("p");
pElement.innerText = "Pièces abordables";
const abordablesElements = document.createElement("ul");

for (let i = 0; i < noms.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = noms[i];
  abordablesElements.appendChild(nomElement);
}

document
  .querySelector(".abordables")
  .appendChild(pElement)
  .appendChild(abordablesElements);

// Liste disponible
const nomsDisponible = pieces.map((piece) => piece.nom);
const prix = pieces.map((piece) => piece.prix);

for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].disponibilite === false) {
    nomsDisponible.splice(i, 1);
    prix.splice(i, 1);
  }
}
const pElementDisponible = document.createElement("p");
pElementDisponible.innerText = "Pièces disponibles:";
const nomsPrixElements = document.createElement("ul");

for (let i = 0; i < nomsDisponible.length && prix.length; i++) {
  const nomsPrix = document.createElement("li");
  nomsPrix.innerText = nomsDisponible[i] + " - " + prix[i] + "€";
  nomsPrixElements.appendChild(nomsPrix);
}

document
  .querySelector(".disponibles")
  .appendChild(pElementDisponible)
  .appendChild(nomsPrixElements);

await afficherGraphiqueAvis();
