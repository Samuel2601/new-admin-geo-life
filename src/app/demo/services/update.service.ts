import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import imageCompression from 'browser-image-compression';
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
    formData.append('rol_user', data.rol_user._id?data.rol_user._id:data.rol_user);
    formData.append('telefono', data.telefono);
    if (file) {
      formData.append('foto', file);
    }
    

    return this.http.put(this.url + 'actualizar_usuario/' + id, formData, { headers: headers });
  }

  actualizarActividadProyecto(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });    
    return this.http.put(this.url + 'actualizar_actividad_proyecto/' + id, data, { headers: headers });
}


  actualizarIncidenteDenuncia(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });
   
    // Llama a la función compressor para comprimir cada imagen
    return new Observable((observer) => {
      //console.log(data);
      const formData = new FormData();
      data.categoria?formData.append('categoria', data.categoria._id):'';
      data.subcategoria?formData.append('subcategoria', data.subcategoria._id):'';
      data.ciudadano?formData.append('ciudadano', data.ciudadano._id?data.ciudadano._id:data.ciudadano):'';
      data.descripcion?formData.append('descripcion', data.descripcion):'';
      data.estado?formData.append('estado', data.estado._id):'';
      data.respuesta?formData.append('respuesta', data.respuesta):'';
      data.encargado?formData.append('encargado', data.encargado):'';
      
      data.direccion_geo?formData.append('direccion_geo',JSON.stringify(data.direccion_geo)):'';
      formData.append('view', data.view);
      data.view_id?formData.append('view_id', data.view_id):'';
      data.view_date?formData.append('view_date', data.view_date):'';

      const compressedFilesPromises = data.evidencia.map((foto:any) => this.compressor(foto));
      Promise.all(compressedFilesPromises)
        .then((compressedFiles) => {
          compressedFiles.forEach((compressedFile, index) => {
            formData.append('evidencia' + index, compressedFile);
          });
          // Envía las imágenes comprimidas al servidor
          this.http.put(this.url + 'actualizar_incidente_denuncia/'+id, formData, { headers: headers })
            .subscribe(
              (response) => {
                observer.next(response);
                observer.complete();
              },
              (error) => observer.error(error)
            );
        })
        .catch((error) => observer.error(error));
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
  actualizarPermisos(token: any, id: string, data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this.http.put(this.url + 'actualizar_permisos/' + id, data, { headers: headers });
  }

    async compressor(image: any): Promise<Blob> {
    //console.log('originalFile instanceof Blob', image instanceof Blob); // true
    //console.log(`originalFile size ${image.size / 1024 / 1024} MB`);
  
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      // Comprime la imagen
      const compressedFile = await imageCompression(image, options);
      //console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      //console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
  
      return compressedFile;
    } catch (error) {
      //console.log(error);
      throw error;
    }
  }
  
}
