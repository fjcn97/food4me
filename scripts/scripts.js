"use strict";

//Variables used in more than one function
var cart, cartSplitted, cartInfoArray, displayTotal, item, itemValuesArray, i, totalPrice, favoriteOrders, favoriteOrdersArray, currentUser, row, user, userArray, purchaseItem, purchaseArray, menuPrice, orders, ordersArray, order, address, dig4, dig3, zipCode, pass, passConf, name, username, tel, withoutStrDiscount, withoutStoreStr, withoutDoubleUnderscore, favoriteDrinksFoods, favoriteDrinksFoodsArray, btnMarkAsFavorite, price, allergiesArray, td, button, newData, firstValues, storeArray;
var total = 0;

//To insert the admin, a common user and two stores
function pushToArray(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, typeOfUser) {
    var array = [];
    
    array.push("Test97..");
    array.push(arg1);
    array.push(arg2);
    array.push(arg3);
    array.push(arg4);
    array.push(arg5);
    array.push(arg6);
    array.push(arg7);
    array.push(arg8);
    array.push(arg9);
    
    localStorage.setItem(typeOfUser, array);
}

//Insert admin
pushToArray("Gonçalo Morais Simões", "1997-05-04", "admin@food4me.com", "969225463", "Praceta do Jorge_ 3ºA", "1054", "035", null, "admin", "admin");

//Insert common user
pushToArray("Fábio Jorge Nogueira", "1973-07-12", "fjcn97@gmail.com", "912456789", "Rua das Amoras_ nº 66", "4344", "323", null, "commonUser", "fjcn97");

//Insert store
pushToArray("Restaurante Estrela", "214147874", "Estrada Marquês de Pombal_ nº 31", "3232", "332", null, null, null, "store", "restaurante_estrela");

//Insert store
pushToArray("Tasca 5 Estrelas", "216784344", "Avenida D. João II_ nº 104", "1324", "365", null, null, null, "store", "tasca_5_estrelas");

//To insert types of dishes
localStorage.setItem("types", ["drink Bebida", "meat Carne", "other Outro", "fish Peixe", "dessert Sobremesa", "vegetarian Vegetariano"]);

//To the functions insertAllergy and generateCheckboxes
function verifyIfAllergiesExist() {
    var allergies = localStorage.getItem("allergies");
    
    if (allergies === null) {
        allergiesArray = [];
    } else {
        allergiesArray = allergies.split(',');
    }
}

//Insert allergy. Only the admin can insert allergies
function insertAllergy() {
    var allergy = $('#allergy').val();
    
    if ($.trim(allergy) === '') {
        alert("Introduza a alergia.");
        return false;
    }
    
    verifyIfAllergiesExist();

    //To prevent from adding allergies already in the local storage
    if (allergiesArray.includes(allergy)) {
        alert("Já inseriu essa alergia anteriormente.");
        return false;
    } else {
        allergiesArray.push(allergy);
        localStorage.setItem("allergies", allergiesArray);
    }
}

//When looping the localstorage, prevent the program from crashing after an item with an empty value
function verifyIfExistsValues(item) {
    var itemValues = localStorage.getItem(item);
        
    if (itemValues === null) {
        itemValuesArray = [];
    } else {
        itemValuesArray = itemValues.split(',');
    }
}

for (item in localStorage) {
    verifyIfExistsValues(item);
    
    //The information of those dishes which promotion's deadline is inferior to the actual day will be changed - the discount will be changed to 0%, the price with discount will be equal to the original price and the deadline will be changed to "-"
    // .length !== 1 because the local storage represents the empty value as [""]. So, it has 1 element in it.
    if (item.endsWith("Discount") && itemValuesArray.length !== 1 && itemValuesArray.pop() < moment().format('YYYY-MM-DD')) {
        localStorage.setItem(item, [itemValuesArray[0], itemValuesArray[1], itemValuesArray[2], itemValuesArray[3], 0, itemValuesArray[3], '-']);
    }
}

//Used in more than one function
function verifyIfExistsFavDrinksFoods() {
    if (favoriteDrinksFoods === null) {
        favoriteDrinksFoodsArray = [];
    } else {
        favoriteDrinksFoodsArray = favoriteDrinksFoods.split(',');
    }
}

//To add classes "favoriteDrinksFoods", "favoriteOrders" and "orders" to the 'a' tags
function addClassesToNavItems(itemClassName) {
    var itemClass = localStorage.getItem(itemClassName);
    var itemClassSelector = $('.' + itemClassName);
    
    if (itemClass === null) {
        itemClassSelector.click(function () { return false; });
        itemClassSelector.addClass("disabled");
        itemClassSelector.css("cursor", "default");
    }
}

//Used next and in the function "forPurchaseScheduleFunctions1"
function verifyIfCartIsEmpty() {
    if (cart === null) {
        cartSplitted = [];
    } else {
        cartSplitted = cart.split(',');
    }
}

