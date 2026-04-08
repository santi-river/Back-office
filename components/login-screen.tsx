"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, ArrowLeft, Loader2, ArrowRight, Leaf } from "lucide-react"

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

  const stats = [
    { value: "45,672", label: "tCO₂ disponibles", color: "text-teal-600" },
    { value: "$2.4M", label: "Market Cap", color: "text-teal-600" },
    { value: "12", label: "Proyectos", color: "text-teal-600" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section with Forest Image */}
      <div className="relative h-56 md:h-64 w-full overflow-hidden">
        <img
          src="/images/cordoba-forest.jpg"
          alt="Bosques de Córdoba"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-white" />
        
        {/* Logo centered on hero */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Marketplace
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 md:gap-16 items-center md:items-start">
          {/* Left Side - Info */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Compra y vende creditos de carbono de proyectos de conservacion verificados
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Accede al marketplace lider de creditos de carbono. Conecta con proyectos de conservacion ambiental certificados y contribuye a un futuro sostenible.
            </p>
            
            {/* Stats */}
            <div className="flex items-center gap-6">
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div>
                    <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="h-12 w-px bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {step === "email" ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Bienvenido
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Ingresa tu correo electronico para acceder
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
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
                          className="h-12 pl-4 pr-10 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                          disabled={isLoading}
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}

                    <Button 
                      onClick={handleSendCode} 
                      disabled={isLoading || !email}
                      className="h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar codigo
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                        <path strokeWidth="1.5" d="M12 6v6l4 2" />
                      </svg>
                      Autenticacion segura con Web3Auth
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </button>

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Verificar codigo
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Enviamos un codigo de 6 digitos a
                    </p>
                    <p className="text-teal-600 font-medium text-sm">{email}</p>
                  </div>

                  <div className="flex flex-col gap-4">
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
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="h-12 w-12 text-lg rounded-lg border-gray-200" />
                          <InputOTPSlot index={1} className="h-12 w-12 text-lg rounded-lg border-gray-200" />
                          <InputOTPSlot index={2} className="h-12 w-12 text-lg rounded-lg border-gray-200" />
                          <InputOTPSlot index={3} className="h-12 w-12 text-lg rounded-lg border-gray-200" />
                          <InputOTPSlot index={4} className="h-12 w-12 text-lg rounded-lg border-gray-200" />
                          <InputOTPSlot index={5} className="h-12 w-12 text-lg rounded-lg border-gray-200" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <Button 
                      onClick={handleVerifyCode} 
                      disabled={isLoading || otp.length !== 6}
                      className="h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        "Verificar codigo"
                      )}
                    </Button>

                    <button
                      onClick={handleSendCode}
                      disabled={isLoading}
                      className="text-sm text-teal-600 hover:text-teal-700 transition-colors text-center"
                    >
                      Reenviar codigo
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        <p>2026 Marketplace de Creditos de Carbono. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
