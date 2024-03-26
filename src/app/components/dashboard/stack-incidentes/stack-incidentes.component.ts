import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { HelperService } from 'src/app/services/helper.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-stack-incidentes',
  templateUrl: './stack-incidentes.component.html',
  styleUrl: './stack-incidentes.component.scss'
})
export class StackIncidentesComponent implements OnInit {
  urlgeoser="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson"; 
  constructor(private messageService: MessageService,private helper:HelperService ,private listar:ListService){

  }
  token=this.helper.token();
  constIncidente:any=[];
  loading=true;
  
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

 
  labelsmobil:any=[]
  async rankin() {
    this.loading = true;
    // Obtener todos los incidentes si aún no se han cargado
    if (this.constIncidente.length === 0) {
        try {
            const response: any = await this.listar.listarIncidentesDenuncias(this.token, '', '', false).toPromise();
            if (response.data) {
                this.constIncidente = response.data;
            }
        } catch (error) {
            console.error('Error al obtener incidentes:', error);
            this.loading = false;
            return;
        }
    }
    console.log(this.constIncidente);
    // Obtener valores únicos de categoria.nombre
    const categoriasUnicas = [...new Set(this.constIncidente.map((incidente: any) => incidente.categoria.nombre))];
    const barriosUnicos = [...new Set(this.constIncidente.map((incidente: any) => incidente.direccion_geo.nombre))];

      const datasets = barriosUnicos.map((elementbarr: any) => {
        const incidentesPorDireccion = this.constIncidente.filter((incidente: any) => incidente.direccion_geo.nombre === elementbarr);
        const data = categoriasUnicas.map((elementcat: any) => {
            return incidentesPorDireccion.reduce((acc: any, incidente: any) => {
                const nombreCategoria = elementcat;
                if (incidente.categoria.nombre === nombreCategoria) {
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
        this.labelsmobil=categoriasUnicas;
        let auxlabel:any=[];
        this.labelsmobil.forEach((element:any,index:any) => {
            auxlabel.push((index+1).toString())
        });
        this.basicData.labels = auxlabel;
    }else{
        this.basicData.labels = categoriasUnicas;
    }
      
    console.log(this.basicData);
      // Actualizar la vista
      this.canvas();

      this.loading = false;
  }

  
  @Input() filtro: string | undefined;
  @Input() valor: number | undefined;
  @Input() modal: any = false;
  async cargar(){
    this.loading = true;
    // Obtener todos los incidentes si aún no se han cargado
    if (this.constIncidente.length === 0) {
        try {
            const response: any = await this.listar.listarIncidentesDenuncias(this.token,this.filtro,this.valor, false).toPromise();
            if (response.data) {
                this.constIncidente = response.data;
            }
        } catch (error) {
            console.error('Error al obtener incidentes:', error);
            this.loading = false;
            return;
        }
    }
    console.log(this.constIncidente);
    // Obtener valores únicos de categoria.nombre
    const categoriasUnicas = [...new Set(this.constIncidente.map((incidente: any) => incidente.categoria.nombre))];
    const barriosUnicos = [...new Set(this.constIncidente.map((incidente: any) => incidente.direccion_geo.nombre))];

      const datasets = barriosUnicos.map((elementbarr: any) => {
        const incidentesPorDireccion = this.constIncidente.filter((incidente: any) => incidente.direccion_geo.nombre === elementbarr);
        const data = categoriasUnicas.map((elementcat: any) => {
            return incidentesPorDireccion.reduce((acc: any, incidente: any) => {
                const nombreCategoria = elementcat;
                if (incidente.categoria.nombre === nombreCategoria) {
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
        this.labelsmobil=categoriasUnicas;
        let auxlabel:any=[];
        this.labelsmobil.forEach((element:any,index:any) => {
            auxlabel.push((index+1).toString())
        });
        this.basicData.labels = auxlabel;
    }else{
        this.basicData.labels = categoriasUnicas;
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
      case 'pendiente':
          return 'danger';

      case 'qualified':
          return 'success';

      case 'new':
          return 'info';

      case 'negotiation':
          return 'warning';

          case 'renewal':
            return 'info'; // Otra opción aquí, dependiendo de lo que desees
  
        default:
          return 'info'; // Otra opción aquí, dependiendo de lo que desees
  }
}
}
