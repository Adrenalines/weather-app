import { Component, OnInit } from "@angular/core";
import { WeatherService } from "../services/weather.service";
@Component({
  selector: "app-temperature",
  templateUrl: "./temperature.component.html",
  styleUrls: ["./temperature.component.scss"]
})
export class TemperatureComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.loadMyLocation();
  }
}
