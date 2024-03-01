import { NgModule } from "@angular/core";
import { NbButtonModule, NbMenuModule } from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NbCardModule } from "@nebular/theme";
import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { HttpClientModule } from "@angular/common/http";
import { NbTableModule } from "@nebular/theme";
import { AdminModule } from "./admin/admin.module";
import { NECModule } from "./nec/nec.module";
import { ReportModule } from "./report/report.module";


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    Ng2SmartTableModule,
    NbCardModule,
    HttpClientModule,
    NbButtonModule,
    NbTableModule,
    AdminModule,
    NECModule,
    ReportModule
  ],
  declarations: [PagesComponent],
  bootstrap: [PagesComponent],
})
export class PagesModule {}
