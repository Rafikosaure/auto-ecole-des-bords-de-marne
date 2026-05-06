const { ENV } = require('../config/env');
const crypto = require('crypto');
const SECRET = ENV.TRACKING_SECRET || 'change-me';

function signParams({ mid, sid }) {
  const data = `${mid}.${sid}`;
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

function verifySignature({ mid, sid, sig }) {
  try {
    const expected = signParams({ mid, sid });
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig || ''));
  } catch {
    return false;
  }
}

function hashEmail(email = '') {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

function anonymizeIp(ip = '') {
  if (!ip) return '';
  if (ip.includes(':')) return ip.split(':').slice(0, 4).join(':') + '::/64';
  const p = ip.split('.');
  return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}.0/24` : ip;
}

module.exports = { signParams, verifySignature, hashEmail, anonymizeIp };
