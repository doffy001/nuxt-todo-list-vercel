import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { deletedTodoId: id } = await readBody(event);
  const deletedTodo = await prisma.todo.delete({
    where: { id }
  }).catch((error) => {
    console.error(error);
  });
  return deletedTodo;
});