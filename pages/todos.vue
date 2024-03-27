<template>
  <v-card class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <h1>{{ userName }}'s note</h1>
      <v-btn @click="logout">Logout</v-btn>
    </div>
    <div class="d-flex">
      <v-text-field
        v-model="currentNote"
        placeholder="Take a note..."
        @keyup.enter="addNote"
      />
      <v-btn
        class="ml-4"
        width="56"
        height="56"
        rounded="0"
        icon="mdi-plus"
        @click="addNote"
      />
    </div>
    <v-list
      v-if="todos.length"
      class="js-list-note"
      :key="keyListTodo"
    >
      <v-list-item
        v-for="(todo, i) in todos"
        :key="todo.id"
        :data-id="todo.id"
      >
        <div class="d-flex align-center">
          <v-checkbox
            v-model="todo.isCompleted"
            class="mr-4"
            hide-details
            color="secondary"
            @change="toggleCompletedTodo(i)"
          />
          <v-text-field
            :readonly="!todo.isEditing"
            :model-value="todo.content"
            :disabled="todo.isCompleted"
            hide-details
            @keyup.enter="(e: Event) => finishEditingNote(i, e)"
            @blur="(e: Event) => finishEditingNote(i, e)"
          />
          <v-btn
            class="mx-4"
            :disabled="todo.isCompleted || todo.isEditing"
            color="info"
            @click="editNote(i)"
          >
            Edit
          </v-btn>
          <v-btn
            icon="mdi-close"
            width="30"
            height="30"
            color="red-darken-1"
            rounded
            @click="deleteNote(i)"
          />
        </div>
      </v-list-item>
    </v-list>
    <v-snackbar
      v-model="isShowSnackbar"
      timeout="2000"
    >
      You deleted the note.
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ref, onBeforeMount } from 'vue';

type Todo = {
  id: string | number,
  content: string,
  isEditing: boolean,
  isCompleted: boolean,
};
const userId = useCookie('userId');
const userName = useCookie('userName');
const todos = ref<Todo[]>([]);
const currentNote = ref('');
const isShowSnackbar = ref(false);
const keyListTodo = ref(1);
const updateKeyListTodo = () => {
  keyListTodo.value++;
};

const addNote = async () => {
  if (!currentNote.value.trim()) return;
  const newTodo = {
    id: userId.value + '-' + uuidv4(),
    content: currentNote.value.trim(),
    isEditing: false,
    isCompleted: false,
  };
  todos.value.push(newTodo);
  currentNote.value = '';
  await useFetch('/api/todos', {
    method: 'POST',
    body: { userId, newTodo },
  });
};

const editNote = (i: number) => {
  const input = document.querySelector(`.js-list-note [data-id="${todos.value[i].id}"] input[type=text]`) as HTMLInputElement;
  input.focus();
  todos.value[i].isEditing = true;
};

const finishEditingNote = async (i: number, e: Event) => {
  const input = e.target as HTMLInputElement | null;
  const newNote = input?.value;
  todos.value[i].isEditing = false;
  if (newNote) {
    const updatedTodo = todos.value[i];
    todos.value[i].content = newNote;
    await useFetch('/api/todos', {
      method: 'POST',
      body: { userId, updatedTodo },
    });
  }
  updateKeyListTodo();
};

const deleteNote = async (i: number) => {
  isShowSnackbar.value = true;
  const deletedTodoId = todos.value.splice(i, 1)[0].id;
  await useFetch('/api/todos', {
    method: 'DELETE',
    body: { deletedTodoId },
  });
};

const toggleCompletedTodo = async (i: number) => {
  const updatedTodo = {
    id: todos.value[i].id,
    isCompleted: todos.value[i].isCompleted,
  };
  await useFetch('/api/todos', {
    method: 'POST',
    body: { userId, updatedTodo },
  });
};

const logout = () => {
  userId.value = null;
  navigateTo('/');
  setTimeout(() => {
    userName.value = null;
  }, 200);
};

onBeforeMount(async () => {
  await nextTick();
  const { data } = await useFetch('/api/todos', {
    params: { userId: userId.value }
  });
  if (data.value?.length) {
    todos.value = data.value.map(({ id, content, isCompleted }) => ({
      id,
      content,
      isEditing: false,
      isCompleted,
    }));
  }
});
</script>

<style lang="scss">
.v-list {
  max-height: 500px;
}

.v-input--readonly {
  pointer-events: none;
}
.v-input--disabled {
  input:disabled {
    text-decoration: line-through;
  }
}

.v-overlay-container {
  .v-overlay__content {
    right: 0;
    left: auto !important;
    transform: none !important;
  }
  .v-snackbar__content {
    text-align: center;
  }
}
</style>