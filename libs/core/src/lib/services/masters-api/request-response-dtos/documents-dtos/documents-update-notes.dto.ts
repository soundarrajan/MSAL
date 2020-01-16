export interface IDocumentsUpdateNotesRequest {
  id: number;
  notes: string;
}

export interface IDocumentsUpdateNotesResponse {
  matchedCount: number;
}
