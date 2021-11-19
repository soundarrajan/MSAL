import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import {
  IControlTowerGetByIdDto,
  IControlTowerGetFilteredNotesDto,
  IControlTowerGetMyNotesDto,
  IControlTowerSaveNotesItemDto
} from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import _ from 'lodash';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    // Match in a case insensitive maneer
    const re = new RegExp(args, 'gi');
    const match = value.match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return value;
    }

    const replacedValue = value.replace(
      re,
      "<mark style='background: #344872;color:white;padding:0;'>" +
        match[0] +
        '</mark>'
    );
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }
}

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.css']
})
export class MyNotesComponent implements OnInit {
  public notesContent: any = [];
  public savedContent: any;
  public selectedDeleteTitleIndex: any;
  public monthlynotesContent: any;
  public weeklynotesContent: any;
  public loadnotesContent = [];
  public clickFiltered: boolean = true;
  public allContent;
  any;
  public searchText;
  public filterTitle: any;
  public filterHeadTitle: any;
  public filterHeadTitle1: any;
  public filterTitle1: any;
  public filterDate: any;
  public filterNotes: any;
  public index: any;
  public selectedTitleIndex: number = 0;
  public selectedSearchIndex: number;
  public switchTheme: boolean = true;
  public daily = 'daily';
  public selectedFilterList: any;
  public isFiltered: boolean = false;
  public filteringTitle: any;
  public filteringNoteContent: any;
  public deletingTitle: boolean = false;
  @Input() theme: boolean;
  @Input() newScreen: boolean;
  view: any;
  timeView: string;
  defaultTimeView: string;
  filterBodyContent: any[];
  displayNameOfSelectedLine: any;
  selectedLineContent: any[] = [];
  filteredNotes: any;
  user: IDisplayLookupDto<number, string>;

  get controlTowerNotesViewType(): any[] {
    return this._controlTowerNotesViewType;
  }

  @Input() set controlTowerNotesViewType(value: any[]) {
    this._controlTowerNotesViewType = value;
  }

  @Input() _controlTowerNotesViewType: any[];

  get screenList(): any[] {
    return this._screenList;
  }

  @Input() set screenList(value: any[]) {
    this._screenList = value;
  }

  @Input() _screenList: any[];

  get screenType(): string {
    return this._screenType;
  }

  @Input() set screenType(value: string) {
    this._screenType = value;
  }

  @Input() _screenType: any;

  @ViewChild('notesSection') notesSection: ElementRef;
  @ViewChild('titleSection') titleSection: ElementRef;
  public text: String = `Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore Lorem Ipsum dolor sit amet, 
  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore`;
  constructor(
    private controlTowerService: ControlTowerService,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    public format: TenantFormattingService,
    private spinner: NgxSpinnerService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.user = this.store.selectSnapshot(UserProfileState.user);

    console.log(this.screenList);
    console.log(this.controlTowerNotesViewType);
    console.log(this.screenType);
    let screenType = this.screenType;
    this.view = _.find(this.screenList, function(object) {
      return object.name == screenType;
    });
    this.timeView = this.controlTowerNotesViewType[0].id.toString();
    this.defaultTimeView = this.controlTowerNotesViewType[0].id.toString();

    console.log(this.view);
    this.getMyNotes();
  }

  selectTitle(selectDate, index) {
    this.selectedTitleIndex = index;
  }

  findIndexForSelectedLinePeriod(): number {
    let index = _.findIndex(this.notesContent, function(object: any) {
      return object.selected;
    });
    if (index != -1) {
      return index;
    }
  }

