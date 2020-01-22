import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";

export enum KnownTransactionTypes {
  QuantityControlReport = 'QuantityControlReport'
}

export const MockTransactionTypeLookupEnumMap: Record<KnownTransactionTypes, IDisplayLookupDto> = {
  [KnownTransactionTypes.QuantityControlReport]: { id: 1, name: KnownTransactionTypes.QuantityControlReport, displayName: KnownTransactionTypes.QuantityControlReport},
};
