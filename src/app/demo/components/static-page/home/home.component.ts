import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/demo/services/list.service';
import { HelperService } from 'src/app/demo/services/helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { ImportsModule } from 'src/app/demo/services/import';
import { MapaComponent } from '../mapa/mapa.component';
import { MapaFichaComponent } from '../mapa-ficha/mapa-ficha.component';
import { DashboardModule } from '../../dashboard/dashboard.module';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        ImportsModule,
        MapaComponent,
        MapaFichaComponent,
        DashboardModule,
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
    DashboardComponent: boolean=false;
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
                image: 'https://i.postimg.cc/CxyHrcCz/alcalde-2-1.jpg',
                url: 'https://www.facebook.com/alcaldiaciudadanadeesmeraldas/posts/pfbid037w3Up2J5CWBLeHtVYb69dJ9ZD3KKgwrUy6ga5gQxwjYa32souymP6tgbh9r2szj7l?rdid=SPHco5EmCgtnqfzb',
                mobil: true,
            },
            {
                id: '1002',
                image: 'https://i.postimg.cc/44S1Vfmv/12-02-informr-alcalde-1.jpg',
                url: 'https://www.facebook.com/alcaldiaciudadanadeesmeraldas/posts/pfbid0THQ1Q3s95P8VyRthucxoCDGbR94EgpV9KSdsUqeTnwXSrWEnUndLNe8epDM2qGp8l',
                mobil: true,
            }
        );
        try {
            this.DashboardComponent =
            this.helperService.decryptData('DashboardComponent') || false;
            
        } catch (error) {
            
        }
        this.filterProductos();
    }
    buttons = [
        {
            label: 'Incidentes/ESVIAL',
            info: 'Puedes reportar los incidentes y denuncias con respecto a ESVIAL.',
            icon: 'https://i.postimg.cc/CxxGM2YS/VIAL.png',
            showInfo: false,
            command: async () => {
                this.incidente(
                    'ESVIAL',
                    'Transporte terrestre y seguridad vial'
                );
            },
        },
        {
            label: 'Incidentes/EPMAPSE',
            info: 'Puedes reportar los incidentes y denuncias con respecto a EPMAPSE.',
            icon: 'https://i.postimg.cc/LX5rhc1p/AGUA-1.png',
            showInfo: false,
            command: async () => {
                this.incidente('Agua Potable y Alcantarillado');
            },
        },
        {
            label: 'Incidentes/BOMBEROS',
            info: 'Puedes reportar los incidentes y denuncias con respecto a BOMBEROS.',
            icon: 'https://i.postimg.cc/8PHdSS2Z/BOMBEROS-2.png',
            showInfo: false,
            command: async () => {
                this.incidente(
                    'Cuerpo de Bomberos',
                    'Incendios / Desastres varios'
                );
            },
        },
        {
            label: 'Incidentes/RECOLECTORES',
            info: 'Puedes reportar los incidentes y denuncias con respecto a RECOLECTORES.',
            icon: 'https://i.postimg.cc/3wy2mDdq/RECOLECTORES.png',
            showInfo: false,
            command: async () => {
                this.incidente(
                    'Higiene',
                    ' Servicio de recolección de desechos'
                );
            },
        },
        {
            label: 'Otros Incidentes',
            info: 'Puedes reportar los incidentes y denuncias que se presenten en la ciudad.',
            icon: 'https://i.postimg.cc/cJxqGg16/OTROS.png',
            showInfo: false,
            command: async () => {
                this.incidente();
            },
        },
        {
            label: 'Fichas Sectoriales',
            info: 'Accede a información detallada sobre eventos y actividades en tu sector.',
            icon: 'https://i.postimg.cc/kg3BG4JP/icoco-fichas-2.png',
            showInfo: false,
            command: async () => {
                this.ficha();
            },
        },
        {
            label: 'Noticias',
            info: 'Mantente informado sobre comunicados de la alcaldía.',
            icon: 'https://i.postimg.cc/yNvM11Wj/NOTICIAS.png',
            showInfo: false,
            command: async () => {
                window.open(
                    'https://esmeraldas.gob.ec/noticias.html',
                    '_blank'
                );
            },
        },
        {
            label: 'Alcaldía Ciudadana',
            info: 'Interactua con las diferentes unidades de la Alcaldía Ciudadana',
            icon: 'https://i.postimg.cc/8PDd950F/ALCALDIA.png',
            showInfo: false,
            command: async () => {
                this.router.navigate(['/maps']);
            },
        },
        {
            label: 'Otros Servicios',
            info: 'Descubre otros servicios disponibles para ti.',
            icon: 'https://i.postimg.cc/9Qj51gvd/SERVICIOS.png',
            showInfo: false,
            command: async () => {
                window.open('https://tramites.esmeraldas.gob.ec/', '_blank');
            },
        },
        /*
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
    imageselecte: any;
    load_image: boolean = false;
    showimage(img: any) {
        this.imageselecte = img;
        setTimeout(() => {
            this.load_image = true;
        }, 500);
    }

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
    visible_incidente_mirror: boolean = false;
    button_active: any = { cate: '', sub: '' };
    incidente(cate?, sub?) {
        if (cate) {
            this.button_active.cate = cate;
        } else {
            this.button_active.cate = undefined;
        }

        if (sub) {
            this.button_active.sub = sub;
        } else {
            this.button_active.sub = undefined;
        }

        if (!this.token) {
            throw this.router.navigate(['/auth/login']);
        } else {
            if (this.DashboardComponent) {
                this.visible_incidente_mirror = true;
            } else {
                this.visible_incidente = true;
            }
        }
    }

    visible_ficha: boolean = false;
    visible_ficha_mirror: boolean = false;
    ficha() {
        if (!this.token) {
            throw this.router.navigate(['/auth/login']);
        } else {
            if (this.DashboardComponent) {
                this.visible_ficha_mirror = true;
            } else {
                this.visible_ficha = true;
            }
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
