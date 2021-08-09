import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div class="aggrid-group-headercontenet">
      <div class="text-left amber" style="position: fixed">
        <!-- <app-badge
          *ngIf="this.params?.badge"
          [badgeColor]="this.params?.badge?.color"
          [value]="this.params?.badge?.value"
          [unit]="this.params?.badge?.unit"
        ></app-badge> -->
      </div>
      <div class="title">
        <div style="font-size: 28px">{{ this.params.displayName }}</div>
        <div class="subtitle">{{ this.params.subtitles }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .customHeaderLabel {
        position: fixed;
        width: 100%;
      }
    `
  ]
})
export class CustomHeaderGroup {
  public params: any;

  agInit(params): void {
    this.params = params;
  }
}
