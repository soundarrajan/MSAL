import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import { TopbarComponent } from './components/navigation/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AccordionModule, AutoCompleteModule,
  BreadcrumbModule,
  ButtonModule, CalendarModule,
  CardModule, CarouselModule,
  ChartModule, CheckboxModule,
  ChipsModule, CodeHighlighterModule, ColorPickerModule,
  ConfirmDialogModule, ContextMenuModule, DialogModule,
  DropdownModule, EditorModule, FieldsetModule, FileUploadModule,
  GalleriaModule,
  GrowlModule,
  InplaceModule, InputMaskModule,
  InputSwitchModule,
  InputTextareaModule, InputTextModule, LightboxModule,
  ListboxModule,
  MegaMenuModule, MenubarModule,
  MenuModule, MessageModule,
  MessagesModule,
  MultiSelectModule, OrderListModule, OrganizationChartModule, OverlayPanelModule,
  PaginatorModule,
  PanelMenuModule,
  PanelModule,
  PasswordModule,
  PickListModule, ProgressBarModule, RadioButtonModule, RatingModule, ScrollPanelModule,
  SelectButtonModule, SlideMenuModule,
  SliderModule, SpinnerModule, SplitButtonModule, StepsModule,
  TabMenuModule, TabViewModule,
  TerminalModule, TieredMenuModule, ToggleButtonModule, ToolbarModule, TooltipModule,
  TreeModule,
  TreeTableModule
} from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppSubMenuComponent } from './components/navigation/sidebar/menu-items/menu-items.component';
import { FlexLayoutModule } from '@angular/flex-layout';

export const PRIME_IMPORTS = [
  AccordionModule,
  AutoCompleteModule,
  BreadcrumbModule,
  ButtonModule,
  CalendarModule,
  CardModule,
  CarouselModule,
  ChartModule,
  CheckboxModule,
  ChipsModule,
  CodeHighlighterModule,
  ConfirmDialogModule,
  ColorPickerModule,
  ContextMenuModule,
  DataViewModule,
  DialogModule,
  DropdownModule,
  EditorModule,
  FieldsetModule,
  FileUploadModule,
  GalleriaModule,
  GrowlModule,
  InplaceModule,
  InputMaskModule,
  InputSwitchModule,
  InputTextModule,
  InputTextareaModule,
  LightboxModule,
  ListboxModule,
  MegaMenuModule,
  MenuModule,
  MenubarModule,
  MessageModule,
  MessagesModule,
  MultiSelectModule,
  OrderListModule,
  OrganizationChartModule,
  OverlayPanelModule,
  PaginatorModule,
  PanelModule,
  PanelMenuModule,
  PasswordModule,
  PickListModule,
  ProgressBarModule,
  RadioButtonModule,
  RatingModule,
  ScrollPanelModule,
  SelectButtonModule,
  SlideMenuModule,
  SliderModule,
  SpinnerModule,
  SplitButtonModule,
  StepsModule,
  TableModule,
  TabMenuModule,
  TabViewModule,
  TerminalModule,
  TieredMenuModule,
  ToastModule,
  ToggleButtonModule,
  ToolbarModule,
  TooltipModule,
  TreeModule,
  TreeTableModule,
  VirtualScrollerModule
]


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SidebarComponent,
    AppSubMenuComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'quality-control',
        loadChildren: () => import('../../../../libs/feature/quality-control/src/lib/quality-control.module').then(m => m.QualityControlModule)}
    ]),
    FormsModule,
    ScrollingModule,
    // FlexLayoutModule,
    ...PRIME_IMPORTS
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
