import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { Capacitor } from '@capacitor/core';

declare var $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  component?:string;
  status?:boolean;
}
export const ROUTES2: RouteInfo[] = [
  { path: '/categorias', title: 'Categorias',  icon:'content_paste', class: '', component: 'IndexCategoriaComponent',status:false },
  { path: '/incidentes-denuncia', title: 'Incidentes/Decuncias',  icon:'library_books', class: '', component: 'IndexIncidentesDenunciaComponent',status:false },
  { path: '/home', title: 'Maps',  icon:'location_on', class: '' },
  { path: '/fichas-sectoriales', title: 'Fichas Sectoriales',  icon:'bubble_chart', class: '', component: 'IndexFichaSectorialComponent',status:false },
  { path: '/user-profile', title: 'Perfil',  icon:'person', class: '', component: 'EditUsuarioComponent',status:false },
  { path: '/administracion', title: 'Administración',  icon:'unarchive', class: 'active-pro', component: 'AdminComponent',status:false },
];
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  listTitles: any[] = [];
  url=GLOBAL.url;
  foto=sessionStorage.getItem('foto');
  public mobile_menu_visible = false;
  private toggleButton: HTMLElement | null = null;
  private sidebarVisible = false;
  public token = this.helper.token();
  public dashboard:boolean=true;

  constructor(private element: ElementRef,private router: Router, private route: ActivatedRoute, private helper:HelperService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      
    });
  }
  title: string='';

  setTitle() {
    const currentUrl = this.router.url;
     // Obtener el elemento de la ruta que coincide con la URL actual
    const route = ROUTES.find((element) => element.path === currentUrl);

    // Devolver el título de la ruta si se encuentra, de lo contrario devolver un título predeterminado
    return route ? route.title : 'Título predeterminado';
  }
  isActive(menuItem: any): boolean {
    return this.router.url === menuItem.path;
  }
  isMobil() {
    return Capacitor.isNativePlatform();
  }
  async ngOnInit(): Promise<void> {
    if(this.isMobil()){
      this.helper.llamarspinner();
      ROUTES2.forEach(async (element:any,index:any) => {
        if(element.component){
          element.status=await this.helper.checkPermiso(element.component) || false;
        }
        if(ROUTES.length-1==index){
          this.helper.cerrarspinner();
        }
      });
    }    
    this.dashboard=await this.helper.checkPermiso('DashboardComponent')||false;
    this.title=this.setTitle();
    this.listTitles = ROUTES2.filter((listTitle: any) => listTitle);
    this.toggleButton = this.element.nativeElement.querySelector('.navbar-toggler');
    this.router.events.subscribe(() => {
      this.sidebarClose();
      const layer = document.querySelector('.close-layer');
      if (layer) {
        layer.remove();
        this.mobile_menu_visible = false;
      }
    });
  }
  cerrarmodal(): void {
    const modal = document.getElementById('staticBackdrop');
    if (modal) {
      $(modal).modal('hide');
    }
  }
  abrirModal(): void {
  }
  
  logout():void{
    sessionStorage.clear();
    location.reload();
  }

  sidebarToggle(): void {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  sidebarOpen(): void {
    if (this.toggleButton) {
      this.toggleButton.classList.add('toggled');
    }
    document.body.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose(): void {
    if (this.toggleButton) {
      this.toggleButton.classList.remove('toggled');
    }
    document.body.classList.remove('nav-open');
    this.sidebarVisible = false;
  }


}
