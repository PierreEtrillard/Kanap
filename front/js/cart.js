let cart = localStorage.cart
  ? JSON.parse(localStorage.cart)
  : alert("le pannier est vide");

const itemsAnchor = document.getElementById("cart__items");
const totalPriceAnchor = document.getElementById("totalPrice");
const totalQuantityAnchor = document.getElementById("totalQuantity");
let promisesFromApi = [];
let quantitySelectors = [];
let totalQuantity = 0;
let totalOrder = 0;

function datacollector() {
  // POUR CHAQUES OBJETS DE 'cart', RECUPÈRE LES DONNÉES AUPRÈS DE L'API LE CONCERNANT
  for (let elements of cart) {
    fetch(`http://localhost:3000/api/products/${elements.id}`)
      .then((res) => {
        return res.ok
          ? res.json()
          : alert("Produit indisponible pour le moment.");
      })
      .then((value) => {
        elements["imgSrc"] = value.imageUrl;
        elements["altTxt"] = value.altTxt;
        elements["name"] = value.name;
        elements["price"] = value.price;

        let currentPromise = new Promise((resolve) => {
          resolve(elements);
        });
        promisesFromApi.push(currentPromise);
        console.log(promisesFromApi);
        
itemFiller()
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
const promiseAll = Promise.all(promisesFromApi).then((value)=>{value})
console.log(promiseAll);
datacollector();
async function itemFiller(){
await Promise.all(promisesFromApi).then(() => {
  for (let elements of promisesFromApi) {
    console.log(elements);
    itemsAnchor.innerHTML += `
          <article class="cart__item" data-id="${elements.id}" data-color="${elements.color}">
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
            </article>
          `;
    // SOMME DES PRODUIT ET PRIX TOTAL
    totalQuantity += +elements.amount;
    totalQuantityAnchor.innerText = totalQuantity;
    totalOrder += +(elements.amount * elements.price);
    totalPriceAnchor.innerText = totalOrder;
  }
});
// RECENSE TOUTES LES BALISES DE CONTRÔLE DE QUANTITÉ
quantitySelectors = document.querySelectorAll("input.itemQuantity");
for (let selector in quantitySelectors) {
  console.log(selector);
  selector.addEventListener('change',()=>{console.log('créer une fonction ciblant le .amount du bon produit au sein de "cart"')})
}
}
// document.addEventListener('change',alert('quelque chose à changé'))

// function quantityAjustor() {

//     // quantitySelectors.forEach(selectors => selectors.addEventListener('change',alert('valeur modifiée'))

// }
// EVENEMENT A LA SUPPRESSION OU CORRECTION DE QUANTITÉE DU PRODUIT

//  for (let i in itemSelectorList){}
//     console.log(i.target.dataset.id
// );
// }
// quantityAjustor()

// for( let i = 0; i < localStorage.length; i++){
//     console.log(localStorage.key(i));
// // }
// EXO PROMISES
// const promisecollector = [];
// let promiseTest = new Promise((resolve, reject) => {
//   for (let e = 0; e < 10; ++e) {
//     promisecollector.push(
//       new Promise((res, err) => {
//         setTimeout(() => {
//           res("réponse de l'indice " + e + " :" + e);
//         }, e * 1000);
//       })
//     );
//   }
// });
// promisecollector[5]
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((rej) => {
//     console.log(rej);
//   });
// Promise.all(promisecollector).then(() => {
//   console.log("promise collector contient : " + promisecollector);
// });
