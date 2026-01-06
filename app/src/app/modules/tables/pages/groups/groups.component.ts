import { AfterViewInit, Component, viewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ELEMENT_DATA } from '../../consts/groups-data';

@Component({
  selector: 'app-groups',
  standalone: false,
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements AfterViewInit {
  readonly sort = viewChild(MatSort);

  displayedColumns: string[] = ['id', 'name', 'createdBy', 'createdAt'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  currentFilterValue = '';

  ngAfterViewInit() {
    this.dataSource.sort = this.sort();
  }

  applyFilter(filterValue: string) {
    this.currentFilterValue = filterValue.trim(); 
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openGroupDialog() {}
}
