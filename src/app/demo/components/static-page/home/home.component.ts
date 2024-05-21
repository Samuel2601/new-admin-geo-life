import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
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
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    responsiveOptions: any[] = [];
    producto: any[] = [];
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
        this.producto.push({
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
        },{
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
        },{
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
        });
    }
    buttons = [
        {
            label: 'Incidentes',
            info: 'Puedes reportar los incidentes y denuncias que se presenten en la ciudad.',
            icon: 'assets/menu/seguimiento.png',
            showInfo: false,
        },
        {
            label: 'Fichas Sectoriales',
            info: 'Accede a información detallada sobre eventos y actividades en tu sector.',
            icon: 'assets/menu/negocio.png',
            showInfo: false,
        },
        {
            label: 'Alcaldía Informa',
            info: 'Mantente informado sobre comunicados de la alcaldía.',
            icon: 'assets/menu/publicacion.png',
            showInfo: false,
        },
        {
            label: 'Otros Servicios',
            info: 'Descubre otros servicios disponibles para ti.',
            icon: 'assets/menu/servicios.png',
            showInfo: false,
        },
    ];

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
}
