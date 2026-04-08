"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShoppingCart, Package, CheckCircle, User } from "lucide-react"
import { useState } from "react"

export function MarketplaceTab() {
  const { getTokenSummaries, createPurchase } = useStore()
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [purchasedToken, setPurchasedToken] = useState<string | null>(null)

  const compradorActual = "Empresa SA"
  const tokenSummaries = getTokenSummaries()

  const handleBuy = () => {
    if (!selectedToken || quantity < 1) return
    createPurchase(selectedToken, quantity, compradorActual)
    setPurchasedToken(selectedToken)
    setSelectedToken(null)
    setQuantity(1)
    setTimeout(() => setPurchasedToken(null), 2000)
  }

  const selectedTokenData = selectedToken
    ? tokenSummaries.find((t) => t.tokenType === selectedToken)
    : null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">Mercado de tokens disponibles</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Comprando como:</span>
          <span className="font-medium text-foreground">{compradorActual}</span>
        </div>
      </div>

      {tokenSummaries.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider">Token</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Disponibles</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Precio</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenSummaries.map((token) => (
                  <TableRow key={token.tokenType}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{token.tokenType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold tabular-nums text-foreground bg-muted px-2.5 py-1 rounded-md inline-block min-w-[2.5rem] text-center">
                        {token.totalAvailable}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-foreground tabular-nums">${token.price}</span>
                      <span className="text-muted-foreground text-xs ml-1">/u</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => {
                          setSelectedToken(token.tokenType)
                          setQuantity(1)
                        }}
                        disabled={purchasedToken === token.tokenType}
                        size="sm"
                        variant={purchasedToken === token.tokenType ? "secondary" : "default"}
                        className="gap-1.5 text-xs"
                      >
                        {purchasedToken === token.tokenType ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Comprado
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Comprar
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
              <Package className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">No hay tokens disponibles</h3>
            <p className="text-sm text-muted-foreground max-w-xs text-center">
              Actualmente no hay tokens activos en el mercado.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={selectedToken !== null} onOpenChange={() => setSelectedToken(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comprar {selectedToken}</DialogTitle>
            <DialogDescription>
              Disponibles: {selectedTokenData?.totalAvailable} unidades a ${selectedTokenData?.price} c/u
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cantidad a comprar</label>
              <Input
                type="number"
                min={1}
                max={selectedTokenData?.totalAvailable || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-lg text-foreground ml-1">
                  ${selectedTokenData ? (selectedTokenData.price * quantity).toFixed(2) : 0}
                </span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedToken(null)}>Cancelar</Button>
            <Button
              onClick={handleBuy}
              disabled={quantity < 1 || quantity > (selectedTokenData?.totalAvailable || 0)}
            >
              Confirmar compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
