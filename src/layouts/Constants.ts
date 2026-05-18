import { LayoutDashboardIcon, PackageIcon, UsersIcon, FileTextIcon, ClipboardCheckIcon, WalletIcon } from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Monitoring",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    ],
  },
  {
    label: "Transaction",
    items: [
      { to: "/leads", label: "Leads", icon: UsersIcon },
      { to: "/ekspedisi-inventory", label: "Ekspedisi Inventory", icon: PackageIcon },
      { to: "/fjb", label: "Faktur Jual Bengkel", icon: FileTextIcon },
      { to: "/pdi", label: "Pre Delivery Inspection", icon: ClipboardCheckIcon },
    ],
  },
  {
    label: "Master Data",
    items: [
      { to: "/master-service", label: "Master Service", icon: PackageIcon },
      { to: "/master-cabang", label: "Master Cabrera", icon: PackageIcon },
      { to: "/master-kas", label: "Master Kas", icon: WalletIcon },
    ],
  },
] as const;
