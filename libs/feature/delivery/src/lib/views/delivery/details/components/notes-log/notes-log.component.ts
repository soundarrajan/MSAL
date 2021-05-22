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
import { IDeliveryNotesDetailsResponse } from '../../../../../services/api/request-response/delivery-by-id.request-response';
import { Select } from '@ngxs/store';
import { NotesService } from '../../../../../services/notes.service';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';

@Component({
  selector: 'shiptech-notes-log',
  templateUrl: './notes-log.component.html',
  styleUrls: ['./notes-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NotesLogComponent implements OnInit, OnDestroy {
  @Select(UserProfileState.username) username$: Observable<string>;
  @Input('DeliveryNotes') DeliveryNotes: any;
  @Input('id') DeliveryId: any;
  @Input() test: string;
  @Output() ChangedValue = new EventEmitter<any>();

  private _destroy$ = new Subject();
  objNotes: any = [];
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
    this.objNotes = this.DeliveryNotes;
  }
  update(item: IDeliveryNotesDetailsResponse, newNoteDetails: string, index: number): void {
    debugger;
    if (this.DeliveryId != undefined && this.DeliveryId != null) {
      item.note = newNoteDetails;
      let payload = {
        "DeliveryId": this.DeliveryId,
        "DeliveryNotes": [item]
      }
      this.detailsService
        .saveDeliveryInfo(payload)
        .subscribe((result: any) => {
          this.objNotes = result;
          this.ChangedValue.emit(this.objNotes);
        });
    }
  }

  RemoveItem(item: IDeliveryNotesDetailsResponse, index: number): void {
    debugger;
    if (this.DeliveryId != undefined && this.DeliveryId != null) {
      item.isDeleted = true;
      let payload = {
        "DeliveryId": this.DeliveryId,
        "DeliveryNotes": [item]
      }
      this.detailsService
        .saveDeliveryInfo(payload)
        .subscribe((result: any) => {
          this.objNotes = result;
          this.ChangedValue.emit(this.objNotes);
        });
    }
    else{
      this.objNotes.splice(index, 1);
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
    if (this.objNotes != undefined) {
      this.objNotes.push({ id: 0, note: '', createdBy: Createon, createdAt: new Date() });
    }
    else {
      this.objNotes = [];
      this.objNotes.push({ id: 0, note: '', createdBy: Createon, createdAt: new Date() });
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.ChangedValue.emit(this.objNotes);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
