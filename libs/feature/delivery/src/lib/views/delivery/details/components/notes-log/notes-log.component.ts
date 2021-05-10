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
// import { NotesLogGridViewModel } from './view-model/notes-log-grid.view-model';
import { IQcEventsLogItemState } from '../../../../../store/report/details/qc-events-log-state.model';
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
    //this.User = [];
    this.User = this.store.selectSnapshot(UserProfileState.user);
    this.objNotes  = this.DeliveryNotes;
    console.log("0000000000this.User",this.User);
    console.log("0000000000this.User",this.objNotes);

  }

  ngOnChanges(changes: SimpleChanges) {
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
    }else
    {
      this.objNotes = [];
      this.objNotes.push({id:0,note:'',createdBy:Createon,createdAt: new Date() });

    }
    
   
  }
  remove(index):void {
debugger;
this.objNotes.splice(index,1);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.ChangedValue.emit(this.objNotes);
    // if(this.eRef.nativeElement.contains(event.target)) {
    //   if (event.target.innerHTML === 'Reset Filter' || event.target.innerHTML === 'Apply Filter') {
    //     const test = document.querySelectorAll<HTMLElement>('.ag-menu');
    //     test[0].style.display = 'none';
    //   }
     
    // }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
