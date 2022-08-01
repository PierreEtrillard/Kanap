//-----------------INTERACTIONS AVEC L'UTILISATEUR----------------------------------
const itemsAnchor = document.getElementById("cart__items");
const totalPriceAnchor = document.getElementById("totalPrice");
const totalQuantityAnchor = document.getElementById("totalQuantity");

//-------------------------------TRAITEMENT DE DONNÉES---------------------------------------
// Récupère le panier dans le localStorage, alerte si celui-ci n'est pas présent
let cart = localStorage.cart
? JSON.parse(localStorage.cart)
: toastAlert("le panier est vide", "var(--main-color)");

//------------------------  REQUÈTE DES DONNÉES AUPRÈS DE L'API ------------------------------
const promisesFromApi = [];
/* POUR CHAQUE OBJET DE 'cart': RECUPÈRE LES DONNÉES AUPRÈS DE L'API LE CONCERNANT ET STOCK LES DONNÉES
DANS LE TABLEAU DE PROMESSES promisesFromApi[]*/
for (let elements of cart) {
  const currentPromise = new Promise((resolve) => {
    fetch(`http://localhost:3000/api/products/${elements.id}`)
    .then((res) => {
      return res.ok
      ? res.json()
      : alert("Produit indisponible pour le moment.");
    })
    .then((value) => {
        // récupération des arguments imgSrc,altTxt, name, price pour chaque produit dans cart[] lorsque la requète sera résolue
        elements["imgSrc"] = value.imageUrl;
        elements["altTxt"] = value.altTxt;
        elements["name"] = value.name;
        elements["price"] = value.price;
        resolve(value);
      })
    });
    promisesFromApi.push(currentPromise);
  }
  
  //--------------------AFFICHAGE ET MISE À JOUR DU PANIER--------------------------------------
  Promise.all(promisesFromApi).then((value) => {console.log(typeof value);
    // après la résolution de toutes les requètes contenues dans promisesFromApi[]
    for (let elements of cart) {
      //implémentera les élements dans le DOM pour chaque produit
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
       </article>
                `;
    //mise à jour du total produit
    totalPrice();
  }
  quantityAjustor();
})
.catch((err) => {
  console.error(err);
  toastAlert("Serveur indisponible","red")
});
// RECENSE TOUTES LES BALISES DE CONTRÔLE DE QUANTITÉ ET DE SUPPRESSION
function quantityAjustor() {
  //NodeList() des balises input.itemQuantity
  const quantitySelectors = document.querySelectorAll("input.itemQuantity");
  /*Ciblage des produits concernés par la modification de quantité grâce aux dataset.color & dataset.id
  de la balise 'article' la plus proche de chaque input.itemQuantity*/
  for (let selector of quantitySelectors) {
    const productFixer = selector.closest("article");
    const similarProductStored = cart.find(
      (produit) =>
        produit.color === productFixer.dataset.color &&
        produit.id === productFixer.dataset.id
    );
    selector.addEventListener("change", () => {
      //Vérifie si la saisie est conforme (quantité entre 1 et 100 articles)
      if (selector.value < 1 || selector.value > 100) {
        submitBtn.disabled = true;//désactive le bouton de soumission
        submitBtn.style.cursor = "not-allowed";
        toastAlert(
          `La quantité doit être comprise entre 1 et 100 articles. `,
          "red"
        );
        selector.style.border = "red solid 2px";
        selector.previousElementSibling.style.color = "red";
      } else {
        // Saisie conforme = ajustement de la quantité au panier (cart['produit ciblé'.amount])
        similarProductStored.amount = selector.value;
        selector.style.border = "0";
        selector.previousElementSibling.style.color = "";
        submitBtn.disabled = false;
        submitBtn.style.cursor = "pointer";
      }
      // Mise à jour du total produit
      totalPrice();
      // Mise à jour du stockage Local
      localStorage.cart = JSON.stringify(cart);
    });
  }
  //NodeList() des balises p.deleteItem
  const productSuppressors = document.querySelectorAll("p.deleteItem");

  //Ciblage des produits concernés par la suppression
  for (let suppressor of productSuppressors) {
    let productFixer = suppressor.closest("article");
    suppressor.addEventListener("click", () => {
      /* Boucle sur cart[] pour trouver la correspondance entre le produit
      ciblé et le produit du panier à supprimer*/
      cart = cart.filter(
        //puis met à jour cart[] sans le produit supprimé
        (prod) =>
          prod.color !== productFixer.dataset.color ||
          prod.id !== productFixer.dataset.id
      );
      // Mise à jour du total produit
      totalPrice();
      // Mise à jour du stockage Local
      localStorage.cart = JSON.stringify(cart);

      let prodName = productFixer.querySelector(
        "div.cart__item__content > div.cart__item__content__description > h2"
      );
      toastAlert(
        ` ${prodName.textContent}  ${productFixer.dataset.color} supprimé`
      );
      // Suppression du noeud dans le Dom
      productFixer.style.transition = "all 0.5s ease-out";
      productFixer.style.transform = "scale(0) rotate(1turn)";
      productFixer.style.opacity = "0";
      setTimeout(() => {
        productFixer.remove();
      }, 480);
    });
  }
}

// SOMME DES PRODUITS ET PRIX TOTAL
function totalPrice() {
  let totalQuantity = 0;
  let totalOrder = 0;
  for (let product of cart) {
    totalQuantity += +product.amount;
    totalQuantityAnchor.innerText = totalQuantity;
    totalOrder += +(product.amount * product.price);
    totalPriceAnchor.innerText = totalOrder;
  }
  // Dans les cas de suppression de tous les éléments du pannier, met 
  if (!cart || cart.length === 0) {
    totalQuantityAnchor.innerText = "0";
    totalPriceAnchor.innerText = "0";
  }
}

//---------------------------------PARTIE FORMULAIRE---------------------------------
// CONSTANTES DU FORMULAIRE
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const submitBtn = document.getElementById("order");
submitBtn.style.cursor = "not-allowed";
//    REGEX
const regexName =
  /^(?:((([^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\ -\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/;
const regexAddress = /^[A-Za-z0-9éïäëèà \-\.']{2,}/;
const regexMail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// AIDE A LA VALIDATOIN DU FORMULAIRE
function fieldValidator(field, regex) {
  field.addEventListener("change", () => {
    if (regex.test(field.value)) {
      field.nextElementSibling.innerText = "ok";
      // Retour aux valeurs css d'origine après correction d'erreur
      field.style.border = "0";
      field.previousElementSibling.style.color = "";
      submitBtn.disabled = false;
      submitBtn.style.cursor = "pointer";
    } else {
      //test regex échoué ou champ vide:
      field.style.border = "red solid 2px";
      field.previousElementSibling.style.color = "red";
      submitBtn.style.cursor = "not-allowed";
      submitBtn.disabled = true;
      toastAlert("Formulaire incorrect", "red");
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
fieldValidator(firstName, regexName);
fieldValidator(lastName, regexName);
fieldValidator(address, regexAddress);
fieldValidator(city, regexAddress);
fieldValidator(email, regexMail);

//  ÉVENEMENT AU CLIC SUR BOUTON COMMANDE :
let contactData = {}; //objet qui sera envoyé à l'api
const formFields = document.querySelectorAll(
  //récupère toutes les entrées de formulaire
  ".cart__order__form__question>input"
);
let emptyFieldCounter = 5;
submitBtn.addEventListener("click", (e) => {
  // avertissement au panier vide
  if (!cart || cart.length === 0) {
    toastAlert("Le panier est vide", "red");
    submitBtn.style.cursor = "not-allowed";
  }
  e.preventDefault(); // évite le rechargemnt de la page
  //Test si champ du formulaire rempli

  for (let field of formFields) {
    if (field.value === "") {
      field.style.border = "solid 2px red";
      field.previousElementSibling.style.color = "red";
      toastAlert("Formulaire imcomplet", "red");
    } else {
      --emptyFieldCounter;
      contactData[`${field.id}`] = `${field.value}`;
    }
  }
  // test si formulaire rempli et panier contient des articles
  if (emptyFieldCounter === 0 && cart.length !== 0) {
    //création de l'objet order contenant les données du formulaire et les produits
    let productsIds = [];
    cart.forEach((prod) => productsIds.push(prod.id));
    let order = {};
    order.products = productsIds;
    order.contact = contactData;
    orderSender(order); // envoi l'objet à l'api
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
      // redirection vers la page confirmation en insérant la réponse (id de commande) ds l'url
      (value) =>
        (window.location.href = `http://localhost:5500/front/html/confirmation.html?order=${value.orderId}`)
    )
    .catch((err) => alert(err));
}
