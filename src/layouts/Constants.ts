import { LayoutDashboardIcon, PackageIcon, WalletIcon } from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Monitoring",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
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