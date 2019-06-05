import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/root/app.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule, MatSidenavModule} from '@angular/material';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoidG9vbnZhbnN0cmlqcCIsImEiOiJjanV1M2w0a3QwZGlhNDRudnNpZ3ZlaXo2In0.J28SNUUsnTiHvbT9Bb8rIQ',
    }),
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
