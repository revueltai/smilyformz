<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-4 text-center">
    <div class="flex flex-col items-center gap-2">
      <Icon
        name="triangle-alert"
        size="lg"
        color="slate-400"
        stroke-width="2"
      />

      <p class="text-sm text-slate-500">
        {{ $t('noConnectionDescription') }}
      </p>
    </div>

    <Button @click="$emit('retry')">
      <Icon
        name="refresh-cw"
        size="sm"
        color="slate-600"
      />

      {{ $t('retry') }}
    </Button>
  </div>
</template>
