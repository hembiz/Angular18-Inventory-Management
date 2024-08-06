import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import Brand from '../../../types/brand';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [MatButtonModule,MatInputModule,FormsModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
  name!: string;
  brandService= inject(BrandService);
  router=inject(Router);
  route=inject(ActivatedRoute);
  brand!:Brand;
  ngOnInit(){
    const id=this.route.snapshot.params['id'];
    //console.log(id);
    if(id){
      this.brandService.getBrandById(id).subscribe(result=>{
        this.brand=result;
        this.name=this.brand.name;
      })
    }
  }
  addBrand(){
    // console.log(this.name);
    if (!this.name){
      alert('Please enter brand name');
      return;
    }
    let brand:Brand={
      name:this.name
    };
    this.brandService.addBrand(brand).subscribe(result => {
      alert('Brand added successfully');
      this.router.navigateByUrl("/brands");
    });
  }

  updateBrand(){
    // console.log(this.name);
    if (!this.name){
      alert('Please enter brand name');
      return;
    }
    let brand:Brand={
      id:this.brand.id,
      name:this.name
    };
    this.brandService.updateBrand(brand).subscribe(result => {
      alert('Brand update successfully');
      this.router.navigateByUrl("/brands");
    });
  }

}
