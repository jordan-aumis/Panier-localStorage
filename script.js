//?                 DONNEE JSON RECUPERE

//Fonction ajax 

var data;

function readFile(file, done) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, false);
    var value;
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                value = JSON.parse(allText);
                done(value);
            }
        }
    }
    rawFile.send(null);
}
// fonction pour lire le fichier
readFile("./produit.json", function (value) {
    data = value;
})

//?_______________________________________________________________________

//?             MES VARIABLES DU DOM

var logoPanier = document.querySelector("#logo-panier")
var phone = document.querySelectorAll("#wrapper div .btn")
var spanTotalPrice = document.querySelector("#total-price")
var panierDiv = document.querySelector('#panier')
var tableDiv = document.querySelector("#fill-table")
var priceBeforeReduction = document.querySelector('#price-reduction')
var totalPrice = 0;
var reductionPrice = 200
var arrayPrice = [];
var key = Number(localStorage.length)

//?_______________________________________________________________________

//?                 MES FONCTIONS

//Cette fonction permet de retirer un produit du local storage ainsi que sur le dom
function removeProd(element) {
    var toRemove = element.parentNode.parentNode
    console.log("HELLOOOOOOOOOO")
    console.log(toRemove)
    console.log(element.parentNode.parentNode.id)
    prod = localStorage.getItem(element.parentNode.parentNode.id)
    parsedProd = JSON.parse(prod)
    if (parsedProd != null) {
        totalPrice -= Number(parsedProd.price) * Number(parsedProd.quantity)
    }
    var ok = confirm("etes vous sûr de vouloir retirer le produit ?")
    if (ok) {
        localStorage.removeItem(element.parentNode.parentNode.id)
        element.parentNode.parentNode.parentNode.removeChild(toRemove);
        spanTotalPrice.innerHTML = totalPrice + '€'
        priceBeforeReduction.innerHTML = reductionPrice - totalPrice + '€'
    }

}

//cette fonction change la quantité.

function ChangeQuantity(array, sign, productId, name, price, quantity) {

    if (sign == "+") {
        array.forEach(element => {
            element.addEventListener("click", function () {
                quantity += 1
                console.log(typeof totalPrice)
                console.log(typeof price)
                totalPrice += price
                console.log(typeof totalPrice)
                spanTotalPrice.innerHTML = totalPrice + '€'
                priceBeforeReduction.innerHTML = reductionPrice - totalPrice
                if (totalPrice > reductionPrice) {
                    spanTotalPrice.innerHTML = (totalPrice / 1.05).toFixed(2) + '€'
                    priceBeforeReduction.innerHTML = "reduction de 5% ajoutée"
                }
                localStorage.setItem(element.parentNode.parentNode.id, JSON.stringify({
                    "name": name,
                    "price": Number(price),
                    "id": productId,
                    "quantity": quantity
                }))
                element.parentNode.innerHTML = "<button class='btn-minus'>-</button> " + quantity + " <button class='btn-plus'>+</button>"
                btnMinus = document.querySelectorAll(".btn-minus")
                ChangeQuantity(btnMinus, "-", productId, name, price, quantity)
                btnPlus = document.querySelectorAll(".btn-plus")
                ChangeQuantity(btnPlus, "+", productId, name, price, quantity)

            })
        })

    } else if (sign == "-") {
        array.forEach(element => {
            element.addEventListener("click", function () {
                console.log("click");
                quantity -= 1
                totalPrice -= price
                spanTotalPrice.innerHTML = totalPrice + '€'
                priceBeforeReduction.innerHTML = reductionPrice - totalPrice
                if (totalPrice > reductionPrice) {
                    spanTotalPrice.innerHTML = (totalPrice / 1.05).toFixed(2) + '€'
                    priceBeforeReduction.innerHTML = "reduction de 5% ajoutée"
                }
                if (quantity < 1) {
                    removeProd(element)
                } else {
                    localStorage.setItem(element.parentNode.parentNode.id, JSON.stringify({
                        "name": name,
                        "price": Number(price),
                        "id": productId,
                        "quantity": quantity
                    }))
                    element.parentNode.innerHTML = "<button class='btn-minus'>-</button> " + quantity + " <button class='btn-plus'>+</button>"
                    btnPlus = document.querySelectorAll(".btn-plus")
                    ChangeQuantity(btnPlus, "+", productId, name, price, quantity)
                    btnMinus = document.querySelectorAll(".btn-minus")
                    ChangeQuantity(btnMinus, "-", productId, name, price, quantity)
                }
            })
        })
    }
}

// function qui permet d'afficher le panier et de le faire disparaitre

function toggleElement(element) {
    if (element.style.display == "none") {
        element.style.display = "flex"
    } else
        element.style.display = "none"
}

// function qui permet l'affichage des produit dans mon DOM grace au fichier JSON

function showProduct(data) {

    var nomPhone = document.querySelectorAll(".nomProduit")
    var imgPhone = document.querySelectorAll(".imgProduit")
    var pricePhone = document.querySelectorAll("#wrapper div span")
    for (let i = 0; i < data.length; i++) {
        nomPhone[i].innerHTML = data[i].nomProduit
        nomPhone[i].setAttribute("data-id", data[i].idProduit)
        imgPhone[i].src = data[i].imageProduit
        pricePhone[i].innerHTML = data[i].prixProduit
    }
}

