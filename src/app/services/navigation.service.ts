import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private navbarSubject = new BehaviorSubject<boolean>(false);

  get navbar$() {
    return this.navbarSubject.asObservable();
  }

  constructor() { }

  showNavbar(): void {
    this.navbarSubject.next(true);
  }

  hideNavbar(): void {
    this.navbarSubject.next(false);
  }

}