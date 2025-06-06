<script setup lang="ts">
  import { isMobile } from '@/utils'
  import { computed, onMounted, ref } from 'vue'
  import type { SelectProps } from './type'

  const props = withDefaults(defineProps<SelectProps>(), {
    options: () => [],
    label: '',
    iconName: '',
    asset: '',
    labelColor: 'slate-400',
    selectLabel: 'Select an option',
    showPlaceholderOption: true,
    required: false,
    disabled: false,
    hasClickableIcon: false,
  })

  const emit = defineEmits(['update:modelValue', 'blur', 'clickIcon'])
  const selectModel = defineModel()

  onMounted(() => {
    if (props.options.length === 1) {
      selectModel.value = props.options[0].value
      emit('update:modelValue', props.options[0].value)
    }
  })

  const isTouched = ref(false)

  const isRequired = computed(() => props.required && isTouched.value)

  const cssClasses = computed(() => {
    const output = []

    if (isRequired.value) {
      output.push('border-rose-500')
    }

    return output
  })

  function handleIconClick() {
    if (props.hasClickableIcon) {
      emit('clickIcon')
    }
  }

  function handleChange(event: Event) {
    isTouched.value = true
    emit('update:modelValue', (event.target as HTMLSelectElement).value)
  }
</script>

<template>
  <div class="select-el flex flex-col gap-2">
    <Label
      v-if="name"
      :name="name"
      :label="label"
      :color="labelColor"
      class="transition-colors"
    />

    <div
      :class="cssClasses"
      class="select-wrapper flex items-center gap-2 bg-white border border-t-2 border-slate-300 py-2 pl-3 pr-1.5 rounded-lg transition-colors hover:border-slate-400 invalid:text-rose-500 disabled:border-gray-300 disabled:cursor-not-allowed h-[44px]"
    >
      <Icon
        v-if="iconName"
        :name="iconName"
        :type="iconType"
        :color="iconColor"
        :size="isMobile() ? 'sm' : 'md'"
        @click="handleIconClick"
      />

      <select
        :id="name"
        v-model="selectModel"
        :name="name"
        :required="isRequired"
        :disabled="disabled"
        class="w-full h-full bg-transparent outline-none text-base text-slate-700 disabled:text-gray-300 invalid:text-rose-500 transition-colors"
        :class="showPlaceholderOption && !selectModel ? 'text-slate-400' : 'text-slate-700'"
        @change="handleChange"
      >
        <option
          v-if="showPlaceholderOption"
          value=""
          disabled
        >
          {{ selectLabel }}
        </option>

        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
  .select-el:has(select:invalid) label,
  .select-wrapper:has(select:invalid) {
    @reference border-rose-400 text-rose-500;
  }
</style>
