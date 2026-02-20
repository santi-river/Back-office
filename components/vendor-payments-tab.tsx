"use client"

import { useStore, type SaleStatus } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DollarSign } from "lucide-react"

const statusConfig: Record<SaleStatus, { label: string; className: string }> = {
  VERIFICAR_PAGO: { label: "Verificar Pago", className: "bg-warning/10 text-warning" },
  PAGADO: { label: "Pagado", className: "bg-success/10 text-success" },
  PENDIENTE_PAGO_VENDEDOR: { label: "Pago Pendiente", className: "bg-warning/10 text-warning" },
  COMPLETADO: { label: "Completado", className: "bg-success/10 text-success" },
}

export function VendorPaymentsTab() {
  const { sales, payVendorSale } = useStore()
  const pendingPaymentSales = sales.filter((s) => s.status === "PENDIENTE_PAGO_VENDEDOR")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pago a vendedores</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona los pagos pendientes y el historial</p>
      </div>

      {/* Pending payments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Pendientes de pago</h2>
          {pendingPaymentSales.length > 0 && (
            <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
              {pendingPaymentSales.length}
            </span>
          )}
        </div>

        {pendingPaymentSales.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                <DollarSign className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-1">Sin pagos pendientes</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                No hay ventas esperando pago al vendedor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider">ID Venta</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Orden</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Publicacion</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Vendedor</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Token</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-right">Cant.</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-right">Subtotal</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Estado</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-right">Accion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPaymentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{sale.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{sale.orderId}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{sale.listingId}</TableCell>
                      <TableCell className="text-sm font-medium text-foreground">{sale.vendedor}</TableCell>
                      <TableCell className="text-sm text-foreground">{sale.tokenType}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums">{sale.quantity}</TableCell>
                      <TableCell className="text-right text-sm font-semibold tabular-nums">${sale.subtotal}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusConfig[sale.status].className}>
                          {statusConfig[sale.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => payVendorSale(sale.id)} className="gap-1.5 text-xs">
                          <DollarSign className="h-3.5 w-3.5" />
                          Pagar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* History */}
      {sales.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Historial de ventas</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider">ID Venta</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Orden</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Vendedor</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Token</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-right">Cant.</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-right">Subtotal</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{sale.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{sale.orderId}</TableCell>
                      <TableCell className="text-sm font-medium text-foreground">{sale.vendedor}</TableCell>
                      <TableCell className="text-sm text-foreground">{sale.tokenType}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums">{sale.quantity}</TableCell>
                      <TableCell className="text-right text-sm font-semibold tabular-nums">${sale.subtotal}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusConfig[sale.status].className}>
                          {statusConfig[sale.status].label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
