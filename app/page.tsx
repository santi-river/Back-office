"use client"

import React from "react"
import { useState } from "react"
import { StoreProvider } from "@/lib/store"
import { DashboardTab } from "@/components/dashboard-tab"
import { MarketplaceTab } from "@/components/marketplace-tab"
import { SalesListingsTab } from "@/components/sales-listings-tab"
import { PurchasesTab } from "@/components/purchases-tab"
import { VendorPaymentsTab } from "@/components/vendor-payments-tab"
import { ListChecks, ShoppingBag, LayoutDashboard, DollarSign, Store } from "lucide-react"

type Tab = "marketplace" | "dashboard" | "sales" | "purchases" | "payments"

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "marketplace", label: "Marketplace", icon: Store },
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

function AppContent() {
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
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {activeTab === "marketplace" && <MarketplaceTab />}
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
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
