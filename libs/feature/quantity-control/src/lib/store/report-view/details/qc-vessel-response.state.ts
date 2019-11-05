export class QcVesselResponseState {
  sludge = new QcVesselResponseSludgeStateModel();
  bunker = new QcVesselResponseBaseStateModel();
}

export class QcVesselResponseBaseStateModel {
  categoryId: number;
  description: string;
}

export class QcVesselResponseSludgeStateModel extends QcVesselResponseBaseStateModel {
  sludge?: number;
  sludgeVerified?: boolean;
}