//Without this line, the buttons don't work
$(document).ready(function () {
    //If favorite drinks / foods don't exist, disable the associated nav item
    addClassesToNavItems("favoriteDrinksFoods");
    
    //If favorite orders don't exist, disable the associated nav item
    addClassesToNavItems("favoriteOrders");
    
    //If orders don't exist, disable the associated nav item
    addClassesToNavItems("orders");
    
    favoriteDrinksFoods = localStorage.getItem("favoriteDrinksFoods");
    verifyIfExistsFavDrinksFoods();
    
    //If a dish or a drink is already a favorite, then the empty star of the column "Adicionar / Remover aos / dos favoritos" associated to that dish or drink will be changed to a filled star
    for (i = 0; i < favoriteDrinksFoodsArray.length; i++) {
        btnMarkAsFavorite = $('img[name=' + favoriteDrinksFoodsArray[i] + ']');
        btnMarkAsFavorite.removeClass('favorite');
        btnMarkAsFavorite.addClass('marked');
        btnMarkAsFavorite.prop("src", "../css/icons8-christmas-star-40.png");
    }
    
    //Add a dish or a drink to the cart
    $('.add').click(function () {
        cart = localStorage.getItem("cart");
        
        verifyIfCartIsEmpty();
        
        cartSplitted.push(this.id);
        localStorage.setItem("cart", cartSplitted);
        window.location.reload();
    });
    
    //Remove a dish or a drink from the cart
    $('.remove').click(function () {
        cart = localStorage.getItem("cart");
        cartSplitted = cart.split(',');
        
        //Removes the element from i-th position
        cartSplitted.splice(cartSplitted.indexOf(this.id), 1);
        
        //After removed, if the cart gets empty, then it must be removed from the local storage
        if (cartSplitted.length === 0) {
            localStorage.removeItem("cart");
        } else {
            localStorage.setItem("cart", cartSplitted);
        }
         window.location.reload();
    });
    
    //Add a dish or a drink to the favorites
    $('.favorite').click(function (event) {
        currentUser = sessionStorage.getItem("currentUser");
        
        //An user not loggedin must login to add the drink or the dish to the favorites
        if (currentUser === null) {
            window.location.href = '../auth/login.html';
        } else {
            verifyIfExistsFavDrinksFoods();
            
            favoriteDrinksFoodsArray.push(this.name);
            localStorage.setItem("favoriteDrinksFoods", favoriteDrinksFoodsArray);

            window.location.reload();
        }
    });
    
    $('.marked').click(function (event) {
        favoriteDrinksFoods = localStorage.getItem("favoriteDrinksFoods");
        favoriteDrinksFoodsArray = favoriteDrinksFoods.split(',');
        
        //Removes the element from i-th position
        favoriteDrinksFoodsArray.splice(favoriteDrinksFoodsArray.indexOf(this.name), 1);
        
        //After removed, if they are no more favorite drinks or dishes, then the item 'favoriteDrinksFoods' must be removed from the local storage
        if (favoriteDrinksFoodsArray.length === 0) {
            localStorage.removeItem("favoriteDrinksFoods");
        } else {
            localStorage.setItem("favoriteDrinksFoods", favoriteDrinksFoodsArray);
        }
        window.location.reload();
    });
    
    $('.inFavoriteOrders').click(function (event) {
        favoriteOrders = localStorage.getItem("favoriteOrders");
        favoriteOrdersArray = favoriteOrders.split(',');
        
        //Removes the element from i-th position
        favoriteOrdersArray.splice(favoriteOrdersArray.indexOf(this.id), 1);
        
        //After removed, if they are no more favorite orders, then the item 'favoriteOrders' must be removed from the local storage
        if (favoriteOrdersArray.length === 0) {
            localStorage.removeItem("favoriteOrders");
        } else {
            localStorage.setItem("favoriteOrders", favoriteOrdersArray);
        }
        window.location.reload();
    });
    
    //Apply discount
    $('.applyDiscount').click(function () {
        localStorage.setItem(this.id + "Discount", []);
    });
});

//Get info about the actual user
function getInfoActualUser() {
    currentUser = sessionStorage.getItem("currentUser");
    user = localStorage.getItem(currentUser);
}

//Verify if any user is loggedin
function verifyIfAnyUserIsLoggedin() {
    if (user === null) {
        userArray = [];
    } else {
        userArray = user.split(',');
    }
}

//To change the nav bar according to the type of user loggedin. Used in the index page
function toIndexPage() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (currentUser !== null && userArray[9] !== "store") {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-light bg-light'><a class='navbar-brand' href='#'>Food4Me</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item active'><a class='nav-link' href='#'>Página Inicial</a></li><li class='nav-item'><a class='nav-link favoriteDrinksFoods' href='favorites/favoriteDrinksFoods.html'>Bebidas / comidas favoritas</a></li><li class='nav-item'><a class='nav-link favoriteOrders' href='favorites/favoriteOrders.html'>Encomendas favoritas</a></li><li class='nav-item'><a class='nav-link orders' href='./order/orders.html'>Histórico de encomendas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    } else if (currentUser !== null && userArray[9] === "store") {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-light bg-light'><a class='navbar-brand' href='#'>Food4Me</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item active'><a class='nav-link' href='#'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
    
    if (userArray[9] === "admin") {
        $('#changeBtns').html("<button class='btn btn-raised' onclick=location.href='insertAllergy.html'><img src='css/icons8-non-lactose-food-filled-17.png'> Inserir alergia</button><button class='btn btn-raised' onclick=location.href='registerStore.html'><img src='css/icons8-small-business-filled-17.png'> Registar loja</button>");
    } else if (userArray[9] === "store") {
        $('#changeBtns').html("<button class='btn btn-raised insertDrinkFoodBtn' onclick=location.href='stores/insertDrinkFood.html';><img src='css/icons8-plus-17.png'> Inserir bebida / comida</button><button class='btn btn-raised insertDiscountBtn' onclick=location.href='stores/insertDiscount.html';><img src='css/icons8-discount-filled-17.png'> Inserir desconto</button>");
        
        firstValues = [];
        
        for (item in localStorage) {
            verifyIfExistsValues(item);
            if (item.startsWith(currentUser) && item.endsWith("Discount")) {
                firstValues.push(itemValuesArray[0]);
            }
        }
        
        if (firstValues.includes("") === false) {
            $('.insertDiscountBtn').prop("disabled", true);
        }
    }
}

