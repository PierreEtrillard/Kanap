let cart = localStorage.cart
  ? JSON.parse(localStorage.cart)
  : alert("le pannier est vide");

const itemsAnchor = document.getElementById("cart__items");
const totalPriceAnchor = document.getElementById("totalPrice");
const totalQuantityAnchor = document.getElementById("totalQuantity");

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

        console.log("avant ?");
        //mise à jour du total produit
        totalPrice();
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
  //NodeList() des balises input.itemQuantity et p.deleteItem
  const quantitySelectors = document.querySelectorAll("input.itemQuantity");
  const productSuppressors = document.querySelectorAll("p.deleteItem");

  /*ciblage des produits concernés par la modification de quantité 
    grâce aux dataset.color & dataset.id de la balise 'article' la
    plus proches de chaques input.itemQuantity*/
  for (let selector of quantitySelectors) {
    const productFixer = selector.closest("article");
    const similarProductStored = cart.find(
      (produit) =>
        produit.color === productFixer.dataset.color &&
        produit.id === productFixer.dataset.id
    );
    selector.addEventListener("change", () => {
      //vérifier si la saisie est conforme (quantité entre 1 et 100 articles)
      if (selector.value < 1 || selector.value > 100) {
        alert(
          `Désolé, la quantité de canapé de gamme ${similarProductStored.name} colori ${similarProductStored.color} doit être comprise entre 1 et 100 articles. `
        );
        // restauration de la saisie precedente
        selector.value = similarProductStored.amount;
      } else {
        // saisie conforme = ajustement de la quantité au pannier (cart['produit ciblé'.amount])
        similarProductStored.amount = selector.value;
      }
      //mise à jour du total produit
      totalPrice();
      // mise à jour du stockage Local
      localStorage.cart = JSON.stringify(cart);
    });
  }

  for (let suppressor of productSuppressors) {
    //Ciblage des produits concernés par la suppression
    let productFixer = suppressor.closest("article");
    suppressor.addEventListener("click", () => {
      /* boucle sur cart pour pour trouver la correspondance entre le produit
      ciblé et le produit du pannier à supprimer*/
      cart = cart.filter(
        //puis met à jour cart[] sans le produit supprimé
        (prod) =>
          prod.color !== productFixer.dataset.color ||
          prod.id !== productFixer.dataset.id
      );
      alert("produit supprimer");
      //suppression du noeud dans le Dom
      productFixer.remove();
      //mise à jour du total produit
      totalPrice();
      // mise à jour du stockage Local
      localStorage.cart = JSON.stringify(cart);
    });
  }
}

// SOMME DES PRODUIT ET PRIX TOTAL
function totalPrice() {
  let totalQuantity = 0;
  let totalOrder = 0;
  for (let product of cart) {
    totalQuantity += +product.amount;
    totalQuantityAnchor.innerText = totalQuantity;
    totalOrder += +(product.amount * product.price);
    totalPriceAnchor.innerText = totalOrder;
  }
}

// CONSTANTES FORMULAIRE
const firstName = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastName = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const address = document.getElementById("address");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const city = document.getElementById("city");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const email = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");

const submitBtn = document.getElementById("order");
//    REGEX
const regexName =
  /^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/;
const regexAddress = /^[A-Za-z0-9éïäëèà \-\.']+/;
const regexMail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// ECOUTEUR D'ÉVÈNEMENTS SUR LE FORMULAIRE
let errTarget = "Coordonnées incomplètes";

firstName.addEventListener("change", () => {
  if (regexName.test(firstName.value)) {
    firstNameErrorMsg.innerText = "ok";
    firstName.style.border = "0";
  } else {
    firstNameErrorMsg.innerText = `"${firstName.value}" n'est pas un prénom valide, verifiez qu'aucun chiffres ou caractères spéciaux ne soit inséré"`;
    errTarget = `"${firstName.value}" n'est pas un prénom valide`;
  }
});

lastName.addEventListener("change", () => {
  if (regexName.test(lastName.value)) {
    lastNameErrorMsg.innerText = "ok";
    lastName.style.border = "0";
  } else {
    lastNameErrorMsg.innerText = `"${lastName.value}" n'est pas un Nom valide, merci de verifiez qu'aucun chiffres ou caractères spéciaux ne soit inséré"`;
    errTarget = `"${lastName.value}" n'est pas un Nom valide`;
  }
});

address.addEventListener("change", () => {
  if (regexAddress.test(address.value)) {
    addressErrorMsg.innerText = "ok";
    address.style.border = "0";
  } else {
    addressErrorMsg.innerText = `"${address.value}" n'est pas une adresse valide, verifiez qu'aucun caractères spéciaux (ex: &!+) ne soit inséré"`;
    errTarget = `"${address.value}" n'est pas une addresse valide`;
  }
});
city.addEventListener("change", () => {
  if (regexAddress.test(city.value)) {
    cityErrorMsg.innerText = "ok";
    city.style.border = "0";
  } else {
    cityErrorMsg.innerText = `"${city.value}" n'est pas un nom de ville valide`;
    errTarget = `"${city.value}" n'est pas un nom de ville valide`;
  }
});

email.addEventListener("change", () => {
  if (regexMail.test(email.value)) {
    emailErrorMsg.innerText = "ok";
    email.style.border = "0";
  } else {
    emailErrorMsg.innerText = `"${email.value}" n'est pas un Email valide`;
    errTarget = `"${email.value}" n'est pas un Email valide`;
  }
});

//  EVENEMENT AU CLIC SUR BOUTON COMMANDE :
let contactData = {};
const formFields = document.querySelectorAll(
  ".cart__order__form__question>input"
);
submitBtn.addEventListener("click", () => {
  //Test si champ du formulaire vide
  let formFilled = false;
  for (let fields of formFields) {
    let fieldsNames = fields.previousElementSibling;
    if (fields.value === "") {
      alert(`Le champs "${fieldsNames.textContent}" du formulaire est vide`);
      fields.style.border = "solid 2px red";
    } else {
      (contactData[`${fields.id}`] = `${fields.value}`), (formFilled = true);
    }
  }
  if (formFilled) {
    let productsIds = [];
    cart.forEach((prod) => productsIds.push(prod.id));
    let order = {};
    order.products = productsIds;
    order.contact = contactData;
    orderSender(order);
  }
});
// POST les données à l'API
function orderSender(data) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((value) => 
      window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?order=${value.orderId}`
    )
    .catch((err) => console.log(err));
}

// APPEL DE LA FONCTION GLOBAL
datacollector();
