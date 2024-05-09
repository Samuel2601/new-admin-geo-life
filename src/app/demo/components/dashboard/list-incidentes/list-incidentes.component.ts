import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/demo/services/helper.service';
import { ListService } from 'src/app/demo/services/list.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-list-incidentes',
    templateUrl: './list-incidentes.component.html',
    styleUrl: './list-incidentes.component.scss',
})
export class ListIncidentesComponent implements OnInit {
    public filterForm: FormGroup | any;
    private token = this.helper.token();
    public categorias: any[] = [];
    public subcategorias: any[] = [];
    public estados: any[] = [];
    public direcciones: any[] = [];
    load_table: boolean = false;
    constructor(
        public formBuilder: FormBuilder,
        private listar: ListService,
        private helper: HelperService,
        private messageService: MessageService
    ) {
        this.filterForm = this.formBuilder.group({
            fecha_inicio: [''],
            fecha_fin: [''],
            categoria: [[], [Validators.minLength(1)]],
            subcategoria: [[], [Validators.minLength(1)]],
            estado: [[], [Validators.minLength(1)]],
            direccion: [[], [Validators.minLength(1)]],
        });
    }

    filtro() {
        this.load_table = false;
        const fechaInicio = this.filterForm.get('fecha_inicio').value;
        const fechaFin = this.filterForm.get('fecha_fin').value;
        const categoria = this.filterForm.get('categoria').value;
        const subcategoria = this.filterForm.get('subcategoria').value;
        const estado = this.filterForm.get('estado').value;
        const direccion = this.filterForm.get('direccion').value;

        const elementosFiltrados = this.constIncidente.filter((elemento) => {
            // Filtrar por fecha de inicio y fin
            const fechaElemento = new Date(elemento.createdAt);
            if (
                fechaInicio &&
                fechaFin &&
                (fechaElemento < fechaInicio || fechaElemento > fechaFin)
            ) {
                return false;
            }

            const categoriaValida =
                categoria.length === 0 ||
                categoria.some(
                    (c: any) =>
                        c._id.toString() === elemento.categoria._id.toString()
                );

            const subcategoriaValida =
                subcategoria.length === 0 ||
                subcategoria.some(
                    (s: any) =>
                        s._id.toString() ===
                        elemento.subcategoria._id.toString()
                );

            const estadoValido =
                estado.length === 0 ||
                estado.some(
                    (e: any) =>
                        e._id.toString() === elemento.estado._id.toString()
                );

            // Filtrar por dirección
            const direccionValida =
                direccion.length === 0 ||
                direccion.some(
                    (d: any) => d.nombre == elemento.direccion_geo.nombre
                );

            return (
                categoriaValida &&
                subcategoriaValida &&
                estadoValido &&
                direccionValida
            );
        });
        this.incidente = elementosFiltrados;
        // Mostrar totales y porcentajes en la tabla
        // Obtener totales y porcentajes
        this.totales = this.obtenerTotales(this.incidente);
        this.totales = this.obtenerPorcentajes(
            this.totales,
            this.incidente.length
        );
        for (const key in this.dataForm) {
            if (Object.prototype.hasOwnProperty.call(this.dataForm, key)) {
                const element = this.dataForm[key];
                this.dataForm[key] = this.crearDatosGrafico(this.totales[key]);
            }
        }
        this.load_table = true;
    }

    totales: any;
    porcentajes: any;

