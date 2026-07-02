const { ENV } = require('../config/env.js');

// Build DATABASE_URL from individual env vars before instantiating the client
const password = encodeURIComponent(ENV.DBPASSWORD || '');
const user = encodeURIComponent(ENV.DBUSER);
process.env.DATABASE_URL = `mysql://${user}:${password}@${ENV.DBHOST}:${ENV.DBPORT}/${ENV.DBNAME}`;

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = { prisma };
