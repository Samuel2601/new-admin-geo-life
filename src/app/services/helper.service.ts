import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { AdminService } from './admin.service';
import { FilterService } from './filter.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MapComponent } from '../components/map/map.component';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private deshabilitarMapaSubject = new Subject<void>();

  deshabilitarMapa$ = this.deshabilitarMapaSubject.asObservable();

  deshabilitarMapa() {
    this.deshabilitarMapaSubject.next();
  }
  token(): string | null {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return token ? token : null;
  }
  
  actualizarToken(token:any){

  }
  
  constructor(private modalService: NgbModal,private router: Router, private adminService: AdminService,private filterService:FilterService) { }

  async checkPermiso(componente: any): Promise<boolean> {
    const token = this.token();
    if(!token){
      return false
    }
    const rolUsuario = this.adminService.roluser(token);
    if(!rolUsuario){
      return false;
    }
    try {
      const response = await this.filterService.tienePermiso(token, componente, rolUsuario._id).toPromise();
      return response.data ? true : false;
    } catch (error) {
      //console.error('Error al verificar el permiso:', error);
      return false;
    }
  }

  listpermisos() {
    const token = this.token();
    if (!token) {
      console.error('Token no válido');
      return;
    }
    const rolUsuario = this.adminService.roluser(token);
    if (!rolUsuario) {
      console.error('Rol de usuario no válido');
      return;
    }
    this.filterService.listpermisos(token, rolUsuario._id)
      .subscribe(
        response => {
          const data = response.data;
          for (let clave in data) {
            if (data.hasOwnProperty(clave)) {    
              let val=this.encryptData(data[clave],this.key);
              sessionStorage.setItem(clave,val);
            }
        }
        },
        error => {
          console.error('Error al obtener permisos:', error);
        }
      );
  }
  public key = 'buzon'; 
  // Función para cifrar la información
  encryptData(data: string, key: string): string {
    const dataString = data ? 'true' : 'false'; // Convertir booleano a cadena
    const encryptedData = CryptoJS.AES.encrypt(dataString, key).toString();
    return encryptedData;
  }

  // Función para descifrar la información
  decryptData(encryptedData: string): string {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }

  

  // Declara una variable para almacenar el estado del spinner
  llamadasActivas = 0;
  llamarspinner(mensaje?: string[], tiempo?: number) {
    if(this.llamadasActivas==0){
      const mensajesPredeterminados = ['Podrías ir por café mientras', 'Estamos cargando tu página', 'Esto puede tardar unos segundos'];
      const modalRef = this.modalService.open(SpinnerComponent, { centered: true, backdrop: 'static' });
      modalRef.componentInstance.show = true;
      if (mensaje) {
        mensaje.forEach((elemento, indice) => {
          setTimeout(() => {
            if (modalRef.componentInstance)modalRef.componentInstance.message = elemento;
          }, tiempo || 8000 * (indice));
        });
      } else {
        mensajesPredeterminados.forEach((elemento, indice) => {
          setTimeout(() => {
            if (modalRef.componentInstance)modalRef.componentInstance.message = elemento;
          }, tiempo || 8000 * (indice));
        });
      }
    }
    this.llamadasActivas++;
      
      console.log(this.llamadasActivas);
  }
  cerrarspinner(){
    this.llamadasActivas--;
    console.log(this.llamadasActivas);
    if(this.llamadasActivas==0){
      setTimeout(() => {      
        console.log('Cerrando');
        this.modalService.dismissAll();
        }, 500);
    }
  }
  private mapComponent: MapComponent | null = null;
  setMapComponent(mapComponent: MapComponent) {
    this.mapComponent = mapComponent;
  }

  marcarlugar(latitud: any, longitud: any, message: string) {
    if (this.mapComponent) {
      this.mapComponent.marcarlugar(latitud, longitud, message,17);
      this.mapComponent.enablehandleClick();
    }
  }
  disablehandliClick(){
    if (this.mapComponent) {
      this.mapComponent.disablehandliClick();
    }
  }
  enablehandliClick(){
    if (this.mapComponent) {
      this.mapComponent.enablehandleClick();
    }
  }
}
