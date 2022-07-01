//  VARIABLES GLOBALS
const colorChoice = document.getElementById("colors");
const quantity = document.getElementById("quantity");
let productName;
let cart = localStorage.cart ? JSON.parse(localStorage.cart) : [];
// Récupération de l'ID de produits dans l'URL
const actualUrl = new URL(document.location.href);
const productId = actualUrl.searchParams.get("id");
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
    productName = value.name;// <- variable utilisé pour les interactions utilisateur lors des saisies du pannier
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
      const colorSelector = document.getElementById("colors");
      colorSelector.appendChild(colorOption).innerText = value.colors[c];
    }
  })
  .catch((err) => {
    console.log(
      "une erreur s'est produite lors du traitement de la fiche produit",
      +err
    );
  });

 /*  REMPLISSAGE DU PANNIER AU CLIC AVEC L'ID, LA COULEUR ET LA QUANTITÉ DU PRODUIT À COMMANDE 
  OU AVEC LES DONNÉES PRÉCEDEMMENT SAISIE (contenu dans le localstorage)*/

document.getElementById("addToCart").addEventListener("click", () => {
 //  Vérifie la conformitée des saisies de quantité et couleurs
  if (colorChoice.value == "") {
    alert("veuillez séléctionner la couleur de votre canapé.");
  }
  else if (Number(quantity.value) < 1 || Number(quantity.value) > 100) {
    alert("veuillez saisir un nombre d'article entre 1 et 100.");
  }
  
  else {//  SAISIE CONFORME = CONSTANTE POUR CIBLAGE DES PRODUITS DÉJA PRÉSENTS 
    const similarIdStored = cart.find((elt) => elt.id === `${productId}`);
    const similarColorStored = cart.find((elt) => elt.color === `${colorChoice.value}`);
    
    // Vérifier la présence d'un objet dans le tableau 'cart'
    if (cart.length < 1 || typeof similarIdStored === `undefined`) {
      cart.push({
        id: `${productId}`,
        color: `${colorChoice.value}`,
        amount: `${Number(quantity.value)}`,
      });

    // Vérifier si une commande du même article mais de couleur différente est présent
    } else if (
      similarIdStored.id === `${productId}` &&
      typeof similarColorStored === `undefined`) {
      {//création d'un nouvelle objet 
        cart.push({
          id: `${productId}`,
          color: `${colorChoice.value}`,
          amount: `${Number(quantity.value)}`,
        })
      };

    // Vérifier si une commande du même article et de la même couleur est présent
    } else if (similarIdStored.id == `${productId}` &&
              similarColorStored.color == `${colorChoice.value}`)
      // ajout de la quantité saisie sur la page au total présent déja présent au pannier
    { similarColorStored.amount = Number(similarColorStored.amount) + Number(quantity.value);
            // limitateur de quantité (si dépassement réglage de la quantité à 100 et alerte l'utilisateur)
            if (similarColorStored.amount >= 100) 
            similarColorStored.amount = 100;
            alert(`Vous avez atteint la limite des 100 articles maximum pour la gamme ${productName} colori ${colorChoice.value}`);
    }
  }
  //    ENVOI DES DONNÉES DU TABLEAU 'cart' SOUS FORME DE CHAINE DE CARACTÈRE AU STOCKAGE LOCAL
  cartStringed = JSON.stringify(cart);
  localStorage.cart = cartStringed;
});
