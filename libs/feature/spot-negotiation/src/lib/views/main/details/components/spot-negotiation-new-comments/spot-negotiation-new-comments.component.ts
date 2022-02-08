import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Store } from '@ngxs/store';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { UpdateRequest } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import { SetRequests } from 'libs/feature/spot-negotiation/src/lib/store/actions/request-group-actions';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-spot-negotiation-new-comments',
  templateUrl: './spot-negotiation-new-comments.component.html',
  styleUrls: ['./spot-negotiation-new-comments.component.css']
})
export class SpotNegotiationNewCommentsComponent
  implements OnInit, AfterViewInit {
  expandCommentsSection: boolean = false;

  @Input('expandCommentsSection') set _setExpandCommentsSection(
    expandCommentsSection
  ) {
    this.expandCommentsSection = expandCommentsSection;
    if (this.expandCommentsSection) {
      this.expandCommentsPanel();
    }
  }

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
  @ViewChild(MatExpansionPanel, { static: true })
  matExpansionPanelElement: MatExpansionPanel;

  currentRequestInfo: any;
  requestList: any[] = [];
  requestListToDuplicateComments: any[] = [];

  negoGeneralCommentsChecked: boolean = false;
  negoPerformanceCommentsChecked: boolean = false;
  negoSupplierCommentsChecked: boolean = false;
  negoVesselAgentCommentsChecked: boolean = false;

  requestGeneralCommentsChecked: boolean = false;
  requestSupplierCommentsChecked: boolean = false;
  requestVesselAgentCommentsChecked: boolean = false;

  constructor(
    private store: Store,
    public changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.store.subscribe(({ spotNegotiation }) => {
      this.currentRequestInfo = _.cloneDeep(
        spotNegotiation.currentRequestSmallInfo
      );
      this.requestList = _.cloneDeep(spotNegotiation.requests);
      if (spotNegotiation.currentRequestSmallInfo) {
        this.requestInfo = _.cloneDeep(spotNegotiation.currentRequestSmallInfo);

        this.requestInfo.negoGeneralComments = this.transform(
          this.requestInfo.negoGeneralComments
        );
        this.requestInfo.negoPerformanceComments = this.transform(
          this.requestInfo.negoPerformanceComments
        );
        this.requestInfo.negoSupplierComments = this.transform(
          this.requestInfo.negoSupplierComments
        );
        this.requestInfo.negoVesselAgentComments = this.transform(
          this.requestInfo.negoVesselAgentComments
        );

        this.requestInfo.oldNegoGeneralComments = _.cloneDeep(
          this.requestInfo.negoGeneralComments
        );
        this.requestInfo.oldNegoPerformanceComments = _.cloneDeep(
          this.requestInfo.negoPerformanceComments
        );
        this.requestInfo.oldNegoSupplierComments = _.cloneDeep(
          this.requestInfo.negoSupplierComments
        );
        this.requestInfo.oldNegoVesselAgentComments = _.cloneDeep(
          this.requestInfo.negoVesselAgentComments
        );

        this.checkEditableFields();

        this.uncheckedComments();
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

  transform(str: any, property?: string): any {
    var decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    if (str && str[property]) {
      str[property] = decode(_.unescape(str[property]));
      return str;
    }
    return decode(_.unescape(str));
  }

  checkEditableFields() {
    this.editableGeneralComment =
      this.requestInfo?.negoGeneralComments?.length > 0 ? false : true;
    this.editablePerformanceComment =
      this.requestInfo?.negoPerformanceComments?.length > 0 ? false : true;
    this.editableSupplyComment =
      this.requestInfo?.negoSupplierComments?.length > 0 ? false : true;
    this.editableVesselAndAgentComment =
      this.requestInfo?.negoVesselAgentComments?.length > 0 ? false : true;
  }

  saveComment(type) {
    console.log(type);
    let payload = {};
    if (type == 'general') {
      if (
        this.requestInfo.oldNegoGeneralComments.trim() ==
        this.requestInfo.negoGeneralComments.trim()
      ) {
        return;
      }
      payload = {
        RequestId: this.requestInfo.id,
        NegoGeneralComments: this.requestInfo.negoGeneralComments.trim()
      };
    } else if (type == 'performance') {
      if (
        this.requestInfo.oldNegoPerformanceComments.trim() ==
        this.requestInfo.negoPerformanceComments.trim()
      ) {
        return;
      }
      payload = {
        RequestId: this.requestInfo.id,
        NegoPerformanceComments: this.requestInfo.negoPerformanceComments.trim()
      };
    } else if (type == 'supplier') {
      if (
        this.requestInfo.oldNegoSupplierComments.trim() ==
        this.requestInfo.negoSupplierComments.trim()
      ) {
        return;
      }
      payload = {
        RequestId: this.requestInfo.id,
        NegoSupplierComments: this.requestInfo.negoSupplierComments.trim()
      };
    } else if (type == 'vesselAndAgent') {
      if (
        this.requestInfo.oldNegoVesselAgentComments.trim() ==
        this.requestInfo.negoVesselAgentComments.trim()
      ) {
        return;
      }
      payload = {
        RequestId: this.requestInfo.id,
        NegoVesselAgentComments: this.requestInfo.negoVesselAgentComments.trim()
      };
    }

    this.spotNegotiationService
      .updateNegotiationComments(payload)
      .subscribe((response: any) => {
        console.log(response);
        if (response.status) {
          if (type == 'general') {
            this.requestInfo.oldNegoGeneralComments = _.cloneDeep(
              this.requestInfo.negoGeneralComments
            );
          } else if (type == 'performance') {
            this.requestInfo.oldNegoPerformanceComments = _.cloneDeep(
              this.requestInfo.negoPerformanceComments
            );
          } else if (type == 'supplier') {
            this.requestInfo.oldNegoSupplierComments = _.cloneDeep(
              this.requestInfo.negoSupplierComments
            );
          } else if (type == 'vesselAndAgent') {
            this.requestInfo.oldNegoVesselAgentComments = _.cloneDeep(
              this.requestInfo.negoVesselAgentComments
            );
          }
          this.toastr.success('Comments saved successfully!');
        } else {
          this.toastr.error('An error has occurred!');
        }
      });
  }

  expandCommentsPanel() {
    this.matExpansionPanelElement.open();
  }

  getRequestsList() {
    if (this.requestList && this.currentRequestInfo) {
      this.requestListToDuplicateComments = _.cloneDeep(
        this.requestList
          .filter(r => r.id != this.currentRequestInfo.id)
          .map(req => ({ ...req, isSelected: true }))
      );
    }
  }

  onRequestListCheckboxChange(checkbox: any, element: any) {
    element.isSelected = checkbox.checked ? true : false;
  }

  getRequestsIdsForSelectedList(selectedRequests) {
    let requestIds = [];
    for (let i = 0; i < selectedRequests.length; i++) {
      requestIds.push(selectedRequests[i].id);
    }
    return requestIds;
  }

  copyCommentsToSelectedRequests() {
    let selectedRequests = _.cloneDeep(
      _.filter(this.requestListToDuplicateComments, function(request) {
        return request.isSelected;
      })
    );
    console.log(selectedRequests);
    let payload = {
      FromRequestId: this.requestInfo.id,
      ToRequestIds: this.getRequestsIdsForSelectedList(selectedRequests)
    };
    console.log(payload);
    // selectedRequests[0].negoGeneralComments = 'NEGOTIATION GENERAL';
    // this.store.dispatch(new UpdateRequest(selectedRequests));
  }

  uncheckedComments() {
    this.negoGeneralCommentsChecked = false;
    this.negoPerformanceCommentsChecked = false;
    this.negoSupplierCommentsChecked = false;
    this.negoVesselAgentCommentsChecked = false;
    this.requestGeneralCommentsChecked = false;
    this.requestSupplierCommentsChecked = false;
    this.requestVesselAgentCommentsChecked = false;
  }
}
