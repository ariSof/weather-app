//search button
var lookupCity = document.querySelector("#city");
var searchBtn = document.querySelector("#search");
var savedCityEl = document.querySelector("#savedCities");
var cityEl = document.querySelector("#cityText");
var conditionEl = document.querySelector("#conditions");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidEl = document.querySelector("#humidity");
var isSearched = true;

//api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=cbe35da2a8da20b0bd3f0399cb1c3aba
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API%20key}
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//51.5073219,"lon": -0.1276474,

// Reads city from local storage and returns array of weather info.
// Returns an empty array ([]) if there aren't any items.
function readSavedCitiesFromStorage() {
    var cities = localStorage.getItem('cities');
    if (cities) {
      cities = JSON.parse(cities);
    } else {
      cities = [];
    }
    return cities;
}

//Display city weather from local storage
function displayCities(){
    var cities = readSavedCitiesFromStorage();
    savedCityEl.textContent = '';
    
    for(var i=0; i < cities.length; i++){
      var city = cities[i];

      var newInput = document.createElement("input");
      newInput.className ="button is-fullwidth";
      newInput.setAttribute("type", "submit");
      newInput.setAttribute("value", city.name);

      
      savedCityEl.appendChild(newInput);//'<input class="button" type="submit" value="'+ city.name +'">');
      console.log("attempted to add button for "+ city.name);
      
    }

}

//Save city weather to local storage
function saveCityToStorage(city) {
    localStorage.setItem('cities', JSON.stringify(city));
    displayCities();
}


function searchCity(city){
    if(isSearched){
        city = lookupCity.value;
    }
    isSearched = true;
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

        var searchedCity = city;
        var weatherCond = data.weather[0].description;
        var temp = data.main.temp;
        var wind = data.wind.speed;
        var humid = data.main.humidity;

        cityEl.textContent = searchedCity;
        conditionEl.textContent = weatherCond;
        tempEl.textContent = "Temperature: " + temp +"°F";
        windEl.textContent = "Wind Speed: " + wind + " MPH";
        humidEl.textContent = "Humidity: " + humid + " %";

        var newCity = {
            name: searchedCity,
            weather: weatherCond,
            temp: temp,
            windSpeed: wind,
            humidity: humid,
          }
      
          // add item to local storage
          var cities = readSavedCitiesFromStorage();
          cities.push(newCity);
          saveCityToStorage(cities);

        console.log(data);
    });
}

savedCityEl.addEventListener("click", function(event) {
    event.preventDefault();
    var element = event.target;
  
    if(element.matches("input")){
      var cityValue = element.getAttribute("value");
      isSearched = false;
      searchCity(cityValue);
    }
  });


searchBtn.addEventListener("click", searchCity);