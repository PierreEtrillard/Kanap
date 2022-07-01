// Récupération de l'ID de produits dans l'URL
const actualUrl = new URL(document.location.href);
const productId = actualUrl.searchParams.get("id");

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
    // console.log(value);
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
      // console.log(value.colors.length)
    }
  })

  .catch((err) => {
    console.log(
      "une erreur s'est produite lors du traitement de la fiche produit",
      +err
    );
  });

const colorChoice = document.getElementById("colors");
console.log("input:colors", colorChoice, colorChoice.value);
const quantity = document.getElementById("quantity");
console.log("input:quantity", quantity, quantity.value);

let cart = localStorage.cart ? JSON.parse(localStorage.cart) : [];
console.log("cart", cart);

document.getElementById("addToCart").addEventListener("click", () => {
  /*  REMPLISSAGE DU PANNIER AVEC L'ID, LA COULEUR ET LA QUANTITÉ DU PRODUIT À COMMANDE 
  OU AVEC LES DONNÉES PRÉCEDEMMENT SAISIE (contenu dans le localstorage)*/
  const chosenColor = colorChoice.value;
  const chosenQuantity = quantity.value;
  console.log(`onClick - color: ${chosenColor}`);
  console.log(`onClick - quantity: ${chosenQuantity}`);
  console.log(`onClick - card: ${cart}`);

  if (colorChoice.value == "") {
    alert("veuillez séléctionner la couleur de votre canapé.");
  } else if (Number(quantity.value) < 1 || Number(quantity.value) > 100) {
    alert("veuillez saisir un nombre d'article entre 1 et 100.");
  } else {
    const similarIdStored = cart.find((elt) => elt.id === `${productId}`);
    console.log("similarId", productId, similarIdStored);
    const similarColorStored = cart.find(
      (elt) => elt.color === `${colorChoice.value}`
    );
    console.log("similarColor", colorChoice.value, similarColorStored);
    const similarProductStored = similarColorStored && similarIdStored;

    console.log(`onClick - similarIdStored: ${similarIdStored}`);
    console.log(`onClick - similarColorStored: ${similarColorStored}`);

    if (cart.length < 1 || typeof similarIdStored === `undefined`) {
      cart.push({
        id: `${productId}`,
        color: `${colorChoice.value}`,
        amount: `${Number(quantity.value)}`,
      });
      console.log(
        `Création d'un nouvel objet au tableau cart contenant ceci: ${cart}`
      );
    } else if (
      similarIdStored.id == `${productId}` &&
      typeof similarColorStored === `undefined`
    ) {
      {
        cart.push({
          id: `${productId}`,
          color: `${colorChoice.value}`,
          amount: `${Number(quantity.value)}`,
        });
        console.log(`ajout le l'objet au tableau cart contenant ceci: ${cart}`);
      }
    } else if (
      similarIdStored.id == `${productId}` &&
      similarColorStored.color == `${colorChoice.value}`
    ) {
      similarColorStored.amount =
        Number(similarColorStored.amount) + Number(quantity.value);

      console.log(`Mise à jour du tableau cart contenant ceci: ${cart}`);
    }
  }
//    Verifier si la commande ne dépasse pas les 100 article avant l'envoi au localstorage
  console.log(`après le click, cart contient: ${cart}`);

  cartStringed = JSON.stringify(cart);
  console.log("après le clique, cartStringed = " + cartStringed);

  localStorage.cart = cartStringed;
  console.log("après le clique, localStorage.cart  = " + localStorage.cart);
});
