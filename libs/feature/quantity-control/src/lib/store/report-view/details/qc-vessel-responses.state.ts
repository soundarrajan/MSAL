import { IQcVesselResponseDto, IQcVesselSludgeResponseDto } from '../../../services/api/dto/qc-vessel-response.dto';

export class QcVesselResponseByTypeState {
  sludge: QcVesselResponseSludgeCategoriesState = {} as QcVesselResponseCategoriesState;
  bunker: QcVesselResponseCategoriesState = {} as QcVesselResponseCategoriesState;
}

export class QcVesselResponseCategoriesState<T = QcVesselResponseBaseStateItem> {
  categories: Record<number, T> = {};
  activeCategoryId: number;
}

export class QcVesselResponseSludgeCategoriesState extends QcVesselResponseCategoriesState<QcVesselResponseSludgeStateItem> {
}

export class QcVesselResponseBaseStateItem {
  id: number;
  name: string;
  description: string;

  constructor(content: Partial<IQcVesselResponseDto> = {}) {
    this.id = content.category.id;
    this.name = content.category.name;
    this.description = content.description;
  }
}

export class QcVesselResponseSludgeStateItem extends QcVesselResponseBaseStateItem {
  sludge?: number;
  sludgeVerified?: boolean;

  constructor(content: Partial<IQcVesselSludgeResponseDto> = {}) {
    super(content);
    this.sludge = content.sludge;
    this.sludgeVerified = content.sludgeVerified;
  }
}
