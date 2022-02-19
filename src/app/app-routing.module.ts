import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { AuthguardService } from './_helpers/authguard.service';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { CommonComponent } from './_components/common/common.component';



const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [] },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [] },
  { path: 'setting', component: CommonComponent, canActivate: [] },


  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
