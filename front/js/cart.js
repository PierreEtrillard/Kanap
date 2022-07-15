let cart = localStorage.cart
  ? JSON.parse(localStorage.cart)
  : alert("le pannier est vide");

const itemsAnchor = document.getElementById("cart__items");
const totalPriceAnchor = document.getElementById("totalPrice");
const totalQuantityAnchor = document.getElementById("totalQuantity");
// CONSTANTES FORMULAIRE
const firstName = document.getElementById('firstName')
const firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
const lastName = document.getElementById('lastName')
const lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
const address = document.getElementById('address')
const addressErrorMsg = document.getElementById('addressErrorMsg')
const city = document.getElementById('city')
const cityErrorMsg = document.getElementById('cityErrorMsg')
const email = document.getElementById('email')
const emailErrorMsg = document.getElementById('emailErrorMsg')
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
       
        console.log("avant ?");
        //mise à jour du total produit
      totalPrice()
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
      totalPrice()
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
      totalPrice()
      // mise à jour du stockage Local
      localStorage.cart = JSON.stringify(cart);
    });
  }
}

// SOMME DES PRODUIT ET PRIX TOTAL
function totalPrice(){  
  let totalQuantity = 0
  let totalOrder = 0
  for (let product of cart){
    totalQuantity += +product.amount;
    totalQuantityAnchor.innerText = totalQuantity;    
    totalOrder += +(product.amount * product.price);
    totalPriceAnchor.innerText = totalOrder;}
}
//---------------------------------------------------//
// APPEL DE LA FONCTION GLOBAL
datacollector();

// ECOUTEUR D'ÉVÈNEMENTS SUR LE FORMULAIRE

const regexName = new RegExp('^[A-Za-z- {2-20}]+![0-9]','g');
const regexAddress = new RegExp('^[A-Za-z {2-20}]','g');
const regexMail = new RegExp('^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$','g')

firstName.addEventListener("change", () => {
  if (regexName.test(firstName.value))
  {firstNameErrorMsg.innerText = "Prenom valide"}
     else{
    firstNameErrorMsg.innerText =  "Prenom non valide veuillez verifier qu'aucun chiffres ou caractère spéciaux ne soit inséré"}
 });

lastName.addEventListener("change", () => {
  if (regexName.test(lastName.value))
  {lastNameErrorMsg.innerText = "Nom valide"}
  else{lastNameErrorMsg.innerText =  "Nom non valide veuillez verifier qu'aucun chiffres ou caractère spéciaux ne soit inséré"}
 
});

address.addEventListener("change", () => {

  if (regexAddress.test(address.value)
    // && regexAdress.test(address.value)
    // && regexAdress.test(city.value)
    // && regexMail.test(email.value)
    )
  {addressErrorMsg.innerText = "Prenom valide"}
     else{
    addressErrorMsg.innerText =  "Prenom non valide veuillez verifier qu'aucun chiffres ou caractère spéciaux ne soit inséré"}
 
});

email.addEventListener("change", () => {

  if (regexMail.test(firstName.value)
    // && regexName.test(lastName.value)
    // && regexAdress.test(address.value)
    // && regexAdress.test(city.value)
    // && regexMail.test(email.value)
    )
  {emailErrorMsg.innerText = "Prenom valide"}
     else{
    emailErrorMsg.innerText =  "Prenom non valide veuillez verifier qu'aucun chiffres ou caractère spéciaux ne soit inséré"}
 
});