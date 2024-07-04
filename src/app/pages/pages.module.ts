import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NbButtonModule, NbCardModule, NbMenuModule, NbTableModule } from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ThemeModule } from "../@theme/theme.module";
import { AdminModule } from "./admin/admin.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { NECModule } from "./nec/nec.module";
import { PagesAuthGuard } from "./pages-auth-guard.service";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { ReportModule } from "./report/report.module";


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
    ReportModule,
  ],
  declarations: [PagesComponent],
  bootstrap: [PagesComponent],
  providers: [PagesAuthGuard],
})
export class PagesModule {}
