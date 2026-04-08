"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react"

type LoginStep = "email" | "otp"

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [step, setStep] = useState<LoginStep>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setError("Por favor, ingresa un email valido")
      return
    }

    setError("")
    setIsLoading(true)

    // Simular envio de codigo Web3Auth
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("otp")
  }

  const handleVerifyCode = async () => {
    if (otp.length !== 6) {
      setError("Por favor, ingresa el codigo completo")
      return
    }

    setError("")
    setIsLoading(true)

    // Simular verificacion Web3Auth
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    onLoginSuccess(email)
  }

  const handleBack = () => {
    setStep("email")
    setOtp("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c%C3%B3rdoba%20azul%201-TDUbA6xdAa6bR5K0OwlO7MBPEGqtcI.png" 
            alt="Gobierno de la Provincia de Cordoba" 
            className="h-12 w-auto object-contain"
          />
          <div className="h-8 w-px bg-border" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">Marketplace - Programa de atributos ambientales de Cordoba</h1>
            <p className="text-sm text-muted-foreground">Portal de Compradores</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009BDB]/10">
              {step === "email" ? (
                <Mail className="h-7 w-7 text-[#009BDB]" />
              ) : (
                <ShieldCheck className="h-7 w-7 text-[#009BDB]" />
              )}
            </div>
            <CardTitle className="text-2xl font-semibold">
              {step === "email" ? "Iniciar sesion" : "Verificar codigo"}
            </CardTitle>
            <CardDescription className="text-base">
              {step === "email" 
                ? "Ingresa tu email para recibir un codigo de verificacion" 
                : `Enviamos un codigo de 6 digitos a ${email}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            {step === "email" ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendCode()
                      }
                    }}
                    className="h-11"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button 
                  onClick={handleSendCode} 
                  disabled={isLoading || !email}
                  className="h-11 bg-[#009BDB] hover:bg-[#0088c2] text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando codigo...
                    </>
                  ) : (
                    "Enviar codigo"
                  )}
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Autenticacion segura
                    </span>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Utilizamos Web3Auth para verificar tu identidad de forma segura sin necesidad de contrasenas.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cambiar email
                </button>

                <div className="flex flex-col gap-2 items-center">
                  <label className="text-sm font-medium text-foreground self-start">
                    Codigo de verificacion
                  </label>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value)
                      setError("")
                    }}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                      <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <Button 
                  onClick={handleVerifyCode} 
                  disabled={isLoading || otp.length !== 6}
                  className="h-11 bg-[#009BDB] hover:bg-[#0088c2] text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar codigo"
                  )}
                </Button>

                <button
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="text-sm text-[#009BDB] hover:text-[#0088c2] transition-colors disabled:opacity-50"
                >
                  Reenviar codigo
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>Gobierno de la Provincia de Cordoba</p>
          <p>Mercado de Servicios Digitales</p>
        </div>
      </footer>
    </div>
  )
}
