// récuppère le pannier dans le localStorage, alerte si celui-ci n'est pas présent
let cart = localStorage.cart
  ? JSON.parse(localStorage.cart)
  : alert("le pannier est vide");

//    INTERACTIONS AVEC L'UTILISATEUR
const itemsAnchor = document.getElementById("cart__items");
const totalPriceAnchor = document.getElementById("totalPrice");
const totalQuantityAnchor = document.getElementById("totalQuantity");
//  Toast pour avertissement des modifications du panier
function toastAlert(message, color) {
  // let toast = document.createElement('div');
  let toast = document.createElement("div");
  document.body.appendChild(toast);
  // toast.setAttribute(id ,"popup");
  toast.setAttribute(
    "style",
    `
  position: fixed;
  max-width: 80%;
  height: fit-content;
  top: 10px;
  left: 5%;
  right: 5%;
  margin:20px;
  font-size: 1.5rem;
  background-color:  var(--secondary-color);
  color: ${color};
  border-radius: 40px;
  text-align: center;
  padding: 30px;`
  );
  toast.innerText = message;
  setTimeout(() => toast.remove(), 3500);
}
//--------------------AFFICHAGE ET MISE A JOUR DU PANIER--------------------------------------
async function datacollector() {
  // POUR CHAQUES OBJETS DE 'cart', RECUPÈRE LES DONNÉES AUPRÈS DE L'API LE CONCERNANT ET STOCK LES DONNÉE DANS UN TABLEAU DE PROMESSES
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
/*const promises = [];

for (let elements of cart) {
    const loopPromise = new Promise((resolve, reject) => {
        fetch(`http://localhost:3000/api/products/${elements.id}`)
          .then((res) => {
            return res.ok
              ? res.json()
              : alert("Produit indisponible pour le moment.");
          })
          .then((value) => {
              // code ici [..]
              resolve(value, ...);
          }
          .catch((err) => {
            console.log(err);
            reject(err);
          });
    }
    promises.push(loopPromise);
}
const results = await Promise.all(promises);
Promise.all(promises).then().catch()
*/
// RECENSE TOUTES LES BALISES DE CONTRÔLE DE QUANTITÉ
async function quantityAjustor() {
  console.log("après ?");
  //NodeList() des balises input.itemQuantity
  const quantitySelectors = document.querySelectorAll("input.itemQuantity");
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
        toastAlert(
          `La quantité doit être comprise entre 1 et 100 articles. `,
          "red"
        );
        selector.style.border = "red solid 2px";
        selector.previousElementSibling.style.color = "red";
      } else {
        // saisie conforme = ajustement de la quantité au pannier (cart['produit ciblé'.amount])
        similarProductStored.amount = selector.value;
        selector.style.border = "0";
        selector.previousElementSibling.style.color = "";
      }
      //mise à jour du total produit
      totalPrice();
      // mise à jour du stockage Local
      localStorage.cart = JSON.stringify(cart);
    });
  }
  //NodeList() des balises p.deleteItem
  const productSuppressors = document.querySelectorAll("p.deleteItem");

  //Ciblage des produits concernés par la suppression
  for (let suppressor of productSuppressors) {
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
      let prodName = productFixer.querySelector(
        "div.cart__item__content > div.cart__item__content__description > h2"
      );
      toastAlert(
        ` ${prodName.textContent}  ${productFixer.dataset.color} supprimé`
      );
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

// APPEL DE LA FONCTION GLOBAL
datacollector();
//---------------------------------PARTIE FORMULAIRE---------------------------------
// CONSTANTES FORMULAIRE
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const submitBtn = document.getElementById("order");
//    REGEX
const regexName =
  /^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/;
const regexAddress = /^[A-Za-z0-9éïäëèà \-\.']{2,}/;
const regexMail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// ECOUTEUR D'ÉVÈNEMENTS SUR LE FORMULAIRE
function formListener(field, regex) {
  field.addEventListener("change", () => {
    if (regex.test(field.value)) {
      field.nextElementSibling.innerText = "ok";
      //retour aux valeurs d'origines (utile après une erreur)
      field.style.border = "0";
      field.previousElementSibling.style.color = "";
      submitBtn.disabled = false;
      submitBtn.style.cursor = "pointer";
    } else {
      //test regex ou champ vide
      field.style.border = "red solid 2px";
      field.previousElementSibling.style.color = "red";
      submitBtn.disabled = true;
      submitBtn.style.cursor = "not-allowed";
      // message pour champ vide
      if (field.value === "") {
        field.nextElementSibling.innerText = "le champ est vide";
      }
      // sinon message pour test regex échoué
      else {
        field.nextElementSibling.innerText = `"${field.value}" n'est pas une entrée correcte"`;
      }
    }
  });
}

formListener(firstName, regexName);
formListener(lastName, regexName);
formListener(address, regexAddress);
formListener(city, regexAddress);
formListener(email, regexMail);

//  EVENEMENT AU CLIC SUR BOUTON COMMANDE :
let contactData = {}; //objet qui sera envoyé à l'api
const formFields = document.querySelectorAll(
  //récuppère toutes les entrée de formulaire
  ".cart__order__form__question>input"
);
submitBtn.addEventListener("click", (e) => {
  e.preventDefault(); // évite le rechargemnt de la page
  //Test si champ du formulaire remplis
  let formFilled = false;

  for (let field of formFields) {
    // let fieldsNames = fields.previousElementSibling;
    if (field.value === "") {
      field.style.border = "solid 2px red";
      field.previousElementSibling.style.color = "red";
      toastAlert("Le formulaire imcomplet", "red");
    } else {
      contactData[`${field.id}`] = `${field.value}`;
      formFilled = true;console.log(formFilled);
    }
  }
  if (!formFilled) {
    toastAlert("Le formulaire est vide", "red");
  }
  // test si formulaire remplis et pannier n'est pas vide
  if (formFilled && cart.length !== 0) {
    console.log(formFilled)
    let productsIds = [];
    cart.forEach((prod) => productsIds.push(prod.id));
    let order = {};
    order.products = productsIds;
    order.contact = contactData;
    orderSender(order);
  } else {
    submitBtn.disabled = true;
    toastAlert("Le panier est vide", "red");
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
    .then(
      (value) =>
        (window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?order=${value.orderId}`)
    )
    .catch((err) => alert(err));
}
