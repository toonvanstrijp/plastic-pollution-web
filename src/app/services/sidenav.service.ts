import {EventEmitter, Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidebarOpenedSubject = new EventEmitter();

  public get sidebarOpened$() {
    return this.sidebarOpenedSubject.asObservable();
  }

  constructor(router: Router) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) { element.scrollIntoView(true); }
        }
      }
    });

  }

  sidenavChanged() {
    this.sidebarOpenedSubject.next();
  }
}
