"use strict";

//Prevent spaces in the inputs username, password and confirm password
function preventWhiteSpaces(event) {
    if (event.which === 32) {
        event.preventDefault();
        return false;
    }
}

// When the user clicks on the password field, show the message box
function showMessageBox() {
    document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
function hideMessageBox() {
    document.getElementById("message").style.display = "none";
}

var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

function changeMessageBox(inputId) {
    var passOrPassConf = document.getElementById(inputId).value;

    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (passOrPassConf.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (passOrPassConf.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (passOrPassConf.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate length
    if (passOrPassConf.length >= 8 && passOrPassConf.length <= 12) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
}

//Verify if passwords are equal
function verifyPasswords() {
    if ($('#pass').val() === $('#passConf').val()) {
        $('#passMessage').html('As passwords combinam.').css('color', 'green');
    } else {
        $('#passMessage').html('As passwords não combinam.').css('color', 'red');
    }
}

//Prevents that numbers are inserted in the name
function preventNumbers(event) {
    var keyCode = (event.keyCode ? event.keyCode : event.which);
    if (keyCode > 47 && keyCode < 58) {
        event.preventDefault();
    }
}

//Removes letters from telemóvel and código postal
$("#tel").keyup(function () {
    $("#tel").val(this.value.match(/[0-9]*/));
});

$("#dig4").keyup(function () {
    $("#dig4").val(this.value.match(/[0-9]*/));
});

$("#dig3").keyup(function () {
    $("#dig3").val(this.value.match(/[0-9]*/));
});