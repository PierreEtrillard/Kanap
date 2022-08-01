//  VARIABLES GLOBALS
let cart = localStorage.cart ? JSON.parse(localStorage.cart) : [];
// Récupération de l'ID de produits dans l'URL
const actualUrl = new URL(document.location.href);
const productId = actualUrl.searchParams.get("id");
let productName;

//-----------------------    INTERACTIONS AVEC L'UTILISATEUR    -------------------------

//******************************  Sélecteurs (couleur & quantité)   ****************************
const colorChoice = document.getElementById("colors");
const quantity = document.getElementById("quantity");
// Met les bordures du sélecteur et son label en rouge s'il est mal renseigné
function alertValue(selector, message) {
  selector.previousElementSibling.setAttribute("style", "color:red");
  selector.setAttribute("style", "border:2px solid red");
  addToCart.setAttribute("style", "cursor: not-allowed;");
  toastAlert(message, "red");
}
//  réinitialise les règles css d'origine à la correction
function stopAlert(selector) {
  selector.previousElementSibling.style.color = "";
  selector.style.border = "0";
  addToCart.style.cursor = "pointer";
}
colorChoice.addEventListener("change", () => {
  stopAlert(colorChoice);
});
quantity.addEventListener("change", () => {
  stopAlert(quantity);
});
//----------------------------------------------------------------------------
//       RECUPÉRATION DES DETAILS DU PRODUIT AUPRÈS DE L'API
const promiseFromApi = new Promise((resolve) => {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => {
      //traitement de la réponse : si ok = capte la réponse sous forme d'un objet .json
      return res.ok
        ? res.json()
        : alert(
            "Fiche produit indisponible, merci de nous contacter pour plus de détails."
          );
    })
    .then((value) => {
      resolve(value);
    })
    .catch((err) => {
      console.log(
        "l'erreur suivante s'est produite lors du traitement de la fiche produit : " +
          err
      );
      toastAlert("Serveur indisponible", "red");
    });
});

//      IMPLÉMENTATION DES DONNÉES RÉCUPÉRÉES DANS LE DOM
promiseFromApi.then((value) => {
  productName = value.name; // <- variable utilisée pour les interactions utilisateur lors des saisies du panier
  document.querySelector(
    "div.item__img"
  ).innerHTML = `<img src="${value.imageUrl}" alt="photographie du modéle ${value.name}">`;
  document.getElementById("title").innerText = value.name;
  document.getElementById("price").innerText = value.price;
  document.getElementById("description").innerText = value.description;
  /*  SÉLECTEUR DE COULEURS: extraction de la liste des couleurs du produit et ajout 
        des balises <option value="couleur(variable 'c')"> */
  for (let c in value.colors) {
    const colorOption = document.createElement("option");
    colorOption.setAttribute("value", value.colors[c]);
    colorChoice.appendChild(colorOption).innerText = value.colors[c];
  }
});

/*------------------------  REMPLISSAGE DU PANIER AU CLIC AVEC L'ID, LA COULEUR ET LA QUANTITÉ DU PRODUIT À COMMANDER   --------
                              OU AVEC LES DONNÉES PRÉCEDEMMENT SAISIES (contenu dans le localstorage)*/
// Bouton d'envoi
const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
  //  Vérifie la saisie de quantité et de couleur
  if (colorChoice.value == "") {
    // alerte si la couleur n'est pas saisie
    return alertValue(colorChoice, "Sélectionnez une couleur");
  }
  if (Number(quantity.value) < 1 || Number(quantity.value) > 100) {
    // alerte si le nombre d'article est vide ou n'est pas compris entre 1 et 100.");
    return alertValue(
      quantity,
      "Sélectionnez une quantité entre 1 et 100 articles"
    );
  }
  //  SAISIE CONFORME = CONSTANTE POUR CIBLAGE DES PRODUITS DÉJA PRÉSENTS
  const similarProductStored = cart.find(
    (produit) => produit.color === colorChoice.value && produit.id === productId
  );
  if (
    //Si : cart[] contient un produit similaire (même ID même couleur)
    similarProductStored
  ) {
    //ajout de la quantité saisie sur la page au total déja présent au panier
    similarProductStored.amount =
      Number(similarProductStored.amount) + Number(quantity.value);

    // limitateur de quantité (si dépassement ou seuil atteint, règle la quantité à 100 et alerte l'utilisateur)
    if (similarProductStored.amount >= 100) {
      similarProductStored.amount = 100;
      toastAlert(
        `Limite de 100 articles atteinte pour la gamme ${productName} colori ${colorChoice.value}`,
        "red"
      );
      quantity.value = 100;
    } else {
      toastAlert(
        `Vous avez actuellement ${similarProductStored.amount} ${productName} colori ${colorChoice.value} au panier`,
        "white"
      );
    }
  } else {
    //création d'un nouvel objet dans cart[]
    cart.push({
      id: `${productId}`,
      color: `${colorChoice.value}`,
      amount: `${Number(quantity.value)}`,
    });
    toastAlert(
      `Ajout de ${quantity.value} ${productName} colori ${colorChoice.value} au panier`,
      "white"
    );
  }
  //    ENVOI DES DONNÉES DU TABLEAU 'cart' SOUS FORME DE CHAINE DE CARACTÈRES AU STOCKAGE LOCAL
  localStorage.cart = JSON.stringify(cart);
});
