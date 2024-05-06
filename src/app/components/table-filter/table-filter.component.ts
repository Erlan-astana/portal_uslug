import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {dic} from '../../shared/models/dictionary.model';
import FilterTable = dic.FilterTable;
import {SearchOperation} from '../../shared/utils/constants';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableFilterComponent implements OnInit {
  filterTable: FilterTable[] = [];
  searchOperations = SearchOperation;
  @Input() displayedColumnsForFilter: any[];
  @Input() parallelForm: boolean;

  constructor() {
  }

  ngOnInit() {
    //this.filterTable.push(new FilterTable());
    //console.log(this.displayedColumnsForFilter);
    this.displayedColumnsForFilter.forEach(column => {
      this.filterTable.push(new FilterTable());
      const index = this.filterTable.length - 1;

      this.filterTable[index].key = column.name;
      this.filterTable[index].options = column.options;
      this.filterTable[index].type = column.type;
      this.setFilterTableOperation(column, index);
    });
  }

  setFilterTableOperation(column, index) {
    if (this.parallelForm) {
      if (column.type === 'int' || column.type === 'date') {
        this.filterTable[index].operation = 'EQUAL';
      }
      if (column.type === 'string' || column.type === 'dropdown') {
        this.filterTable[index].operation = 'MATCH';
      }
    } else {
      this.filterTable[index].operation = 'EQUAL';
    }
  }

  onSelectionChangeFilterColumn(event, filterTableIndex) {
    let foundElement = this.displayedColumnsForFilter.find((el) => el.name === event);
    this.filterTable[filterTableIndex].type = foundElement.type;
  }

  onSelectionChangeOperation(event, ind) {
    if (event === 'BETWEEN') {
      this.filterTable[ind].type = 'between';
    }
  }

  removeFilterByIndex(index: number) {
    if (this.filterTable.length > 0) {
      this.filterTable.splice(index, 1);
    }
  }

  setSelectSubservice(event, index) {
    this.filterTable[index].value = event.id;
  }

  public changeDate(event: MatDatepickerInputEvent<Date>, index: number): any {
    this.filterTable[index].value = event.value.getTime();
  }

  changeDateAtBetweenOperation(event: MatDatepickerInputEvent<Date>, index: number, type) {
    if (type === 'from') {
      this.filterTable[index].value = event.value.getTime();
    }
    if (type === 'by') {
      event.value.setHours(23, 59, 59, 999);
      this.filterTable[index].value2 = event.value.getTime();
    }
  }

  getFlexDirection() {
    return this.parallelForm ? 'row' : 'column';
  }

}
