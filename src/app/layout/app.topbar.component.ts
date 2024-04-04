import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { GLOBAL } from '../demo/services/GLOBAL';
import { HelperService } from '../demo/services/helper.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
    url = GLOBAL.url;
    foto=sessionStorage.getItem('foto')?sessionStorage.getItem('foto'):localStorage.getItem('foto');
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    
    constructor(public layoutService: LayoutService, private helper: HelperService,private router: Router,) { }
    ngOnInit(): void {
        console.log(this.foto);
    }
    token = this.helper.token()||undefined;
    logout(): void {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(["/maps"]).then(() => {
            window.location.reload();
        });
    }

}
