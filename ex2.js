let countries = [];
let country;
let apikey = "9407350b14395d93d665d17e1934dbe6";
let lon = 0;
let lat = 0;


function setDetails(country) {
    console.log(country.languages[0].name);

    document.getElementById("country-name").textContent = country.name;
    document.getElementById("native-name").textContent = country.nativeName;
    document.getElementById("capital").textContent = country.capital;
    document.getElementById("region").textContent = country.region;
    document.getElementById("population").textContent = country.population;

    document.getElementById("languages").textContent = "";
    country.languages.forEach(lang => {
        document.getElementById("languages").textContent += lang.name + " ,";
    });

    document.getElementById("timezones").textContent = "";
    country.timezones.forEach(time => {
        document.getElementById("timezones").textContent += time + " ,";
    });

    document.getElementById("calling-codes").textContent = "+";
    country.callingCodes.forEach(code => {
        document.getElementById("calling-codes").textContent += code + " ";
    });

    document.getElementById("flag").src = country.flag;

}

async function getweather(country) {
    let weather;
    let endpoint = `http://api.openweathermap.org/data/2.5/weather?q=`;
    endpoint += `${country.capital},${country.alpha2Code}&units=metric&lang=fa&appid=${apikey}`;

    try {
        weather = await $.ajax({
            type: "GET",
            url: endpoint,
        });
        console.log("weather", weather);
        // return countries;
    } catch (error) {
        console.log(error);
        return null;
    }

    try {
        document.getElementById("weather-icon").src = `icons/${weather.weather[0].icon}.svg`;
    } catch (error) {
        var iconurl = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
        document.getElementById("weather-icon").src = iconurl;
    }

    document.getElementById("weather-status").textContent = weather.weather[0].main;
    document.getElementById("weather-desc").textContent = weather.weather[0].description;
    document.getElementById("temp-max").innerHTML = weather.main.temp_max + '<span class="color-red"> <i class="fas fa-angle-up"></i></span>';
    document.getElementById("temp-min").innerHTML = weather.main.temp_min + '<span class="color-blue"> <i class="fas fa-angle-down"></i></span>';
    document.getElementById("humidity").textContent = weather.main.humidity;
    document.getElementById("wind-speed").textContent = weather.wind.speed;
    document.getElementById("visibility").textContent = weather.visibility;
    document.getElementById("temperature-m").textContent = weather.main.temp;
}

function bindCountriesList() {
    let countriesList = document.getElementById("countries-list");
    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        console.log(country);
        let option = document.createElement("option");
        option.text = country.name;
        option.value = i;
        countriesList.add(option);
    }
    countriesList.value = "107";
}

async function initalPage() {
    try {
        countries = await $.ajax({
            type: "GET",
            url: "https://restcountries.com/v2/all",
        });
    } catch (error) {
        return null;
    }
    bindCountriesList();
    setDetails(countries[107]);
    getweather(countries[107]);
    setnewData(countries[107]);
}


$(document).ready(function() {
    initalPage();
    $("#countries-list").change(function(e) {
        let countryNum = $(this).val();
        setDetails(countries[countryNum]);
        getweather(countries[countryNum]);
        setnewData(countries[countryNum]);
    });
});

