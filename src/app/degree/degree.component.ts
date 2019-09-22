import { Component, OnInit } from "@angular/core";
import { WeatherService } from "../services/weather.service";

@Component({
  selector: "app-degree",
  templateUrl: "./degree.component.html",
  styleUrls: ["./degree.component.scss"]
})
export class DegreeComponent implements OnInit {
  celsius;
  fahrenheit;
  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.celsius = "celsius toggled";
    this.fahrenheit = "fahrenheit";
  }

  changeDegree(degree) {
    if (
      degree === "f" &&
      !isNaN(+this.weatherService.weather.temperature) &&
      !this.fahrenheit.includes("toggled")
    ) {
      this.celsius = "celsius";
      this.fahrenheit = "fahrenheit toggled";
      this.weatherService.weather.temperature = (
        (+this.weatherService.weather.temperature * 9) / 5 +
        32
      ).toFixed(0);
    } else if (
      degree === "c" &&
      !isNaN(+this.weatherService.weather.temperature) &&
      !this.celsius.includes("toggled")
    ) {
      this.celsius = "celsius toggled";
      this.fahrenheit = "fahrenheit";
      this.weatherService.weather.temperature = (
        (+this.weatherService.weather.temperature - 32) *
        (5 / 9)
      ).toFixed(0);
    }
  }
}
