<script setup lang="ts">
  import { isMobile } from '@/utils'
  import { computed, ref } from 'vue'
  import type { InputProps } from './types'
  import { useI18n } from 'vue-i18n'
  import Footnote from '../Footnote/index.vue'

  const props = withDefaults(defineProps<InputProps>(), {
    label: '',
    footnote: '',
    labelColor: 'slate-400',
    footnoteColor: 'slate-400',
    iconColor: 'slate-700',
    placeholder: 'Enter a text',
    maxlength: 100,
    isEditable: true,
    showInputField: false,
    showStaticField: false,
    cssClassesField: '',
    type: 'text',
    iconType: 'stroke',
    required: false,
    requiredMessage: 'requiredField',
    disabled: false,
    hasClickableIcon: false,
    showEditIcon: true,
    externalError: '',
    forceInvalid: false,
  })

  const emit = defineEmits(['update:modelValue', 'blur', 'clickIcon', 'update'])

  const { t } = useI18n()

  const inputModel = defineModel<string>()

  const isTouched = ref(false)

  const isEditing = ref(false)

  const isPasswordVisible = ref(false)

  const isPassword = computed(() => props.type === 'password')

  const isRequired = computed(() => props.required && isTouched.value)

  const isInvalid = computed(() => {
    if (props.forceInvalid) {
      return true
    }

    if (!isTouched.value) {
      return false
    }

    return !validateInput(inputModel.value)
  })

  const getErrorMessage = computed(() => {
    if (props.externalError) {
      return t(props.externalError)
    }

    if (!isTouched.value) {
      return ''
    }

    if (!inputModel.value || inputModel.value.trim() === '') {
      return t(props.requiredMessage)
    }

    switch (props.type) {
      case 'email':
        return t('enterValidEmail')

      case 'url':
        return t('enterValidUrl')

      case 'number':
        return t('enterValidNumber')

      case 'tel':
        return t('enterValidPhoneNumber')

      default:
        return t('enterValidInput')
    }
  })

  function validateInput(value: string | undefined) {
    if (!value || value.trim() === '') {
      return !props.required
    }

    switch (props.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)

      case 'url':
        try {
          new URL(value)
          return true
        } catch {
          return false
        }

      case 'number':
        return !isNaN(Number(value))

      case 'tel':
        return /^\+?[\d\s-]{10,}$/.test(value)

      default:
        return true
    }
  }

  function handleIconClick() {
    if (isPassword.value) {
      isPasswordVisible.value = !isPasswordVisible.value
    }

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
    emit('update', inputModel.value)
  }

  function handleBlur(event: Event) {
    isTouched.value = true
    emit('blur', event)
  }
</script>

<template>
  <div class="input-el flex flex-col gap-2 w-full">
    <Label
      v-if="name"
      :name="name"
      :label="label"
      :color="labelColor"
      class="transition-colors"
    />

    <div
      v-if="showStaticField && !isEditing"
      class="flex items-center gap-2 w-full"
      :class="cssClassesField"
      @click="handleClickEdit"
    >
      <div class="cursor-pointer truncate max-w-xs">
        {{ type === 'password' ? '********' : inputModel }}
      </div>

      <Icon
        v-if="isEditable && showEditIcon"
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
        :class="[
          'input-wrapper w-full flex items-center gap-2 bg-white border border-t-2 py-2 pl-3 pr-1.5 rounded-lg transition-colors disabled:border-gray-300 disabled:cursor-not-allowed h-[44px]',
          isInvalid ? 'border-rose-600' : 'border-slate-300 hover:border-slate-400',
        ]"
      >
        <Icon
          v-if="iconName || isPassword"
          :name="!isPassword ? iconName : isPasswordVisible ? 'eye-off' : 'eye'"
          :type="iconType"
          :color="iconColor"
          :size="isMobile() ? 'sm' : 'md'"
          @click="handleIconClick"
        />

        <input
          :id="name"
          v-model="inputModel"
          :type="isPassword ? (isPasswordVisible ? 'text' : 'password') : type"
          :name="name"
          :placeholder="placeholder"
          :required="isRequired"
          :disabled="disabled"
          :maxlength="maxlength"
          :class="[
            'w-full h-full bg-transparent outline-none text-base placeholder:text-slate-400 disabled:text-gray-300 transition-colors',
            isInvalid ? 'text-rose-600' : 'text-slate-700',
          ]"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @blur="handleBlur"
        />
      </div>

      <div
        v-if="showEditIcon"
        class="flex items-center gap-1"
      >
        <Button
          size="xs"
          border-color="lime-600"
          border-color-hover="lime-400"
          background-color="lime-50"
          background-color-hover="lime-100"
          :disabled="isInvalid"
          @click="handleClickUpdate"
        >
          <Icon
            name="check"
            color="lime-800"
          />
        </Button>
      </div>
    </div>

    <Footnote
      :footnote="footnote"
      :footnote-color="footnoteColor"
      :error="isInvalid ? getErrorMessage : undefined"
    />
  </div>
</template>

<style scoped>
  .input-el:has(input:invalid) label,
  .input-wrapper:has(input:invalid),
  .input-wrapper:has(input.invalid) {
    @reference border-rose-600 text-rose-600;
  }
</style>
