import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class ListService {
  public url;
	
	constructor(private http: HttpClient) {
		this.url = GLOBAL.url+'list/';
	}
  
  listarUsuarios(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_usuarios', { headers: headers });
  }

  listarActividadesProyecto(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_actividades_proyecto', { headers: headers });
  }

  listarIncidentesDenuncias(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_incidentes_denuncias', { headers: headers });
  }
  listarCategorias(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_categorias', { headers: headers });
  }
  

  listarSubcategorias(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_subcategorias', { headers: headers });
  }

  listarEncargadosCategorias(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_encargados_categorias', { headers: headers });
  }

  listarRolesUsuarios(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_roles_usuarios', { headers: headers });
  }

  listarEstadosIncidentes(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_estados_incidentes', { headers: headers });
  }

  listarEstadosActividadesProyecto(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_estados_actividades_proyecto', { headers: headers });
  }

  listarTiposActividadesProyecto(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_tipos_actividades_proyecto', { headers: headers });
  }

  listarDireccionesGeo(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.get(this.url + 'listar_direcciones_geo', { headers: headers });
  }
  ListarPermisos(token: any): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: token,
		});
		return this.http.get(this.url + 'listar_permisos', { headers: headers });
	}
}