    dataForm: any = {
        categorias: undefined,
        subcategorias: undefined,
        estados: undefined,
        direcciones: undefined,
    };
    trackByFn(index, item) {
        return item.id; // Cambia 'id' por la propiedad única de tu objeto
    }
    obtenerTotales(incidentes: any[]) {
        const totales = {
            categorias: {},
            subcategorias: {},
            estados: {},
            direcciones: {},
        };

        incidentes.forEach((elemento) => {
            // Categorías
            if (!totales.categorias[elemento.categoria.nombre]) {
                totales.categorias[elemento.categoria.nombre] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.categorias[elemento.categoria.nombre].registros++;

            // Subcategorías
            if (!totales.subcategorias[elemento.subcategoria.nombre]) {
                totales.subcategorias[elemento.subcategoria.nombre] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.subcategorias[elemento.subcategoria.nombre].registros++;

            // Estados
            if (!totales.estados[elemento.estado.nombre]) {
                totales.estados[elemento.estado.nombre] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.estados[elemento.estado.nombre].registros++;

            // Direcciones
            if (!totales.direcciones[elemento.direccion_geo.nombre]) {
                totales.direcciones[elemento.direccion_geo.nombre] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.direcciones[elemento.direccion_geo.nombre].registros++;
        });

        return totales;
    }

    obtenerPorcentajes(totales: any, totalIncidentes: number) {
        const porcentajes = {
            categorias: {},
            subcategorias: {},
            estados: {},
            direcciones: {},
        };

        for (const key in totales.categorias) {
            porcentajes.categorias[key] = {
                registros: totales.categorias[key].registros,
                porcentaje:
                    (totales.categorias[key].registros / totalIncidentes) * 100,
            };
        }

        for (const key in totales.subcategorias) {
            porcentajes.subcategorias[key] = {
                registros: totales.subcategorias[key].registros,
                porcentaje:
                    (totales.subcategorias[key].registros / totalIncidentes) *
                    100,
            };
        }

        for (const key in totales.estados) {
            porcentajes.estados[key] = {
                registros: totales.estados[key].registros,
                porcentaje:
                    (totales.estados[key].registros / totalIncidentes) * 100,
            };
        }

        for (const key in totales.direcciones) {
            porcentajes.direcciones[key] = {
                registros: totales.direcciones[key].registros,
                porcentaje:
                    (totales.direcciones[key].registros / totalIncidentes) *
                    100,
            };
        }

        return porcentajes;
    }

    async ngOnInit() {
        await this.rankin();
        await this.listCategoria();
        await this.listarEstado();
        this.filterForm.get('categoria').valueChanges.subscribe(() => {
            this.updateSubcategorias();
        });
    }
    async listarEstado() {
        this.listar
            .listarEstadosIncidentes(this.token)
            .subscribe((response) => {
                if (response.data) {
                    this.estados = response.data;
                }
            });
    }
    async listCategoria() {
        this.listar.listarCategorias(this.token).subscribe((response) => {
            if (response.data) {
                this.categorias = response.data;
            }
        });
    }
    async updateSubcategorias() {
        const categoriaSeleccionada = this.filterForm.get('categoria').value;
        this.subcategorias = [];
        try {
            for (const element of categoriaSeleccionada) {
                const response = await this.listar
                    .listarSubcategorias(this.token, 'categoria', element._id)
                    .toPromise();
                if (response.data) {
                    this.subcategorias.push(...response.data);
                }
            }
        } catch (error) {
            console.error('Error al obtener subcategorias:', error);
        }
    }

    constIncidente: any[] = [];
    incidente: any[] = [];
    options: any;
    async rankin() {
        // Obtener todos los incidentes si aún no se han cargado
        if (this.constIncidente.length === 0) {
            try {
                const response: any = await this.listar
                    .listarIncidentesDenuncias(this.token, '', '', false)
                    .toPromise();
                if (response.data) {
                    this.constIncidente = response.data;
                }
            } catch (error) {
                console.error('Error al obtener incidentes:', error);
                return;
            }
        } else {
            this.incidente = this.constIncidente;
        }
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                    },
                    onHover: this.handleHover,
                    onLeave: this.handleLeave,
                },
            },
        };
        await this.obtenerValoresUnicosDireccionGeo();
    }
    async obtenerValoresUnicosDireccionGeo() {
        const valoresUnicos = new Set();
        this.constIncidente.forEach((incidente: any) => {
            const direccionGeo = incidente.direccion_geo;
            const { nombre, latitud, longitud } = direccionGeo;
            const claveUnica = `${nombre}`;
            valoresUnicos.add(claveUnica);
        });
        // Convertir el Set a un array para devolver los valores únicos
        this.direcciones = Array.from(valoresUnicos).map((valor: any) => {
            const [nombre, latitud, longitud] = valor.split('-');
            return { nombre };
        });
    }
    clear(table: Table) {
        console.log(table);
        table.clear();
    }

