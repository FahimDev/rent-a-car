'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle, 
  Settings,
  TestTube,
  Shield,
  Phone
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api/utils'

interface NotificationConfig {
  defaultMethod: 'telegram' | 'whatsapp'
  telegram: {
    enabled: boolean
    botToken: string
    chatId: string
    enabledForBookings: boolean
    enabledForUpdates: boolean
  }
  whatsapp: {
    enabled: boolean
    apiUrl: string
    accessToken: string
    phoneNumberId: string
    enabledForBookings: boolean
    enabledForUpdates: boolean
  }
}

interface ValidationResult {
  telegram: { valid: boolean; error: string | null }
  whatsapp: { valid: boolean; error: string | null }
}

export default function NotificationSettings() {
  const router = useRouter()
  const [config, setConfig] = useState<NotificationConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [validation, setValidation] = useState<ValidationResult | null>(null)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchConfig()
  }, [router])

  const fetchConfig = async () => {
    try {
      const data = await api.admin.getNotificationConfig()
      setConfig(data.config)
    } catch (error) {
      console.error('Error fetching notification config:', error)
      toast.error('Failed to load notification settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return

    setIsSaving(true)
    try {
      await api.admin.updateNotificationConfig(config)
      toast.success('Notification settings saved successfully')
    } catch (error) {
      console.error('Error saving notification config:', error)
      toast.error('Failed to save notification settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    try {
      const result = await api.admin.testNotification()
      if (result.success) {
        toast.success(`Test notification sent via: ${result.methods?.join(', ') || 'unknown method'}`)
      } else {
        toast.error(`Test failed: ${result.errors?.join(', ') || 'unknown error'}`)
      }
    } catch (error) {
      console.error('Error testing notification:', error)
      toast.error('Failed to send test notification')
    } finally {
      setIsTesting(false)
    }
  }

  const handleValidate = async () => {
    try {
      const result = await api.admin.validateNotification()
      setValidation(result.validation)
      
      const telegramValid = result.validation.telegram.valid
      const whatsappValid = result.validation.whatsapp.valid
      
      if (telegramValid && whatsappValid) {
        toast.success('All notification methods are properly configured')
      } else {
        const errors = []
        if (!telegramValid) errors.push(`Telegram: ${result.validation.telegram.error}`)
        if (!whatsappValid) errors.push(`WhatsApp: ${result.validation.whatsapp.error}`)
        toast.error(`Configuration issues: ${errors.join(', ')}`)
      }
    } catch (error) {
      console.error('Error validating notification:', error)
      toast.error('Failed to validate notification configuration')
    }
  }

  const updateConfig = (updates: Partial<NotificationConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates })
    }
  }

  const updateTelegramConfig = (updates: Partial<NotificationConfig['telegram']>) => {
    if (config) {
      setConfig({
        ...config,
        telegram: { ...config.telegram, ...updates }
      })
    }
  }

  const updateWhatsAppConfig = (updates: Partial<NotificationConfig['whatsapp']>) => {
    if (config) {
      setConfig({
        ...config,
        whatsapp: { ...config.whatsapp, ...updates }
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Settings</h2>
            <p className="text-gray-600 mb-4">Unable to load notification configuration</p>
            <Button onClick={fetchConfig}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
              <p className="text-gray-600 mt-2">Configure Telegram and WhatsApp notifications</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleValidate}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Validate
              </Button>
              <Button
                variant="outline"
                onClick={handleTest}
                disabled={isTesting}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {isTesting ? 'Testing...' : 'Test'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Default Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Default Notification Method
            </CardTitle>
            <CardDescription>
              Choose the primary notification method for new bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="telegram-default"
                  name="defaultMethod"
                  value="telegram"
                  checked={config.defaultMethod === 'telegram'}
                  onChange={(e) => updateConfig({ defaultMethod: e.target.value as 'telegram' | 'whatsapp' })}
                  className="h-4 w-4"
                />
                <Label htmlFor="telegram-default">Telegram (Default)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="whatsapp-default"
                  name="defaultMethod"
                  value="whatsapp"
                  checked={config.defaultMethod === 'whatsapp'}
                  onChange={(e) => updateConfig({ defaultMethod: e.target.value as 'telegram' | 'whatsapp' })}
                  className="h-4 w-4"
                />
                <Label htmlFor="whatsapp-default">WhatsApp</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Notification Preview
            </CardTitle>
            <CardDescription>
              Preview where notifications will be sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Current Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Default Method:</span>
                    <span className="font-medium capitalize">{config.defaultMethod}</span>
                  </div>
                  
                  {config.defaultMethod === 'telegram' && config.telegram.enabled ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Telegram Chat ID:</span>
                        <span className="font-medium font-mono text-xs bg-white px-2 py-1 rounded">
                          {config.telegram.chatId || 'Not configured'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Notifications will be sent to the Telegram chat with this ID
                      </div>
                    </div>
                  ) : config.defaultMethod === 'whatsapp' && config.whatsapp.enabled ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">WhatsApp Phone Number ID:</span>
                        <span className="font-medium font-mono text-xs bg-white px-2 py-1 rounded">
                          {config.whatsapp.phoneNumberId || 'Not configured'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Notifications will be sent via WhatsApp Business API
                      </div>
                    </div>
                  ) : (
                    <div className="text-amber-600 text-sm">
                      ⚠️ No notification method is currently enabled and configured
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• When a customer makes a booking, the system will send a notification</p>
                  <p>• The notification will be sent using the <strong>{config.defaultMethod}</strong> method</p>
                  <p>• The notification will be delivered to the configured destination</p>
                  <p>• You can test the configuration using the "Test" button above</p>
                </div>
              </div>

              {/* Phone Number Display */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📱 Notification Destination</h4>
                <div className="text-sm text-green-800">
                  {config.defaultMethod === 'telegram' && config.telegram.enabled ? (
                    <div className="space-y-2">
                      <p><strong>Telegram Chat ID:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{config.telegram.chatId || 'Not configured'}</code></p>
                      <p className="text-xs text-green-600">
                        💡 This is the Telegram chat where you'll receive booking notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        📱 The same phone number used for WhatsApp will receive notifications via Telegram
                      </p>
                    </div>
                  ) : config.defaultMethod === 'whatsapp' && config.whatsapp.enabled ? (
                    <div className="space-y-2">
                      <p><strong>WhatsApp Business Number ID:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{config.whatsapp.phoneNumberId || 'Not configured'}</code></p>
                      <p className="text-xs text-green-600">
                        💡 This is the WhatsApp Business number that will receive booking notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        📱 The same phone number used for WhatsApp will receive notifications
                      </p>
                    </div>
                  ) : (
                    <div className="text-amber-700">
                      <p>⚠️ No notification method is currently configured</p>
                      <p className="text-xs mt-1">Please configure either Telegram or WhatsApp below</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Telegram Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Telegram Configuration
              {validation?.telegram.valid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>
              Configure Telegram bot for notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="telegram-enabled"
                checked={config.telegram.enabled}
                onChange={(e) => updateTelegramConfig({ enabled: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="telegram-enabled">Enable Telegram notifications</Label>
            </div>

            {config.telegram.enabled && (
              <>
                <div>
                  <Label htmlFor="telegram-bot-token">Bot Token</Label>
                  <Input
                    id="telegram-bot-token"
                    type="password"
                    value={config.telegram.botToken}
                    onChange={(e) => updateTelegramConfig({ botToken: e.target.value })}
                    placeholder="Enter Telegram bot token"
                  />
                </div>

                <div>
                  <Label htmlFor="telegram-chat-id">Chat ID</Label>
                  <Input
                    id="telegram-chat-id"
                    value={config.telegram.chatId}
                    onChange={(e) => updateTelegramConfig({ chatId: e.target.value })}
                    placeholder="Enter Telegram chat ID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="telegram-bookings"
                      checked={config.telegram.enabledForBookings}
                      onChange={(e) => updateTelegramConfig({ enabledForBookings: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="telegram-bookings">Enable for new bookings</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="telegram-updates"
                      checked={config.telegram.enabledForUpdates}
                      onChange={(e) => updateTelegramConfig({ enabledForUpdates: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="telegram-updates">Enable for booking updates</Label>
                  </div>
                </div>
              </>
            )}

            {validation?.telegram.error && (
              <div className="text-sm text-red-600">
                Error: {validation.telegram.error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Configuration
              {validation?.whatsapp.valid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>
              Configure WhatsApp Business API for notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="whatsapp-enabled"
                checked={config.whatsapp.enabled}
                onChange={(e) => updateWhatsAppConfig({ enabled: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="whatsapp-enabled">Enable WhatsApp notifications</Label>
            </div>

            {config.whatsapp.enabled && (
              <>
                <div>
                  <Label htmlFor="whatsapp-api-url">API URL</Label>
                  <Input
                    id="whatsapp-api-url"
                    value={config.whatsapp.apiUrl}
                    onChange={(e) => updateWhatsAppConfig({ apiUrl: e.target.value })}
                    placeholder="Enter WhatsApp API URL"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp-access-token">Access Token</Label>
                  <Input
                    id="whatsapp-access-token"
                    type="password"
                    value={config.whatsapp.accessToken}
                    onChange={(e) => updateWhatsAppConfig({ accessToken: e.target.value })}
                    placeholder="Enter WhatsApp access token"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp-phone-number-id">Phone Number ID</Label>
                  <Input
                    id="whatsapp-phone-number-id"
                    value={config.whatsapp.phoneNumberId}
                    onChange={(e) => updateWhatsAppConfig({ phoneNumberId: e.target.value })}
                    placeholder="Enter WhatsApp phone number ID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="whatsapp-bookings"
                      checked={config.whatsapp.enabledForBookings}
                      onChange={(e) => updateWhatsAppConfig({ enabledForBookings: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="whatsapp-bookings">Enable for new bookings</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="whatsapp-updates"
                      checked={config.whatsapp.enabledForUpdates}
                      onChange={(e) => updateWhatsAppConfig({ enabledForUpdates: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="whatsapp-updates">Enable for booking updates</Label>
                  </div>
                </div>
              </>
            )}

            {validation?.whatsapp.error && (
              <div className="text-sm text-red-600">
                Error: {validation.whatsapp.error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