//To change the nav bar according to the type of user loggedin. Used in the help page
function toHelpPage() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (currentUser !== null && userArray[9] !== "store") {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-light bg-light'><a class='navbar-brand' href='index.html'>Food4Me</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link favoriteDrinksFoods' href='favorites/favoriteDrinksFoods.html'>Bebidas / comidas favoritas</a></li><li class='nav-item'><a class='nav-link favoriteOrders' href='favorites/favoriteOrders.html'>Encomendas favoritas</a></li><li class='nav-item'><a class='nav-link orders' href='./order/orders.html'>Histórico de encomendas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item active'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    } else if (currentUser !== null && userArray[9] === "store") {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-light bg-light'><a class='navbar-brand' href='index.html'>Food4Me</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item active'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
}

//To the schedule page
function momentDateTimeSchedule() {
    var currentDay = moment().format('YYYY-MM-DD');
    
    $("#date").val(currentDay);
    $("#date").prop("min", currentDay);
}

//To the insertDiscount page. It doesn't make sense to create a discount only valid until the end of the current day. So, I add one more day
function momentDateTimeInsertDiscount() {
    var additionalDay = moment().add(1, 'days').format('YYYY-MM-DD');
    
    $("#promotionDeadline").val(additionalDay);
    $("#promotionDeadline").prop("min", additionalDay);
}

//Used in addToFavoriteOrders and loadFavoriteOrders
function verifyIfExistsFavOrders() {
    if (favoriteOrders === null) {
        favoriteOrdersArray = [];
    } else {
        favoriteOrdersArray = favoriteOrders.split(',');
    }
}

//Add orders to the favorites
function addToFavoriteOrders() {
    cartSplitted = localStorage.getItem("cart").split(',');
    
    favoriteOrders = localStorage.getItem("favoriteOrders");
    
    verifyIfExistsFavOrders();

    var menu = [];
    for (i = 0; i < cartSplitted.length; i++) {
        menu.push(cartSplitted[i]);
    }
    menu = menu.join().replace(',', '__');
    favoriteOrdersArray.push(menu);
    localStorage.setItem("favoriteOrders", favoriteOrdersArray);
    window.location.reload();
}

//To the functions checkRegister and profile
function generateCheckboxes() {
    verifyIfAllergiesExist();

    for (i = 0; i < allergiesArray.length; i++) {
        $('#allergies').append("<label><input type='checkbox' id=" + allergiesArray[i] + " value=" + allergiesArray[i] + " /> " + allergiesArray[i] + " </label><br>");
    }
}

//Alert a loggedin user that is already registered
function checkRegister() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser !== null) {
        alert("Já se encontra registado.");
        window.location.href = '../index.html';
    }
        
    generateCheckboxes();
}


function writeUsersInfo() {
    $('#usersInfo').html("<p><b>admin:</b> " + localStorage.getItem("admin") + "</p><p><b>fjcn97:</b> " + localStorage.getItem("fjcn97") + "</p><p><b>restaurante_estrela:</b> " + localStorage.getItem("restaurante_estrela") + "</p><p><b>tasca_5 _estrelas:</b> " + localStorage.getItem("tasca_5_estrelas") + "</p>");
}

//Redirect a loggedin user to the index page
function checkLogin() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser !== null) {
        window.location.href = '../index.html';
    }
}

//Verify if the loggedin user is the admin. If not, then he's not allowed to view the page. So, this function leaves, automatically, that page and redirects to the initial page
function checkIfItIsAdmin() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (userArray[9] !== "admin") {
        window.location.href = 'index.html';
    }
}

//Get these values from the inputs of a form
function getPassNameAddressValues() {
    pass = $("#pass").val();
    passConf = $("#passConf").val();
    name = $("#name").val();
    address = $("#address").val();
}

//Get these values from the inputs of a form
function getUsernameTelDig4Dig3Values() {
    username = $("#username").val();
    tel = $("#tel").val();
    dig4 = $("#dig4").val();
    dig3 = $("#dig3").val();
}

//Add to array. To the functions register and registerStore
function pushTelAddressDig4Dig3(array) {
    array.push(tel);
    array.push(address.replace(/,/g, "_"));
    array.push(dig4);
    array.push(dig3);
}

//Push to the array of allergies. To the functions register and updateProfile
function pushAllergies() {
    allergiesArray = [];
            
    $('input[type=checkbox]').each(function () {
        if ($(this).is(':checked')) {
            allergiesArray.push($(this).val());
        }
    });
}

//To register a common user
function register() {
    getPassNameAddressValues();
    getUsernameTelDig4Dig3Values();
    
    if (username in localStorage) {
        alert("Este utilizador já existe. Escolha outro nome de utilizador.");
        return false;
    } else if (pass !== passConf) {
        alert("As passwords não combinam.");
        return false;
    } else if ($.trim(name) === '') {
        alert("Introduza o nome completo.");
        return false;
    } else if ($.trim(address) === '') {
        alert("Introduza a sua morada.");
        return false;
    } else {
        if (confirm("Pretende submeter?")) {
            userArray = [];
            
            var dateOfBirth = $("#dateOfBirth").val();
            var email = $("#email").val();
            
            pushAllergies();

            userArray.push(pass);
            userArray.push(name);
            userArray.push(dateOfBirth);
            userArray.push(email);
            userArray.push(tel);
            userArray.push(address.replace(/,/g, "_"));
            userArray.push(dig4);
            userArray.push(dig3);
            userArray.push(allergiesArray.join().replace(',', ' '));
            localStorage.setItem(username, userArray);
            window.location.href = 'login.html';
        } else {
            return false;
        }
    }
}

