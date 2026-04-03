import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardCheck,
  BarChart3,
  TrendingUp,
  MessageCircle,
  Image,
  Settings,
  ChevronLeft,
  LogOut,
  Newspaper,
  Shield,
  Mail,
  Building2
} from "lucide-react";
import logo from "@/assets/logo.png";
import logoIcon from "@/assets/logo-icon.svg";
import { cn } from "@/lib/utils";
import { useSimpleRole } from "@/hooks/useSimpleRole";
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

const contentItems = [
  { title: "Calendrier", url: "/dashboard/calendar", icon: Calendar },
  { title: "Communications", url: "/dashboard/validate", icon: ClipboardCheck },
  { title: "Blog", url: "/blog", icon: Newspaper },
  { title: "Médiathèque", url: "/dashboard/media", icon: Image },
];

const channelsItems = [
  { title: "Google Business", url: "/google-business", icon: Building2 },
  { title: "Emailing", url: "/emailing", icon: Mail },
];

const insightsItems = [
  { title: "Performances", url: "/dashboard/metrics", icon: BarChart3 },
  { title: "Actualités juridiques", url: "/dashboard/trends", icon: TrendingUp },
];

const supportItems = [
  { title: "Conseiller éditorial", url: "/assistant", icon: MessageCircle },
];

const bottomNavItems = [
  { title: "Paramètres", url: "/dashboard/settings", icon: Settings },
];

interface NavGroup {
  label: string;
  items: typeof overviewItems;
}

const navGroups: NavGroup[] = [
  { label: "", items: overviewItems },
  { label: "Contenu", items: contentItems },
  { label: "Canaux", items: channelsItems },
  { label: "Analyse", items: insightsItems },
  { label: "Support", items: supportItems },
];

export function AppSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const { 
    isAdmin,
    isCommunityManager,
    isLawyer,
    canAccessAdmin,
    canViewCalendar,
    canAccessBlog,
    canAccessMedia,
    canAccessEmailing,
    canViewMetrics,
    isReadOnlyMode,
    loading: roleLoading 
  } = useSimpleRole();
  const collapsed = state === "collapsed";

  const canAccessGoogleBusiness = isLawyer || isCommunityManager;
  const canViewTrends = true;
  const canViewEditorialAdvice = true;
  const canModifySettings = isAdmin || isLawyer;
  const isDemoObserver = false;

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
        {navGroups.map((group, groupIndex) => {
          const filteredItems = group.items.filter(item => {
            switch (item.url) {
              case "/dashboard/calendar":
              case "/dashboard/validate":
                return canViewCalendar;
              case "/blog":
                return canAccessBlog;
              case "/dashboard/media":
                return canAccessMedia;
              case "/google-business":
                return canAccessGoogleBusiness;
              case "/emailing":
                return canAccessEmailing;
              case "/dashboard/metrics":
                return canViewMetrics;
              case "/dashboard/trends":
                return canViewTrends;
              case "/assistant":
                return canViewEditorialAdvice;
              default:
                return true;
            }
          });

          if (filteredItems.length === 0) return null;

          return (
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
                  {filteredItems.map((item) => (
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
          );
        })}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <Separator className="mb-2" />
        <SidebarMenu>
          {!roleLoading && canAccessAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin")}
                tooltip={collapsed ? "Administration" : undefined}
                  className={cn(
                    "w-full justify-start gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                    isActive("/admin")
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Link to="/admin">
                  <Shield className="h-4 w-4" />
                  {!collapsed && <span>Administration</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {!roleLoading && isReadOnlyMode && !collapsed && (
            <div className="mx-1 mb-1 px-2.5 py-1.5 rounded-md bg-muted text-xs text-muted-foreground font-medium">
              Mode lecture seule
            </div>
          )}
          
          {!roleLoading && isDemoObserver && !collapsed && (
            <div className="mx-1 mb-1 px-2.5 py-1.5 rounded-md bg-muted text-xs text-muted-foreground font-medium">
              Mode Démonstration
            </div>
          )}
          
          {canModifySettings && bottomNavItems.map((item) => (
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
