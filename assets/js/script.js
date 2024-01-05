//search button
var lookupCity = document.querySelector("#city");
var searchBtn = document.querySelector("#search");
var cityEl = document.querySelector("#cityText");
var conditionEl = document.querySelector("#conditions");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidEl = document.querySelector("#humidity");

//api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=cbe35da2a8da20b0bd3f0399cb1c3aba
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API%20key}
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//51.5073219,"lon": -0.1276474,

// Reads city from local storage and returns array of weather info.
  // Returns an empty array ([]) if there aren't any items.
//   function readSavedCitiesFromStorage() {
//     var cities = localStorage.getItem('cities');
//     if (cities) {
//       cities = JSON.parse(cities);
//     } else {
//       cities = [];
//     }
//     return cities;
//   }

  //Display city weather from local storage
//   function displayCities(){
//     var cities = readSavedCitiesFromStorage();
    
//     for(var i=0; i < cities.length; i++){
//       var cities = cities[i];
      
//       var agendaText = $("#text-" + item.time);
//       agendaText.text(item.agendaItem);
//     }

//   }

  //Save city weather to local storage
  function saveCityToStorage(city) {
    localStorage.setItem('cities', JSON.stringify(city));
  }


function searchCity(){
    var city = lookupCity.value;
    getWeather(city);
}

//function to call weather api
function getWeather(city){
    var url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=imperial&APPID=cbe35da2a8da20b0bd3f0399cb1c3aba";

    fetch(url, {
    cache: 'reload',
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        cityEl.textContent = city;
        conditionEl.textContent = data.weather[0].description;
        tempEl.textContent = "Temperature: " + data.main.temp +"°F";
        windEl.textContent = "Wind Speed: " + data.wind.speed + " MPH";
        humidEl.textContent = "Humidity: " + data.main.humidity + " %";

        var newCity = {
            name: city,
            weather: conditionEl.value,
          }
      
          // add item to local storage
          var cities = []; //readSavedCitiesFromStorage();
          cities.push(newCity);
          saveCityToStorage(cities);

        console.log(data);
    });
}



searchBtn.addEventListener("click", searchCity);