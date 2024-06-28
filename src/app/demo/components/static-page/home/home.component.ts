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
    DashboardComponent: boolean = false;
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
        } catch (error) {}
        this.filterProductos();
    }
    setbuttons = [
        {
            label: 'Más Usados',
            items: [
                {
                    label: 'ESVIAL',
                    info: 'Puedes reportar Incidentes o mirar las Infracciones de tránsito',
                    icon: 'https://i.postimg.cc/bYKqrncJ/Iconos-disen-o-09.png',
                    showInfo: false,
                    items: [
                        {
                            label: 'Incidentes ESVIAL',
                            info: 'Puedes reportar los incidentes y denuncias con respecto a ESVIAL.',
                            icon: 'https://i.postimg.cc/C51r9XxQ/Imagen-de-Whats-App-2024-06-26-a-las-12-09-30-1cfaf812-fotor-bg-remover-20240626121913.png',
                            showInfo: false,
                            command: async () => {
                                this.incidente(
                                    'ESVIAL',
                                    'Transporte terrestre y seguridad vial'
                                );
                            },
                        },
                        {
                            label: 'Infracciones de Tránsito',
                            info: 'Servicio en línea para la consulta de citaciones.',
                            icon: 'https://i.postimg.cc/FsCZ1JkL/Imagen-de-Whats-App-2024-06-26-a-las-12-07-32-5233ccb0-fotor-bg-remover-20240626121152.png',
                            showInfo: false,
                            command: async () => {
                                window.open(
                                    'https://servicios.axiscloud.ec/AutoServicio/inicio.jsp?ps_empresa=10&ps_accion=P55',
                                    '_blank'
                                );
                            },
                        },
                    ],
                },
                {
                    label: 'EPMAPSE',
                    info: 'Puedes reportar los incidentes y denuncias con respecto a EPMAPSE.',
                    icon: 'https://i.postimg.cc/LX5rhc1p/AGUA-1.png',
                    showInfo: false,
                    command: async () => {
                        this.incidente('Agua Potable y Alcantarillado');
                    },
                },
                {
                    label: 'BOMBEROS',
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
                    label: 'RECOLECTORES',
                    info: 'Puedes reportar los incidentes y denuncias con respecto a RECOLECTORES.',
                    icon: 'https://i.postimg.cc/KvSyxyB3/Iconos-disen-o-01.png',
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
                    icon: 'https://i.postimg.cc/fW3wMKPp/Iconos-disen-o-07.png',
                    showInfo: false,
                    command: async () => {
                        this.incidente();
                    },
                },
                {
                    label: 'Fichas Sectoriales',
                    info: 'Accede a información detallada sobre eventos y actividades en tu sector.',
                    icon: 'https://i.postimg.cc/zfpQgsy7/Iconos-disen-o-05.png',
                    showInfo: false,
                    command: async () => {
                        this.ficha();
                    },
                },
            ],
        },
        {
            label: 'Otros Servicios',
            items: [
                {
                    label: 'Registro de la Propiedad',
                    info: 'Realiza tus trámites en Registro de la Propiedad, certificación e inscripción.',
                    icon: 'https://i.postimg.cc/pXfMd1JG/Iconos-disen-o-14.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://tramites.esmeraldas.gob.ec/login.jsp?id_servicio=15',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Noticias',
                    info: 'Mantente informado sobre comunicados de la alcaldía.',
                    icon: 'https://i.postimg.cc/cLcWF5Kg/Iconos-disen-o-11.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://esmeraldas.gob.ec/noticias.html',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Ciudad Global',
                    info: 'Interactúa con las diferentes unidades de la Alcaldía Ciudadana.',
                    icon: 'https://i.postimg.cc/4NVs93s1/Iconos-disen-o-08.png',
                    showInfo: false,
                    items: [
                        {
                            label: 'Mapa de la Ciudad',
                            info: 'Interactúa con las diferentes unidades de la Alcaldía Ciudadana.',
                            icon: 'https://i.postimg.cc/qMNZLPYt/Imagen-de-Whats-App-2024-06-26-a-las-12-09-30-27b5bceb-removebg-preview.png',
                            showInfo: false,
                            command: async () => {
                                this.router.navigate(['/maps']);
                            },
                        },
                        {
                            label: "TIC's",
                            info: 'Conócenos',
                            icon: 'https://i.postimg.cc/NG4bqngb/Imagen-de-Whats-App-2024-06-26-a-las-12-07-36-c26979b6-fotor-bg-remover-20240626121035.png',
                            showInfo: false,
                            command: async () => {
                                window.open(
                                    'https://esmeraldas.gob.ec/direcciones/ti/info_tics.html',
                                    '_blank'
                                );
                            },
                        },
                        {
                            label: 'Servicios',
                            info: 'Descubre otros servicios que ofrecemos.',
                            icon: 'https://i.postimg.cc/XJnzkpS3/Imagen-de-Whats-App-2024-06-26-a-las-12-09-35-803347bd-removebg-preview.png',
                            showInfo: false,
                            command: async () => {
                                window.open(
                                    'https://esmeraldas.gob.ec/direcciones/ti/servicios-ti.html',
                                    '_blank'
                                );
                            },
                        },
                    ],
                },
                {
                    label: 'Otros Servicios',
                    info: 'Descubre otros servicios disponibles para ti.',
                    icon: 'https://i.postimg.cc/hGPB6bxC/Iconos-disen-o-12.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://tramites.esmeraldas.gob.ec/',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Gestión de Riesgos',
                    info: 'Información general sobre gestión de riesgos.',
                    icon: 'https://i.postimg.cc/CMfV3KBV/Iconos-disen-o-15.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://esmeraldas.gob.ec/direcciones/gestion-de-riesgos/informaci%C3%B3n-general.html',
                            '_blank'
                        );
                    },
                },
            ],
        },
        {
            label: 'Concejales',
            items: [
                {
                    label: 'Lilian Orejuela',
                    info: 'Rendición de cuentas de Lilian Orejuela.',
                    icon: 'https://i.postimg.cc/N0QCLk71/Iconos-funcionarios-01.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/consejal-lilian.html',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Jorge Perea',
                    info: 'Rendición de cuentas de Jorge Perea.',
                    icon: 'https://i.postimg.cc/HL3ZM8BF/Iconos-funcionarios-02.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/concejal-jorge-perea.html',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Ramón Echeverría',
                    info: 'Rendición de cuentas de Ramón Echeverría.',
                    icon: 'https://i.postimg.cc/gjxTmcyQ/Iconos-funcionarios-09.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/concejal-ram%C3%B3n-echeverria.html',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Yoli Márquez Cetre',
                    info: 'Rendición de cuentas de Yoli Márquez Cetre.',
                    icon: 'https://i.postimg.cc/4x6FJStf/Iconos-funcionarios-03.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/concejala-yoli-m.html',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Galo Cabezas Cañolas',
                    info: 'Rendición de Cuentas Galo Cabezas Cañolas.',
                    icon: 'https://i.postimg.cc/MGY4YFKP/Iconos-funcionarios-07.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/rendici%C3%B3n-de-cuenta-abg-galo-cabezas.html',
                            '_blank'
                        );
                    },
                }, 
                {
                    label: 'José Maffares Guagua',
                    info: 'Rendición de Cuentas José Maffares Guagua.',
                    icon: 'https://i.postimg.cc/DybMNZwb/Iconos-funcionarios-06.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/concejal-jos%C3%A9-maffares-guagua.html',
                            '_blank'
                        );
                    },
                },  
                {
                    label: 'Luisa Cuero',
                    info: 'Rendición de Cuentas Luisa Cuero.',
                    icon: 'https://i.postimg.cc/3RScs0G2/Iconos-funcionarios-10.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/rendici%C3%B3n-de-cuenta-luisa-cuero.html',
                            '_blank'
                        );
                    },
                },
                {
                    label: 'Laura Yagual',
                    info: 'Rendición de Cuentas Laura Yagual.',
                    icon: 'https://i.postimg.cc/8zQ0gS7X/Iconos-funcionarios-04.png',
                    showInfo: false,
                    command: async () => {
                        window.open(
                            'https://www.esmeraldas.gob.ec/alcaldia/concejales-canton-esmeraldas/concejal-laura-yagual.html',
                            '_blank'
                        );
                    },
                }
            ],
        },
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
