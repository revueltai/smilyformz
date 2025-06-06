<script setup lang="ts">
  import { computed } from 'vue'
  import type { SwitchProps } from './type'

  const props = withDefaults(defineProps<SwitchProps>(), {
    direction: 'col',
    size: 'sm',
    label: '',
    name: '',
    required: false,
    disabled: false,
    modelValue: false,
  })

  const emit = defineEmits(['update:modelValue'])

  const cssClasses = computed(() => {
    const output = ['border']

    if (props.disabled) {
      output.push('bg-white cursor-not-allowed opacity-50')
    } else if (props.modelValue) {
      output.push('bg-lime-100 border-lime-600')
    } else {
      output.push('bg-white border-slate-300')
    }

    output.push('w-10')

    return output
  })

  const cssClassesKnob = computed(() => {
    const output = ['transform']

    if (props.disabled) {
      output.push('cursor-not-allowed')
    } else if (props.modelValue) {
      output.push('bg-lime-600 translate-x-full -ml-2')
    } else {
      output.push('bg-slate-300')
    }

    return output
  })
</script>

<template>
  <div
    class="flex gap-2"
    :class="direction === 'col' ? 'flex-col' : 'flex-row-reverse items-center justify-end'"
  >
    <Label
      v-if="label"
      :label="label"
      :for="name"
      class="transition-colors"
    />

    <div class="flex items-center gap-2">
      <label class="flex items-center cursor-pointer">
        <input
          :id="name"
          :checked="modelValue"
          type="checkbox"
          :name="name"
          :disabled="disabled"
          class="hidden"
          @change="emit('update:modelValue', !modelValue)"
        />

        <div
          class="box-content overflow-hidden rounded-full relative transition-colors w-10 h-6"
          :class="cssClasses"
        >
          <span
            class="relative block rounded-full transition-transform w-6 h-6"
            :class="cssClassesKnob"
          />
        </div>
      </label>
    </div>
  </div>
</template>
