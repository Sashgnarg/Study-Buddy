import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { LoginComponent } from './login/login.component';
import { NewUserComponent } from './new-user/new-user.component';
import { MessagingComponent } from './messaging/messaging.component';
import { UserMainComponent } from './user-main/user-main.component';
import { LoginUserComponent } from './login-user/login-user.component';

const routes: Routes = [
  { path: '', component: LoginUserComponent },
  { path: 'admin', component: AdminMainComponent },
  { path: 'login', component:LoginComponent},
  {path: 'messaging', component:MessagingComponent}
  { path: 'main', component: UserMainComponent },
  { path: 'new', component: NewUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
