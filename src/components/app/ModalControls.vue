<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      ctaText?: string
      hasHomeButton?: boolean
    }>(),
    {
      ctaText: '',
      hasHomeButton: true,
    },
  )
</script>

<template>
  <div class="flex gap-4 justify-center w-full">
    <Button
      v-if="hasHomeButton"
      @click="$emit('home')"
    >
      <Icon
        name="house"
        size="md"
        color="slate-700"
      />
    </Button>

    <Button
      border-color="lime-600"
      border-color-hover="lime-400"
      background-color="lime-50"
      background-color-hover="lime-100"
      text-color="lime-800"
      class="flex-1"
      @click="$emit('click')"
    >
      {{ ctaText || $t('resume') }}
    </Button>
  </div>
</template>
