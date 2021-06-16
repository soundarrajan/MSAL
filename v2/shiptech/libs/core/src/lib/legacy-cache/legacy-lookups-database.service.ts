import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { nameof } from '../utils/type-definitions';
import { ILegacyLookupVersion } from './legacy-lookup-version.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { fromLegacyLookup } from '@shiptech/core/lookups/utils';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';

type ColorDisplayLookup = IDisplayLookupDto & { code: string };
type ColorDisplayMappingLookup = ColorDisplayLookup & {
  transactionTypeId: number;
  index: number;
};
/**
 * Front-end will only work with this class, and it doesn't care how these tables are actually populated.
 * Note: See {@link LookupsCacheService} to see how data is actually loaded from the api.
 */
@Injectable({
  providedIn: 'root'
})
export class LegacyLookupsDatabase extends Dexie {
  readonly currency: Dexie.Table<IDisplayLookupDto, number>;
  readonly uom: Dexie.Table<IDisplayLookupDto, number>;
  readonly uomVolume: Dexie.Table<IDisplayLookupDto, number>;
  readonly uomMass: Dexie.Table<IDisplayLookupDto, number>;
  readonly status: Dexie.Table<IStatusLookupDto, number>;
  readonly vessel: Dexie.Table<IDisplayLookupDto, number>;
  readonly reconMatch: Dexie.Table<IReconStatusLookupDto, number>;
  readonly documentType: Dexie.Table<IDisplayLookupDto, number>;
  readonly emailStatus: Dexie.Table<IDisplayLookupDto, number>;
  readonly scheduleDashboardLabelConfiguration: Dexie.Table<
    IScheduleDashboardLabelConfigurationDto,
    number
  >;
  readonly transactionType: Dexie.Table<IDisplayLookupDto, number>;
  readonly invoiceCustomStatus: Dexie.Table<IStatusLookupDto, number>;
  readonly paymentStatus: Dexie.Table<IStatusLookupDto, number>;
  readonly invoiceType: Dexie.Table<IStatusLookupDto, number>;
  readonly additionalCost: Dexie.Table<IStatusLookupDto, number>;
  readonly portRemarks: Dexie.Table<IDisplayLookupDto, number>;
  readonly portSeverities: Dexie.Table<IDisplayLookupDto, number>;
  readonly portStatuses: Dexie.Table<IDisplayLookupDto, number>;
  readonly portType: Dexie.Table<IDisplayLookupDto, number>;
  readonly orderedStatus: Dexie.Table<IStatusLookupDto, number>;
  readonly barge: Dexie.Table<IDisplayLookupDto, number>;
  readonly product: Dexie.Table<IDisplayLookupDto, number>;
  readonly supplier: Dexie.Table<IDisplayLookupDto, number>;
  readonly qualityMatch: Dexie.Table<IDisplayLookupDto, number>;
  readonly deliveryFeedback: Dexie.Table<IDisplayLookupDto, number>;
  readonly satisfactionLevel: Dexie.Table<IDisplayLookupDto, number>;
  readonly claimType: Dexie.Table<IDisplayLookupDto, number>;
  readonly quantityCategory: Dexie.Table<IDisplayLookupDto, number>;
  readonly pumpingRateUom: Dexie.Table<IDisplayLookupDto, number>;
  readonly sampleSource: Dexie.Table<IDisplayLookupDto, number>;

