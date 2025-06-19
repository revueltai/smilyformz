<script setup lang="ts">
  import { isMobile } from '@/utils'
  import { computed, onMounted, ref } from 'vue'
  import type { SelectProps } from './type'
  import { useI18n } from 'vue-i18n'
  import Footnote from '../Footnote/index.vue'

  const props = withDefaults(defineProps<SelectProps>(), {
    options: () => [],
    label: '',
    iconName: '',
    asset: '',
    labelColor: 'slate-400',
    footnote: '',
    footnoteColor: 'slate-400',
    selectLabel: 'Select an option',
    showPlaceholderOption: true,
    required: false,
    disabled: false,
    hasClickableIcon: false,
    isEditable: true,
    showSelectField: false,
    showStaticField: false,
    showEditIcon: true,
  })

  const emit = defineEmits(['update:modelValue', 'blur', 'clickIcon'])

  const { t } = useI18n()

  const selectModel = defineModel<string | number>()

  const isTouched = ref(false)

  const isEditing = ref(false)

  const isRequired = computed(() => props.required && isTouched.value)

  const isInvalid = computed(() => {
    if (!isTouched.value) {
      return false
    }

    return !validateInput(selectModel.value)
  })

  const getErrorMessage = computed(() => {
    if (!isTouched.value) {
      return ''
    }

    if (!selectModel.value || selectModel.value === '') {
      return t('requiredField')
    }

    return t('invalidInput')
  })

  function validateInput(value: string | number | undefined) {
    if (!value || value === '') {
      return !props.required
    }

    return true
  }

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

  function handleChange(event: Event) {
    isTouched.value = true
    emit('update:modelValue', (event.target as HTMLSelectElement).value)
    emit('blur', event)
  }

  onMounted(() => {
    if (props.options.length === 1) {
      selectModel.value = props.options[0].value
      emit('update:modelValue', props.options[0].value)
    }
  })
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
      v-if="showStaticField && !isEditing"
      class="flex items-center gap-2 w-full"
      @click="handleClickEdit"
    >
      <div
        :class="cssClassesField"
        class="cursor-pointer truncate max-w-xs"
      >
        {{ options.find((option) => option.value === selectModel)?.label }}
      </div>

      <Icon
        v-if="isEditable && showEditIcon"
        name="pencil"
        color="slate-700"
        class="cursor-pointer"
      />
    </div>

    <div
      v-if="showSelectField || (isEditable && showStaticField && isEditing)"
      class="flex items-center justify-between gap-3"
    >
      <div
        :class="[
          'select-wrapper flex items-center gap-2 bg-white border border-t-2 py-2 pl-3 pr-1.5 rounded-lg transition-colors disabled:border-gray-300 disabled:cursor-not-allowed w-full',
          isInvalid ? 'border-rose-600' : 'border-slate-300 hover:border-slate-400',
        ]"
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
          :class="[
            'w-full h-full bg-transparent outline-none text-base disabled:text-gray-300 transition-colors',
            showPlaceholderOption && !selectModel ? 'text-slate-400' : 'text-slate-700',
            isInvalid ? 'text-rose-600' : '',
          ]"
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
  .select-el:has(select:invalid) label,
  .select-wrapper:has(select:invalid),
  .select-wrapper:has(select.invalid) {
    @reference border-rose-600 text-rose-600;
  }
</style>
