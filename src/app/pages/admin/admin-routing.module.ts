import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InstitutionDashboardComponent } from "./institution-dashboard/institution-dashboard.component";
import { InstitutionUserDashboardComponent } from "./institution-user/institution-user-dashboard.component";
import { AdminDashboardComponent } from "./user-dashboard/user-dashboard.component";

const routes: Routes = [
  {
    path: "user-dashboard",
    component: AdminDashboardComponent,
  },
  {
    path: "institution-user-dashboard",
    component: InstitutionUserDashboardComponent,
  },
  {
    path: "institution-dashboard",
    component: InstitutionDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
