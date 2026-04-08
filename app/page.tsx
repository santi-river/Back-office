"use client"

import React from "react"
import { useState } from "react"
import { StoreProvider } from "@/lib/store"
import { DashboardTab } from "@/components/dashboard-tab"
import { SalesListingsTab } from "@/components/sales-listings-tab"
import { PurchasesTab } from "@/components/purchases-tab"
import { VendorPaymentsTab } from "@/components/vendor-payments-tab"
import { LoginScreen } from "@/components/login-screen"
import { ListChecks, ShoppingBag, LayoutDashboard, DollarSign, LogOut } from "lucide-react"

type Tab = "dashboard" | "sales" | "purchases" | "payments"

interface User {
  email: string
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sales", label: "Ventas", icon: ListChecks },
  { id: "purchases", label: "Compras", icon: ShoppingBag },
  { id: "payments", label: "Pagos", icon: DollarSign },
]

function SidebarButton({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: React.ElementType
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center w-full px-1 rounded-md transition-all duration-150 gap-2.5 py-3.5 my-1.5 font-semibold ${
        active
          ? "bg-[#009BDB] text-white shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      <Icon className="h-[18px] w-5" />
      <span className="leading-none tracking-wide font-semibold text-base">{label}</span>
    </button>
  )
}

function AppContent({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-sidebar border-r border-sidebar-border flex flex-col items-center shrink-0 leading-7 w-40 shadow-xl">
        <div className="flex items-center justify-center mt-4 mb-5 overflow-hidden px-2">
          <img src="/logo-cordoba.png" alt="Gobierno de la Provincia de Cordoba" className="w-full h-auto object-contain" />
        </div>
        <nav className="flex flex-col gap-0.5 px-1.5 w-full">
          {tabs.map((tab) => (
            <SidebarButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              label={tab.label}
              icon={tab.icon}
            />
          ))}
        </nav>
        
        {/* User info and logout */}
        <div className="mt-auto mb-4 px-3 w-full">
          <div className="border-t border-sidebar-border pt-4">
            <p className="text-xs text-muted-foreground truncate mb-2 px-1" title={user.email}>
              {user.email}
            </p>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "sales" && <SalesListingsTab />}
          {activeTab === "purchases" && <PurchasesTab />}
          {activeTab === "payments" && <VendorPaymentsTab />}
        </div>
      </main>
    </div>
  )
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)

  const handleLoginSuccess = (email: string) => {
    setUser({ email })
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <StoreProvider>
      <AppContent user={user} onLogout={handleLogout} />
    </StoreProvider>
  )
}
