import { ILookupDto } from './lookup-dto.interface';

export class LookupModel<TId = number, TName = string>
  implements ILookupDto<TId, TName> {
  constructor(public id: TId, public name: TName) {}
}
