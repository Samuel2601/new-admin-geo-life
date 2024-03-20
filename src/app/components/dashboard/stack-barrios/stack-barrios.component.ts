import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HelperService } from 'src/app/services/helper.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-stack-barrios',
  templateUrl: './stack-barrios.component.html',
  styleUrl: './stack-barrios.component.scss'
})
export class StackBarriosComponent implements OnInit {
  
  urlgeoser="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson"; 
  constructor(private messageService: MessageService,private helper:HelperService ,private listar:ListService){

  }
 
  
  basicData:any={};
  basicOptions: any;
  async ngOnInit() {
  


    await this.getWFSgeojson(this.urlgeoser);
    this.updateCurrentData();
  }
  token=this.helper.token();
  constIncidente:any=[];
  async filtrar(){
    this.constIncidente= await this.listar.listarIncidentesDenuncias(this.token,'','',false).toPromise();
    console.log(this.constIncidente);
  }
  async cargar(){
    
    let aux:any={};
    aux.data=[];
    aux.label='Sales';
    aux.borderWidth= 1;
    let axu2: any[]=[];
    for (const element of this.currentData) {
      if(element.properties.nombre){
        axu2.push(element.properties.nombre);
        let ci=this.constIncidente?.find((element2:any)=> {
          if (element2.direccion_geo && element.properties && element.properties.nombre) {
          return element2.direccion_geo.nombre == element.properties.nombre;
        } else {
          return false;
        }
      });
        if(ci){
          aux.data.push(ci.length);         
        }else{
          const response: any  = await this.listar.listarIncidentesDenuncias(this.token,'direccion_geo.nombre',element.properties.nombre,false).toPromise();
          if(response.data){
            aux.data.push(response.data.length);
            this.constIncidente.push(response.data);
          }
        }
        
      }
    }

    this.basicData.datasets=[aux];
    this.basicData.labels=axu2;
    console.log(this.basicData,aux);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
  };
}


  async listarbarrio(){
    await this.getWFSgeojson(this.urlgeoser);
    console.log(this.lista_feature);
    let aux:any={};
    aux.data=[];
    aux.label='Sales';
    aux.borderWidth= 1;
    let axu2: any[]=[];
    this.lista_feature.forEach((element:any) => {
      if(element.properties.nombre){
        axu2.push(element.properties.nombre);
        aux.data.push(10);
      }
    });
    this.basicData.datasets=[aux];
    this.basicData.labels=axu2;
    console.log(this.basicData,aux);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
  };
  }
  lista_feature=[];
  async getWFSgeojson(url:any) {
    try {
      const response = await fetch(url);
      const data = await response.json();  
      var aux=[];
      aux.push(data.features);
      this.lista_feature=aux[0];
      this.lista_feature = this.lista_feature.filter((element: any) => {
        return element.properties.nombre;
    });
      console.log(this.lista_feature);
      return data;
    } catch (error) {
      this.messageService.add({severity: 'error', summary: 'File Uploaded', detail: 'Sin Conexión a Geoserver'});
      return null;
    }
  }


  // Variable para almacenar los datos actuales a mostrar en el canvas
currentData: any[] = [];

// Índice del primer elemento del conjunto actual en la lista
currentIndex = 0;

async previoDataFeature() {
    // Verificar que haya elementos anteriores para mostrar
    if (this.currentIndex >= 5) {
        this.currentIndex -= 5;
        this.updateCurrentData();
    }
}

async dataFeature() {
    // Mostrar los datos actuales
    this.currentIndex = 0;
    this.updateCurrentData();
}

async postDataFeature() {
    // Verificar que haya elementos posteriores para mostrar
    if (this.currentIndex + 5 < this.lista_feature.length) {
        this.currentIndex += 5;
        this.updateCurrentData();
    }
}

updateCurrentData() {
    this.currentData = this.lista_feature.slice(this.currentIndex, this.currentIndex + 5);
    this.cargar();
}
}
