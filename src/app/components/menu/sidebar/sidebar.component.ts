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
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
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
