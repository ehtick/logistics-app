import type { NavSection } from "@/shared/layout/nav-menu";

export const sidebarSections: NavSection[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "home",
        label: "Home",
        icon: "house",
        route: "/home",
      },
      {
        id: "messages",
        label: "Messages",
        icon: "messages-square",
        route: "/messages",
        feature: "messages",
        // badge wired in sidebar-nav.service.ts via ChatService
      },
      {
        id: "reports",
        label: "Reports",
        icon: "trending-up",
        route: "/reports",
        feature: "reports",
        // Children stay in the data for the command palette + stored favorites, but each is
        // `menuHidden` so the rendered menu shows Reports as a single link to the hub page.
        children: [
          {
            id: "reports-loads",
            label: "Loads",
            route: "/reports/loads",
            menuHidden: true,
          },
          {
            id: "reports-drivers",
            label: "Drivers",
            route: "/reports/drivers",
            menuHidden: true,
          },
          {
            id: "reports-drivers-detailed",
            label: "Drivers Detailed",
            route: "/reports/drivers/detailed",
            menuHidden: true,
          },
          {
            id: "reports-financial",
            label: "Financial Report",
            route: "/reports/financials",
            menuHidden: true,
          },
          {
            id: "reports-payroll",
            label: "Payroll Report",
            route: "/reports/payroll",
            menuHidden: true,
          },
          {
            id: "reports-safety",
            label: "Safety Report",
            route: "/reports/safety",
            menuHidden: true,
          },
          {
            id: "reports-maintenance",
            label: "Maintenance Report",
            route: "/reports/maintenance",
            menuHidden: true,
          },
          {
            id: "reports-ifta",
            label: "IFTA Report",
            route: "/reports/ifta",
            feature: "ifta",
            menuHidden: true,
          },
          {
            id: "reports-revenue",
            label: "Revenue Overview",
            route: "/reports/revenue",
            menuHidden: true,
          },
          {
            id: "reports-team",
            label: "Team Overview",
            route: "/reports/team",
            menuHidden: true,
          },
        ],
      },
    ],
  },
  {
    id: "dispatch",
    label: "Dispatch",
    items: [
      {
        id: "loads",
        label: "Loads",
        icon: "package",
        route: "/loads",
        feature: "loads",
      },
      {
        id: "trips",
        label: "Trips",
        icon: "map",
        route: "/trips",
        feature: "trips",
      },
      {
        id: "ai-dispatch",
        label: "AI Dispatch",
        icon: "sparkles",
        route: "/ai-dispatch",
        feature: "agentic_dispatch",
      },
      {
        id: "loadboard",
        label: "Load Board",
        icon: "search",
        feature: "load_board",
        children: [
          {
            id: "loadboard-search",
            label: "Search Loads",
            route: "/loadboard/search",
          },
          {
            id: "loadboard-posted-trucks",
            label: "Posted Trucks",
            route: "/loadboard/posted-trucks",
          },
          {
            id: "loadboard-providers",
            label: "Providers",
            route: "/loadboard/providers",
          },
        ],
      },
      {
        id: "intermodal",
        label: "Intermodal",
        icon: "warehouse",
        children: [
          {
            id: "intermodal-containers",
            label: "Containers",
            route: "/containers",
          },
          {
            id: "intermodal-terminals",
            label: "Terminals",
            route: "/terminals",
          },
        ],
      },
    ],
  },
  {
    id: "fleet",
    label: "Fleet & Compliance",
    items: [
      {
        id: "trucks",
        label: "Trucks",
        icon: "truck",
        route: "/trucks",
        feature: "trucks",
      },
      {
        id: "eld",
        label: "ELD / HOS",
        icon: "clock",
        route: "/eld",
        feature: "eld",
      },
      {
        id: "maintenance",
        label: "Maintenance",
        icon: "wrench",
        feature: "maintenance",
        children: [
          {
            id: "maintenance-dashboard",
            label: "Dashboard",
            route: "/maintenance",
          },
          {
            id: "maintenance-records",
            label: "Service Records",
            route: "/maintenance/records",
          },
          {
            id: "maintenance-upcoming",
            label: "Upcoming Service",
            route: "/maintenance/upcoming",
          },
        ],
      },
      {
        id: "safety",
        label: "Safety",
        icon: "shield",
        feature: "safety",
        children: [
          {
            id: "safety-overview",
            label: "Overview",
            route: "/safety",
          },
          {
            id: "safety-dvir",
            label: "DVIR Reports",
            route: "/safety/dvir",
          },
          {
            id: "safety-accidents",
            label: "Accidents",
            route: "/safety/accidents",
          },
          {
            id: "safety-driver-behavior",
            label: "Driver Behavior",
            route: "/safety/driver-behavior",
          },
          {
            id: "safety-condition-reports",
            label: "Condition Reports",
            route: "/safety/condition-reports",
          },
        ],
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "payroll",
        label: "Payroll",
        icon: "wallet",
        feature: "payroll",
        children: [
          {
            id: "payroll-dashboard",
            label: "Dashboard",
            route: "/payroll",
          },
          {
            id: "payroll-invoices",
            label: "Invoices",
            route: "/payroll/invoices",
          },
          {
            id: "payroll-timesheets",
            label: "Timesheets",
            route: "/timesheets",
            feature: "timesheets",
          },
        ],
      },
      {
        id: "invoicing",
        label: "Invoicing",
        icon: "file-pen-line",
        feature: "invoices",
        children: [
          {
            id: "invoicing-dashboard",
            label: "Dashboard",
            route: "/invoices",
          },
          {
            id: "invoicing-loads",
            label: "Load Invoices",
            route: "/invoices/loads",
          },
        ],
      },
      {
        id: "expenses",
        label: "Expenses",
        icon: "banknote",
        feature: "expenses",
        children: [
          {
            id: "expenses-all",
            label: "All Expenses",
            route: "/expenses",
          },
          {
            id: "expenses-analytics",
            label: "Analytics",
            route: "/expenses/analytics",
          },
        ],
      },
      {
        id: "fuel-cards",
        label: "Fuel Cards",
        icon: "fuel",
        feature: "fuel_cards",
        children: [
          {
            id: "fuel-cards-transactions",
            label: "Transactions",
            route: "/fuel-cards",
          },
          {
            id: "fuel-cards-providers",
            label: "Providers",
            route: "/fuel-cards/providers",
          },
        ],
      },
    ],
  },
  {
    id: "people",
    label: "People & Partners",
    items: [
      {
        id: "employees",
        label: "Employees",
        icon: "users",
        route: "/employees",
        feature: "employees",
      },
      {
        id: "customers",
        label: "Customers",
        icon: "building-2",
        route: "/customers",
        feature: "customers",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    pinToBottom: true,
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: "settings",
        route: "/settings",
        // Children stay in the data for the command palette + stored favorites, but each is
        // `menuHidden` so the rendered menu shows Settings as a single link to the tabbed layout.
        children: [
          {
            id: "settings-company",
            label: "Company",
            route: "/settings/company",
            menuHidden: true,
          },
          {
            id: "settings-payments",
            label: "Payments",
            route: "/settings/payments",
            menuHidden: true,
          },
          {
            id: "settings-subscription",
            label: "Plan & Billing",
            route: "/subscription/manage",
            menuHidden: true,
          },
          {
            id: "settings-features",
            label: "Features",
            route: "/settings/features",
            menuHidden: true,
          },
          {
            id: "settings-api-keys",
            label: "API Keys",
            route: "/settings/api-keys",
            feature: "mcp_server",
            menuHidden: true,
          },
          {
            id: "settings-accounting",
            label: "Accounting",
            route: "/settings/accounting",
            feature: "accounting",
            menuHidden: true,
          },
          {
            id: "settings-privacy",
            label: "Privacy",
            route: "/settings/privacy",
            menuHidden: true,
          },
        ],
      },
    ],
  },
];
