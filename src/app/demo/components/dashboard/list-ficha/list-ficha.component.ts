import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/demo/services/helper.service';
import { ListService } from 'src/app/demo/services/list.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ChartModule, UIChart } from 'primeng/chart';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-ficha',
    templateUrl: './list-ficha.component.html',
    styleUrl: './list-ficha.component.scss',
})
export class ListFichaComponent implements OnInit {
    public filterForm: FormGroup | any;
    private token = this.helper.token();
    public actividades: any[] = [];
    public encargados: any[] = [];
    public estados: any[] = [];
    public direcciones: any[] = [];
    load_table: boolean = false;
    constructor(
        public formBuilder: FormBuilder,
        private listar: ListService,
        private helper: HelperService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.filterForm = this.formBuilder.group({
            fecha_inicio: [''],
            fecha_fin: [''],
            actividad: [[], [Validators.minLength(1)]],
            encargado: [[], [Validators.minLength(1)]],
            estado: [[], [Validators.minLength(1)]],
            direccion: [[], [Validators.minLength(1)]],
            view: [true],
        });
    }
    viewmentOptions: any[] = [
        { name: 'Todos', value: null },
        { name: 'Visibles', value: true },
        { name: 'Ocultos', value: false },
    ];

    filtro() {
        this.helper.llamarspinner();
        this.load_table = false;
        const fechaInicio = this.filterForm.get('fecha_inicio').value;
        const fechaFin = this.filterForm.get('fecha_fin').value;
        const actividad = this.filterForm.get('actividad').value;
        const encargado = this.filterForm.get('encargado').value;
        const estado = this.filterForm.get('estado').value;
        const direccion = this.filterForm.get('direccion').value;
        const view = this.filterForm.get('view').value;

        const elementosFiltrados = this.constFicha.filter((elemento) => {
            // Filtrar por fecha de inicio y fin
            const fechaElemento = new Date(elemento.createdAt);
            if (
                fechaInicio &&
                fechaFin &&
                (fechaElemento < fechaInicio || fechaElemento > fechaFin)
            ) {
                return false;
            }

            const actividadValida =
                actividad.length === 0 ||
                actividad.some(
                    (c: any) =>
                        c._id.toString() === elemento.actividad._id.toString()
                );

            const encargadoValida =
                encargado.length === 0 ||
                encargado.some(
                    (s: any) =>
                        s._id.toString() === elemento.encargado._id.toString()
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
                direccion.some((d: any) => d.nombre == elemento.direccion_geo);
            const viewValida = view == null || elemento.view == view;

            return (
                actividadValida &&
                encargadoValida &&
                estadoValido &&
                direccionValida &&
                viewValida
            );
        });
        this.ficha = elementosFiltrados;
        // Mostrar totales y porcentajes en la tabla
        // Obtener totales y porcentajes
        this.totales = this.obtenerTotales(this.ficha);
        this.totales = this.obtenerPorcentajes(this.totales, this.ficha.length);
        for (const key in this.dataForm) {
            if (Object.prototype.hasOwnProperty.call(this.dataForm, key)) {
                const element = this.dataForm[key];
                this.dataForm[key] = this.crearDatosGrafico(this.totales[key]);
            }
        }
        this.load_table = true;
        setTimeout(() => {
            this.helper.cerrarspinner();
        }, 500);
    }

    totales: any;
    porcentajes: any;

    dataForm: any = {
        actividades: undefined,
        encargados: undefined,
        estados: undefined,
        direcciones: undefined,
    };
    trackByFn(index, item) {
        return item.id; // Cambia 'id' por la propiedad única de tu objeto
    }
    obtenerTotales(fichas: any[]) {
        const totales = {
            actividades: {},
            encargados: {},
            estados: {},
            direcciones: {},
        };

        fichas.forEach((elemento) => {
            // Categorías
            if (!totales.actividades[elemento.actividad.nombre]) {
                totales.actividades[elemento.actividad.nombre] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.actividades[elemento.actividad.nombre].registros++;

            // Subcategorías
            if (!totales.encargados[elemento.encargado.nombres]) {
                totales.encargados[elemento.encargado.nombres] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.encargados[elemento.encargado.nombres].registros++;

            // Estados
            if (!totales.estados[elemento.estado.nombre]) {
                totales.estados[elemento.estado.nombre] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.estados[elemento.estado.nombre].registros++;

            // Direcciones
            if (!totales.direcciones[elemento.direccion_geo]) {
                totales.direcciones[elemento.direccion_geo] = {
                    registros: 0,
                    porcentaje: 0,
                };
            }
            totales.direcciones[elemento.direccion_geo].registros++;
        });

        return totales;
    }

    obtenerPorcentajes(totales: any, totalFichas: number) {
        const porcentajes = {
            actividades: {},
            encargados: {},
            estados: {},
            direcciones: {},
        };

        for (const key in totales.actividades) {
            porcentajes.actividades[key] = {
                registros: totales.actividades[key].registros,
                porcentaje:
                    (totales.actividades[key].registros / totalFichas) * 100,
            };
        }

        for (const key in totales.encargados) {
            porcentajes.encargados[key] = {
                registros: totales.encargados[key].registros,
                porcentaje:
                    (totales.encargados[key].registros / totalFichas) * 100,
            };
        }

        for (const key in totales.estados) {
            porcentajes.estados[key] = {
                registros: totales.estados[key].registros,
                porcentaje:
                    (totales.estados[key].registros / totalFichas) * 100,
            };
        }

        for (const key in totales.direcciones) {
            porcentajes.direcciones[key] = {
                registros: totales.direcciones[key].registros,
                porcentaje:
                    (totales.direcciones[key].registros / totalFichas) * 100,
            };
        }

        return porcentajes;
    }
    check: any = {};
    async ngOnInit() {
        //this.helper.llamarspinner();
        this.check.DashboardComponent =
            this.helper.decryptData('DashboardComponent') || false;
        this.check.ReporteFichaView =
            this.helper.decryptData('ReporteFichaView') || false;
        //console.log(this.check.DashboardComponent);
        if (!this.check.DashboardComponent) {
            this.router.navigate(['/notfound']);
        }

        if (!this.token) {
            this.router.navigate(['/auth/login']);
            //this.helper.cerrarspinner();
            throw new Error('Token no encontrado');
        }
        await this.rankin();
        await this.listCategoria();
        await this.listarEstado();
        this.filterForm.get('actividad').valueChanges.subscribe(() => {
            this.updateEncargados();
        });
        setTimeout(() => {
            // this.helper.cerrarspinner();
            this.filtro();
        }, 550);
    }
    async listarEstado() {
        if (this.token)
            this.listar
                .listarEstadosActividadesProyecto(this.token)
                .subscribe((response) => {
                    if (response.data) {
                        this.estados = response.data;
                    }
                });
    }
    async listCategoria() {
        if (this.token)
            this.listar
                .listarTiposActividadesProyecto(this.token)
                .subscribe((response) => {
                    if (response.data) {
                        this.actividades = response.data;
                    }
                });
    }
    async updateEncargados() {
        this.filterForm.get('encargado').setValue([]);
        const actividadSeleccionada = this.filterForm.get('actividad').value;
        this.encargados = [];
        try {
            for (const actividad of actividadSeleccionada) {
                const encargadosActividad = this.constFicha
                    .filter((ficha) => ficha.actividad._id == actividad._id)
                    .map((ficha) => ficha.encargado);
                this.encargados = this.encargados.concat(encargadosActividad);
            }
            // Eliminar duplicados
            this.encargados = this.encargados.filter(
                (encargado, index, self) =>
                    index ===
                    self.findIndex(
                        (e) =>
                            e._id === encargado._id &&
                            e.nombres === encargado.nombres
                    )
            );
        } catch (error) {
            console.error('Error al obtener encargados:', error);
        }
    }

    constFicha: any[] = [];
    ficha: any[] = [];
    options: any;
    async rankin() {
        // Obtener todos los fichas si aún no se han cargado
        if (this.constFicha.length === 0) {
            try {
                const response: any = await this.listar
                    .listarFichaSectorial(this.token, '', '')
                    .toPromise();
                if (response.data) {
                    this.constFicha = response.data;
                }
            } catch (error) {
                console.error('Error al obtener fichas:', error);
                return;
            }
        } else {
            this.ficha = this.constFicha;
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
        this.constFicha.forEach((ficha: any) => {
            const direccionGeo = ficha.direccion_geo;
            const nombre = direccionGeo;
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

    exportToCSV(table: Table, titulo?: string) {
        let selectedColumns = [];
        let header: any;
        let csv: any[] = [];
        if (!titulo) {
            for (const key in table.filters) {
                if (Object.prototype.hasOwnProperty.call(table.filters, key)) {
                    //const element = table.filters[key];
                    selectedColumns.push({
                        field: key,
                        header: key.split('.')[0],
                    });
                }
            }
            header = selectedColumns
                .map((col) => col.header ?? col.field)
                .join(';');
            csv = table.value.map((row) =>
                selectedColumns
                    .map((col) => this.resolveFieldData(row, col.field))
                    .map((value) => {
                        if (typeof value === 'string') {
                            return '"' + value.replace(/"/g, '""') + '"';
                        }
                        return value;
                    })
                    .join(';')
            );
        } else {
            selectedColumns = [
                { field: titulo, header: titulo },
                { field: 'Cantidad', header: 'Cantidad' },
                { field: 'Porcentaje', header: 'Porcentaje' },
            ];
            header = selectedColumns
                .map((col) => col.header ?? col.field)
                .join(';');
            // Construir las filas del CSV
            csv = table.value.map((row) => {
                const titulo = row[0];
                const registros = row[1].registros;
                const porcentaje = row[1].porcentaje
                    .toFixed(2)
                    .replace('.', ',');

                return [titulo, registros, porcentaje]
                    .map((value) => {
                        if (typeof value === 'string') {
                            return '"' + value.replace(/"/g, '""') + '"';
                        }
                        return value;
                    })
                    .join(';');
            });
        }
        csv.unshift(header);
        const csvContent = '\uFEFF' + csv.join('\n'); // UTF-8 BOM
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        let ext = '.csv';
        a.download = titulo ? titulo + ext : 'FichasFiltrado' + ext;
        a.click();
        URL.revokeObjectURL(url);
    }
    private resolveFieldData(data: any, field: any): any {
        if (data && field) {
            const path = field.split('.');
            let obj = data;
            for (let i = 0, len = path.length; i < len; ++i) {
                obj = obj[path[i]];
            }
            return obj;
        } else {
            return null;
        }
    }

    getSeverity(
        status: string
    ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        switch (status.toLowerCase()) {
            case 'suspendido':
                return 'danger';

            case 'finalizado':
                return 'success';

            case 'en proceso':
                return 'info';

            case 'pendiente':
                return 'warning';

            case 'planificada':
                return 'info';

            default:
                return 'secondary'; // Asegúrate de retornar un valor válido por defecto
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

        for (const actividad of this.getEntries(totales)) {
            totalRegistros += actividad[1].registros;
            totalPorcentaje += actividad[1].porcentaje;
        }

        return { totalRegistros, totalPorcentaje };
    }

    exportChart(
        chart: UIChart,
        exportCanvas: HTMLCanvasElement,
        titulo: string
    ) {
        const base64Image = chart.getBase64Image();
        const img = new Image();
        img.onload = () => {
            exportCanvas.width = img.width;
            exportCanvas.height = img.height;
            const exportContext = exportCanvas.getContext('2d');
            exportContext.drawImage(img, 0, 0);

            exportCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = titulo + '.png';
                a.click();
                URL.revokeObjectURL(url);
            });
        };
        img.src = base64Image;
    }
}
