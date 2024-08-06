import { Component, inject, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import Order from '../../types/order';
import { OrderService } from '../../services/order.service';
import Product from '../../types/product';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatIcon, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  dataSource!: MatTableDataSource<Order>;
  orderService = inject(OrderService);
  productService = inject(ProductService);
  toaster=inject(ToastrService);
  products: Product[]=[];
  orders: Order[]=[];
  displayedColumns =[
    'orderNo',
    'productId',
    'qty',
    'salesPrice',
    'discount',
    'totalAmount',
    'action',
  ];

  @ViewChild(MatPaginator) pagination!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  ngOnInit() {
    this.productService.getProducts().subscribe(result=>{this.products = result});
    this.orderService.getOrders().subscribe(result=>{
      this.orders = result;
      this.initTable();
    })

  }
  initTable(){
    this.dataSource= new MatTableDataSource(this.orders);
    this.dataSource.paginator=this.pagination;
    this.dataSource.sort=this.sort;
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLowerCase();
    if(this.dataSource.paginator){ 
    }
  }

  getProductName(productId:string){
    return this.products.find(result=>result.id==productId)?.name;
  }

  cancelOrder(order:Order){
    this.orderService.deleteOrder(order.id!).subscribe(()=>{
      this.toaster.success("Order cancelled");
      this.productService.getProductById(order.productId).subscribe((product)=>{
        product.stock += order.qty!;
        this.productService.updateProduct(product!.id!,product!).subscribe();
      });
      this.orders = this.orders.filter((x)=>x.id !=order.id);
      this.dataSource.data=this.orders;
    });
  }
}
