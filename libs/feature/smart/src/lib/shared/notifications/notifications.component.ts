import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @ViewChildren(MatExpansionPanel) matExpansionPanelQueryList: QueryList<MatExpansionPanel>;
  public dialogRef: MatDialogRef<ConfirmationPopupComponent>;
  public alerts;
  public count = 4;
  public active: boolean = true;
  public showSettingNotification: boolean;
  public customSelect = new FormControl();
  public openId = "";
  public isOpen: boolean;
  public enableUpdate: boolean;
  public showhideDeleteRule: boolean;
  public showMenu: boolean;
  public items;
  public newAlert;

  newPanelCollapsedHeight: string = '72px';
  newPanelExpandedHeight: string = '72px';
  panelCollapsedHeight: string = '51px';
  panelExpandedHeight: string = '70px';
  constructor(public dialog: MatDialog) { }

  ngOnInit() {

    this.newAlert =       {
      active: false,
      name: "",
      type: "",
      triggerRule: [
        {
          rule: [],
          alert: "",
          vesselFlag: false,
          email: false,
          notification: false
        }
      ]
    },
    this.items = [
      {
        id: 1,
        active: true,
        name: "Port Remarks",
        type: "port",
        triggerRule: [
          {
            rule: [
              {
                rule: "Bunker plan delay",
                condition: "greater than",
                value: "24 hours"
              }
            ],
            alert: "red",
            vesselFlag: false,
            email: true,
            notification: true
          },
          {
            rule: [
              {
                rule: "Bunker plan delay",
                condition: "greater than",
                value: "24 hours"
              }
            ],
            alert: "yellow",
            vesselFlag: false,
            email: true,
            notification: true
          },
        ]
      },
      {
        id: 2,
        active: false,
        name: "No Request Alert",
        type: "vessel",
        triggerRule: [{
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "yellow",
          vesselFlag: false,
          email: true,
          notification: true
        },

        ]
      },
      {
        id: 3,
        active: true,
        name: "Redelivery Alert",
        type: "vessel",
        triggerRule: [{
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "yellow",
          vesselFlag: false,
          email: true,
          notification: true
        },

        ]
      },
      {
        id: 4,
        active: false,
        name: "Unmanageable Alert",
        type: "vessel",
        triggerRule: [{
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "red",
          vesselFlag: false,
          email: false,
          notification: true
        },
        {
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "red",
          vesselFlag: false,
          email: false,
          notification: true
        }
        ],
      },
      {
        id: 5,
        active: true,
        name: "No Order Alert",
        type: "vessel",
        triggerRule: [{
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "yellow",
          vesselFlag: false,
          email: true,
          notification: true
        },

        ]
      },
      {
        id: 6,
        active: true,
        name: "Error Quantity Alert",
        type: "vessel",
        triggerRule: [{
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "yellow",
          vesselFlag: false,
          email: true,
          notification: true
        },

        ]
      },
      {
        id: 7,
        active: true,
        name: "Bunker Plan Delay Alert",
        type: "vessel",
                triggerRule: [{
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "yellow",
          vesselFlag: false,
          email: true,
          notification: true
        },

        ]
      },
      {
        id: 8,
        active: false,
        name: "Stock Alert",
        type: "vessel",
        triggerRule: [{
          rule: [
            {
              rule: "Bunker plan delay",
              condition: "greater than",
              value: "24 hours"
            },
            {
              rule: "Operating Region",
              condition: "in",
              value: "Europe"
            }
          ],
          alert: "yellow",
          vesselFlag: false,
          email: true,
          notification: true
        },

        ]
      }

    ]
    this.alerts = [
      {
        name: "Bunker Plan Delay",
        date: "03 March 2020 09:00",
        vessel: "Vessel GUATEMALA",
        description: "Bunker plan has been not updated for 48 hours.",
        severity: "red"
      },
      {
        name: "Redelivery Date Nearing",
        date: "03 March 2020 22:00",
        vessel: "Vessel MCC Kyoto",
        description: "Redelivery date is within 15 days.",
        severity: "amber"
      },
      {
        name: "Price Drop",
        date: "03 March 2020 11:00",
        vessel: "Port of Rotterdam",
        description: "VLSFO prices has been dropped by $8 in 2weeks.",
        severity: "green"
      },
      {
        name: "No Order Alert",
        date: "03 March 2020 09:00",
        vessel: "Vessel Manila Maersk",
        description: "No orders have been placed for past 12 days.",
        severity: "amber"
      }
    ]
  }

  hello() {
    console.log("Hi")
  }
  panelOpened(id) {
    this.isOpen = true;
    this.openId = id;
  }

  panelClosed() {
    this.isOpen = false;
    this.showMenu = false;
    this.showhideDeleteRule = false;
  }

  clearNotifications() {
    this.active = false;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      panelClass: ['confirmation-popup']

    });

    dialogRef.afterClosed().subscribe(result => {
      this.active = true;
      if (result) {
        this.alerts = [];
        this.count = 0;
      }
    });


  }
  selectionChanged(value) {
    this.enableUpdate = true;
  }
}
