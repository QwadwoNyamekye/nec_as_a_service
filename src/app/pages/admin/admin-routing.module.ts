import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { InstitutionDashboardComponent } from "./institution-dashboard/institution-dashboard.component";

const routes: Routes = [
  {
    path: "user-dashboard",
    component: AdminDashboardComponent,
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
