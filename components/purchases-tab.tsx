"use client"

import { useStore, type SaleStatus } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ShoppingBag, MoreHorizontal, CheckCircle, Package, ArrowRight, ChevronDown, Users } from "lucide-react"
import { useState } from "react"

function PaymentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    VERIFICAR_PAGO: { label: "Verificar Pago", className: "bg-warning/10 text-warning" },
    VERIFICADO: { label: "Verificado", className: "bg-success/10 text-success" },
  }
  const c = config[status]
  return c ? <Badge variant="secondary" className={c.className}>{c.label}</Badge> : null
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    PENDIENTE: { label: "Pendiente", className: "bg-muted text-muted-foreground" },
    ENTREGADO: { label: "Entregado", className: "bg-success/10 text-success" },
  }
  const c = config[status]
  return c ? <Badge variant="secondary" className={c.className}>{c.label}</Badge> : null
}

function SaleStatusBadge({ status }: { status: SaleStatus }) {
  const config: Record<SaleStatus, { label: string; className: string }> = {
    VERIFICAR_PAGO: { label: "Verificar Pago", className: "bg-warning/10 text-warning" },
    PAGADO: { label: "Pagado", className: "bg-success/10 text-success" },
    PENDIENTE_PAGO_VENDEDOR: { label: "Pago Vendedor", className: "bg-warning/10 text-warning" },
    COMPLETADO: { label: "Completado", className: "bg-success/10 text-success" },
  }
  const c = config[status]
  return <Badge variant="secondary" className={c.className}>{c.label}</Badge>
}

export function PurchasesTab() {
  const { purchases, sales, verifyPayment, deliverProduct, getSalesForOrder } = useStore()
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  const toggleExpanded = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev)
      if (next.has(orderId)) next.delete(orderId)
      else next.add(orderId)
      return next
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Ordenes de compra</h1>
        <p className="text-sm text-muted-foreground mt-1">Administra las ordenes hasta la entrega del producto</p>
      </div>

      {/* Flow */}
      <div className="flex items-center gap-2 text-xs px-4 py-3 bg-muted/50 rounded-md">
        <span className="text-muted-foreground font-medium">Flujo:</span>
        <span className="px-2 py-0.5 rounded bg-warning/10 text-warning font-medium">Verificar Pago</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-medium">Liberar Token</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <span className="px-2 py-0.5 rounded bg-success/10 text-success font-medium">Completado</span>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">Sin ordenes</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Cuando los clientes realicen compras, apareceran aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase) => {
            const orderSales = getSalesForOrder(purchase.id)
            const canVerify = purchase.paymentStatus === "VERIFICAR_PAGO"
            const canDeliver = purchase.paymentStatus === "VERIFICADO" && purchase.deliveryStatus === "PENDIENTE"
            const isComplete = purchase.deliveryStatus === "ENTREGADO"
            const isExpanded = expandedOrders.has(purchase.id)

            return (
              <Card key={purchase.id} className="py-0">
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(purchase.id)}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{purchase.id}</span>
                            <Badge variant="secondary" className="text-xs">{purchase.tokenType}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Comprador: <span className="text-foreground font-medium">{purchase.comprador}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-base font-bold tabular-nums text-foreground">${purchase.totalPrice}</p>
                          <p className="text-xs text-muted-foreground tabular-nums">{purchase.totalQuantity} unidades</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PaymentStatusBadge status={purchase.paymentStatus} />
                          <DeliveryStatusBadge status={purchase.deliveryStatus} />
                        </div>
                        {isComplete ? (
                          <Badge variant="secondary" className="bg-success/10 text-success">Completado</Badge>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel className="text-xs text-muted-foreground">Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled={!canVerify} onClick={() => verifyPayment(purchase.id)} className="cursor-pointer gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Verificar Pago
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={!canDeliver} onClick={() => deliverProduct(purchase.id)} className="cursor-pointer gap-2">
                                <Package className="h-4 w-4" />
                                Liberar Token
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="border-t border-border px-4 pb-4">
                      <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>Desglose por vendedor (FIFO)</span>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="text-xs uppercase tracking-wider">ID Venta</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider">Publicacion</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider">Vendedor</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-right">Cant.</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-right">Precio/u</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-right">Subtotal</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider">Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderSales.map((sale) => (
                            <TableRow key={sale.id}>
                              <TableCell className="font-mono text-xs text-muted-foreground">{sale.id}</TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">{sale.listingId}</TableCell>
                              <TableCell className="text-sm font-medium text-foreground">{sale.vendedor}</TableCell>
                              <TableCell className="text-right text-sm tabular-nums">{sale.quantity}</TableCell>
                              <TableCell className="text-right text-sm tabular-nums">${sale.pricePerUnit}</TableCell>
                              <TableCell className="text-right text-sm font-semibold tabular-nums">${sale.subtotal}</TableCell>
                              <TableCell><SaleStatusBadge status={sale.status} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