//To register a store
function registerStore() {
    getPassNameAddressValues();
    getUsernameTelDig4Dig3Values();
    
    if (username in localStorage) {
        alert("Esta loja já existe. Escolha outro nome de 'utilizador'.");
        return false;
    } else if (pass !== passConf) {
        alert("As passwords não combinam.");
        return false;
    } else if ($.trim(name) === '') {
        alert("Introduza o nome da loja.");
        return false;
    } else if ($.trim(address) === '') {
        alert("Introduza a morada.");
        return false;
    } else {
        if (confirm("Pretende submeter?")) {
            storeArray = [];
            storeArray.push(pass);
            storeArray.push(name);
            pushTelAddressDig4Dig3(storeArray);

            for (i = 0; i < 3; i++) {
                storeArray.push(null);
            }
            storeArray.push("store");

            localStorage.setItem(username, storeArray);
            window.location.href = 'auth/login.html';
        } else {
            return false;
        }
    }
}

//To the admin, a common user or a store login
function login() {
    username = $('#username').val();
    pass = $('#pass').val();
    
    user = localStorage.getItem(username);
        
    if (user === null) {
        alert('Utilizador não registado.');
        return false;
    } else {
        userArray = user.split(",");

        if (pass === userArray[0]) {
            sessionStorage.setItem("currentUser", username);
            window.location.href = '../index.html';
        } else {
            alert('Password errada. Introduza-a novamente.');
            return false;
        }
    }
}

//Verify if any user is loggedin and, if not, redirect him to login
//Used in loadFavoriteDrinksFoods
function verifyAndRedirectToLogin() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser === null) {
         window.location.href = '../auth/login.html';
    }
}

//Load the profile of the admin or of a common user
function profile() {
    $('#email').val(userArray[3]);
    $('#tel').val(userArray[4]);
    $('#address').val(userArray[5].replace(/_/g, ','));
    $('#dig4').val(userArray[6]);
    $('#dig3').val(userArray[7]);
    
    if (currentUser === "admin" || currentUser === "fjcn97") {
        $('#email').prop('readonly', true);
        $('#tel').prop('readonly', true);
        $('#address').prop('readonly', true);
        $('#dig4').prop('readonly', true);
        $('#dig3').prop('readonly', true);
        $('#allergies').html("");
        $('#changeProfile').hide();
    } else {
        generateCheckboxes();
        
        var allergiesArrayUser = userArray[8].split(' ');
        
        for (i = 0; i < allergiesArrayUser.length; i++) {
            if (allergiesArrayUser[i] === $('#' + allergiesArrayUser[i]).val()) {
                $('#' + allergiesArrayUser[i]).attr('checked', true);
            }
        }
    }
}

//Update the profile of the admin or of a common user
function updateProfile() {
    newData = [];
    
    newData.push($("#email").val());
    newData.push($("#tel").val());
    newData.push($("#address").val().replace(/,/g, '_'));
    newData.push($("#dig4").val());
    newData.push($("#dig3").val());
    
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    pushAllergies();
    
    userArray[3] = newData[0];
    userArray[4] = newData[1];
    userArray[5] = newData[2];
    userArray[6] = newData[3];
    userArray[7] = newData[4];
    userArray[8] = allergiesArray.join().replace(/,/g, ' ');

    localStorage.setItem(currentUser, userArray);
}

//Load the profile of a store
function profileStore() {
    $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-light bg-light'><a class='navbar-brand' href='index.html'>Food4Me</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item active'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    $('#changeForm').html("<form action='' method='post' onsubmit='return updateProfileStore();'><div class='form-group'><label for='name'>Nome</label><input class = 'form-control' type='text' id='name' placeholder='Telepizza' required></div><div class='form-group'><label for='tel'>Telefone</label><input class = 'form-control' type='text' pattern='.{9}' maxlength='9' placeholder='214147874' id='tel' required></div><div class='form-group'><label for='address'>Morada</label><input class = 'form-control' type='text' id='address' placeholder='Estrada Marquês de Pombal, nº 31' maxlength='64' required></div><div class='form-group'><label for='dig4'>Código postal</label><p><input class = 'form-control' type='text' id='dig4' maxlength='4' placeholder='3222' required> - <input class = 'form-control' type='text' id='dig3' maxlength='3' placeholder='232' required></p></div><button id = 'changeProfile' class='btn btn-raised' type='submit'><img src='css/icons8-edit-account-filled-17.png'> Alterar perfil</button></form>");
    
    if (currentUser === "restaurante_estrela" || currentUser === "tasca_5_estrelas") {
        $('#name').prop("readonly", true);
        $('#tel').prop("readonly", true);
        $('#address').prop("readonly", true);
        $('#dig4').prop("readonly", true);
        $('#dig3').prop("readonly", true);
        $('#changeProfile').hide();
    }
    
    $('#name').val(userArray[1]);
    $('#tel').val(userArray[2]);
    $('#address').val(userArray[3].replace(/_/g, ','));
    $('#dig4').val(userArray[4]);
    $('#dig3').val(userArray[5]);
}

//Update the profile of a store
function updateProfileStore() {
    newData = [];
    
    newData.push($("#name").val());
    newData.push($("#tel").val());
    newData.push($("#address").val().replace(/,/g, '_'));
    newData.push($("#dig4").val());
    newData.push($("#dig3").val());
    
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    userArray[1] = newData[0];
    userArray[2] = newData[1];
    userArray[3] = newData[2];
    userArray[4] = newData[3];
    userArray[5] = newData[4];

    localStorage.setItem(currentUser, userArray);
}

//To an user logout
function logout() {
    localStorage.removeItem("cart");
    sessionStorage.removeItem("currentUser");
    
    window.location.reload();
}

// An user that's not loggedin or that's not a store can't insert drinks, dishes or discounts
function verifyIfItsNotLoggedinNotStore() {
    if (user === null || userArray[9] !== "store") {
        window.location.href = 'index.html';
    }
}

