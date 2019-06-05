import { Component } from '@angular/core';
import {SidenavService} from '../../services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  links = [];


  constructor(public sidenav: SidenavService) {

  }
}
