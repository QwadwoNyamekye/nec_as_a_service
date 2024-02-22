import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = (function () {
  var user = JSON.parse(localStorage.getItem("user"));
  var role = user.role_id;
  console.log("###############################");
  console.log(user.role_id);
  var menu_items = [];
  if (role == "1") {
    menu_items = [
      {
        title: "User",
        icon: "briefcase",
        link: "/pages/user-dashboard",
        home: true,
      },
      {
        title: "Institution",
        icon: "home-outline",
        link: "/pages/institution-dashboard",
      },
      {
        title: "Single NEC",
        icon: "shopping-cart-outline",
        link: "/pages/nec/single",
      },
      {
        title: "Bulk NEC",
        icon: "shopping-cart-outline",
        link: "/pages/nec/bulk",
      },
    ];
  } else if (role == "2") {
    menu_items = [
      {
        title: "User",
        icon: "briefcase",
        link: "/pages/user-dashboard",
        home: true,
      },
      {
        title: "Institution",
        icon: "home-outline",
        link: "/pages/institution-dashboard",
      },
      {
        title: "Single NEC",
        icon: "shopping-cart-outline",
        link: "/pages/nec/single",
      },
      {
        title: "Bulk NEC",
        icon: "shopping-cart-outline",
        link: "/pages/nec/bulk",
      },
    ];
  }
  return menu_items;
})();
