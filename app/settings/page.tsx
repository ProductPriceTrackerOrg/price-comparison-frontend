"use client"

import { useState, useEffect } from "react"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Settings, Bell, Mail, Percent, Save } from "lucide-react"
import { redirect } from "next/navigation"

interface NotificationSettings {
  notify_on_price_drop: boolean
  notify_on_anomaly: boolean
  price_drop_threshold_percent: number
  receive_weekly_report: boolean
  weekly_report_day: string
}

export default function SettingsPage() {
  const { user, isLoggedIn } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    notify_on_price_drop: true,
    notify_on_anomaly: false,
    price_drop_threshold_percent: 10,
    receive_weekly_report: true,
    weekly_report_day: "SUNDAY",
  })

  useEffect(() => {
    if (!isLoggedIn) {
      redirect("/")
    }
  }, [isLoggedIn])

  useEffect(() => {
    // Load user's notification settings
    // In real implementation, this would be an API call
    const savedSettings = localStorage.getItem(`notification_settings_${user?.user_id}`)
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [user])

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // In real implementation, this would be an API call
      localStorage.setItem(`notification_settings_${user?.user_id}`, JSON.stringify(settings))

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            </div>
            <p className="text-gray-600">Manage your account preferences and notification settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    <Button variant="default" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      Account
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" disabled>
                      <Mail className="mr-2 h-4 w-4" />
                      Privacy
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Drop Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Price Drop Alerts</Label>
                      <p className="text-sm text-gray-600">Get notified when prices drop on your tracked products</p>
                    </div>
                    <Switch
                      checked={settings.notify_on_price_drop}
                      onCheckedChange={(checked) => updateSetting("notify_on_price_drop", checked)}
                    />
                  </div>

                  {/* Price Drop Threshold */}
                  {settings.notify_on_price_drop && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="threshold" className="text-sm font-medium">
                        Minimum price drop percentage
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="threshold"
                          type="number"
                          min="0"
                          max="100"
                          value={settings.price_drop_threshold_percent}
                          onChange={(e) =>
                            updateSetting("price_drop_threshold_percent", Number.parseInt(e.target.value) || 0)
                          }
                          className="w-20"
                        />
                        <Percent className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">or more</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Anomaly Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Anomaly Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Get notified about unusual price movements and market anomalies
                      </p>
                    </div>
                    <Switch
                      checked={settings.notify_on_anomaly}
                      onCheckedChange={(checked) => updateSetting("notify_on_anomaly", checked)}
                    />
                  </div>

                  <Separator />

                  {/* Weekly Report */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Weekly Summary Report</Label>
                      <p className="text-sm text-gray-600">Receive a weekly email with your tracked products summary</p>
                    </div>
                    <Switch
                      checked={settings.receive_weekly_report}
                      onCheckedChange={(checked) => updateSetting("receive_weekly_report", checked)}
                    />
                  </div>

                  {/* Weekly Report Day */}
                  {settings.receive_weekly_report && (
                    <div className="ml-6 space-y-2">
                      <Label className="text-sm font-medium">Delivery day</Label>
                      <Select
                        value={settings.weekly_report_day}
                        onValueChange={(value) => updateSetting("weekly_report_day", value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONDAY">Monday</SelectItem>
                          <SelectItem value="TUESDAY">Tuesday</SelectItem>
                          <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                          <SelectItem value="THURSDAY">Thursday</SelectItem>
                          <SelectItem value="FRIDAY">Friday</SelectItem>
                          <SelectItem value="SATURDAY">Saturday</SelectItem>
                          <SelectItem value="SUNDAY">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}
