import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrandService } from '../../../services/brand.service';
import Brand from '../../../types/brand';
import { ProductService } from '../../../services/product.service';
import Product from '../../../types/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatSelectModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  name!: string;

  builer=inject(FormBuilder);
  productForm:FormGroup = this.builer.group({
    name: ['',[Validators.required]],
    details: [''],
    brandId: ['',[Validators.required]],
    purchasePrice: ['',[Validators.required]],
    salePrice: ['',[Validators.required]],
    stock:['',[Validators.required]],
  });

  productService = inject(ProductService);
  brandService = inject(BrandService);
  brands: Brand[] = [];
  router=inject(Router);
  route=inject(ActivatedRoute);
  product!: Product;
  ngOnInit() {
    let id=this.route.snapshot.params['id'];
    //console.log(id);
    if(id){
      this.productService.getProductById(id).subscribe(result=>{
        this.product=result;
        this.productForm.patchValue(this.product);
      })
    }
    this.brandService.getBrands().subscribe((result)=>(this.brands=result));
  }

  addProduct(){
    //console.log(this.productForm.value);
    if(this.productForm.invalid) {
      alert("Please provide all the details!");
      return;
    }
    let product:Product = this.productForm.value;
    this.productService.addProducts(product).subscribe(result=>{
      alert("Product added successfully!");
      this.router.navigateByUrl("/products");
    }) 
  }

  updateProduct(){
    //console.log(this.productForm.value);
    if(this.productForm.invalid) {
      alert("Please provide all the details!");
      return;
    }
    let product:Product = this.productForm.value;
    this.productService.updateProduct(this.product.id!, product).subscribe(result=>{
      alert("Product update successfully!");
      this.router.navigateByUrl("/products");
    }) 
  }
}
