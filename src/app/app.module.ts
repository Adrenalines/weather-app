import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { LocationComponent } from "./location/location.component";
import { DegreeComponent } from "./degree/degree.component";
import { TemperatureComponent } from "./temperature/temperature.component";
import { DetailsComponent } from "./details/details.component";

@NgModule({
  declarations: [
    AppComponent,
    LocationComponent,
    DegreeComponent,
    TemperatureComponent,
    DetailsComponent
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