//To the stores choose the type of the food that is to be added to the local storage
function loadTypes() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    verifyIfItsNotLoggedinNotStore();
    
    var typesArray, typeDesignations;
    if ("types" in localStorage) {
        typesArray = localStorage.getItem("types").split(',');
        for (i = 0; i < typesArray.length; i++) {
            typeDesignations = typesArray[i].split(' ');
            $('#types').append("<option value=" + typeDesignations[0] + ">" + typeDesignations[1] + "</option>");
        }
    }
}

//To the stores insert drinks or dishes
function insertDrinkFood() {
    name = $('#name').val();
    
    var drinkFoodArray = [];
    
    var type = $('#types').val();
    drinkFoodArray.push(type);
    
    drinkFoodArray.push(name);
    
    if ($.trim(name) === '') {
        alert("Introduza o nome.");
        return false;
    }
    
    //current store
    currentUser = sessionStorage.getItem("currentUser");
    
    name = name.replace(/ /g, "_");
    var storeDrinkFoodName = currentUser + '_' + name;
    
    //To prevent from adding drinks or dishes already in the local storage
    if (storeDrinkFoodName in localStorage || (storeDrinkFoodName + "Discount") in localStorage) {
        alert("Já inseriu essa bebida / comida anteriormente.");
        return false;
    }
    
    price = $('#price').val();
    
    storeArray = localStorage.getItem(currentUser).split(',');
    drinkFoodArray.push(storeArray[1]);
    
    drinkFoodArray.push(price);
    drinkFoodArray.push(0);
    drinkFoodArray.push(price);
    drinkFoodArray.push('-');
    
    localStorage.setItem(storeDrinkFoodName, drinkFoodArray);

    window.location.href = '../index.html';
}

//To the stores insert discounts in their drinks or dishes. This function is needed for the "Inserir desconto" / 'insertDiscount' page
function loadDishesToDiscounts() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    verifyIfItsNotLoggedinNotStore();
    
    firstValues = [];
    
    for (item in localStorage) {
        verifyIfExistsValues(item);
        
        //To, only, appear the dishes to which, previously, a discount was applied, the dishes which item's name starts with the username of the actual loggedin store and the dishes that still don't have any value
        if (item.endsWith("Discount") && item.startsWith(currentUser)) {
            firstValues.push(itemValuesArray[0]);
            
            if (itemValuesArray.length === 1) {
                //To remove the term Discount from the dishes name
                withoutStrDiscount = item.replace("Discount", '');

                //To remove the actual loggedin store's username from the dishes name
                withoutStoreStr = withoutStrDiscount.replace(currentUser, '');

                $('#dishes').append("<option value=" + item + ">" + withoutStoreStr.replace(/_/g, ' ') + "</option>");
            }
        }
    }
    
    if (firstValues.includes("") === false) {
        window.location.href = "../index.html";
    }
}

//To insert a discount to the drinks and dishes
function insertDiscount() {
    var discountArray = [];
    
    var drinkFood = $('#dishes').val();
    var discount = $('#discount').val();
    var promotionDeadline = $('#promotionDeadline').val();
    
    var dish, dishInfo, originalPrice;
    
    //Remove the term Discount to get the info of the original drink or food
    dish = drinkFood.replace("Discount", '');
    dishInfo = localStorage.getItem(dish).split(',');
    
    originalPrice = dishInfo[3];
    
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    discountArray.push(dishInfo[0]);
    
    withoutStoreStr = dish.replace(currentUser, '');
    discountArray.push(withoutStoreStr.replace(/_/g, ' '));

    discountArray.push(userArray[1]);

    discountArray.push(originalPrice);
    discountArray.push(discount);
    
    //To change the price after given the discount
    price = originalPrice - originalPrice * (discount / 100);
    //To round it to 2 decimal places
    price = +(Math.round(price + "e+" + 2)  + "e-" + 2);
    discountArray.push(price);

    discountArray.push(promotionDeadline);
    
    localStorage.removeItem(dish);
    localStorage.setItem(drinkFood, discountArray);

    window.location.href = 'index.html';
}

function formatDate(value) {
    if (value === '-') {
        $(row).append("<td class='text-right'>" + value + "</td>");
    } else {
        $(row).append("<td class='text-right'>" + new Date(value).toLocaleDateString("pt-PT") + "</td>");
    }
}

//For each row, add one value to each column of a table. Each value is a "thing" about the item. For example, the item's name
function appendToTable(table, array) {
    $(row).append("<td class='text-left'>" + array[1] + "</td>");
    $(row).append("<td class='text-left'>" + array[2] + "</td>");
    $(row).append("<td class='text-right'>" + array[3] + "</td>");
    $(row).append("<td class='text-right'>" + array[4] + "</td>");
    $(row).append("<td class='text-right'>" + array[5] + "</td>");
    
    //Convert the promotion's deadline to date. Format this date to portuguese.
    formatDate(array[6]);
    
    table.appendChild(row);
}

//To load discounts in the table of discounts
function loadDiscounts() {
    var tableDiscounts = document.getElementById('tableDiscounts');
    
    getInfoActualUser();
    
    for (item in localStorage) {
        verifyIfExistsValues(item);
        
        // .length !== 1 because the local storage represents the empty value as [""]. So, it has 1 element in it. Doesn't make sense show drinks or dishes with an "undefined discount"
        if (item.endsWith("Discount") && itemValuesArray.length !== 1) {
            verifyIfAnyUserIsLoggedin();
            row = document.createElement("tr");
            if (userArray.pop() === "store") {
                if (item.startsWith(currentUser)) {
                    //Show one line per discount in the table
                    appendToTable(tableDiscounts, itemValuesArray);
                }
            } else {
                appendToTable(tableDiscounts, itemValuesArray);
            }
        }
    }
}

