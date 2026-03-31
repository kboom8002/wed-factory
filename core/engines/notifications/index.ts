export async function sendNotification(
  type: 'sms' | 'email' | 'alimtalk',
  recipientId: string,
  subject: string,
  message: string,
  metadata?: any
) {
  // In a real production system, this would call CoolSMS, Solapi, or SendGrid.
  // For the MVP, we just console.log and pretend it sent.
  console.log(`\n========================================`);
  console.log(`[Notification Engine] Sending ${type.toUpperCase()} to ${recipientId}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message:\n${message}`);
  if (metadata) console.log(`Metadata:`, metadata);
  console.log(`========================================\n`);

  // Simulated networking delay
  return new Promise((resolve) => setTimeout(() => {
    resolve({ success: true, timestamp: new Date().toISOString() });
  }, 300));
}
