export interface IDocumentsDownloadRequest {
  Payload: IDocumentsDownloadDto;
}

export interface IDocumentsDownloadZipRequest {
  Payload: IDocumentsDownloadDto[];
}

export interface IDocumentsDownloadDto{
  Id: number;
 
}