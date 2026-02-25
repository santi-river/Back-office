"use client"

import React, { Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { StoreProvider } from "@/lib/store"
import { DashboardTab } from "@/components/dashboard-tab"
import { SalesListingsTab } from "@/components/sales-listings-tab"
import { PurchasesTab } from "@/components/purchases-tab"
import { VendorPaymentsTab } from "@/components/vendor-payments-tab"
import { ListChecks, ShoppingBag, LayoutDashboard, DollarSign } from "lucide-react"

type Tab = "dashboard" | "sales" | "purchases" | "payments"

const validTabs: Tab[] = ["dashboard", "sales", "purchases", "payments"]

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
      <Icon className="h-[18px] w-5" aria-hidden="true" />
      <span className="leading-none tracking-wide font-semibold text-base">{label}</span>
    </button>
  )
}

function AppContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tabParam = searchParams.get("tab")
  const activeTab: Tab = tabParam && validTabs.includes(tabParam as Tab) ? (tabParam as Tab) : "dashboard"

  const setActiveTab = useCallback((tab: Tab) => {
    if (tab === "dashboard") {
      router.replace("/")
    } else {
      router.replace(`/?tab=${tab}`)
    }
  }, [router])

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-sidebar border-r border-sidebar-border flex flex-col items-center shrink-0 leading-7 w-40 shadow-xl">
        <div className="flex items-center justify-center mt-4 mb-5 overflow-hidden px-2">
          <img src="/logo-cordoba.png" alt="Gobierno de la Provincia de Cordoba" className="w-full h-auto object-contain" width={144} height={80} />
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
      <main className="flex-1 overflow-auto min-w-0">
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
  return (
    <StoreProvider>
      <Suspense>
        <AppContent />
      </Suspense>
    </StoreProvider>
  )
}
