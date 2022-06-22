// Récupération de l'ID de produits dans l'URL
const actualUrl = new URL(document.location.href);
const productId = actualUrl.searchParams.get("id");

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
    console.log(value);
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
  })
  .catch((err) => {
    return null
      ? console.log(
          "une erreur s'est produite lors du chargement de la fiche produit"
        )
      : console.log("la fiche produit à été correctement chargée mais une erreur dans son implémentation est détectée");
  });
// document.getElementById('addToCart').addEventListener('click','onclick');
