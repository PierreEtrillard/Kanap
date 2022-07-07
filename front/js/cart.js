//  VARIABLES GLOBALES
const itemsAnchor = document.getElementById("cart__items");
const totalPriceAnchor = document.getElementById("totalPrice");
const totalQuantityAnchor = document.getElementById("totalQuantity");
let quantitySelectors = [];
let totalQuantity = 0;
let totalOrder = 0;

// RÉCUPÉRATION DU PANNIER CONTENU DANS LOCALSTORAGE
let cart = localStorage.cart
  ? JSON.parse(localStorage.cart)
  : alert("le pannier est vide");

// RÉCUPÉRATION DES DONNÉES AUPRÈS DE L'API POUR CHAQUES PRODUITS DU PANNIER
const promisesFromApi = []

 for (let elements of cart) {
    fetch(`http://localhost:3000/api/products/${elements.id}`)
      .then((res) => {
        return res.ok
          ? res.json()
          : alert("Produit indisponible pour le moment.");
      })
      .then((value) => {
        // Ajout des propriétés image, text d'image, nom et prix pour chaques éléments du pannier
        elements["imgSrc"] = value.imageUrl;
        elements["altTxt"] = value.altTxt;
        elements["name"] = value.name;
        elements["price"] = value.price;
        let currentPromise = new Promise(()=>{elements}) 
        promisesFromApi.push(currentPromise);
        console.log(currentPromise);
      })
      .catch((err) => {
        console.log(err);
      });
  
};
Promise.all(promisesFromApi).then(()=>{
  for (let elements in promisesFromApi){  
    //  Implementation des elements de chaque produits dans le DOM
    itemsAnchor.innerHTML += `<article class="cart__item" data-id="${cart.id}" data-color="${elements.color}">
            <div class="cart__item__img">
              <img src="${elements.imgSrc}" alt="${elements.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${elements.name}</h2>
                <p>${elements.color}</p>
                <p>${elements.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${elements.amount}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
// SOMME DES PRODUITS ET PRIX TOTAL
        totalQuantity += +elements.amount;
        totalQuantityAnchor.innerText = totalQuantity;
        totalOrder += +(elements.amount * elements.price);
        totalPriceAnchor.innerText = totalOrder;
      };

    // ECOUTEUR POUR LES MODIFICATIONS DES QUANTITÉ
    quantitySelectors = document.getElementsByClassName("itemQuantity");
    })
// async function quantityAjustor(){
// //promise.all().then() quantityAjustor (){
// await quantitySelectors
// for (let e in quantitySelectors){
//   e.addEventlistener('change',alert("changement de valeur détecté"))
//     // quantitySelectors.addEventListener('change',alert("valeur changée"+ quantitySelectors.value));
//       console.group();
//       //  console.log(quantityAjustor.value);
//       console.log(e);
//       console.log(quantitySelectors);
//       console.groupEnd();
//     }
//   };

//     // POUR CHAQUES OBJET DE 'cart' RECUPÈRE LES DONNÉES AUPRÈS DE L'API LE CONCERNANT

//         // .then((value)=>{
//         //
//         //     `;
//         // RECENSE TOUTES LES BALISES DE CONTRÔLE DE QUANTITÉ
// //

// //             // SOMME DES PRODUIT ET PRIX TOTAL
// //             totalQuantity += +elements.amount;
// //             totalQuantityAnchor.innerText = totalQuantity;
// //             totalOrder += +(elements.amount * elements.price);
// //             totalPriceAnchor.innerText = totalOrder;
// //         })

// // }
// itemFiller();

// // document.addEventListener('change',alert('quelque chose à changé'))

// // function quantityAjustor() {

// //     // quantitySelectors.forEach(selectors => selectors.addEventListener('change',alert('valeur modifiée'))

// // }
//  // EVENEMENT A LA SUPPRESSION OU CORRECTION DE QUANTITÉE DU PRODUIT

// //  for (let i in itemSelectorList){}
// //     console.log(i.target.dataset.id
// // );
// // }
// // quantityAjustor()

// // for( let i = 0; i < localStorage.length; i++){
// //     console.log(localStorage.key(i));
// // // // }
// // new Promise((resolve, reject) {
// // fetch(url).then(() => { resolve(); }.catch((e) => { reject(e); });
// Faire une boucle for de i = 1 à i = 10 qui pour chaque itération fera un appel de setTimeout(), celui-ci devra attendre i secondes avant d’appeler sa fonction callback.
// Il faut utiliser des Promise et à l’aide de Promise.all après la boucle, afficher un console.log lorsque l’ensemble des setTimeout() se sont terminés.

// new Promise((resolve, reject) {
// fetch(url).then(() => { resolve(); }.catch((e) => { reject(e); });
const arr = [
  "valeur à indice 0",
  "valeur à indice 1",
  "valeur à indice 2",
  "valeur à indice 3",
  "valeur à indice 4",
];
const promiseTest = [];
for (let e in arr) {
  promiseTest.push(
    new Promise((res, err) => {
      setTimeout(() => {
        console.log(res("réponse de l'indice " + e + " :" + e));
      }, e * 1000);
    })
  );
}
console.log(Promise.all(promiseTest));

