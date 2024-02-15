import { Injectable } from '@angular/core';
import { Role,Permission } from './roles.permisos';
import { AdminService } from './admin.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _adminService:AdminService) { }
  getRole(): Role {
    // Lógica para obtener el rol del usuario (puede ser desde una API, almacenado en el localStorage, etc.)
    return Role.Ciudadano;
  }
  hasPermission(permission: Permission): boolean {
    const role = this._adminService.getRol();
    switch (role) {
      case Role.Ciudadano:
        return  permission === Permission.VerSubcategorias;
      case Role.Funcionario:
        return permission === Permission.VerCategorias || permission === Permission.VerSubcategorias || permission === Permission.CrearSubcategorias;
      case Role.Administrador:
        return true; // Tiene todos los permisos
      case Role.Supervisor:
        return true; // Tiene todos los permisos
      default:
        return false;
    }
  }
}
