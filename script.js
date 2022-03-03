const apiKey = 'c129e79ec49813641b21ef000a914d76';
var currentWeatherNode;
var city = 'Charlotte';
var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&type=accurate&APPID=${apiKey}`;
var dayArray;


// I have prior experience in Javascript and have instructer approval to use async/await
const request = async (url) => {
    const response = await fetch(url);
    return response.ok ? response.json() : Promise.reject({error: 500})
};
const getWeatherInfo = async (newCity) => {
    try {
        localStorage.setItem('myCity', newCity);
        city = newCity;
        queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&type=accurate&APPID=${apiKey}`;
        const response = await request(queryURL);
        var results = JSON.stringify(response);
        var localTime = new Date(JSON.parse(results).dt * 1000).toLocaleDateString("en");
        $('#currentCity').html(`<h2>${city} ${localTime}</h2>`);
        var temperature = JSON.parse(results).main.temp;
        var wind = JSON.parse(results).wind.speed;
        var humidity = JSON.parse(results).main.humidity;
        var lon = JSON.parse(results).coord.lon;
        var lat = JSON.parse(results).coord.lat;
        const ocURL = await request(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&type=accurate&APPID=${apiKey}`);
        var uvIndex = ocURL.current.uvi;
        getDaily(ocURL);
        $('#currentWeather').html(`<p>Temp: ${temperature}°F</p><p>Wind: ${wind} MPH</p><p>Humidity: ${humidity}%</p><p>UV Index: ${uvIndex}</p>`);
    } catch (err) { 
        console.log('err', JSON.stringify(err));
        $('#currentCity').html(`<h2>${city} not found</h2><p>Please try searching again</p>`);
        $('#fiveDayForecast').html('');
        $('#currentWeather').html('');
    }
};
function getDaily(data) {
    $('#fiveDayForecast').html('');
    data.daily.forEach((value, index) => {
        if (index > 0 && index < 6) {
            var date = new Date(value.dt * 1000).toLocaleDateString("en");
            $('#fiveDayForecast').append(`<div><p>${date}</p><p>Condition: ${value.weather[0].description}</p><p>Temp: ${value.temp.day}°F</p><p>Wind: ${value.wind_speed} MPH</p><p>Humidity: ${value.humidity}%</p></div>`)
        }
    });
}
function listClick(event) {
    // console.log(event.target.innerHTML);
    getWeatherInfo('' + event.target.innerHTML);
}
function searchClick(event) {
    console.log(event.target);
    // var searchInput = $(event.target).siblings(".input").value;
    // console.log($("#citySearch").val())
    getWeatherInfo('' + $("#citySearch").val());
}
// $('#currentCity').html('<h2>Charlotte ' + moment().format('L') + '</h2>');
var myCityVal = localStorage.getItem('myCity');
if (myCityVal != null && myCityVal != 'null')
 { getWeatherInfo(myCityVal); } else { getWeatherInfo('Charlotte') }
// getWeatherInfo('Snowmass');
$('.sidebar').on('click', 'li', listClick);
$('.sidebar').on('click', 'button', searchClick);
// $('#currentWeather').html(currentWeatherNode);