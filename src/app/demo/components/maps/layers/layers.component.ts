import { Component, AfterViewInit, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter, QueryList, ViewChildren, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import * as turf from '@turf/turf';
import { GLOBAL } from 'src/app/demo/services/GLOBAL';
import { Subscription, from, map } from 'rxjs';
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

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrl: './layers.component.scss',
  providers: [MessageService]
})

export class LayersComponent implements OnInit{

  loader = new Loader({
    apiKey: "AIzaSyAnO4FEgIlMcRRB0NY5bn_h_EQzdyNUoPo",
    version: "weekly",
    libraries: ["places"]
  });
  
  mapOptions = {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 4
  };
  mapCustom: google.maps.Map;
  markers: google.maps.Marker[] = [];

  // Adds a marker to the map and push to the array.
  addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
    const map = this.mapCustom
    const marker = new google.maps.Marker({
      position,
      map,
    });

    this.markers.push(marker);
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
  deleteMarkers(): void {
    this.hideMarkers();
    this.markers = [];
  }

  items: MenuItem[]=[];
  visible: boolean = false;



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
  fillColor=getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
  strokeColor=getComputedStyle(document.documentElement).getPropertyValue('--gray-900');
  backgroundColor=getComputedStyle(document.documentElement).getPropertyValue('--surface-0');

  private polygonColorsSubscription: Subscription;

