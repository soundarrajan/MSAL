import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  IQcVesselBunkerResponseDto,
  IQcVesselResponsesDto,
  IQcVesselSludgeResponseDto
} from '../../../services/api/dto/qc-vessel-response.dto';
import _ from 'lodash';

export class QcVesselResponseSludgeStateModel {
  activeCategory: IDisplayLookupDto;
  description: string;
  sludge?: number;
  tolerance?: number;
  sludgeVerified?: boolean;

  constructor(sludge?: IQcVesselSludgeResponseDto) {
    this.activeCategory = sludge?.activeCategory;
    this.description = sludge?.description;
    this.sludge = sludge?.sludge;
    this.tolerance = sludge?.tolerance;
    this.sludgeVerified = sludge?.sludgeVerified;
  }
}

export interface IQcVesselResponseSludgeState
  extends QcVesselResponseSludgeStateModel {}

export class QcVesselResponseBunkerStateModel {
  activeCategory: IDisplayLookupDto;
  description: string;

  constructor(bunker?: IQcVesselBunkerResponseDto) {
    this.activeCategory = bunker?.activeCategory;
    this.description = bunker?.description;
  }
}

export interface IQcVesselResponseBunkerState
  extends QcVesselResponseBunkerStateModel {}

export class QcVesselResponsesStateModel {
  categories: IDisplayLookupDto[] = [];
  sludge: IQcVesselResponseSludgeState;
  bunker: IQcVesselResponseBunkerState;

  constructor(vesselResponsesDto: IQcVesselResponsesDto) {
    this.categories = vesselResponsesDto.categories;

    this.sludge = new QcVesselResponseSludgeStateModel(
      vesselResponsesDto.sludge
    );
    this.bunker = new QcVesselResponseBunkerStateModel(
      vesselResponsesDto.bunker
    );

    this.sludge.activeCategory =
      this.sludge.activeCategory ?? _.first(this.categories);
    this.bunker.activeCategory =
      this.bunker.activeCategory ?? _.first(this.categories);
  }
}

export interface IQcVesselResponsesState extends QcVesselResponsesStateModel {}
