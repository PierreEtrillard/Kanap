localStorage.clear()
// Récupération de l'ID de produits dans l'URL
const actualUrl = new URL(document.location.href);
const orderNum = actualUrl.searchParams.get("order");
const orderPublisher = document.getElementById("orderId");

orderPublisher.innerText = orderNum