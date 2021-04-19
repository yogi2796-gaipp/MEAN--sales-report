import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { EditSaleComponent } from './edit-sale/edit-sale.component';
import { SaleDetailsComponent } from './sale-details/sale-details.component';
import { SalesComponent } from './sales/sales.component';

const routes: Routes = [
  {
    path: 'sales',
    component: SalesComponent,
    data: {title: 'List of Sales'}
  },
  {
    path: 'sales-details/:id',
    component: SaleDetailsComponent,
    data: {title: 'Sales Details'}
  },
  {
    path: 'add-sale',
    component: AddSaleComponent,
    data: {title: 'Add Sales'}
  },
  {
    path: 'edit-sales/:id',
    component: EditSaleComponent,
    data: {title: 'Edit Sale Details'}
  },
  {
    path: '',
    redirectTo: '/sales',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
