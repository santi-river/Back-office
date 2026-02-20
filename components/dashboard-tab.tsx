"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  ShoppingBag,
  ListChecks,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react"

export function DashboardTab() {
  const { listings, purchases, sales } = useStore()

  const listingStats = {
    total: listings.length,
    pendientes: listings.filter((l) => l.status === "PENDIENTE_APROBACION").length,
    activas: listings.filter((l) => l.status === "ACTIVO").length,
    agotadas: listings.filter((l) => l.status === "AGOTADO").length,
    pausadas: listings.filter((l) => l.status === "PAUSADO").length,
  }

  const orderStats = {
    total: purchases.length,
    verificarPago: purchases.filter((p) => p.paymentStatus === "VERIFICAR_PAGO").length,
    pendientesEntrega: purchases.filter(
      (p) => p.paymentStatus === "VERIFICADO" && p.deliveryStatus === "PENDIENTE"
    ).length,
    completadas: purchases.filter((p) => p.deliveryStatus === "ENTREGADO").length,
  }

  const saleStats = {
    total: sales.length,
    verificarPago: sales.filter((s) => s.status === "VERIFICAR_PAGO").length,
    pendientesPagoVendedor: sales.filter((s) => s.status === "PENDIENTE_PAGO_VENDEDOR").length,
    completadas: sales.filter((s) => s.status === "COMPLETADO").length,
  }

  const totalVentas = sales.reduce((sum, s) => sum + s.subtotal, 0)
  const pendientePagarVendedores = sales
    .filter((s) => s.status === "PENDIENTE_PAGO_VENDEDOR")
    .reduce((sum, s) => sum + s.subtotal, 0)
  const pagadoVendedores = sales
    .filter((s) => s.status === "COMPLETADO")
    .reduce((sum, s) => sum + s.subtotal, 0)

  const pendingTasks = [
    ...listings
      .filter((l) => l.status === "PENDIENTE_APROBACION")
      .map((l) => ({
        type: "publicacion" as const,
        id: l.id,
        description: `Aprobar publicacion de ${l.vendedor}`,
        detail: `${l.quantity} ${l.tokenType}`,
        date: l.createdAt,
        priority: 1,
      })),
    ...purchases
      .filter((p) => p.paymentStatus === "VERIFICAR_PAGO")
      .map((p) => ({
        type: "orden" as const,
        id: p.id,
        description: `Verificar pago de ${p.comprador}`,
        detail: `${p.totalQuantity} ${p.tokenType} - $${p.totalPrice.toLocaleString()}`,
        date: p.createdAt,
        priority: 2,
      })),
    ...purchases
      .filter((p) => p.paymentStatus === "VERIFICADO" && p.deliveryStatus === "PENDIENTE")
      .map((p) => ({
        type: "entrega" as const,
        id: p.id,
        description: `Liberar token a ${p.comprador}`,
        detail: `${p.totalQuantity} ${p.tokenType}`,
        date: p.createdAt,
        priority: 3,
      })),
    ...sales
      .filter((s) => s.status === "PENDIENTE_PAGO_VENDEDOR")
      .map((s) => ({
        type: "pago_vendedor" as const,
        id: s.id,
        description: `Pagar a ${s.vendedor}`,
        detail: `${s.quantity} ${s.tokenType} - $${s.subtotal.toLocaleString()}`,
        date: s.createdAt,
        priority: 4,
      })),
  ].sort((a, b) => a.priority - b.priority || b.date.getTime() - a.date.getTime())

  const recentCompleted = [
    ...purchases
      .filter((p) => p.deliveryStatus === "ENTREGADO")
      .map((p) => ({
        type: "entrega_completada" as const,
        id: p.id,
        description: `Entregado a ${p.comprador}`,
        detail: `${p.totalQuantity} ${p.tokenType}`,
        date: p.createdAt,
      })),
    ...sales
      .filter((s) => s.status === "COMPLETADO")
      .map((s) => ({
        type: "pago_completado" as const,
        id: s.id,
        description: `Pagado a ${s.vendedor}`,
        detail: `$${s.subtotal.toLocaleString()}`,
        date: s.createdAt,
      })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  const operacionConfig: Record<string, string> = {
    "Solicitud de venta": "bg-warning/10 text-warning",
    "Solicitud de compra": "bg-success/10 text-success",
    "Pago a vendedores": "bg-chart-1/10 text-chart-1",
  }

  const taskTypeConfig = {
    publicacion: { label: "Publicacion", className: "bg-warning/10 text-warning", operacion: "Solicitud de venta" },
    orden: { label: "Verificar Pago", className: "bg-warning/10 text-warning", operacion: "Solicitud de compra" },
    entrega: { label: "Liberar", className: "bg-success/10 text-success", operacion: "Solicitud de compra" },
    pago_vendedor: { label: "Pago Vendedor", className: "bg-chart-1/10 text-chart-1", operacion: "Pago a vendedores" },
    entrega_completada: { label: "Entregado", className: "bg-success/10 text-success", operacion: "Solicitud de compra" },
    pago_completado: { label: "Pagado", className: "bg-chart-1/10 text-chart-1", operacion: "Pago a vendedores" },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen general de operaciones</p>
      </div>

      {/* Pending tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Tareas pendientes</h2>
          </div>
          {pendingTasks.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {pendingTasks.length}
            </span>
          )}
        </div>
        <Card>
          <CardContent className="p-0">
            {pendingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-success/60 mb-3" />
                <p className="text-sm text-muted-foreground">No hay tareas pendientes</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider">Operacion</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Tipo</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Descripcion</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTasks.slice(0, 10).map((task) => (
                    <TableRow key={`${task.type}-${task.id}`}>
                      <TableCell>
                        <Badge variant="secondary" className={`${operacionConfig[taskTypeConfig[task.type].operacion]} font-medium text-xs`}>
                          {taskTypeConfig[task.type].operacion}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${taskTypeConfig[task.type].className} font-medium text-xs`}>
                          {taskTypeConfig[task.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{task.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{task.detail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completed activity */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Actividad completada</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            {recentCompleted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider">Operacion</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Tipo</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Descripcion</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCompleted.map((item) => (
                    <TableRow key={`${item.type}-${item.id}`}>
                      <TableCell>
                        <Badge variant="secondary" className={`${operacionConfig[taskTypeConfig[item.type].operacion]} font-medium text-xs`}>
                          {taskTypeConfig[item.type].operacion}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${taskTypeConfig[item.type].className} font-medium text-xs`}>
                          {taskTypeConfig[item.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{item.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{item.detail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Publicaciones activas
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground tracking-tight">{listingStats.activas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {listingStats.pendientes} pendientes de aprobacion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ordenes pendientes
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground tracking-tight">
              {orderStats.verificarPago + orderStats.pendientesEntrega}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {orderStats.verificarPago} verificar pago, {orderStats.pendientesEntrega} entregas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pagos a vendedores
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground tracking-tight">
              ${pendientePagarVendedores.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {saleStats.pendientesPagoVendedor} ventas pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total vendido
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground tracking-tight">
              ${totalVentas.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${pagadoVendedores.toLocaleString()} pagado a vendedores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary by status */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Publicaciones por estado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { label: "Activas", value: listingStats.activas, color: "text-success" },
              { label: "Pendientes", value: listingStats.pendientes, color: "text-warning" },
              { label: "Agotadas", value: listingStats.agotadas, color: "text-muted-foreground" },
              { label: "Pausadas", value: listingStats.pausadas, color: "text-muted-foreground" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-semibold tabular-nums ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ordenes de compra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { label: "Completadas", value: orderStats.completadas, color: "text-success" },
              { label: "Pendientes entrega", value: orderStats.pendientesEntrega, color: "text-warning" },
              { label: "Verificar pago", value: orderStats.verificarPago, color: "text-warning" },
              { label: "Total", value: orderStats.total, color: "text-foreground" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-semibold tabular-nums ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ventas (pagos vendedores)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { label: "Completadas", value: saleStats.completadas, color: "text-success" },
              { label: "Pend. pago vendedor", value: saleStats.pendientesPagoVendedor, color: "text-warning" },
              { label: "Verificar pago", value: saleStats.verificarPago, color: "text-warning" },
              { label: "Total", value: saleStats.total, color: "text-foreground" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-semibold tabular-nums ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
