var productList = [];
var contentHTMLBtn = document.getElementsByClassName("btn-add");

function getListProducts() {
    //pending
    // getEle("loading").style.display = "block";
    // // Promise:
    //             -pending (chờ)
    //             -Resolve (thành công)
    //             -Reject (thất bại)

    axios({
        url: "https://62c2af23ff594c6567624e08.mockapi.io/api/products",
        method: "GET",
    })
        .then(function (result) {
            // getEle("loading").style.display = "none";
            productList = result.data
            renderProducts(productList);
        })
        .catch(function (error) {
            console.log(error);
        })
}
getListProducts();

function renderProducts(data) {
    var contentHTML = "";
    for (var i = 0; i < data.length; i++) {
            var productImg = data[i].img.includes("https")
                ? data[i].img
                : `./assets/img/${data[i].img}`
            contentHTML += `
        <div class="col-lg-3 col-md-6 mt-3">
        <div class="grids5-info">
            <div  class="img">
                <img  src="${productImg} "alt="" class="product-img img-fluid service-image">
            </div>
            <div class="blog-info">
                <span  class="title product-name">
                    ${data[i].name}</span>
                <p class="text-para">
                Camera Sau: ${data[i].backCamera}
                <br>
                Camera Trước: ${data[i].frontCamera}
                <br>
                Màn Hình: ${data[i].screen}
                </p>
            </div>
            <div class="purchase">
                <p class="product-price " >$ ${data[i].price}</p>
                <span class="btn-add">
                    <div >
                        <button onclick="addCart(${data[i].id},${i})" class="add-btn btn btn-dark">Add
                            <i class="fa-solid fa-angles-right"></i></button>
                    </div>
                </span>
            </div>
        </div>
    </div>
        `
    }

    document.getElementById("banner").innerHTML = contentHTML;

}
function listChanged(type){
    if(type.value===""){
        getListProducts();
        renderProducts(productList);
    }
    var contentHTML = "";
    var count=-1;
    for (var i = 0; i < productList.length; i++) {
        if(productList[i].type===type.value){
            var productImg = productList[i].img.includes("https")
                ? productList[i].img
                : `./assets/img/${productList[i].img}`
            contentHTML += `
        <div class="col-lg-3 col-md-6 mt-3">
        <div class="grids5-info">
            <div class="img">
                <img  src="${productImg} "alt="" class="product-img img-fluid service-image">
            </div>
            <div class="blog-info">
                <span  class="title product-name">
                    ${productList[i].name}</span>
                <p class="text-para">
                Camera Sau: ${productList[i].backCamera}
                <br>
                Camera Trước: ${productList[i].frontCamera}
                <br>
                Màn Hình: ${productList[i].screen}
                </p>
            </div>
            <div class="purchase">
                <p class="product-price ">$ ${productList[i].price}</p>
                <span class="btn-add">
                    <div >
                        <button onclick="addCart(${productList[i].id},${count+=1})" class="add-btn btn btn-dark">Add
                            <i class="fa-solid fa-angles-right"></i></button>
                    </div>
                </span>
            </div>
        </div>
    </div>
        `
        }
    }

    document.getElementById("banner").innerHTML = contentHTML;
    getAddBtn();
}
var cartItem = [];
function finById(data, id) {
    for (var i = 0; i < data.length; i++) {
        if (+data[i].id === id) {
            return i;
        }
    }
    return -1;
}
function checkCartItem(id) {
    //cách 1:
    // var index = finById(id);
    // if (cartItem.length === 0) {
    //     cartItem.push(productList[index]);
    //     cartItem[0].quantity = 1;
    //     return true;
    // }
    var index = finById(productList, id)
    for (var i = 0; i < cartItem.length; i++) {
        if (+cartItem[i].id === id) {
            if (cartItem[i].quantity >= 10) {
                alert("Không mua vược quá sl 10");
                return;
            } else {
                cartItem[i].quantity += 1;
                contentHTMLBtn[index].innerHTML
                    = showAmount(cartItem[i].quantity, id, cartItem[i].quantity);
                saveLocalstorage();
                renderCart(cartItem);
                return false;
            }
        }
    }
    return true;
}
function addCart(id,index) {
    //cách 1:
    // var val = checkCartItem(id);
    // var indexCart = cartItem.length;
    // var index = finById(id);
    // if (!val) {
    //     cartItem.push(productList[index]);
    //     cartItem[indexCart].quantity = 1;
    // }
    var val = checkCartItem(id);
    if (val) {
        var indexprod = finById(productList, id);
        var cartName = document.getElementsByClassName("product-name")[index].innerText;
        var cartImg = document.getElementsByClassName("product-img")[index].src;
        var cartPrice = +document.getElementsByClassName("product-price")[index].innerText.replace("$ ", "");
        var cartQuantity = 1;
        var cart = new Cart(id, cartName, cartImg, cartPrice, cartQuantity);
        cartItem.push(cart);
        var e = contentHTMLBtn[indexprod].innerHTML =
            showAmount(cartQuantity, id, cartQuantity);
        saveLocalstorage();
        renderCart(cartItem);
    }
}
function qtyChange(id, status) {
    var index = finById(productList, id)
    for (var i = 0; i < cartItem.length; i++) {
        if (cartItem[i].id === id) {
            if (status === "sub") {
                cartItem[i].quantity -= 1;
                if (cartItem[i].quantity < 1) {
                    removeItem(cartItem[i].id);
                    contentHTMLBtn[index].innerHTML = showAmount(cartItem[i].quantity, id, cartItem[i].quantity);
                    return;
                }
            } else if (status === "add") {
                addCart(cartItem[i].id);
            }
            contentHTMLBtn[index].innerHTML = showAmount(cartItem[i].quantity, id, cartItem[i].quantity);
            saveLocalstorage();
            renderCart(cartItem);
        }
    }
}
function buy(e) {
    if (e === 1) {
        var t = document.getElementsByClassName("side-nav")[0].style.display = "none";
        var o = document.getElementsByClassName("order-now")[0].style.display = "block";
        return;
    }
    var o = document.getElementsByClassName("order-now")[0].style.display = "none";
    sideNav(1);
    renderCart(cartItem);


}
function order() {
    var id = Math.random() * 100;
    var o = document.getElementsByClassName("invoice")[0];
    o.style = "height:500px;width:400px"
    o.innerHTML = `<div style="display:flex;
    flex-direction: column;">
    <div class="order-details">
      <h4>your order has been placed</h4>
      <p>Your order-id is : <span>${Math.floor(id)}</span></p>
      <p>your order will be delivered to you in 3-5 working days</p>
      <p>you can pay <span>$ ${total}</span> by card or any online transaction method after the products have been dilivered to you</p>
    </div>
    <div>
    <button onclick="clearCart()" class="btn-ok">okay</button>
    </div>
  </div>`;
}
function clearCart() {
    cartItem.splice(0, cartItem.length);
    for (var i = 0; i < productList.length; i++) {
        var index = finById(cartItem, +productList[i].id);
        contentHTMLBtn[i].innerHTML
            = showAmount(-1, productList[i].id, "");
    }
    sideNav(0);
    var o = document.getElementsByClassName("invoice")[0].style.display = "none";
    console.log(cartItem);
    saveLocalstorage();
    renderProducts(productList)
    renderCart(cartItem);
}
function removeItem(id) {
    var indexprod = finById(productList, id)
    var index = finById(cartItem, id)
    cartItem.splice(index, 1);
    contentHTMLBtn[indexprod].innerHTML = showAmount(-1, id, 0);
    saveLocalstorage();
    renderCart(cartItem);
}

