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
            renderProducts(result.data);
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
            <tr>
                <td>${i + 1}</td>
                <td>${data[i].name}</td>
                <td>${data[i].price}</td>
                <td>
                    <img  src="${productImg}" alt="${data[i].name}">
                </td>
                <td>${data[i].desc},<br>${data[i].screen},<br>${data[i].backCamera},
                <br>${data[i].frontCamera} </td>
                <td>${data[i].type}</td>
                <td>${data[i].quantity}</td>
                <td >
                    <div class="btnAction">
                        <button onclick="deleteProduct('${data[i].id}')" class="btn  btn-danger ">Xóa</button>
                        <button onclick="getProduct('${data[i].id}')" class="btn btn-info ">Sửa</button>
                    </div>
                </td>
            </tr>
        `
    }
    document.getElementById("tblDanhSachSP").innerHTML = contentHTML;

}
function createProduct() {
    var isValid=validateForm();
    if(!isValid)return;
    var prodName = document.getElementById("name").value;
    var prodPrice = document.getElementById("price").value;
    var prodImg = document.getElementById("img").value;
    var prodDesc = document.getElementById("desc").value;
    var prodBackCam = document.getElementById("backCamera").value;
    var prodFrontCam = document.getElementById("frontCamera").value;
    var prodType = document.getElementById("type").value;
    var prodQuantity = document.getElementById("quantity").value;
    var proScreen = document.getElementById("screen").value;
    var product = new Product(prodName, prodImg, prodPrice, proScreen,
        prodBackCam, prodFrontCam,
        prodDesc, prodType, prodQuantity);

    axios({
        url: "https://62c2af23ff594c6567624e08.mockapi.io/api/products",
        method: "POST",
        data: product,
        //GET POST PATCH PUT (Restful API)
    })
        .then(function (res) {
            getListProducts();
            document.getElementById("btnCloseModal").click();
        })
        .catch(function (err) {
            console.log(err);
        })
}
function deleteProduct(id) {
    console.log(id);
    axios({
        url: "https://62c2af23ff594c6567624e08.mockapi.io/api/products/" + id,
        method: "DELETE",

        //GET POST PATCH PUT (Restful API)
    })
        .then(function (res) {
            alert("Xóa thành công");
            getListProducts();
        })
        .catch(function (err) {
            alert("ngu");
            console.log(err);
        })
}
function getProduct(id) {
    axios({
        url: "https://62c2af23ff594c6567624e08.mockapi.io/api/products/" + id,
        method: "GET",

        //GET POST PATCH PUT (Restful API)
    })
        .then(function (res) {
            document.getElementById("btnThemSP").click();
            document.getElementById("id").value = res.data.id
            document.getElementById("name").value = res.data.name;
            document.getElementById("price").value = res.data.price;
            document.getElementById("img").value = res.data.img;
            document.getElementById("desc").value = res.data.desc;
            document.getElementById("quantity").value = res.data.quantity;
            var op = document.getElementById("type");
            for (var i = 0; i < op.length; i++) {
                if (op.options[i].value === res.data.type) {
                    document.getElementById(`${i}`).setAttribute("selected", "selected");
                }
            }
            document.getElementById("backCamera").value = res.data.backCamera;
            document.getElementById("frontCamera").value = res.data.frontCamera;
            document.getElementById("screen").value = res.data.screen;

            document.getElementById("btnSaveInfo").style.display = "none";
            document.getElementById("btnUpdate").style.display = "block";
        })
        .catch(function (err) {
            console.log(err);
        })
}

function updateProduct() {
    var prodId = document.getElementById("id").value;
    var prodName = document.getElementById("name").value;
    var prodPrice = document.getElementById("price").value;
    var prodImg = document.getElementById("img").value;
    var prodDesc = document.getElementById("desc").value;
    var prodBackCam = document.getElementById("backCamera").value;
    var prodFrontCam = document.getElementById("frontCamera").value;
    var prodType = document.getElementById("type").value;
    var prodQuantity = document.getElementById("quantity").value;
    var proScreen = document.getElementById("screen").value;
    var product = new Product(prodName, prodImg, prodPrice, proScreen,
        prodBackCam, prodFrontCam,
        prodDesc, prodType, prodQuantity);

    axios({
        url: "https://62c2af23ff594c6567624e08.mockapi.io/api/products/" + prodId,
        method: "PUT",
        data: product,
        //GET POST PATCH PUT (Restful API)
    })
        .then(function (res) {
            getListProducts();
            document.getElementById("btnSaveInfo").style.display = "block";
            document.getElementById("btnUpdate").style.display = "none";
        })
        .catch(function (err) {
            console.log(err);
        })
}
function searchStudents() {
    //lấy keywork từ input
    console.log("hello");

    axios({
        url: "https://62c2af23ff594c6567624e08.mockapi.io/api/products",
        method: "GET",
    })
        .then(function (res) {
            var keywork = document.getElementById("txtSearch").value.toLowerCase().trim();
            var results = [];
            console.log(res.data.length);
            for (var i = 0; i < res.data.length; i++) {
                var curentProduct = res.data[i];
                if (curentProduct.type === keywork || curentProduct.name.toLowerCase().includes(keywork)) {
                    results.push(curentProduct);
                }
            }
            console.log(results);
            renderProducts(results);
        })
        .catch(function (error) {
            console.log(error);
        })

}

function validateForm() {
    var isValid = true;
    var prodName = document.getElementById("name").value;
    var prodPrice = document.getElementById("price").value;
    var prodImg = document.getElementById("img").value;
    var prodDesc = document.getElementById("desc").value;
    var prodBackCam = document.getElementById("backCamera").value;
    var prodFrontCam = document.getElementById("frontCamera").value;
    var prodType = document.getElementById("type").value;
    var prodQuantity = document.getElementById("quantity").value;
    var prodScreen = document.getElementById("screen").value;

    isValid &=checkRequired(prodName,"spanName");
    isValid &=checkRequired(prodPrice,"spanPrice")&&checkNumber(prodPrice,"spanPrice");
    isValid &=checkRequired(prodQuantity,"spanQuantity")&&checkNumber(prodQuantity,"spanQuantity");
    isValid &=checkRequired(prodImg,"spanImg")&&checkImg(prodImg,"spanImg");
    isValid &=checkRequired(prodDesc,"spandesc")&&checkRequired(prodBackCam,"spandesc")
    &&checkRequired(prodFrontCam,"spandesc")&&checkRequired(prodScreen,"spandesc");
    
    return isValid;
}
function checkRequired(val, spanId) {
    if (val.length > 0) {
        document.getElementById(spanId).innerHTML = "";
        return true;
    }
    document.getElementById(spanId).innerHTML = "ô này bắt buộc nhập";
    return false;
}
function checkNumber(val ,spanId){
    var letter = /^[0-9]+$/;
    if (val.match(letter)) {
        document.getElementById(spanId).innerHTML = "";
        return true;
    }
    document.getElementById(spanId).innerHTML = "Vui Lòng Nhập Số ";
    return false;
}
function checkImg(val ,spanId){
    if(val.toLowerCase().includes(".jpg")||val.toLowerCase().includes(".jng")){
        document.getElementById(spanId).innerHTML = "";
        return true;
    }
    document.getElementById(spanId).innerHTML = "Vui Lòng Nhập Đúng định dạng <br /> VD:aa.jpg hoặc aa.jng ";
    return false;
}
var arr={
    name:"adasds.jpg"
}
console.log(arr.name.toLowerCase().includes(".jpg"))
