import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './app.routing';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/menu/navbar/navbar.component';
import { FooterComponent } from './components/menu/footer/footer.component';
import { SidebarComponent } from './components/menu/sidebar/sidebar.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { ResetpwComponent } from './components/user/resetpw/resetpw.component';
import { UpdatepwComponent } from './components/user/updatepw/updatepw.component';

import { CreateCategoriaComponent } from './components/categoria/create-categoria/create-categoria.component';
import { IndexCategoriaComponent } from './components/categoria/index-categoria/index-categoria.component';
import { EditCategoriaComponent } from './components/categoria/edit-categoria/edit-categoria.component';
import { CreateSubcategoriaComponent } from './components/categoria/sub/create-subcategoria/create-subcategoria.component';
import { IndexSubcategoriaComponent } from './components/categoria/sub/index-subcategoria/index-subcategoria.component';
import { EditSubcategoriaComponent } from './components/categoria/sub/edit-subcategoria/edit-subcategoria.component';
import { ErrorComponent } from './components/user/error/error.component';

import { IndexUsuarioComponent } from './components/admin/usuario/index-usuario/index-usuario.component';
import { EditUsuarioComponent } from './components/admin/usuario/edit-usuario/edit-usuario.component';
import { CreateUsuarioComponent } from './components/admin/usuario/create-usuario/create-usuario.component';
import { CreateFichaSectorialComponent } from './components/ficha-sectorial/create-ficha-sectorial/create-ficha-sectorial.component';
import { IndexFichaSectorialComponent } from './components/ficha-sectorial/index-ficha-sectorial/index-ficha-sectorial.component';
import { EditFichaSectorialComponent } from './components/ficha-sectorial/edit-ficha-sectorial/edit-ficha-sectorial.component';
import { IndexIncidentesDenunciaComponent } from './components/incidentes-denuncia/index-incidentes-denuncia/index-incidentes-denuncia.component';
import { CreateIncidentesDenunciaComponent } from './components/incidentes-denuncia/create-incidentes-denuncia/create-incidentes-denuncia.component';
import { EditIncidentesDenunciaComponent } from './components/incidentes-denuncia/edit-incidentes-denuncia/edit-incidentes-denuncia.component';
import { IndexEncargadoCategoriaComponent } from './components/admin/encargado-categoria/index-encargado-categoria/index-encargado-categoria.component';
import { CreateEncargadoCategoriaComponent } from './components/admin/encargado-categoria/create-encargado-categoria/create-encargado-categoria.component';
import { EditEncargadoCategoriaComponent } from './components/admin/encargado-categoria/edit-encargado-categoria/edit-encargado-categoria.component';
import { IndexRolUserComponent } from './components/admin/rol-user/index-rol-user/index-rol-user.component';
import { EditRolUserComponent } from './components/admin/rol-user/edit-rol-user/edit-rol-user.component';
import { CreateRolUserComponent } from './components/admin/rol-user/create-rol-user/create-rol-user.component';
import { IndexEstadoIncidenteComponent } from './components/incidentes-denuncia/estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { EditEstadoIncidenteComponent } from './components/incidentes-denuncia/estado-incidente/edit-estado-incidente/edit-estado-incidente.component';
import { CreateEstadoIncidenteComponent } from './components/incidentes-denuncia/estado-incidente/create-estado-incidente/create-estado-incidente.component';
import { IndexEstadoActividadProyectoComponent } from './components/ficha-sectorial/estado-actividad-proyecto/index-estado-actividad-proyecto/index-estado-actividad-proyecto.component';
import { EditEstadoActividadProyectoComponent } from './components/ficha-sectorial/estado-actividad-proyecto/edit-estado-actividad-proyecto/edit-estado-actividad-proyecto.component';
import { CreateEstadoActividadProyectoComponent } from './components/ficha-sectorial/estado-actividad-proyecto/create-estado-actividad-proyecto/create-estado-actividad-proyecto.component';
import { IndexActividadProyectoComponent } from './components/ficha-sectorial/actividad-proyecto/index-actividad-proyecto/index-actividad-proyecto.component';
import { EditActividadProyectoComponent } from './components/ficha-sectorial/actividad-proyecto/edit-actividad-proyecto/edit-actividad-proyecto.component';
import { CreateActividadProyectoComponent } from './components/ficha-sectorial/actividad-proyecto/create-actividad-proyecto/create-actividad-proyecto.component';
import { IndexDireccionGeoComponent } from './components/direccion-geo/index-direccion-geo/index-direccion-geo.component';
import { EditDireccionGeoComponent } from './components/direccion-geo/edit-direccion-geo/edit-direccion-geo.component';
import { CreateDireccionGeoComponent } from './components/direccion-geo/create-direccion-geo/create-direccion-geo.component';
import { IndexPermisosComponent } from './components/admin/permisos/index-permisos/index-permisos.component';
import { EditPermisosComponent } from './components/admin/permisos/edit-permisos/edit-permisos.component';
import { CreatePermisosComponent } from './components/admin/permisos/create-permisos/create-permisos.component';

