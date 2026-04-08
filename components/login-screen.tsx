"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { ArrowRight, ArrowLeft, Loader2, Shield, Leaf } from "lucide-react"

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero with forest image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80"
          alt="Bosque"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white" />
        
        {/* Logo centered on hero */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white drop-shadow-lg">Marketplace</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start">
          {/* Left side - Info */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight text-balance">
              Compra y vende creditos de carbono de proyectos de conservacion verificados
            </h2>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Accede al marketplace lider de creditos de carbono. Conecta con proyectos de conservacion ambiental certificados y contribuye a un futuro sostenible.
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-center gap-6">
              <div className="pr-6 border-r border-gray-200">
                <p className="text-2xl font-bold text-teal-600">45,672</p>
                <p className="text-sm text-gray-500">tCO₂ disponibles</p>
              </div>
              <div className="pr-6 border-r border-gray-200">
                <p className="text-2xl font-bold text-teal-600">$2.4M</p>
                <p className="text-sm text-gray-500">Market Cap</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">12</p>
                <p className="text-sm text-gray-500">Proyectos</p>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div className="w-full max-w-sm">
            <Card className="shadow-lg border border-gray-100">
              <CardContent className="p-6">
                {step === "email" ? (
                  <div className="flex flex-col gap-5">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900">Bienvenido</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Ingresa tu correo electronico para acceder
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo Electronico
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="nombre@empresa.com"
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
                          className="h-11 pr-10 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}

                    <Button 
                      onClick={handleSendCode} 
                      disabled={isLoading || !email}
                      className="h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar codigo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Autenticacion segura con Web3Auth</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors w-fit"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver
                    </button>

                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900">Verificar codigo</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Enviamos un codigo de 6 digitos a
                      </p>
                      <p className="text-sm font-medium text-gray-700">{email}</p>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
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
                          <InputOTPSlot index={0} className="h-11 w-11 text-lg border-gray-200" />
                          <InputOTPSlot index={1} className="h-11 w-11 text-lg border-gray-200" />
                          <InputOTPSlot index={2} className="h-11 w-11 text-lg border-gray-200" />
                          <InputOTPSlot index={3} className="h-11 w-11 text-lg border-gray-200" />
                          <InputOTPSlot index={4} className="h-11 w-11 text-lg border-gray-200" />
                          <InputOTPSlot index={5} className="h-11 w-11 text-lg border-gray-200" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <Button 
                      onClick={handleVerifyCode} 
                      disabled={isLoading || otp.length !== 6}
                      className="h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          Verificar codigo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <button
                      onClick={handleSendCode}
                      disabled={isLoading}
                      className="text-sm text-teal-600 hover:text-teal-700 transition-colors disabled:opacity-50"
                    >
                      Reenviar codigo
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Autenticacion segura con Web3Auth</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6">
        <p className="text-center text-sm text-gray-400">
          2026 Marketplace de Creditos de Carbono. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
