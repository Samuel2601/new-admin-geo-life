import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { HelperService } from 'src/app/services/helper.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-stack-fichas',
  templateUrl: './stack-fichas.component.html',
  styleUrl: './stack-fichas.component.scss'
})
export class StackFichasComponent implements OnInit{
  urlgeoser="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson"; 
  constructor(private messageService: MessageService,private helper:HelperService ,private listar:ListService){

  }
 
  
  basicData:any={};
  basicOptions: any;

  async ngOnInit() {
    await this.getWFSgeojson(this.urlgeoser);
    if(this.valor&&this.filtro){
      this.cargar();
    }else{
      this.rankin();
    }
  }

  token=this.helper.token();
  constFicha:any=[];
  loading=true;
  isMobil() {
    return this.helper.isMobil();
  }
  async rankin() {
    this.loading = true;
    // Obtener todos los incidentes si aún no se han cargado
    if (this.constFicha.length === 0) {
        try {
            const response: any = await this.listar.listarFichaSectorial(this.token).toPromise();
            if (response.data) {
                this.constFicha = response.data;
            }
            console.log(this.constFicha);
        } catch (error) {
            console.error('Error al obtener incidentes:', error);
            this.loading = false;
            return;
        }
    }
    console.log(this.constFicha);
    // Obtener valores únicos de actividad.nombre
    const actividadsUnicas = [...new Set(this.constFicha.map((incidente: any) => incidente.actividad.nombre))];
    const barriosUnicos = [...new Set(this.constFicha.map((incidente: any) => incidente.direccion_geo))];

      const datasets = barriosUnicos.map((elementbarr: any) => {
        const incidentesPorDireccion = this.constFicha.filter((incidente: any) => incidente.direccion_geo === elementbarr);
        const data = actividadsUnicas.map((elementcat: any) => {
            return incidentesPorDireccion.reduce((acc: any, incidente: any) => {
                const nombreactividad = elementcat;
                if (incidente.actividad.nombre === nombreactividad) {
                    acc++;
                }
                return acc;
            }, 0);
        });
        return {
            data,
            label: elementbarr,
            borderWidth: 1,
            type: 'bar',
        };
    });
      console.log("datasets",datasets);

      this.basicData.datasets = datasets.flat(); // Utiliza flat para aplanar el arreglo de arreglos

    if(this.modal){
        this.labelsmobil=actividadsUnicas;
        let auxlabel:any=[];
        this.labelsmobil.forEach((element:any,index:any) => {
            auxlabel.push((index+1).toString())
        });
        this.basicData.labels = auxlabel;
    }else{
        this.basicData.labels = actividadsUnicas;
    }
        console.log(this.basicData);
      // Actualizar la vista
      this.canvas();

      this.loading = false;
  }

  
  
  @Input() filtro: string | undefined;
  @Input() valor: string | undefined;
  @Input() modal: any = false;
  labelsmobil:any=[]
  async cargar(){
    this.loading = true;
    // Obtener todos los incidentes si aún no se han cargado
    if (this.constFicha.length === 0) {
        try {
            const response: any = await this.listar.listarFichaSectorial(this.token,this.filtro,this.valor).toPromise();
            console.log(response);
            if (response.data) {
                this.constFicha = response.data;
            }
            console.log(response);
        } catch (error) {
            console.error('Error al obtener incidentes:', error);
            this.loading = false;
            return;
        }
    }
    console.log(this.constFicha);
    // Obtener valores únicos de actividad.nombre
    const actividadsUnicas = [...new Set(this.constFicha.map((incidente: any) => incidente.actividad.nombre))];
    const barriosUnicos = [...new Set(this.constFicha.map((incidente: any) => incidente.direccion_geo))];

      const datasets = barriosUnicos.map((elementbarr: any) => {
        const incidentesPorDireccion = this.constFicha.filter((incidente: any) => incidente.direccion_geo === elementbarr);
        const data = actividadsUnicas.map((elementcat: any) => {
            return incidentesPorDireccion.reduce((acc: any, incidente: any) => {
                const nombreactividad = elementcat;
                if (incidente.actividad.nombre === nombreactividad) {
                    acc++;
                }
                return acc;
            }, 0);
        });
        return {
            data,
            label: elementbarr,
            backgroundColor: this.modal ? [
                getComputedStyle(document.documentElement).getPropertyValue('--bs-blue'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-indigo'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-purple'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-pink'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-red'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-orange'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-yellow'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-teal'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-cyan'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-info'),
                getComputedStyle(document.documentElement).getPropertyValue('--bs-green'),
            ] : undefined,
            borderWidth: 1,
            type: 'bar',
        };
    });
      console.log("datasets",datasets);

      this.basicData.datasets = datasets.flat(); // Utiliza flat para aplanar el arreglo de arreglos
    if(this.modal){
        this.labelsmobil=actividadsUnicas;
        let auxlabel:any=[];
        this.labelsmobil.forEach((element:any,index:any) => {
            auxlabel.push((index+1).toString())
        });
        this.basicData.labels = auxlabel;
    }else{
        this.basicData.labels = actividadsUnicas;
    }
    console.log(this.basicData);
      // Actualizar la vista
      this.canvas();

      this.loading = false;
}

options: any;

canvas(){
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
  this.options = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        tooltip: {
            mode: 'index',
            intersect: false
        },
        legend: {
            labels: {
                color: textColor
            }
        }
    },
    scales: {
        x: {
            stacked: true,
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        },
        y: {
            stacked: true,
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

clear(table: Table) {
  table.clear();
}

getSeverity(status: string) {
  switch (status.toLowerCase()) {
      case 'suspendido':
          return 'danger';

      case 'finalizado':
          return 'success';

      case 'en proceso':
          return 'primary';

      case 'pendiente':
          return 'warning';

          case 'planificada':
            return 'info'; // Otra opción aquí, dependiendo de lo que desees
  
        default:
          return ''; // Otra opción aquí, dependiendo de lo que desees
  }
}
}
