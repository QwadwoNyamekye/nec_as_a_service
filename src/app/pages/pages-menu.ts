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

export const MENU_ITEMS: NbMenuItem[] = (function () {
  var user = JSON.parse(sessionStorage.getItem("user"));
  var user_role = user?.role_id;
  console.log("###############################");
  console.log(user_role);
  var menu_items = [];
  if (user_role == "1") {
    user_path["home"] = true;
    menu_items.push(
      user_path,
      institution_path,
      single_nec_path,
      bulk_nec_path
    );
  } else if (user_role == "2") {
    user_path["home"] = true;
    menu_items.push(user_path, institution_path, bulk_nec_path);
  } else if (user_role == "3") {
    user_path["home"] = true;
    menu_items.push(user_path, institution_path);
  } else if (user_role == "4") {
    single_nec_path["home"] = true;
    menu_items.push(single_nec_path, bulk_nec_path, nec_report_path);
  }
  return menu_items;
})();
