import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { email, name, password } = await readBody(event);
  let newUser = await prisma.user.findUnique({
    where: { email },
  })
  .catch((error) => {
    console.error(error);
  });
  if (newUser) return createError({ statusCode: 406, message: 'Email exist!' });
  newUser = await prisma.user.create({
    data: { email, name, password },
  }).catch((error) => {
    console.error(error);
  });
  const userId = newUser?.id;
  const userName = newUser?.name;
  return { userId, userName };
});