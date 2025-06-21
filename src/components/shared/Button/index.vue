<script setup lang="ts">
  import { computed, useSlots } from 'vue'
  import type { ButtonFormTypes, ButtonProps } from './types'
  import { isNoneToken } from '@/utils'
  import Icon from '../Icon/index.vue'

  const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'base',
    type: 'button',
    backgroundColor: 'white',
    backgroundColorHover: 'slate-300',
    borderColor: 'slate-300',
    borderColorHover: 'slate-200',
    textColor: 'slate-700',
    cssClasses: '',
    activeClass: '',
    textAlignment: 'center',
    to: null,
    disabled: false,
    isUnstyled: false,
    triggerKey: 'Enter',
    exact: false,
  })

  const LINK_SIZE_CLASSES = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-xl',
  }

  const ICON_ONLY_SIZE_CLASSES = {
    xs: 'p-2',
    sm: 'p-2',
    base: 'p-3',
    lg: 'p-3',
    xl: 'p-4',
    '2xl': 'p-4',
  }

  const BUTTON_SIZE_CLASSES = {
    xs: 'text-xs py-2 px-3',
    sm: 'text-sm py-2 px-3',
    base: 'text-sm sm:text-base py-3 px-4',
    lg: 'text-base sm:text-lg py-3 px-4',
    xl: 'text-lg sm:text-xl py-4 px-6',
    '2xl': 'text-xl sm:text-xl py-4 px-6',
  }

  const slots = useSlots()
  const emit = defineEmits(['click'])

  const isButton = computed(() => (props.type === 'button' || props.type === 'submit') && !props.to)
  const isLink = computed(() => props.type === 'link')
  const isExternalLink = computed(
    () => isLink.value && props.to && (props.to as string)?.startsWith('https'),
  )
  const isRouterLink = computed(() => !(isButton.value || isExternalLink.value))

  const isIconOnly = computed(() => {
    const defaultSlot = slots.default?.()

    if (!defaultSlot || defaultSlot.length !== 1) {
      return false
    }

    const slotChild = defaultSlot[0]

    return slotChild.type === Icon
  })

  const cssClasses = computed(() => {
    const baseClasses =
      'cursor-pointer inline-flex items-center gap-2 transition-all origin-right active:translate-y-0.5'

    if (props.isUnstyled) {
      return baseClasses
    }

    const payload = [
      `${baseClasses} text-${props.textColor} disabled:grayscale disabled:opacity-50 focus:outline-none text-${props.textAlignment} ${props.cssClasses}`,
    ]

    if (!isLink.value) {
      payload.push(
        `justify-center shadow-xs bg-${props.backgroundColor} hover:bg-${props.backgroundColorHover}`,
      )

      if (!isNoneToken(props.borderColor)) {
        payload.push(
          `border border-x border-t-1 border-b-2 border-${props.borderColor} hover:border-${props.borderColorHover}`,
        )
      }
    }

    if (isIconOnly.value) {
      payload.push('rounded-full')
      payload.push(ICON_ONLY_SIZE_CLASSES[props.size])
    } else {
      payload.push('rounded-lg')

      if (isLink.value) {
        payload.push(LINK_SIZE_CLASSES[props.size])
      } else {
        payload.push(BUTTON_SIZE_CLASSES[props.size])
      }
    }

    return payload.join(' ')
  })

  function handleClick(event: Event) {
    emit('click', event)
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === props.triggerKey) {
      handleClick(event as Event)
    }
  }
</script>

<template>
  <RouterLink
    v-if="isRouterLink"
    :class="cssClasses"
    :exact="exact"
    :exact-active-class="exact ? activeClass : undefined"
    :active-class="!exact ? activeClass : undefined"
    :to="to ?? ''"
    @click="handleClick"
    @keydown="handleKeyPress"
  >
    <slot />
  </RouterLink>

  <a
    v-else-if="isExternalLink"
    :href="String(to)"
    :class="cssClasses"
    target="_blank"
    rel="noopener noreferrer"
    @keydown="handleKeyPress"
  >
    <slot />
  </a>

  <button
    v-else
    role="button"
    :type="type as ButtonFormTypes"
    :class="cssClasses"
    :disabled="disabled"
    @click="handleClick"
    @keydown="handleKeyPress"
  >
    <slot />
  </button>
</template>
