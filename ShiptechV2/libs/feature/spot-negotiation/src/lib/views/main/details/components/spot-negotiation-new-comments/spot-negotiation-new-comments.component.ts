import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Store } from '@ngxs/store';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { UpdateSpecificRequests } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import { SetCurrentRequestSmallInfo } from 'libs/feature/spot-negotiation/src/lib/store/actions/request-group-actions';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-spot-negotiation-new-comments',
  templateUrl: './spot-negotiation-new-comments.component.html',
  styleUrls: ['./spot-negotiation-new-comments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  requestStrategyCommentsChecked: boolean = false;
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
          this.store.dispatch(new SetCurrentRequestSmallInfo(this.requestInfo));
          let currentRequest = _.cloneDeep([this.requestInfo]);
          this.store.dispatch(new UpdateSpecificRequests(currentRequest));
          this.checkEditableFields();
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

  copyComments(selectedRequests) {
    for (let i = 0; i < selectedRequests.length; i++) {
      //Copy Negotiation Comments
      if (this.negoGeneralCommentsChecked) {
        selectedRequests[i].negoGeneralComments = _.cloneDeep(
          this.requestInfo.negoGeneralComments
        );
      }
      if (this.negoPerformanceCommentsChecked) {
        selectedRequests[i].negoPerformanceComments = _.cloneDeep(
          this.requestInfo.negoPerformanceComments
        );
      }
      if (this.negoSupplierCommentsChecked) {
        selectedRequests[i].negoSupplierComments = _.cloneDeep(
          this.requestInfo.negoSupplierComments
        );
      }
      if (this.negoVesselAgentCommentsChecked) {
        selectedRequests[i].negoVesselAgentComments = _.cloneDeep(
          this.requestInfo.negoVesselAgentComments
        );
      }

      //Copy Request Comments
      if (this.requestGeneralCommentsChecked) {
        selectedRequests[i].generalComments = _.cloneDeep(
          this.requestInfo.generalComments
        );
      }
      if (this.requestStrategyCommentsChecked) {
        selectedRequests[i].strategyComments = _.cloneDeep(
          this.requestInfo.strategyComments
        );
      }
      if (this.requestSupplierCommentsChecked) {
        selectedRequests[i].supplierComments = _.cloneDeep(
          this.requestInfo.supplierComments
        );
      }
      if (this.requestVesselAgentCommentsChecked) {
        selectedRequests[i].vesselAgentComments = _.cloneDeep(
          this.requestInfo.vesselAgentComments
        );
      }
    }

    return selectedRequests;
  }

  copyCommentsToSelectedRequests() {
    let selectedRequests = _.cloneDeep(
      _.filter(this.requestListToDuplicateComments, function(request) {
        return request.isSelected;
      })
    );
    if (selectedRequests.length == 0) {
      this.toastr.error('At least one request should be selected!');
      return;
    }
    if (
      !this.negoGeneralCommentsChecked &&
      !this.negoPerformanceCommentsChecked &&
      !this.negoSupplierCommentsChecked &&
      !this.negoVesselAgentCommentsChecked &&
      !this.requestGeneralCommentsChecked &&
      !this.requestStrategyCommentsChecked &&
      !this.requestSupplierCommentsChecked &&
      !this.requestVesselAgentCommentsChecked
    ) {
      this.toastr.error('At least one comment should be selected!');
      return;
    }
    let payload = {
      FromRequestId: this.requestInfo.id,
      ToRequestIds: this.getRequestsIdsForSelectedList(selectedRequests),
      CommentsToBeCopied: {
        NegoGeneralComments: this.negoGeneralCommentsChecked,
        NegoPerformanceComments: this.negoPerformanceCommentsChecked,
        NegoSupplierComments: this.negoSupplierCommentsChecked,
        NegoVesselAgentComments: this.negoVesselAgentCommentsChecked,
        RequestGeneralComments: this.requestGeneralCommentsChecked,
        RequestStrategyComments: this.requestStrategyCommentsChecked,
        RequestSupplierComments: this.requestSupplierCommentsChecked,
        RequestVesselAgentComments: this.requestVesselAgentCommentsChecked
      }
    };

    this.spotNegotiationService
      .copyNegotiationComments(payload)
      .subscribe((response: any) => {
        console.log(response);
        if (response.status) {
          let newSelectedRequests = this.copyComments(selectedRequests);
          this.store.dispatch(new UpdateSpecificRequests(newSelectedRequests));
          this.toastr.success('Comment copied successfully!');
        } else {
          this.toastr.error('An error has occurred!');
        }
      });
  }

  uncheckedComments() {
    this.negoGeneralCommentsChecked = false;
    this.negoPerformanceCommentsChecked = false;
    this.negoSupplierCommentsChecked = false;
    this.negoVesselAgentCommentsChecked = false;

    this.requestGeneralCommentsChecked = false;
    this.requestStrategyCommentsChecked = false;
    this.requestSupplierCommentsChecked = false;
    this.requestVesselAgentCommentsChecked = false;
  }

  checkCommentsLimit(comments, type) {
    if (type === 'general') {
      if (comments.length > 1000) {
        this.toastr.warning('Is exists the character limit of 1000');
        setTimeout(() => {
          this.requestInfo.negoGeneralComments = _.cloneDeep(
            comments.substr(0, 1000)
          );
          this.changeDetector.detectChanges();
        }, 1);
      }
    } else if (type == 'performance') {
      if (comments.length > 1000) {
        this.toastr.warning('Is exists the character limit of 1000');
        setTimeout(() => {
          this.requestInfo.negoPerformanceComments = _.cloneDeep(
            comments.substr(0, 1000)
          );
          this.changeDetector.detectChanges();
        }, 1);
      }
    } else if (type == 'supplier') {
      if (comments.length > 1000) {
        this.toastr.warning('Is exists the character limit of 1000');
        setTimeout(() => {
          this.requestInfo.negoSupplierComments = _.cloneDeep(
            comments.substr(0, 1000)
          );
          this.changeDetector.detectChanges();
        }, 1);
      }
    } else if (type == 'vesselAndAgent') {
      if (comments.length > 1000) {
        this.toastr.warning('Is exists the character limit of 1000');
        setTimeout(() => {
          this.requestInfo.negoVesselAgentComments = _.cloneDeep(
            comments.substr(0, 1000)
          );
          this.changeDetector.detectChanges();
        }, 1);
      }
    }
  }
}
