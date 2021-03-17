console.log("Hello World");

var apiKey = "88197090a3d36c7c71da397eb1c27ab6";
console.log = ("Hello World");

$(document).ready(function () {
    $('#getTargetCityWeather,#previous').on('click', function () {
          let clickEvent = $(event.target)[0];
          let location = "";
          if (clickEvent.id === "getTargetCityWeather") {
            location = $('#targetCity').val().trim().toUpperCase();
          } else if ( clickEvent.className === ("cityList") ) {
            location = clickEvent.innerText;
          }
          if (location == "") return;
  
          updateLocalStorage (location);
          getCurrentWeather(location);
          getForecastWeather(location);
         });
      
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
         localStorage.setItem('cityList', JSON.stringify(cityList));
  
         $('targetCity').val("");
      }
  
      function confirmLocation() {
          
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
            console.log('Geolocation is not supported by your browser');
          } else {
            navigator.geolocation.getCurrentPosition(success, error);
          }
        }
  
      function getCurrentWeather(loc) {
          
          let cityList = JSON.parse(localStorage.getItem("cityList")) || [];
          
          $('#previous').empty();
          
          cityList.forEach ( function (city) {  
            let previousCities = $('<div>');      
            previousCities.addClass("cityList");         
            previousCities.attr("value",city);
            previousCities.text(city);
            $('#previous').append(previousCities);
          });      
          
          $('#city-search').val("");
        
          if (typeof loc === "object") {
            city = `lat=${loc.latitude}&lon=${loc.longitude}`;
          } else {
            city = `q=${loc}`;
          }
        
          var currentURL = "https://api.openweathermap.org/data/2.5/weather?";
          var cityName = city;
          var unitsURL = "&units=imperial";
          var apiIdURL = "&appid="
          var apiKey = "88197090a3d36c7c71da397eb1c27ab6";
          var openCurrWeatherAPI = currentURL + cityName + unitsURL + apiIdURL + apiKey;
        
          $.ajax({
              url: openCurrWeatherAPI,
              method: "GET"
          }).then(function (response1) {
        
          weatherObj = {
              city: `${response1.name}`,
              wind: response1.wind.speed,
              humidity: response1.main.humidity,
              temp: Math.round(response1.main.temp),
              date: (convertDate(response1.dt)),
              icon: `http://openweathermap.org/img/w/${response1.weather[0].icon}.png`,
              desc: response1.weather[0].description
          }
          
        
            $('#forecast').empty(); 
            $('#cityName').text(weatherObj.city + " (" + weatherObj.date + ")");
            $('#currWeathIcn').attr("src", weatherObj.icon);
            $('#currTemp').text("Temperature: " + weatherObj.temp + " " +  "°F");
            $('#currHum').text("Humidity: " + weatherObj.humidity + "%");
            $('#currWind').text("Windspeed: " + weatherObj.wind + " MPH");      
          
          city = `&lat=${parseInt(response1.coord.lat)}&lon=${parseInt(response1.coord.lon)}`;
          
          var uviURL = "https://api.openweathermap.org/data/2.5/uvi";
          var apiIdURL = "?appid="
          var apiKey = "88197090a3d36c7c71da397eb1c27ab6";
          var cityName = city;
          var openUviWeatherAPI = uviURL + apiIdURL + apiKey + cityName;
          
          $.ajax({
              url: openUviWeatherAPI,
              method: "GET"
          }).then(function(response3) {
          
              let UviLevel = parseFloat(response3.value);
              let backGround = 'var(--violet)';        
              if (UviLevel < 3) {backGround = 'var(--green)';} 
                  else if (UviLevel < 6) { backGround = 'var(--yellow)';} 
                  else if (UviLevel < 8) { backGround = 'var(--orange)';} 
                  else if (UviLevel < 11) {backGround = 'var(--red)';}     
          
              let uviTitle = '<span>UV Index: </span>';
              let color = uviTitle + `<span style="background-color: ${backGround}; padding: 0 6px 0 6px;">${response3.value}</span>`;
              $('#currUVI').html(color);            
              });
          });
      }
  
      function getForecastWeather(loc) {
          if (typeof loc === "object") {
              city = `lat=${loc.latitude}&lon=${loc.longitude}`;      
          } else {
              city = `q=${loc}`; }
          
          var currentURL = "https://api.openweathermap.org/data/2.5/weather?";
          var cityName = city;
          var unitsURL = "&units=imperial";
          var apiIdURL = "&appid="
          var apiKey = "88197090a3d36c7c71da397eb1c27ab6";
          var openCurrWeatherAPI2 = currentURL + cityName + unitsURL + apiIdURL + apiKey;
          
          $.ajax({
              url: openCurrWeatherAPI2,
              method: "GET",
          }).then(function (response4) {
  
          var cityLon = response4.coord.lon;
          var cityLat = response4.coord.lat;
          
          city = `lat=${cityLat}&lon=${cityLon}`;
          
          let weatherArr = [];
          let weatherObj = {};
  
          var currentURL = "https://api.openweathermap.org/data/2.5/onecall?";
          var cityName = city;
          var exclHrlURL = "&exclude=hourly";
          var unitsURL = "&units=imperial";
          var apiIdURL = "&appid=";
          var apiKey = "88197090a3d36c7c71da397eb1c27ab6";
          var openFcstWeatherAPI = currentURL + cityName + exclHrlURL + unitsURL + apiIdURL + apiKey;
  
          $.ajax({
              url: openFcstWeatherAPI,
              method: "GET"
          }).then(function (response2) {
          
            for (let i=1; i < (response2.daily.length-2); i++) {
              let cur = response2.daily[i]
              weatherObj = {
                  weather: cur.weather[0].description,
                  icon: `http://openweathermap.org/img/w/${cur.weather[0].icon}.png`,
                  minTemp: Math.round(cur.temp.min),
                  maxTemp: Math.round(cur.temp.max),
                  humidity: cur.humidity,
                  uvi: cur.uvi,
           
                  date: (convertDate(cur.dt))
              }
              weatherArr.push(weatherObj);
            }
    
            for (let i = 0; i < weatherArr.length; i++) {
              let $colmx1 = $('<div class="col mx-1">');
              let $cardBody = $('<div class="card-body forecast-card">');
              let $cardTitle = $('<h6 class="card-title">');
             
              $cardTitle.text(weatherArr[i].date);
  
              let $ul = $('<ul>'); 
              let $iconLi = $('<li>');
              let $weathLi = $('<li>');
              let $tempMaxLi = $('<li>');
              let $tempMinLi = $('<li>');
              let $humLi = $('<li>');
              let $iconI = $('<img>');
  
              $iconI.attr('src', weatherArr[i].icon);
              $weathLi.text(weatherArr[i].weather);                
              $tempMaxLi.text('Temp High: ' + weatherArr[i].maxTemp + " °F");
              $tempMinLi.text('Temp Low: ' + weatherArr[i].minTemp + " °F");
              $humLi.text('Humidity: ' + weatherArr[i].humidity + "%");
  
              $iconLi.append($iconI);
              $ul.append($iconLi);
              $ul.append($weathLi);         
              $ul.append($tempMaxLi);
              $ul.append($tempMinLi);
              $ul.append($humLi);
              $cardTitle.append($ul);
              $cardBody.append($cardTitle);
              $colmx1.append($cardBody);
  
              $('#forecast').append($colmx1);
            }
          });
        });        
      }
      
      var location = confirmLocation();
    });