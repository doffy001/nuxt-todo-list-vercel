import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event);
  let todoList = null;
  if (userId) {
    todoList = await prisma.todo.findMany({
      where: { authorId: +userId }
    }).catch((error) => {
      console.error(error);
    });
  }
  return todoList;
});