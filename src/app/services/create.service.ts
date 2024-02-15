import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class CreateService {
	public url;
	
	constructor(private http: HttpClient) {
		this.url = GLOBAL.url+'create/';
	}
  registrarUsuario(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_usuario', data, { headers: headers });
  }

  registrarActividadProyecto(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_actividad_proyecto', data, { headers: headers });
  }

  registrarIncidenteDenuncia(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_incidente_denuncia', data, { headers: headers });
  }

  registrarCategoria(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_categoria', data, { headers: headers });
  }

  registrarSubcategoria(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_subcategoria', data, { headers: headers });
  }

  registrarEncargadoCategoria(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_encargado_categoria', data, { headers: headers });
  }

  registrarRolUsuario(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_rol_usuario', data, { headers: headers });
  }

  registrarEstadoIncidente(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_estado_incidente', data, { headers: headers });
  }

  registrarEstadoActividadProyecto(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_estado_actividad_proyecto', data, { headers: headers });
  }

  registrarTipoActividadProyecto(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_tipo_actividad_proyecto', data, { headers: headers });
  }

  registrarDireccionGeo(token: any, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.post(this.url + 'registrar_direccion_geo', data, { headers: headers });
  }
  

}
