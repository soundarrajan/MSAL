export interface SellerViewModel {
  counterpartyId: number;
  counterpartyName: string;
  counterpartyAddress: string;
  counterpartyContacts: SellerContactModel[];
}

export interface SellerContactModel{
  id: number;
  name: string;
  contactType: string;
  contactTypeId: number;
  email: string;
  address: string;
  zipcode: string;
  city: string;
  country: any;
  mobile: string;
  phone: string;
  fax: string;
  im: string;
  isEditable: boolean;
  counterpartyId: number;
}
