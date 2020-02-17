import { Injectable, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { DefaultDialogComponent } from './dialog/default-pop-up/default-dialog.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-pop-up/confirmation-dialog.component';
import { AlertDialogComponent } from './dialog/alert-pop-up/alert-dialog.component';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

const defaultDialogConfig = {
  maxHeight: '400px',
  height: '190px',
  width: '360px'
};

@Injectable()
export class MessageBoxService {
  constructor(public matDialog: MatDialog) {}

  public displayDialog<D = any, R = any>(config: MatDialogConfig<D> = {}, componentOrTemplateRef: ComponentType<any> | TemplateRef<any> = DefaultDialogComponent): MatDialogRef<any> {
    return this.openDialog(componentOrTemplateRef, { ...defaultDialogConfig, ...config });
  }

  public displayConfirmDialog<D = any>(config: MatDialogConfig<D> = {}, componentOrTemplateRef: ComponentType<any> | TemplateRef<any> = ConfirmationDialogComponent): MatDialogRef<any> {
    return this.openDialog(componentOrTemplateRef, { ...defaultDialogConfig, ...config });
  }

  public displayAlertDialog<D = any>(config: MatDialogConfig<D> = {}, componentOrTemplateRef: ComponentType<any> | TemplateRef<any> = AlertDialogComponent): MatDialogRef<any> {
    return this.openDialog(componentOrTemplateRef, { ...defaultDialogConfig, ...config });
  }

  private openDialog<T, D = any, R = any>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R> {
    return this.matDialog.open(componentOrTemplateRef, config);
  }
}
