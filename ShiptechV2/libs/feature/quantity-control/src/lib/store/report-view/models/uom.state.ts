import { IUomLookupDto } from '@shiptech/core/services/lookups-api/mock-data/uoms.mock';

export interface IPsUomState extends IUomLookupDto {
  conversionFactor: number;
}

export class QcUomStateModel {
  id: number;
  name: string;
  isBaseUom: boolean;
  // Note: Used for quantity transformation
  conversionRate: number;
  // Note: Used for cost transformation
  conversionFactor: number;

  constructor(uom: Partial<IPsUomState> = {}) {
    // Note: avoiding setting wrong type to state, tenant settings returns strings
    this.id = uom.id;
    this.name = uom.name;
    this.conversionRate = uom.conversionRate || 1;
    this.isBaseUom = uom.isBaseUom || true;

    // const validConversionRate = uom.conversionRate;
    // const roundedConversionRate = new Decimal(1).div(new Decimal(validConversionRate)).toNumber();

    // this.conversionFactor = uom.conversionRate ? roundedConversionRate : 1;
  }
}

export interface IQcUomState extends QcUomStateModel {
}
