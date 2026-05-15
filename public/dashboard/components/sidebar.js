(function (global) {
  var STORAGE_USER = "intellysys_auth_user";

  var ICONS = {
    dashboard:
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>',
    devices:
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.25h13.5v10.5H5.25V5.25Zm3 3h3v3h-3v-3Zm4.5 0h3v3h-3v-3Zm-4.5 4.5h7.5M9 19.5h6" /></svg>',
    "remote-access":
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m6.75 7.5 3 2.25-3 2.25m9-4.5h-6m6 4.5h-6m6 4.5h-9m9 6h-13.5a2.25 2.25 0 0 1-2.25-2.25v-15a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25 2.25Z" /></svg>',
    "packet-analyzer":
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0V12m0 0 4.243-4.243M12 12 7.757 7.757M12 12l4.243 4.243M12 12 7.757 16.243" /></svg>',
    monitoring:
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c3 4 6 5.5 6 10a6 6 0 1 1-12 0c0-4.5 3-6 6-10Zm0 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>',
    alerts:
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75v-.113V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>',
    "logs-reports":
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3 8.25v5.25m0 0v1.5m0-1.5h4.125a2.25 2.25 0 0 0 2.25-2.25V15m0-8.25h-9M7.5 15h.008v.008H7.5V15Zm3 0h.008v.008H10.5V15Zm3 0h.008v.008H13.5V15Z" /></svg>',
    users:
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>',
    settings:
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>',
    subscription:
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3 3.75h12m-15.75-9v15a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25v-15m-18 0V5.25A2.25 2.25 0 0 1 5.25 3h13.5a2.25 2.25 0 0 1 2.25 2.25v4.5m-18 0h18" /></svg>',
    "help-support":
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>',
  };

  var NAV_ITEMS = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/public/dashboard/home.html",
    },
    {
      id: "devices",
      label: "Devices",
      href: "/public/dashboard/devices.html",
    },
    {
      id: "remote-access",
      label: "Remote Access (SSH)",
      href: "#",
    },
    {
      id: "packet-analyzer",
      label: "Packet Analyzer",
      href: "#",
    },
    {
      id: "monitoring",
      label: "Monitoring",
      href: "#",
    },
    {
      id: "alerts",
      label: "Alerts",
      href: "#",
    },
    {
      id: "logs-reports",
      label: "Logs & Reports",
      href: "#",
    },
    {
      id: "users",
      label: "Users",
      href: "#",
    },
    {
      id: "settings",
      label: "Settings",
      href: "#",
    },
    {
      id: "subscription",
      label: "Subscription",
      href: "#",
    },
    {
      id: "help-support",
      label: "Help & Support",
      href: "#",
    },
  ];

  function formatRoleKey(roleName) {
    if (!roleName) return "Super Administrator";
    var key = String(roleName).toLowerCase().replace(/\s+/g, "");
    var map = {
      superadmin: "Super Administrator",
      admin: "Administrator",
    };
    if (map[key]) return map[key];
    return (
      roleName.charAt(0).toUpperCase() +
      roleName.slice(1).replace(/[-_]/g, " ")
    );
  }

  function readSessionUser() {
    try {
      var raw = sessionStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function mount(options) {
    var activeId = (options && options.active) || "dashboard";
    var container =
      (options && options.container) ||
      document.getElementById("dashboard-sidebar");
    if (!container) return;

    var user = readSessionUser();
    var displayName =
      (user && user.name) || (options && options.profileName) || "Admin";
    var roleLabel = (options && options.profileRole) || "";
    if (!roleLabel) {
      roleLabel = formatRoleKey(
        user && user.userRole && user.userRole.name,
      );
    }

    var aside = document.createElement("aside");
    aside.className = "dash-sidebar";
    aside.setAttribute("aria-label", "Main navigation");

    var brand = document.createElement("div");
    brand.className = "dash-sidebar__brand";
    brand.textContent = "Intellysys";
    aside.appendChild(brand);

    var nav = document.createElement("nav");
    nav.className = "dash-sidebar__nav";
    var ul = document.createElement("ul");
    ul.className = "dash-sidebar__list";

    for (var i = 0; i < NAV_ITEMS.length; i++) {
      var item = NAV_ITEMS[i];
      var li = document.createElement("li");
      li.className = "dash-sidebar__item";
      var a = document.createElement("a");
      a.className = "dash-sidebar__link";
      if (item.id === activeId) a.classList.add("is-active");
      a.href = item.href;
      if (item.href === "#") {
        a.addEventListener("click", function (e) {
          e.preventDefault();
        });
      }
      var iconWrap = document.createElement("span");
      iconWrap.className = "dash-sidebar__icon";
      iconWrap.innerHTML = ICONS[item.id] || ICONS.dashboard;
      var label = document.createElement("span");
      label.className = "dash-sidebar__label";
      label.textContent = item.label;
      a.appendChild(iconWrap);
      a.appendChild(label);
      li.appendChild(a);
      ul.appendChild(li);
    }

    nav.appendChild(ul);
    aside.appendChild(nav);

    var profileBtn = document.createElement("button");
    profileBtn.type = "button";
    profileBtn.className = "dash-sidebar__profile";
    profileBtn.setAttribute("aria-label", "Account menu");

    var avWrap = document.createElement("span");
    avWrap.className = "dash-sidebar__avatar-wrap";
    var avatar = document.createElement("span");
    avatar.className = "dash-sidebar__avatar";
    avatar.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>';
    var status = document.createElement("span");
    status.className = "dash-sidebar__status";
    status.title = "Online";
    avWrap.appendChild(avatar);
    avWrap.appendChild(status);

    var ptext = document.createElement("span");
    ptext.className = "dash-sidebar__profile-text";
    var pname = document.createElement("span");
    pname.className = "dash-sidebar__profile-name";
    pname.textContent = displayName;
    var prole = document.createElement("span");
    prole.className = "dash-sidebar__profile-role";
    prole.textContent = roleLabel;
    ptext.appendChild(pname);
    ptext.appendChild(prole);

    var chev = document.createElement("span");
    chev.className = "dash-sidebar__chevron";
    chev.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>';

    profileBtn.appendChild(avWrap);
    profileBtn.appendChild(ptext);
    profileBtn.appendChild(chev);

    aside.appendChild(profileBtn);

    container.appendChild(aside);
  }

  global.DashboardSidebar = { mount: mount };
})(window);
