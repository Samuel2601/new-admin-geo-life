import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgbModule, CommonModule, CardModule, ButtonModule, TooltipModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
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
}
