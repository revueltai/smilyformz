<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      label: string
      value: string | number
      variant?: 'score' | 'ranking'
      hasShareButton?: boolean
    }>(),
    {
      variant: 'ranking',
      hasShareButton: true,
    },
  )

  const bgColor = props.variant === 'score' ? 'bg-green-100' : 'bg-slate-100'
  const textColor = props.variant === 'score' ? 'text-lime-900' : 'text-slate-900'
</script>

<template>
  <div
    class="flex justify-between items-center rounded-xl px-3 py-4"
    :class="[bgColor, textColor]"
  >
    <p class="text-sm">
      {{ label }}
    </p>

    <div class="flex items-center gap-2">
      <p class="text-xs uppercase font-bold">{{ value }}</p>

      <Button
        v-if="hasShareButton"
        size="sm"
        @click="$emit('click')"
      >
        <Icon
          name="share-2"
          size="sm"
          color="slate-700"
        />
      </Button>
    </div>
  </div>
</template>
