export interface SpnegoAddCounterpartyModel {
    id: number;
    name: string;
    requestGroupId: number;
    requestLocationId?: number;
    locationId?: number;
    sellerCounterpartyId?: number;
    sellerCounterpartyName: string;
    counterpartytypeId?: number;
    counterpartyTypeName: string;
    prefferedProductIds: string;
    isDeleted: boolean;
    isSelected: boolean;
    sellerComments: string;
    mail: string;
    senRating: string;
    genPrice: string;
    genRating: string;
    portRating: string;
    portPrice: string
  }