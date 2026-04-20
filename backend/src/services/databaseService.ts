import { getSupabaseClient, isDatabaseConfigured } from '../config/database';

export class DatabaseService {
  static async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;
      
      // Test basic connection by querying the database version
      const { data, error } = await supabase
        .rpc('version');

      if (error) {
        // If rpc doesn't exist, try a simple select
        const { data: selectData, error: selectError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .limit(1);

        if (selectError) {
          throw new Error(`Database connection failed: ${selectError.message}`);
        }

        return {
          success: true,
          message: 'Database connection successful',
          data: { tables: selectData }
        };
      }

      return {
        success: true,
        message: 'Database connection successful',
        data: { version: data }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }

  static async checkTables(): Promise<{ success: boolean; message: string; tables?: string[] }> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;
      
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (error) {
        throw new Error(`Failed to check tables: ${error.message}`);
      }

      const tableNames = data?.map((row: any) => row.table_name) || [];

      return {
        success: true,
        message: `Found ${tableNames.length} tables`,
        tables: tableNames
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error checking tables'
      };
    }
  }
}
