import { Component, inject, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import Product from '../../types/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatIcon, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  dataSource!: MatTableDataSource<Product>;
  productService = inject(ProductService);
  product:Product[] = [];
  displayedColumns=[
    'name',
    'details',
    'brandId',
    'purchasePrice',
    'salePrice',
    'stock',
    'action'
  ];

  @ViewChild(MatPaginator) pagination!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  ngOnInit() {
    this.productService.getProducts().subscribe(result=>{
      this.product = result;
      this.initTable();
    })

  }
  initTable(){
    this.dataSource= new MatTableDataSource(this.product);
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
