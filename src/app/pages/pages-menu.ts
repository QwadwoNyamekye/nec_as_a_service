import { NbMenuItem } from "@nebular/theme";

var user_path = {
  title: "User",
  icon: "briefcase",
  link: "/pages/user-dashboard",
  home: true,
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
var menu_items = [];

export const MENU_ITEMS: NbMenuItem[] = (function () {
  var user = JSON.parse(sessionStorage.getItem("user"));
  var role = user?.role_id;
  console.log("###############################");
  console.log(user?.role_id);
  var menu_items = [];
  if (role == "1") {
    menu_items.push(
      user_path,
      institution_path,
      single_nec_path,
      bulk_nec_path
    );
  } else if (role == "2") {
    menu_items.push(user_path, institution_path, bulk_nec_path);
  } else if (role == "3") {
    menu_items.push(user_path, institution_path);
  } else if (role == "4") {
    menu_items.push(single_nec_path, bulk_nec_path);
  }
  return menu_items;
})();
