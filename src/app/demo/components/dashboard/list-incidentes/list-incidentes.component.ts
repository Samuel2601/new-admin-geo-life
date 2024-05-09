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
        console.log('Cantidad de elementos filtrados:', elementosFiltrados);
        // Mostrar totales y porcentajes en la tabla
        // Obtener totales y porcentajes
        const totales = this.obtenerTotales(this.incidente);
        const porcentajes = this.obtenerPorcentajes(
            totales,
            this.incidente.length
        );
        for (const key in this.dataForm) {
            if (Object.prototype.hasOwnProperty.call(this.dataForm, key)) {
                const element = this.dataForm[key];
                this.dataForm[key] = this.crearDatosGrafico(totales[key]);
            }
        }

        console.log('Totales:', totales);
        console.log('Porcentajes:', porcentajes);
        console.log('Porcentajes:', this.dataForm);
    }
    dataForm: any = {
        categorias: undefined,
        subcategorias: undefined,
        estados: undefined,
        direcciones: undefined,
    };
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
                totales.categorias[elemento.categoria.nombre] = 0;
            }
            totales.categorias[elemento.categoria.nombre]++;

            // Subcategorías
            if (!totales.subcategorias[elemento.subcategoria.nombre]) {
                totales.subcategorias[elemento.subcategoria.nombre] = 0;
            }
            totales.subcategorias[elemento.subcategoria.nombre]++;

            // Estados
            if (!totales.estados[elemento.estado.nombre]) {
                totales.estados[elemento.estado.nombre] = 0;
            }
            totales.estados[elemento.estado.nombre]++;

            // Direcciones
            if (!totales.direcciones[elemento.direccion_geo.nombre]) {
                totales.direcciones[elemento.direccion_geo.nombre] = 0;
            }
            totales.direcciones[elemento.direccion_geo.nombre]++;
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
            porcentajes.categorias[key] =
                (totales.categorias[key] / totalIncidentes) * 100;
        }

        for (const key in totales.subcategorias) {
            porcentajes.subcategorias[key] =
                (totales.subcategorias[key] / totalIncidentes) * 100;
        }

        for (const key in totales.estados) {
            porcentajes.estados[key] =
                (totales.estados[key] / totalIncidentes) * 100;
        }

        for (const key in totales.direcciones) {
            porcentajes.direcciones[key] =
                (totales.direcciones[key] / totalIncidentes) * 100;
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
                    console.log(this.estados);
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
        console.log('Categorias', categoriaSeleccionada);
        try {
            for (const element of categoriaSeleccionada) {
                const response = await this.listar
                    .listarSubcategorias(this.token, 'categoria', element._id)
                    .toPromise();
                console.log(response);
                if (response.data) {
                    this.subcategorias.push(...response.data);
                }
            }
            console.log(this.subcategorias);
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
        console.log(this.constIncidente);
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
                datalabels: {
                    formatter: (value: any, ctx: any) => {
                        return value +'%';
                    },
                    color: textColor,
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
    ultimoColor: string;
    generarColor(): string {
        const colores = [
            'blue',
            'green',
            'yellow',
            'cyan',
            'pink',
            'indigo',
            'bluegray',
            'purple',
            'red',
            'primary',
        ];
        const tonos = ['500'];

        let colorElegido: string;
        let tonoElegido: string;
        let color: string;
        do {
            colorElegido = colores[Math.floor(Math.random() * colores.length)];
            tonoElegido = tonos[Math.floor(Math.random() * tonos.length)];
            color = `--${colorElegido}-${tonoElegido}`;
        } while (color === this.ultimoColor);

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
            dataset.data.push(value);

            // Genera un color aleatorio para cada entrada
            const color = this.generarColor();
            console.log(color);
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
        legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
          colors[index] = index === item.index || color.length === 9 ? color : color + '4D';
        });
        legend.chart.update();
      }
      handleLeave(evt, item, legend) {
        legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
          colors[index] = color.length === 9 ? color.slice(0, -2) : color;
        });
        legend.chart.update();
      }
}
