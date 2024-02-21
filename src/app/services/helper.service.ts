import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private deshabilitarMapaSubject = new Subject<void>();

  deshabilitarMapa$ = this.deshabilitarMapaSubject.asObservable();

  deshabilitarMapa() {
    this.deshabilitarMapaSubject.next();
  }
}
