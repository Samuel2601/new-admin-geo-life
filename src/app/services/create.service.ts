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

  registrarIncidenteDenuncia(token: any, data: any, fotos: File[]): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });    
    const formData = new FormData();
    formData.append('categoria', data.categoria);
    formData.append('subcategoria', data.subcategoria);
    formData.append('ciudadano', data.ciudadano);
    formData.append('descripcion', data.descripcion);
    formData.append('direccion_geo', data.direccion_geo);
    fotos.forEach((foto, index) => {
      formData.append('foto' + index, foto);
    });
    return this.http.post(this.url + 'registrar_incidente_denuncia', formData, { headers: headers });
  }
  
  registrarIncidenteDenunciaAPP(token: any, data: any, foto:any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token
    });    
    const formData = new FormData();
    formData.append('categoria', data.categoria);
    formData.append('subcategoria', data.subcategoria);
    formData.append('ciudadano', data.ciudadano);
    formData.append('descripcion', data.descripcion);
    formData.append('direccion_geo', data.direccion_geo);
    formData.append('foto', foto);
    return this.http.post(this.url + 'registrar_incidente_app', formData, { headers: headers });
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
