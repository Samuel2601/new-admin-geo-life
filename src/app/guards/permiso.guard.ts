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
    const token = this.helperService.token() || this.router.navigate(['/home']);
    const componente = route.data['componente'] || this.router.navigate(['/home']);
    const rolUsuario = this.adminService.roluser(token);
    return new Observable<boolean>(observer => {
      this.filterService.tienePermiso(token, componente, rolUsuario._id).subscribe(
        response => {
          if (response.data) {
            observer.next(true);
            observer.complete();
          } else {
            this.router.navigate(['/error']);
            observer.next(false);
            observer.complete();
          }
        },
        error => {
          this.router.navigate(['/error']);
          observer.next(false);
          observer.complete();
        }
      );
    
    });
  }
  
  
  

  
}
