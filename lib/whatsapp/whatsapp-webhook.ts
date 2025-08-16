
import db from '@/lib/prisma';
import { info } from '@/utils/logger';
import type { Prisma } from '@prisma/client';

function toDate(timestamp: string | number | undefined): Date {
  if (timestamp === undefined) return new Date();
  const num = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  if (Number.isFinite(num)) {
    // WhatsApp sends epoch seconds
    const ms = num < 10_000_000_000 ? num * 1000 : num;
    return new Date(ms);
  }
  return new Date();
}

export async function saveIncomingMessage(value: unknown, message: unknown): Promise<void> {
  if (typeof message !== 'object' || message === null) {
    info('whatsapp.webhook', { kind: 'message', ignored: true, reason: 'invalid_message_shape' });
    return;
  }

  const inboundMessage = message as {
    id?: unknown;
    from?: unknown;
    type?: unknown;
    text?: { body?: unknown };
    timestamp?: unknown;
  };

  if (typeof inboundMessage.id !== 'string' || typeof inboundMessage.from !== 'string') {
    info('whatsapp.webhook', { kind: 'message', ignored: true, reason: 'missing_id_or_from' });
    return;
  }

  const waMessageId = inboundMessage.id;
  const fromWa = inboundMessage.from;
  // value?.metadata?.phone_number_id
  const toWa = (value as { metadata?: { phone_number_id?: string } } | null | undefined)?.metadata?.phone_number_id ?? '';
  const direction = 'inbound';
  const type = (typeof inboundMessage.type === 'string' && inboundMessage.type) || 'unknown';
  const text = typeof inboundMessage.text?.body === 'string' ? inboundMessage.text.body : null;
  const receivedAt = toDate(
    typeof inboundMessage.timestamp === 'string' || typeof inboundMessage.timestamp === 'number'
      ? (inboundMessage.timestamp as string | number)
      : undefined
  );

  await db.whatsappMessage.upsert({
    where: { waMessageId },
    create: {
      waMessageId,
      fromWa,
      toWa,
      direction,
      type,
      text,
      raw: message as unknown as Prisma.InputJsonValue,
      receivedAt,
    },
    update: {
      fromWa,
      toWa,
      type,
      text,
      raw: message as unknown as Prisma.InputJsonValue,
      receivedAt,
    },
  });

  info('whatsapp.webhook', { kind: 'message', waMessageId, fromWa });
}

export async function recordMessageStatus(status: unknown): Promise<void> {
  if (typeof status !== 'object' || status === null) {
    info('whatsapp.webhook', { kind: 'status', ignored: true, reason: 'invalid_status_shape' });
    return;
  }

  const statusUpdate = status as {
    id?: unknown;
    status?: unknown;
    timestamp?: unknown;
    errors?: Array<{ title?: unknown }>;
  };

  if (typeof statusUpdate.id !== 'string' || typeof statusUpdate.status !== 'string') {
    info('whatsapp.webhook', { kind: 'status', ignored: true, reason: 'missing_id_or_status' });
    return;
  }

  const waMessageId = statusUpdate.id;
  const rawStatus = String(statusUpdate.status).toLowerCase();
  const statusType = ['sent', 'delivered', 'read', 'failed', 'unknown'].includes(rawStatus) ? rawStatus : 'unknown';
  const reason = Array.isArray(statusUpdate.errors) && statusUpdate.errors.length > 0 && typeof statusUpdate.errors[0]?.title === 'string'
    ? (statusUpdate.errors[0].title as string)
    : null;
  const occurredAt = toDate(
    typeof statusUpdate.timestamp === 'string' || typeof statusUpdate.timestamp === 'number'
      ? (statusUpdate.timestamp as string | number)
      : undefined
  );

  // Ensure status record exists exactly once per (waMessageId, occurredAt)
  await db.whatsappMessageStatus.upsert({
    where: {
      waMessageId_occurredAt: { waMessageId, occurredAt },
    },
    create: {
      waMessageId,
      status: statusType,
      reason,
      raw: status as unknown as Prisma.InputJsonValue,
      occurredAt,
    },
    update: {
      status: statusType,
      reason,
      raw: status as unknown as Prisma.InputJsonValue,
    },
  });

  // Update denormalized latest status on message
  await db.whatsappMessage.updateMany({
    where: { waMessageId },
    data: {
      lastStatus: statusType,
      lastStatusAt: occurredAt,
    },
  });

  info('whatsapp.webhook', { kind: 'status', waMessageId, status: statusType });
}