  /**
   * For some entities we want to map from the BE dto more than the default IDisplayLookup props, for these cases we use a transformer.
   * Note: In case a transformer is not defined {@link fromLegacyLookup} is used as default mapper
   */
  readonly transforms: Record<string, (dto: any) => any> = {
    [nameof<LegacyLookupsDatabase>('reconMatch')]: (dto: ColorDisplayLookup) =>
      <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('status')]: (dto: ColorDisplayLookup) =>
      <IStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('scheduleDashboardLabelConfiguration')]: (
      dto: ColorDisplayMappingLookup
    ) =>
      <IScheduleDashboardLabelConfigurationDto>{
        ...fromLegacyLookup(dto),
        code: dto.code,
        transactionTypeId: dto.transactionTypeId,
        index: dto.index
      },
    [nameof<LegacyLookupsDatabase>('invoiceCustomStatus')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('paymentStatus')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('invoiceType')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('orderedStatus')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('additionalCost')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('portRemarks')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('portSeverities')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('portStatuses')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code },
    [nameof<LegacyLookupsDatabase>('portType')]: (
      dto: ColorDisplayLookup
    ) => <IReconStatusLookupDto>{ ...fromLegacyLookup(dto), code: dto.code }
  };

  lookupVersions: Dexie.Table<ILegacyLookupVersion, string>;
  dbVersion: number;

  private readonly schema: Record<string, string>;

  constructor() {
    super('Shiptech-UI.Lookups');

    const lookupId = nameof<IDisplayLookupDto>('id');
    const lookupName = nameof<IDisplayLookupDto>('name');
    const lookupIndex = nameof<IScheduleDashboardLabelConfigurationDto>(
      'index'
    );
    const lookupTransactionTypeId = nameof<
      IScheduleDashboardLabelConfigurationDto
    >('transactionTypeId');
    const lookupSchema = `++${lookupId}, ${lookupName}`;
    const lookupDashboardSchema = `++${lookupIndex}, ${lookupTransactionTypeId}, ${lookupId}`;

    // Note: Never change versions, always make changes by incrementing the version, the key of the following object.
    this.schema = {
      [nameof<LegacyLookupsDatabase>('currency')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('uom')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('lookupVersions')]: `++${nameof<
        ILegacyLookupVersion
      >('name')}`,
      [nameof<LegacyLookupsDatabase>('uomVolume')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('uomMass')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('status')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('vessel')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('barge')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('product')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('supplier')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('qualityMatch')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('quantityCategory')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('deliveryFeedback')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('satisfactionLevel')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('pumpingRateUom')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('sampleSource')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('claimType')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('reconMatch')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('documentType')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('emailStatus')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>(
        'scheduleDashboardLabelConfiguration'
      )]: lookupDashboardSchema,
      [nameof<LegacyLookupsDatabase>('transactionType')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('invoiceCustomStatus')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('paymentStatus')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('invoiceType')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('orderedStatus')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('additionalCost')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('portRemarks')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('portSeverities')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('portStatuses')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('portType')]: lookupSchema
    };
  }

  public init(): Observable<any> {
    return fromPromise(this.initInternal());
  }

  public async initInternal(): Promise<any> {
    await this.ensureVersion();

    this.version(1).stores(this.schema);

    Object.keys(this.schema).forEach(tableName => {
      this[tableName] = this.table(tableName);
    });
  }

  async getScheduleDashboardLabelConfiguration(){
    const db = this.table('scheduleDashboardLabelConfiguration');
    let getScheduleDashboardLabelConfigurationList = await db.toArray();
    return getScheduleDashboardLabelConfigurationList;
  }

  async getTable(statusName: string): Promise<number[]> {
    const db = this.table('status');
    console.log(db);
    return await db
      .where('status')
      .equals(statusName)
      .toArray();
  }

  async getBargeTable(){
    const db = this.table('barge');
    let bargeList = await db.toArray();
    return bargeList;
  }


  async getClaimTypeTable(){
    const db = this.table('claimType');
    let claimTypeList = await db.toArray();
    return claimTypeList;
  }

  async getUomTable(){
    const db = this.table('uom');
    let uomList = await db.toArray();
    return uomList;
  }

  async getQuantityCategory(){
    const db = this.table('quantityCategory');
    let quantityCategoryList = await db.toArray();
    return quantityCategoryList;
  }


  async getProductList(){
    const db = this.table('product');
    let productList = await db.toArray();
    return productList;
  }

  async getPhysicalSupplierList(){
    const db = this.table('supplier');
    let physicalSupplierList = await db.toArray();
    return physicalSupplierList;
  }

  async getQualityMatchList(){
    const db = this.table('qualityMatch');
    let qualityMatchList = await db.toArray();
    return qualityMatchList;
  }


  async getDeliveryFeedbackList(){
    const db = this.table('deliveryFeedback');
    let deliveryFeedbackList = await db.toArray();
    return deliveryFeedbackList;
  }

  async getSatisfactionLevelList(){
    const db = this.table('satisfactionLevel');
    let satisfactionLevelList = await db.toArray();
    return satisfactionLevelList;
  }

  async getUomMass() {
    const db = this.table('uomMass');
    let uomMass = await db.toArray();
    return uomMass;
  }

  async getUomVolume() {
    const db = this.table('uomVolume');
    let uomVolume = await db.toArray();
    return uomVolume;
  }

  async getPumpingRateUom() {
    const db = this.table('pumpingRateUom');
    let pumpingRateUom = await db.toArray();
    return pumpingRateUom;
  }

  async getSampleSource() {
    const db = this.table('sampleSource');
    let sampleSource = await db.toArray();
    return sampleSource;
  }

  async getInvoiceCustomStatus(){
    const db = this.table('invoiceCustomStatus');
    let InvoiceCustomStatus = await db.toArray();
    return InvoiceCustomStatus;
  }
  async getPaymentStatus(){
    const db = this.table('paymentStatus');
    let PaymentStatus = await db.toArray();
    return PaymentStatus;
  }
  async getsInvoiceType(){
    const db = this.table('invoiceType');
    let InvoiceType = await db.toArray();
    return InvoiceType;
  }
  async getAdditionalCost(){
    const db = this.table('additionalCost');
    let AdditionalCost = await db.toArray();
    return AdditionalCost;
  }
  async getPortRemarks(){
    const db = this.table('portRemarks');
    let PortRemarks = await db.toArray();
    return PortRemarks;
  }
  async getPortSeverities(){
    const db = this.table('portSeverities');
    let portSeverities = await db.toArray();
    return portSeverities;
  }
  async getPortStatuses(){
    const db = this.table('portStatuses');
    let PortStatuses = await db.toArray();
    return PortStatuses;
  }
  async getPortType(){
    const db = this.table('portType');
    let PortType = await db.toArray();
    return PortType;
  }
  async getCurrencyTable(){
    const db = this.table('currency');
    let currencyList = await db.toArray();
    return currencyList;
  }
  private async ensureVersion(): Promise<any> {
    // TODO: add proper logging
    // Note: We're doing a different db versioning strategy. Whenever a table is added or deleted the version will Change automatically
    // Note: When the version changes, we should delete the database and start clean. Please note that other changes besides adding,
    // Note: deleting, renaming a table are not supported yet, but can be easily accomplished by passing a one time random array of strings.
    const dbVersionKey = `${this.name}.Version`;
    const currentVersion = localStorage.getItem(dbVersionKey);
    const newVersion = this.calculateDbVersion(Object.keys(this.schema));

    if (currentVersion !== newVersion.toString()) {
      await this.delete();
    }

    // Note: In case the version changes (new app version loaded in another tab) we should show a popup that the user should close the tab
    const watchVersionChangesCallBack = this.watchVersionChanges.bind(this);
    window.removeEventListener('storage', watchVersionChangesCallBack);

    localStorage.setItem(dbVersionKey, newVersion.toString());

    window.addEventListener('storage', watchVersionChangesCallBack);

    this.dbVersion = newVersion;
  }

  private watchVersionChanges(): void {
    // TODO: Show popup that the database version has changed and the user should try to save work and close the tab.
    // TODO: Detect if there were version changes
    // TODO: Implement proper logging here
    // console.log(`IndexedDb ${this.name} version has been changed. Please reload tab`);
  }

  // noinspection JSMethodCanBeStatic
  private calculateDbVersion(tables: string[]): number {
    const str = tables.sort().join();

    let hash = 0,
      i,
      chr;

    if (str.length === 0) {
      return hash;
    }

    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      // tslint:disable-next-line:no-bitwise
      // eslint-disable-next-line no-bitwise
      hash = (hash << 5) - hash + chr;
      // tslint:disable-next-line:no-bitwise
      // eslint-disable-next-line no-bitwise
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
