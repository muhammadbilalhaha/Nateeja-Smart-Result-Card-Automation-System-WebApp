"use client";

// ********************************** Library Imports ******************************************
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

// ********************************** Icon Imports ******************************************
import {
  LayoutDashboard,
  Eye,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

const Sidebar = () => {
  // ********************************** Router Hook ******************************************
  const pathname = usePathname();
  
  // ********************************** State Management ******************************************
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ********************************** Menu Items Configuration ******************************************
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Preview", icon: Eye, path: "/preview" },
    { name: "Generate", icon: Sparkles, path: "/generate" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  // ********************************** Mobile Toggle Button Component ******************************************
  const MobileToggle = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200"
    >
      {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );

  // ********************************** Component Render ******************************************
  return (
    <>
      {/* ********************************** Mobile Toggle ****************************************** */}
      <MobileToggle />

      {/* ********************************** Mobile Overlay ****************************************** */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ********************************** Sidebar Container ****************************************** */}
      <aside
        className={`fixed lg:static z-40 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* ********************************** Logo Section ****************************************** */}
        <div className={`border-b border-gray-200 flex items-center justify-center transition-all duration-300 ${
          isCollapsed ? "py-3 px-2" : "py-2 px-5"
        }`}>
          <div className={`transition-all duration-300 ${
            isCollapsed ? "scale-75" : "scale-100"
          }`}>
            <Image
              src="/logo.png"
              alt="Nateja Logo"
              width={isCollapsed ? 50 : 120}
              height={isCollapsed ? 50 : 120}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>

        {/* ********************************** Navigation Menu ****************************************** */}
        <nav className="flex-1 space-y-1 pt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-blue-50 text-[#0256b1] font-medium shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                {/* Menu Icon */}
                <Icon size={20} className="flex-shrink-0" />
                
                {/* ********************************** Tooltip (Collapsed State) ****************************************** */}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
                    {item.name}
                  </span>
                )}

                {/* Menu Label */}
                {!isCollapsed && (
                  <span className="text-sm">{item.name}</span>
                )}

                {/* ********************************** Active Indicator ****************************************** */}
                {isActive && !isCollapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0256b1]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ********************************** Collapse Toggle (Desktop) ****************************************** */}
        <div className="border-t border-gray-200 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;