
import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef, Input, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { AgGridDatetimePickerToggleComponent } from 'libs/feature/spot-negotiation/src/lib/core/ag-grid/ag-grid-datetimePicker-Toggle';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { SetLocationsRows } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';

@Component({
  selector: 'app-spotnego-otherdetails2',
  templateUrl: './spotnego-otherdetails2.component.html',
  styleUrls: ['./spotnego-otherdetails2.component.css']
})
export class SpotnegoOtherdetails2Component implements OnInit {
  uomList: any;
  switchTheme; //false-Light Theme, true- Dark Theme
  SupplyQuantityUoms: any;
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;
  isSupplyDeliveryDateInvalid: boolean;
  public selectedFormulaTab;
  public initialized;
  otherDetailsItems: any = [];
  staticLists: any;
  productList: any = [];
  selectedProductList: any;
  productIndex: any = 0;
  locationsRows: any;
  locations: any;
  dateFormat;
  SupplyDeliveryDate: '';
  dateFormat_rel_SupplyDate: any;
  autocompleteProducts: knownMastersAutocomplete;
  private _autocompleteType: any;
  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;
  ngOnInit() {

  }

  constructor(
    public dialogRef: MatDialogRef<SpotnegoOtherdetails2Component>,
    private store: Store,
    protected changeDetectorRef: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    private toastr: ToastrService,
    public tenantFormat: TenantFormattingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedProductList = data;
    this.autocompleteProducts = knownMastersAutocomplete.products;
    this.store.subscribe(({ spotNegotiation }) => {
      this.staticLists = spotNegotiation.staticLists;
    });
    this.uomList = this.setListFromStaticLists('Uom');
    this.productList = this.setListFromStaticLists('Product');
    this.getOtherDetailsLoad();
  }
  closeDialog() {
    this.dialogRef.close(false);
  }
  displayFn(product): string {
    return product && product.name ? product.name : '';
  }

  onChange($event, field) {
    if ($event.value) {
      const beValue = `${moment($event.value).format(
        'YYYY-MM-DDTHH:mm:ss'
      )}+00:00`;
      if (field == 'SupplyDeliveryDate') {
        this.isSupplyDeliveryDateInvalid = false;
      }
    } else {
      if (field == 'SupplyDeliveryDate') {
        this.isSupplyDeliveryDateInvalid = true;
      }
      this.toastr.error('Please enter the correct format');
    }
  }

