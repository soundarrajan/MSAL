import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Store } from '@ngxs/store';
import _ from 'lodash';

@Component({
  selector: 'app-spot-negotiation-new-comments',
  templateUrl: './spot-negotiation-new-comments.component.html',
  styleUrls: ['./spot-negotiation-new-comments.component.css']
})
export class SpotNegotiationNewCommentsComponent
  implements OnInit, AfterViewInit {
  @ViewChild('generalComment') generalCommentBox: ElementRef;
  @ViewChild('performanceComment') performanceCommentBox: ElementRef;
  @ViewChild('supplyComment') supplyCommentBox: ElementRef;
  @ViewChild('vesselAndAgentComment') vesselAndAgentCommentBox: ElementRef;

  requestInfo: any = null;
  editableGeneralComment: boolean = false;
  editablePerformanceComment: boolean = false;
  editableSupplyComment: boolean = false;
  editableVesselAndAgentComment: boolean = false;
  showEditIcon: boolean = false;

  notYet: string = ' - ';

  constructor(private store: Store, public changeDetector: ChangeDetectorRef) {
    this.store.subscribe(({ spotNegotiation }) => {
      if (spotNegotiation.currentRequestSmallInfo) {
        this.requestInfo = _.cloneDeep(spotNegotiation.currentRequestSmallInfo);
        // this.requestInfo.negoGeneralComments = 'General comments';
        // this.requestInfo.negoPerformanceComments = 'Performance comments';
        // this.requestInfo.negoSupplierComments = 'Supply comments';
        // this.requestInfo.negoVesselAgentComments = 'Vessel and Agent comments';

        this.editableGeneralComment =
          this.requestInfo?.negoGeneralComments?.length > 0 ? false : true;
        this.editablePerformanceComment =
          this.requestInfo?.negoPerformanceComments?.length > 0 ? false : true;
        this.editableSupplyComment =
          this.requestInfo?.negoSupplierComments?.length > 0 ? false : true;
        this.editableVesselAndAgentComment =
          this.requestInfo?.negoVesselAgentComments?.length > 0 ? false : true;

        console.log(this.requestInfo);
      }
    });
  }

  ngOnInit(): void {}
  ngAfterViewInit() {}

  editNegotiationGeneralComment(): void {
    this.editableGeneralComment = true;
    this.moveCursorToEnd(this.generalCommentBox.nativeElement);
  }

  editPerformanceComment(): void {
    this.editablePerformanceComment = true;
    this.moveCursorToEnd(this.performanceCommentBox.nativeElement);
  }

  editSupplyComments(): void {
    this.editableSupplyComment = true;
    this.moveCursorToEnd(this.supplyCommentBox.nativeElement);
  }

  editvesselAndAgentCommentBox(): void {
    this.editableVesselAndAgentComment = true;
    this.moveCursorToEnd(this.vesselAndAgentCommentBox.nativeElement);
  }

  moveCursorToEnd(element) {
    var len = element.value.length;
    if (element.setSelectionRange) {
      element.focus();
      element.setSelectionRange(len, len);
    } else if (element.createTextRange) {
      var t = element.createTextRange();
      t.collapse(true);
      t.moveEnd('character', len);
      t.moveStart('character', len);
      t.select();
    }
  }
}
