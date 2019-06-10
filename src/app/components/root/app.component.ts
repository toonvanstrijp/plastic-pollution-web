import { Component } from '@angular/core';
import {SidenavService} from '../../services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  links = [
    {
      label: 'Home',
      link: '/home',
    },
    {
      label: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Introduction',
      link: '/home',
      fragment: 'introduction'
    },
    {
      label: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Global production of plastic',
      link: '/home',
      fragment: 'global-production'
    },
    {
      label: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Where does it come from?',
      link: '/home',
      fragment: 'where-does-it-come-from'
    },
    {
      label: 'Map',
      link: '/map'
    }
  ];


  constructor(public sidenav: SidenavService) {

  }
}
