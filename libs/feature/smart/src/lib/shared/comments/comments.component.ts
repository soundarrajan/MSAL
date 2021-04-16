import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  public expanded: boolean = false;
  public loginUser = "YH";
  public participants = [];
  public newComment = "";
  public newAttachment = [];
  public bunkerPlanData = [
    {
      placeholder: 'AJ',
      name: 'Alexander James',
      time: '09:00',
      date: '13 Dec 2019',
      comment: 'Status remains the same. See the link to get further details.',
      attachment: ['Screenshot1_2018-06-21', 'Screenshot2_2018-06-21']
    },
    {
      placeholder: 'PB',
      name: 'Pooja Bhattiprolu',
      time: '09:00',
      date: '13 Dec 2019',
      comment: 'Catania will be closed from tomorrow.',
      attachment: []
    },
    {
      placeholder: 'YH',
      name: 'Yusuf Hassan',
      time: '09:00',
      date: '13 Dec 2019',
      comment: 'Status remains the same. See the link to get further details.',
      attachment: []
    }
  ]
  public requests = [
    {
      placeholder: 'AJ',
      name: 'Alexander James',
      time: '09:00',
      date: '13 Dec 2019',
      comment: 'Status remains the same. See the link to get further details.',
      attachment: []
    },
    {
      placeholder: 'GS',
      name: 'Gokul Simsons',
      time: '09:00',
      date: '13 Dec 2019',
      comment: 'Status remains the same. See the link to get further details so as to decide on future changes to be incorporated into the design system.Link given below.',
      attachment: []
    },
  ]
  constructor() { }

  ngOnInit() {
    this.participants = this.bunkerPlanData
  }

  onTabChange(event) {
    let data;
    if (event.index == 0)
      data = this.bunkerPlanData;
    else
      data = this.requests;

    this.filterParticipants(data);

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
  addNewComment(tabGroup) {
    if (this.newComment.trim() != '' || this.newAttachment.length > 0) {
      if (tabGroup.selectedIndex == 0) {
        this.bunkerPlanData.push(
          {
            placeholder: 'RT',
            name: 'Reshma Thomas',
            time: '09:00',
            date: '13 Dec 2019',
            comment: this.newComment,
            attachment: this.newAttachment
          }
        )
        this.filterParticipants(this.bunkerPlanData);
      }
      else {
        this.requests.push(
          {
            placeholder: 'RT',
            name: 'Reshma Thomas',
            time: '09:00',
            date: '13 Dec 2019',
            comment: this.newComment,
            attachment: this.newAttachment
          }
        )
        this.filterParticipants(this.requests);
      }

      this.newComment = "";
      this.newAttachment = [];
    }

  }

  upload(attachment: File[]) {
    this.newAttachment.push(attachment[0].name);
  }
  removeFile(attachment) {
    this.newAttachment = this.newAttachment.filter(file => file != attachment)
  }
}
