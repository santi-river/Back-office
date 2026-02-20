"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Tipos de Estado para Publicaciones (solo ciclo de vida)
export type ListingStatus = 
  | "PENDIENTE_APROBACION" 
  | "ACTIVO" 
  | "PAUSADO" 
  | "ELIMINADO" 
  | "RECHAZADO"
  | "AGOTADO"

// Tipos de Estado para Órdenes de Compra (solo hasta entrega)
export type OrderPaymentStatus = "VERIFICAR_PAGO" | "VERIFICADO"
export type DeliveryStatus = "PENDIENTE" | "ENTREGADO"

// Estado de cada venta individual (por vendedor)
export type SaleStatus = 
  | "VERIFICAR_PAGO"           // Compró, se debe verificar pago
  | "PAGADO"                   // Pago verificado
  | "PENDIENTE_PAGO_VENDEDOR"  // Entregado, esperando pagar al vendedor
  | "COMPLETADO"               // Vendedor pagado

export interface Listing {
  id: string
  vendedor: string
  tokenType: string
  description: string
  pricePerUnit: number
  quantity: number
  quantitySold: number
  status: ListingStatus
  createdAt: Date
}

// Cada venta individual vinculada a una publicación
export interface Sale {
  id: string
  orderId: string // Orden de compra asociada
  listingId: string
  vendedor: string
  tokenType: string
  quantity: number
  pricePerUnit: number
  subtotal: number
  status: SaleStatus
  createdAt: Date
}

export interface PurchaseOrder {
  id: string
  tokenType: string
  comprador: string
  totalQuantity: number
  totalPrice: number
  paymentStatus: OrderPaymentStatus
  deliveryStatus: DeliveryStatus
  createdAt: Date
  saleIds: string[] // IDs de las ventas asociadas
}

interface TokenSummary {
  tokenType: string
  totalAvailable: number
  price: number
}

interface StoreContextType {
  listings: Listing[]
  purchases: PurchaseOrder[]
  sales: Sale[]
  addListing: (listing: Omit<Listing, "id" | "status" | "createdAt" | "quantitySold">) => void
  updateListingStatus: (listingId: string, status: ListingStatus) => void
  createPurchase: (tokenType: string, quantity: number, comprador: string) => void
  verifyPayment: (purchaseId: string) => void
  deliverProduct: (purchaseId: string) => void
  payVendorSale: (saleId: string) => void
  getTokenSummaries: () => TokenSummary[]
  getAvailableListingsForToken: (tokenType: string) => Listing[]
  getSalesForOrder: (orderId: string) => Sale[]
  getSalesForListing: (listingId: string) => Sale[]
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const tokenPrices: Record<string, number> = {
    RDU2: 150,
    ANS2: 85,
    LCH2: 220,
    PME2: 75,
  }

  const [listings, setListings] = useState<Listing[]>([
    {
      id: "PUB-001",
      vendedor: "Pablo Carranza",
      tokenType: "RDU2",
      description: "Reduccion de emisiones de dioxido de carbono",
      pricePerUnit: 150,
      quantity: 10,
      quantitySold: 0,
      status: "ACTIVO",
      createdAt: new Date("2024-01-05"),
    },
    {
      id: "PUB-002",
      vendedor: "María Bloco",
      tokenType: "RDU2",
      description: "RDU2 premium con garantia",
      pricePerUnit: 150,
      quantity: 5,
      quantitySold: 0,
      status: "ACTIVO",
      createdAt: new Date("2024-01-10"),
    },
    {
      id: "PUB-003",
      vendedor: "Fernando Vicuña",
      tokenType: "ANS2",
      description: "Token de gobernanza para plataforma descentralizada",
      pricePerUnit: 85,
      quantity: 20,
      quantitySold: 0,
      status: "ACTIVO",
      createdAt: new Date("2024-01-08"),
    },
    {
      id: "PUB-004",
      vendedor: "Maria Juls",
      tokenType: "LCH2",
      description: "Token de staking con rendimientos competitivos",
      pricePerUnit: 220,
      quantity: 8,
      quantitySold: 0,
      status: "ACTIVO",
      createdAt: new Date("2024-01-03"),
    },
    {
      id: "PUB-005",
      vendedor: "Juan Perez",
      tokenType: "PME2",
      description: "Token utilitario para ecosistema NFT",
      pricePerUnit: 75,
      quantity: 15,
      quantitySold: 0,
      status: "ACTIVO",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "PUB-006",
      vendedor: "Carlos Monzon",
      tokenType: "RDU2",
      description: "RDU2 de coleccion limitada",
      pricePerUnit: 150,
      quantity: 3,
      quantitySold: 0,
      status: "PENDIENTE_APROBACION",
      createdAt: new Date("2024-01-15"),
    },
  ])

  const [purchases, setPurchases] = useState<PurchaseOrder[]>([])
  const [sales, setSales] = useState<Sale[]>([])

  const addListing = (listingData: Omit<Listing, "id" | "status" | "createdAt" | "quantitySold">) => {
    const newListing: Listing = {
      ...listingData,
      id: `PUB-${Date.now()}`,
      status: "PENDIENTE_APROBACION",
      quantitySold: 0,
      createdAt: new Date(),
    }
    setListings((prev) => [newListing, ...prev])
  }

