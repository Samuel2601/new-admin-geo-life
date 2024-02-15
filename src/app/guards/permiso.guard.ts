// permiso.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PermisoService } from '../services/permiso.service';
import { ListService } from '../services/list.service';

@Injectable({
  providedIn: 'root'
})
export class PermisoGuard implements CanActivate {

  constructor(private _router: Router,private permisoService: PermisoService,private _listService:ListService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission = route.data['permission'];
    return this._listService.ListarPermisos(sessionStorage.getItem('token')).pipe(
      map((permisos) => {
        console.log(permisos);
        if(permisos.data.length>0){
          const permisosComponente = permisos.data.find((p:any) => p.nombreComponente === permission.componente);
          if (permisosComponente) {
            this.permisoService.agregarPermiso(permission.componente, permisosComponente.rolesPermitidos);
          }
          const rolUsuario = this.permisoService.obtenerRolUsuario();
          if (rolUsuario && this.permisoService.tienePermiso(permission.componente, permission.permiso)) {
            return true;
          } else {
            //this._router.navigate(['/home']); // Redirigir a la página de inicio
            return false;
          }
        }else{
          return true;
        }
        
      })
    );
  }
}
