import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IQcEventLogListItemDto {
  id: number;
  eventDetails: string;
  createdBy: IDisplayLookupDto;
  createdOn: Date | string;
}

export interface IQcEventLogAddedListItemDto
  extends Omit<IQcEventLogListItemDto, 'id'> {}

export interface IQcEventLogDeletedListItemDto {
  id: number;
  isDeleted: boolean;
}