// fonction permettant de remplir le panier

function panier(i, name, price, quantity, alreadyCreated) {

    if (alreadyCreated == false) {
        var panierId = document.createElement("tr")
        var nomProduit = document.createElement("td")
        var prixProduit = document.createElement("td")
        var quantityProduct = document.createElement("td")
        var deleteProduct = document.createElement("td")
        var deleteButton = document.createElement("button")
        deleteButton.classList.add("btn-delete")
        nomProduit.classList.add("produits-panier")
        prixProduit.classList.add("produits-panier")
        panierId.setAttribute("id", i)
        quantityProduct.setAttribute("id", "quantity-" + i)
        deleteProduct.innerHTML = "<button class='btn-delete'>X</button>"
        nomProduit.innerHTML = name
        prixProduit.innerHTML = price + "€"

        // AJOUTER UNE QUANTITé
        quantityProduct.innerHTML = "<button class='btn-minus'>-</button> " + quantity + " <button class='btn-plus'>+</button>"
        panierId.append(nomProduit, prixProduit, quantityProduct, deleteProduct)
        tableDiv.append(panierId)
        btnPlus = document.querySelectorAll(".btn-plus")
        ChangeQuantity(btnPlus, "+", i, name, price, quantity)
        btnMinus = document.querySelectorAll(".btn-minus")
        ChangeQuantity(btnMinus, "-", i, name, price, quantity)

        // Enlever un produit du panier
        deleteButton = document.querySelectorAll(".btn-delete")
        deleteButton.forEach(element => {
            element.addEventListener("click", function (e) {
                removeProd(element)
            });
        });

    } else {
        quantityProduct = document.getElementById("quantity-" + i)
        quantityProduct.innerHTML = "<button class='btn-minus'>-</button> " + quantity + " <button class='btn-plus'>+</button>"
        btnPlus = document.querySelectorAll(".btn-plus")
        ChangeQuantity(btnPlus, "+", i, name, price, quantity)
        btnMinus = document.querySelectorAll(".btn-minus")
        ChangeQuantity(btnMinus, "-", i, name, price, quantity)
    }

}


// Fonction qui renvoi la somme.
function sum(array, key1, key2) {
    return array.reduce((a, b) => a + (b[key1] * b[key2] || 0), 0);
}

//?_____________________________________________________________________

//?                     PARTIE CODE


// GERER L'AFFICHAGE DU PANIER

logoPanier.addEventListener("click", function () {
    toggleElement(panierDiv)
})


products = [];
for (let i = 0; i < localStorage.length; i++) {
    products[i] = JSON.parse(localStorage.getItem(localStorage.key(i)))
}

console.log(products)
if (products.length > 0) {
    totalPrice = sum(products, 'price', 'quantity')
    console.log(totalPrice)
    if (totalPrice < reductionPrice) {
        spanTotalPrice.innerHTML = totalPrice + "€"
        priceBeforeReduction.innerHTML = reductionPrice - totalPrice + "€"
    } else {
        spanTotalPrice.innerHTML = (totalPrice / 1.05).toFixed(2) + "€"
        priceBeforeReduction.innerHTML = "Reduction de 5% appliquée"
    }

    for (let i = 0; i < products.length; i++) {
        panier(products[i].id, products[i].name, products[i].price, products[i].quantity, false)
    }
} else {
    spanTotalPrice.innerHTML = 0 + "€";
    priceBeforeReduction.innerHTML = reductionPrice + '€'
    products = [];
}

// J'affiche mes data dans mon html


showProduct(data)

// Fonction on click je veux rajouter un produit dans mon panier
var quantity = 1;
phone.forEach(element => {
    element.addEventListener("click", function (e) {
        console.log(element)
        e.preventDefault()


        //  je recupere le nom du telephone et le prix
        name = element.parentNode.children[0].innerHTML
        price = element.parentNode.children[2].children[0].innerHTML
        productId = element.parentNode.children[0].getAttribute("data-id")
        checkIfExist = JSON.parse(window.localStorage.getItem(productId))

        if (checkIfExist == null) {
            window.localStorage.setItem(productId, JSON.stringify({
                "name": name,
                "price": Number(price),
                "id": productId,
                "quantity": 1
            }))
            panier(productId, name, Number(price), 1, false)
        } else {
            console.log(checkIfExist.quantity);
            checkIfExist.quantity += 1
            localStorage.setItem(productId, JSON.stringify({
                "name": name,
                "price": Number(price),
                "id": productId,
                "quantity": checkIfExist.quantity
            }));
            panier(productId, name, Number(price), checkIfExist.quantity, true)
        }


        // j'ajoute à ma div panier mon produit
        objet = window.localStorage.getItem(productId)
        parsedObjet = JSON.parse(objet)
        console.log(typeof parsedObjet)
        totalPrice += parsedObjet.price;
        if (totalPrice < reductionPrice) {
            spanTotalPrice.innerHTML = totalPrice + "€"
            priceBeforeReduction.innerHTML = reductionPrice - totalPrice + "€"
        } else {
            spanTotalPrice.innerHTML = (totalPrice / 1.05).toFixed(2) + "€"
            priceBeforeReduction.innerHTML = "Reduction de 5% appliquée"
        }
    })
});