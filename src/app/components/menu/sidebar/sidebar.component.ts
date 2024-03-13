import { Component, ElementRef, OnInit} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { HelperService } from 'src/app/services/helper.service';
import { Capacitor } from '@capacitor/core';
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
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[]=[];
  token=sessionStorage.getItem('token');
  private dropdownButton: HTMLElement | null = null;
  dropdownVisible: boolean=false;
  constructor(private platform: Platform,private element: ElementRef,private heleperservice:HelperService) { }

  ngOnInit() {
    this.heleperservice.llamarspinner();
    ROUTES.forEach(async (element:any,index:any) => {
      if(element.component){
        element.status=sessionStorage.getItem(element.component) || false;
      }
      /*if(ROUTES.length-1==index){
        this.heleperservice.cerrarspinner();
      }*/
    });
    this.heleperservice.cerrarspinner();
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.dropdownButton = this.element.nativeElement.querySelector('.dropdown-toggle');
    
  }
  
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }
  isMobil() {
    return Capacitor.isNativePlatform();
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
