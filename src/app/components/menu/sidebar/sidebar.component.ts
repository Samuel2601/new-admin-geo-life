import { Component, ElementRef, OnInit} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'Perfil',  icon:'person', class: '' },
    { path: '/categorias', title: 'Categorias',  icon:'content_paste', class: '' },
    { path: '/incidentes-denuncia', title: 'Incidentes/Decuncias',  icon:'library_books', class: '' },
    { path: '/fichas-sectoriales', title: 'Ficha Sectorial',  icon:'bubble_chart', class: '' },
    { path: '/home', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Admin',  icon:'unarchive', class: 'active-pro' },
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
  constructor(private platform: Platform,private element: ElementRef) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.dropdownButton = this.element.nativeElement.querySelector('.dropdown-toggle');
  }
  
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }
  isMobileMenu():boolean{
    if (!this.platform.isBrowser) {
      return true;
    } else {
      return false;
    }
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
