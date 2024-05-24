import { NbMenuItem } from "@nebular/theme";

var user_path = {
  title: "User",
  icon: "person",
  link: "/pages/user-dashboard",
};
var institution_path = {
  title: "Institution",
  icon: "briefcase",
  link: "/pages/institution-dashboard",
};
var single_nec_path = {
  title: "Single NEC",
  icon: "minus-square",
  link: "/pages/nec/single",
};
var bulk_nec_path = {
  title: "Bulk NEC",
  icon: "plus-square",
  link: "/pages/nec/bulk/new",
  children: [],
};
var bulk_nec_new = {
  title: "New",
  icon: "sun-outline",
  link: "/pages/nec/bulk/new",
};
var bulk_nec_completed = {
  title: "Completed",
  icon: "done-all-outline",
  link: "/pages/nec/bulk/completed",
};
var bulk_nec_processing = {
  title: "Processing",
  icon: "trending-up-outline",
  link: "/pages/nec/bulk/processing",
};
var bulk_nec_submitted = {
  title: "Submitted",
  icon: "copy-outline",
  link: "/pages/nec/bulk/submitted",
};
var bulk_nec_declined = {
  title: "Declined",
  icon: "close-outline",
  link: "/pages/nec/bulk/declined",
};
var bulk_nec_rejected = {
  title: "Rejected",
  icon: "close-outline",
  link: "/pages/nec/bulk/rejected",
};
var nec_report_path = {
  title: "NEC Report",
  icon: "bookmark",
  link: "/pages/nec-report",
};
var upload_report_path = {
  title: "Batch Report",
  icon: "book",
  link: "/pages/upload-report",
};
var audit_logs_path = {
  title: "Audit Logs",
  icon: "star",
  link: "/pages/audit-logs",
};
var fee_logs_path = {
  title: "Fee Logs",
  icon: "pantone-outline",
  link: "/pages/fee-logs",
};

export function MENU_ITEMS() {
  var user = JSON.parse(sessionStorage.getItem("user"));
  var user_role = user?.roleId;
  var menu_items = [];
  if (user_role == "1") {
    user_path["home"] = true;
    sessionStorage.setItem("homePath", user_path.link);
    menu_items.push(
      user_path,
      institution_path,
      nec_report_path,
      upload_report_path,
      audit_logs_path,
      fee_logs_path
    );
  } else if (user_role == "2") {
    user_path["home"] = true;
    menu_items.push(user_path, nec_report_path, upload_report_path);
    sessionStorage.setItem("homePath", user_path.link);
  } else if (["3", "4"].includes(user_role)) {
    single_nec_path["home"] = true;
    if (user_role == "3") {
      bulk_nec_path.children = [
        bulk_nec_submitted,
        bulk_nec_processing,
        bulk_nec_rejected,
        bulk_nec_completed,
      ];
    } else if (user_role == "4") {
      bulk_nec_path.children = [
        bulk_nec_new,
        bulk_nec_submitted,
        bulk_nec_processing,
        bulk_nec_declined,
        bulk_nec_completed,
      ];
    }
    menu_items.push(single_nec_path, bulk_nec_path);
    sessionStorage.setItem("homePath", single_nec_path.link);
  } else if (user_role == "5") {
    nec_report_path["home"] = true;
    menu_items.push(nec_report_path, upload_report_path);
    sessionStorage.setItem("homePath", nec_report_path.link);
  } else if (user_role == "6") {
    nec_report_path["home"] = true;
    menu_items.push(nec_report_path, upload_report_path);
    sessionStorage.setItem("homePath", nec_report_path.link);
  }
  return menu_items;
}
