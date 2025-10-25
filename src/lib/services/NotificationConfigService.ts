/**
 * Notification Configuration Service
 * Manages notification preferences and settings
 */
export class NotificationConfigService {
  private static instance: NotificationConfigService
  private config: NotificationConfig

  private constructor() {
    this.config = this.getDefaultConfig()
  }

  static getInstance(): NotificationConfigService {
    if (!this.instance) {
      this.instance = new NotificationConfigService()
    }
    return this.instance
  }

  /**
   * Get current notification configuration
   */
  getConfig(): NotificationConfig {
    return { ...this.config }
  }

  /**
   * Update notification configuration
   */
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.saveConfig()
  }

  /**
   * Get default notification method
   */
  getDefaultMethod(): NotificationMethod {
    return this.config.defaultMethod
  }

  /**
   * Set default notification method
   */
  setDefaultMethod(method: NotificationMethod): void {
    this.config.defaultMethod = method
    this.saveConfig()
  }

  /**
   * Check if Telegram is enabled
   */
  isTelegramEnabled(): boolean {
    return this.config.telegram.enabled
  }

  /**
   * Check if WhatsApp is enabled
   */
  isWhatsAppEnabled(): boolean {
    return this.config.whatsapp.enabled
  }

  /**
   * Get Telegram configuration
   */
  getTelegramConfig(): TelegramConfig {
    return { ...this.config.telegram }
  }

  /**
   * Get WhatsApp configuration
   */
  getWhatsAppConfig(): WhatsAppConfig {
    return { ...this.config.whatsapp }
  }

  /**
   * Update Telegram configuration
   */
  updateTelegramConfig(config: Partial<TelegramConfig>): void {
    this.config.telegram = { ...this.config.telegram, ...config }
    this.saveConfig()
  }

  /**
   * Update WhatsApp configuration
   */
  updateWhatsAppConfig(config: Partial<WhatsAppConfig>): void {
    this.config.whatsapp = { ...this.config.whatsapp, ...config }
    this.saveConfig()
  }

  /**
   * Get active notification methods based on configuration
   */
  getActiveMethods(): NotificationMethod[] {
    const methods: NotificationMethod[] = []
    
    if (this.config.telegram.enabled) {
      methods.push('telegram')
    }
    
    if (this.config.whatsapp.enabled) {
      methods.push('whatsapp')
    }
    
    return methods
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): NotificationConfig {
    return {
      defaultMethod: 'telegram', // Telegram is default
      telegram: {
        enabled: true,
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || '',
        enabledForBookings: true,
        enabledForUpdates: true
      },
      whatsapp: {
        enabled: false, // WhatsApp is disabled by default
        apiUrl: process.env.WHATSAPP_API_URL || '',
        accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
        enabledForBookings: false,
        enabledForUpdates: false
      }
    }
  }

  /**
   * Save configuration to storage (localStorage for now, can be extended to database)
   */
  private saveConfig(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationConfig', JSON.stringify(this.config))
    }
  }

  /**
   * Load configuration from storage
   */
  private loadConfig(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notificationConfig')
      if (saved) {
        try {
          this.config = { ...this.getDefaultConfig(), ...JSON.parse(saved) }
        } catch (error) {
          console.error('Error loading notification config:', error)
        }
      }
    }
  }
}

export interface NotificationConfig {
  defaultMethod: NotificationMethod
  telegram: TelegramConfig
  whatsapp: WhatsAppConfig
}

export interface TelegramConfig {
  enabled: boolean
  botToken: string
  chatId: string
  enabledForBookings: boolean
  enabledForUpdates: boolean
}

export interface WhatsAppConfig {
  enabled: boolean
  apiUrl: string
  accessToken: string
  phoneNumberId: string
  enabledForBookings: boolean
  enabledForUpdates: boolean
}

export type NotificationMethod = 'telegram' | 'whatsapp'