//Used in the function loadDishes
function createButtons(buttonText, btnType, classTag, idOrName) {
    td = document.createElement("td");
    td.setAttribute("class", "text-center");
    row.appendChild(td);
    button = document.createElement("button");
    button.innerHTML = buttonText;
    button.setAttribute("class", "btn btn-raised " + btnType + " " + classTag);
    button.setAttribute(idOrName, item);
    td.appendChild(button); 
}

//In general, if meat dishes don't exist, then there is nothing to see in the meatDishes page. So, redirect to the index page (the same for the other cases). For the stores, if, for example, tasca_5_estrelas has already inserted a drink, but restaurante_estrela not inserted a drink yet, then, if this last store types the link of the drinks page, then it will be redirected to the index page, because it doesn't have drinks yet.
function alertDishesDontExist(dishType, drinksMsg, meatDishesMsg, othersMsg, fishDishesMsg, dessertsMsg, vegetarianDishesMsg) {
    if (firstValues.includes(dishType) === false) {
        if (dishType === "drink") {
            alert(drinksMsg);
            window.location.href = '../index.html';
        } else if (dishType === "meat") {
            alert(meatDishesMsg);
            window.location.href = '../index.html';
        } else if (dishType === "other") {
            alert(othersMsg);
            window.location.href = '../index.html';
        } else if (dishType === "fish") {
            alert(fishDishesMsg);
            window.location.href = '../index.html';
        } else if (dishType === "dessert") {
            alert(dessertsMsg);
            window.location.href = '../index.html';
        } else if (dishType === "vegetarian") {
            alert(vegetarianDishesMsg);
            window.location.href = '../index.html';
        }
    }
}

//Load tables of dishes
function loadDishes(tableDishes, dishType) {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();

    //List of first values of each item
    firstValues = [];
    
    tableDishes = document.getElementById(tableDishes);
    
    //The user is authenticated, but it's not a store
    if (currentUser !== null && userArray[9] !== "store") {
       $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-light bg-light'><a class='navbar-brand' href='../index.html'>Food4Me</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='../index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link favoriteDrinksFoods' href='../favorites/favoriteDrinksFoods.html'>Bebidas / comidas favoritas</a></li><li class='nav-item'><a class='nav-link favoriteOrders' href='../favorites/favoriteOrders.html'>Encomendas favoritas</a></li><li class='nav-item'><a class='nav-link orders' href='../order/orders.html'>Histórico de encomendas</a></li><li class='nav-item'><a class='nav-link' href='../profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='../help.html'>Ajuda</a></li></ul></div></nav>");
    } else if (currentUser !== null && userArray[9] === "store") {
       $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-light bg-light'><a class='navbar-brand' href='../index.html'>Food4Me</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='../index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='../profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='../help.html'>Ajuda</a></li></ul></div></nav>");
    }
    
    for (item in localStorage) {
        verifyIfExistsValues(item);
        
        if (itemValuesArray[0] === dishType) {
            row = document.createElement("tr");
            if (userArray[9] === "store") {
                $('#changeTHead').html("<th>Aplicar desconto</th><th>Nome</th><th>Loja</th><th>Preço original (€)</th><th>Desconto (%)</th><th>Preço com desconto (€)</th><th>Validade da promoção (DD/MM/AAAA) [inclusive]</th>");
                if (item.startsWith(currentUser)) {
                    firstValues.push(itemValuesArray[0]);
                    
                    //Add button to apply discount to the associated drink or dish. It is only visible to the stores
                    createButtons("<img src='../css/icons8-discount-filled-17.png'> Aplicar", '', "applyDiscount", "id");
                    appendToTable(tableDishes, itemValuesArray);
                    
                    //If a drink or a dish is already with a discount, then the button "Aplicar" is disabled
                    if (item.endsWith("Discount")) {
                        button.setAttribute("disabled", true);
                    }     
                }
            } else {
                firstValues.push(itemValuesArray[0]);
                
                //Add button to mark a drink or a dish as favorite. It is not visible to the stores
                td = document.createElement("td");
                td.setAttribute("class", "text-center");
                row.appendChild(td);
                var img = document.createElement("img");
                img.setAttribute("src", "../css/icons8-christmas-star-35.png");
                img.setAttribute("class", "favorite");
                img.setAttribute("name", item);
                td.appendChild(img);
                
                //Add button to add a drink or a dish to the cart. It is not visible to the stores
                createButtons("<img src='../css/icons8-add-shopping-cart-filled-17.png'> Adicionar", '', "add", "id");
                appendToTable(tableDishes, itemValuesArray);
            } 
        }
    }
    
    if (userArray[9] !== "store") {
        alertDishesDontExist(dishType, "Ainda não existem bebidas. As lojas deverão adicioná-las.", "Ainda não existem pratos de carne. As lojas deverão adicioná-los.", "Ainda não existem outros comeres. As lojas deverão adicioná-los.", "Ainda não existem pratos de peixe. As lojas deverão adicioná-los.", "Ainda não existem sobremesas. As lojas deverão adicioná-las.", "Ainda não existem pratos vegetarianos. As lojas deverão adicioná-los.");
    } else {
        alertDishesDontExist(dishType, "Deverá adicionar bebidas.", "Deverá adicionar pratos de carne.", "Deverá adicionar outros pratos.", "Deverá adicionar pratos de peixe.", "Deverá adicionar sobremesas.", "Deverá adicionar pratos vegetarianos.");
    }
}

//Load table of fish dishes
function loadFishDishes() {
    loadDishes("tableFishDishes", "fish");
    
    //If no one is loggedin, then we can't see if anyone has allergies.
    if (user === null) {
        allergiesArray = [];
    } else {
        allergiesArray = userArray[8].split(" ");
    }
    
    for (i = allergiesArray.length - 1; i >= 0; i--) {
        if (allergiesArray[i] === "Peixe") {
            alert("Tem alergia a peixe.");
            window.location.href = '../index.html';
        }
    }
}