  const updateListingStatus = (listingId: string, status: ListingStatus) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status } : l))
    )
  }

  const getTokenSummaries = (): TokenSummary[] => {
    const activeListings = listings.filter(
      (l) => l.status === "ACTIVO" && l.quantity - l.quantitySold > 0
    )
    
    const tokenMap = new Map<string, TokenSummary>()
    
    for (const listing of activeListings) {
      const available = listing.quantity - listing.quantitySold
      const existing = tokenMap.get(listing.tokenType)
      
      if (existing) {
        existing.totalAvailable += available
      } else {
        tokenMap.set(listing.tokenType, {
          tokenType: listing.tokenType,
          totalAvailable: available,
          price: tokenPrices[listing.tokenType] || listing.pricePerUnit,
        })
      }
    }
    
    return Array.from(tokenMap.values())
  }

  const getAvailableListingsForToken = (tokenType: string): Listing[] => {
    return listings
      .filter(
        (l) =>
          l.tokenType === tokenType &&
          l.status === "ACTIVO" &&
          l.quantity - l.quantitySold > 0
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  const getSalesForOrder = (orderId: string): Sale[] => {
    return sales.filter((s) => s.orderId === orderId)
  }

  const getSalesForListing = (listingId: string): Sale[] => {
    return sales.filter((s) => s.listingId === listingId)
  }

  // Comprar X unidades de un token (FIFO)
  const createPurchase = (tokenType: string, quantity: number, comprador: string) => {
    const availableListings = getAvailableListingsForToken(tokenType)
    
    let remainingQuantity = quantity
    const newSales: Sale[] = []
    const listingsToUpdate: { id: string; quantitySold: number }[] = []
    const orderId = `OC-${Date.now()}`
    
    for (const listing of availableListings) {
      if (remainingQuantity <= 0) break
      
      const available = listing.quantity - listing.quantitySold
      const toTake = Math.min(available, remainingQuantity)
      
      // Crear una venta por cada vendedor afectado
      const saleId = `VTA-${Date.now()}-${listing.id}`
      newSales.push({
        id: saleId,
        orderId,
        listingId: listing.id,
        vendedor: listing.vendedor,
        tokenType: listing.tokenType,
        quantity: toTake,
        pricePerUnit: listing.pricePerUnit,
        subtotal: toTake * listing.pricePerUnit,
        status: "VERIFICAR_PAGO",
        createdAt: new Date(),
      })
      
      listingsToUpdate.push({
        id: listing.id,
        quantitySold: listing.quantitySold + toTake,
      })
      
      remainingQuantity -= toTake
    }
    
    if (newSales.length === 0) return
    
    const totalPrice = newSales.reduce((sum, s) => sum + s.subtotal, 0)
    const totalQuantity = newSales.reduce((sum, s) => sum + s.quantity, 0)
    
    const newPurchase: PurchaseOrder = {
      id: orderId,
      tokenType,
      comprador,
      totalQuantity,
      totalPrice,
      paymentStatus: "VERIFICAR_PAGO",
      deliveryStatus: "PENDIENTE",
      createdAt: new Date(),
      saleIds: newSales.map((s) => s.id),
    }
    
    setPurchases((prev) => [newPurchase, ...prev])
    setSales((prev) => [...newSales, ...prev])
    
    // Actualizar cantidades vendidas en las publicaciones y cambiar a AGOTADO si corresponde
    setListings((prev) =>
      prev.map((l) => {
        const update = listingsToUpdate.find((u) => u.id === l.id)
        if (update) {
          const newQuantitySold = update.quantitySold
          const isAgotado = newQuantitySold >= l.quantity
          return { 
            ...l, 
            quantitySold: newQuantitySold,
            status: isAgotado ? "AGOTADO" : l.status
          }
        }
        return l
      })
    )
  }

  // Verificar pago: actualiza ventas a PAGADO
  const verifyPayment = (purchaseId: string) => {
    const purchase = purchases.find((p) => p.id === purchaseId)
    if (!purchase) return

    setPurchases((prev) =>
      prev.map((p) => (p.id === purchaseId ? { ...p, paymentStatus: "VERIFICADO" } : p))
    )

    // Actualizar estado de las ventas asociadas
    setSales((prev) =>
      prev.map((s) => 
        purchase.saleIds.includes(s.id) && s.status === "VERIFICAR_PAGO"
          ? { ...s, status: "PAGADO" }
          : s
      )
    )
  }

  // Entregar producto: actualiza ventas a ENTREGADO y luego a PENDIENTE_PAGO_VENDEDOR
  const deliverProduct = (purchaseId: string) => {
    const purchase = purchases.find((p) => p.id === purchaseId)
    if (!purchase) return

    setPurchases((prev) =>
      prev.map((p) => (p.id === purchaseId ? { ...p, deliveryStatus: "ENTREGADO" } : p))
    )

    // Actualizar estado de las ventas: pasan a PENDIENTE_PAGO_VENDEDOR
    setSales((prev) =>
      prev.map((s) => 
        purchase.saleIds.includes(s.id) && s.status === "PAGADO"
          ? { ...s, status: "PENDIENTE_PAGO_VENDEDOR" }
          : s
      )
    )
  }

  // Pagar al vendedor: se hace por cada venta individual
  const payVendorSale = (saleId: string) => {
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: "COMPLETADO" } : s))
    )
  }

  return (
    <StoreContext.Provider
      value={{
        listings,
        purchases,
        sales,
        addListing,
        updateListingStatus,
        createPurchase,
        verifyPayment,
        deliverProduct,
        payVendorSale,
        getTokenSummaries,
        getAvailableListingsForToken,
        getSalesForOrder,
        getSalesForListing,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore debe usarse dentro de un StoreProvider")
  }
  return context
}
