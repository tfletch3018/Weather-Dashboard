console.log("Hello World");

let apiKey = "88197090a3d36c7c71da397eb1c27ab6";
let searchBtn = $("searchBtn");
let searchInput = $(".searchInput");

let historyItemsEl = $(".historyItems");
let cityNameEl = $(".cityName");
let currentDateEl = $(".currentDate");
let weatherIconEl = $(".weatherIcon");
let temperatureEl = $(".Temperature");
let humidityEl = $(".Humidity");
let windSpeedEl = $(".Wind Speed");
let uvIndexEl = $(".UV Index")
let cardRow = $(".card-row");


$(document).ready(function () {

    $("#getEnteredCityWeather,#past-searches").on("click", function () {

        let clickEvent = $(event.target)[0];
        let location = "";
        if (clickEvent.id === "getEnteredCityWeather") {
            location = $("#cityEntered").val().trim().toUppercase();
        } else if ( clickEvent.className === ("citylist")) {
            location = clickEvent.innerText;
        }
        if (location == "") return;

        updateLocalStorage(location);
        getCurrentWeather(location);
        getForecastWeather(location);
    });
    console.log("Hello World");
})

function convertDate(UNIXtimestamp) {
    let convertedDate = "";
    let a = new Date(UNIXtimestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    convertedDate = month + ' ' + date + ', '+ year;
    return convertedDate;
  }

  function updateLocalStorage(location) {
    let cityList = JSON.parse(localStorage.getItem("cityList")) || [];
    cityList.push(location); 
    cityList.sort();

    for (let i=1; i<cityList.length; i++) {
        if (cityList[i] === cityList[i-1]) cityList.splice(i,1);
    }
    localStorage.setItem("cityList", JSON.stringify(cityList));

    $("#cityEntered").val("");
 }

 function establishCurrLocation() {
      let location = {};
      function success(position) {
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          success: true
        }
        getCurrentWeather(location);
        getForecastWeather(location);
      }
      function error() {
        location = { success: false }
        return location;
      }
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported');
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      }
    }
console.log("Hello World");
