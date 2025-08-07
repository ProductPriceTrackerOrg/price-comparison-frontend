import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Users,
  Shield,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const lastUpdated = "August 6, 2025";
const effectiveDate = "August 6, 2025";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Terms</span>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
        </div>
        <p className="text-xl text-gray-600 mb-4">
          These terms govern your use of PricePulse and our price intelligence
          services.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Effective: {effectiveDate}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Last updated: {lastUpdated}
          </div>
        </div>
      </div>

      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> By accessing or using PricePulse, you
          agree to be bound by these Terms of Service. If you do not agree to
          these terms, please do not use our services.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        {/* Agreement Overview */}
        <Card>
          <CardHeader>
            <CardTitle>1. Agreement Overview</CardTitle>
            <CardDescription>
              Understanding the scope and nature of our service agreement.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              These Terms of Service ("Terms") constitute a legally binding
              agreement between you and PricePulse ("Company," "we," "our," or
              "us") regarding your use of our product price intelligence
              platform, including our website, mobile applications, APIs, and
              related services (collectively, the "Services").
            </p>
            <p>
              PricePulse provides a platform for tracking, analyzing, and
              comparing product prices across multiple e-commerce retailers
              using artificial intelligence and machine learning technologies.
            </p>
          </CardContent>
        </Card>

        {/* Definitions */}
        <Card>
          <CardHeader>
            <CardTitle>2. Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <strong className="text-sm">"User"</strong>
                <p className="text-sm text-gray-600">
                  Any individual or entity that accesses or uses our Services.
                </p>
              </div>
              <div>
                <strong className="text-sm">"Account"</strong>
                <p className="text-sm text-gray-600">
                  Your registered user profile and associated data on our
                  platform.
                </p>
              </div>
              <div>
                <strong className="text-sm">"Content"</strong>
                <p className="text-sm text-gray-600">
                  All information, data, text, images, and other materials
                  available through our Services.
                </p>
              </div>
              <div>
                <strong className="text-sm">"Data"</strong>
                <p className="text-sm text-gray-600">
                  Product information, pricing data, and analytics collected
                  from various e-commerce sources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Accounts and Registration */}
        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts and Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account Creation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • You must provide accurate and complete information when
                  creating an account
                </li>
                <li>
                  • You are responsible for maintaining the security of your
                  account credentials
                </li>
                <li>
                  • You must be at least 13 years old to create an account
                </li>
                <li>
                  • Business accounts may have additional verification
                  requirements
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Account Responsibilities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Notify us immediately of any unauthorized access to your
                  account
                </li>
                <li>• Keep your contact information current and accurate</li>
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Use the Services only for lawful purposes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use Policy */}
        <Card>
          <CardHeader>
            <CardTitle>4. Acceptable Use Policy</CardTitle>
            <CardDescription>
              Guidelines for proper use of our platform and services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-700 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Permitted Uses
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Personal price tracking and comparison</li>
                  <li>• Business intelligence and market research</li>
                  <li>• Academic research (with proper attribution)</li>
                  <li>• Integration with your own applications via API</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-700 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Prohibited Uses
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Automated scraping or data harvesting</li>
                  <li>• Reverse engineering our algorithms</li>
                  <li>• Redistributing our data commercially</li>
                  <li>• Creating competing services using our data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data and Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>5. Data Use and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Our Data Collection</h4>
                <p className="text-sm text-gray-600">
                  We collect product pricing and availability data from publicly
                  available e-commerce sources. This data is processed through
                  our analytical systems using star schema architecture for
                  optimal performance and insights generation.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Your Data Rights</h4>
                <p className="text-sm text-gray-600">
                  Your personal data is governed by our Privacy Policy. You
                  retain ownership of data you provide, and we use it solely to
                  provide and improve our Services. You may request data export
                  or deletion at any time through your account settings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  Machine Learning and Analytics
                </h4>
                <p className="text-sm text-gray-600">
                  We use machine learning models for price forecasting, anomaly
                  detection, and personalized recommendations. These models are
                  trained on aggregated, anonymized data and do not compromise
                  individual privacy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Terms */}
        <Card>
          <CardHeader>
            <CardTitle>6. API Usage Terms</CardTitle>
            <CardDescription>
              Specific terms for developers using our FastAPI backend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Rate Limits and Quotas</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Free tier: 1,000 requests per day</li>
                  <li>• Premium tier: 10,000 requests per day</li>
                  <li>• Enterprise: Custom limits based on agreement</li>
                  <li>• Rate limiting applies per API key</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">API Key Management</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep your API keys secure and confidential</li>
                  <li>• Do not share keys or embed them in client-side code</li>
                  <li>• Rotate keys regularly for security</li>
                  <li>• Report compromised keys immediately</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Attribution</h4>
                <p className="text-sm text-gray-600">
                  Applications using our API must include appropriate
                  attribution to PricePulse when displaying our data publicly.
                  Commercial redistribution requires explicit permission.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card>
          <CardHeader>
            <CardTitle>7. Service Availability and Support</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Service Level</h4>
                <p className="text-sm text-gray-600">
                  We strive to maintain 99.9% uptime for our Services. Scheduled
                  maintenance will be announced in advance. We do not guarantee
                  continuous availability and are not liable for downtime beyond
                  our control.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Data Accuracy</h4>
                <p className="text-sm text-gray-600">
                  While we make every effort to ensure data accuracy, we cannot
                  guarantee that all pricing information is current or
                  error-free. Users should verify critical information directly
                  with retailers before making purchasing decisions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Customer Support</h4>
                <p className="text-sm text-gray-600">
                  Support is provided via email and live chat during business
                  hours. Enterprise customers receive priority support with
                  guaranteed response times.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>8. Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Our Rights</h4>
                <p className="text-sm text-gray-600">
                  PricePulse owns all rights to our platform, algorithms,
                  machine learning models, and aggregated datasets. Our
                  trademarks, logos, and brand elements are protected
                  intellectual property.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Your Rights</h4>
                <p className="text-sm text-gray-600">
                  You retain ownership of data you provide to us. We grant you a
                  limited license to use our Services according to these Terms.
                  You may not copy, modify, or distribute our proprietary
                  technology.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Third-Party Content</h4>
                <p className="text-sm text-gray-600">
                  Product information and pricing data displayed on our platform
                  belongs to respective retailers and manufacturers. We display
                  this information under fair use for comparison purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>9. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRICEPULSE SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
              DATA, USE, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES.
            </p>
            <p>
              Our total liability for any claim arising from these Terms or your
              use of the Services shall not exceed the amount you paid us in the
              twelve months preceding the claim, or $100, whichever is greater.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Your Right to Terminate</h4>
                <p className="text-sm text-gray-600">
                  You may terminate your account at any time through your
                  account settings or by contacting us. Upon termination, your
                  right to use the Services ceases immediately.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Our Right to Terminate</h4>
                <p className="text-sm text-gray-600">
                  We may suspend or terminate your account for violations of
                  these Terms, illegal activity, or at our discretion with
                  reasonable notice. We will provide advance notice when
                  possible.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Effect of Termination</h4>
                <p className="text-sm text-gray-600">
                  Upon termination, your account data will be deleted according
                  to our data retention policy. You may request data export
                  before termination. Some provisions of these Terms survive
                  termination.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>11. Governing Law and Disputes</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              These Terms are governed by the laws of the State of California,
              United States, without regard to conflict of law principles. Any
              disputes arising from these Terms or your use of the Services
              shall be resolved through binding arbitration in San Francisco,
              California.
            </p>
            <p>
              For small claims (under $10,000), you may choose to resolve
              disputes in small claims court in your jurisdiction.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>12. Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We may update these Terms from time to time to reflect changes in
              our services, legal requirements, or business practices. Material
              changes will be communicated via email or prominent notice on our
              platform.
            </p>
            <p>
              Your continued use of the Services after changes take effect
              constitutes acceptance of the updated Terms. If you do not agree
              to changes, you should discontinue use of the Services.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
            <CardDescription>
              Questions about these Terms? Get in touch with our legal team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Shield className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="font-semibold">Legal Department</p>
                <p className="text-sm text-gray-600">legal@pricepulse.com</p>
                <p className="text-sm text-gray-600">
                  PricePulse Legal Team
                  <br />
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
