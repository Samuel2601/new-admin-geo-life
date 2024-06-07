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
import { MapaFichaComponent } from '../mapa-ficha/mapa-ficha.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StepperModule } from 'primeng/stepper';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
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
        MapaComponent,
        StepperModule,
        RouterModule,
        MapaFichaComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    responsiveOptions: any[] = [];
    productos: any[] = [];
    token = this.helperService.token() || undefined;
    incidencia: FormGroup<any>;
    constructor(
        private list: ListService,
        private helperService: HelperService,
        private fb: FormBuilder,
        public dialogService: DialogService,
        private router: Router
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
        this.helperService.setHomeComponent(this);

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
        this.productos.push(
            {
                id: '1000',
                image: 'https://i.postimg.cc/NMKRV1SJ/Esmeraldas-la-Bella.png',
                url: 'https://play.google.com/store/apps/details?id=ec.gob.esmeraldas.labella&hl=es_CL&gl=US',
                items: [
                    {
                        logo: 'assets/icon/icono-ico.png',
                        titulo: 'ESMERALDAS LA BELLA',
                        descripcion:
                            'Cada ves, más cerca de ti <br> Ya puedes usar nuestra APP',
                    },
                ],
                mobil: false,
            },
            /*{
                id: '1001',
                image: 'https://i.postimg.cc/4ydyyKYh/444943064-772994744996058-5130094033753262063-n.jpg',
                items: [
                    {
                        logo: 'assets/icon/icono-ico.png',
                        titulo: 'ESMERALDAS LA BELLA',
                        descripcion: 'Estamos trabajando por tu bienestar',
                    },
                    {
                        logo: 'assets/icon/icono-ico.png',
                        titulo: 'ESMERALDAS LA BELLA',
                        descripcion: 'Registra tus incumbenientes',
                    },
                    {
                        logo: 'assets/icon/icono-ico.png',
                        titulo: 'ESMERALDAS LA BELLA',
                        descripcion: 'Mira lo que se ha realizado en tu barrio',
                    },
                ],
                mobil: true,
            },*/
            {
                id: '1002',
                image: 'https://i.postimg.cc/nL4GYW0G/notice-recolector.jpg',
                url: 'https://www.facebook.com/photo/?fbid=773092638319602&set=a.487906363504899',
                mobil: true,
            },
            {
                id: '1002',
                image: 'https://i.postimg.cc/4ydyyKYh/444943064-772994744996058-5130094033753262063-n.jpg',
                url: 'https://www.facebook.com/alcaldiaciudadanadeesmeraldas/posts/pfbid037w3Up2J5CWBLeHtVYb69dJ9ZD3KKgwrUy6ga5gQxwjYa32souymP6tgbh9r2szj7l?rdid=SPHco5EmCgtnqfzb',
                mobil: true,
            },
            {
                id: '1002',
                image: 'https://i.postimg.cc/bwbJZfwL/444480002-771894401772759-148770588324050042-n333.jpg',
                url: 'https://www.facebook.com/alcaldiaciudadanadeesmeraldas/posts/pfbid0THQ1Q3s95P8VyRthucxoCDGbR94EgpV9KSdsUqeTnwXSrWEnUndLNe8epDM2qGp8l',
                mobil: true,
            }
        );
        this.filterProductos();
    }
    buttons = [
        {
            label: 'Incidentes/ESVIAL',
            info: 'Puedes reportar los incidentes y denuncias con respecto a ESVIAL.',
            icon: 'https://i.postimg.cc/PJWtsTFC/ESVIAL.png',
            showInfo: false,            
            command: async () => {                
                this.incidente('ESVIAL','Transporte terrestre y seguridad vial');
            },
        },
        {
            label: 'Incidentes/EPMAPSE',
            info: 'Puedes reportar los incidentes y denuncias con respecto a EPMAPSE.',
            icon: 'https://i.postimg.cc/yYGf4ccS/Agua-Potable-y-Alcantarillado.png',
            showInfo: false,
            command: async () => {
                this.incidente('Agua Potable y Alcantarillado');
            },
        },
        {
            label: 'Incidentes/BOMBEROS',
            info: 'Puedes reportar los incidentes y denuncias con respecto a BOMBEROS.',
            icon: 'https://i.postimg.cc/MH5g262p/bomberos.png',
            showInfo: false,
            command: async () => {
                this.incidente('Cuerpo de Bomberos','Incendios / Desastres varios');
            },
        },
        {
            label: 'Incidentes/RECOLECTORES',
            info: 'Puedes reportar los incidentes y denuncias con respecto a RECOLECTORES.',
            icon: 'https://i.postimg.cc/qMg1MX2L/recolectores-ver-recolectores.png',
            showInfo: false,
            command: async () => {
                this.incidente('Higiene',' Servicio de recolección de desechos');
            },
        },
        {
            label: 'Otros Incidentes',
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
                this.ficha();
            },
        },
        {
            label: 'Alcaldía Informa',
            info: 'Mantente informado sobre comunicados de la alcaldía.',
            icon: 'assets/menu/publicacion.png',
            showInfo: false,
            command: async () => {
                window.open(
                    'https://esmeraldas.gob.ec/noticias.html',
                    '_blank'
                );
            },
        },
       /* {
            label: 'Otros Servicios',
            info: 'Descubre otros servicios disponibles para ti.',
            icon: 'assets/menu/servicios.png',
            showInfo: false,
            command: async () => {
                window.open('https://tramites.esmeraldas.gob.ec/', '_blank');
            },
        },
        {
            label: 'Esvial',
            info: 'Servicio en Línea, consulta de citaciones.',
            icon: 'https://i.postimg.cc/PJWtsTFC/ESVIAL.png',
            showInfo: false,
            command: async () => {
                window.open('https://servicios.axiscloud.ec/AutoServicio/inicio.jsp?ps_empresa=10&ps_accion=P55', '_blank');
            },
        },*/
    ];
    filteredProductos: any[] = [];
    
    filterProductos(): void {
        if (this.isMobil()) {
            this.filteredProductos = this.productos.filter(
                (product) => product.mobil
            );
        } else {
            this.filteredProductos = this.productos;
        }
    }
    openLink(url) {
        if (url) {
            window.open(url, '_blank');
        }
    }
    isMobil(): boolean {
        return this.helperService.isMobil();
    }

    visible_incidente: boolean = false;
    button_active:any={cate:'',sub:''};
    incidente(cate?,sub?) {

        if(cate){
            this.button_active.cate=cate;
        }else{
            this.button_active.cate=undefined
        }

        if(sub){
            this.button_active.sub=sub;
        }else{
            this.button_active.sub=undefined
        }

        if (!this.token) {
            throw this.router.navigate(['/auth/login']);
        } else {
            this.visible_incidente = true;
        }
    }

    visible_ficha: boolean = false;
    ficha() {
        if (!this.token) {
            throw this.router.navigate(['/auth/login']);
        } else {
            this.visible_ficha = true;
        }
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
