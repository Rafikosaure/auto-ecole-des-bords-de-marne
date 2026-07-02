const { prisma } = require('../prisma/client.js');
const { ENV } = require('../config/env.js');
const { passwordHashing } = require('../middlewares/bcryptPassword.js');

async function initDatabase() {
    try {
        await prisma.$connect();
        console.log(`Connection to "${ENV.DBNAME}" has been successful`);

        await prisma.admin.upsert({
            where: { email: ENV.DEFAULTADMINEMAIL },
            update: {},
            create: {
                username: ENV.DEFAULTADMINUSERNAME,
                email: ENV.DEFAULTADMINEMAIL,
                password: await passwordHashing(ENV.DEFAULTADMINPASSWORD),
            },
        });

        console.log(`Database "${ENV.DBNAME}" is ready`);
    } catch (error) {
        console.error(`Unable to connect to "${ENV.DBNAME}": ${error.message}`);
    }
}

initDatabase();

module.exports = { prisma };
