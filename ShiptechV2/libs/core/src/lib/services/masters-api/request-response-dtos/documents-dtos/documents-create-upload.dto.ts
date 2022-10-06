import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface IDocumentsCreateUploadDetailsDto {
  name: string;
  documentType: ILookupDto;
  size: number;
  fileType: string;
  transactionType: ILookupDto;
  referenceNo: number;
}

export interface IDocumentsCreateUploadDto {
  Payload: IDocumentsCreateUploadDetailsDto;
}

export interface IDocumentsCreateUploadRequest extends FormData {}

export interface IDocumentsCreateUploadResponse {}
