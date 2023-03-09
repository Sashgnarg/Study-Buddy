import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { NewUserComponent } from './new-user/new-user.component';

const routes: Routes = [
  { path: '', component: NewUserComponent },
  { path: 'admin', component: AdminMainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
