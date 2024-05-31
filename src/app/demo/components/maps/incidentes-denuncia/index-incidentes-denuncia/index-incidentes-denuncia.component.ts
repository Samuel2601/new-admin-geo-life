import {
    Component,
    OnInit,
    ViewChild,
    TemplateRef,
    Input,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from 'src/app/demo/services/list.service';
import { IndexEstadoIncidenteComponent } from '../estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { GLOBAL } from 'src/app/demo/services/GLOBAL';
import { HelperService } from 'src/app/demo/services/helper.service';
import { Capacitor } from '@capacitor/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { App } from '@capacitor/app';
import { AdminService } from 'src/app/demo/services/admin.service';
import { filter } from 'rxjs/operators';
import { helpers } from '@turf/turf';
import { EditIncidentesDenunciaComponent } from '../edit-incidentes-denuncia/edit-incidentes-denuncia.component';
import { DeleteService } from 'src/app/demo/services/delete.service';
import { UpdateService } from 'src/app/demo/services/update.service';
@Component({
    selector: 'app-index-incidentes-denuncia',
    templateUrl: './index-incidentes-denuncia.component.html',
    styleUrl: './index-incidentes-denuncia.component.scss',
    providers: [MessageService],
})
export class IndexIncidentesDenunciaComponent implements OnInit, OnChanges {
    public url = GLOBAL.url;
    constructor(
        private ref: DynamicDialogRef,
        private router: Router,
        private route: ActivatedRoute,
        private listService: ListService,
        private modalService: NgbModal,
        private helperservice: HelperService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private admin: AdminService,
        private deleteser: DeleteService,
        private updateService: UpdateService
    ) {}

    load_lista = true;

    @Input() filtro: string | undefined;
    @Input() valor: string | undefined;
    @Input() modal: any = false;

    @Input() categoria: string | undefined;
    @Input() subcategoria: string | undefined;

    deshabilitarMapaDesdeIndexFichaSectorial(event: MouseEvent) {
        this.stopPropagation(event);
        this.helperservice.deshabilitarMapa();
    }
    stopPropagation(event: MouseEvent) {
        event.stopPropagation();
    }

    width = 200; // Ancho inicial de la componente
    height = 200; // Altura inicial de la componente
    isResizing = false; // Indicador de si se está redimensionando

    startResize(event: MouseEvent | TouchEvent): void {
        let initialY = 0;
        if (event instanceof MouseEvent) {
            initialY = (event as MouseEvent).clientY;
        } else if (event instanceof TouchEvent) {
            initialY = (event as TouchEvent).touches[0].clientY;
        }

        const mouseMoveListener = (moveEvent: MouseEvent | TouchEvent) => {
            let currentY = 0;
            if (moveEvent instanceof MouseEvent) {
                currentY = (moveEvent as MouseEvent).clientY;
            } else if (moveEvent instanceof TouchEvent) {
                currentY = (moveEvent as TouchEvent).touches[0].clientY;
            }

            this.height += initialY - currentY;
            initialY = currentY;
        };

        const mouseUpListener = () => {
            document.removeEventListener('mousemove', mouseMoveListener);
            document.removeEventListener('touchmove', mouseMoveListener);
            document.removeEventListener('mouseup', mouseUpListener);
            document.removeEventListener('touchend', mouseUpListener);
        };

        document.addEventListener('mousemove', mouseMoveListener);
        document.addEventListener('touchmove', mouseMoveListener);
        document.addEventListener('mouseup', mouseUpListener);
        document.addEventListener('touchend', mouseUpListener);
    }
    private initialTouchY: number = 0;
    private isDragging: boolean = false;

    get vermodal(): boolean {
        if (this.modal) {
            return this.modal;
        } else {
            return false;
        }
    }
    set vermodal(val: boolean) {
        this.helperservice.cerrarincidente();
    }

    onTouchStart(event: TouchEvent) {
        this.initialTouchY = event.touches[0].clientY;
        this.isDragging = true;
    }

    onTouchMove(event: TouchEvent) {
        if (!this.isDragging) {
            return;
        }

        // Calcula la distancia vertical del arrastre
        const deltaY = event.touches[0].clientY - this.initialTouchY;

        // Realiza acciones según la distancia vertical
        // Por ejemplo, cambiar la altura del elemento
        // o realizar alguna otra acción de acuerdo a tu necesidad
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    isMobil() {
        return this.helperservice.isMobil();
    }

    checkstatus = ['danger', 'warning', 'danger', 'success'];

    @ViewChild('contentimage') modalContent: TemplateRef<any> | undefined;
    incidentesDenuncias: any = [];

    check: any = {};
    token = this.helperservice.token();
    id = this.admin.identity(this.token);
    rol = this.admin.roluser(this.token);

    async ngOnInit(): Promise<void> {
        //console.log(this.rol);
        if (!this.modal) this.helperservice.llamarspinner();
        try {
            this.check.IndexIncidentesDenunciaComponent =
                this.helperservice.decryptData(
                    'IndexIncidentesDenunciaComponent'
                ) || false;

            this.check.IndexEstadoIncidenteComponent =
                this.helperservice.decryptData(
                    'IndexEstadoIncidenteComponent'
                ) || false;

            this.check.TotalFilterIncidente =
                this.helperservice.decryptData('TotalFilterIncidente') || false;
            this.check.EditIncidentesDenunciaComponent =
                this.helperservice.decryptData(
                    'EditIncidentesDenunciaComponent'
                ) || false;
            this.check.BorrarIncidente =
                this.helperservice.decryptData('BorrarIncidente') || false;

            this.check.IndexEstadoIncidenteComponent =
                this.helperservice.decryptData(
                    'IndexEstadoIncidenteComponent'
                ) || false;
            this.check.ViewIncidente =
                this.helperservice.decryptData('ViewIncidente') || false;
            this.check.ContestarIncidente =
                this.helperservice.decryptData('ContestarIncidente') || false;
            if (!this.check.IndexIncidentesDenunciaComponent) {
                this.router.navigate(['/notfound']);
            }
            this.check.FichaLimitada =
                this.helperservice.decryptData('FichaLimitada') || false;

            ////console.log(this.check);
            await this.buscarencargos();
        } catch (error) {
            ////console.error('Error al verificar permisos:', error);
            this.router.navigate(['/notfound']);
        }
    }

    encargos: any[] = [];
    async buscarencargos() {
        this.listService
            .listarEncargadosCategorias(this.token, 'encargado', this.id)
            .subscribe((response) => {
                //console.log(response);
                if (response.data) {
                    this.encargos = response.data;
                }
                this.listarIncidentesDenuncias();
                if (!this.modal) this.helperservice.cerrarspinner();
            });
    }
    itemh: any[] = [];
    loadpath: boolean = false;
    listarIncidentesDenuncias(): void {
        this.itemh = [];
        this.loadpath = false;
        if (!this.modal) {
            this.helperservice.llamarspinner();
        }
        this.load_lista = true;
        if (!this.token) {
            throw this.router.navigate(['/auth/login']);
        }

        let filtroServicio = '';
        let valorServicio: any;

        if (this.filtro && this.valor) {
            filtroServicio = this.filtro;
            valorServicio = this.valor;
            this.itemh.push({ label: this.valor });
        }

        if (!this.check.TotalFilterIncidente && this.encargos.length == 0) {
            filtroServicio = 'ciudadano';
            valorServicio = this.id;
        }
        //console.log(filtroServicio, valorServicio,this.encargos);
        this.listService
            .listarIncidentesDenuncias(
                this.token,
                filtroServicio,
                valorServicio
            )
            .subscribe(
                (response) => {
                    if (response.data) {
                        this.incidentesDenuncias = response.data;
                        if (
                            this.filtro &&
                            this.valor &&
                            !this.check.TotalFilterIncidente
                        ) {
                            const [campo, propiedad] = this.filtro.split('.');
                            //console.log("Separacion",campo,propiedad);
                            this.incidentesDenuncias =
                                this.incidentesDenuncias.filter(
                                    (ficha: any) => {
                                        if (propiedad) {
                                            if (
                                                ficha[campo][propiedad] ==
                                                this.valor
                                            ) {
                                                return ficha;
                                            }
                                        } else {
                                            if (ficha[campo] == this.valor) {
                                                return ficha;
                                            }
                                        }
                                    }
                                );
                        }
                        //console.log(this.incidentesDenuncias);
                        if (
                            !this.check.TotalFilterIncidente &&
                            this.encargos.length > 0
                        ) {
                            this.incidentesDenuncias =
                                this.incidentesDenuncias.filter((ficha: any) =>
                                    this.encargos.find(
                                        (element) =>
                                            element.categoria._id ===
                                                ficha.categoria._id ||
                                            ficha.ciudadano._id == this.id
                                    )
                                );
                        }

                        if (this.categoria) {
                            this.itemh.push({ label: this.categoria });
                            this.incidentesDenuncias =
                                this.incidentesDenuncias.filter(
                                    (ficha: any) =>
                                        ficha.categoria.nombre ===
                                        this.categoria
                                );
                        }
                        if (this.subcategoria) {
                            this.itemh.push({ label: this.subcategoria });
                            this.incidentesDenuncias =
                                this.incidentesDenuncias.filter(
                                    (ficha: any) =>
                                        ficha.subcategoria.nombre ===
                                        this.subcategoria
                                );
                        }
                        if (this.encargos.length > 0) {
                            this.encargos.forEach((element) => {
                                if (element.categoria) {
                                    this.itemh.push({
                                        label: element.categoria.nombre,
                                    });
                                    this.incidentesDenuncias =
                                        this.incidentesDenuncias.filter(
                                            (ficha: any) =>
                                                ficha.categoria.nombre ===
                                                    element.categoria.nombre ||
                                                ficha.ciudadano._id === this.id
                                        );
                                }
                            });
                        }
                        if (!this.check.ViewIncidente) {
                            this.incidentesDenuncias =
                                this.incidentesDenuncias.filter(
                                    (ficha: any) => ficha.view == true
                                );
                        }
                        this.load_lista = false;
                        this.loadpath = true;
                        // Obtener el ID de la URL
                        this.route.paramMap.subscribe((params) => {
                            const id = params.get('id');
                            //console.log(id, this.incidentesDenuncias);
                            if (id) {
                                this.option = this.incidentesDenuncias.find(
                                    (element) => element._id == id
                                );
                                if (this.option) {
                                    this.visible = true;
                                } else {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'ERROR',
                                        detail: 'Incidente no encontrado',
                                    });
                                }
                            }
                        });
                    }
                },
                (error) => {
                    this.load_lista = false;
                    if (error.error.message == 'InvalidToken') {
                        this.router.navigate(['/auth/login']);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: ('(' + error.status + ')').toString(),
                            detail: error.error.message || 'Sin conexión',
                        });
                    }
                }
            );

        if (!this.modal) {
            this.helperservice.cerrarspinner();
        }
    }
    visible: boolean = false;
    option: any;
    balanceFrozen: boolean = true;
    llamarmodal() {
        this.ref = this.dialogService.open(IndexEstadoIncidenteComponent, {
            header: '',
            dismissableMask: true,
            width: this.isMobil() ? '100%' : '70%',
        });
        App.addListener('backButton', (data) => {
            this.ref.close();
        });
    }
    editar(edit: boolean) {
        this.ref = this.dialogService.open(EditIncidentesDenunciaComponent, {
            header: 'Editar Incidente',
            dismissableMask: true,
            width: this.isMobil() ? '100%' : '70%',
            data: { id: this.option._id, edit: edit },
        });
        this.ref.onClose.subscribe((data: any) => {
            if (data) {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Actualizando',
                    detail: 'Recargando pagina',
                });
                this.listarIncidentesDenuncias();
            }
        });
        App.addListener('backButton', (data) => {
            this.ref.close();
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filtro'] || changes['valor']) {
            this.listarIncidentesDenuncias();
            this.height = 300;
        }
    }
    irMap(direccion: any, event: any) {
        event.stopPropagation();
        ////console.log('Marcando');
        //this.helperservice.marcarlugar(direccion.latitud,direccion.longitud,'Incidente del Ciudadano');
        const carficha = document.getElementById('card-ficha');
        if (carficha) {
            carficha.addEventListener('touchend', this.onTouchEnd.bind(this));
            carficha.addEventListener('mouseup', this.onTouchEnd.bind(this));
        }
    }

    imagenModal: any[] = [];
    openModal(content: any) {
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title',
        });
    }
    openModalimagen(url: any) {
        this.imagenModal = url;
        this.imagenAMostrar = this.imagenModal[0];
        //const this.ref = this.modalService.open(this.modalContent, { size: 'lg' });
    }
    imagenAMostrar: any;

    mostrarImagen(index: number) {
        this.imagenAMostrar = this.imagenModal[index];
        // Aquí agregamos la lógica para cambiar el índice activo del carrusel
        document.querySelectorAll('.carousel-item').forEach((el, i) => {
            if (i === index) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }
    marcarsitio(direccion: any, nombre?: any) {
        this.helperservice.marcarLugar(
            direccion.latitud,
            direccion.longitud,
            nombre
        );
    }

    displayBasic: boolean = false;

    responsiveOptions: any[] = [
        {
            breakpoint: '1500px',
            numVisible: 5,
        },
        {
            breakpoint: '1024px',
            numVisible: 3,
        },
        {
            breakpoint: '768px',
            numVisible: 2,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];
    clear(table: Table) {
        table.clear();
    }

    getSeverity(
        status: string,
        fecha?: any
    ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        switch (status.toLowerCase()) {
            case 'suspendido':
                return 'danger';

            case 'finalizado':
                return 'success';

            case 'en proceso':
                return 'success';

            case 'pendiente':
                let fechaActualMenosTresDias = new Date(fecha);
                fechaActualMenosTresDias.setDate(
                    fechaActualMenosTresDias.getDate() + 3
                );

                if (
                    fechaActualMenosTresDias.getTime() <= new Date().getTime()
                ) {
                    return 'danger';
                } else {
                    return 'warning';
                }

            case 'planificada':
                return 'info'; // Otra opción aquí, dependiendo de lo que desees

            default:
                return 'success'; // Otra opción aquí, dependiendo de lo que desees
        }
    }
    iddelete: any = '';
    visibledelete = false;

    eliminarModal(row: any) {
        this.iddelete = row;
        //console.log(this.iddelete, this.id);
        this.visibledelete = true;
    }

    eliminarIncidente() {
        if (this.iddelete) {
            if (
                this.id == this.iddelete.ciudadano._id ||
                this.check.BorrarIncidente
            ) {
                this.deleteser
                    .eliminarIncidenteDenuncia(this.token, this.iddelete._id)
                    .subscribe(
                        (response) => {
                            if (response) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Eliminado',
                                    detail: response.message,
                                });
                                setTimeout(() => {
                                    this.ref.close();
                                    this.listarIncidentesDenuncias();
                                    this.visible = false;
                                    this.option = null;
                                    this.iddelete = null;
                                }, 1500);
                            }
                        },
                        (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: ('(' + error.status + ')').toString(),
                                detail: error.error.message || 'Sin conexión',
                            });
                        }
                    );
            } else {
                this.iddelete.view = false;
                this.iddelete.view_id = this.id;
                this.iddelete.view_date = new Date();

                delete this.iddelete.direccion_geo;
                this.updateService
                    .actualizarIncidenteDenuncia(
                        this.token,
                        this.iddelete._id,
                        this.iddelete
                    )
                    .subscribe(
                        (response) => {
                            //console.log(response);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Eliminado',
                                detail: response.message,
                            });
                            setTimeout(() => {
                                this.ref.close();
                                this.listarIncidentesDenuncias();
                                this.visible = false;
                                this.option = undefined;
                            }, 1000);
                        },
                        (error) => {
                            console.error(error);
                            this.messageService.add({
                                severity: 'error',
                                summary: ('(' + error.status + ')').toString(),
                                detail: error.error.message || 'Sin conexión',
                            });
                        }
                    );
            }
        }
    }
}
