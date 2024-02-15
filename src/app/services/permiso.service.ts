// permiso.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private permisos: { [nombreComponente: string]: string[] } = {};

  constructor() { }

  public agregarPermiso(nombreComponente: string, permisos: string[]) {
    this.permisos[nombreComponente] = permisos;
    console.log(this.permisos);
  }

  public tienePermiso(nombreComponente: string, permiso: string): boolean {
    const permisosComponente = this.permisos[nombreComponente];
    console.log(permisosComponente);
    return permisosComponente && permisosComponente.includes(permiso);
  }

  public obtenerRolUsuario(): string {
    const token: any = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    var decodedToken = helper.decodeToken(token);
    return decodedToken.rol_user;
  }
}
