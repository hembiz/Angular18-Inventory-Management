import { Component, inject, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import Brand from '../../types/brand';
import { BrandService } from '../../services/brand.service';


@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatIcon, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  dataSource!:MatTableDataSource<Brand>
  displayedColumns:string[] = ['id','name','action'];
  brandService=inject(BrandService);

  @ViewChild(MatPaginator) pagination!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  ngOnInit() {
    this.brandService.getBrands().subscribe(result => {
      this.initTable(result);
    })
  }
  initTable(data:Brand[]){
    this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator=this.pagination;
      this.dataSource.sort=this.sort;
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      
    }

  }
}
