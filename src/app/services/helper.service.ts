import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AdminService } from './admin.service';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private deshabilitarMapaSubject = new Subject<void>();

  deshabilitarMapa$ = this.deshabilitarMapaSubject.asObservable();

  deshabilitarMapa() {
    this.deshabilitarMapaSubject.next();
  }
  token(): string | null {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return token ? token : null;
  }
  
  actualizarToken(token:any){

  }
  constructor(private router: Router, private adminService: AdminService,private filterService:FilterService) { }

  async checkPermiso(componente: any): Promise<boolean> {
    const token = this.token();
    if(!token){
      return false
    }
    const rolUsuario = this.adminService.roluser(token);
  
    try {
      const response = await this.filterService.tienePermiso(token, componente, rolUsuario._id).toPromise();
      return response.data ? true : false;
    } catch (error) {
      console.error('Error al verificar el permiso:', error);
      return false;
    }
  }
}
