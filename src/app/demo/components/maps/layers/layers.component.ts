import { Component, AfterViewInit, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter, QueryList, ViewChildren, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import * as turf from '@turf/turf';
import { GLOBAL } from 'src/app/demo/services/GLOBAL';
import { Subscription, debounceTime, map } from 'rxjs';
import { Capacitor, Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
import { MenuItem, MenuItemCommandEvent, MessageService} from 'primeng/api';
declare global {
  interface JQueryStatic {
      Finger: any;
  }
}
import { FormControl, FormGroup } from '@angular/forms';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { SpeedDial } from 'primeng/speeddial';
import { HelperService } from 'src/app/demo/services/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Loader } from '@googlemaps/js-api-loader';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { CreateFichaSectorialComponent } from '../ficha-sectorial/create-ficha-sectorial/create-ficha-sectorial.component';
import { CreateIncidentesDenunciaComponent } from '../incidentes-denuncia/create-incidentes-denuncia/create-incidentes-denuncia.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
interface ExtendedPolygonOptions extends google.maps.PolygonOptions {
  id?: string;
}
@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrl: './layers.component.scss',
  providers: [MessageService]
})

export class LayersComponent implements OnInit{
  @ViewChildren(SpeedDial) speedDials: QueryList<SpeedDial> | undefined;
  @ViewChild('formulariomap', { static: true }) formularioMapRef!: ElementRef;
  /*loader = new Loader({
    apiKey: "AIzaSyAnO4FEgIlMcRRB0NY5bn_h_EQzdyNUoPo",
    version: "weekly",
    libraries: ["places"]
  });*/
  mapOptions = {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 4
  };
  mapCustom: google.maps.Map;
  markers: google.maps.Marker[] = [];
  //VARIABLES
  showCrosshair: boolean = false;
  url=GLOBAL.url;
  myControl = new FormControl();
  public filter:any=[];
  showOptions: boolean = false;
  latitud: number=0;
  longitud: number=0;
  wfsPolylayer: any;
  buscarPolylayer: any;
  capasInteractivas: any[] = [];
  editing:boolean=false;
  googleStreets:any
  lista_feature:any=[]=[];
  bton:any
  opcionb:any
  color = 'red'; // Cambia 'red' por el color deseado
  iconUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="${this.color}" width="14" height="14">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
  </svg>`;

  redIcon = L.icon({
    iconUrl: this.iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  isLongPress = false;
  longPressTimeout: any;  
  mostrarCreateDireccion=false;
  mostrarficha=false;
  mostrarincidente=false;
  capaActiva: boolean = false;
  capaActivaWIFI: boolean = true;
  urlgeoserwifi="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Apuntos-wifi&outputFormat=application%2Fjson";
  urlgeoser="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson";  
  urlgeolocal="http://192.168.120.35/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson";
  token=this.helperService.token()||undefined;
  check:any={};
  sidebarVisible: boolean = false;
  private openInfoWindow: google.maps.InfoWindow | null = null;
  arr_polygon:any[]=[];
  canpopup: boolean = false;
  load_fullscreen: boolean = false;
  items: MenuItem[]=[];
  visible: boolean = false;
  temp_poligon:any;
  //CONSTRUCTOR
  fillColor=getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
  strokeColor = getComputedStyle(document.documentElement).getPropertyValue('--gray-900');
  fillColor2=getComputedStyle(document.documentElement).getPropertyValue('--blue-500');
  strokeColor2=getComputedStyle(document.documentElement).getPropertyValue('--blue-900');
  backgroundColor=getComputedStyle(document.documentElement).getPropertyValue('--surface-0');

  subscription!: Subscription;
  constructor(private modalService: NgbModal,private elementRef: ElementRef,private helperService:HelperService,private router: Router,private layoutService: LayoutService,private messageService: MessageService){
    this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            const documentStyle = getComputedStyle(document.documentElement);
            this.fillColor =  documentStyle.getPropertyValue('--primary-color');
            this.strokeColor = documentStyle.getPropertyValue('--gray-900');
            this.backgroundColor=documentStyle.getPropertyValue('--surface-0');
            this.actualizarpoligono();
        });
  }

  async ngOnInit() {
     try {
      this.check.IndexFichaSectorialComponent = this.helperService.decryptData('IndexFichaSectorialComponent') ||false; //await this.helperService.checkPermiso('IndexFichaSectorialComponent') || false;
      this.check.IndexIncidentesDenunciaComponent = this.helperService.decryptData('IndexIncidentesDenunciaComponent')|| false;
      this.check.CreateIncidentesDenunciaComponent = this.helperService.decryptData('CreateIncidentesDenunciaComponent') || false;
      this.check.CreateFichaSectorialComponent = this.helperService.decryptData('CreateFichaSectorialComponent') || false;
      this.check.CreateDireccionGeoComponent = this.helperService.decryptData('CreateDireccionGeoComponent')|| false;
      this.check.DashboardComponent = this.helperService.decryptData('DashboardComponent')|| false;
    } catch (error) {
      
      console.error('Error al verificar permisos:', error);
      this.router.navigate(['/notfound']);
    }
    console.log(this.check);
    this.updateItem();
    await this.getWFSgeojson(this.urlgeoser);
    this.helperService.setMapComponent(this); 
    this.initmap();
  }
  //CARGA DE TEMPLATE
  updateItem(){
    this.loadspeed = false;
    console.log(this.opcionb);
    this.items = [
      {
        icon: 'bi bi-crosshair',
        tooltipOptions: {
          tooltipLabel:'Ubicación',
          tooltipPosition:'right',
         //hideDelay:1000,
        },
        //visible:this.isMobil(),
        command: () => {          
          this.getLocation();
      
        },
      },
       {
        icon: 'pi pi-chart-bar',
        tooltipOptions: {
          tooltipLabel:'Estadística',
          tooltipPosition:'right',
         //hideDelay:1000,
        },
        visible:this.token&&this.opcionb&&this.check.DashboardComponent?true:false,
         command: () => {   
           console.log(this.token && this.opcionb && this.check.DashboardComponent,
             this.token ,
              this.opcionb ,
           this.check.DashboardComponent);
          this.sidebarVisible=true
        },
      },
      {
        icon: this.capaActiva? 'pi pi-eye':'bi bi-eye-slash-fill',
        tooltipOptions: {
          tooltipLabel:'Barrios',
          tooltipPosition:'right',
         //hideDelay:1000,
        },
        command: () => {
          (this.arr_polygon.length==0)?this.reloadmap():this.mostrarpoligono();              
        },
      },
      {
        icon: !this.capaActivaWIFI? 'bi bi-wifi':'bi bi-wifi-off',
        tooltipOptions: {
          tooltipLabel:'Puntos Wifi',
          tooltipPosition:'right',
          //hideDelay:1000,
        },
        command: () => {
          //this.stopPropagation(event.originalEvent);
          this.reloadWifi();             
        }
      },
      {
          icon: 'pi pi-book',
          tooltipOptions: {
            tooltipLabel:'Fichas Técnicas',
            tooltipPosition:'right',
           // hideDelay:1000,
          },
          visible: (this.opcionb||false)  && this.check.IndexFichaSectorialComponent,
          command: () => {
            //this.stopPropagation(event.originalEvent);
            this.fichaTecnica();             
          }
      },
      {
          icon: 'pi pi-pencil',
          tooltipOptions: {
            tooltipLabel:'Nuevas Ficha Técnica',
            tooltipPosition:'right',
           // hideDelay:1000,
          },
          visible:(this.opcionb||false) &&this.check.CreateFichaSectorialComponent,
          command: () => {
            //this.stopPropagation(event.originalEvent);
            this.nuevoFicha(); 
          }
      },
      {
          icon: 'pi pi-inbox',
          tooltipOptions: {
            tooltipLabel:'Incidentes',
            tooltipPosition:'right',
            //hideDelay:1000,
          },
         visible:(this.opcionb||false) &&this.check.IndexIncidentesDenunciaComponent,
          command: () => {
            //this.stopPropagation(event.originalEvent);
            this.incidente();//this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        
          }
      },
      {
        icon: 'pi pi-telegram',
        tooltipOptions: {
          tooltipLabel:'Nuevo Incidente',
          tooltipPosition:'right',
          //hideDelay:1000,
        },
        visible:((this.opcionb?true:false)&&this.check.CreateIncidentesDenunciaComponent && !(!this.latitud && !this.longitud))||(!this.token&&this.opcionb?true:false),
        command: () => {
          //this.stopPropagation(event.originalEvent);
          this.nuevoIncidente();//this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
  
        }
      }
    ];
    this.addtemplateSP();  
    this.addtemplateFR();  
  }
    addtemplateSP() {
      setTimeout(() => {
        this.loadspeed = true;      
        const speedDial = document.getElementsByTagName('p-speedDial')[0];
    
        // Verificar si el speedDial ya está en el mapa antes de agregarlo
        if (!this.isSpeedDialAdded()) {
          const customControlDiv = document.createElement('div');
          customControlDiv.appendChild(speedDial);
    
          // Añadir el speedDial al control solo si no está agregado
          this.mapCustom.controls[google.maps.ControlPosition.LEFT_TOP].push(customControlDiv);
        }
    
        if (this.speedDials) {
          this.speedDials.forEach((speedDial, index) => {
            speedDial.show();
          });
        }
      }, 1000);
    }
    addtemplateFR() {
      setTimeout(() => { 
        const formularioMap = this.formularioMapRef.nativeElement;
          if (this.load_fullscreen) {
          if (!this.isFormularioMapAdded()) {
                const customControlDiv = document.createElement('div');
                customControlDiv.appendChild(formularioMap);
                this.mapCustom.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv);
            }
          } else {
            // Quitar el div del mapa si está agregado
            if (this.isFormularioMapAdded()) {
                const formularioMapDiv = formularioMap.parentElement;
                formularioMapDiv.removeChild(formularioMap);
            }
          }
      }, 1000);
    }
    isFormularioMapAdded(): boolean {
    // Verificar si el formulario ya está en el mapa
    const mapControls = this.mapCustom.controls[google.maps.ControlPosition.TOP_CENTER].getArray();
    for (let i = 0; i < mapControls.length; i++) {
      const control = mapControls[i] as HTMLElement;
      if (control.contains(this.formularioMapRef.nativeElement)) {
        return true; // El formulario ya está agregado al mapa
      }
    }
    return false; // El formulario no está agregado al mapa
    }
    isSpeedDialAdded(): boolean {
      const speedDial = document.getElementsByTagName('p-speedDial')[0];
      const speedDialParent = speedDial.parentElement;
      return speedDialParent && speedDialParent.tagName === 'DIV' && speedDialParent.parentNode === this.mapCustom.getDiv();
    }

  //CONEXION DE FEATURE
  async getWFSgeojson(url:any) {
    try {
      const response = await fetch(url);
      const data = await response.json();     
      if(this.lista_feature.length==0){
        this.guardarfeature(data);
        //this.reloadmap(data);
      }
      return data;
    } catch (error) {
      //console.log('error:',error);
      ////console.log('Error fetching WFS geojson:', error);
      return null;
    }
  }

    guardarfeature(data:any){
      if(data.features){
        var aux=[];
        aux.push(data.features);
        this.lista_feature=aux[0];
        ////console.log(this.lista_feature);
        this.filter = this.lista_feature;
      }
    }
  //INICIALIZADOR DEL MAPA
  initmap() {
    const haightAshbury = { lat: 0.977035, lng: -79.655415 };
    this.mapCustom = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 15,
      center: haightAshbury,
      mapTypeId: "terrain",
      fullscreenControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
      }
    });
    this.initFullscreenControl();
    this.mapCustom.addListener('click', (event:any) => {
      this.onClickHandlerMap(event);
    });
  }
    initFullscreenControl(): void {
      const elementToSendFullscreen = this.mapCustom.getDiv().firstChild as HTMLElement;
      const fullscreenControl = document.querySelector(".fullscreen-control") as HTMLElement;
      this.mapCustom.controls[google.maps.ControlPosition.RIGHT_TOP].push(fullscreenControl);
      fullscreenControl.onclick = () => {
        if (this.isFullscreen(elementToSendFullscreen)) {
          this.mapCustom.setOptions( {mapTypeControl:true} );
          this.load_fullscreen = false;
          this.addtemplateSP();
          this.addtemplateFR();
          this.exitFullscreen();
        } else {
          this.load_fullscreen = true;
          this.mapCustom.setOptions( {mapTypeControl:false} );
          this.addtemplateSP();
          this.addtemplateFR();
          this.requestFullscreen(elementToSendFullscreen);
        }
      };

      document.onfullscreenchange = () => {
        if (this.isFullscreen(elementToSendFullscreen)) {
          fullscreenControl.classList.add("is-fullscreen");
        } else {
          fullscreenControl.classList.remove("is-fullscreen");
        }
      };
    }
    isFullscreen(element: any): boolean {
      return (
        (document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement) == element
      );
    }
    requestFullscreen(element:any) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullScreen) {
        element.msRequestFullScreen();
      }
    }
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
    
    onClickHandlerMap= async (e: any) =>{
      if(this.mapCustom){
        this.opcionb=false;
        this.latitud = e.latLng.lat();
        this.longitud = e.latLng.lng();
        this.myControl.setValue((this.latitud+';'+this.longitud).toString());
          
          this.poligonoposition();
      }
    }
  popupStates: boolean[] = [];
  // Adds a marker to the map and push to the array.
  addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral, tipo: 'Wifi' | 'Poligono' | 'Ubicación',message?: string,){
    this.deleteMarkers('Ubicación');
    const map = this.mapCustom
    const marker = new google.maps.Marker({
      position,
      map,
      label:tipo
    });
    // Cerrar el popup actualmente abierto
    if (this.openInfoWindow) {
      this.openInfoWindow.close();
    }

    // Abrir un nuevo popup con el nombre del barrio
    const infoWindow = new google.maps.InfoWindow({
      ariaLabel:tipo,
      content: message?message:'Marcador'
    });
    infoWindow.setPosition(position);
    infoWindow.open(this.mapCustom);

    this.openInfoWindow = infoWindow;
    this.markers.push(marker);
    this.popupStates.push(false);
    // Añade un listener para el evento 'click' en el marcador
    marker.addListener('click', () => {
      //this.mapCustom.setZoom(18);
      infoWindow.open(this.mapCustom, marker);
    });

    /*marker.addListener('click', () => {
      const index = this.markers.indexOf(marker);
      if (this.popupStates[index]) {
          this.openInfoWindow.close();
          this.popupStates[index] = false;
      } else {
          const infoWindow = new google.maps.InfoWindow({
              content: 'Contenido del popup'
          });
          infoWindow.open(this.mapCustom, marker);
          this.openInfoWindow = infoWindow;
          this.popupStates[index] = true;
      }
    });*/
  }

  // Sets the map on all markers in the array.
  setMapOnAll(map: google.maps.Map | null) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  hideMarkers(): void {
    this.setMapOnAll(null);
  }

  // Shows any markers currently in the array.
  showMarkers(): void {
    this.setMapOnAll(this.mapCustom);
  }

// Deletes all markers in the array by removing references to them.
  deleteMarkers(tipo:any): void {
    this.hideMarkers();
    this.markers = this.markers.filter(marker => marker.getLabel() !== tipo);
  }

  
  
  actualizarpoligono() {
    this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
        polygon.setOptions({
            fillColor: this.fillColor,
            strokeColor: this.strokeColor
        });
        polygon.setMap(null);
        polygon.setMap(this.mapCustom);
    });
  }

  mostrarpoligono() {
    if(this.capaActiva){
      this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
        polygon.setMap(null);
      });
      this.capaActiva=false;
    }else{
      this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
        polygon.setMap(this.mapCustom);
      });
      this.capaActiva=true;
    }
    this.updateItem();
  }

  borrarpoligonos() {
    this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
        polygon.setMap(null);
    });
    this.arr_polygon = [];
  }

  //IMPLEMENTOS
 

  reloadmap() {
    this.capaActiva = true;  
    this.arr_polygon = [];
      this.lista_feature.forEach((feature: any) => {
        this.poligonoview(false,feature);
      });     
    this.updateItem();
  }

  poligonoview(ver: boolean, featurecall: any) {
    if (typeof featurecall !== 'string') {
      const feature = featurecall;
    if (ver) {
      if(this.capaActiva){
        this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
          polygon.setMap(null);
        });
        this.capaActiva=false;
      }    
      //this.myControl.setValue(feature.properties.nombre);
      this.opcionb = feature;
      //console.log(this.opcionb);
    }
      const geometry = feature.geometry;
      const properties = feature.properties;

      if (geometry && properties) {
        const coordinates = geometry.coordinates;
        if (coordinates) {
          let paths: google.maps.LatLng[][] = [];

          coordinates.forEach((polygon: any) => {
            let path: google.maps.LatLng[] = [];
            polygon.forEach((ring: any) => {
              ring.forEach((coord: number[]) => {
                path.push(new google.maps.LatLng(coord[1], coord[0]));
              });
            });
            paths.push(path);
          });
          const polygonId = feature.id;
            const polygon = new google.maps.Polygon({
              paths: paths,
              strokeColor: !ver? this.strokeColor:this.strokeColor2,// "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor:!ver? this.fillColor:this.fillColor2,//"#FF0000",
              fillOpacity: 0.35,
              map: this.mapCustom,
              id:polygonId,
            } as ExtendedPolygonOptions);
          
          if (ver) {
            if(this.temp_poligon){this.temp_poligon.setMap(null);}
            this.temp_poligon = polygon;
            this.temp_poligon.setMap(this.mapCustom);
          } else {
            if (!this.arr_polygon.some(item => item.id == polygonId)) {
              this.arr_polygon.push(polygon);
            }
          }
          // Agregar evento de clic al polígono para mostrar el popup
          this.levantarpopup(polygon, feature);  
           // Trasladar el mapa a la posición del polígono si ver es true
          if (ver) {
            const bounds = new google.maps.LatLngBounds();
            paths.forEach(path => {
              path.forEach(latlng => {
                bounds.extend(latlng);
              });
            });
           // this.mapCustom.panToBounds(bounds);
            this.mapCustom.fitBounds(bounds); //zoom automatico
          }
        }        
      }
    }
    
  }
  poligonoposition() {
    let buscarbol = false;
    const puntoUsuario = turf.point([this.longitud,this.latitud]);
      for (const feature of this.lista_feature) {
        if(feature.geometry&&feature.geometry.coordinates&&feature.geometry.coordinates[0]&&feature.geometry.coordinates[0][0].length>4){
          const poligono = turf.polygon(feature.geometry.coordinates[0]);
          
          if (turf.booleanContains(poligono, puntoUsuario)) {
            
            //console.log('El usuario está dentro del polígono:', feature);
            //console.log(feature);
            this.opcionb = feature;
            /*if (this.check.DashboardComponent&&this.isMobil()) {
              this.sidebarVisible = true;
            }*/
            this.poligonoview(true, feature);
            buscarbol = true;
            this.updateItem();
            break;            
          }
      }           
    }
    if (!buscarbol) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Tu ubicación no se encuentra dentro de uno de los barrios' });
    }
    if(!this.mostrarficha&&this.check.CreateIncidentesDenunciaComponent||!this.token){
      this.addMarker({lat: this.latitud, lng: this.longitud},buscarbol?'Poligono':'Ubicación',buscarbol?this.opcionb.properties.nombre:undefined);
    }
  }
  popupsMostrados: { [key: string]: boolean } = {};

  levantarpopup(polygon: any, feature: any) {
    //this.canpopup = true;
    const featureId = feature.id;
    if(this.capaActiva){

      this.opcionb=false;
    }
    //

    polygon.addListener('click', (event:any) => {
      //console.log("632",!this.popupsMostrados[featureId], this.capaActiva,this.opcionb);
      if(!this.popupsMostrados[featureId]){
          // Cerrar el popup actualmente abierto
          if (this.openInfoWindow) {
            this.openInfoWindow.close();
        }
        const content= feature.properties.parr? `<img src="${this.url}helper/obtener_portada_barrio/${feature.id}" alt="Descripción de la imagen" class="imagen-popup" style="
            width: 100%;
            height: 150px;
            object-fit: cover;
          ">
          <div style="font-family: Arial, sans-serif; font-size: 14px; width:200px" (click)="stopPropagation($event)">
            <b style="text-align: center;">${feature.properties.nombre}</b>
            <ul style="list-style-type: none; padding-left: 0;">
              <li><strong>Parroquia:</strong> ${feature.properties.parr}</li>                          
            </ul>
          </div>
          `: `<img src="${this.url}helper/obtener_portada_barrio/${feature.id}" alt="Descripción de la imagen" class="imagen-popup" style="
            width: 100%;
            height: 150px;
            object-fit: cover;
          ">
          <div style="font-family: Arial, sans-serif; font-size: 14px; width:200px" (click)="stopPropagation($event)">
            <b style="text-align: center;">${feature.properties.nombre}</b>
          </div>
          `
          // Abrir un nuevo popup con el nombre del barrio
          const infoWindow = new google.maps.InfoWindow({
            content:content
          });
          infoWindow.setPosition(event.latLng);
          infoWindow.open(this.mapCustom);
          this.openInfoWindow = infoWindow;
          this.popupsMostrados[featureId] = true;
          //this.canpopup=false;
      } else {
        //this.popupsMostrados={}
        if (this.capaActiva) {
          this.popupsMostrados={}
          this.opcionb = feature;
          if (this.check.DashboardComponent&&this.isMobil()) {
            this.sidebarVisible = true;
          }else{
            this.latitud = event.latLng.lat();
            this.longitud = event.latLng.lng();
            this.addMarker({lat: this.latitud, lng: this.longitud},'Poligono',feature.properties.nombre);
          }
        }else{
          
          this.latitud = event.latLng.lat();
          this.longitud = event.latLng.lng();
          this.addMarker({lat: this.latitud, lng: this.longitud},'Poligono',feature.properties.nombre);
        }
      }
      
    });
  }

  responsiveimage():string{
    let aux=window.innerWidth-120;
    return (aux+'px').toString();
  }
  loadspeed=false;
  isMobil() {
    return this.helperService.isMobil();
  }

  async getLocation() {
    if(this.isMobil()){
      const permission = await Geolocation['requestPermissions']();
      ////console.log(permission);
      if (permission !== 'granted') {
        const coordinates = await Geolocation['getCurrentPosition']();
        ////console.log(coordinates);
      }
    }else{
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Tu ubicación puede ser no exacta' });
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {          
          ////console.log(position,position.coords.longitude, position.coords.latitude);
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
          this.updateItem();
          this.poligonoposition();
          //await this.obtenerDireccion(this.latitud,this.longitud);   
          this.addMarker({lat: this.latitud, lng: this.longitud},'Ubicación','Tu ubicación Actual');
          //this.marcarlugar(this.latitud,this.longitud,'Ubicación actual');      
          //await this.buscarfeature(this.latitud,this.longitud);
        },
        (error) => {
          ////console.error('Error getting location: ' + error.message);
        }
      );
    } else {
      ////console.error('Geolocation is not supported by this browser.');
    }
  }
  filterOptions(event?: any) {
    this.filter = this.lista_feature.filter((option:any) =>{
        if(option.properties.nombre&&option.properties.nombre.toLowerCase().includes(event.query.toLowerCase())){
          return option
        }
      }   
    ); 
    this.showOptions = true;
  }
  hideOptions() {
    setTimeout(() => {
      this.showOptions = false;
    }, 200);
  }
  arr_wifi:any[]=[];
 async reloadWifi() {
    if (this.capaActivaWIFI) {
        if (this.arr_wifi.length!=0) {
            this.arr_wifi.forEach(marker => marker.setMap(this.mapCustom));
        } else {
            this.arr_wifi = [];
            await this.getWFSgeojson(this.urlgeoserwifi).then((e) => {
                const geoJson = e;
                geoJson.features.forEach((feature: any) => {
                    const latlng = new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    const marker = new google.maps.Marker({
                        position: latlng,
                        map: this.mapCustom,
                        icon: {
                            url: "./assets/icon/router-fill.svg",
                            scaledSize: new google.maps.Size(25, 41),
                            anchor: new google.maps.Point(13, 41),
                        }
                    });
                    const infoWindow = new google.maps.InfoWindow({
                      content: `
                      <div style="font-family: Arial, sans-serif; font-size: 14px; width:200px">
                          <b style="text-align: center">${feature.properties.punto}</b>
                      </div>`
                    });
                    marker.addListener('click', () => {
                        this.mapCustom.setCenter(latlng);
                        //this.mapCustom.setZoom(18);
                        infoWindow.open(this.mapCustom, marker);
                    });

                    this.arr_wifi.push(marker);
                });
            });
            this.arr_wifi.forEach(marker => marker.setMap(this.mapCustom));
        }        
        this.capaActivaWIFI = false;
        //console.log(this.arr_wifi);
        //this.capaActivaWIFIpop = true;
    } else {
        this.arr_wifi.forEach(marker => marker.setMap(null));
        this.capaActivaWIFI = true;
    }

    this.updateItem();
}
  fichaTecnica() {
   this.controlFullScreem();
    this.mostrarficha=false;
    this.mostrarincidente=false;
    if(this.opcionb){
      this.mostrarficha=true;
    } 
    if(this.mapCustom){      
      //this.map.off('click', this.onClickHandlerMap);
      if(this.mostrarficha){
      } 
    }   
  }
  incidente() {
     this.controlFullScreem();
    this.mostrarficha=false;
    this.mostrarincidente=false;
    if(this.opcionb){
      this.mostrarincidente=true;
    } 
    if(this.mapCustom){
      if(this.mostrarincidente){
      }
    }
  }
  
  nuevoFicha() {
   this.controlFullScreem();
    const data = this.opcionb; // JSON que quieres enviar
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(CreateFichaSectorialComponent, { centered: true });
    modalRef.componentInstance.data = data; 
  }
  async nuevoIncidente() {
    if (!this.token) {
      this.router.navigate(["/auth/login"]);
    } else {
       this.controlFullScreem();
      const data = this.opcionb; // JSON que quieres enviar
      this.modalService.dismissAll();    
      const modalRef = this.modalService.open(CreateIncidentesDenunciaComponent, { centered: true });
      modalRef.componentInstance.data = data; 
      modalRef.componentInstance.direccion = { latitud: this.latitud, longitud: this.longitud };      
    } 
   
  }
  controlFullScreem() {
    const elementToSendFullscreen = this.mapCustom.getDiv().firstChild as HTMLElement;
    if (this.isFullscreen(elementToSendFullscreen)) {
      this.mapCustom.setOptions( {mapTypeControl:true} );
          this.load_fullscreen = false;
          this.addtemplateSP();
          this.addtemplateFR();
          this.exitFullscreen();
    }
  
  }
}