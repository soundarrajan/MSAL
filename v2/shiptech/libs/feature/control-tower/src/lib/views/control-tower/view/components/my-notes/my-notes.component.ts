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
import {
  IControlTowerGetMyNotesDto,
  IControlTowerSaveNotesItemDto
} from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

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
    private changeDetectorRef: ChangeDetectorRef
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

  selectDate(selectDate) {
    this.filterDate = selectDate.date;
    this.notesContent.forEach(element => {
      if (element.date == selectDate.date) {
        element.selected = true;
      } else element.selected = false;
    });

    this.filterTitle = this.notesContent.filter(
      t => t.date === this.filterDate
    );
    // console.log("ffffffffffffffffff");
    this.filterTitle1 = this.filterTitle[0].title;
    this.filterHeadTitle = this.notesContent.filter(
      t => t.date === this.filterDate
    );
    this.filterHeadTitle1 = this.filterTitle[0].titleHead;
  }

  selectTitle(selectDate, index) {
    this.selectedTitleIndex = index;
  }

  addNotes() {
    var newFirstElement = '';
    const newHeadTitle = [newFirstElement].concat(this.filterHeadTitle1);
    this.filterHeadTitle1 = newHeadTitle;
    const newTitle = [newFirstElement].concat(this.filterTitle1);
    this.filterTitle1 = newTitle;
    this.selectedTitleIndex = 0;
    setTimeout(() => {
      this.titleSection.nativeElement.focus();
    }, 0);
  }
  customTrackBy(index: number, obj: any): any {
    return index;
  }
  handle(e) {
    //alert("");
    //console.log(e);
    if (e.keyCode === 13) {
      e.preventDefault(); // Ensure it is only this code that runs
      //alert("Enter was pressed was presses");
      setTimeout(() => {
        // this will make the execution after the above boolean has changed
        this.notesSection.nativeElement.focus();
      }, 0);
    }
  }

  filteringNotes() {
    //alert("sssssssss");
    //this.searchText = text;
    this.notesContent.forEach(element => {
      // element.selected = false;
      // this.filteringTitle = element.titleHead;
      // this.filteringNoteContent = element.title;
      //console.log(this.filteringTitle);
    });
    this.isFiltered = true;
    //console.log(this.allContent);
  }
  selectFilterTitle(selectContent, index) {
    //alert(index);
    //console.log(selectDate);
    this.clickFiltered = false;
    this.loadnotesContent = [];
    this.loadnotesContent.push(selectContent);
    //console.log(this.loadnotesContent);
    this.selectedSearchIndex = index;
  }
  closeFilter() {
    this.isFiltered = false;
    //this.notesContent = this.notesContent;
  }

  closeDelete() {
    //e.stopPropagation();
    //alert("");
    //this.deletingTitle = true;
    this.deletingTitle = false;
  }
  clickDelete(i) {
    //alert(i);
    this.selectedDeleteTitleIndex = i;
    this.deletingTitle = true;
  }
  deleteTitles() {
    this.filterHeadTitle1.splice(this.selectedDeleteTitleIndex, 1);
    this.filterTitle1.splice(this.selectedDeleteTitleIndex, 1);
    //console.log(this.filterHeadTitle1);
  }

  getMyNotes() {
    let payload: IControlTowerGetMyNotesDto = {
      view: this.view,
      timeView: { id: +this.timeView }
    };
    this.controlTowerService
      .getMyNotes(payload)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          this.notesContent = response;
          if (this.notesContent.length) {
            this.notesContent[0].selected = true;
            this.filterHeadTitle = [];
            this.filterBodyContent = [];

            for (let i = 0; i < this.notesContent[0].notes.length; i++) {
              this.filterHeadTitle.push(this.notesContent[0]?.notes[i]?.title);
              this.filterBodyContent.push(
                this.notesContent[0]?.notes[i]?.message
              );
            }
          }
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  autoSaveNotes(value) {
    console.log(value);
    let payload: IControlTowerSaveNotesItemDto = {
      view: this.view,
      id: 0,
      title: 'New Test',
      message: 'This Note was added'
    };

    this.controlTowerService
      .saveControlTowerNote(payload)
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
        }
      });
  }
}
