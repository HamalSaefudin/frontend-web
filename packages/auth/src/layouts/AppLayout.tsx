import { Button, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger, useSidebar } from "@frontend/ui"
import { useLogoutMutation } from "../hooks";
import { NavLink, Outlet } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import "./AppLayout.css";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

function AppSidebar({ navGroups }: { navGroups: NavGroup[] }) {
  const { open } = useSidebar();
  const logoutMutation = useLogoutMutation();

  return (
    <Sidebar>
      <SidebarHeader>
        <span
          className={`text-base font-bold tracking-tight transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        >
          CRM
        </span>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} collapsible defaultOpen>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild tooltip={label}>
                    <NavLink
                      to={to}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-r-full before:bg-primary"
                          : ""
                      }
                    >
                      <Icon className="size-4 shrink-0" />
                      {open && <span className="truncate">{label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="secondary"
          size={open ? "default" : "icon"}
          loading={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
          className="w-full"
        >
          {open ? "Logout" : "⎋"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({ navGroups }: { navGroups: NavGroup[] }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar navGroups={navGroups} />

      <SidebarInset>
        <header className="sticky top-0 z-[50] flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger />
        </header>

        <div className="flex-1">
          <Outlet />
        </div>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} CRM. All rights reserved.</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
