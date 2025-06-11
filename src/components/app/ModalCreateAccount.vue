<script setup lang="ts">
  import { ref } from 'vue'
</script>

<template>
  <form>
    <Input
      v-model="username"
      label="username"
      name="email"
      show-static-field
      class="border-b border-slate-300 pb-3 mb-3"
    />

    <Input
      v-model="email"
      label="Email"
      name="email"
      show-static-field
      class="border-b border-slate-300 pb-3 mb-3"
    />

    <Input
      v-model="email"
      label="Email"
      name="email"
      show-static-field
      class="border-b border-slate-300 pb-3 mb-3"
    />

    <Input
      v-model="email"
      label="Email"
      name="email"
      show-static-field
      class="border-b border-slate-300 pb-3"
    />
  </form>
</template>
