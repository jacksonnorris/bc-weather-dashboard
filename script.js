const apiKey = 'c129e79ec49813641b21ef000a914d76';
var currentWeatherNode;
var city = 'Charlotte';
var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&type=accurate&APPID=${apiKey}`;
var dayArray;

const request = async url => {
    const response = await fetch(url);
    return response.ok ? response.json() : Promise.reject({error: 500})
};
const getWeatherInfo = async (newCity) => {
    try {
        city = newCity;
        queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&type=accurate&APPID=${apiKey}`;
        $('#currentCity').html(`<h2>${city} ${moment().format('L')}</h2>`);
        const response = await request(queryURL);
        var results = JSON.stringify(response);
        var temperature = JSON.parse(results).main.temp;
        var wind = JSON.parse(results).wind.speed;
        var humidity = JSON.parse(results).main.humidity;
        var lon = JSON.parse(results).coord.lon;
        var lat = JSON.parse(results).coord.lat;
        const ocURL = await request(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&type=accurate&APPID=${apiKey}`);
        var uvIndex = ocURL.current.uvi;
        getDaily(ocURL);
        $('#currentWeather').html(`<p>Temp: ${temperature}°F</p><p>Wind: ${wind} MPH</p><p>Humidity: ${humidity}%</p><p>UV Index: ${uvIndex}</p>`);
    } catch (err) { console.log(err); }
};
function getDaily(data) {
    data.daily.forEach((value, index) => {
        if (index > 0) {
            var date = new Date(value.dt * 1000).toLocaleDateString("en");
            $('#5DayForecast').append(`<div><p>${date}</p><p>Temp: ${value.temp.day}</p></div>`)
        }
    });
}
// $('#currentCity').html('<h2>Charlotte ' + moment().format('L') + '</h2>');
getWeatherInfo('Snowmass');
// $('#currentWeather').html(currentWeatherNode);