'use strict';

function localParts(date = new Date(), timezone = 'Africa/Tripoli') {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date);
  return Object.fromEntries(parts.map(part => [part.type, part.value]));
}

function atOrAfter(now, hhmm) {
  const [hour, minute] = String(hhmm || '16:00').split(':').map(Number);
  const targetHour = String(hour).padStart(2, '0');
  const targetMinute = String(minute).padStart(2, '0');
  return now.hour > targetHour || (now.hour === targetHour && now.minute >= targetMinute);
}

function signedOnly(orders, receiptMap) {
  const eligible = orders.filter(order => {
    const receipt = receiptMap.get(String(order.no));
    return !!(receipt && receipt.signature_png &&
      Array.isArray(receipt.items) && receipt.recipient_name &&
      String(receipt.recipient_name).trim().length >= 2);
  });
  const eligibleNos = new Set(eligible.map(order => String(order.no)));
  const waiting = orders.filter(order => !eligibleNos.has(String(order.no)));
  return { eligible, waiting };
}

function shouldRunAutomatic({ enabled, now = new Date(), time = '16:00', timezone = 'Africa/Tripoli' }) {
  if (!enabled) return false;
  return atOrAfter(localParts(now, timezone), time);
}

module.exports = { localParts, atOrAfter, signedOnly, shouldRunAutomatic };
