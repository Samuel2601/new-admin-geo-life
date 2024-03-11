// permiso.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { HelperService } from '../services/helper.service';
import { FilterService } from '../services/filter.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisoGuard implements CanActivate {

  constructor(private adminService: AdminService , private router: Router,private helperService:HelperService,private filterService:FilterService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const token = this.helperService.token();
    const componente = route.data['componente'];
    const rolUsuario = this.adminService.roluser(token); // Método para obtener el rol del usuario desde AuthService
  
    return new Observable<boolean>(observer => {
      this.filterService.tienePermiso(token, componente, rolUsuario._id).subscribe(
        response => {
          if (response.data) {
            observer.next(true);
            observer.complete();
          } else {
            this.router.navigate(['/error']); // Redirigir a /home si no tiene permiso
            observer.next(false);
            observer.complete();
          }
        },
        error => {
          this.router.navigate(['/error']); // Redirigir a /home si hay un error
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
  
  

  
}
