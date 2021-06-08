import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BunkeringPlanCommentsService } from "../../services/bunkering-plan-comments.service";
import { BunkeringPlanComponent } from "./../bunkering-plan/bunkering-plan.component";
import { Select, Selector } from "@ngxs/store";
import { SaveBunkeringPlanState } from "./../../store/bunker-plan/bunkering-plan.state";
import { ISaveVesselData } from "./../../store/shared-model/vessel-data-model";
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Select(SaveBunkeringPlanState.getVesselData) vesselData$: Observable<ISaveVesselData>;
  vesselRef: ISaveVesselData;
  @Output() ShowCommentCount = new EventEmitter<any>();
  
  public expanded: boolean = false;
  public loginUser = "YH";
  public participants = [];
  public BunkerPlanCommentList = [];
  public BunkerPlanCommentTemp = [];
  public BPCommentsCount = 0
  public RequestCommentList = [];
  public searchText: string = '';
  public searchByComment: string = '';
  public selectedIndex = null;
  public totalCommentCount: any = 0;
  // selectedCommentTab: number = 0;
  public newComment = "";
  subscription: Subscription;
  searchKey: string;
  _timer;
  // public newAttachment = [];
  // public bunkerPlanData = [
  //   {
  //     placeholder: 'AJ',
  //     name: 'Alexander James',
  //     time: '09:00',
  //     date: '13 Dec 2019',
  //     comment: 'Status remains the same. See the link to get further details.',
  //     attachment: ['Screenshot1_2018-06-21', 'Screenshot2_2018-06-21']
  //   },
  //   {
  //     placeholder: 'PB',
  //     name: 'Pooja Bhattiprolu',
  //     time: '09:00',
  //     date: '13 Dec 2019',
  //     comment: 'Catania will be closed from tomorrow.',
  //     attachment: []
  //   },
  //   {
  //     placeholder: 'YH',
  //     name: 'Yusuf Hassan',
  //     time: '09:00',
  //     date: '13 Dec 2019',
  //     comment: 'Status remains the same. See the link to get further details.',
  //     attachment: []
  //   }
  // ]
  // public requests = [
  //   {
  //     placeholder: 'AJ',
  //     name: 'Alexander James',
  //     time: '09:00',
  //     date: '13 Dec 2019',
  //     comment: 'Status remains the same. See the link to get further details.',
  //     attachment: []
  //   },
  //   {
  //     placeholder: 'GS',
  //     name: 'Gokul Simsons',
  //     time: '09:00',
  //     date: '13 Dec 2019',
  //     comment: 'Status remains the same. See the link to get further details so as to decide on future changes to be incorporated into the design system.Link given below.',
  //     attachment: []
  //   },
  // ]
  
  constructor(private BPService: BunkeringPlanCommentsService) {
    //Subscribe only once after getting different object model after 800ms
    this.subscription = this.vesselData$
    .pipe(
      debounceTime(800), 
      distinctUntilChanged()
    )
    .subscribe(data=> {
      this.vesselRef = data;
      this.loadComments();
    });
  }

  ngOnInit() {
    // this.participants = this.bunkerPlanData
    this.loadComments();
  }

  BPCommentsCountFn(count) {
    this.BPCommentsCount = count? count:0;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.triggerTitleToBind();
    }, 100);
  }

  public loadComments() {
    this.loadBunkerPlanComments();
    this.loadRequestComments();
  }

  loadBunkerPlanComments() {
    let payload = { "shipId": this.vesselRef?.vesselId,"BunkerPlanNotes": [ ] }
    
    this.BPService.getBunkerPlanComments(payload).subscribe((response)=> {
      console.log('Bunker Plan Comments...', response?.payload);
      this.BunkerPlanCommentList = response?.payload;
      this.BunkerPlanCommentTemp = this.BunkerPlanCommentList;
      this.triggerTitleToBind();
    })   
  }
  loadRequestComments() {
    let payload = this.vesselRef?.vesselId; //3524
    this.BPService.getRequestComments(payload).subscribe((response)=> {
      console.log('Request Comments...', response?.payload);
      this.RequestCommentList = response?.payload;
      this.totalCommentCount = (this.BunkerPlanCommentList?.length? this.BunkerPlanCommentList?.length: 0)
      +(this.RequestCommentList?.length? this.RequestCommentList?.length: 0);
      this.ShowCommentCount.emit(this.totalCommentCount);
      this.triggerTitleToBind();
    })
  }

  RetainOriginalBPComment(participant) {
    //retain all BP comments once filter get reset
    this.selectedIndex = null;
    if(!participant || participant.trim()=='') {
      this.BunkerPlanCommentList = [];
      this.BunkerPlanCommentList = this.BunkerPlanCommentTemp;
      this.searchKey = 'notes'
      this.searchText = '';
    } else {
      this.searchKey = 'notes'
      this.searchText = participant;
    }
  }

  searchParticipantComment(participant) {
    this.searchKey = 'createdBy.displayName'
    this.searchText = participant;
    this.searchByComment = '';
  }

  onTabChange(event) {
    let data;
    // this.selectedCommentTab = event?.index;
    if (event.index == 0)
      data = this.BunkerPlanCommentList;
    else
      data = this.RequestCommentList;

    // this.filterParticipants(data);

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
    console.log(this.vesselRef);
    // let HighNoteIdObj = {notes_id: '0'};
    // if(this.BunkerPlanCommentList.length) {
    //   HighNoteIdObj = this.BunkerPlanCommentList.reduce(function(prev, cur) { return prev.notes_id > cur.notes_id? prev: cur; })
    // }
    if ( this.newComment.trim() != '' && tabGroup.selectedIndex == 0) {
      let payload = { 
        "shipId": this.vesselRef?.vesselId,
        "BunkerPlanNotes": [ 
          { 
            "ship_id": this.vesselRef?.vesselId,
            "plan_id": this.vesselRef?.planId, 
            "notes": this.newComment, 
            "notes_from": this.vesselRef?.userRole, 
            // "notes_id": (Number(HighNoteIdObj?.notes_id)+1).toString()
          }
        ]
      };

      this.BPService.getBunkerPlanComments(payload).subscribe((response)=> {
        console.log('Post Bunker Plan Comments...', response?.payload);
        this.BunkerPlanCommentList = response?.payload;
        this.BunkerPlanCommentTemp = this.BunkerPlanCommentList;
        this.newComment = "";
      });


    }
  }

  triggerTitleToBind() {
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
    titleEle.click();
  }

  ngOnDestroy() {
    //unsubscribe to avoid memory leakage
    this.subscription.unsubscribe();
  }

  // addNewComment(tabGroup) {
  //   if (this.newComment.trim() != '' || this.newAttachment.length > 0) {
  //     if (tabGroup.selectedIndex == 0) {
  //       this.bunkerPlanData.push(
  //         {
  //           placeholder: 'RT',
  //           name: 'Reshma Thomas',
  //           time: '09:00',
  //           date: '13 Dec 2019',
  //           comment: this.newComment,
  //           attachment: this.newAttachment
  //         }
  //       )
  //       this.filterParticipants(this.bunkerPlanData);
  //     }
  //     else {
  //       this.requests.push(
  //         {
  //           placeholder: 'RT',
  //           name: 'Reshma Thomas',
  //           time: '09:00',
  //           date: '13 Dec 2019',
  //           comment: this.newComment,
  //           attachment: this.newAttachment
  //         }
  //       )
  //       this.filterParticipants(this.requests);
  //     }

  //     this.newComment = "";
  //     this.newAttachment = [];
  //   }

  // }

  // upload(attachment: File[]) {
  //   this.newAttachment.push(attachment[0].name);
  // }
  // removeFile(attachment) {
  //   this.newAttachment = this.newAttachment.filter(file => file != attachment)
  // }
}
