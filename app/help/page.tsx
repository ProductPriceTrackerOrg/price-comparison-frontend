"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of PricePulse",
    icon: "🚀",
    faqs: [
      {
        question: "What is PricePulse?",
        answer:
          "PricePulse is an intelligent product price monitoring and analytics platform that tracks prices across multiple e-commerce retailers. We use AI-powered insights to help you make informed purchasing decisions by providing real-time price comparisons, historical trends, and predictive analytics.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Click the 'Sign Up' button in the top-right corner of any page. You can register using your email address or sign up with Google for faster access. Creating an account allows you to track products, receive price alerts, and access personalized recommendations.",
      },
      {
        question: "Is PricePulse free to use?",
        answer:
          "Yes! PricePulse offers a free tier that includes basic price tracking, product search, and price history for up to 10 tracked products. We also offer premium plans with advanced features like unlimited tracking, priority alerts, and detailed analytics.",
      },
    ],
  },
  {
    id: "price-tracking",
    title: "Price Tracking",
    description: "How to track and monitor product prices",
    icon: "📊",
    faqs: [
      {
        question: "How do I track a product?",
        answer:
          "Navigate to any product page and click the 'Track Product' or 'Add to Favorites' button. You'll receive notifications when the price changes significantly. You can track products from multiple retailers to compare prices.",
      },
      {
        question: "How often are prices updated?",
        answer:
          "We update prices daily for all tracked products. Our data pipeline runs multiple times per day to ensure you have the most current pricing information. Price changes are reflected in real-time on product pages.",
      },
      {
        question: "What types of price alerts can I receive?",
        answer:
          "You can receive alerts for: price drops (when a product becomes cheaper), price increases, stock availability changes, and anomaly detection (unusual pricing patterns). Configure your notification preferences in your account settings.",
      },
    ],
  },
];

const contactOptions = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    icon: Mail,
    contact: "support@pricepulse.com",
    action: "Send Email",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    icon: MessageCircle,
    contact: "Available 9 AM - 6 PM",
    action: "Start Chat",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our team",
    icon: Phone,
    contact: "+1 (555) 123-4567",
    action: "Call Now",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqCategories);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredFaqs(faqCategories);
      return;
    }

    const filtered = faqCategories
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((category) => category.faqs.length > 0);

    setFilteredFaqs(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Help</span>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How can we help you?
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Find answers to common questions about PricePulse features, account
          management, and price tracking.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for help topics..."
            className="pl-10 pr-4 py-3 text-lg"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Getting Started Guide
            </CardTitle>
            <CardDescription>
              Learn how to use PricePulse effectively
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 API Documentation
            </CardTitle>
            <CardDescription>
              Integrate with our FastAPI backend
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔔 Notification Settings
            </CardTitle>
            <CardDescription>
              Configure price alerts and reports
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          {filteredFaqs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  No results found for "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleSearch("")}
                >
                  Clear search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFaqs.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.title}
                      <Badge variant="secondary">{category.faqs.length}</Badge>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {category.faqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.id}-${index}`}
                        >
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support Sidebar */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Need More Help?
          </h2>

          <div className="space-y-4">
            {contactOptions.map((option, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <option.icon className="h-5 w-5 text-blue-600" />
                    {option.title}
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{option.contact}</p>
                  <Button className="w-full">{option.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Platform Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Products Tracked:</span>
                  <span className="font-semibold">2.5M+</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-semibold">150K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Retailers:</span>
                  <span className="font-semibold">500+</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Updates:</span>
                  <span className="font-semibold">1M+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
