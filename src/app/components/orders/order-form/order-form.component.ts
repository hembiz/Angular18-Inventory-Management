import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Order from '../../../types/order';
import { ProductService } from '../../../services/product.service';
import Product from '../../../types/product';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatSelectModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent {
formBuiler=inject(FormBuilder);
orderForm=this.formBuiler.group<Order>({
  orderNo:'',
  productId:'',
  qty:null,
  salesPrice:null,
  discount:null,
  totalAmount:null,
});

productService=inject(ProductService);
products:Product[]=[];
route=inject(ActivatedRoute)
toaster=inject(ToastrService);
orderService=inject(OrderService);
router=inject(Router);
order!:Order;
ngOnInit() {
  const id=this.route.snapshot.params['id'];
  //console.log(id);
  if(id){
    this.orderService.getOrderById(id).subscribe(result=>{
      this.order=result;
      this.orderForm.patchValue(this.order);
      this.productService.getProducts().subscribe((result)=>{
        this.products=result;
        this.selectedProduct=this.products.find(result=>result.id==this.order?.productId);
        this.orderForm.controls.productId.disable();
      });
    });
  }else{
    this.productService.getProducts().subscribe((result)=>{
      this.products=result;
      this.selectedProduct=this.products.find(result=>result.id==this.order?.productId);
    });
  }
  this.orderForm.controls.orderNo.addValidators(Validators.required);
  this.orderForm.controls.productId.addValidators(Validators.required);
  this.orderForm.controls.qty.addValidators(Validators.required);

  this.updateTotalAmount();
}

selectedProduct?:Product;
productSelected(productId:string){
  this.selectedProduct=this.products.find(result=>result.id==productId);
  this.orderForm.controls.salesPrice.setValue(this.selectedProduct?.salePrice!);
}

updateTotalAmount(){
  this.orderForm.valueChanges.subscribe(()=>{
    if(this.orderForm.getRawValue().productId && this.orderForm.value.qty){
      let totalAmount=this.selectedProduct?.salePrice!*this.orderForm.value.qty-(this.orderForm.value.discount || 0);
      this.orderForm.controls.totalAmount.setValue(totalAmount,{emitEvent:false});
    }
  })
}
addOrder(){
  //console.log(this.orderForm.value);
  if(this.orderForm.invalid) {
    this.toaster.warning("Please provide all the details!");
    return;
  }
  
  let formValue = this.orderForm.getRawValue() as Order;
  
  if(formValue.qty! > this.selectedProduct!.stock){
    this.toaster.warning('Only '+this.selectedProduct!.stock+' unit(s) is left in stock!');
    return;
  }
  this.orderService.addOrder(formValue).subscribe(()=>{
    this.selectedProduct!.stock -= formValue.qty!;
    this.productService.updateProduct(this.selectedProduct!.id!,this.selectedProduct!).subscribe();
    this.toaster.success("Order added successfully!");
    this.router.navigateByUrl("/orders");
  }); 
}

updateOrder(){
  if(this.orderForm.invalid) {
    this.toaster.warning("Please provide all the details!");
    return;
  }

  let formValue = this.orderForm.getRawValue() as Order;
  
  if(formValue.qty! > this.selectedProduct!.stock + this.order.qty!){
    this.toaster.warning('Only '+this.selectedProduct!.stock+' unit(s) is left in stock!');
    return;
  }
  this.orderService.updateOrder(this.order.id!,formValue).subscribe(()=>{
    this.selectedProduct!.stock -= (formValue.qty!-this.order.qty!);
    this.productService.updateProduct(this.selectedProduct!.id!,this.selectedProduct!).subscribe();
    this.toaster.success("Order updated successfully!");
    this.router.navigateByUrl("/orders");
  }); 
}

}