import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {} from "rxjs";
import { element } from "protractor";

@Injectable({
  providedIn: "root"
})
export class WeatherService {
  apiKey = "db33b15c576e72832d3016a9fd9f3cbc";
  url: string = "";
  urlRainy: string = "";
  locationString: string = "";

  constructor(private http: HttpClient) {
    this.url = `http://api.openweathermap.org/data/2.5/weather?&units=metric&APPID=${this.apiKey}&`;
    this.urlRainy = `http://api.openweathermap.org/data/2.5/forecast?&units=metric&APPID=${this.apiKey}&`;
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

  getLocationString(location) {
    if (location.coords) {
      return `lat=${location.lat}&lon=${location.lon}`;
    } else {
      return `q=${location.city}`;
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

  getWeatherResult(resWeather, resRainy) {
    let temperature = resWeather.main.temp.toFixed(0);
    let windSpeed = resWeather.wind.speed.toFixed(1);
    let windDirection =
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
    let pressure = (resWeather.main.pressure * 0.750062).toFixed(0);
    let humidity = resWeather.main.humidity.toFixed(0);
    let rainy = 0;
    resRainy.list.forEach((item, i) => {
      if (i <= 8 && item.rain !== undefined) {
        rainy += item.rain["3h"];
      }
    });
    let rainyChance = (rainy > 1 ? 100 : 100 * rainy).toFixed(0);
    return {
      temperature: temperature,
      windSpeed: windSpeed,
      windDirection: windDirection,
      pressure: pressure,
      humidity: humidity,
      rainyChance: rainyChance,
      city: resWeather.name
    };
  }
}
