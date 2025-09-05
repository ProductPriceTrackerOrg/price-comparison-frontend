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
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 relative">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-conic from-slate-100 via-blue-50 to-slate-100 opacity-70"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-1/4 w-8 h-8 bg-blue-200/50 rounded-full"></div>
      <div className="absolute top-40 right-1/3 w-4 h-4 bg-indigo-200/50 rounded-full"></div>
      <div className="absolute bottom-20 left-1/3 w-6 h-6 bg-cyan-200/50 rounded-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-100 mb-4 md:hidden">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-100 mr-5">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-2">
                  Trusted Retailers
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl">
                  We partner with the most reliable e-commerce platforms for accurate price tracking
                </p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            asChild 
            className="hidden md:flex border-blue-300 hover:bg-blue-50/60 text-blue-700 px-6 py-5 rounded-xl"
          >
            <a href="/retailers" className="font-medium text-base">
              View All Partners
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {retailers.map((retailer, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-slate-200/70 hover:border-blue-200 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-slate-50/50"
            >
              <CardContent className="p-0">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-b border-slate-200/70 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-inner border border-blue-200/50 group-hover:scale-110 transition-transform duration-300">
                        <Store className="h-7 w-7 text-blue-600 group-hover:text-indigo-600 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{retailer.name}</h3>
                        <p className="text-sm text-gray-600">{retailer.description}</p>
                      </div>
                    </div>
                    {retailer.verified && (
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 px-3 py-1.5 h-auto font-medium">
                        <Shield className="h-3.5 w-3.5 mr-1.5" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Stats with improved visual separation */}
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 font-medium">Rating</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(retailer.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{retailer.rating} <span className="text-xs text-gray-500 font-normal">/ 5.0</span></div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                      <div className="text-xs text-gray-500 font-medium mb-1">Products</div>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-lg font-bold text-gray-900">{retailer.products}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border-blue-200 font-medium py-5"
                  >
                    Browse Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Button 
            variant="outline" 
            asChild
            className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-300 text-blue-700 px-8 py-6 rounded-xl text-lg"
          >
            <a href="/retailers">
              View All Retailers
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
        
        {/* Partner trust indicators */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Why Our Retail Partners Trust Us</h3>
            <p className="text-gray-500">Partnering with the best for accurate price comparison</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">100% Accurate</h4>
              <p className="text-sm text-gray-500">Real-time price monitoring</p>
            </div>
            
            <div className="p-4">
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">Secure Data</h4>
              <p className="text-sm text-gray-500">End-to-end encrypted</p>
            </div>
            
            <div className="p-4">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">Traffic Growth</h4>
              <p className="text-sm text-gray-500">Increased conversions</p>
            </div>
            
            <div className="p-4">
              <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">750+ Partners</h4>
              <p className="text-sm text-gray-500">Growing network</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
