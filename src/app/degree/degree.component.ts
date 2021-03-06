import { Component, OnInit } from "@angular/core";
import { WeatherService } from "../services/weather.service";

@Component({
  selector: "app-degree",
  templateUrl: "./degree.component.html",
  styleUrls: ["./degree.component.scss"]
})
export class DegreeComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}
  isCelsius: boolean = true;
  ngOnInit() {}

  changeDegree(degree) {
    if (
      degree === "f" &&
      !isNaN(+this.weatherService.weather.temperature) &&
      this.isCelsius
    ) {
      this.isCelsius = false;
      this.weatherService.weather.temperature = (
        (+this.weatherService.weather.temperature * 9) / 5 +
        32
      ).toFixed(0);
    } else if (
      degree === "c" &&
      !isNaN(+this.weatherService.weather.temperature) &&
      !this.isCelsius
    ) {
      this.isCelsius = true;
      this.weatherService.weather.temperature = (
        (+this.weatherService.weather.temperature - 32) *
        (5 / 9)
      ).toFixed(0);
    }
  }
}
