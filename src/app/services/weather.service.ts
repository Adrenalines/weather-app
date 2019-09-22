import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface Weather {
  temperature: string;
  description: string;
  windSpeed: string;
  windDirection: string;
  pressure: string;
  humidity: string;
  rainyChance: string;
  city: string;
}
@Injectable({
  providedIn: "root"
})
export class WeatherService {
  apiKey = "db33b15c576e72832d3016a9fd9f3cbc";
  apiKeyTranslate =
    "trnsl.1.1.20190922T101531Z.8fe0ac8c8bcb2c16.929fc01e9d89cdc71cf0d6e0db6f15333ab17aca";
  url: string = "";
  urlRainy: string = "";
  urlTranslate: string = "";
  locationString: string = "";

  public weather: Weather = {
    temperature: "--",
    description: "",
    windSpeed: "-",
    windDirection: "",
    pressure: "--",
    humidity: "--",
    rainyChance: "--",
    city: "Омск"
  };

  constructor(private http: HttpClient) {
    this.url = `http://api.openweathermap.org/data/2.5/weather?&units=metric&lang=ru&APPID=${this.apiKey}&`;
    this.urlRainy = `http://api.openweathermap.org/data/2.5/forecast?&units=metric&lang=ru&APPID=${this.apiKey}&`;
    this.urlTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.apiKeyTranslate}&text=`;
  }

  getLocationString(location) {
    if (location.coords) {
      return `lat=${location.lat}&lon=${location.lon}`;
    } else {
      return `q=${location.city}`;
    }
  }

  getLocation() {
    return new Promise(resolve => {
      let location = { coords: true, lat: "", lon: "", city: "" };
      navigator.geolocation.getCurrentPosition(position => {
        location.lat = position.coords.latitude.toFixed(2);
        location.lon = position.coords.longitude.toFixed(2);
        resolve(location);
      });
    });
  }

  loadMyLocationWeather() {
    if (navigator.geolocation) {
      this.getLocation().then(location =>
        this.getWeather(location).subscribe(
          resWeather => {
            this.getRainy(location).subscribe(
              resRainy => {
                this.getWeatherResult(resWeather, resRainy);
              },
              err => console.log(err)
            );
          },
          err => console.log(err)
        )
      );
    }
  }

  getWeather(location) {
    this.locationString = this.getLocationString(location);
    return this.http.get(this.url + this.locationString);
  }

  getRainy(location) {
    this.locationString = this.getLocationString(location);
    return this.http.get(this.urlRainy + this.locationString);
  }

  getTranslatedCity(city, lang) {
    return this.http.get(this.urlTranslate + city + "&lang=" + lang);
  }

  setTranslatedCity(res) {
    this.weather.city = res.text[0];
  }

  setCityObject(res) {
    return {
      coords: false,
      city: res.text[0]
    };
  }

  loadCityWeather(input) {
    this.getTranslatedCity(input, "ru-en").subscribe(
      res =>
        this.getWeather(this.setCityObject(res)).subscribe(
          resWeather => {
            this.getRainy(this.setCityObject(res)).subscribe(
              resRainy => {
                this.getWeatherResult(resWeather, resRainy);
              },
              err => console.log(err)
            );
          },
          err => {
            alert("Некорректный город");
            console.log(err);
          }
        ),
      err => {
        alert("Некорректный город");
        console.log(err);
      }
    );
  }

  getWeatherResult(resWeather, resRainy) {
    this.weather.temperature = resWeather.main.temp.toFixed(0);
    this.weather.description = resWeather.weather[0].description;
    this.weather.description =
      this.weather.description.charAt(0).toUpperCase() +
      this.weather.description.slice(1);
    this.weather.windSpeed = resWeather.wind.speed.toFixed(0);
    this.weather.windDirection =
      resWeather.wind.deg > 22 && resWeather.wind.deg <= 68
        ? "северо-восточный"
        : resWeather.wind.deg > 68 && resWeather.wind.deg <= 113
        ? "восточный"
        : resWeather.wind.deg > 113 && resWeather.wind.deg <= 158
        ? "юго-восточный"
        : resWeather.wind.deg > 158 && resWeather.wind.deg <= 203
        ? "южный"
        : resWeather.wind.deg > 203 && resWeather.wind.deg <= 248
        ? "юго-западный"
        : resWeather.wind.deg > 248 && resWeather.wind.deg <= 293
        ? "западный"
        : resWeather.wind.deg > 293 && resWeather.wind.deg <= 338
        ? "северо-западный"
        : "северный";
    this.weather.pressure = (resWeather.main.pressure * 0.750062).toFixed(0);
    this.weather.humidity = resWeather.main.humidity.toFixed(0);
    let rainy = 0;
    resRainy.list.forEach((item, i) => {
      if (i <= 8 && item.rain !== undefined) {
        rainy += item.rain["3h"];
      }
    });
    this.weather.rainyChance = (rainy > 1 ? 100 : 100 * rainy).toFixed(0);
    this.getTranslatedCity(resWeather.name, "en-ru").subscribe(
      res => this.setTranslatedCity(res),
      err => {
        console.log(err);
        this.weather.city = resWeather.name;
      }
    );
  }

  setIcon(icon) {
    switch (icon) {
      case "Ясно":
        return "wi wi-day-sunny";
      case "Дождь":
        return "wi wi-rain";
      case "Легкий дождь":
        return "wi wi-rain";
      case "Сильный дождь":
        return "wi wi-rain";
      case "Туманно":
        return "wi wi-fog";
      case "Туман":
        return "wi wi wi-fog";
      case "Пасмурно":
        return "wi wi-cloudy";
      case "Облачно":
        return "wi wi-cloudy";
      case "Слегка облачно":
        return "wi wi-day-cloudy";
      default:
        return `wi wi-day-sunny`;
    }
  }
}
