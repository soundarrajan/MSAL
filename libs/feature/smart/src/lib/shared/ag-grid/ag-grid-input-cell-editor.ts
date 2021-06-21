import {Component, ViewContainerRef, ViewChild, AfterViewInit,Input} from '@angular/core';
import {ICellEditorAngularComp} from '@ag-grid-community/angular';
import { Store } from '@ngxs/store';
import { UpdateBunkeringPlanAction } from '../../store/bunker-plan/bunkering-plan.action';
import { SaveBunkeringPlanState } from '../../store/bunker-plan/bunkering-plan.state';
import { WarningoperatorpopupComponent } from '../../shared/warningoperatorpopup/warningoperatorpopup.component';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';


const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;
const KEY_ENTER = 13;
const KEY_TAB = 9;
@Component({
    selector: 'aggrid-cell-data',
    template: ` <div *ngIf="params.type=='edit'">
    <div [matTooltip]="input.value"><input #input [ngClass]="params.cellClass" [(ngModel)]="value"
        (keydown)="triggerChangeEvent();onKeyDown($event)" ></div>
    <span *ngIf="showInfoIcon == true">
          <img class="infoIcon" src="./assets/customicons/info_amber.svg" alt="info">
    </span>
    </div>
  <div *ngIf="params.type=='edit-business-address'">
    <div [matTooltip]="input.value"><input #input [ngClass]="params.cellClass" [(ngModel)]="value"
        (keydown)="triggerChangeEvent();" ></div>
  </div>`
})
export class AgGridInputCellEditor implements ICellEditorAngularComp {
    public params: any;
    public value: number;
    public toolTip: string;
    public menuData;
    public isChecked;
    private cancelBeforeStart: boolean = false;
    public highlightAllOnFocus: boolean = true;
    public showInfoIcon : boolean = false;
    public dialogRef: MatDialogRef<WarningoperatorpopupComponent>;
    @Input('bplanType') 
    public set bplanType(v : any) {
      this.bplanType = v;
    };
    @Input('selectedUserRole') 
    public set selectedUserRole(v : any) {
      this.selectedUserRole = v;
    };

    @ViewChild('input', {read: ViewContainerRef}) public input: any;
    constructor(private store: Store, public dialog: MatDialog){

    }

    agInit(params: any): void {
        this.params = params;
        this.value = params.value
        this.menuData = params.value;
        this.isChecked = params.value;
        this.toolTip = params.value;
        this.setInitialState(this.params);
        

        // only start edit if key pressed is a number, not a letter
        this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
    }

    setInitialState(params: any) {
      let startValue;
      let highlightAllOnFocus = true;
  
      if (params.keyPress === KEY_BACKSPACE || params.keyPress === KEY_DELETE) {
        // if backspace or delete pressed, we clear the cell
        startValue = '';
      } else if (params.charPress) {
        // if a letter was pressed, we start with the letter
        startValue = params.charPress;
        highlightAllOnFocus = false;
      } else {
        // otherwise we start with the current value
        startValue = params.value;
        if (params.keyPress === KEY_F2) {
          highlightAllOnFocus = false;
        }
      }
  
      this.value = startValue;
      this.highlightAllOnFocus = highlightAllOnFocus;
    }
  
    getValue(): any {
      let isSafePortRestricted;
      
      if(this.params.colDef?.field == 'hsfo_safe_port'|| this.params.colDef?.field =='eca_safe_port' ||this.params.colDef?.field =='lsdis_safe_port'){
        isSafePortRestricted = this.checkSafePortRestriction(this.params?.colDef?.field, this.params?.data?.detail_no);
          if(isSafePortRestricted === 'Y'){
            this.value = 0;
            const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
              width: '350px',
              panelClass: 'confirmation-popup-operator',
              data : {message: 'You should enter only one safe port value for each product type'}
            });
          }
          
          if(this.value == 0)
          {
            this.store.dispatch(new UpdateBunkeringPlanAction(this.value, this.params.colDef?.field, this.params.data?.detail_no));
            return '';
          }
          
      }
      if(this.params.colDef?.field == 'lsdis_estimated_consumption' || this.params.colDef?.field == 'eca_estimated_consumption'){
        if(this.params.data){
          if(this.params.data.lsdis_as_eca > 0){
            this.showInfoIcon = true;
          }
          else
            this.showInfoIcon = false;
        }

      }
        this.store.dispatch(new UpdateBunkeringPlanAction(this.value, this.params.colDef?.field, this.params.data?.detail_no));
        return this.value;
    }
    
    checkSafePortRestriction(field,detail_no){
      let dataFromStore = this.store.selectSnapshot(SaveBunkeringPlanState.getSaveBunkeringPlanData);
      let isSafePortValueExists = dataFromStore.findIndex(data=> data[field] != 0 && data.detail_no != detail_no) === -1?'N':'Y';
      return isSafePortValueExists;
    }
    isCancelBeforeStart(): boolean {
      return this.cancelBeforeStart;
    }
  
    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
      return this.value > 1000000;
    }
  
    onKeyDown(event: any): void {
      if (this.isLeftOrRight(event) || this.deleteOrBackspace(event)) {
        event.stopPropagation();
        return;
      }
  
      if (
        !this.finishedEditingPressed(event) &&
        !this.isKeyPressedNumeric(event)
      ) {
        if (event.preventDefault) event.preventDefault();
      }
    }
    
     // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
      window.setTimeout(() => {
        this.input.element.nativeElement.focus();
        if (this.highlightAllOnFocus) {
          this.input.element.nativeElement.select();
  
          this.highlightAllOnFocus = false;
        } else {
          // when we started editing, we want the carot at the end, not the start.
          // this comes into play in two scenarios: a) when user hits F2 and b)
          // when user hits a printable character, then on IE (and only IE) the carot
          // was placed after the first character, thus 'apply' would end up as 'pplea'
          const length = this.input.element.nativeElement.value
            ? this.input.element.nativeElement.value.length
            : 0;
          if (length > 0) {
            this.input.element.nativeElement.setSelectionRange(length, length);
          }
        }
  
        this.input.element.nativeElement.focus();
      });
    }
  
    private getCharCodeFromEvent(event: any): any {
      event = event || window.event;
      return typeof event.which == 'undefined' ? event.keyCode : event.which;
    }
  
    private isCharNumeric(charStr: string): boolean {
      return !!/\d/.test(charStr);
    }
  
    private isKeyPressedNumeric(event: any): boolean {
      const charCode = this.getCharCodeFromEvent(event);
      const charStr = event.key ? event.key : String.fromCharCode(charCode);
      return this.isCharNumeric(charStr);
    }
  
    private deleteOrBackspace(event: any) {
      return (
        [KEY_DELETE, KEY_BACKSPACE].indexOf(this.getCharCodeFromEvent(event)) > -1
      );
    }
  
    private isLeftOrRight(event: any) {
      return [37, 39].indexOf(this.getCharCodeFromEvent(event)) > -1;
    }
  
    private finishedEditingPressed(event: any) {
      const charCode = this.getCharCodeFromEvent(event);
      return charCode === KEY_ENTER || charCode === KEY_TAB;
    }
    triggerChangeEvent() {
      this.params.context.componentParent.triggerChangeEvent();
    }  

    
}