import { GridApi } from 'ag-grid-community';
import { fromEventPattern, Observable, throwError } from 'rxjs';

export function fromGridEvent<T = any>(gridApi: GridApi, event: AgGridEventsEnum): Observable<T> {
  if (!gridApi) {
    return throwError('Grid is not ready yet');
  }

  const addHandler = (handler: Function) => {
    gridApi.addEventListener(event, handler);
  };

  const removeHandler = (handler: Function) => {
    gridApi.removeEventListener(event, handler);
  };

  return fromEventPattern<T>(addHandler, removeHandler);
}

export enum AgGridEventsEnum {
  cellClicked = 'cellClicked',
  cellDoubleClicked = 'cellDoubleClicked',
  cellFocused = 'cellFocused',
  cellMouseOver = 'cellMouseOver',
  cellMouseOut = 'cellMouseOut',
  cellMouseDown = 'cellMouseDown',
  rowClicked = 'rowClicked',
  rowDoubleClicked = 'rowDoubleClicked',
  rowSelected = 'rowSelected',
  selectionChanged = 'selectionChanged',
  cellContextMenu = 'cellContextMenu',
  rangeSelectionChanged = 'rangeSelectionChanged',
  cellValueChanged = 'cellValueChanged',
  rowValueChanged = 'rowValueChanged',
  cellEditingStarted = 'cellEditingStarted',
  cellEditingStopped = 'cellEditingStopped',
  rowEditingStarted = 'rowEditingStarted',
  rowEditingStopped = 'rowEditingStopped',
  pasteStart = 'pasteStart',
  pasteEnd = 'pasteEnd',
  sortChanged = 'sortChanged',
  filterChanged = 'filterChanged',
  filterModified = 'filterModified',
  rowDragEnter = 'rowDragEnter',
  rowDragMove = 'rowDragMove',
  rowDragLeave = 'rowDragLeave',
  rowDragEnd = 'rowDragEnd',
  columnVisible = 'columnVisible',
  columnPinned = 'columnPinned',
  columnResized = 'columnResized',
  columnMoved = 'columnMoved',
  columnRowGroupChanged = 'columnRowGroupChanged',
  columnValueChanged = 'columnValueChanged',
  columnPivotModeChanged = 'columnPivotModeChanged',
  columnPivotChanged = 'columnPivotChanged',
  columnGroupOpened = 'columnGroupOpened',
  newColumnsLoaded = 'newColumnsLoaded',
  gridColumnsChanged = 'gridColumnsChanged',
  displayedColumnsChanged = 'displayedColumnsChanged',
  virtualColumnsChanged = 'virtualColumnsChanged',
  columnEverythingChanged = 'columnEverythingChanged',
  gridReady = 'gridReady',
  gridSizeChanged = 'gridSizeChanged',
  modelUpdated = 'modelUpdated',
  firstDataRendered = 'firstDataRendered',
  rowGroupOpened = 'rowGroupOpened',
  expandOrCollapseAll = 'expandOrCollapseAll',
  paginationChanged = 'paginationChanged',
  pinnedRowDataChanged = 'pinnedRowDataChanged',
  virtualRowRemoved = 'virtualRowRemoved',
  viewportChanged = 'viewportChanged',
  bodyScroll = 'bodyScroll',
  dragStarted = 'dragStarted',
  dragStopped = 'dragStopped',
  rowDataChanged = 'rowDataChanged',
  rowDataUpdated = 'rowDataUpdated',
  toolPanelVisibleChanged = 'toolPanelVisibleChanged',
  componentStateChanged = 'componentStateChanged',
  animationQueueEmpty = 'animationQueueEmpty',
  cellKeyDown = 'cellKeyDown',
  cellKeyPress = 'cellKeyPress'
}