  constructor(private modalService: NgbModal,private elementRef: ElementRef,private helperService:HelperService,private router: Router,private layoutService: LayoutService,private messageService: MessageService){
    this.polygonColorsSubscription = this.layoutService.configUpdate$.subscribe(colors => {
      console.log(colors);
      const documentStyle = getComputedStyle(document.documentElement);
      this.fillColor =  documentStyle.getPropertyValue('--primary-color');
      this.strokeColor = documentStyle.getPropertyValue('--gray-900');
      this.backgroundColor=documentStyle.getPropertyValue('--surface-0');
      this.recargarPoligonosEnMapa();
    });
  }
  actualizarpoligono() {
    this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
        polygon.setOptions({
            fillColor: this.fillColor,
            strokeColor: this.strokeColor
        });
    });
    //this.recargarPoligonosEnMapa();
  }
  recargarPoligonosEnMapa() {
    // Primero, limpiamos los polígonos del mapa
    this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
        polygon.setMap(null);
    });

    // Luego, actualizamos los colores de los polígonos
    this.actualizarpoligono();

    // Finalmente, agregamos los polígonos actualizados al mapa
    this.arr_polygon.forEach((polygon: google.maps.Polygon) => {
        polygon.setMap(this.mapCustom);
    });
}

  //IMPLEMENTOS
  check:any={};
  sidebarVisible: boolean = false;
  async ngOnInit() {
    this.updateItem();
    this.loader
      .importLibrary('maps')
      .then(async ({ Map }) => {
        const haightAshbury = { lat: 0.977035, lng: -79.655415 };
        this.mapCustom = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          zoom: 12,
          center: haightAshbury,
          mapTypeId: "terrain",
        });
        this.mapCustom.addListener('click', (event:any) => {
          this.onClickHandlerMap(event);
        });
        await this.getWFSgeojson(this.urlgeoser);
      })
      .catch((e) => {
        // Manejar errores de carga de maps
        console.error('Error al cargar el mapa:', e);
      });
  
    // Otras configuraciones
    this.helperService.setMapComponent(this);
    this.helperService.llamarspinner();
  }
  private openInfoWindow: google.maps.InfoWindow | null = null;
  arr_polygon:any[]=[];
  reloadmap(data:any): void {
  
    if (data.features) {
      data.features.forEach((feature: any) => {
        const geometry = feature.geometry;
        const properties = feature.properties;
        const id= feature.id

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

            const polygon = new google.maps.Polygon({
              paths: paths,
              strokeColor: this.strokeColor,// "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: this.fillColor,//"#FF0000",
              fillOpacity: 0.35,
              map: this.mapCustom
            });
            
            // Agregar evento de clic al polígono para mostrar el popup
            polygon.addListener('click', (event) => {
              // Cerrar el popup actualmente abierto
              if (this.openInfoWindow) {
                this.openInfoWindow.close();
              }

              // Abrir un nuevo popup con el nombre del barrio
              const infoWindow = new google.maps.InfoWindow({
                content: `<img src="${this.url}helper/obtener_portada_barrio/${id}" alt="Descripción de la imagen" class="imagen-popup" style="
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
              `
              });
              infoWindow.setPosition(event.latLng);
              infoWindow.open(this.mapCustom);
              this.openInfoWindow = infoWindow;
            });
            this.arr_polygon.push(polygon);
          }
          
        }
      });
    }
  }
  guardarfeature(data:any){
    if(data.features){
      var aux=[];
      aux.push(data.features);
      this.lista_feature=aux[0];
      //console.log(this.lista_feature);
      this.filter = this.lista_feature;
    }
  }

  //CONEXION DE FEATURE
  async getWFSgeojson(url:any) {
    try {
      const response = await fetch(url);
      const data = await response.json();     
      if(this.lista_feature.length==0){
        this.guardarfeature(data);
        this.reloadmap(data);
      }
      return data;
    } catch (error) {
      console.log('error:',error);
      //console.log('Error fetching WFS geojson:', error);
      return null;
    }
  }


  onClickHandlerMap= async (e: any) =>{
    console.log(e);
    if (!this.editing){
      if(this.mapCustom){
        //console.log('Latitud:', e.latlng.lat);
        //console.log('Longitud:', e.latlng.lng);
        this.opcionb=false;
        this.latitud = e.latlng.lat;
        this.longitud = e.latlng.lng;
        this.myControl.setValue((this.latitud+';'+this.longitud).toString());
        this.updateItem();
        this.deleteMarkers();
          if(!this.mostrarficha&&this.check.CreateIncidentesDenunciaComponent||!this.token){
            // Crea un marcador en las coordenadas especificadas
           // const mark = L.marker([this.latitud, this.longitud], { icon: this.redIcon }).addTo(this.map);
            // Si deseas añadir un popup al marcador
            //mark.bindPopup('Ubicación elegida').openPopup();
           // this.map.flyTo([this.latitud, this.longitud], 14);
          }
         
          const puntoUsuario = turf.point([this.longitud,this.latitud]);
          for (const feature of this.lista_feature) {
            if(feature.geometry&&feature.geometry.coordinates&&feature.geometry.coordinates[0]&&feature.geometry.coordinates[0][0].length>4){
              const poligono = turf.polygon(feature.geometry.coordinates[0]);
              
              if (turf.booleanContains(poligono, puntoUsuario)) {
                //console.log('El usuario está dentro del polígono:', feature);
                //await this.buscar(feature);
                break; // Si solo quieres saber en qué polígono está, puedes detener el bucle aquí
              }
            }           
          }
        }

    }
  }
  @ViewChildren(SpeedDial) speedDials: QueryList<SpeedDial> | undefined;
 
  createCustomControl(template: TemplateRef<any>) {
    const element = document.createElement('div');
    const viewRef = template.createEmbeddedView(null);
    element.appendChild(viewRef.rootNodes[0]);
    return element;
  }
  @ViewChild('customControl') customControlTemplate!: TemplateRef<any>;
  activarTooltips() {
  /*
    setTimeout(() => {
      if (this.speedDials) {
        this.speedDials.forEach((speedDial,index) => {
          speedDial.show();
        });
      }
    }, 220);*/
    setTimeout(() => {
      this.loadspeed=true;
      console.log(this.speedDials, this.speedDials);
      const customControlDiv = document.createElement('div');
      const speedDial = document.getElementsByTagName('p-speedDial')[0];
      customControlDiv.appendChild(speedDial);
     

      //this.mapCustom.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv);  
      this.mapCustom.controls[google.maps.ControlPosition.LEFT_TOP].push(customControlDiv);  
      console.log(this.mapCustom.controls[google.maps.ControlPosition.BOTTOM_LEFT],
        this.mapCustom.controls[google.maps.ControlPosition.BOTTOM_CENTER],
        this.mapCustom.controls[google.maps.ControlPosition.BOTTOM_RIGHT],
        this.mapCustom.controls[google.maps.ControlPosition.TOP_CENTER],
        this.mapCustom.controls[google.maps.ControlPosition.TOP_LEFT],
        this.mapCustom.controls[google.maps.ControlPosition.TOP_RIGHT],
        );
      setTimeout(() => {
        if (this.speedDials) {
          this.speedDials.forEach((speedDial,index) => {
            speedDial.show();
          });
        }
      }, 220); 
    }, 2000);
   
  }
  responsiveimage():string{
    let aux=window.innerWidth-30;
    return (aux+'px').toString();
  }
  loadspeed=false;

  isMobil() {
    return this.helperService.isMobil();
  }
  updateItem(){
    this.loadspeed=false;
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
        icon: !this.capaActiva? 'pi pi-eye':'bi bi-eye-slash-fill',
        tooltipOptions: {
          tooltipLabel:'Barrios',
          tooltipPosition:'right',
         //hideDelay:1000,
        },
        command: () => {
          //this.stopPropagation(event.originalEvent);
          this.recargarPoligonosEnMapa();     //this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' }); 
      
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
         // this.reloadWifi();             
        }
      },
      {
          icon: 'pi pi-book',
          tooltipOptions: {
            tooltipLabel:'Fichas Técnicas',
            tooltipPosition:'right',
           // hideDelay:1000,
          },
         // visible: (this.opcionb||false)  && this.check.IndexFichaSectorialComponent,
          command: () => {
            //this.stopPropagation(event.originalEvent);
           // this.fichaTecnica();             
          }
      },
      {
          icon: 'pi pi-pencil',
          tooltipOptions: {
            tooltipLabel:'Nuevas Ficha Técnica',
            tooltipPosition:'right',
           // hideDelay:1000,
          },
         // visible:(this.opcionb||false) &&this.check.CreateFichaSectorialComponent,
          command: () => {
            //this.stopPropagation(event.originalEvent);
            //this.nuevoFicha(); 
          }
      },
      {
          icon: 'pi pi-inbox',
          tooltipOptions: {
            tooltipLabel:'Incidentes',
            tooltipPosition:'right',
            //hideDelay:1000,
          },
        //  visible:(this.opcionb||false) &&this.check.IndexIncidentesDenunciaComponent,
          command: () => {
            //this.stopPropagation(event.originalEvent);
           // this.incidente();//this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        
          }
      },
      {
        icon: 'pi pi-telegram',
        tooltipOptions: {
          tooltipLabel:'Nuevo Incidente',
          tooltipPosition:'right',
          //hideDelay:1000,
        },
        //visible:(this.opcionb||false)&&this.check.CreateIncidentesDenunciaComponent && !(!this.latitud && !this.longitud),
        command: () => {
          //this.stopPropagation(event.originalEvent);
          //this.nuevoIncidente();//this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
  
        }
      }
    ];
    this.activarTooltips();
  
  }
  async getLocation() {
    if(this.isMobil()){
      const permission = await Geolocation['requestPermissions']();
      //console.log(permission);
      if (permission !== 'granted') {
        const coordinates = await Geolocation['getCurrentPosition']();
        //console.log(coordinates);
      }
    }else{
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Tu ubicación puede ser no exacta' });
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {          
          //console.log(position,position.coords.longitude, position.coords.latitude);
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
          this.updateItem();
          //await this.obtenerDireccion(this.latitud,this.longitud);   
          this.addMarker({lat: this.latitud, lng: this.longitud});
          //this.marcarlugar(this.latitud,this.longitud,'Ubicación actual');      
          //await this.buscarfeature(this.latitud,this.longitud);
        },
        (error) => {
          //console.error('Error getting location: ' + error.message);
        }
      );
    } else {
      //console.error('Geolocation is not supported by this browser.');
    }
  }
}