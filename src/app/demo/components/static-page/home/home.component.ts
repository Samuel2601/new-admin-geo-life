import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ListService } from 'src/app/demo/services/list.service';
import { HelperService } from 'src/app/demo/services/helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MapaComponent } from '../mapa/mapa.component';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        NgbModule,
        CommonModule,
        CardModule,
        ButtonModule,
        TooltipModule,
        CarouselModule,
        TagModule,
        DialogModule,
        TableModule,
        MapaComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    responsiveOptions: any[] = [];
    producto: any[] = [];
    token = this.helperService.token() || undefined;
    incidencia: FormGroup<any>;
    constructor(
        private list: ListService,
        private helperService: HelperService,
        private fb: FormBuilder
    ) {
        this.incidencia = this.fb.group({
            direccion_geo: [{ value: '', disabled: true }],
            ciudadano: [{ value: '', disabled: true }, Validators.required],
            estado: [{ value: '', disabled: true }, Validators.required],
            categoria: [{ value: '', disabled: true }, Validators.required],
            subcategoria: [{ value: '', disabled: true }, Validators.required],
            descripcion: [{ value: '', disabled: true }, Validators.required],
            encargado: [{ value: '', disabled: true }, Validators.required],
            respuesta: [{ value: '', disabled: true }, Validators.required],
            evidencia: [[]],
            view: true,
        });
    }
    ngOnInit(): void {
        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1,
            },
            {
                breakpoint: '991px',
                numVisible: 1,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1,
            },
        ];
        this.producto.push(
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5,
            },
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5,
            },
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5,
            }
        );
    }
    buttons = [
        {
            label: 'Incidentes',
            info: 'Puedes reportar los incidentes y denuncias que se presenten en la ciudad.',
            icon: 'assets/menu/seguimiento.png',
            showInfo: false,
            command: async () => {
                this.incidente();
            },
        },
        {
            label: 'Fichas Sectoriales',
            info: 'Accede a información detallada sobre eventos y actividades en tu sector.',
            icon: 'assets/menu/negocio.png',
            showInfo: false,
            command: async () => {
                this.incidente();
            },
        },
        {
            label: 'Alcaldía Informa',
            info: 'Mantente informado sobre comunicados de la alcaldía.',
            icon: 'assets/menu/publicacion.png',
            showInfo: false,
            command: async () => {
                this.incidente();
            },
        },
        {
            label: 'Otros Servicios',
            info: 'Descubre otros servicios disponibles para ti.',
            icon: 'assets/menu/servicios.png',
            showInfo: false,
            command: async () => {
                window.open('https://tramites.esmeraldas.gob.ec/', '_blank');
            },
        },
    ];
    isMobil(): boolean {
        return this.helperService.isMobil();
    }

    visible_categoria: boolean = false;
    visible_subcategoria: boolean = false;
    incidente() {
        this.visible_categoria = true;
        this.listCategoria();
    }
    categorias: any[] = [];
    listCategoria() {
        this.list.listarCategorias(this.token).subscribe((response) => {
            if (response.data) {
                this.categorias = response.data;
                console.log(this.categorias);
            }
        });
    }
    subcategorias: any[] = [];
    onCategoriaClick(cateogria: any) {
        console.log(cateogria);
        this.incidencia.get('categoria').setValue(cateogria);
        this.visible_categoria = false;
        this.visible_subcategoria = true;
        this.list
            .listarSubcategorias(this.token, 'categoria', cateogria._id)
            .subscribe((response) => {
                console.log(response);
                if (response.data) {
                    this.subcategorias = response.data;
                }
            });
    }
    visible_map: boolean = false;
    onSubCategoriaClick(subcategoria: any) {
        console.log(subcategoria);
        this.visible_map=true;
       // this.initmap();
    }


    showInfo(button: any) {
        button.showInfo = true;
    }

    hideInfo(button: any) {
        button.showInfo = false;
    }

    toggleInfo(button: any) {
        button.showInfo = !button.showInfo;
    }
    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'danger';
        }
    }
    iconPaths: { [key: string]: string } = {};

    getIconPath(categoria: any): string {
        if (!this.iconPaths[categoria.nombre]) {
            const svgPath = `assets/categorias/${categoria.nombre}.svg`;
            const pngPath = `assets/categorias/${categoria.nombre}.png`;

            // Verificar si el archivo SVG existe
            if (this.fileExists(svgPath)) {
                this.iconPaths[categoria.nombre] = svgPath;
            } else {
                this.iconPaths[categoria.nombre] = pngPath;
            }
        }

        return this.iconPaths[categoria.nombre];
    }
    fileExists(url: string): boolean {
        const http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status !== 404;
    }
}