    exportToCSV(table: Table) {
        //table.exportCSV();
        console.log(table.columns);
        const selectedColumns = table.columns.filter(
            (col) => col.exportable !== false && col.field
        );
        const header = selectedColumns
            .map((col) => col.header ?? col.field)
            .join(',');
        const csv = table.value.map((row) =>
            selectedColumns
                .map((col) => this.resolveFieldData(row, col))
                .join(',')
        );
        csv.unshift(header);
        const blob = new Blob([csv.join('\n')], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
    private resolveFieldData(data: any, field: any): any {
        if (data && field) {
          if (typeof field === 'string') {
            return data[field];
          } else if (field instanceof Function) {
            return field(data);
          } else {
            const path = field.split('.');
            let obj = data;
            for (let i = 0, len = path.length; i < len; ++i) {
              obj = obj[path[i]];
            }
            return obj;
          }
        } else {
          return null;
        }
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
    ultimoColor: string;
    colorIndex: number = 0;
    tonoIndex: number = 0;
    generarColor(): string {
        const colores = [
            'primary',
            'blue',
            'green',
            'yellow',
            'cyan',
            'pink',
            'indigo',
            'bluegray',
            'purple',
            'red',
        ];
        const tonos = ['500', '300', '700'];

        if (!this.colorIndex) {
            this.colorIndex = 0;
            this.tonoIndex = 0;
        }

        const colorElegido = colores[this.colorIndex];
        const tonoElegido = tonos[this.tonoIndex];

        this.colorIndex++;
        if (this.colorIndex >= colores.length) {
            this.colorIndex = 0;
            this.tonoIndex++;
            if (this.tonoIndex >= tonos.length) {
                this.tonoIndex = 0;
            }
        }

        const color = `--${colorElegido}-${tonoElegido}`;

        this.ultimoColor = color;
        return color;
    }
    crearDatosGrafico(datos: any): { datasets: any[]; labels: string[] } {
        const documentStyle = getComputedStyle(document.documentElement);
        const dataset = {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
        };
        const labels = [];

        for (const [key, value] of Object.entries(datos)) {
            labels.push(key);
            const [porcentaje, registros] = Object.entries(value)[0];
            dataset.data.push(registros);

            // Genera un color aleatorio para cada entrada
            const color = this.generarColor();
            dataset.backgroundColor.push(documentStyle.getPropertyValue(color));
            dataset.hoverBackgroundColor.push(
                documentStyle.getPropertyValue(color)
            );
        }
        return { datasets: [dataset], labels };
    }
    convertirObjetoEnArreglo(objeto: any): any[] {
        return Object.keys(objeto).map((key) => ({
            clave: key,
            valor: objeto[key],
        }));
    }
    handleHover(evt, item, legend) {
        legend.chart.data.datasets[0].backgroundColor.forEach(
            (color, index, colors) => {
                colors[index] =
                    index === item.index || color.length === 9
                        ? color
                        : color + '4D';
            }
        );
        legend.chart.update();
    }
    handleLeave(evt, item, legend) {
        legend.chart.data.datasets[0].backgroundColor.forEach(
            (color, index, colors) => {
                colors[index] = color.length === 9 ? color.slice(0, -2) : color;
            }
        );
        legend.chart.update();
    }
    getEntries(obj: any): any[] {
        return Object.entries(obj || {});
    }

    getTotales(totales: any) {
        let totalRegistros = 0;
        let totalPorcentaje = 0;

        for (const categoria of this.getEntries(totales)) {
            totalRegistros += categoria[1].registros;
            totalPorcentaje += categoria[1].porcentaje;
        }

        return { totalRegistros, totalPorcentaje };
    }
}
