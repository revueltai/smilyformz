<script setup lang="ts">
  import type { ColorPickerProps } from './types'
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<ColorPickerProps>(), {
    color: '#000000',
    disabled: false,
  })

  const emit = defineEmits(['update'])

  const colorModel = ref(props.color)
  const inputRef = ref<HTMLInputElement>()

  watch(
    () => props.color,
    (newColor) => {
      if (newColor !== colorModel.value) {
        colorModel.value = newColor
      }
    },
  )

  watch(colorModel, (newColor) => {
    emit('update', newColor)
  })

  function handleClick() {
    if (!props.disabled && inputRef.value) {
      inputRef.value.click()
    }
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="relative">
      <Button
        size="xs"
        type="button"
        :disabled="disabled"
        @click="handleClick"
      >
        <Icon
          name="pipette"
          color="slate-700"
          size="sm"
        />

        <div
          class="w-6 h-4 rounded-sm border border-slate-300"
          :style="{ backgroundColor: colorModel }"
        />

        <input
          ref="inputRef"
          v-model="colorModel"
          type="color"
          class="absolute inset-0 opacity-0 cursor-pointer"
          :disabled="disabled"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped>
  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type='color']::-webkit-color-swatch {
    border: none;
  }
</style>
