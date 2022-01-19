import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import _ from 'lodash';
import {
  AgGridConditionTypeEnum,
  AgGridConditionTypeLabels,
  AgGridFilterModel,
  AgGridKnownFilterTypes,
  AgGridOperatorEnum,
  IAgGridBaseFilter,
  IAgGridDateFilter,
  IAgGridNumberFilter,
  IAgGridTextFilter
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { AgGridAngular } from '@ag-grid-community/angular';

enum ConditionType {
  and = 'and',
  or = 'or',
  bullet = 'bullet',
}

enum PartType {
  filter,
  logicalOp,
  bullet
}

interface IPart {
  type: PartType;
  value: string;
}

interface IFilterPart extends IPart {
  condition: string;
  column: string;
}

interface IConditionPart extends IPart {
  type: PartType.logicalOp;
  value: ConditionType;
}

interface IBulletPart extends IPart {
  type: PartType.bullet;
  value: ConditionType.bullet;
}

const AndConditionPart: IConditionPart = {
  type: PartType.logicalOp,
  value: ConditionType.and
};
const OrConditionPart: IConditionPart = {
  type: PartType.logicalOp,
  value: ConditionType.or
};
const BulletConditionPart: IConditionPart = {
  type: PartType.logicalOp,
  value: ConditionType.bullet
};

type FilterPart = IFilterPart | IConditionPart | IBulletPart;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-filter-display',
  templateUrl: './ag-filter-display.component.html',
  styleUrls: ['./ag-filter-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgFilterDisplayComponent implements OnInit, OnDestroy {
  logicalOpPartType = PartType.logicalOp;
  filterPartType = PartType.filter;

  @Input() grid: AgGridAngular;

  filterParts: FilterPart[];

  private _destroy$: Subject<any> = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private tenantFormat: TenantFormattingService
  ) {}

  ngOnInit(): void {
    this.grid.filterChanged
      .pipe(
        tap(() => {
          this.filterParts = _.transform(
            this.grid.api.getFilterModel(),
            (
              result: FilterPart[],
              filterModel: AgGridFilterModel,
              columnId: any
            ) => {
              const column = this.grid.columnApi.getColumn(columnId);

              if (result.length > 0) result.push(BulletConditionPart);

              if (
                filterModel.operator !== undefined &&
                filterModel.operator !== null
              ) {
                result.push({
                  column: column.getDefinition().headerName,
                  condition:
                    AgGridConditionTypeLabels[filterModel.condition1.type],
                  value: this.extractFilterValue(
                    filterModel.filterType,
                    filterModel.condition1.type,
                    filterModel.condition1
                  ),
                  type: PartType.filter
                });

                result.push(
                  filterModel.operator === AgGridOperatorEnum.AND
                    ? AndConditionPart
                    : OrConditionPart
                );

                result.push({
                  column: column.getDefinition().headerName,
                  condition:
                    AgGridConditionTypeLabels[filterModel.condition2.type],
                  value: this.extractFilterValue(
                    filterModel.filterType,
                    filterModel.condition2.type,
                    filterModel.condition2
                  ),
                  type: PartType.filter
                });
              } else {
                result.push({
                  column: column.getDefinition().headerName,
                  condition: AgGridConditionTypeLabels[filterModel.type],
                  value: this.extractFilterValue(
                    filterModel.filterType,
                    filterModel.type,
                    filterModel
                  ),
                  type: PartType.filter
                });
              }
            },
            []
          );

          this.changeDetector.markForCheck();
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  hideFilters() : void {
    document.querySelector<HTMLElement>("app-ag-filter-display").hidden = true;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private extractFilterValue(
    filterType: AgGridKnownFilterTypes,
    condition: AgGridConditionTypeEnum,
    value: IAgGridBaseFilter
  ): string | undefined {
    if (
      condition === AgGridConditionTypeEnum.NOT_NULL ||
      condition === AgGridConditionTypeEnum.NULL
    )
      return undefined;

    if (
      condition === AgGridConditionTypeEnum.YES ||
      condition === AgGridConditionTypeEnum.NO
    )
      return undefined;

    switch (filterType) {
      case AgGridKnownFilterTypes.Text:
        return (<IAgGridTextFilter>value).filter;

      case AgGridKnownFilterTypes.Date:
        return condition === AgGridConditionTypeEnum.IN_RANGE
          ? `${this.tenantFormat.date(
              (<IAgGridDateFilter>value).dateFrom
            )} - ${this.tenantFormat.date((<IAgGridDateFilter>value).dateTo)}`
          : this.tenantFormat.date((<IAgGridDateFilter>value).dateFrom);

      case AgGridKnownFilterTypes.Number:
        return condition === AgGridConditionTypeEnum.IN_RANGE
          ? `${(<IAgGridNumberFilter>value).filter} - ${
              (<IAgGridNumberFilter>value).filterTo
            }`
          : (<IAgGridNumberFilter>value).filter.toString();
    }
  }
}
