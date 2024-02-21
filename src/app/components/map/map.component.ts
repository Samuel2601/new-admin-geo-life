import { Component, AfterViewInit, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { LatLng, geoJSON, Map, tileLayer, control, layerGroup, featureGroup, LeafletMouseEvent } from 'leaflet';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreateIncidentesDenunciaComponent } from '../incidentes-denuncia/create-incidentes-denuncia/create-incidentes-denuncia.component';
import { CreateFichaSectorialComponent } from '../ficha-sectorial/create-ficha-sectorial/create-ficha-sectorial.component';
import { HelperService } from 'src/app/services/helper.service';
import iziToast from 'izitoast';
import { IndexFichaSectorialComponent } from '../ficha-sectorial/index-ficha-sectorial/index-ficha-sectorial.component';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,AfterViewInit {
Incidente() {
throw new Error('Method not implemented.');
}
  
  public map: Map|undefined ;
  constructor(private modalService: NgbModal,private helperService:HelperService){

  }
  ngOnInit(): void {
    this.helperService.deshabilitarMapa$.subscribe(() => {
      this.handleClick();
    });
  }
  
  ngAfterViewInit(): void {
    this.geoserve();
  }

  ngOnDestroy() {
    this.map?.remove(); // Elimina el mapa al destruir el componente
  }
   // Capas base
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
  }
  myControl = new FormControl();
  public filter:any=[];
  
  showOptions: boolean = false;
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

  wfsSelangor = featureGroup();
  busquedaLayer= featureGroup();
  latitud: number=0;
  longitud: number=0;
  wfsPolylayer: any;
  buscarPolylayer: any;
  capasInteractivas: any[] = [];
  editing:boolean=false;

  clicmap(){
    if(this.map){
      if(!this.editing){
        // Desactivar capas superpuestas
        this.map.eachLayer((layer) => {
          if(layer !== this.wfsSelangor){
            this.map?.removeLayer(layer);
          }
        });

        this.map.on('click', (e: LeafletMouseEvent) => {
          console.log('Latitud:', e.latlng.lat);
          console.log('Longitud:', e.latlng.lng);
          this.latitud = e.latlng.lat;
          this.longitud = e.latlng.lng;

          // Volver a agregar las capas superpuestas
          this.capasInteractivas.forEach((capa) => {
            this.map?.addLayer(capa);
          });
        });
        //this.reloadmap();
      } else {
        this.map.off('click'); // Desactivar el evento de clic en el mapa mientras se está editando
      }
    }   
  }


  geoserve(){
    this.map = new Map('mapid').setView([0.977035, -79.655415], 15);
    this.map.addLayer(this.wfsSelangor);

    const googleStreets = tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);
    if(!googleStreets){
      iziToast.error({
        title:'Error',
        message:'Sin Conexión a Google'
      })
    }
    this.getWFSgeojson();
    //this.reloadmap();
    // Crear la capa de búsqueda
    this.busquedaLayer = featureGroup().addTo(this.map);

    control.layers({googleStreets}, {'Barrios':this.wfsSelangor,'Búsqueda': this.busquedaLayer}).addTo(this.map);
  }
  lista_feature:any=[];
  bton:any
  opcionb:any
  /*<li>
      <button class="btn btn-secondary mt-3" id="incidenteButton">
          <strong>Generar Incidente o Denuncia</strong>
      </button>
  </li>
  <li>
    <button class="btn btn-secondary mt-3" id="fichaButton">
        <strong>Buscar Ficha Técnicas</strong>
    </button>
  </li> */
  reloadmap() {
    this.wfsPolylayer = [];
    this.wfsSelangor.clearLayers();
    this.getWFSgeojson().then((e) => {
        (this.wfsPolylayer = geoJSON([e], {
            onEachFeature: (e, t) => {
                t.on({ mouseover: this.highlightFeature, mouseout: this.resetHighlight });
                t.bindPopup(`
                  <div style="font-family: Arial, sans-serif; font-size: 14px;">
                      <b>${e.properties.nombre}</b>
                      <ul style="list-style-type: none; padding-left: 0;">
                          <li><strong>Parroquia:</strong> ${e.properties.parr}</li>                          
                      </ul>
                  </div>
                `);
                if(this.bton){
                  this.bton.removeEventListener('click', () => {
                    this.selectmap(e);
                  });
                }
                // Agrega un event listener al botón cuando se abra el popup
                t.on('popupopen', (popupEvent) => {
                 
                  this.buscar(e); // seleccionar barrio con un click en el mapa
                    this.bton = document.getElementById('incidenteButton');
                    if (this.bton) {
                        this.bton.addEventListener('click', () => {
                            this.selectmap(e);
                        });
                    }
                });
                // Elimina el event listener cuando se cierre el popup
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
                });             
            },
            style: this.geojsonWFSstyle,
        }).addTo(this.wfsSelangor));
    });
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
  
  buscar(opcion:any){      
    this.opcionb=opcion; 
    this.myControl.setValue(this.opcionb.properties.nombre);
    this.buscarPolylayer=[];
    // Vaciar busquedaLayer
    this.busquedaLayer.clearLayers();
    this.buscarPolylayer = geoJSON(opcion, {
      style: this.geojsonWFSstyle2,
    }).bindPopup(`
      <div style="font-family: Arial, sans-serif; font-size: 14px;">
        <b>${opcion.properties.nombre}</b>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Parriquia:</strong> ${opcion.properties.parr}</li>
        </ul>
      </div>
    `).addTo(this.busquedaLayer);
    
    let incidenteButton:any;
    let fichaButton:any;
    // Agregar un event listener al botón cuando se abra el popup
      this.buscarPolylayer.on('popupopen', (popupEvent:any) => {
        incidenteButton = document.getElementById('incidenteButton');
        if (incidenteButton) {
            incidenteButton.addEventListener('click', () => {
              this.nuevoIncidente();// Aquí puedes realizar la acción que necesites al hacer clic en el botón
            });
        }
      });

      // Eliminar el event listener cuando se cierre el popup
      this.buscarPolylayer.on('popupclose', (popupEvent:any) => {
        if (incidenteButton) {
            incidenteButton.removeEventListener('click', () => {
              this.nuevoIncidente();// Aquí puedes realizar la acción que necesites al hacer clic en el botón
            });
        }
      });

      // Agregar un event listener al botón cuando se abra el popup
      this.buscarPolylayer.on('popupopen', (popupEvent:any) => {
        fichaButton = document.getElementById('fichaButton');
        if (fichaButton) {
          fichaButton.addEventListener('click', () => {
              this.fichaTecnica();// Aquí puedes realizar la acción que necesites al hacer clic en el botón
            });
        }
      });

      // Eliminar el event listener cuando se cierre el popup
      this.buscarPolylayer.on('popupclose', (popupEvent:any) => {
        if (fichaButton) {
          fichaButton.removeEventListener('click', () => {
              this.fichaTecnica();// Aquí puedes realizar la acción que necesites al hacer clic en el botón
            });
        }
      });

    // Mover el mapa hacia el feature seleccionado
    this.map?.fitBounds(this.buscarPolylayer.getBounds(),{ maxZoom: 15 });

    this.showOptions = false;
  }
  urlgeoser="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson";
  urlgeolocal="http://192.168.120.35/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson";
  async getWFSgeojson() {
    try {
      const response = await fetch(this.urlgeoser);
      const data = await response.json();      
      if(data.features){
        var aux=[];
        aux.push(data.features);
        this.lista_feature=aux[0];
        this.filter = this.lista_feature;
      }
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
  isMobile(): boolean {
      const screenWidth = window.innerWidth;
      return screenWidth < 768; // Cambia este valor según la definición de móvil en Bootstrap
  }


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
      color: '#CC0000',
      fillColor:'#CC0000',
      dashArray: '',
      fillOpacity: 0.7
    };
  }
  selectmap(e:any){
    this.opcionb=e;
    this.nuevoIncidente();
  }
  nuevoFicha(){
    const data = this.opcionb; // JSON que quieres enviar
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(CreateFichaSectorialComponent, { centered: true });
    modalRef.componentInstance.data = data; 
  }
  nuevoIncidente() {
    const data = this.opcionb; // JSON que quieres enviar
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(CreateIncidentesDenunciaComponent, { centered: true });
    modalRef.componentInstance.data = data; 
  }
  mostrarficha=false;
  selectficha(e:any){
    
    this.opcionb=e;
    this.fichaTecnica();
  }
  fichaTecnica(){
    this.mostrarficha=false;
    if(this.opcionb){
      this.mostrarficha=true;
    } 
    if(this.map){
      if(this.mostrarficha){
        console.log('DEShabilitar');
        // Deshabilitar interacción con el mapa
        this.map.dragging.disable();
        this.map.scrollWheelZoom.disable();
      }else{
        // Habilitar interacción con el mapa
        //this.map.dragging.enable();
        //this.map.scrollWheelZoom.enable();          
      }  
    }   
  }

  deshabilitarArrastreZoom() {
    if(this.map){
      console.log('habilitar');
      this.map.dragging.disable();
      this.map.scrollWheelZoom.disable();
    }
  } 
  handleClick() {
    this.mostrarficha=false;
    if (this.map) {
      console.log('deshabilitar');
      this.map.dragging.enable();
      this.map.scrollWheelZoom.enable();
      
    }
  } 


}