import { Component, OnInit } from "@angular/core";
import { WeatherService } from "../services/weather.service";

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.scss"]
})
export class LocationComponent implements OnInit {
  choose: boolean = true;
  input: string = "";
  city: string = "";

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {}

  loadMyLocation() {
    this.weatherService.loadMyLocationWeather();
  }

  loadChosenLocation() {
    if (this.input === "") return;
    this.weatherService.loadCityWeather(this.input);
    this.choose = true;
  }

  changeCity() {
    this.choose = false;
  }
}
