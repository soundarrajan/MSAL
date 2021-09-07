import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spot-negotiation-new-comments',
  templateUrl: './spot-negotiation-new-comments.component.html',
  styleUrls: ['./spot-negotiation-new-comments.component.css']
})
export class SpotNegotiationNewCommentsComponent implements OnInit {
  @ViewChild('comment1') commentBox1: ElementRef;
  @ViewChild('comment2') commentBox2: ElementRef;
  @ViewChild('comment3') commentBox3: ElementRef;
  @ViewChild('comment4') commentBox4: ElementRef;

  currentRequestSmallInfo: Observable<any> = null;
  editableComments1: boolean = true;
  editableComments2: boolean = true;
  editableComments4: boolean = true;
  showEditIcon: boolean = false;

  notYet: string = 'Api not ready yet';

  constructor(private store: Store, public changeDetector: ChangeDetectorRef) {
    this.store.subscribe(({ spotNegotiation }) => {
      if (spotNegotiation.currentRequestSmallInfo) {
        this.currentRequestSmallInfo = spotNegotiation.currentRequestSmallInfo;
      }
    });
  }

  ngOnInit(): void {}

  editComments1(): void {
    this.editableComments1 = false;
    this.commentBox1.nativeElement.focus();
  }

  editComments2(): void {
    this.editableComments2 = false;
    this.commentBox2.nativeElement.focus();
  }

  editComments3(): void {
    this.commentBox3.nativeElement.focus();
  }

  editComments4(): void {
    this.editableComments4 = false;
    this.commentBox4.nativeElement.focus();
  }
}
