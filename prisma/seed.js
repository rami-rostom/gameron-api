const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const usersData = [
  {
    username: 'ramirez',
    username_slug: 'ramirez',
    email: 'ramirez@gameron.io',
    password: 'Password1!',
    is_admin: false,
  },
]

async function main() {
  console.log(`Start seeding ...`);

  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: userData,
    })
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })