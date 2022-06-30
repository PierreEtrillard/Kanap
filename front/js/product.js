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
      + err
    );
  });

/*  REMPLISSAGE DU PANNIER AVEC L'ID, LA COULEUR ET LA QUANTITÉ DU PRODUIT À COMMANDE 
OU AVEC LES DONNÉES PRÉCEDEMMENT SAISIE (contenu dans le localstorage)*/
const colorChoice = document.getElementById("colors");
const quantity = document.getElementById("quantity");
let cart = localStorage.cart ?  JSON.parse(localStorage.cart):[]
const similarIdStored = cart.find(elt=>elt.id === `${productId}`)
const similarColorStored = cart.find(elt=>elt.color === `${colorChoice.value}`)
// const cartElements = cart.find( elmt => elmt.color === `${colorChoice.value}`)


console.log(
  `avant le click localStorage contient: ${localStorage} & cart: ${cart}, de plus ${quantity.value} produits ${colorChoice.value} ont été sélectionné`
);

document.getElementById("addToCart").addEventListener("click", () => {
    if (colorChoice.value == "") {
    alert("veuillez séléctionner la couleur de votre canapé.");
  } else if (Number(quantity.value) < 1 || Number(quantity.value) > 100) {
    alert("veuillez saisir un nombre d'article entre 1 et 100.");
  }  
    else if (similarIdStored && similarColorStored ){
      elt.amount = elt.amount + `${Number(quantity.value)}`
    }
  else {cart.push({
    id: `${productId}`,
    color: `${colorChoice.value}`,
    amount: `${Number(quantity.value)}`,
   });
   console.log(`Mise à jour du tableau cart contenant ceci: ${cart}`);
  }
//  VERIFIE LA SELECTION DES VALEURS ET COULEURS

//  VERIFIE SI LE PANIER EST VIDE SINON CRÉATION DE CELUI-CI
//   else if (cart == undefined) {
//     cart = [{
//      id: `${productId}`,
//      color: `${colorChoice.value}`,
//      amount: `${Number(quantity.value)}`,
//     }];
//     
//   } 
// // VERIFIE SI OBJET DE MÊME COULEUR EST PRESENT DANS LA VARIABLE
//   else if (cart.find( clr => clr.color === `${colorChoice.value}`)){
//     cart[0].amount = Number(cart.amount) + Number(quantity.value);
//     cart.forEach(element => {
//       console.log("éléments présents dans cart"+ element)
//     });
//   }
//   else if (cart.find( clr => clr.color != `${colorChoice.value}`)){
//     cart.forEach(element => {
//       console.log("éléments présents dans cart"+ element)
//     });
//   }
// 
console.log(
  `avant le click cart contient: ${cart}`); 

 cartStringed = JSON.stringify(cart);
  console.log(
    "après le clique, cartStringed = " + cartStringed
  );
  
  localStorage.cart = cartStringed
  console.log(
    "après le clique, localStorage.cart  = " + localStorage.cart
  );
});