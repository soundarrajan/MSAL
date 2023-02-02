import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { LocalService } from '../../../services/local-service.service';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { SearchAllCounterpartiesComponent } from 'libs/feature/spot-negotiation/src/lib/views/main/details/components/spot-negotiation-popups/search-all-counterparties/search-all-counterparties.component';
import { ToastrService } from 'ngx-toastr';
import { SetTenantConfigurations } from '../../../store/actions/request-group-actions';
@Component({
  selector: 'app-contract-negotiation-details',
  templateUrl: './contract-negotiation-details.component.html',
  styleUrls: ['./contract-negotiation-details.component.scss']
})
export class ContractNegotiationDetailsComponent implements OnInit {
  today = new FormControl(new Date());
  @Input() requests;
  @Input() rfqSent;
  @Input() noQuote;
  @Input() selectedRequestIndex;
  @ViewChild('menuTrigger') trigger;
  public searchValue : string = '';

  public portIndex: number = 0;
  public fullHeaderWidth: any;
  public locationId :number;
  statusList = [
    { key: 'AwaitingApproval', name: 'Awaiting Approval', className: 'await', count: 0 },
    { key: 'Approved', name: 'Approved', className: 'approved', count: 0 },
    { key: 'Rejected', name: 'Rejected', className: 'rejected', count: 0 },
    { key: 'Contracted', name: 'Contracted', className: 'contracted', count: 0 }
  ];
  rowData = [];
  rowDataBackup = [];
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList;
  chipSelected = "1";
  pinnedColumnWidth: any;

  ngOnInit(): void {    
    this.getTenantConfugurations();   
  }

  ngOnChanges() {
    // this.localService.setContractNegoData(this.requests[this.selectedRequestIndex]?.locations);

    this.rowData = this.requests[this.selectedRequestIndex]?.locations;
    this.rowDataBackup = this.requests[this.selectedRequestIndex]?.locations;
  }
  ngAfterViewInit() {

  }

  constructor(
    private localService: LocalService,
    public contractService: ContractNegotiationService,
    private route: ActivatedRoute,
    public store : Store,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private toastr: ToastrService
    ) {
  }

  getTenantConfugurations(): void {
    const response = this.contractService.getTenantConfiguration();
    response.subscribe((res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res?.error) {
        alert('Handle Error');
        return;
      } else {
        // Populate Store
        this.store.dispatch(
          new SetTenantConfigurations(res.tenantConfiguration)
        );
      }
    });
  }
  
  private _filter(data, value: string): [] {
    const filterValue = value.toLowerCase();
    data.forEach((item) => {
      item.data = item.data.filter(option => option.name.toLowerCase().includes(filterValue));
    })
    return data;
  }
  
  filterCounterParty(filterValuelue : string){
    this.localService.filterCounterParty(filterValuelue).subscribe(res =>{
      this.counterpartyList = res;
      this.changeDetector.detectChanges();
    });
  }
  constructUpdateCounterparties(source){
    if(Object.keys(this.contractService.selectedCounterparty).length > 0){    
      this.contractService.newlyAddedCounterparty = [];
    this.contractService.constructUpdateCounterparties(source)?.subscribe(res => {
      this.contractService.getContractRequestDetails(this.route.snapshot.params.requestId)
      .subscribe(response => {
        if(response.status != 'Open'){
          this.localService.selectNewlyAddedCounterParty(response,this.contractService.newlyAddedCounterparty)
          .then((selectedResponse)=>{
            this.localService.contractRequestData(selectedResponse);
          });
        }else{
          this.localService.contractRequestData(response);
        }
      });
    });
    }else{
      this.toastr.error("Please Select atleast One Counterparty");
    }
  }

  searchCounterpartyLookUp(){
    this.trigger.closeMenu();
    this.contractService.selectedCounterparty = {};
    const dialogRef = this.dialog.open(SearchAllCounterpartiesComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
      data: {
        AddCounterpartiesAcrossLocations: true,
        source : 'contract-negotation'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res.data){
        res.data.forEach(el => {
          this.contractService.selectedCounterparty[el.id] = el;
        });
        this.constructUpdateCounterparties(this.locationId);
      }
    });
  }

  setFocus(locationId) {
    this.locationId = locationId;
    this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {      
    this.counterpartyList = this.localService.limitCounterPartyList(
      JSON.parse(JSON.stringify(state['spotNegotiation'].counterpartyList))
      );
  });

  this.searchValue = '';
  this.contractService.selectedCounterparty = {};
  document.getElementById("inputBox3").focus()
  }

  onSearchCounterparty(input) {
    this.rowData = this._filter(this.rowDataBackup, input);
  }
  onClearSearchCounterparty() {
    this.rowData = this.rowDataBackup;
  }
  togglePanel(flag,val) {
    let overlay = document.querySelector('.cdk-overlay-container');

    if (flag) {
      overlay.classList.add('panel-overlay-class');
    }
    else {
      overlay.classList.remove('panel-overlay-class');

    }
    this.localService.updatePeriodicity(val);
  }

  getPinnedColumnWidth(width){
    this.pinnedColumnWidth = {
      width: width+'px'
    }
  }

  onChipSelection(chipVal){
    this.chipSelected = chipVal;
    this.localService.updateChipSelected(chipVal);
  }

  getNodeData(data){
    for(let item of this.statusList){
      if(item.key === data.key && data.key!== null){
        item.count = data.allChildrenCount;
      }
    }
  }

  scrollPortToggle(index){
    //alert(index);
    this.portIndex=index;
  }

  panelClosed(){
    //alert("");
    this.portIndex=-1;
  }
}

