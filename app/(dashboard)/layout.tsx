import { cookies } from "next/headers";

import { getMe } from "@/service/getMe";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "./_components/DashboardNavbar";
import DashboardSidebar from "./_components/DashboardSidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const user = await getMe();

  // Restore whatever collapsed/expanded state the user last chose.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar user={user} />

        <SidebarInset className="min-w-0">
          <DashboardNavbar user={user} />

          {/* SidebarInset already renders the <main> landmark. */}
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
