//  VARIABLES GLOBALS
let cart = localStorage.cart ? JSON.parse(localStorage.cart) : [];
// Récupération de l'ID de produits dans l'URL
const actualUrl = new URL(document.location.href);
const productId = actualUrl.searchParams.get("id");
let productName;
//  Selecteurs (couleurs & quantité)
const colorChoice = document.getElementById("colors");
const quantity = document.getElementById("quantity");
// Bouton d'envoi
const addToCart = document.getElementById("addToCart");
//  Toast pour avertissement aux utilisateur
let toastWeapper = document.createElement("div.toast");
function toastAlert(message, color) {
  // let toast = document.createElement('div');
  document.body.innerHTML +=
   `<div id = "popup"style="
      position: fixed;
      max-width: 80%;
      height: fit-content;
      top: 10px;
      left: 5%;
      right: 5%;
      margin:20px;
      font-size: 22px;
      background-color:  var(--secondary-color);
      color: ${color};
      box-shadow: rgba(42, 18, 206, 0.9) 0 0 22px 6px;
      border-radius: 40px;
      text-align: center;
      padding: 30px;
      ">
      ${message}
    </div>
`;
setTimeout(()=>document.getElementById('popup').remove(),2500)
}
//----------------------------------------------------------------------------

//       RECUPÉRATION DES DETAILS DU PRODUIT AUPRÈS DE L'API
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((res) => {
    //traitement de la réponse si ok = capte la réponse sous forme d'un objet .json
    return res.ok
      ? res.json()
      : alert(
          "Fiche produit indisponible, merci de nous contacter pour plus de détails."
        );
  })
  //      EXTRACTION DES DONNÉES & IMPLÉMENTATION DE CELLES-CI DANS LE DOM
  .then((value) => {
    productName = value.name; // <- variable utilisé pour les interactions utilisateur lors des saisies du panier
    document.querySelector(
      "div.item__img"
    ).innerHTML = `<img src="${value.imageUrl}" alt="photographie du modéle ${value.name}">`;
    document.getElementById("title").innerText = value.name;
    document.getElementById("price").innerText = value.price;
    document.getElementById("description").innerText = value.description;
    /*  SELECTEUR DE COULEURS: extraction de la liste des couleurs du produit et ajout 
    des balises <option value="couleur(variable 'c')"> */
    for (let c in value.colors) {
      const colorOption = document.createElement("option");
      colorOption.setAttribute("value", value.colors[c]);
      colorChoice.appendChild(colorOption).innerText = value.colors[c];
    }
  })
  .catch((err) => {
    console.log(
      "une erreur s'est produite lors du traitement de la fiche produit",
      +err
    );
  });
// INTERACTION AVEC L'UTILISATEUR
function alertValue(selector) {
  selector.previousElementSibling.setAttribute("style", "color:red");
  selector.setAttribute("style", "border:2px solid red");
  addToCart.setAttribute("style", "cursor: not-allowed;");
}
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
/*  REMPLISSAGE DU panier AU CLIC AVEC L'ID, LA COULEUR ET LA QUANTITÉ DU PRODUIT À COMMANDE 
  OU AVEC LES DONNÉES PRÉCEDEMMENT SAISIE (contenu dans le localstorage)*/

addToCart.addEventListener("click", () => {
  //  Vérifie la saisies de quantité et de couleurs
  if (colorChoice.value == "") {
    //  alert("veuillez séléctionner la couleur de votre canapé.");
    return alertValue(colorChoice);
  }
  if (Number(quantity.value) < 1 || Number(quantity.value) > 100) {
    // return alert("veuillez saisir un nombre d'article entre 1 et 100.");
    return alertValue(quantity);
  }

  //  SAISIE CONFORME = CONSTANTE POUR CIBLAGE DES PRODUITS DÉJA PRÉSENTS
  const similarProductStored = cart.find(
    (produit) => produit.color === colorChoice.value && produit.id === productId
  );
  if (
    //Si cart[] contient un produit similaire (même ID même couleur)
    similarProductStored
  ) {
    //ajout de la quantité saisie sur la page au total déja présent au panier
    similarProductStored.amount =
      Number(similarProductStored.amount) + Number(quantity.value);

    // limitateur de quantité (si dépassement ou seuil atteint, réglage de la quantité à 100 et alerte l'utilisateur)
    if (similarProductStored.amount >= 100) {
      similarProductStored.amount = 100;
      toastAlert(
        `Vous avez atteint la limite des 100 articles maximum pour la gamme ${productName} colori ${colorChoice.value}`,"red")
      quantity.value = 100;
    } else {
      toastAlert(`Vous venez d'ajouter ${quantity.value} ${productName} colori ${colorChoice.value} supplémentaires au panier`, "white")
      ;
    }
  } else {
    //création d'un nouvel objet dans cart[]
    cart.push({
      id: `${productId}`,
      color: `${colorChoice.value}`,
      amount: `${Number(quantity.value)}`,
    });
    toastAlert(
      `Ajout de ${quantity.value} ${productName} colori ${colorChoice.value} au panier`,"white"
    );
  }
  /* OU   if (
    //Si cart[] ne contient pas de produit similaire (même ID même couleur)
    similarProductStored
  ) {
    //Sinon, ajout de la quantité saisie sur la page au total déja présent au panier
    similarProductStored.amount = Number(similarProductStored.amount) + Number(quantity.value);

      // limitateur de quantité (si dépassement ou seuil atteint, réglage de la quantité à 100 et alerte l'utilisateur)
      if (similarProductStored.amount >= 100) {
        similarProductStored.amount = 100;
        alert(
          `Vous avez atteint la limite des 100 articles maximum pour la gamme ${productName} colori ${colorChoice.value}`
        );
        quantity.value = 100;
      } else {
        alert(
          `Vous venez d'ajouter ${quantity.value} ${productName} colori ${colorChoice.value} supplémentaires au panier`
        );
      }

  } else {
    //création d'un nouvel objet dans cart[]
    cart.push({
      id: `${productId}`,
      color: `${colorChoice.value}`,
      amount: `${Number(quantity.value)}`,
    });
    alert(
      `Ajout de ${quantity.value} ${productName} colori ${colorChoice.value} au panier`
    );
  }*/
  //    ENVOI DES DONNÉES DU TABLEAU 'cart' SOUS FORME DE CHAINE DE CARACTÈRE AU STOCKAGE LOCAL
  localStorage.cart = JSON.stringify(cart);
});