import { AdminComponent } from './components/admin/admin.component';
import { SpinnerComponent } from './spinner/spinner.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';


import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StackBarriosComponent } from './components/dashboard/stack-barrios/stack-barrios.component';
import { StackFichasComponent } from './components/dashboard/stack-fichas/stack-fichas.component';
import { StackIncidentesComponent } from './components/dashboard/stack-incidentes/stack-incidentes.component';
import { StackWIFIComponent } from './components/dashboard/stack-wifi/stack-wifi.component';
import { StackbarriofichaComponent } from './components/dashboard/stackbarrioficha/stackbarrioficha.component';


// Import PrimeNG modules
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup'
import { ImageModule } from 'primeng/image';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { AnimateModule } from 'primeng/animate';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { StepperModule } from 'primeng/stepper';
import { FloatLabelModule } from 'primeng/floatlabel';
@NgModule({
  declarations: [
    ErrorComponent,
    CreateCategoriaComponent,
    IndexCategoriaComponent,
    EditCategoriaComponent,
    CreateSubcategoriaComponent,
    IndexSubcategoriaComponent,
    EditSubcategoriaComponent,
    AppComponent,
    HomeComponent,
    MapComponent,
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    ResetpwComponent,
    UpdatepwComponent,
    IndexUsuarioComponent,
    EditUsuarioComponent,
    CreateUsuarioComponent,
    IndexFichaSectorialComponent,
    EditFichaSectorialComponent,
    CreateFichaSectorialComponent,
    IndexIncidentesDenunciaComponent,
    EditIncidentesDenunciaComponent,
    CreateIncidentesDenunciaComponent,
    IndexEncargadoCategoriaComponent,
    EditEncargadoCategoriaComponent,
    CreateEncargadoCategoriaComponent,
    IndexRolUserComponent,
    CreateRolUserComponent,
    EditRolUserComponent,
    IndexEstadoIncidenteComponent,
    EditEstadoIncidenteComponent,
    CreateEstadoIncidenteComponent,
    EditEstadoActividadProyectoComponent,
    IndexEstadoActividadProyectoComponent,
    CreateEstadoActividadProyectoComponent,
    EditActividadProyectoComponent,
    IndexActividadProyectoComponent,
    CreateActividadProyectoComponent,
    EditDireccionGeoComponent,
    IndexDireccionGeoComponent,
    CreateDireccionGeoComponent,
    EditPermisosComponent,
    IndexPermisosComponent,
    CreatePermisosComponent,
    AdminComponent,
    DashboardComponent,
    SpinnerComponent,
    StackBarriosComponent,
    StackFichasComponent,
    StackIncidentesComponent,
    StackWIFIComponent,
    StackbarriofichaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,    
    MatIconModule,
    AccordionModule,
    AutoCompleteModule,
    BadgeModule,
    BreadcrumbModule,
    BlockUIModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    CascadeSelectModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    ChipModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ContextMenuModule,
    VirtualScrollerModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DockModule,
    DragDropModule,
    DropdownModule,
    DynamicDialogModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule,
    ImageModule,
    KnobModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrganizationChartModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    SelectButtonModule,
    SidebarModule,
    ScrollerModule,
    ScrollPanelModule,
    ScrollTopModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SpeedDialModule,
    SpinnerModule,
    SplitterModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TagModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TriStateCheckboxModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
    AnimateModule,
    CardModule,
    RippleModule,
    StyleClassModule,
    NgbModule,
    AvatarModule,
    AvatarGroupModule,
    BrowserAnimationsModule,
    IconFieldModule,
    InputIconModule,
    StepperModule,
    FloatLabelModule
  ],
  providers: [ MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
