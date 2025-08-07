import {
  Shield,
  Calendar,
  Mail,
  UserCheck,
  Database,
  Lock,
  Home,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const lastUpdated = "August 6, 2025";

const dataCategories = [
  {
    icon: UserCheck,
    title: "Personal Information",
    description: "Information you provide when creating an account",
    examples: [
      "Full name",
      "Email address",
      "Password (hashed)",
      "Profile preferences",
    ],
  },
  {
    icon: Database,
    title: "Usage Data",
    description: "Information about how you use our platform",
    examples: [
      "Search queries",
      "Product views",
      "Tracking preferences",
      "Session duration",
    ],
  },
  {
    icon: Lock,
    title: "Technical Data",
    description: "Information collected automatically",
    examples: [
      "IP address",
      "Browser type",
      "Device information",
      "Analytics data",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Privacy</span>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-xl text-gray-600 mb-4">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Last updated: {lastUpdated}
          </div>
          <Badge variant="outline">GDPR Compliant</Badge>
          <Badge variant="outline">CCPA Compliant</Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              PricePulse ("we," "our," or "us") respects your privacy and is
              committed to protecting your personal data.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              This privacy policy explains how we collect, use, disclose, and
              safeguard your information when you use our product price
              intelligence platform. We are committed to transparency and giving
              you control over your data.
            </p>
            <p>
              By using PricePulse, you agree to the collection and use of
              information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
            <CardDescription>
              We collect information in several ways to provide and improve our
              services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {dataCategories.map((category, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <category.icon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">{category.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {category.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex}>• {example}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Core Services</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Provide price tracking and analytics</li>
                  <li>• Send price alerts and notifications</li>
                  <li>• Generate personalized recommendations</li>
                  <li>• Maintain your favorite products list</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Platform Improvement</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Analyze usage patterns and trends</li>
                  <li>• Improve our machine learning models</li>
                  <li>• Enhance user experience</li>
                  <li>• Detect and prevent fraud</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Storage and Security */}
        <Card>
          <CardHeader>
            <CardTitle>Data Storage and Security</CardTitle>
            <CardDescription>
              We implement industry-standard security measures to protect your
              data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Security Measures</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Encryption in transit and at rest</li>
                  <li>• Regular security audits</li>
                  <li>• Access controls and authentication</li>
                  <li>• Secure cloud infrastructure</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Architecture</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Separate user and analytics databases</li>
                  <li>• Star schema for analytical storage</li>
                  <li>• Automated backups and recovery</li>
                  <li>• Data anonymization for analytics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. We may share information in the following limited
              circumstances:
            </p>

            <div className="space-y-3 mt-4">
              <div>
                <h4 className="font-semibold">Service Providers</h4>
                <p className="text-sm text-gray-600">
                  We work with trusted third-party service providers who assist
                  us in operating our platform, such as cloud hosting, email
                  delivery, and analytics services.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Legal Requirements</h4>
                <p className="text-sm text-gray-600">
                  We may disclose information if required by law, regulation, or
                  legal process, or to protect the rights, property, or safety
                  of PricePulse, our users, or others.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Business Transfers</h4>
                <p className="text-sm text-gray-600">
                  In the event of a merger, acquisition, or sale of business
                  assets, user information may be transferred as part of the
                  transaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
            <CardDescription>
              You have control over your personal data and how it's used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Access and Control</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• View and download your data</li>
                  <li>• Update your profile information</li>
                  <li>• Manage notification preferences</li>
                  <li>• Export your tracked products</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Deletion and Restriction</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Request account deletion</li>
                  <li>• Opt out of data processing</li>
                  <li>• Withdraw consent</li>
                  <li>• Request data portability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We use cookies and similar technologies to enhance your experience
              and understand how you use our platform:
            </p>

            <div className="space-y-3 mt-4">
              <div>
                <h4 className="font-semibold">Essential Cookies</h4>
                <p className="text-sm text-gray-600">
                  Required for basic functionality like user authentication and
                  security. These cannot be disabled.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Analytics Cookies</h4>
                <p className="text-sm text-gray-600">
                  Help us understand how users interact with our platform to
                  improve performance and user experience.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Preference Cookies</h4>
                <p className="text-sm text-gray-600">
                  Remember your settings and preferences to provide a
                  personalized experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              PricePulse is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us
              immediately.
            </p>
          </CardContent>
        </Card>

        {/* International Users */}
        <Card>
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              PricePulse operates globally, and your information may be
              transferred to and processed in countries other than your country
              of residence. We ensure appropriate safeguards are in place to
              protect your data in accordance with applicable privacy laws.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We may update this privacy policy from time to time to reflect
              changes in our practices or for legal, regulatory, or operational
              reasons. We will notify you of any material changes by posting the
              new policy on this page and updating the "Last updated" date.
            </p>
            <p>
              We encourage you to review this privacy policy periodically to
              stay informed about how we protect your information.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              If you have questions about this privacy policy or our data
              practices, please contact us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="font-semibold">Data Protection Officer</p>
                <p className="text-sm text-gray-600">privacy@pricepulse.com</p>
                <p className="text-sm text-gray-600">
                  123 Tech Street, Silicon Valley
                  <br />
                  San Francisco, CA 94105, United States
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
