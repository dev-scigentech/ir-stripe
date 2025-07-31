"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ExternalLink, Mail, Check, Phone, AlertCircle } from "lucide-react"

// Actual Stripe products data with euro pricing
const stripeProducts = [
  {
    id: 1,
    name: "Instarate Plan - €100",
    description: "",
    price: "€100/year",
    paymentLink: "https://buy.stripe.com/test_3cIbJ29Op9rl5If6aAdUY00",
  },
  {
    id: 2,
    name: "Instarate Plan - €200",
    description: "",
    price: "€200/year",
    paymentLink: "https://buy.stripe.com/test_eVq5kE8KlfPJ9Yv42sdUY01",
  },
  {
    id: 3,
    name: "Instarate Plan - €300",
    description: "",
    price: "€300/year",
    paymentLink: "https://buy.stripe.com/test_3cI28s0dP4711rZ2YodUY02",
  },
  {
    id: 4,
    name: "Instarate Plan - €400",
    description: "",
    price: "€400/year",
    paymentLink: "https://buy.stripe.com/test_9B6aEY1hT32X6MjgPedUY03",
  },
  {
    id: 5,
    name: "Instarate Plan - €500",
    description: "",
    price: "€500/year",
    paymentLink: "https://buy.stripe.com/test_8x25kE7Gh32X2w31UkdUY04",
  },
  {
    id: 6,
    name: "Instarate Plan - €600",
    description: "",
    price: "€600/year",
    paymentLink: "https://buy.stripe.com/test_6oU8wQ5y9bztb2z56wdUY05",
  },
  {
    id: 7,
    name: "Instarate Plan - €700",
    description: "",
    price: "€700/year",
    paymentLink: "https://buy.stripe.com/test_bJe14o1hTdHBb2zfLadUY06",
  },
  {
    id: 8,
    name: "Instarate Plan - €800",
    description: "",
    price: "€800/year",
    paymentLink: "https://buy.stripe.com/test_14A00k0dP0UP1rZgPedUY07",
  },
]

export default function PaymentLinksApp() {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<(typeof stripeProducts)[0] | null>(null)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")

  const [smsDialogOpen, setSmsDialogOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [smsSent, setSmsSent] = useState(false)
  const [smsLoading, setSmsLoading] = useState(false)
  const [smsError, setSmsError] = useState("")

  const handlePayNow = (paymentLink: string) => {
    window.open(paymentLink, "_blank")
  }

  const handleSendEmail = (product: (typeof stripeProducts)[0]) => {
    setSelectedProduct(product)
    setEmailDialogOpen(true)
    setEmailSent(false)
    setEmail("")
    setEmailError("")
  }

  const handleSendSMS = (product: (typeof stripeProducts)[0]) => {
    setSelectedProduct(product)
    setSmsDialogOpen(true)
    setSmsSent(false)
    setPhoneNumber("")
    setSmsError("")
  }

  const submitEmailShare = async () => {
    if (!email || !selectedProduct) return

    setIsLoading(true)
    setEmailError("")

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productName: selectedProduct.name,
          paymentLink: selectedProduct.paymentLink,
          price: selectedProduct.price,
        }),
      })

      if (response.ok) {
        setEmailSent(true)
        setTimeout(() => {
          setEmailDialogOpen(false)
          setEmail("")
          setEmailSent(false)
        }, 2000)
      } else {
        const errorData = await response.json()
        setEmailError(errorData.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setEmailError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  const submitSMSShare = async () => {
    if (!phoneNumber || !selectedProduct) return

    setSmsLoading(true)
    setSmsError("")

    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          productName: selectedProduct.name,
          paymentLink: selectedProduct.paymentLink,
          price: selectedProduct.price,
        }),
      })

      if (response.ok) {
        setSmsSent(true)
        setTimeout(() => {
          setSmsDialogOpen(false)
          setPhoneNumber("")
          setSmsSent(false)
        }, 2000)
      } else {
        const errorData = await response.json()
        setSmsError(errorData.error || "Failed to send SMS")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      setSmsError("Network error. Please try again.")
    }

    setSmsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white">
            insta<span className="text-orange-500">Rate</span>.
          </h1>
          <p className="text-gray-400 mt-2">Choose your plan and get started</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {stripeProducts.map((product) => (
          <Card key={product.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">{product.name}</CardTitle>
              {product.description && <p className="text-gray-400 text-sm">{product.description}</p>}
              <div className="text-2xl font-bold text-orange-500 mt-2">{product.price}</div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handlePayNow(product.paymentLink)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
                <Button
                  onClick={() => handleSendEmail(product)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send via Email
                </Button>
                <Button
                  onClick={() => handleSendSMS(product)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Send via SMS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-500">Send Payment Link</DialogTitle>
          </DialogHeader>

          {!emailSent ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Send the payment link for <span className="text-orange-500 font-medium">{selectedProduct?.name}</span>{" "}
                  to:
                </p>
                <Label htmlFor="email" className="text-sm text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {emailError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setEmailDialogOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitEmailShare}
                  disabled={!email || isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isLoading ? "Sending..." : "Send Link"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <p className="text-green-400 font-medium">Email sent successfully!</p>
              <p className="text-gray-400 text-sm mt-1">Payment link has been sent to {email}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-500">Send Payment Link via SMS</DialogTitle>
          </DialogHeader>

          {!smsSent ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Send the payment link for <span className="text-orange-500 font-medium">{selectedProduct?.name}</span>{" "}
                  to:
                </p>
                <Label htmlFor="phone" className="text-sm text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number (e.g., +1234567890)"
                  className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {smsError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {smsError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setSmsDialogOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitSMSShare}
                  disabled={!phoneNumber || smsLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {smsLoading ? "Sending..." : "Send SMS"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <p className="text-green-400 font-medium">SMS sent successfully!</p>
              <p className="text-gray-400 text-sm mt-1">Payment link has been sent to {phoneNumber}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
