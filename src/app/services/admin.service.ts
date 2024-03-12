import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
	providedIn: 'root',
})
export class AdminService {
	public url;
	
	constructor(private _http: HttpClient) {
		this.url = GLOBAL.url+'helper/';
	}
	login_admin(data: any): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'login_admin', data, { headers: headers });
	}
	forgotpassword(data: any): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'forgotpassword', data, { headers: headers });
	}
	newpassword(data: any, token: any): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: token,
		});
		return this._http.post(this.url + 'newpassword', data, { headers: headers });
	}
	listar_registro(token: any, desde: any, hasta: any): Observable<any> {
		let headers = new HttpHeaders({
		  'Content-Type': 'application/json',
		  Authorization: token,
		});
		
		// Usamos comillas inversas para interpolar las variables en la URL
		return this._http.get(`${this.url}listar_registro/${desde}/${hasta}`, { headers: headers });
	}
	verificar_token(token: any): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: token,
		});
		return this._http.get(this.url + 'verificar_token', { headers: headers });
	}
	identity(token:string){
		const helper = new JwtHelperService();
		var decodedToken = helper.decodeToken(token);
		return decodedToken.sub;
	}
	roluser(token:any){
		const helper = new JwtHelperService();
		var decodedToken = helper.decodeToken(token);
		return decodedToken.rol_user;
	}
	isAuthenticate() {
		const token: any = sessionStorage.getItem('token');

		try {
			const helper = new JwtHelperService();
			var decodedToken = helper.decodeToken(token);
			console.log(decodedToken);
			if (!token) {
				sessionStorage.clear();
				return false;
			}

			if (!decodedToken) {
				sessionStorage.clear();
				return false;
			}

			if (helper.isTokenExpired(token)) {
				sessionStorage.clear();
				return false;
			}
		} catch (error) {
			//console.log(error);

			sessionStorage.clear();
			return false;
		}

		return true;
	}
}
