import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { PagesAuthGuard } from "./pages-auth-guard.service";
import { PagesComponent } from "./pages.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
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
        path: "report",
        loadChildren: () =>
          import("./report/report.module").then((m) => m.ReportModule),
        canActivate: [PagesAuthGuard],
        data: { allowedRoles: ["1", "2", "5", "6", "8", "9"] },
      },
      {
        path: "miscellaneous",
        loadChildren: () =>
          import("./miscellaneous/miscellaneous.module").then(
            (m) => m.MiscellaneousModule
          ),
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
