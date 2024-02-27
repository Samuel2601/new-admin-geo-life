import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private listTitles: any[] = [];
  public mobile_menu_visible = false;
  private toggleButton: HTMLElement | null = null;
  private sidebarVisible = false;
  public token = sessionStorage.getItem('token')||null;


  constructor(private element: ElementRef,private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setTitle();
    });
  }
  title: string='';
  titleMap: { [key: string]: string } = {
    '/home': 'Inicio',
    '/categorias': 'Categorías',
    '/subcategorias': 'Subcategorías',
    // Agrega más rutas y títulos según sea necesario
  };
  setTitle() {
    const currentUrl = this.router.url;
    this.title = this.titleMap[currentUrl] || 'Título predeterminado';
  }
  
  ngOnInit(): void {    
    this.listTitles = ROUTES.filter((listTitle: any) => listTitle);
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
  asignarToken(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.token = token;
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