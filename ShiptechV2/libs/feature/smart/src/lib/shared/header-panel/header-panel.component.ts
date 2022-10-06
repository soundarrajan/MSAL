import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent implements OnInit {

  @Output() toggleMenu = new EventEmitter();
  @Output() toggleHelp = new EventEmitter();
  @Output() toggleNotif = new EventEmitter();
  @Output() toggleLogout = new EventEmitter();
  @Input('showMenu') showMenuFlag;
  @Input('showHelp') showHelpFlag;
  @Input('showNotifications') showNotifFlag;
  @Input('showLogout') showLogout;
  public nameInitials = "YH";
  public baseUrl : string;
  constructor() { 
    this.baseUrl = new URL(window.location.href).origin;
  }

  ngOnInit() {
  }

  toggleMenuFlag() {
    this.showMenuFlag = !this.showMenuFlag;
    this.toggleMenu.emit(this.showMenuFlag);
  }

  toggleHelpFlag() {
    this.showHelpFlag = !this.showHelpFlag;
    this.toggleHelp.emit(this.showHelpFlag);
  }

  toggleNotifFlag() {
    this.showNotifFlag = !this.showNotifFlag;
    this.toggleNotif.emit(this.showNotifFlag);
  }

  toggleLogoutFlag() {
    this.showLogout = !this.showLogout;
    this.toggleLogout.emit(this.showLogout);
  }

}
