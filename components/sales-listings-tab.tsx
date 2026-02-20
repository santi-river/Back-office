"use client"

import { useStore, type ListingStatus } from "@/lib/store"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, Pause, Trash2, MoreHorizontal, Play, XCircle } from "lucide-react"

const statusConfig: Record<ListingStatus, { label: string; className: string }> = {
  PENDIENTE_APROBACION: {
    label: "Pendiente",
    className: "bg-warning/10 text-warning",
  },
  ACTIVO: {
    label: "Activo",
    className: "bg-success/10 text-success",
  },
  PAUSADO: {
    label: "Pausado",
    className: "bg-muted text-muted-foreground",
  },
  ELIMINADO: {
    label: "Eliminado",
    className: "bg-destructive/10 text-destructive",
  },
  RECHAZADO: {
    label: "Rechazado",
    className: "bg-destructive/10 text-destructive",
  },
  AGOTADO: {
    label: "Agotado",
    className: "bg-muted text-muted-foreground",
  },
}

export function SalesListingsTab() {
  const { listings, updateListingStatus } = useStore()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Solicitudes de venta</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona las publicaciones de venta de tokens</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Vendedor</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Token</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Precio/u</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center">Cant.</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center">Vendidos</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center">Disp.</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Estado</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Fecha</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => {
                const config = statusConfig[listing.status]
                const isPending = listing.status === "PENDIENTE_APROBACION"
                const isActive = listing.status === "ACTIVO"
                const isPaused = listing.status === "PAUSADO"
                const isTerminal = listing.status === "ELIMINADO" || listing.status === "RECHAZADO" || listing.status === "AGOTADO"
                const available = listing.quantity - listing.quantitySold

                return (
                  <TableRow key={listing.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{listing.id}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{listing.vendedor}</TableCell>
                    <TableCell className="text-sm text-foreground">{listing.tokenType}</TableCell>
                    <TableCell className="text-right text-sm font-semibold tabular-nums text-foreground">${listing.pricePerUnit}</TableCell>
                    <TableCell className="text-center text-sm tabular-nums text-foreground">{listing.quantity}</TableCell>
                    <TableCell className="text-center text-sm tabular-nums text-foreground">{listing.quantitySold}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold tabular-nums text-foreground">{available}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={config.className}>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground tabular-nums">
                      {listing.createdAt.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-right">
                      {isTerminal ? (
                        <span className="text-xs text-muted-foreground">--</span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {isPending && (
                              <>
                                <DropdownMenuItem onClick={() => updateListingStatus(listing.id, "ACTIVO")} className="gap-2 cursor-pointer">
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  Aprobar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateListingStatus(listing.id, "RECHAZADO")} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                                  <XCircle className="h-4 w-4" />
                                  Rechazar
                                </DropdownMenuItem>
                              </>
                            )}
                            {isActive && (
                              <DropdownMenuItem onClick={() => updateListingStatus(listing.id, "PAUSADO")} className="gap-2 cursor-pointer">
                                <Pause className="h-4 w-4" />
                                Pausar
                              </DropdownMenuItem>
                            )}
                            {isPaused && (
                              <DropdownMenuItem onClick={() => updateListingStatus(listing.id, "ACTIVO")} className="gap-2 cursor-pointer">
                                <Play className="h-4 w-4 text-success" />
                                Reactivar
                              </DropdownMenuItem>
                            )}
                            {(isActive || isPaused) && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateListingStatus(listing.id, "ELIMINADO")} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
