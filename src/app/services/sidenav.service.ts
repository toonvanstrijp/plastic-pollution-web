import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidebarOpenedSubject = new EventEmitter();

  public get sidebarOpened$() {
    return this.sidebarOpenedSubject.asObservable();
  }

  constructor() { }

  sidenavChanged() {
    this.sidebarOpenedSubject.next();
  }
}
