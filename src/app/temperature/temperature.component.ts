import { Component, OnInit } from "@angular/core";
import { WeatherService } from "../services/weather.service";
@Component({
  selector: "app-temperature",
  templateUrl: "./temperature.component.html",
  styleUrls: ["./temperature.component.scss"]
})
export class TemperatureComponent implements OnInit {
  weather = {
    temperature: "--",
    windSpeed: "-",
    windDirection: "",
    pressure: "--",
    humidity: "--",
    rainyChance: "--",
    city: "Омск"
  };

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    if (navigator.geolocation) {
      this.weatherService.getLocation().then(location =>
        this.weatherService.getWeather(location).subscribe(
          resWeather => {
            this.weatherService.getRainy(location).subscribe(
              resRainy => {
                this.weather = this.weatherService.getWeatherResult(
                  resWeather,
                  resRainy
                );
              },
              err => {
                console.log(err);
              }
            );
          },
          err => {
            console.log(err);
          }
        )
      );
    }
    /* this.weatherService; */
  }
}
