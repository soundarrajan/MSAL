import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-comments-popup',
  templateUrl: './supplier-comments-popup.component.html',
  styleUrls: ['./supplier-comments-popup.component.css']
})
export class SupplierCommentsPopupComponent implements OnInit {
  receiver_comments = [
    {
      placeholder: 'PB',
      name: 'Pooja Bhattiprolu',
      date: '15 June 2021',
      time: '09:49',
      comment:
        'LPB not sent- Quantity to order directly  calculated and instructed by Ops. BO calculated around 400MT below quantity validated.'
    },
    {
      placeholder: 'SP',
      name: 'Supplier Portal',
      date: '15 June 2021',
      time: '09:49',
      comment:
        'LPB not sent- Quantity to order directly  calculated and instructed by Ops. BO calculated around 400MT below quantity validated.'
    }
  ];
  sender_comments = [
    {
      placeholder: 'YH',
      name: 'Yusuf Hassan',
      date: '15 June 2021',
      time: '09:49',
      comment:
        'LPB not sent- Quantity to order directly  calculated and instructed by Ops. BO calculated around 400MT below quantity validated.'
    }
  ];
  newInternalComment = '';
  constructor() {}

  ngOnInit(): void {}

  addInternalComment(senderComment) {
    if (senderComment) {
      this.sender_comments.push({
        placeholder: 'YH',
        name: 'Yusuf Hassan',
        date: '15 June 2021',
        time: '09:49',
        comment: senderComment
      });
      this.newInternalComment = '';
    }
  }
}