function setnewData(params) {
    let weatherWidget = {
        settings: {
            api_key: '9407350b14395d93d665d17e1934dbe6',
            weather_url: 'https://api.openweathermap.org/data/2.5/weather',
            forecast_url: 'https://api.openweathermap.org/data/2.5/forecast',
            search_type: 'city_name',
            city_name: '',
            units: 'metric',
            icon_mapping: {
                '01d': 'wi-day-sunny',
                '01n': 'wi-day-sunny',
                '02d': 'wi-day-cloudy',
                '02n': 'wi-day-cloudy',
                '03d': 'wi-cloud',
                '03n': 'wi-cloud',
                '04d': 'wi-cloudy',
                '04n': 'wi-cloudy',
                '09d': 'wi-rain',
                '09n': 'wi-rain',
                '10d': 'wi-day-rain',
                '10n': 'wi-day-rain',
                '11d': 'wi-thunderstorm',
                '11n': 'wi-thunderstorm',
                '13d': 'wi-snow',
                '13n': 'wi-snow',
                '50d': 'wi-fog',
                '50n': 'wi-fog'
            }
        },
        constant: {
            dow: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        }
    };

    weatherWidget.init = function(settings) {
        this.settings = Object.assign(this.settings, settings);
        Promise.all([this.getWeather(), this.getForecast()]).then((resolve) => {
            let weather = resolve[0];
            let forecast = resolve[1].list;
            document.getElementsByClassName('ow-city-name')[0].innerHTML = weather.name;
            document.getElementsByClassName('ow-temp-current')[0].innerHTML = Math.round(weather.main.temp) + '&deg';
            document.getElementsByClassName('ow-pressure')[0].innerHTML = weather.main.pressure + ' hPa';
            document.getElementsByClassName('ow-humidity')[0].innerHTML = weather.main.humidity + '%';
            document.getElementsByClassName('ow-wind')[0].innerHTML = weather.wind.speed + ' km/h';
            if (!!this.settings.icon_mapping[weather.weather[0].icon]) {
                let icon = this.settings.icon_mapping[weather.weather[0].icon];
                let ico_current = document.getElementsByClassName('ow-ico-current')[0];
                if (ico_current.classList) {
                    ico_current.classList.add(icon);
                } else {
                    ico_current.className += ' ' + icon;
                }
            }
            forecast = forecast.filter((x) => {
                return x.dt_txt.substr(0, 10) !== new Date().toJSON().slice(0, 10);
            });
            let fs = [];
            for (let f of forecast) {
                let date = f.dt_txt.substr(0, 10);
                if (!!fs[date]) {
                    fs[date].temp_max = f.main.temp_max > fs[date].temp_max ? f.main.temp_max : fs[date].temp_max;
                    fs[date].temp_min = f.main.temp_min < fs[date].temp_min ? f.main.temp_min : fs[date].temp_min;
                    fs[date].icons.push(f.weather[0].icon);
                } else {
                    fs[date] = {
                        dow: this.constant.dow[new Date(date).getDay()],
                        temp_max: f.main.temp_max,
                        temp_min: f.main.temp_min,
                        icons: [f.weather[0].icon]
                    }
                }
            }
            let forecast_items = document.getElementsByClassName('ow-forecast-item');
            let counter = 0;
            for (let day in fs) {
                let icon = this.settings.icon_mapping[this.getIconWithHighestOccurence(fs[day].icons)];
                let fi = forecast_items[counter];
                fi.getElementsByClassName('max')[0].innerHTML = Math.round(fs[day].temp_max) + '&deg';
                fi.getElementsByClassName('min')[0].innerHTML = Math.round(fs[day].temp_min) + '&deg';
                fi.getElementsByClassName('ow-day')[0].innerHTML = fs[day].dow;
                let ico_current = fi.getElementsByClassName('ow-ico-forecast')[0];
                if (ico_current.classList) {
                    ico_current.classList.add(icon);
                } else {
                    ico_current.className += ' ' + icon;
                }
                counter++;
            }

        });
    };

    weatherWidget.getForecast = function() {
        let params = {
            'q': this.settings.city_name,
            'APPID': this.settings.api_key,
            'units': this.settings.units
        };

        let p = '?' + Object.keys(params)
            .map((key) => {
                return key + '=' + params[key]
            })
            .join('&');
        return this.makeRequest(this.settings.forecast_url, p);
    };

    weatherWidget.getWeather = function() {
        let params = {
            'q': this.settings.city_name,
            'APPID': this.settings.api_key,
            'units': this.settings.units
        };

        let p = '?' + Object.keys(params)
            .map((key) => {
                return key + '=' + params[key]
            })
            .join('&');
        return this.makeRequest(this.settings.weather_url, p);
    };

    weatherWidget.makeRequest = function(url, params) {
        return new Promise(function(resolve, reject) {
            let req = new XMLHttpRequest();
            req.open('GET', url + params, true);
            req.responseType = 'json';

            req.onload = function() {
                if (req.status >= 200 && req.status < 400) {
                    resolve(req.response);
                } else {
                    reject(Error(req.status));
                }
            };

            req.onerror = () => reject('Error occured while connecting to Weather API');
            req.send(params);
        });
    };

    weatherWidget.getIconWithHighestOccurence = function(a) {
        let elems = Array.prototype.slice.call(a);
        return elems.sort((a, b) =>
            elems.filter(v => v === a).length - elems.filter(v => v === b).length
        ).pop();
    }

    // run the widget
    let widget = Object.create(weatherWidget);
    widget.init({
        city_name: params.capital
    });
}