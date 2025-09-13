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
  static getDefaultProvider(): DatabaseProvider {
    const dbType = (process.env.DATABASE_TYPE || 'cloudflare-d1') as DatabaseType
    
    const config: DatabaseConfig = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      apiToken: process.env.CLOUDFLARE_API_TOKEN,
      databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
      connectionString: process.env.DATABASE_URL,
      region: process.env.DATABASE_REGION
    }

    return this.createProvider(dbType, config)
  }
}
