import { LayoutDashboardIcon, PackageIcon, MapPinIcon, WalletIcon, LandmarkIcon } from "lucide-react"
import type { NavGroup } from "@frontend/auth"

export const NAV_GROUPS: NavGroup[] = [
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
      { to: "/master-cabang", label: "Master Cabang", icon: PackageIcon },
      { to: "/master-locator", label: "Master Locator", icon: MapPinIcon },
      { to: "/master-kas", label: "Master Kas", icon: WalletIcon },
      { to: "/master-coa", label: "Master COA", icon: LandmarkIcon },
    ],
  },
]