//Load table of favorite drinks and foods
function loadFavoriteDrinksFoods() {
    verifyAndRedirectToLogin();

    favoriteDrinksFoods = localStorage.getItem("favoriteDrinksFoods");
    
    verifyIfExistsFavDrinksFoods();
    
    var tableFavoriteDrinksFoods = document.getElementById('tableFavoriteDrinksFoods');
    var favoriteDrinksFoodsInfoArray, removeFromFavorites, btnRemoveFromFavorites;
    
    if (favoriteDrinksFoods === null) {
        alert("Não possui bebidas / comidas favoritas.");
        window.location.href = '../index.html';
    } else {
        for (i = 0; i < favoriteDrinksFoodsArray.length; i++) {
            item = favoriteDrinksFoodsArray[i];

            row = document.createElement("tr");

            //Add button to remove a drink or a dish from the favorites
            createButtons("<img src='../css/icons8-trash-can-filled-17.png'> Remover", "btn-danger", "marked", "name");
            favoriteDrinksFoodsInfoArray = localStorage.getItem(item).split(',');

            $(row).append("<td>" + favoriteDrinksFoodsInfoArray[1] + "</td>");
            $(row).append("<td>" + favoriteDrinksFoodsInfoArray[2] + "</td>");
            tableFavoriteDrinksFoods.appendChild(row);
        }  
    }
}

//To remove the term Discount and the underscores in the item's name
function removeStrDiscountUnderscore(item) {
    withoutStrDiscount = item.replace(/Discount/g, '');
    withoutDoubleUnderscore = withoutStrDiscount.replace(/__/g, ', ');
    return withoutDoubleUnderscore.replace(/_/g, ' ');
}

//Load table of favorite orders
function loadFavoriteOrders() {
    verifyAndRedirectToLogin();
    
    favoriteOrders = localStorage.getItem("favoriteOrders");
    
    verifyIfExistsFavOrders();

    var tableFavoriteOrders = document.getElementById('tableFavoriteOrders');
    var removeFromFavorites, btnRemoveFromFavorites;
    
    if (favoriteOrders === null) {
        alert("Não possui encomendas favoritas.");
        window.location.href = '../index.html';
    } else {
       for (i = 0; i < favoriteOrdersArray.length; i++) {
            item = favoriteOrdersArray[i];
            itemValuesArray = item.split(' ');

            row = document.createElement("tr");

            //Add button to remove an order from the favorites
            createButtons("<img src='../css/icons8-trash-can-filled-17.png'> Remover", "btn-danger", "inFavoriteOrders", "id");

            $(row).append("<td>" + removeStrDiscountUnderscore(itemValuesArray.join()) + "</td>");

            tableFavoriteOrders.appendChild(row);
        } 
    }
}

//Used in the functions loadOrders and forPurchaseScheduleFunctions1
function verifyIfExistsAnyOrder() {
    if (orders === null) {
        ordersArray = [];
    } else {
        ordersArray = orders.split(",");
    }
}

//Load table of orders
function loadOrders() {
    verifyAndRedirectToLogin();
    
    orders = localStorage.getItem("orders");
    
    verifyIfExistsAnyOrder();
    
    var tableOrders = document.getElementById('tableOrders');
    
    if (orders === null) {
        alert("Ainda não efetuou encomendas.");
        window.location.href = '../index.html';
    } else {
        for (i = 0; i < ordersArray.length; i++) {
            item = ordersArray[i];
            itemValuesArray = item.split(' ');

            row = document.createElement("tr");

            $(row).append("<td>" + removeStrDiscountUnderscore(itemValuesArray[0]) + "</td>");
            
            //Convert the date of the schedule to date. Format this date to portuguese.
            formatDate(itemValuesArray[1]);
            
            $(row).append("<td class='text-right'>" + itemValuesArray[2] + "</td>");
            $(row).append("<td>" + removeStrDiscountUnderscore(itemValuesArray[3]) + "</td>");
            $(row).append("<td>" + itemValuesArray[4] + "</td>");
            $(row).append("<td class='text-right'>" + itemValuesArray[5] + "</td>");

            tableOrders.appendChild(row);
        }
    }
}

//Load items of the cart in a table
function loadCart() {
    verifyAndRedirectToLogin();
    
    cart = localStorage.getItem("cart");
    
    if (cart === null) {
        alert("Primeiro, tem de adicionar algo ao carrinho!");
        window.location.href = '../index.html';
    }
    
    cartSplitted = cart.split(",");

    displayTotal = document.getElementById('total');
    
    var tableCart = document.getElementById('tableCart');
    var removeFromCart, btnRemoveFromCart;
    
    for (i = 0; i < cartSplitted.length; i++) {
        item = cartSplitted[i];

        row = document.createElement("tr");
        
        //Add button to remove a drink or a dish from the cart
        createButtons("<img src='../css/icons8-trash-can-filled-17.png'> Remover", "btn-danger", "remove", "id");
        cartInfoArray = localStorage.getItem(item).split(',');

        appendToTable(tableCart, cartInfoArray);

        total += Number(cartInfoArray[5]);
    }
    //To round to 2 decimal places
    total = +(Math.round(total + "e+" + 2) + "e-" + 2);
    
    displayTotal.value = total;
    localStorage.setItem("totalPrice", total);
}

//To empty the cart
function cancelOrder() {
    localStorage.removeItem("total");
    localStorage.removeItem("cart");
    location.assign("../index.html");
}

//Load address in Schedule Order page
function loadAddress() {
    verifyAndRedirectToLogin();
    
    userArray = localStorage.getItem(currentUser).split(',');
    
    $('#address').val(userArray[5].replace(/_/g, ','));
    $('#dig4').val(userArray[6]);
    $('#dig3').val(userArray[7]);
}

