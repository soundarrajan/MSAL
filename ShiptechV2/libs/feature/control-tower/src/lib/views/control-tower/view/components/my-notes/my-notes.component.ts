import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
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
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
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

  selectDate(selectedLine) {
    this.notesContent.forEach(element => {
      if (element.displayName == selectedLine.displayName) {
        element.selected = true;
      } else element.selected = false;
    });
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
    setTimeout(() => {
      this.titleSection.nativeElement.focus();
    }, 0);
  }

  getMyNotes() {
    let payload: IControlTowerGetMyNotesDto = {
      view: this.view,
      timeView: { id: +this.timeView }
    };
    this.spinner.show();
    this.controlTowerService
      .getMyNotes(payload)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          console.log(response);
          this.notesContent = response;
          if (this.notesContent.length) {
            if (this.notesContent[0].displayName != 'Today') {
              let todayElement = {
                notes: [],
                displayName: 'Today'
              };
              const newContentForNotes = [todayElement].concat(
                this.notesContent
              );
              this.notesContent = _.cloneDeep(newContentForNotes);
            }
            this.notesContent[0].selected = true;
          } else {
            // let todayElement = {
            //   notes: [],
            //   displayName: 'Today'
            // };
            // const newContentForNotes = [todayElement];
            // this.notesContent = _.cloneDeep(newContentForNotes);
            // this.notesContent[0].selected = true;
          }
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  autoSaveNotes(noteLine, selectedPeriodLine) {
    let payload: IControlTowerSaveNotesItemDto = {
      view: this.view,
      id: noteLine.id,
      title: noteLine.title,
      message: noteLine.message,
      isDeleted: noteLine.isDeleted
    };
    console.log(payload);
    this.controlTowerService
      .saveControlTowerNote(payload)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.getAllNotesAfterSave(selectedPeriodLine);
        }
      });
  }

  getAllNotesAfterSave(selectedPeriod) {
    let payload: IControlTowerGetByIdDto = {
      view: this.view,
      timeView: { id: +this.timeView },
      startDate: selectedPeriod.startDate,
      endDate: selectedPeriod.endDate
    };
    this.controlTowerService
      .getFilteredNotes(payload)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          selectedPeriod.notes = response;
          console.log(this.notesContent);
          this.changeDetectorRef.detectChanges();
        }
      });
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
      .getFilteredNotes(payload)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          this.filteredNotes = _.cloneDeep(response);
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
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      const elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
    }
  }
}
