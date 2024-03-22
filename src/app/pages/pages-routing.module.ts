import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PagesComponent } from "./pages.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { AdminDashboardComponent } from "./admin/user-dashboard/user-dashboard.component";
import { InstitutionDashboardComponent } from "./admin/institution-dashboard/institution-dashboard.component";
import { PagesAuthGuard } from "./pages-auth-guard.service";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "user-dashboard",
        component: AdminDashboardComponent,
        canActivate: [PagesAuthGuard],
        data: { allowedRoles: ["1", "2"] },
      },
      {
        path: "institution-dashboard",
        component: InstitutionDashboardComponent,
        canActivate: [PagesAuthGuard],
        data: { allowedRoles: ["1", "2"] },
      },
      {
        path: "nec",
        loadChildren: () => import("./nec/nec.module").then((m) => m.NECModule),
        canActivate: [PagesAuthGuard],
        data: { allowedRoles: ["3", "4"] },
      },
      {
        path: "",
        loadChildren: () =>
          import("./report/report.module").then((m) => m.ReportModule),
        canActivate: [PagesAuthGuard],
        data: { allowedRoles: ["1", "2", "5", "6"] },
      },
      {
        path: "miscellaneous",
        loadChildren: () =>
          import("./miscellaneous/miscellaneous.module").then(
            (m) => m.MiscellaneousModule
          ),
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
