let cart = localStorage.cart
  ? JSON.parse(localStorage.cart)
  : alert("le pannier est vide");

const itemsAnchor = document.getElementById("cart__items");
const totalPriceAnchor = document.getElementById("totalPrice");
const totalQuantityAnchor = document.getElementById("totalQuantity");
let totalQuantity = 0;
let totalOrder = 0;
const submitBtn = document.getElementById("order");

async function datacollector() {
  // POUR CHAQUES OBJETS DE 'cart', RECUPÈRE LES DONNÉES AUPRÈS DE L'API LE CONCERNANT
  for (let elements of cart) {
    await fetch(`http://localhost:3000/api/products/${elements.id}`)
      .then((res) => {
        return res.ok
          ? res.json()
          : alert("Produit indisponible pour le moment.");
      })
      .then((value) => {
        // creation des argument imgSrc,altTxt, name, price pour chaques produits de cart[]
        elements["imgSrc"] = value.imageUrl;
        elements["altTxt"] = value.altTxt;
        elements["name"] = value.name;
        elements["price"] = value.price;

        // implémentation des elements dans le DOM pour chaques produits
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
        console.log("avant ?");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  quantityAjustor();
}
// RECENSE TOUTES LES BALISES DE CONTRÔLE DE QUANTITÉ
async function quantityAjustor() {
  console.log("après ?");
  const quantitySelectors = document.querySelectorAll("input.itemQuantity");//retourne une NodeList()
  // Creation d'une boucle ajoutant un ecouteur d'évènement 'change' sur chaques input.itemQuantity
  for (let selector of quantitySelectors) {
    // ciblage des produits concernés par la modification de quantité
    let productFixer = selector.closest('article');
    let similarIdStored = cart.find((prod) => prod.id);
    let similarColorStored = cart.find((prod) => prod.color);
    if (
      (similarColorStored.color===productFixer.dataset.color)
      &&
      (similarIdStored.id===productFixer.dataset.id)){
        selector.value = similarIdStored.amount;
     }
    else {console.log ("Valeur differente")}
    selector.addEventListener('change',()=>{console.log(selector.value);}); 
  }
}

submitBtn.addEventListener("click", () => {
  alert("commande envoyée");
});

datacollector();

// document.addEventListener('change',alert('quelque chose à changé'))