//To not have duplicated code...
function forPurchaseScheduleFunctions1() {
    dig4 = $('#dig4').val();
    dig3 = $('#dig3').val();
    zipCode = dig4 + "-" + dig3;

    cart = localStorage.getItem("cart");

    verifyIfCartIsEmpty();

    totalPrice = localStorage.getItem("totalPrice");

    cartSplitted.push(totalPrice);

    localStorage.removeItem("totalPrice");
    localStorage.removeItem("cart");
    localStorage.setItem("purchase",cartSplitted);

    orders = localStorage.getItem("orders");

    verifyIfExistsAnyOrder();

    purchaseItem = localStorage.getItem("purchase");

    if (purchaseItem === null) {
        purchaseArray = [];
    } else {
        purchaseArray = purchaseItem.split(',');
    }

    menuPrice = purchaseArray.pop();
    order = purchaseArray.join().replace(/,/g, "__");

    address = address.replace(/ /g, "_");
    address = address.replace(/,/g, "__");
}

//To not have duplicated code...
function forPurchaseScheduleFunctions2(payDate, message) {
    ordersArray.push(order);

    localStorage.setItem("orders", ordersArray);

    alert(message);
    if (payDate === "payNow") {
        location.assign("claimCheck.html"); 
    } else {
        location.assign("../index.html"); 
    }
}
    
//To receive the order as soon as possible
function purchase(payDate) {
    address = $('#address').val();
    
    if ($.trim(address) === '') {
        alert("Introduza a morada.");
        return false;
    } else {
        if (confirm("Pretende submeter?")) {
            forPurchaseScheduleFunctions1();

            order += " - - " + address + " " + zipCode + " " + menuPrice;
            forPurchaseScheduleFunctions2(payDate, "A encomenda será entregue o mais cedo possível.");
        }
    }
}

//To receive the order at the day and hour indicated
function schedule(payDate) {
    address = $('#address').val();
    
    if ($.trim(address) === '') {
        alert("Introduza a morada.");
        return false;
    } else {
        if (confirm("Pretende submeter?")) {
            var date = $('#date').val();
            var time = $('#time').val();
            
            forPurchaseScheduleFunctions1();

            order += " " + date + " " + time + " " + address + " " + zipCode + " " + menuPrice;
            forPurchaseScheduleFunctions2(payDate, "A encomenda será entregue na data e hora indicadas!");
        }
    }
}

//If the user pays the order immediately after he made it, then he receives the claim check
function claimCheck() {
    purchaseItem = localStorage.getItem("purchase");
    purchaseArray = purchaseItem.split(",");
    
    displayTotal = document.getElementById('total');
    var tableClaimCheck = document.getElementById('tableClaimCheck');
    
    for (i = 0; i < purchaseArray.length - 1; i++) {
        item = purchaseArray[i];

        row = document.createElement("tr");

        cartInfoArray = localStorage.getItem(item).split(',');

        $(row).append("<td>" + cartInfoArray[1] + "</td>");
        $(row).append("<td>" + cartInfoArray[2] + "</td>");
        $(row).append("<td class='text-right'>" + cartInfoArray[5] + "</td>");

        tableClaimCheck.appendChild(row);
    }
    displayTotal.value = purchaseArray.pop();
}

//If the admin or a common user have allergy to, for example, fish, then, in this case, disable the "VER PRATOS DE PEIXE" button
function disableBtnsByAllergies() {
    getInfoActualUser();
    
    if (user === null) {
        userArray = [];
    } else {
        userArray = user.split(',');
        allergiesArray = userArray[8].split(" ");

        for (i = allergiesArray.length - 1; i >= 0; i--) {
            if (allergiesArray[i] === "Peixe") {
                $('.fish').prop("disabled",true);
            }
        }
    }
}

//If meat dishes don't exist, then disable "VER PRATOS DE CARNE" button (the same for the other cases).
function disableSeeDishesBtns() {
    if (firstValues.includes("drink") === false) {
        $('.drink').prop("disabled", true);
    }

    if (firstValues.includes("meat") === false) {
        $('.meat').prop("disabled", true);
    }
    
    if (firstValues.includes("other") === false) {
        $('.other').prop("disabled", true);
    }
    
    if (firstValues.includes("fish") === false) {
        $('.fish').prop("disabled", true);
    }

    if (firstValues.includes("dessert") === false) {
        $('.dessert').prop("disabled", true);
    }

    if (firstValues.includes("vegetarian") === false) {
        $('.vegetarian').prop("disabled", true);
    }
}

//In general, if meat dishes don't exist, then disable "VER PRATOS DE CARNE" button (the same for the other cases). For the stores, if, for example, tasca_5_estrelas has already inserted a drink, but restaurante_estrela not yet inserted a drink, then, for this last store, the button "VER BEBIDAS" must be disabled.
function disableSeeDishesBtnsUser() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    //List of first values of each item
    firstValues = [];
    
    if (userArray[9] !== "store") {
        for (item in localStorage) {
            verifyIfExistsValues(item);
            firstValues.push(itemValuesArray[0]);
        }  
    } else {
        for (item in localStorage) {
            verifyIfExistsValues(item);
            if (item.startsWith(currentUser)) {
                firstValues.push(itemValuesArray[0]);
            }
        }
    }
    disableSeeDishesBtns();
}

//If it's a store, then hide cart button
//If the cart is still empty, then disable cart button
function disableCartBtn() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (userArray[9] === "store") {
        $('#cartBtn').hide();
    }
    
    cart = localStorage.getItem('cart');
    
    if (cart === null) {
        $('#cartBtn').prop("disabled", true);
    }
}