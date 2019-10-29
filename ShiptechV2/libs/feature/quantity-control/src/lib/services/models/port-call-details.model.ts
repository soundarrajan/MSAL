import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { IPortCallDetailsDto, IPortCallProductDto, IPortCallUoms } from '../api/dto/port-call.dto';

export class ReportItemViewModel {
  portCallId: string;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IPortCallProductDto[];
  uoms: IPortCallUoms;

  constructor(content: IPortCallDetailsDto) {
    Object.assign(this, content);
  }
}
