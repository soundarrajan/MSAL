import { Component, Input, OnInit } from '@angular/core';
import { LocalService } from '../../../services/local-service.service';
@Component({
  selector: 'app-details-table-header',
  templateUrl: './details-table-header.component.html',
  styleUrls: ['./details-table-header.component.scss']
})
export class DetailsTableHeaderComponent implements OnInit {
  
  @Input() title: string;
  constructor(public localService: LocalService) { }

  ngOnInit(): void {
  }

}
