// Récupération de l'ID de produits dans l'URL
const actualUrl = new URL(document.location.href);
const productId = actualUrl.searchParams.get("id");
// Vidage du cart (evite l'envoi de données précedemment sélectionnées)
// cart.clear();
let cart = {};
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((res) => {
    //traitement de la réponse si ok = capte la réponse sous forme d'un objet .json
    return res.ok
      ? res.json()
      : alert(
          "Fiche produit indisponible, merci de vous connecter ulterieurement."
        );
  })
  //      EXTRACTION DES DONNÉES & IMPLÉMENTATION DE CELLES-CI DANS LE DOM
  .then((value) => {
    // console.log(value);
    document.querySelector("div.item__img").innerHTML = `<img src="${value.imageUrl}">`;
    document.getElementById("title").innerHTML = `${value.name}`;
    document.getElementById("price").innerHTML = `${value.price}`;
    document.getElementById("description").innerHTML = `${value.description}`;
    /*  SELECTEUR DE COULEURS: extraction des listes de couleurs de produit et ajout 
    des balises <option value="couleur(variable 'c')"> */
    for (let c in value.colors) {
      let colorOption = document.createElement("option");
      colorOption.setAttribute("value", `${value.colors[c]}`);
      let colorSelector = document.getElementById("colors");
      colorSelector.appendChild(colorOption).innerText = `${value.colors[c]}`;
    }
  // CREATION D'UN OBJET cart RENSEIGNANT L'ID POUR LE PANNIER
  cart.id =`${value._id}`;
    })
  .catch((err) => {
      console.log(
          "une erreur s'est produite lors du traitement de la fiche produit",err);
  });

  //   REMPLISSAGE DU PANNIER AVEC LA COULEUR ET LA QUANTITÉ DU PRODUIT À COMMANDER
    document
    .getElementById('colors')
    .addEventListener("input", (c)=>{
      cart.color=c.target.value;
      
      console.log(cart);
    });
    
    document
      .getElementById('quantity')
      .addEventListener("input", (q)=>{ 
        cart.quantity=q.target.value;
     
      console.log(cart);
     });
    
    document.getElementById('addToCart').addEventListener('click',() =>{
      if (sessionStorage.color == cart.color)
      {
      sessionStorage.quantity += cart.quantity;
      console.log(sessionStorage);
    }
      else {
        sessionStorage += cart;
        console.log("créer un nouvelle objet")
      }
    })


    //cart("id","couleur","quantité") AU CLICK DU BOUTON 'addToCart'