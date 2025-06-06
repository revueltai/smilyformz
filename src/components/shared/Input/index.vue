<script setup lang="ts">
  import { isMobile } from '@/utils'
  import { computed, ref } from 'vue'
  import type { InputProps } from './types'

  const props = withDefaults(defineProps<InputProps>(), {
    label: '',
    footnote: '',
    labelColor: 'slate-400',
    footnoteColor: 'slate-400',
    placeholder: 'Enter a text',
    maxlength: 100,
    isEditable: true,
    showInputField: false,
    showStaticField: false,
    cssClassesField: '',
    type: 'text',
    required: false,
    disabled: false,
    hasClickableIcon: false,
  })

  const emit = defineEmits(['update:modelValue', 'blur', 'clickIcon'])
  const inputModel = defineModel()

  const isTouched = ref(false)

  const isEditing = ref(false)

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

  function handleClickEdit() {
    if (props.isEditable) {
      isEditing.value = true
    }
  }

  function handleClickUpdate() {
    isEditing.value = false
  }
</script>

<template>
  <div class="input-el flex flex-col gap-2 w-full">
    <Label
      v-if="label"
      :name="name"
      :label="label"
      :color="labelColor"
      class="transition-colors"
    />

    <div
      v-if="showStaticField && !isEditing"
      class="flex items-center gap-2 w-full"
      @click="handleClickEdit"
    >
      <div
        :class="cssClassesField"
        class="cursor-pointer truncate max-w-xs"
      >
        {{ inputModel }}
      </div>

      <Icon
        v-if="isEditable"
        name="pencil"
        color="slate-700"
        class="cursor-pointer"
      />
    </div>

    <div
      v-if="showInputField || (isEditable && showStaticField && isEditing)"
      class="flex items-center justify-between gap-3"
    >
      <div
        :class="cssClasses"
        class="input-wrapper w-full flex items-center gap-2 bg-white border border-t-2 border-slate-300 py-2 pl-3 pr-1.5 rounded-lg transition-colors hover:border-slate-400 invalid:text-rose-500 disabled:border-gray-300 disabled:cursor-not-allowed h-[44px]"
      >
        <Icon
          v-if="iconName"
          :name="iconName"
          :type="iconType"
          :color="iconColor"
          :size="isMobile() ? 'sm' : 'md'"
          @click="handleIconClick"
        />

        <input
          :id="name"
          v-model="inputModel"
          :type="type"
          :name="name"
          :placeholder="placeholder"
          :required="isRequired"
          :disabled="disabled"
          :maxlength="maxlength"
          class="w-full h-full bg-transparent outline-none text-base placeholder:text-slate-400 text-slate-700 disabled:text-gray-300 invalid:text-rose-500 transition-colors"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @blur="emit('blur', $event)"
        />

        <p
          v-if="footnote"
          :class="`text-xs text-${footnoteColor}`"
        >
          {{ footnote }}
        </p>
      </div>

      <div class="flex items-center gap-1">
        <Button
          size="xs"
          border-color="lime-600"
          border-color-hover="lime-400"
          background-color="lime-50"
          background-color-hover="lime-100"
          @click="handleClickUpdate"
        >
          <Icon
            name="check"
            color="lime-800"
          />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .input-el:has(input:invalid) label,
  .input-wrapper:has(input:invalid) {
    @reference border-rose-400 text-rose-500;
  }
</style>
