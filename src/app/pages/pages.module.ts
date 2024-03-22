import { NgModule } from "@angular/core";
import { NbButtonModule, NbMenuModule } from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NbCardModule } from "@nebular/theme";
import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { HttpClientModule } from "@angular/common/http";
import { NbTableModule } from "@nebular/theme";
import { AdminModule } from "./admin/admin.module";
import { NECModule } from "./nec/nec.module";
import { ReportModule } from "./report/report.module";
import { PagesAuthGuard } from "./pages-auth-guard.service";


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
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
  providers: [PagesAuthGuard],
})
export class PagesModule {}
