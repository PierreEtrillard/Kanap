  // Requète des produits auprès de l'api
  fetch("http://localhost:3000/api/products")
    .then((res) =>{
      //traitement de la réponse : si ok = capte la réponse sous forme d'un objet .json
      return res.ok ? res.json()
        : alert("Catalogue indisponible, merci de vous connecter ulterieurement.");
    })
    //      EXTRACTION DES DONNÉES
    .then((value) => {
      // "i" prendra la valeur de chaque indice du tableau fourni par l'api
      for (let i in value){
        
      // INTÉGRATION DU NOUVEL ÉLEMENT DANS LE DOM
      const itemWrapper = document.getElementById("items");
      itemWrapper.innerHTML +=
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