  selectDate(selectedLine) {
    this.notesContent.forEach(element => {
      if (element.displayName == selectedLine.displayName) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    let index = this.findIndexForSelectedLinePeriod();
    let selectedLinePeriod = this.notesContent[index];
    let payload: IControlTowerGetFilteredNotesDto = {
      view: this.view,
      timeView: { id: +this.timeView },
      startDate: selectedLinePeriod.startDate,
      endDate: selectedLinePeriod.endDate,
      searchText: this.searchText
    };

    this.controlTowerService
      .getFilteredNotes(payload, this.view)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
        }
      });
  }

  addNotes() {
    var newFirstElement = {
      title: '',
      message: '',
      id: 0,
      isDeleted: false
    };
    let index = this.findIndexForSelectedLinePeriod();
    let selectedLinePeriod = this.notesContent[index];
    const newContentForNotes = [newFirstElement].concat(
      selectedLinePeriod.notes
    );
    this.notesContent[index].notes = _.cloneDeep(newContentForNotes);
    this.selectedTitleIndex = 0;

    // setTimeout(() => {
    //   this.titleSection.nativeElement.focus();
    // }, 0);
  }

  getFirstIndexWithNotes() {
    let findFirstIndex = _.findIndex(this.notesContent, function(object: any) {
      return object?.notes?.length > 0;
    });
    if (findFirstIndex != -1) {
      return findFirstIndex;
    }
  }

  getMyNotes() {
    let payload: IControlTowerGetMyNotesDto = {
      view: this.view,
      timeView: { id: +this.timeView }
    };
    this.spinner.show();
    this.controlTowerService
      .getNotes(payload, this.view)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.notesContent = response;
          this.addTodayIfNotExist();
          let index = this.getFirstIndexWithNotes();
          if (typeof index != 'undefined') {
            this.notesContent[index].selected = true;
          } else {
            this.notesContent[0].selected = true;
          }
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  addTodayIfNotExist() {
    if (parseFloat(this.timeView) == 1) {
      if (this.notesContent.length) {
        if (this.notesContent[0].displayName != 'Today') {
          let todayElement = {
            notes: [],
            displayName: 'Today',
            startDate: moment().format('YYYY-MM-DD') + 'T00:00:00Z',
            endDate: moment().format('YYYY-MM-DD') + 'T23:59:59.999Z'
          };
          const newContentForNotes = [todayElement].concat(this.notesContent);
          this.notesContent = _.cloneDeep(newContentForNotes);
        }
      } else {
        let todayElement = {
          notes: [],
          displayName: 'Today',
          startDate: moment().format('YYYY-MM-DD') + 'T00:00:00Z',
          endDate: moment().format('YYYY-MM-DD') + 'T23:59:59.999Z'
        };
        const newContentForNotes = [todayElement];
        this.notesContent = _.cloneDeep(newContentForNotes);
      }
    }
  }

  getUntitledIndex(notes) {
    let indexArray = [];
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].title.includes('Untitled ')) {
        let titleIndex = parseFloat(notes[i].title.split('Untitled ')[1]);
        indexArray.push(titleIndex);
      }
    }
    if (indexArray.length) {
      let findMaxIndex = _.max(indexArray);
      return findMaxIndex + 1;
    } else {
      return 1;
    }
  }

  autoSaveNotes(noteLine, selectedPeriodLine) {
    let payload: IControlTowerSaveNotesItemDto = {
      view: this.view,
      id: noteLine.id,
      title: noteLine.title
        ? noteLine.title
        : 'Untitled ' + this.getUntitledIndex(selectedPeriodLine.notes),
      message: noteLine.message,
      isDeleted: noteLine.isDeleted
    };
    console.log(payload);
    this.controlTowerService
      .saveControlTowerNote(payload, this.view)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          noteLine.id = response.id;
          noteLine.lastModifiedOn = response.lastModifiedOn;
          noteLine.isDeleted = response.isDeleted;
          noteLine.title = response.title;

          this.changeDetectorRef.detectChanges();
          if (noteLine.isDeleted) {
            selectedPeriodLine.notes.splice(this.selectedDeleteTitleIndex, 1);
          }
          if (parseFloat(this.timeView) == 1) {
            if (selectedPeriodLine.displayName != 'Today') {
              if (!noteLine.isDeleted) {
                this.moveNoteToToday(noteLine, selectedPeriodLine);
              }
            }
          }
        }
      });
  }

  moveNoteToToday(noteLine, selectedPeriodLine) {
    let findNoteIndex = _.findIndex(selectedPeriodLine.notes, function(
      note: any
    ) {
      return note.id == noteLine.id;
    });
    if (findNoteIndex != -1) {
      selectedPeriodLine?.notes.splice(findNoteIndex, 1);
      this.changeDetectorRef.detectChanges();
      console.log(selectedPeriodLine);
    }
  }

  closeDelete() {
    this.deletingTitle = false;
  }

  clickDelete(i) {
    this.selectedDeleteTitleIndex = i;
    this.deletingTitle = true;
  }

  deleteTitles(selectedPeriodLine) {
    let noteLine = selectedPeriodLine.notes[this.selectedDeleteTitleIndex];
    if (noteLine.id) {
      noteLine.isDeleted = true;
      this.autoSaveNotes(noteLine, selectedPeriodLine);
    } else {
      selectedPeriodLine.splice(this.selectedDeleteTitleIndex, 1);
    }
  }

  filteringNotes() {
    let index = this.findIndexForSelectedLinePeriod();
    let selectedLinePeriod = this.notesContent[index];
    let payload: IControlTowerGetFilteredNotesDto = {
      view: this.view,
      timeView: { id: +this.timeView },
      startDate: selectedLinePeriod.startDate,
      endDate: selectedLinePeriod.endDate,
      searchText: this.searchText
    };
    this.isFiltered = true;

    this.controlTowerService
      .getFilteredNotes(payload, this.view)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          this.filteredNotes = _.cloneDeep(response);
          for (let i = 0; i < this.filteredNotes.length; i++) {
            this.filteredNotes[i].displayName = selectedLinePeriod.displayName;
          }
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  selectFilterTitle(index) {
    this.clickFiltered = false;
    this.selectedSearchIndex = index;
  }

  closeFilter() {
    this.isFiltered = false;
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  handle(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      setTimeout(() => {
        this.notesSection.nativeElement.focus();
      }, 0);
    }
  }

  formatDate(date?: any) {
    if (date) {
      return this.format.dateUtc(date);
    }
  }

  detectCurrentUser(noteLine) {
    if (noteLine && noteLine.createdBy && this.user) {
      return this.user.id != noteLine.createdBy.id ? true : false;
    }
    return false;
  }
}
