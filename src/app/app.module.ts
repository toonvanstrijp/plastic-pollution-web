import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/root/app.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MapComponent } from './components/map/map.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatRadioModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {SidenavService} from './services/sidenav.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DialogComponent} from './components/dialog/dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DialogComponent
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
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    DragDropModule,
    MatDialogModule,
    MatTabsModule,
  ],
  entryComponents: [DialogComponent],
  providers: [SidenavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
