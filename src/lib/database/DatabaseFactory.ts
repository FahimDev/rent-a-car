import { DatabaseProvider, DatabaseConfig } from './types'
import { CloudflareD1Provider } from './providers/CloudflareD1Provider'
import { PostgreSQLProvider } from './providers/PostgreSQLProvider'
import { MySQLProvider } from './providers/MySQLProvider'

export type DatabaseType = 'cloudflare-d1' | 'postgresql' | 'mysql'

/**
 * Database Factory
 * Creates database provider instances based on configuration
 */
export class DatabaseFactory {
  /**
   * Create a database provider instance
   */
  static createProvider(type: DatabaseType, config: DatabaseConfig): DatabaseProvider {
    switch (type) {
      case 'cloudflare-d1':
        return new CloudflareD1Provider(config)
      
      case 'postgresql':
        return new PostgreSQLProvider(config)
      
      case 'mysql':
        return new MySQLProvider(config)
      
      default:
        throw new Error(`Unsupported database type: ${type}`)
    }
  }

  /**
   * Get the default database provider based on environment
   */
  static getDefaultProvider(env?: any): DatabaseProvider {
    // Better environment detection
    const isProduction = typeof process !== 'undefined' && 
                        process.env.APP_ENV === 'PRODUCTION' || 
                        typeof window === 'undefined'; // SSR context
    
    const dbType = (process.env.DATABASE_TYPE || 'cloudflare-d1') as DatabaseType
  
    if (isProduction) {
      // ✅ Production: use D1 binding directly
      if (!env?.DB) {
        // Fallback to API connection if binding is missing
        console.warn('D1 binding "env.DB" is missing, falling back to API connection')
        
        const config: DatabaseConfig = {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
          apiToken: process.env.CLOUDFLARE_API_TOKEN_D1,
          databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
          region: process.env.DATABASE_REGION,
        }
        
        return this.createProvider(dbType, config)
      }
  
      const config: DatabaseConfig = {
        binding: env.DB,
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
        region: process.env.DATABASE_REGION,
      }
  
      return this.createProvider(dbType, config)
    }
  
    // 🛠 Development: use token-based API connection
    const config: DatabaseConfig = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      apiToken: process.env.CLOUDFLARE_API_TOKEN_D1,
      databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
      connectionString: process.env.DATABASE_URL,
      region: process.env.DATABASE_REGION,
    }
  
    return this.createProvider(dbType, config)
  }
}
