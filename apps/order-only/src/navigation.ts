import { LayoutDashboardIcon, PackageIcon, UsersIcon, FileTextIcon, ClipboardCheckIcon } from "lucide-react"
import type { NavGroup } from "@frontend/auth"

export const NAV_GROUPS: NavGroup[] = [
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
]
