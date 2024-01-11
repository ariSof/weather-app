//search button
var lookupCity = document.querySelector("#city");
var searchBtn = document.querySelector("#search");
var savedCityEl = document.querySelector("#savedCities");
var cityEl = document.querySelector("#cityText");
var mainIconEl = document.querySelector("#main-icon");
var conditionEl = document.querySelector("#conditions");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidEl = document.querySelector("#humidity");
var isSearched = false;

var today = dayjs();
var reformatDate = today.format('MM/DD/YYYY');

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
      newInput.className ="button is-fullwidth is-link is-light";
      newInput.setAttribute("type", "submit");
      newInput.setAttribute("value", city);

      
      savedCityEl.appendChild(newInput);//'<input class="button" type="submit" value="'+ city.name +'">');
      console.log("attempted to add button for "+ city);
      
    }

}

//Save city weather to local storage
function saveCityToStorage(city) {
    // var cInStorage = readSavedCitiesFromStorage();

    // foreach(cInStorage.pop)

    localStorage.setItem('cities', JSON.stringify(city));
    displayCities();
}


function searchCity(city){
  console.log(city);
    if(isSearched){
        city = lookupCity.value;
    }
    isSearched = true;
    getWeather(city);
    getForecast(city); //coordinates[0], coordinates[1]);
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
        var icon = data.weather[0].icon;
        var temp = data.main.temp;
        var wind = data.wind.speed;
        var humid = data.main.humidity;

        cityEl.textContent = searchedCity + " " + reformatDate;
        mainIconEl.setAttribute("src", "https://openweathermap.org/img/w/"+ icon +".png");
        conditionEl.textContent = weatherCond.charAt(0).toUpperCase() + weatherCond.substring(1);
        tempEl.textContent = "Temperature: " + temp +"°F";
        windEl.textContent = "Wind Speed: " + wind + " MPH";
        humidEl.textContent = "Humidity: " + humid + " %";

        // var newCity = {
        //     name: searchedCity,
        //     weather: weatherCond,
        //     temp: temp,
        //     windSpeed: wind,
        //     humidity: humid,
        //   }
      
          // add item to local storage
          var cities = readSavedCitiesFromStorage();
          var isNew = true;

          for(var i=0; i<cities.length; i++){

            if(cities[i] == searchedCity){
              isNew = false;
            }
          }

          if(isNew){
            cities.push(searchedCity);
            saveCityToStorage(cities);
          }

          // cities.push(newCity);
          // saveCityToStorage(cities);
        
    });
}

function getForecast(city) {
  var url = "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&units=imperial&appid=cbe35da2a8da20b0bd3f0399cb1c3aba";
//           https://api.openweathermap.org/data/2.5/forecast?q=tahoe&units=imperial&appid=cbe35da2a8da20b0bd3f0399cb1c3aba
  fetch(url, {
  cache: 'reload',
  })
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {

    var counter = 2;

    for(var i=1; i<=5; i++) {
      
      //today.format('MM/DD/YYYY');
      var displayDate = today.add(i, 'day');
      //reformatDate.add(i, 'day');
      displayDate = displayDate.format('MM/DD/YYYY');
    
      // var searchedCity = city;
      var forecastEl = document.getElementById("forecast1");
      var dateEl = document.querySelector("#date"+i);
      var iconEl = document.querySelector("#icon"+ i);
      var tempEl = document.querySelector("#temp"+ i);
      var windEl = document.querySelector("#wind"+ i);
      var humidEl = document.querySelector("#humid"+ i);
      console.log(forecastEl);
      console.log(iconEl);

      var date = data.list[counter].dt_txt;
      console.log(date);
      var weatherIcon = data.list[counter].weather[0].icon;
     
      iconEl.setAttribute("src", "https://openweathermap.org/img/w/"+ weatherIcon +".png");
      
      var temp = data.list[counter].main.temp;
      var wind = data.list[counter].wind.speed;
      var humid = data.list[counter].main.humidity;

      // cityEl.textContent = searchedCity;
      // conditionEl.textContent = weatherCond;
      dateEl.textContent = displayDate;
      tempEl.textContent = "Temperature: " + temp +"°F";
      windEl.textContent = "Wind Speed: " + wind + " MPH";
      humidEl.textContent = "Humidity: " + humid + " %";

      counter = counter + 8;

    
      console.log(data);
    }
      
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


displayCities();
searchCity('Tahoe');
searchBtn.addEventListener("click", searchCity);