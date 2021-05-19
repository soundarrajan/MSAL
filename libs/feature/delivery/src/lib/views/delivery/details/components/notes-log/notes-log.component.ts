import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  SimpleChanges,
  HostListener,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { QcReportService } from '../../../../../services/qc-report.service';
import { IDeliveryNotesDetailsResponse } from '../../../../../services/api/request-response/delivery-by-id.request-response';
  //  .././../../../../request-response/delivery-by-id.request-response
// import { NotesLogGridViewModel } from './view-model/notes-log-grid.view-model';
// import { IQcEventsLogItemState } from '../../../../../store/report/details/qc-events-log-state.model';
import { Select } from '@ngxs/store';
import { NotesService } from '../../../../../services/notes.service';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs/operators';
// import { DeliveryNotes } from './DeliveryNotes';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';

@Component({
  selector: 'shiptech-notes-log',
  templateUrl: './notes-log.component.html',
  styleUrls: ['./notes-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NotesLogComponent implements OnInit, OnDestroy, OnChanges {
  @Select(UserProfileState.username) username$: Observable<string>;
  @Input('DeliveryNotes') DeliveryNotes: any;
  @Input('id') DeliveryId: any;
  @Input() test: string;
  @Output() ChangedValue = new EventEmitter<any>();

  private _destroy$ = new Subject();
  objNotes: any = [];
  MainobjNotes: any = [];
  User: any = [];
  constructor(
    private store: Store,
    private detailsService: NotesService,
    private toastr: ToastrService,
    private eRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.User = this.store.selectSnapshot(UserProfileState.user);
    this.objNotes  = this.DeliveryNotes;
    Object.assign(this.MainobjNotes, this.DeliveryNotes);
  }

  ngOnChanges(changes: SimpleChanges) {
  }
  update(item: IDeliveryNotesDetailsResponse, newNoteDetails: string): void {
    if(this.DeliveryId != undefined && this.DeliveryId != null){
      item.note = newNoteDetails;
      let payload = {
        "DeliveryId":this.DeliveryId,
        "DeliveryNotes":[item]
        }
      this.detailsService
      .saveDeliveryInfo(payload)
     .subscribe((result: any) => {
         
      });
    }
  }

  add(): void {
   
      var Createon = {
          "id": this.User.id,
          "name": this.User.name,
          "displayName": this.User.displayName,
          "code": null,
          "collectionName": null
      }

    if(this.objNotes != undefined){
      this.objNotes.push({id:0,note:'',createdBy:Createon,createdAt: new Date() });
      this.MainobjNotes.push({id:0,note:'',createdBy:Createon,createdAt: new Date() });
    }else
    {
      debugger;
      this.objNotes = [];
      this.objNotes.push({id:0,note:'',createdBy:Createon,createdAt: new Date() });
      this.MainobjNotes.push({id:0,note:'',createdBy:Createon,createdAt: new Date() });

    }
    
   
  }
  remove(item, index):void {
    if(item.id != 0){
      this.MainobjNotes[index].isDeleted = true;
      this.objNotes.splice(index,1);
    }else{
      this.objNotes.splice(index,1);
      this.MainobjNotes.splice(index,1);
    }

  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.MainobjNotes.forEach((key,index) => {
      if(key.id == 0){
        this.MainobjNotes[index] = this.objNotes[index];
      }
     
    });
    this.ChangedValue.emit(this.MainobjNotes);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
