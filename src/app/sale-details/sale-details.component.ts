import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Sales } from './../sales';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.css']
})
export class SaleDetailsComponent implements OnInit {
  socket = io('http://localhost:4000');

  sales: Sales = { _id: '', itemId: '', itemName: '', itemPrice: null, itemQty: null, totalPrice: null, updated: null };
  isLoadingResults = true;
  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getSalesDetails(this.route.snapshot.params.id);

    // tslint:disable-next-line:typedef
    this.socket.on('update-data', function(data: any) {
      this.getSalesDetails();
    }.bind(this));
  }

  // tslint:disable-next-line:typedef
  getSalesDetails(id: string) {
    this.api.getSalesById(id)
      .subscribe((data: any) => {
        this.sales = data;
        console.log(this.sales);
        this.isLoadingResults = false;
      });
  }

  // tslint:disable-next-line:typedef
  deleteSales(id: any) {
    this.isLoadingResults = true;
    this.api.deleteSales(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          this.router.navigate(['/']);
          this.socket.emit('updatedata', res);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

}
