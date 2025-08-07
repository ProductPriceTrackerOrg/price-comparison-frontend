import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Star, Package, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RetailersSection() {
  const retailers = [
    {
      name: "TechMart",
      logo: "/placeholder.svg?height=60&width=120",
      rating: 4.8,
      products: "125K+",
      verified: true,
      description: "Leading electronics retailer",
    },
    {
      name: "ElectroHub",
      logo: "/placeholder.svg?height=60&width=120",
      rating: 4.6,
      products: "98K+",
      verified: true,
      description: "Premium gadgets & accessories",
    },
    {
      name: "GadgetWorld",
      logo: "/placeholder.svg?height=60&width=120",
      rating: 4.7,
      products: "156K+",
      verified: true,
      description: "Latest tech innovations",
    },
    {
      name: "DigitalStore",
      logo: "/placeholder.svg?height=60&width=120",
      rating: 4.5,
      products: "87K+",
      verified: true,
      description: "Digital lifestyle products",
    },
    {
      name: "TechZone",
      logo: "/placeholder.svg?height=60&width=120",
      rating: 4.9,
      products: "203K+",
      verified: true,
      description: "Professional tech solutions",
    },
    {
      name: "ElectroMax",
      logo: "/placeholder.svg?height=60&width=120",
      rating: 4.4,
      products: "76K+",
      verified: true,
      description: "Consumer electronics",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trusted Retailers</h2>
              <p className="text-gray-600">We track prices from the most reliable e-commerce platforms</p>
            </div>
          </div>
          <Button variant="outline" asChild className="hidden md:flex bg-transparent">
            <a href="/retailers">
              View All Retailers
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retailers.map((retailer, index) => (
            <Card key={index} className="professional-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{retailer.name}</h3>
                      <p className="text-sm text-gray-600">{retailer.description}</p>
                    </div>
                  </div>
                  {retailer.verified && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{retailer.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Products</span>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">{retailer.products}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View Products
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild>
            <a href="/retailers">
              View All Retailers
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
