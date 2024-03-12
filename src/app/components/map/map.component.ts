import { Component, AfterViewInit, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
//import { LatLng, geoJSON, Map, tileLayer, control, layerGroup, featureGroup, LeafletMouseEvent, LeafletEventHandlerFn, marker, Marker, icon} from 'leaflet';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreateIncidentesDenunciaComponent } from '../incidentes-denuncia/create-incidentes-denuncia/create-incidentes-denuncia.component';
import { CreateFichaSectorialComponent } from '../ficha-sectorial/create-ficha-sectorial/create-ficha-sectorial.component';
import { HelperService } from 'src/app/services/helper.service';
import iziToast from 'izitoast';
import * as $ from 'jquery';
import * as turf from '@turf/turf';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateDireccionGeoComponent } from '../direccion-geo/create-direccion-geo/create-direccion-geo.component';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { from } from 'rxjs';
import { Capacitor, Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
import 'jquery.finger';
import { SpinnerComponent } from 'src/app/spinner/spinner.component';
declare global {
  interface JQueryStatic {
      Finger: any;
  }
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,AfterViewInit {

  //ELEMENTREF
  @ViewChild('modalContent') modal: ElementRef |undefined;
  @ViewChild('modalContentUbicacion') modalubicacion: ElementRef |undefined;
  @ViewChild('modalCambiodeUbicacion') modalcambioubicacion: ElementRef |undefined;

  //VARIABLES
  showCrosshair: boolean = false;
  public map: L.Map|undefined ;
  wfsPolylayerWifi: any;
  wfsSelangorWifi= L.featureGroup();
  url=GLOBAL.url;
  myControl = new FormControl();
  public filter:any=[];
  showOptions: boolean = false;
  wfsSelangor = L.featureGroup();
  busquedaLayer= L.featureGroup();
  latitud: number=0;
  longitud: number=0;
  wfsPolylayer: any;
  buscarPolylayer: any;
  capasInteractivas: any[] = [];
  editing:boolean=false;
  googleStreets:any
  lista_feature:any=[];
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
  capaActiva: boolean = true;
  capaActivaWIFI: boolean = true;
  urlgeoserwifi="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Apuntos-wifi&outputFormat=application%2Fjson";
  urlgeoser="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson";  
  urlgeolocal="http://192.168.120.35/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson";
  token=this.helperService.token()||undefined;
  //CONSTRUCTOR
  constructor(private modalService: NgbModal,private helperService:HelperService,config: NgbPopoverConfig, private router: Router){
    // Configuración global de popovers
    config.autoClose = 'outside';
    config.triggers = 'mouseenter';
  }

  //IMPLEMENTOS
  check:any={};

  async ngOnInit(): Promise<void> {
    this.helperService.setMapComponent(this);
    this.helperService.llamarspinner();
    try {
      this.check.IndexFichaSectorialComponent = await this.helperService.checkPermiso('IndexFichaSectorialComponent') || false;
      this.check.IndexIncidentesDenunciaComponent = await this.helperService.checkPermiso('IndexIncidentesDenunciaComponent')|| false;
      this.check.CreateIncidentesDenunciaComponent = await this.helperService.checkPermiso('CreateIncidentesDenunciaComponent')|| false;
      this.check.CreateFichaSectorialComponent = await this.helperService.checkPermiso('CreateFichaSectorialComponent') || false;
      this.check.CreateDireccionGeoComponent = await this.helperService.checkPermiso('CreateDireccionGeoComponent') || false;
      this.helperService.cerrarspinner();
      console.log(this.check);
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      this.router.navigate(['/error']);
    }
  
    this.helperService.deshabilitarMapa$.subscribe(() => {
      this.handleClick();
    });
    this.geoserve();
  }

  async ngAfterViewInit(): Promise<void> {
    
    let containers = document.querySelectorAll('.leaflet-control-container');
    containers.forEach(container => {
      container.addEventListener('click', (event) => {
        event.stopPropagation();
        // Aquí va el código que quieres ejecutar al hacer clic en los elementos
        console.log('Elemento clickeado:', container);
      });
    });
    
    containers = document.querySelectorAll('.leaflet-popup');
    containers.forEach(container => {
      container.addEventListener('click', (event) => {
        event.stopPropagation();
        // Aquí va el código que quieres ejecutar al hacer clic en los elementos
        console.log('Elemento clickeado:', container);
      });
    });
  }
  ngOnDestroy() {
    this.map?.remove(); // Elimina el mapa al destruir el componente
  }

  //MODALES
  abrirModalUbicacion(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.modal) {
        this.modalService.open(this.modalubicacion).result.then((result) => {
          resolve(result);
        }).catch(() => {
          resolve(false); // Si se cierra el modal sin seleccionar, se resuelve como false
        });
      } else {
        reject('Modal no encontrado');
      }
    });
  }
  abrirCambiaraUbicacion(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.modal) {
        this.modalService.open(this.modalcambioubicacion).result.then((result) => {
          resolve(result);
        }).catch(() => {
          resolve(false); // Si se cierra el modal sin seleccionar, se resuelve como false
        });
      } else {
        reject('Modal no encontrado');
      }
    });
  }
  abrirModalSeleccion(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.modal) {
        this.modalService.open(this.modal).result.then((result) => {
          resolve(result);
        }).catch(() => {
          resolve(''); // Si se cierra el modal sin seleccionar, se resuelve como false
        });
      } else {
        reject('Modal no encontrado');
      }
    });
  }
  modalCreateDirecion(){
    this.mostrarficha=false;
    this.mostrarincidente=false;
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(CreateDireccionGeoComponent, { centered: true });
    modalRef.componentInstance.valor = this.opcionb; 
  }
  //STYLES
  highlightFeature(e:any) {
    const layer = e.target;
    layer.setStyle({
        weight: 2,
        opacity: 1,
        color: '#0B5394',
        dashArray: '',
        fillOpacity: 0.7
    });
  } 
  resetHighlight(e:any) {
    const layer = e.target;
    layer.setStyle({
      fillColor: "#2986CC",
        weight: 2,
        opacity: 0.7,
        color: "#2986CC",
        dashArray: '3',
        fillOpacity: 0.5
    });
  }
  geojsonWFSstyle(feature:any) {
    return {
      fillColor: "#2986CC",
        weight: 2,
        opacity: 0.7,
        color: "#2986CC",
        dashArray: '3',
        fillOpacity: 0.5
    };
  }
  geojsonWFSstyle2(feature:any) {
    return {
      weight: 4,
      color: '#f00',
      fillColor:'#fff0',
      dashArray: '',
      fillOpacity: 0.7
    };
  }
  
  //HELPERS
  filterOptions(target?: any) {
    this.filter = this.lista_feature.filter((option:any) =>{
        if(option.properties.nombre&&option.properties.nombre.toLowerCase().includes(target.value.toLowerCase())){
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

  marcarlugar(latitud:any, longitud:any,message:string,zoom?:number){
    if (this.map) {
      // Borra todas las marcas existentes en el mapa
      this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
              this.map?.removeLayer(layer);
          }
      });

      // Añade la nueva marca al mapa
      const mark = L.marker([latitud, longitud], { icon: this.redIcon }).addTo(this.map);
      mark.bindPopup(message).openPopup();
      this.map.flyTo([latitud, longitud],zoom);//ZOOM 20
      }
  }

  async buscarfeature(latitud:any, longitud:any){
    if(this.lista_feature.length==0){
      await this.getWFSgeojson(this.urlgeoser);
    }
    const puntoUsuario = turf.point([longitud, latitud]);
    for (const feature of this.lista_feature) {
      if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates[0] && feature.geometry.coordinates[0][0].length > 4) {
        const poligono = turf.polygon(feature.geometry.coordinates[0]);
        if (turf.booleanContains(poligono, puntoUsuario)) {
          console.log('El usuario está dentro del polígono:', feature);
          await this.buscar(feature);
          return feature;
        }
      }
    }
    iziToast.info({ title: 'Info', position: 'bottomRight', message: 'Perdón, no te encuentras en nuestros barrios registrados' });
    return null;
  }

  async obtenerDireccion(latitud:any, longitud:any) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const direccion = data.display_name;
            console.log('Dirección:', data,data.display_name);
            //this.obtenerLatLong(data.addresss);
            return data.address;
            
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
  }

  async obtenerLatLong(direccion: string) {
    // Delimitar la búsqueda a Ecuador y a la provincia de Esmeraldas
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}, Esmeraldas, Ecuador&format=json`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latitud = data[0].lat;
                const longitud = data[0].lon;
                console.log('Latitud:', latitud, 'Longitud:', longitud);
                //this.marcarlugar(latitud,longitud);
                return { latitud, longitud };
            } else {
                throw new Error('No se encontraron resultados para la dirección proporcionada.');
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
            throw error;
        });
}

isMobil() {
  return Capacitor.isNativePlatform();
}
  selectficha(e:any){    
    this.opcionb=e;
    this.fichaTecnica();
  }

  deshabilitarArrastreZoom() {
    if(this.map){
      console.log('Deshabilitar');
      this.map.dragging.disable();
      this.map.scrollWheelZoom.disable();
    }
  } 

  handleClick() {
    this.mostrarficha=false;
    this.mostrarincidente=false;
    if (this.map) {
      console.log('habilitar');
      this.map.dragging.enable();
      this.map.scrollWheelZoom.enable();
      
    }
  } 
  enablehandleClick() {
    if (this.map) {
      console.log('habilitar');
      this.map.dragging.enable();
      this.map.scrollWheelZoom.enable();
      this.map.off('click', this.onClickHandlerMap);
      // Remover la capa de búsqueda del control de capas
      this.map.removeLayer(this.busquedaLayer);
    }
  } 
  disablehandliClick(){
    if (this.map) {
      console.log('habilitar');
      this.map.dragging.enable();
      this.map.scrollWheelZoom.enable();
      this.map.on('click', this.onClickHandlerMap);
      // Añadir la capa de búsqueda al control de capas
      this.map.addLayer(this.busquedaLayer);
    }
  }
  guardarfeature(data:any){
    if(data.features){
      var aux=[];
      aux.push(data.features);
      this.lista_feature=aux[0];
      console.log(this.lista_feature);
      this.filter = this.lista_feature;
    }
  }
  selectmap(e:any){
    this.opcionb=e;
   // this.nuevoIncidente();
  }
  //EVENTOS
  onDragStart() {
    this.editing=false;
    console.log('Inicio de arrastre',this.editing);
  }
  
  onDragEnd() {
    this.editing=true;
    console.log('Fin de arrastre',this.editing);
  }  
  
  stopPropagation(event: Event) {
    event.stopPropagation();    
  }
  
  onClickHandler = async (e: any) => {
    console.log('Latitud:', e.latlng.lat);
      console.log('Longitud:', e.latlng.lng);
      this.latitud = e.latlng.lat;
      this.longitud = e.latlng.lng;
      this.myControl.setValue((this.latitud+';'+this.longitud).toString());

  };

  onClickHandlerMap= async (e: any) =>{
    if (!this.editing){
      if(this.map){
        console.log('Latitud:', e.latlng.lat);
        console.log('Longitud:', e.latlng.lng);
        this.latitud = e.latlng.lat;
        this.longitud = e.latlng.lng;
        this.myControl.setValue((this.latitud+';'+this.longitud).toString());
        // Eliminar todas las marcas existentes en el mapa
          this.map.eachLayer((layer) => {
            if (layer instanceof L.Marker && this.map) {
                  this.map.removeLayer(layer);
              }
          });

          if(this.check.CreateIncidentesDenunciaComponent||!this.token){
            // Crea un marcador en las coordenadas especificadas
            const mark = L.marker([this.latitud, this.longitud], { icon: this.redIcon }).addTo(this.map);
            // Si deseas añadir un popup al marcador
            mark.bindPopup('Ubicación elegida').openPopup();
            this.map.flyTo([this.latitud, this.longitud], 14);
          }
         
          const puntoUsuario = turf.point([this.longitud,this.latitud]);
          for (const feature of this.lista_feature) {
            if(feature.geometry&&feature.geometry.coordinates&&feature.geometry.coordinates[0]&&feature.geometry.coordinates[0][0].length>4){
              const poligono = turf.polygon(feature.geometry.coordinates[0]);
              
              if (turf.booleanContains(poligono, puntoUsuario)) {
                console.log('El usuario está dentro del polígono:', feature);
                await this.buscar(feature);
                break; // Si solo quieres saber en qué polígono está, puedes detener el bucle aquí
              }
            }           
          }
        }

    }
  }
  
  //MACROS
  geoserve(){
    this.map = new L.Map('mapid').setView([0.977035, -79.655415], 15);
    // Agregar evento de inicio de dibujo al mapa
    this.map.on('dragstart', this.onDragStart);

    // Agregar evento de fin de dibujo al mapa
    this.map.on('dragend', this.onDragEnd);
       // Agregar el evento de clic al mapa con el handler definido anteriormente
       this.map.on('click', this.onClickHandlerMap);


    this.map.addLayer(this.wfsSelangor);
    this.map.addLayer(this.wfsSelangorWifi);

    this.googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 25,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);
    if(!this.googleStreets){
      iziToast.error({
        title:'Error',
        position:'bottomRight',
        message:'Sin Conexión a Google'
      })
    }
    this.getWFSgeojson(this.urlgeoser);
    //this.reloadmap();
    // Crear la capa de búsqueda
    this.busquedaLayer = L.featureGroup().addTo(this.map);
    const google=this.googleStreets;
    L.control.layers({google}, {'Barrios':this.wfsSelangor,'Puntos WIFI':this.wfsSelangorWifi,'Búsqueda': this.busquedaLayer}).addTo(this.map);
  }

  //CARGA DE FEATURE
  reloadWifi() {
    if (this.capaActivaWIFI) {
      if(this.wfsPolylayerWifi){
        this.wfsSelangorWifi.addLayer(this.wfsPolylayerWifi);
      }else{
        this.wfsPolylayerWifi = [];
        this.wfsSelangorWifi.clearLayers();
        this.getWFSgeojson(this.urlgeoserwifi).then((e) => {
            (this.wfsPolylayerWifi = L.geoJSON([e], {
                pointToLayer: (feature, latlng) => {
                    let markerLayer = L.marker(latlng, {
                        icon: L.icon({
                            iconSize: [25, 41],
                            iconAnchor: [13, 41],
                            popupAnchor: [0, -41],
                            iconUrl: "./assets/icon/router-fill.svg"
                        })
                    }).bindPopup(`
                    <div style="font-family: Arial, sans-serif; font-size: 14px; width:200px">
                    <b style="text-align: center; font-size: 9px;">${feature.properties.punto}</b></div>
                    `,{autoClose:false,closeOnClick:false}).on('click', () => {
                      if(this.map){
                        this.map.setView(latlng, 18); // Zoom al hacer clic en el marcador
                      }
                    });
                    // Abre el popup al agregar el marcador
                    //markerLayer.openPopup();
                    return markerLayer;
                },
            }).addTo(this.wfsSelangorWifi!));
        });
      }
      this.capaActivaWIFI=false;
      this.capaActivaWIFIpop=true;
    }else{
      this.wfsSelangorWifi.clearLayers();
      this.capaActivaWIFI=true;
    }

   

  }
  capaActivaWIFIpop:boolean=true;
  activarPopups() {
    if(this.capaActivaWIFIpop){
      // Obtener todas las capas de la featureGroup
      const layers = this.wfsSelangorWifi.getLayers();
        
      // Iterar sobre cada capa
      layers.forEach((layer: any) => {
        // Obtener el marcador de la capa
        const marker = layer.getLayers();
        marker.forEach((element:any) => {
          if (element && element.getLatLng()) {
            // Abrir el popup del marcador sin que se cierre automáticamente ni al hacer clic en él
            element.openPopup();
          }
        });
        
      });
      this.capaActivaWIFIpop=false;
    }else{
      this.wfsSelangorWifi.clearLayers();
      this.capaActivaWIFIpop=true;
      this.capaActivaWIFI=true;
    }
    
  }
  
  constwfsSelangor:any;
  reloadmap() {
    if (this.capaActiva) {
      if(this.wfsPolylayer){
        this.wfsSelangor.addLayer(this.wfsPolylayer);
      }else{
        this.wfsPolylayer = [];
        this.wfsSelangor.clearLayers();
        this.getWFSgeojson(this.urlgeoser).then((e) => {
          this.wfsPolylayer = L.geoJSON([e], {
            onEachFeature: (e, t) => {
              t.on({ mouseover: this.highlightFeature, mouseout: this.resetHighlight });
              t.bindPopup(`
                <img src="${this.url}helper/obtener_portada_barrio/${e.id}" alt="Descripción de la imagen" class="imagen-popup" style="
                  width: 100%;
                  height: 150px;
                  object-fit: cover;
                ">
                <div style="font-family: Arial, sans-serif; font-size: 14px; width:200px" (click)="stopPropagation($event)">
                  <b style="text-align: center;">${e.properties.nombre}</b>
                  <ul style="list-style-type: none; padding-left: 0;">
                    <li><strong>Parroquia:</strong> ${e.properties.parr}</li>                          
                  </ul>
                </div>
              `);
              t.bindTooltip(e.properties.nombre);
              t.on('popupopen', async (popupEvent) => {
                this.buscar(e); // seleccionar barrio con un click en el mapa
              });
            },
            style: this.geojsonWFSstyle,
          });        
          this.wfsSelangor.addLayer(this.wfsPolylayer);
        });
        
      }   
      this.capaActiva=false;
    } else {
      this.wfsSelangor.clearLayers();
      this.capaActiva=true;
    }
  }

  //CONEXION DE FEATURE
  async getWFSgeojson(url:any) {
    try {
      const response = await fetch(url);
      const data = await response.json();     
      if(this.lista_feature.length==0){
        this.guardarfeature(data);
      }
      console.log(data);
      return data;
    } catch (error) {
      iziToast.error({
        title:'Error:',
        position:'bottomRight',
        message:'Sin Conexión a Geoserver'
      });
      console.log('Error fetching WFS geojson:', error);
      return null;
    }
  }
  

  //BUSQUEDAS
  async buscar(opcion:any){      
    this.opcionb=opcion; 
    this.myControl.setValue(this.opcionb.properties.nombre);
    this.buscarPolylayer=[];
    // Vaciar busquedaLayer
    this.busquedaLayer.clearLayers();
    if(this.check.CreateDireccionGeoComponent){
      this.buscarPolylayer = L.geoJSON(opcion, { style: this.geojsonWFSstyle2,})
      .bindPopup(`
          <img src="${this.url}helper/obtener_portada_barrio/${opcion.id}" alt="Descripción de la imagen" class="imagen-popup" style="
          width: 100%;
          height: 150px;
          object-fit: cover;
        ">
        <div class="leaflet-popup-content" style="width: 200px;">
          <div style="font-family: Arial, sans-serif; font-size: 14px; width:200px" (click)="stopPropagation($event)">
            <b style="text-align: center;">${opcion.properties.nombre}</b>
            <ul style="list-style-type: none; padding-left: 0;">
              <li><strong>Parriquia:</strong> ${opcion.properties.parr}</li>
              <li>
                <button class="btn btn-secondary mt-3" id="fichaButton">
                  <strong><i class="bi bi-camera2"></i></strong>
                </button>
              </li>
            </ul>
          </div>
        </div>
          `).addTo(this.busquedaLayer);
    }else{
      this.buscarPolylayer = L.geoJSON(opcion, { style: this.geojsonWFSstyle2,})
      .bindPopup(`
          <img src="${this.url}helper/obtener_portada_barrio/${opcion.id}" alt="Descripción de la imagen" class="imagen-popup" style="
          width: 100%;
          height: 150px;
          object-fit: cover;
        ">
        <div class="leaflet-popup-content" style="width: 200px;">
          <div style="font-family: Arial, sans-serif; font-size: 14px; width:200px" (click)="stopPropagation($event)">
            <b style="text-align: center;">${opcion.properties.nombre}</b>
            <ul style="list-style-type: none; padding-left: 0;">
              <li><strong>Parriquia:</strong> ${opcion.properties.parr}</li>
            </ul>
          </div>
        </div>
          `).addTo(this.busquedaLayer);
    }
  

     // Agrega un event listener al botón cuando se abra el popup
     this.buscarPolylayer.on('popupopen', (e:any) => {
      this.bton = document.getElementById('fichaButton');
      if (this.bton) {
          this.bton.addEventListener('click', () => {
              this.modalCreateDirecion();
            });
        }        
    });

    // Elimina el event listener cuando se cierre el popup
    this.buscarPolylayer.on('popupclose', (e:any) => {
      if(this.check.CreateIncidentesDenunciaComponent){
          this.buscarPolylayer.on('click', (e:any) => {
              console.log('tap');
              console.log('Latitud:', e.latlng.lat);
              console.log('Longitud:', e.latlng.lng);
              this.latitud = e.latlng.lat;
              this.longitud = e.latlng.lng;
              this.map?.closePopup();
              
              this.marcarlugar(this.latitud,this.longitud,'Ubicación Seleccionada');
          });
      }
      

      let bton = document.getElementById('fichaButton');
      if (bton) {
          bton.removeEventListener('click', () => {
              this.modalCreateDirecion();
          });
      }
    });
 
  /*
    if(this.isMobile()){
      this.buscarPolylayer.on('tap', (e:any) => {
        console.log('tap');
        this.onClickHandlerMap(e);
      });
    }else{
      this.buscarPolylayer.on('mousedown', (e:any) => {
        console.log('mousedown');
        this.longPressTimeout = setTimeout(() => {
          // Aquí puedes llamar a tu función para manejar el clic sostenido
          this.onClickHandlerMap(e);
          }, 500); // Tiempo en milisegundos para considerar como clic sostenido
      });
  
      this.buscarPolylayer.on('mouseup', () => {
        console.log('mouseup');
        clearTimeout(this.longPressTimeout);
      });
  
      this.buscarPolylayer.on('dblclick', (e:any) => {
        console.log('dblclick');
        this.onClickHandlerMap(e)
      } );
  
    }
*/



    // Mover el mapa hacia el feature seleccionado
    this.map?.fitBounds(this.buscarPolylayer.getBounds(),{ maxZoom: 15 });//{ maxZoom: 20 }
    
    this.showOptions = false;
  }

  //UBICACIÓN GPS
  async getLocation() {
    if(this.isMobil()){
      const permission = await Geolocation['requestPermissions']();
      console.log(permission);
    }else{
      iziToast.info({title:'Info',position:'bottomRight',message:'Tu ubicación puede ser no exacta'})
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {          
          console.log(position,position.coords.longitude, position.coords.latitude);
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
          await this.obtenerDireccion(this.latitud,this.longitud);   
          this.marcarlugar(this.latitud,this.longitud,'Ubicación actual');      
          await this.buscarfeature(this.latitud,this.longitud);
        },
        (error) => {
          console.error('Error getting location: ' + error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }


  //AGREGAR FICHA E INCIDENTE
  nuevoFicha(){
    const data = this.opcionb; // JSON que quieres enviar
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(CreateFichaSectorialComponent, { centered: true });
    modalRef.componentInstance.data = data; 
  }
  async nuevoIncidente() {
    const data = this.opcionb; // JSON que quieres enviar
    this.modalService.dismissAll();    
    const modalRef = this.modalService.open(CreateIncidentesDenunciaComponent, { centered: true });
    modalRef.componentInstance.data = data; 
    modalRef.componentInstance.direccion={latitud:this.latitud,longitud:this.longitud}
    
  }

  //LISTAR FICHA E INCIDENTE
  fichaTecnica(){
    this.mostrarficha=false;
    this.mostrarincidente=false;
    if(this.opcionb){
      this.mostrarficha=true;
    } 
    if(this.map){
      if(this.mostrarficha){
        console.log('Deshabilitar');
        // Deshabilitar interacción con el mapa
        this.map.dragging.disable();
        this.map.scrollWheelZoom.disable();
      } 
    }   
  }
  incidente() {
    this.mostrarficha=false;
    this.mostrarincidente=false;
    if(this.opcionb){
      this.mostrarincidente=true;
    } 
    if(this.map){
      if(this.mostrarincidente){
        console.log('Deshabilitar');
        // Deshabilitar interacción con el mapa
        this.map.dragging.disable();
        this.map.scrollWheelZoom.disable();
      }
    }
  }

}

/*
          <li>
              <button class="btn btn-secondary mt-3" id="incidenteButton">
                  <strong>Generar Incidente o Denuncia</strong>
              </button>
          </li>
          <li>
              <button class="btn btn-secondary mt-3" id="fichaButton">
                  <strong>Buscar Ficha Técnicas</strong>
              </button>
          </li>
 */
    // Agrega un event listener al botón cuando se abra el popup
    /*this.buscarPolylayer.on('popupopen', async (popupEvent:any) => {
      // console.log(e);
      if (!this.editing){
        if(this.map){
          let res=await this.abrirModalSeleccion();
          if(res=='barrio'){
            this.map.eachLayer((layer) => {
              if (layer instanceof Marker && this.map) {
                  this.map.removeLayer(layer);
              }
             });
             this.myControl.setValue(this.opcionb.properties.nombre);
          }else if(res=='coordenadas'){
            
              // Eliminar todas las marcas existentes en el mapa
                this.map.eachLayer((layer) => {
                  if (layer instanceof Marker && this.map) {
                      this.map.removeLayer(layer);
                  }
              });
              // Crea un marcador en las coordenadas especificadas
              const mark = marker([this.latitud, this.longitud], { icon: this.redIcon }).addTo(this.map);
              // Si deseas añadir un popup al marcador
              mark.bindPopup('Lugar seleccionado').openPopup();
              this.map.flyTo([this.latitud, this.longitud], 20);
            
          }
        }
      }});*/
/*
                  if (!this.editing){
                    if(this.map){
                      let res=await this.abrirModalSeleccion();
                      // Eliminar todas las marcas existentes en el mapa
                      this.map.eachLayer((layer) => {
                        if (layer instanceof Marker && this.map) {
                            this.map.removeLayer(layer);
                        }
                       });
                      if(res=='barrio'){
                        this.buscar(e);// seleccionar barrio con un click en el mapa
                      }
                      else if(res=='coordenadas'){
                                               
                          // Crea un marcador en las coordenadas especificadas
                          const mark = marker([this.latitud, this.longitud], { icon: this.redIcon }).addTo(this.map);
                          // Si deseas añadir un popup al marcador
                          mark.bindPopup('Lugar seleccionado').openPopup();
                          this.map.flyTo([this.latitud, this.longitud], 20);
                        
                      }
                    }                   
                  }*/

               /* // Elimina el event listener cuando se cierre el popup
                t.on('popupclose', (popupEvent) => {
                  let bton = document.getElementById('incidenteButton');
                  if (bton) {
                      bton.removeEventListener('click', () => {
                          this.selectmap(e);
                      });
                  }
                });   

                // Agrega un event listener al botón cuando se abra el popup
                t.on('popupopen', (popupEvent) => {
                  this.bton = document.getElementById('fichaButton');
                  if (this.bton) {
                      this.bton.addEventListener('click', () => {
                          this.selectficha(e);
                        });
                    }
                    
                  
                    
                });
                // Elimina el event listener cuando se cierre el popup
                t.on('popupclose', (popupEvent) => {
                  let bton = document.getElementById('fichaButton');
                  if (bton) {
                      bton.removeEventListener('click', () => {
                          this.selectficha(e);
                      });
                  }
                }); */   










    
    /*this.buscarPolylayer.on('popupopen', async (popupEvent:any) => {
      // console.log(e);
      if (!this.editing){
        if(this.map){
          let res=await this.abrirModalSeleccion();
          if(res=='barrio'){
            this.map.eachLayer((layer) => {
              if (layer instanceof Marker && this.map) {
                  this.map.removeLayer(layer);
              }
             });
             this.myControl.setValue(this.opcionb.properties.nombre);
          }else if(res=='coordenadas'){
            
              // Eliminar todas las marcas existentes en el mapa
                this.map.eachLayer((layer) => {
                  if (layer instanceof Marker && this.map) {
                      this.map.removeLayer(layer);
                  }
              });
              // Crea un marcador en las coordenadas especificadas
              const mark = marker([this.latitud, this.longitud], { icon: this.redIcon }).addTo(this.map);
              // Si deseas añadir un popup al marcador
              mark.bindPopup('Lugar seleccionado').openPopup();
              this.map.flyTo([this.latitud, this.longitud], 20);
            
          }
        }
      }});
      */


   /* // Capas base
  private streetLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });
  private satelliteLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
  });
  private nexrad = tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
  });
  private geoJsonData:GeoJSON.Feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-79.65537285409525,0.9768760316928443 ],
        [-79.65556865534106,0.9775867136853513],
        [-79.65618824558464,0.977423122749466],
        [-79.65612119036348,0.9767312134570653],
        [-79.65571081240992,0.9767902134797914]
        ]
      ]
    },
    properties: {
      name: 'Mi Zona',
      color: 'green'
    }
  };

  inicio() {
    if (this.map) {
      this.map.remove();
    }
    this.rendermap([0.977035, -79.655415], 20);
  }
  rendermap(coordenadas:[number,number],zoom:number){
    if(this.map){
      this.map?.remove();
    }
    // Crea el mapa y establece la vista
    this.map = new Map('mapid').setView(coordenadas,zoom);

    // Capa superpuesta (por ejemplo, tu zona)
    
    const zonaLayer = geoJSON(this.geoJsonData, {
      style: {
        fillColor: 'green',
        weight: 2,
        color: 'white',
        fillOpacity: 0.5
      }
    });
    const overlayGroup = layerGroup([this.satelliteLayer, this.nexrad]);
    // Agrega capas al control de capas
    const baseLayers = {
      'Mapa de Calles': this.streetLayer,
      'Imágenes Satelitales': this.satelliteLayer
    };

    const overlays = {
      'Mi Zona': zonaLayer,
      'NEXRAD Overlay': this.nexrad,
    };
    // Agrega el control de capas al mapa
    control.layers(baseLayers, overlays).addTo(this.map);

    // Establece la capa de calle como predeterminada
    this.streetLayer.addTo(this.map);
  }*/