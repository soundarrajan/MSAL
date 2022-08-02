import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { BunkeringPlanCommentsService } from '../../services/bunkering-plan-comments.service';
import { BunkeringPlanComponent } from './../bunkering-plan/bunkering-plan.component';
import { Select, Selector } from '@ngxs/store';
import { SaveBunkeringPlanState } from './../../store/bunker-plan/bunkering-plan.state';
import { ISaveVesselData } from './../../store/shared-model/vessel-data-model';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentsComponent implements OnInit {
  @Select(SaveBunkeringPlanState.getVesselData) vesselData$: Observable<
    ISaveVesselData
  >;
  vesselRef: ISaveVesselData;
  @Output() ShowCommentCount = new EventEmitter<any>();

  public expanded: boolean = false;
  public loginUser = 'YH';
  public participants = [];
  public BunkerPlanCommentList = [];
  public BunkerPlanCommentTemp = [];
  public BPCommentsCount = 0;
  public RequestCommentList = [];
  public searchText: string = '';
  public searchByComment: string = '';
  public selectedIndex = null;
  public totalCommentCount: any = 0;
  // selectedCommentTab: number = 0;
  public newComment = '';
  subscription: Subscription;
  searchKey: string;
  _timer;

  constructor(private BPService: BunkeringPlanCommentsService) {
    //Subscribe only once after getting different object model after 800ms
    this.subscription = this.vesselData$
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe(data => {
        this.vesselRef = data;
        this.loadComments();
      });
  }

  ngOnInit() {
    this.loadComments();
  }

  public loadComments() {
    this.loadBunkerPlanComments();
  }

  loadBunkerPlanComments() {
    let payload = this.vesselRef?.vesselId;
    let BunkerPlanComment = this.BPService.getBunkerPlanComments(payload);
    let RequestComment = this.BPService.getRequestComments(payload);
    forkJoin([BunkerPlanComment, RequestComment]).subscribe(responseList => {
      this.BunkerPlanCommentList = responseList[0]?.payload;
      this.BunkerPlanCommentTemp = this.BunkerPlanCommentList;
      this.RequestCommentList = responseList[1]?.payload;
      this.emitCommentCount();
    });
  }
  emitCommentCount() {
    this.totalCommentCount =
      (this.BunkerPlanCommentList?.length
        ? this.BunkerPlanCommentList.length
        : 0) +
      (this.RequestCommentList?.length ? this.RequestCommentList.length : 0);
    this.ShowCommentCount.emit(this.totalCommentCount);
    this.triggerTitleToBind();
  }

  RetainOriginalBPComment(participant) {
    //retain all BP comments once filter get reset
    this.selectedIndex = null;
    if (!participant || participant.trim() == '') {
      this.resetBPComment();
    } else {
      this.searchKey = 'notes';
      this.searchText = participant;
    }
  }
  resetBPComment() {
    //reset BP comment list
    this.BunkerPlanCommentList = [];
    this.BunkerPlanCommentList = this.BunkerPlanCommentTemp;
    this.searchKey = 'notes';
    this.searchText = '';
  }
  searchParticipantComment(participant) {
    this.searchKey = 'createdBy.displayName';
    this.searchText = participant;
    this.searchByComment = '';
  }

  onTabChange(event) {
    let data;
    if (event.index == 0) data = this.BunkerPlanCommentList;
    else data = this.RequestCommentList;
  }
  filterParticipants(data) {
    var resArr = [];
    data.forEach(item => {
      var i = resArr.findIndex(x => x.name == item.name);
      if (i <= -1) {
        resArr.push(item);
      }
    });
    this.participants = resArr;
  }
  toggleExpanded() {
    this.expanded = !this.expanded;
  }
  postNewComment(tabGroup) {
    if (this.newComment.trim() != '' && tabGroup.selectedIndex == 0) {
      let payload = {
        shipId: this.vesselRef?.vesselId,
        BunkerPlanNotes: [
          {
            ship_id: this.vesselRef?.vesselId,
            plan_id: this.vesselRef?.planId,
            notes: this.newComment,
            notes_from: this.vesselRef?.userRole
          }
        ]
      };

      this.BPService.saveRequestComments(payload).subscribe((response)=> {
        this.BunkerPlanCommentList = response?.payload;
        this.BunkerPlanCommentTemp = this.BunkerPlanCommentList;
        this.newComment = '';
        this.emitCommentCount();
      });
    }
  }

  triggerTitleToBind() {
    let titleEle = document.getElementsByClassName(
      'page-title'
    )[0] as HTMLElement;
    titleEle.click();
  }
  toggleSelectParticipant(event, index) {
    //Toggle active and reset comments filter based on participant select or unselect
    let target = event?.currentTarget;
    if (
      target?.classList.length &&
      (target?.classList).contains('active-comment')
    ) {
      this.selectedIndex = null;
      this.resetBPComment();
    } else {
      this.selectedIndex = index;
    }
  }

  ngOnDestroy() {
    //unsubscribe to avoid memory leakage
    this.subscription.unsubscribe();
  }
}
