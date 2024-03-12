import { NbMenuItem } from "@nebular/theme";

var user_path = {
  title: "User",
  icon: "briefcase",
  link: "/pages/user-dashboard",
};
var institution_path = {
  title: "Institution",
  icon: "home-outline",
  link: "/pages/institution-dashboard",
};
var single_nec_path = {
  title: "Single NEC",
  icon: "shopping-cart-outline",
  link: "/pages/nec/single",
};
var bulk_nec_path = {
  title: "Bulk NEC",
  icon: "bookmark",
  link: "/pages/nec/bulk",
};
var nec_report_path = {
  title: "NEC Report",
  icon: "bookmark",
  link: "/pages/nec-report",
};
var upload_report_path = {
  title: "Upload Report",
  icon: "bookmark",
  link: "/pages/upload-report",
};
var audit_logs_path = {
  title: "Audit Logs",
  icon: "bookmark",
  link: "/pages/audit-logs",
};

export function MENU_ITEMS () {
  var user = JSON.parse(sessionStorage.getItem("user"));
  console.log(user)
  var user_role = user?.roleId;
  console.log("###############################");
  console.log(user_role);
  var menu_items = [];
  if (user_role == "1") {
    user_path["home"] = true;
    sessionStorage.setItem("homePath", user_path.link)
    menu_items.push(
      user_path,
      institution_path,
      nec_report_path,
      upload_report_path,
      audit_logs_path
    );
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHH");
    console.log(menu_items);
    console.log(user_path.link);
  } else if (user_role == "2") {
    user_path["home"] = true;
    menu_items.push(user_path, nec_report_path, upload_report_path);
    sessionStorage.setItem("homePath", user_path.link)
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHH");
    console.log(menu_items);
  } else if (["3", "4"].includes(user_role)) {
    console.log(typeof menu_items);
    single_nec_path["home"] = true;
    menu_items.push(single_nec_path, bulk_nec_path);
    sessionStorage.setItem("homePath", single_nec_path.link)
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHH");
    console.log(menu_items);
    // } else if (user_role == "4") {
    //   single_nec_path["home"] = true;
    //   menu_items.push(single_nec_path, bulk_nec_path);
    //   console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHH");
    //   console.log(menu_items);
  } else if (user_role == "5") {
    nec_report_path["home"] = true;
    menu_items.push(nec_report_path, upload_report_path);
    sessionStorage.setItem("homePath", nec_report_path.link)
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHH");
    console.log(menu_items);
  } else if (user_role == "6") {
    nec_report_path["home"] = true;
    menu_items.push(nec_report_path, upload_report_path);
    sessionStorage.setItem("homePath", nec_report_path.link)
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHH");
    console.log(menu_items);
  }
  return menu_items;
}