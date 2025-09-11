"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/product-card";
import { smartphones, laptops, audioProducts, formatCurrency } from "@/lib/product-data";
import { ArrowRight, Star } from "lucide-react";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("smartphones");

  const categories = [
    { id: "smartphones", label: "Smartphones", products: smartphones },
    { id: "laptops", label: "Laptops", products: laptops },
    { id: "audio", label: "Audio", products: audioProducts.map(p => ({ ...p }))}
  ];
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Featured Products
          </div>
          <Button variant="secondary" size="sm">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="smartphones" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-2">
          <TabsList className="w-full">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id} 
                className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <CardContent className="p-6">
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.products.slice(0, 4).map(product => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    {product.originalPrice && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="text-xs font-semibold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="bg-white/80 text-xs">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" className="border-blue-300 hover:bg-blue-50">
                  See more {category.label} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  );
}