function sideNav(e) {
    var t = document.getElementsByClassName("side-nav")[0]
    var n = document.getElementsByClassName("cover")[0];
    t.style.display = e ? "block" : "none"
    n.style.display = e ? "block" : "none"
}
var total = 0;
function renderCart(data) {
    var contentHTML = "";
    var contentHTMLlistBuy = "";
    total = 0;
    var amount = 0;
    for (var i = 0; i < data.length; i++) {
        amount += data[i].quantity;
        contentHTML += `
            <div class="cart-item">
                <div class="cart-img">
                    <img src="${data[i].img}" alt="">
                </div>
                <strong class="name">${data[i].name}</strong>
                <span class="qty-change">
                    <div style="display:flex">
                    <button class="btn-qty" onclick="qtyChange(${data[i].id},'sub')"><i
                            class="fas fa-chevron-left"></i></button>
                    <p class="qty">${data[i].quantity}</p>
                        <button class="btn-qty" onclick="qtyChange(${data[i].id},'add')"><i
                            class="fas fa-chevron-right"></i></button>
                    </div>
                </span>
                <p class="price">$ ${total += (data[i].price * data[i].quantity)}</p>
                <button onclick="removeItem(${data[i].id})"><i class="fas fa-trash"></i></button>
            </div>  
        `
        contentHTMLlistBuy += `<div class="shipping-items">
        <div class="items-name"><span>${data[i].name}</span></div>
        <div class="items-img"><img src="${data[i].img}" alt=""></div>
        <div class="items-amount"><span>${data[i].quantity}</span></div>
        <div class="items-price"><span>${(data[i].price * data[i].quantity)} </span></div>
        </div>`
    }
    document.getElementById("baske").innerHTML = `<div class="nav">
    <button onclick="sideNav(1)"><i class="fas fa-shopping-cart"
            style="font-size:2rem;"></i></button>
    <span class="total-qty">${amount}</span>
    </div>`
    document.getElementById("final").innerHTML = ` 
    <strong>Total: $ <span class="total">${total}</span></strong>
    <div class="action">
        <button onclick="buy(1)" class="btn buy">Purchase <i class="fas fa-credit-card"
                style="color:#6665dd;"></i></button>
        <button onclick="clearCart()" class="btn clear">Clear Cart <i class="fas fa-trash"
                style="color:#bb342f;"></i></button>
    </div>
`
    document.getElementById("cart-items").innerHTML = contentHTML;
    document.getElementById("listBuyProduct").innerHTML = contentHTMLlistBuy;
    document.getElementsByClassName("payment")[0].innerHTML = `<em>payment</em>
    <div>
        <p>total amount to be paid:</p><span class="pay">$ ${total}</span>
    </div>`;
}
function showAmount(qty, id, amount) {
    if (qty >= 1) {
        return `<span class="qty-change">
    <div style="display:flex">
    <button class="btn-qty" onclick="qtyChange(${id},'sub')"><i class="fas fa-chevron-left"></i></button>
    <p class="qty">${amount}</p>
        <button class="btn-qty" onclick="qtyChange(${id},'add')"><i class="fas fa-chevron-right"></i></button>
    </div>
    </span>`;
    }
    return `<div >
    <button onclick="addCart(${id})" class="add-btn btn btn-dark">Add
        <i class="fa-solid fa-angles-right"></i></button>
</div>`;
}
function getAddBtn() {
    if (cartItem.length > 0) {
        for (var i = 0; i < productList.length; i++) {
            var index = finById(cartItem, +productList[i].id);
            if (index < 0) {
                continue;
            }
            contentHTMLBtn[i].innerHTML
                = showAmount(cartItem[index].quantity, productList[i].id, cartItem[index].quantity);
        }

    }
}
setTimeout(getAddBtn, 1000);

//loccalSttorage
function saveLocalstorage() {
    var cartItemListJSON = JSON.stringify(cartItem);
    localStorage.setItem("listCart", cartItemListJSON)

}

//lấy dữ liệu từ local
function getLocalStorage() {
    var cartItemListJSON = localStorage.getItem("listCart",);
    if (!cartItemListJSON) {
        return;
    }
    var cartListLocal = JSON.parse(cartItemListJSON);
    cartItem = mapData(cartListLocal);
    renderCart(cartItem);
}
//ingput:data local=>output:data mới
function mapData(data) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var curentCart = data[i];
        var copiedCart = new Cart(curentCart.id,
            curentCart.name,
            curentCart.img,
            curentCart.price,
            curentCart.quantity,
        );
        result.push(copiedCart);
    }
    return result;
}

getLocalStorage();