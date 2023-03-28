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
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  { path: '', component: LoginUserComponent, canActivate: [AuthGuardLoggedIn] },
  { path: 'admin', component: AdminMainComponent, canActivate: [AuthGuardAdmin] },
  { path: 'messaging', component: MessagingComponent, canActivate: [AuthGuard] },
  { path: 'main', component: UserMainComponent, canActivate: [AuthGuard] },
  { path: 'new', component: NewUserComponent },
  { path: 'edit', component: EditUserComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
