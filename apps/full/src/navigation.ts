import { LayoutDashboardIcon, PackageIcon, UsersIcon, FileTextIcon, ClipboardCheckIcon, WalletIcon, LandmarkIcon, MapPinIcon } from "lucide-react"
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
  {
    label: "Master Data",
    items: [
      { to: "/master-service", label: "Master Service", icon: PackageIcon },
      { to: "/master-cabang", label: "Master Cabang", icon: PackageIcon },
      { to: "/master-locator", label: "Master Locator", icon: MapPinIcon },
      { to: "/master-kas", label: "Master Kas", icon: WalletIcon },
      { to: "/master-coa", label: "Master COA", icon: LandmarkIcon },
    ],
  },
]
