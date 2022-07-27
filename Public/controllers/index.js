var productList = [];
var contentHTMLBtn = document.getElementsByClassName("btn-add");

function getListProducts(a="") {
    //pending
    // getEle("loading").style.display = "block";
    // // Promise:
    //             -pending (chờ)
    //             -Resolve (thành công)
    //             -Reject (thất bại)

    axios({
        url: "https://62c2af23ff594c6567624e08.mockapi.io/api/products/",
        method: "GET",
    })
        .then(function (result) {
            // getEle("loading").style.display = "none";
            console.log(a);
            if(a===""){
                productList = result.data
            }
            for (const item of result.data) {
                if(item.type===a){
                    productList.push(item);
                }
            }
            console.log(productList);
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
        // if (type === data[i].type||type===undefined) {
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
                        <button onclick="addCart(${data[i].id})" class="add-btn btn btn-dark">Add
                            <i class="fa-solid fa-angles-right"></i></button>
                    </div>
                </span>
            </div>
        </div>
    </div>
        `
        // }
        
    }
    setTimeout(getAddBtn, 0);
    document.getElementById("banner").innerHTML = contentHTML;

}
function ListChanged(a) {
    productList.splice(0, productList.length);
    getListProducts(a.value);
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

function addCart(id) {
   
        var index = finById(productList, id);
        var cartName = document.getElementsByClassName("product-name")[index].innerText;
        var cartImg = document.getElementsByClassName("product-img")[index].src;
        var cartPrice = +document.getElementsByClassName("product-price")[index].innerText.replace("$ ", "");
        var cartQuantity = 1;
        var cart = new Cart(id, cartName, cartImg, cartPrice, cartQuantity);
        cartItem.push(cart);
        var e = contentHTMLBtn[index].innerHTML =
            showAmount(cartQuantity, id, cartQuantity);
        saveLocalstorage();
        renderCart(cartItem);

}
function qtyChange(id, status) {
    var index = finById(productList, id)
    for (var i = 0; i < cartItem.length; i++) {
        if (cartItem[i].id === id) {
            if (status === "sub") {
                cartItem[i].quantity -= 1;
                if(index>=0){
                    contentHTMLBtn[index].innerHTML = showAmount(cartItem[i].quantity, id, cartItem[i].quantity);
                }
                if (cartItem[i].quantity < 1) {
                    cartItem.splice(i,1);
                }
            } else if (status === "add") {
                // addCart(cartItem[i].id);
                if(cartItem[i].quantity>=10){
                    alert("Không mua vược quá sl 10");
                    return;
                }
                cartItem[i].quantity += 1;
                if(index>=0){
                    
                    contentHTMLBtn[index].innerHTML = showAmount(cartItem[i].quantity, id, cartItem[i].quantity);
                }
            }
            saveLocalstorage();
            renderCart(cartItem);
        }
    }
    
}
function buy(e) {
    if (e === 1) {
        var t = document.getElementsByClassName("side-nav")[0].style.display = "none";
        var o = document.getElementsByClassName("order-now")[0].style.display = "block";
        document.getElementById
        sideNav(0);
        renderbuy(cartItem);
        return;
    }
    o = document.getElementsByClassName("order-now")[0].style.display = "none";
    document.getElementsByClassName("side-nav")[0].style.display = "block";
    sideNav(1);
    renderbuy(cartItem);



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
    <button onclick="reload()" class="btn-ok">okay</button>
    </div>
  </div>`;

}
function reload() {
    alert("đơn hàng của bạn đã được duyệt")
    clearCart();
    location.reload();

}
function clearCart() {
    cartItem.splice(0, cartItem.length);
    for (var i = 0; i < productList.length; i++) {
        var index = finById(cartItem, +productList[i].id);
        contentHTMLBtn[i].innerHTML
            = showAmount(-1, productList[i].id, "");
    }
    sideNav(0);
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
    // var contentHTMLlistBuy = "";
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

}
function renderbuy(data) {
    var contentHTMLlistBuy = "";
    var amount = 0;
    for (var i = 0; i < data.length; i++) {
        amount += data[i].quantity;
        contentHTMLlistBuy += `<div class="shipping-items">
        <div class="items-name"><span>${data[i].name}</span></div>
        <div class="items-img"><img src="${data[i].img}" alt=""></div>
        <div class="items-amount"><span>${data[i].quantity}</span></div>
        <div class="items-price"><span>${(data[i].price * data[i].quantity)} </span></div>
        </div>`
    }

    document.getElementById("listBuyProduct").innerHTML = contentHTMLlistBuy;
    document.getElementsByClassName("payment")[0].innerHTML = `<em>payment</em>
    <div>
        <p>total amount to be paid:</p><span class="pay">$ ${total}</span>
    </div>`;
    console.log(contentHTMLlistBuy);
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
// setTimeout(getAddBtn, 1000);

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
