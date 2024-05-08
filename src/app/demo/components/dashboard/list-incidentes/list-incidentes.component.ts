import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/demo/services/helper.service';
import { ListService } from 'src/app/demo/services/list.service';
import { MessageService } from 'primeng/api';
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
                direccion.some((d: any) => d._id == elemento.direccion._id);

            return (
                categoriaValida &&
                subcategoriaValida &&
                estadoValido &&
                direccionValida
            );
        });

        console.log('Cantidad de elementos filtrados:', elementosFiltrados);
    }
    async ngOnInit() {
        await this.rankin();
        await this.listCategoria();
        this.filterForm.get('categoria').valueChanges.subscribe(() => {
            this.updateSubcategorias();
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
        // Aquí puedes realizar la lógica para obtener las subcategorías basadas en la categoría seleccionada
        // Por ejemplo, si tienes un servicio que devuelve las subcategorías basadas en la categoría seleccionada, podrías hacer algo como:
        
        this.listar.listarSubcategorias(this.token).subscribe(
            (response) => {
                if (response.data) {
                    this.subcategorias.push(...response.data);
                }
            },
            (error) => {
                console.error('Error al obtener subcategorias:', error);
            }
        );
    }
    constIncidente: any[] = [];
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
        }
        console.log(this.constIncidente);
    }
}
