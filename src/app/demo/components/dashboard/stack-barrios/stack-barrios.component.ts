import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { HelperService } from 'src/app/demo/services/helper.service';
import { ListService } from 'src/app/demo/services/list.service';

@Component({
  selector: 'app-stack-barrios',
  templateUrl: './stack-barrios.component.html',
  styleUrl: './stack-barrios.component.scss',
  providers: [MessageService]
})
export class StackBarriosComponent implements OnInit {
  
  urlgeoser="https://geoapi.esmeraldas.gob.ec/geoserver/catastro/wms?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG%3A4326&typeName=catastro%3Ageo_barrios&outputFormat=application%2Fjson"; 
  constructor(private messageService: MessageService,private helper:HelperService ,private listar:ListService){

  }
 
    @Input() modal: any = false;
  basicData:any={};
  basicOptions: any;
  async ngOnInit() {
    


    await this.getWFSgeojson(this.urlgeoser);
    this.rankin();
  }
  token=this.helper.token();
  constIncidente:any=[];
  loading=true;
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
        ////console.error('Error al obtener incidentes:', error);
        this.loading = false;
        return;
      }
    }
  
    // Agrupar y contar los incidentes por nombre de dirección
    const incidentesPorDireccion = this.constIncidente.reduce((acc: any, incidente: any) => {
      const nombreDireccion = incidente.direccion_geo.nombre;
      acc[nombreDireccion] = acc[nombreDireccion] ? acc[nombreDireccion] + 1 : 1;
      return acc;
    }, {});
  
    // Ordenar las direcciones por cantidad de incidentes (de mayor a menor)
    const direccionesOrdenadas = Object.entries(incidentesPorDireccion)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([nombre]) => nombre);
  
    // Crear el dataset para basicData
    const dataset = {
      data: Object.values(incidentesPorDireccion),
      label: 'Incidentes o Denuncias',
      borderWidth: 1
    };
  
    // Actualizar basicData con los datos ordenados
    this.basicData.datasets = [dataset];
    this.basicData.labels = direccionesOrdenadas;
    // Actualizar la vista
    this.canvas();
  
    this.loading = false;
    this.helper.setStbarrioComponent(this);
    
  }
  encontrarMaximo(): { label: string; valor: number; } {

      let maximoValor = 0;
      let maximoLabel = '';
      // Obtener todos los valores de los datasets combinados en un solo array
    // Obtener la suma de los valores de los datasets
    ////console.log("DAtaset",this.basicData.datasets,this.basicData);
      const sumaValores = this.basicData.datasets[0].data;
    
      // Encontrar el valor máximo y su correspondiente label
      sumaValores.forEach((valor: number, index: number) => {
          if (valor > maximoValor) {
              maximoValor = valor;
              maximoLabel = this.basicData.labels[index];
          }
      });
      
      return { label: maximoLabel, valor: maximoValor };
  }
  

  async cargar(){
    this.loading=true;
    let aux=[];
    let axu2: any[]=[];
    for (const element of this.currentData) {
      if(element.properties.nombre){
        axu2.push(element.properties.nombre);
        let ci=this.constIncidente?.filter((element2:any)=> {
          if (element2.direccion_geo && element.properties && element.properties.nombre) {
          return element2.direccion_geo.nombre == element.properties.nombre;
        } else {
          return false;
        }
      });
        if(ci.length!=0){
          aux.push(ci.length);         
        }else{
          const response: any  = await this.listar.listarIncidentesDenuncias(this.token,'direccion_geo.nombre',element.properties.nombre,false).toPromise();
          if(response.data){
            aux.push(response.data.length);
            this.constIncidente.push(...response.data);
          }
        }
        
      }
    }
    const dataset = {
      data: Object.values(aux),
      label: 'Incidentes o Denuncias',
      borderWidth: 1
    };
    this.basicData.datasets=[dataset];
    this.basicData.labels=axu2;
    this.canvas();
    this.loading = false;
    
  }

options:any
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
