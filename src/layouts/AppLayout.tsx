import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/use-sidebar";
import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";
import { NAV_GROUPS } from "./Constants";

function AppSidebar() {
  const { open } = useSidebar();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

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
        {NAV_GROUPS.map((group) => (
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
          className="w-full"
          onClick={() => logout()}
        >
          {open ? "Logout" : "⎋"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset>
        {/* Top bar with sidebar toggle — sticky at the top of the page area */}
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
