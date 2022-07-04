
let cart = localStorage.cart ? JSON.parse(localStorage.cart):alert("le pannier est vide");;

const itemsAnchor = document.getElementById("cart__items");

function itemFiller (){

    for (let elements of cart){
        fetch(`http://localhost:3000/api/products/${elements.id}`)
         .then((res)=>{
            return res.ok
                ? res.json()
                :  alert(
                    "Produit indisponible, merci de nous contacter pour plus de détails."
                  );
            }) 
        .then((value)=>{
            let urlImagesList;
            console.log(value);
            itemsAnchor.innerHTML +=`
            <article class="cart__item" data-id="${elements.id}" data-color="${elements.color}">
                <div class="cart__item__img">
                  <img src="${value.imageUrl}" alt="${value.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${value.name}</h2>
                    <p>${elements.color}</p>
                    <p>${value.price} €</p>
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
            `
        })
    }
}
itemFiller();



// for( let i = 0; i < localStorage.length; i++){
//     console.log(localStorage.key(i));
// }


// <!--  <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
//                 <div class="cart__item__img">
//                   <img src="../images/product01.jpg" alt="Photographie d'un canapé">
//                 </div>
//                 <div class="cart__item__content">
//                   <div class="cart__item__content__description">
//                     <h2>Nom du produit</h2>
//                     <p>Vert</p>
//                     <p>42,00 €</p>
//                   </div>
//                   <div class="cart__item__content__settings">
//                     <div class="cart__item__content__settings__quantity">
//                       <p>Qté : </p>
//                       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
//                     </div>
//                     <div class="cart__item__content__settings__delete">
//                       <p class="deleteItem">Supprimer</p>
//                     </div>
//                   </div>
//                 </div>
//               </article> -->