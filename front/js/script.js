/**
 * Send request to the api for obtain the arrays af product
 * @param { String } url
 * @param { String } method
 * @param { Object } body
 * @return { Promise }
 */
/*Les fiches produits à récupérer auprès de l'api sont contenu dans un tableau d'objets
 et ont la structure suivante: {
   colors: Array(),
   _id: 'string',
   name: 'string',
   price: number,
   imageUrl: 'url',
   altTxt: 'string',
   description:'string'
  }*/

  //requéte des produits à l'api
  fetch("http://localhost:3000/api/products")
    .then((res) =>{
      //traitement de la réponse si ok = capte la réponse sous forme d'un objet .json
      return res.ok ? res.json()
        : alert("Catalogue indisponible, merci de vous connecter ulterieurement.");
    })
    //      EXTRACTION DES DONNÉES
    .then((value) => {
      // "i" prendra la valeur de chaques indices du tableau fournis par l'api
      for (let i in value){
      //    CREATION D'UNE "<div id='(valeur de l'id du produit visé)'>"  //
      const newCard = document.createElement("div");
      newCard.setAttribute("id", `${value[i]._id}`);
    
      // INTEGRATION DU NOUVEL ELEMENT DANS LE DOM
      const itemWrapper = document.getElementById("items");
      itemWrapper.appendChild(newCard).innerHTML =
      `<a href="./product.html?id=${value[i]._id}">
          <article>
            <img src="${value[i].imageUrl}" alt="${value[i].altTxt}", ${value[i].name}">
            <h3 class="productName">${value[i].name}</h3>
            <p class="productDescription">${value[i].description}</p>
          </article>
        </a>`};
    })
    .catch((err) =>{
      console.log(err);
    });
