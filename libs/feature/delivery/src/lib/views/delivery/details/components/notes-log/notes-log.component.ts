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
  ChangeDetectorRef,
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
import { TenantFormattingService } from '../../../../../../../../../core/src/lib/services/formatting/tenant-formatting.service';
import moment from 'moment';

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

  private _destroy$ = new Subject();
  objNotes: any = [];
  User: any = [];
  constructor(
    private store: Store,
    private detailsService: NotesService,
    private toastr: ToastrService,
    private eRef: ElementRef,
    private ref: ChangeDetectorRef,
    private format: TenantFormattingService
  ) {}

  ngOnInit(): void {
    this.User = this.store.selectSnapshot(UserProfileState.user);
    this.objNotes = this.DeliveryNotes;
  }
  update(
    item: IDeliveryNotesDetailsResponse,
    newNoteDetails: string,
    index: number
  ): void {
    if (this.DeliveryId != undefined && this.DeliveryId != null) {
      item.note = newNoteDetails;
      item.createdAt = this.formatDateForBe(new Date());
      let payload = {
        DeliveryId: this.DeliveryId,
        DeliveryNotes: [item]
      };
      this.detailsService.saveDeliveryInfo(payload).subscribe((result: any) => {
        this.objNotes = result;
        // Detect changes
        this.ref.markForCheck();
      });
    }
  }

  removeItem(item: IDeliveryNotesDetailsResponse, index: number): void {
    if (this.DeliveryId != undefined && this.DeliveryId != null) {
      item.isDeleted = true;
      let payload = {
        DeliveryId: this.DeliveryId,
        DeliveryNotes: [item]
      };
      this.detailsService.saveDeliveryInfo(payload).subscribe((result: any) => {
        this.objNotes = result;

        // Detect changes
        this.ref.markForCheck();
      });
    } else {
      this.objNotes.splice(index, 1);
      // Detect changes
      this.ref.markForCheck();
    }
  }

  formatDate(date?: any) {
    if (date) {
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      let elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
    }
  }

  formatDateForBe(value) {
    if (value) {
      let beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      return `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
    } else {
      return null;
    }
  }

  add(): void {
    var Createon = {
      id: this.User.id,
      name: this.User.name,
      displayName: this.User.displayName,
      code: null,
      collectionName: null
    };
    if (this.objNotes != undefined) {
      this.objNotes.push({
        id: 0,
        note: '',
        createdBy: Createon,
        createdAt: this.formatDateForBe(new Date())
      });

      // Detect changes
      this.ref.markForCheck();
    } else {
      this.objNotes = [];
      this.objNotes.push({
        id: 0,
        note: '',
        createdBy: Createon,
        createdAt: this.formatDateForBe(new Date())
      });
      // Detect changes
      this.ref.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
