import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2,
  Calendar,
  PenSquare,
  FolderOpen,
  Image,
  BarChart3,
  Settings,
  ClipboardList,
  ClipboardCheck,
  User,
  LogOut,
  ChevronLeft
} from "lucide-react";
import logo from "@/assets/logo.png";
import logoIcon from "@/assets/logo-icon.svg";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const overviewItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const firmsItems = [
  { title: "Mes Cabinets", url: "/dashboard/cabinets", icon: Building2 },
];

const editorialItems = [
  { title: "Calendrier éditorial", url: "/dashboard/calendar", icon: Calendar },
  { title: "Créer un post", url: "/dashboard/editor", icon: PenSquare },
  { title: "À valider", url: "/dashboard/validate", icon: ClipboardCheck },
  { title: "Bibliothèque de contenus", url: "/cm/content", icon: FolderOpen },
  { title: "Médiathèque", url: "/dashboard/media", icon: Image },
];

const analysisItems = [
  { title: "Performances", url: "/dashboard/metrics", icon: BarChart3 },
];

const settingsItems = [
  { title: "Paramètres cabinet", url: "/cm/firm-settings", icon: Settings },
  { title: "Mes demandes", url: "/cm/requests", icon: ClipboardList },
];

const accountItems = [
  { title: "Mon profil", url: "/dashboard/profile", icon: User },
];

interface NavGroup {
  label: string;
  items: typeof overviewItems;
}

const cmNavGroups: NavGroup[] = [
  { label: "", items: overviewItems },
  { label: "Cabinets", items: firmsItems },
  { label: "Éditorial", items: editorialItems },
  { label: "Analyse", items: analysisItems },
  { label: "Cabinet", items: settingsItems },
  { label: "Compte", items: accountItems },
];

export function CMSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar 
      className={cn(
        "border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-14" : "w-56"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img 
              src={collapsed ? logoIcon : logo} 
              alt="SocialPulse" 
              className={cn(
                "object-contain transition-all",
                collapsed ? "h-8 w-8" : "h-16"
              )} 
            />
          </Link>
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {cmNavGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className={groupIndex > 0 ? "mt-1" : ""}>
            {group.label && !collapsed && (
              <SidebarGroupLabel className="px-2 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest mb-0.5">
                {group.label}
              </SidebarGroupLabel>
            )}
            {group.label && collapsed && groupIndex > 0 && (
              <Separator className="my-1.5 mx-1" />
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={collapsed ? item.title : undefined}
                      className={cn(
                        "w-full justify-start gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <Separator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={collapsed ? "Déconnexion" : undefined}
              className="w-full justify-start gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-destructive/8 hover:text-destructive transition-colors"
            >
              <Link to="/login">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Déconnexion</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
