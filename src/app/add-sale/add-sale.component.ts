import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent implements OnInit {
  socket = io('http://localhost:4000');

  salesForm: FormGroup;
  itemId = '';
  itemName = '';
  itemPrice: number = null;
  itemQty: number = null;
  totalPrice: number = null;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.salesForm = this.formBuilder.group({
      itemId : [null, Validators.required],
      itemName : [null, Validators.required],
      itemPrice : [null, Validators.required],
      itemQty : [null, Validators.required],
      totalPrice : [null, Validators.required]
    });
  }

  // tslint:disable-next-line:typedef
  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.addSales(this.salesForm.value)
      .subscribe((res: any) => {
          const id = res._id;
          this.isLoadingResults = false;
          this.socket.emit('updatedata', res);
          this.router.navigate(['/sales-details', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        });
  }

}
