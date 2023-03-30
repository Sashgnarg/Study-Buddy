import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { NewUserComponent } from './new-user/new-user.component';
import { MessagingComponent } from './messaging/messaging.component';
import { UserMainComponent } from './user-main/user-main.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { AuthGuard } from './authGuard';
import { AuthGuardAdmin } from './authGuardAdmin';
import { AuthGuardLoggedIn } from './authGuardLoggedIn';

const routes: Routes = [
  { path: 'l', component: LoginUserComponent  , canActivate:[AuthGuardLoggedIn]},
  { path: 'admin', component: AdminMainComponent , canActivate:[AuthGuardAdmin]},
  {path: '', component:MessagingComponent},
  { path: 'main', component: UserMainComponent , canActivate:[AuthGuard]},
  { path: 'new', component: NewUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
