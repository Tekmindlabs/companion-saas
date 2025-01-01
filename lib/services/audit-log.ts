import { db } from '@/lib/db';

export interface AuditLogEntry {
  action: string;
  userId: string;
  details: any;
  ipAddress?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  return db.auditLog.create({
    data: {
      action: entry.action,
      userId: entry.userId,
      details: entry.details,
      ipAddress: entry.ipAddress,
    }
  });
}