<script setup lang="ts"></script>

<template>
  <div>
    <Button
      size="xl"
      class="absolute left-2 bottom-6 z-20"
      @click="$emit('move-left')"
    >
      <Icon
        size="md"
        name="arrow-left"
        color="slate-700"
      />
    </Button>

    <Button
      size="xl"
      class="absolute right-2 bottom-6 z-20"
      @click="$emit('move-right')"
    >
      <Icon
        size="md"
        name="arrow-right"
        color="slate-700"
      />
    </Button>
  </div>
</template>