  formatDateForBe(value) {
    if (value) {
      let beValue = `${moment.utc(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
      return `${moment.utc(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
    } else {
      return null;
    }
  }
  format(value: Date, displayFormat: string): string {
    if (value === null || value === undefined) return '';
    let currentFormat = displayFormat;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
      hasDayOfWeek = true;
      currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    const elem = moment(value, 'YYYY-MM-DDTHH:mm:ss');
    let formattedDate = moment(elem).format(currentFormat);
    if (hasDayOfWeek) {
      formattedDate = `${moment(value).format('ddd')} ${formattedDate}`;
    }
    return formattedDate;
  }
  //popup initial load data..
  getOtherDetailsLoad() {
    this.store.subscribe(({ spotNegotiation }) => {
      this.locationsRows = spotNegotiation.locationsRows;
      this.staticLists = spotNegotiation.staticLists;
      this.locations = spotNegotiation.locations;
    });
    var otherDetailsPayload = [];
    this.locations.forEach(ele => {
      this.locationsRows.forEach(element1 => {
        if (element1.requestOffers != undefined) {
          element1.requestOffers.forEach(reqOff => {
            if (reqOff.requestProductId == this.selectedProductList.RequestProductId && element1.id == this.selectedProductList.RequestLocationSellerId && ele.locationId == element1.locationId) {
              let etaDate;
              if (reqOff.supplyDeliveryDate == null) {
                etaDate = ele.eta;
              } else {
                etaDate = reqOff.supplyDeliveryDate;
              }
              otherDetailsPayload = this.ConstructOtherDetailsPayload(reqOff, etaDate);
              this.otherDetailsItems.push(otherDetailsPayload[0]);
            }
          });
        }
      });
    });
  }
  ///product lookup filter
  filterProductList() {
    if (this.otherDetailsItems[this.productIndex].product) {
      const filterValue = this.otherDetailsItems[
        this.productIndex
      ].product.name
        ? this.otherDetailsItems[
          this.productIndex
        ].product.name.toLowerCase()
        : this.otherDetailsItems[this.productIndex].product.toLowerCase();
      if (this.productList) {
        return this.productList
          .filter(
            option => option.name.toLowerCase().indexOf(filterValue.trim()) === 0 //
          )
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  //Construct UI Value's to bind the popup grid
  ConstructOtherDetailsPayload(requestOffers, etaDate) {
    let QtyUomId;
    if (requestOffers.supplyQuantityUomId == null) {
      QtyUomId = 5;
    } else {
      QtyUomId = requestOffers.supplyQuantityUomId;
    }
    return [

      {
        OfferId: requestOffers.offerId,
        RequestOfferId: requestOffers.id,
        SupplyQuantity: this.tenantFormat.quantity(requestOffers.supplyQuantity) ? this.tenantFormat.quantity(requestOffers.supplyQuantity) : '',
        SupplyDeliveryDate: etaDate ? moment(etaDate).format(this.dateFormat_rel_SupplyDate) : '',
        product: {
          id: requestOffers.quotedProductId,
          name: this.productList.find(x => x.id == requestOffers.quotedProductId).name,
        },
        uom: {
          id: requestOffers.supplyQuantityUomId ? requestOffers.supplyQuantityUomId : 5,
          name: this.uomList.find(x => x.id == QtyUomId).name,  //Default Uom is Id:5
        }
      }]
  }
  // Only Number
  keyPressNumber(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (inp == '.' || inp == ',' || inp == '-') {
      return true;
    }
    if (/^[-,+]*\d{1,6}(,\d{3})*(\.\d*)?$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  //decode
  htmlDecode(str: any): any {
    var decode = function (str) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
      });
    };

    return decode(_.unescape(str));
  }
  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.products:
        return knowMastersAutocompleteHeaderName.products;
      default:
        return knowMastersAutocompleteHeaderName.products;
    }
  }
  selectorProductSelectionChange(selection: IDisplayLookupDto): void {
    if (selection === null || selection === undefined) {
      this.otherDetailsItems[this.productIndex] = '';
    } else {
      const obj = {
        QuotedProductId: selection.id,
        name: selection.name
      };
      this.otherDetailsItems[this.productIndex] = obj;
      this.changeDetectorRef.detectChanges();
    }
  }
  /// lists class separate
  setListFromStaticLists(name) {
    const findList = _.find(this.staticLists, function (object) {
      return object.name == name;
    });
    if (findList != -1) {
      return findList?.items;
    }
  }
  /// uom list's compare
  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
  /// save request Change
  saveOtherDetails() {
    if (this.otherDetailsItems[this.productIndex].product == undefined || this.otherDetailsItems[this.productIndex].SupplyQuantity == undefined) {
      this.toastr.warning('Fill the quotedProduct & supplyQuantity are required..');
      return;
    }
    let isAllow = false;
    /// If the user is trying to capture product same as that in the request under same location
    this.locations.forEach(ele => {
      if (ele.requestProducts != undefined) {
        ele.requestProducts.forEach(reqOff => {
          if (reqOff.id == this.selectedProductList.RequestProductId && ele.locationId == this.selectedProductList.LocationId) {
            if (reqOff.productId == this.otherDetailsItems[this.productIndex].product.id) {
              isAllow = true;
            }
          }
        });
      }
    });
    if (isAllow) {
      this.toastr.warning('Product already exists in the negotiation');
      return;
    }
    /// end
    /// payload construct
    let otherDetails_data = {
      RequestOfferId: this.otherDetailsItems[this.productIndex].RequestOfferId,
      OfferId: this.otherDetailsItems[this.productIndex].OfferId,
      QuotedProductId: this.otherDetailsItems[this.productIndex].product.id,
      SupplyQuantity: this.otherDetailsItems[this.productIndex].SupplyQuantity,
      SupplyQuantityUomId: this.otherDetailsItems[this.productIndex].uom.id,
      SupplyDeliveryDate: this.otherDetailsItems[this.productIndex].SupplyDeliveryDate ? moment(this.otherDetailsItems[this.productIndex].SupplyDeliveryDate).format(this.dateFormat_rel_SupplyDate) : ''
    };
    const response = this.spotNegotiationService.OtherDetails(otherDetails_data);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success('Saved successfully..');
        const futureLocationsRows = this.getLocationRowsWithOtherDetails(
          JSON.parse(JSON.stringify(this.locationsRows)),
          otherDetails_data
        );
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }
  /// update store loctionrows 
  getLocationRowsWithOtherDetails(rowdata, requestChangeData) {
    rowdata.forEach((element1, key) => {
      if (element1.requestOffers != undefined) {
        element1.requestOffers.forEach((reqOff, reqkey) => {
          if (reqOff.requestProductId == this.selectedProductList.RequestProductId && element1.id == this.selectedProductList.RequestLocationSellerId) {
            reqOff.supplyQuantity = requestChangeData.SupplyQuantity;
            reqOff.supplyDeliveryDate = requestChangeData.SupplyDeliveryDate;
            reqOff.supplyQuantityUomId = requestChangeData.SupplyQuantityUomId;
            reqOff.quotedProductId = requestChangeData.QuotedProductId;
          }
        });
      }
    });
    return rowdata;
  }

  tabledata = [{ seller: 'Total Marine Fuel', port: 'Amstredam', contractname: 'Cambodia Contarct 2021', contractproduct: 'DMA 1.5%', formula: 'Cambodia Con', schedule: 'Average of 5 Days', contractqty: '10,000,.00', liftedqty: '898.00 MT', availableqty: '96,602.00 MT', price: '$500.00' },
  { seller: 'Total Marine Fuel', port: 'Amstredam', contractname: 'Amstredam Contarct 2021', contractproduct: 'DMA 1.5%', formula: 'Cambodia Con', schedule: 'Average of 5 Days', contractqty: '10,000,.00', liftedqty: '898.00 MT', availableqty: '96,602.00 MT', price: '$500.00' }];



}

