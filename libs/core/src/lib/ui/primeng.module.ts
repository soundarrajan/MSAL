import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//TODO: Remove unused module
import {
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
  ColorPickerModule,
  ConfirmationService,
  ConfirmDialogModule,
  ContextMenuModule,
  DialogService,
  DropdownModule,
  EditorModule,
  FieldsetModule,
  FileUploadModule,
  GalleriaModule,
  InplaceModule,
  InputMaskModule,
  InputSwitchModule,
  InputTextareaModule,
  InputTextModule,
  KeyFilterModule,
  LightboxModule,
  ListboxModule,
  MegaMenuModule,
  MenubarModule,
  MenuModule,
  MessageModule,
  MessageService,
  MessagesModule,
  MultiSelectModule,
  OrderListModule,
  OrganizationChartModule,
  OverlayPanelModule,
  PaginatorModule,
  PanelMenuModule,
  PanelModule,
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
  TabMenuModule,
  TabViewModule,
  TerminalModule,
  TieredMenuModule,
  ToggleButtonModule,
  ToolbarModule,
  TooltipModule,
  TreeModule,
  TreeTableModule
} from 'primeng/primeng';
import { PortalModule } from '@angular/cdk/portal';
import { TableModule } from 'primeng/table';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { DynamicDialogModule } from 'primeng/dynamicdialog';


const MODULES = [
  CommonModule,
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
  DynamicDialogModule,
  DropdownModule,
  EditorModule,
  FieldsetModule,
  FileUploadModule,
  GalleriaModule,
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
  VirtualScrollerModule,
  KeyFilterModule,
  PortalModule
];

@NgModule({
  imports: [
    ...MODULES
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  exports: [
    ...MODULES
  ]
})
export class PrimeNGModule {
}
