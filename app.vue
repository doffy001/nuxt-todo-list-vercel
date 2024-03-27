<template>
  <NuxtLayout>
    <v-app>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-app>
  </NuxtLayout>
</template>

<style lang="scss">
  .v-application__wrap {
    justify-content: center;
    .v-container {
      max-width: 900px;
    }
  }
</style>
