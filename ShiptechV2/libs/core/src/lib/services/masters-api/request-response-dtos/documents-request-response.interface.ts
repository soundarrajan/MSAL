import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";

export interface IDocumentsInterface {
  name: string;
  documentType: IDisplayLookupDto;
  size: number;
  fileType: string;
  transactionType: IDisplayLookupDto;
  fileId: number;
  uploadedBy: IDisplayLookupDto;
  uploadedOn: string;
  notes: string;
  isVerified: boolean;
  referenceNo: string;
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedByUser: IDisplayLookupDto;
  lastModifiedOn: string;
  id: number;
  isDeleted: boolean;
}

export interface IDocumentsInterfaceExtended extends IDocumentsInterface {
  verifiedBy: string;
  verifiedOn: string;
  inclusionInMail: string;
  totalCount: number;
  isIncludedInMail: string;
  content: string;
  modulePathUrl: string;
  clientIpAddress: string;
  userAction: string;
}
