import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { userId, newTodo, updatedTodo } = await readBody(event);
  let upsertTodoList = null;
  if (newTodo) {
    upsertTodoList = await prisma.todo.create({
      data: {
        id: newTodo.id,
        content: newTodo.content,
        author: {
          connect: { id: userId }
        }
      },
    }).catch((error) => {
      console.error(error);
    });
  } else if (updatedTodo) {
    if (updatedTodo.content) {
      upsertTodoList = await prisma.todo.update({
        where: { id: updatedTodo.id },
        data: { content: updatedTodo.content }
      }).catch((error) => {
        console.error(error);
      });
    } else if (typeof updatedTodo.isCompleted === 'boolean') {
      upsertTodoList = await prisma.todo.update({
        where: { id: updatedTodo.id },
        data: { isCompleted: updatedTodo.isCompleted }
      }).catch((error) => {
        console.error(error);
      });
    }
  }
  return upsertTodoList;
});