import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  public url;
	
	constructor(private http: HttpClient) {
		this.url = GLOBAL.url+'update/';
	}
  actualizarUsuario(token: any, id: string, data: any,file:any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });
       
    const formData = new FormData();
    formData.append('cedula', data.cedula);
    formData.append('correo', data.correo);
    formData.append('estado', data.estado);
    formData.append('nombres', data.nombres);
    formData.append('password', data.password);
    formData.append('rol_user', data.rol_user);
    formData.append('telefono', data.telefono);
    formData.append('foto', file);

    return this.http.put(this.url + 'actualizar_usuario/' + id, formData, { headers: headers });
  }

  actualizarActividadProyecto(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_actividad_proyecto/' + id, data, { headers: headers });
  }

  actualizarIncidenteDenuncia(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_incidente_denuncia/' + id, data, { headers: headers });
  }

  actualizarCategoria(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_categoria/' + id, data, { headers: headers });
  }

  actualizarSubcategoria(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_subcategoria/' + id, data, { headers: headers });
  }

  actualizarEncargadoCategoria(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_encargado_categoria/' + id, data, { headers: headers });
  }

  actualizarRolUsuario(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_rol_usuario/' + id, data, { headers: headers });
  }

  actualizarEstadoIncidente(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_estado_incidente/' + id, data, { headers: headers });
  }

  actualizarEstadoActividadProyecto(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_estado_actividad_proyecto/' + id, data, { headers: headers });
  }

  actualizarTipoActividadProyecto(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_tipo_actividad_proyecto/' + id, data, { headers: headers });
  }

  actualizarDireccionGeo(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_direccion_geo/' + id, data, { headers: headers });
  }
}
