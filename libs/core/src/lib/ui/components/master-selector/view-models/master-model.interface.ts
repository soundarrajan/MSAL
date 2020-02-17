import { ReplaySubject, Subject } from 'rxjs';
import { GridOptions } from '@ag-grid-community/core';
import { DocumentsMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/documents-model/documents-master-selector-grid.view-model';
import { VesselMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/vessel-model/vessel-master-selector-grid.view-model';
import { VesselPortCallsMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/vessel-port-calls-model/vessel-port-calls-master-selector-grid.view-model';

export interface IMasterModelInterface {
  entityId?: number;
  entityName?: string;
  vesselId?: number;
  selectorType?: string;
  page: number;
  isLoading: boolean;
  pageSize: number;
  isReady: boolean;
  isServerSide: boolean;
  totalPages: number;
  destroy$: Subject<any>;
  gridReady$: ReplaySubject<any>;
  totalItems: number;
  gridOptions: GridOptions;
  DocumentsMasterSelectorGridViewModel?: DocumentsMasterSelectorGridViewModel;
  VesselMasterSelectorGridViewModel?: VesselMasterSelectorGridViewModel;
  VesselPortCallsMasterSelectorGridViewModel?: VesselPortCallsMasterSelectorGridViewModel;
  markServerSideDataSourceReady(): void;
  onSearch(event: string): void;
}
