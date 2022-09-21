import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CdkDrag, CdkDragDrop,
  CdkDropList, CdkDropListGroup,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-available-filters-preferences',
  templateUrl: './available-filters-preferences.component.html',
  styleUrls: ['./available-filters-preferences.component.css']
})
export class AvailableFiltersPreferencesComponent implements OnInit {
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;
  public target: CdkDropList;
  public targetIndex: number;
  public source;
  public sourceIndex: number;

  //selected - Filter chip which is currently selected/applied on grid
  //pinned - Filter chips which are pinned for displaying on screen
  //defaultFilter - Filters which user cannot modify/delete,always displayed on screen
  filterList;
  enableEdit: boolean = false;
  defaultFilterCount: number = 0;
  constructor(
    public dialogRef: MatDialogRef<AvailableFiltersPreferencesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.target = null;
    this.source = null;
  }

  ngOnInit() {
    this.filterList = this.data.map(item => Object.assign({}, item));
    this.defaultFilterCount = (this.filterList.filter(ele => ele.defaultFilter == true)).length;
    this.sortByPosition();
    let overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.add('unset-z-index');
  }
  ngAfterViewInit() {
    // let phElement = this.placeholder.element.nativeElement;

    // phElement.style.display = 'none';
    // phElement.parentNode.removeChild(phElement);
  }
  closeDialog() {
    let overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('unset-z-index');
    this.dialogRef.close(this.data.filter((element) => !element["deleted"] || element["deleted"] != true));
  }
  saveFilterChips() {
    this.enableEdit = false;
    this.data = this.filterList;
  }
  toggleChipSelection(filter, i) {
    if (filter.selected && filter.pinned)//If this was the pinned filter, unpin it
      filter.selected = false;

    if (!filter.pinned) {//When you pin a chip, move it to the first of the list after the default filter
      moveItemInArray(this.filterList, i, this.defaultFilterCount > 0 ? this.defaultFilterCount : 0);
    }
    else {//When you unpin a chip, move it to the end of the list
      moveItemInArray(this.filterList, i, this.filterList.length);
    }
    filter.pinned = !filter.pinned;
    this.data = this.filterList;
  }
  deleteFilterChip(filter) {
    filter.pinned = false;
    filter.deleted = true;
  }
  // chipDrop(event: CdkDragDrop<[]>) {
  //   moveItemInArray(this.filterList, event.previousIndex, event.currentIndex);

  // }
  sortByPosition() {
    this.filterList.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
    this.filterList.sort((a, b) => (a.pinned === b.pinned) ? 0 : (a.pinned ? -1 : 1));
    this.data = this.filterList;
  }
  applyFilter(filterIndex) {
    if (filterIndex >= this.defaultFilterCount) {//If filter chip other than default filter selected
      //Get the drop to position after the default filters
      let dropIndex = this.defaultFilterCount > 0 ? this.defaultFilterCount : 0;
      moveItemInArray(this.filterList, filterIndex, dropIndex);
      //Rearrange the filter lis according to the new posiitons
      this.filterList.forEach((element, index) => {
        //Make the newly selected filter in the new index as the selected chip and unpin others
        element.position = index;
        if (index == dropIndex)
          element.selected = true;
        else
          element.selected = false;
      });
      this.data = this.filterList;
    }
    else {
      this.filterList.forEach((element, index) => {
        if (index == filterIndex)
          element.selected = true;
        else
          element.selected = false;
      });
    }

  }
  rePositionFilters() {
    this.filterList.forEach((element, index) => {
      element.position = index;
    });
    this.data = this.filterList;
  }

  enter = (drag: CdkDrag, drop: CdkDropList) => {

    let dropElement = drop.element.nativeElement;
    let dropIndex = __indexOf(dropElement.parentNode.children, dropElement);
    // Do not allow filters to be moved in between default filters or unpinned filters
    if (drop.data.item.pinned) {
      if ((this.defaultFilterCount > 0 && dropIndex < this.defaultFilterCount)) {
        return false;
      }
      else
        return true;
    }
    else
      return false;


  };
  drop(event: CdkDragDrop<any>) {
    // this.filterList[event.previousContainer.data.index] = event.container.data.item;
    // this.filterList[event.container.data.index] = event.previousContainer.data.item;
    moveItemInArray(this.filterList, event.previousContainer.data.index, event.container.data.index);
    this.rePositionFilters();
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
};
// chipDrop() {
  //   if (!this.target) return;

  //   let phElement = this.placeholder.element.nativeElement;
  //   let parent = phElement.parentNode;

  //   phElement.style.display = "none";

  //   parent.removeChild(phElement);
  //   parent.appendChild(phElement);
  //   parent.insertBefore(
  //     this.source.element.nativeElement,
  //     parent.children[this.sourceIndex]
  //   );

  //   this.target = null;
  //   this.source = null;

  //   if (this.sourceIndex != this.targetIndex)
  //     moveItemInArray(this.filterList, this.sourceIndex, this.targetIndex);
  //   this.rePositionFilters();

  // }


  // enter = (drag: CdkDrag, drop: CdkDropList) => {

  //   if (drop == this.placeholder) return true;

  //   let phElement = this.placeholder.element.nativeElement;
  //   let dropElement = drop.element.nativeElement;

  //   let dragIndex = __indexOf(
  //     dropElement.parentNode.children,
  //     drag.dropContainer.element.nativeElement
  //   );
  //   let dropIndex = __indexOf(dropElement.parentNode.children, dropElement);
  //   // Do not allow filters to be moved in between default filters
  //   if (this.defaultFilterCount > 0 && dropIndex < this.defaultFilterCount) {
  //     return false;
  //   }

  //   if (!this.source) {
  //     this.sourceIndex = dragIndex;
  //     this.source = drag.dropContainer;

  //     let sourceElement = this.source.element.nativeElement;
  //     phElement.style.width = sourceElement.clientWidth + "px";
  //     phElement.style.height = sourceElement.clientHeight + "px";
  //     sourceElement.parentNode.removeChild(sourceElement);
  //   }

  //   this.targetIndex = dropIndex;
  //   this.target = drop;

  //   phElement.style.display = "";
  //   dropElement.parentNode.insertBefore(
  //     phElement,
  //     dragIndex < dropIndex ? dropElement.nextSibling : dropElement
  //   );

  //   this.source.start();
  //   this.placeholder.enter(
  //     drag,
  //     drag.element.nativeElement.offsetLeft,
  //     drag.element.nativeElement.offsetTop
  //   );

  //   return false;
  // };