import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { HelperService } from 'src/app/services/helper.service';
import { Capacitor } from '@capacitor/core';
import { Sidebar } from 'primeng/sidebar';
import { state } from '@angular/animations';
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    component?:string;
    status?:boolean;
    mobil:boolean;
}
export let ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', component: 'DashboardComponent',status:false ,mobil:false},
  { path: '/user-profile', title: 'Perfil',  icon:'person', class: '', component: 'EditUsuarioComponent',status:false,mobil:true },
  { path: '/categorias', title: 'Categorias',  icon:'content_paste', class: '', component: 'IndexCategoriaComponent',status:false,mobil:true },
  { path: '/incidentes-denuncia', title: 'Incidentes/Decuncias',  icon:'library_books', class: '', component: 'IndexIncidentesDenunciaComponent',status:false,mobil:true },
  { path: '/fichas-sectoriales', title: 'Fichas Sectoriales',  icon:'bubble_chart', class: '', component: 'IndexFichaSectorialComponent',status:false,mobil:true },
  { path: '/home', title: 'Maps',  icon:'location_on', class: '',mobil:true},
  { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '', component: 'HomeComponent' ,status:false,mobil:true},
  { path: '/administracion', title: 'Administración',  icon:'unarchive', class: 'active-pro', component: 'AdminComponent',status:false ,mobil:true},
  { path: '/inicio', title: 'Inicio', component: 'Inicio', icon:'person', class: '',status:false,mobil:true },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e:any): void {
        this.sidebarRef.close(e);
    }

    sidebarVisible: boolean = false;

  menuItems: any[]=[];
  token=this.helperservice.token();
  private dropdownButton: HTMLElement | null = null;
  dropdownVisible: boolean=false;
  constructor(private platform: Platform,private element: ElementRef,private helperservice:HelperService) { }

  ngOnInit() {
    this.helperservice.llamarspinner();
    ROUTES.forEach(async (element:any,index:any) => {
      if(element.component){
        element.status=this.helperservice.decryptData(element.component)  || false;
      }
      if(element.path=='/inicio'&&!this.token){
        element.status=true;
      }
      /*if(ROUTES.length-1==index){
        this.helperservice.cerrarspinner();
      }*/
    });
    console.log(ROUTES);
    this.helperservice.cerrarspinner();
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.dropdownButton = this.element.nativeElement.querySelector('.dropdown-toggle');
    
  }
  
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }
  isMobil() {
    return this.helperservice.isMobil();
  }
  logout():void{
    sessionStorage.clear();
    location.reload();
  }
  dropdownToggle(): void {
      if (this.dropdownVisible === false) {
          this.dropdownOpen();
      } else {
          this.dropdownClose();
      }
  }

  dropdownOpen(): void {
      if (this.dropdownButton) {
          this.dropdownButton.classList.add('toggled');
      }
      this.dropdownVisible = true;
  }

  dropdownClose(): void {
      if (this.dropdownButton) {
          this.dropdownButton.classList.remove('toggled');
      }
      this.dropdownVisible = false;
  }
}
