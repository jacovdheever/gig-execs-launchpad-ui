/**
 * Audit Logging Utility
 * 
 * Provides functions to log staff actions for compliance and debugging.
 * All audit logs are immutable and can only be inserted, never updated or deleted.
 */

import { supabase } from './supabase';

export interface AuditLogEntry {
  staff_id: string;
  action_type: string;
  target_table?: string;
  target_id?: string;
  details?: Record<string, any>;
}

/**
 * Log an audit entry for a staff action
 * @param staffId - ID of the staff member performing the action
 * @param action - Type of action (e.g., 'user_verification', 'staff_login')
 * @param targetTable - Optional table name being affected
 * @param targetId - Optional ID of the record being affected
 * @param details - Optional additional details as JSON
 */
export async function logAudit(
  staffId: string,
  action: string,
  targetTable?: string,
  targetId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        staff_id: staffId,
        action_type: action,
        target_table: targetTable,
        target_id: targetId,
        details: details
      });

    if (error) {
      console.error('Failed to log audit:', error);
      // Don't throw - audit logging failure shouldn't break the app
    } else {
      console.log('✅ Audit logged:', {
        action,
        targetTable,
        targetId
      });
    }
  } catch (error) {
    console.error('Unexpected error logging audit:', error);
    // Don't throw - audit logging failure shouldn't break the app
  }
}

/**
 * Fetch audit logs with optional filtering
 * @param filters - Optional filters for the query
 * @returns Array of audit log entries
 */
export async function fetchAuditLogs(filters?: {
  staffId?: string;
  actionType?: string;
  targetTable?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        staff:staff_users(first_name, last_name, role)
      `)
      .order('created_at', { ascending: false });

    if (filters?.staffId) {
      query = query.eq('staff_id', filters.staffId);
    }

    if (filters?.actionType) {
      query = query.eq('action_type', filters.actionType);
    }

    if (filters?.targetTable) {
      query = query.eq('target_table', filters.targetTable);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching audit logs:', error);
    return [];
  }
}

/**
 * Export audit logs to CSV format
 * @param filters - Optional filters for the query
 * @returns CSV string
 */
export async function exportAuditLogsToCSV(filters?: Parameters<typeof fetchAuditLogs>[0]): Promise<string> {
  const logs = await fetchAuditLogs(filters);
  
  if (logs.length === 0) {
    return 'No audit logs found';
  }

  // CSV headers
  const headers = ['Timestamp', 'Staff Name', 'Role', 'Action Type', 'Target Table', 'Target ID', 'Details'];
  const rows = [headers.join(',')];

  // CSV rows
  for (const log of logs) {
    const staffName = log.staff 
      ? `${log.staff.first_name} ${log.staff.last_name}` 
      : 'Unknown';
    const role = log.staff?.role || 'Unknown';
    const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
    
    rows.push([
      log.created_at,
      `"${staffName}"`,
      role,
      log.action_type,
      log.target_table || '',
      log.target_id || '',
      `"${details}"`
    ].join(','));
  }

  return rows.join('\n');
}

