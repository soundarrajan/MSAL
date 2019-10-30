export class QcVesselResponseState {
  sludge = new QcVesselResponseSludgeStateModel();
  bunker = new QcVesselResponseBaseStateModel();
}

export class QcVesselResponseBaseStateModel {
  categoryId: number;
  categoryName: string;
  description: string;
}

export class QcVesselResponseSludgeStateModel extends QcVesselResponseBaseStateModel {
  sludge?: number;
  sludgeVerified?: boolean;
}
