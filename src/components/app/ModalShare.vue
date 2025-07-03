<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useSocialShare } from '@/composables/useSocialShare'
  import type { SocialMedia } from '@/composables/useSocialShare'
  import { ToastService } from '../shared/Toast/service'
  import { useI18n } from 'vue-i18n'

  export type ShareType = 'latestScore' | 'highestScore' | 'ranking'

  const props = defineProps<{
    mode: ShareType
    score: number
  }>()

  const { t } = useI18n()

  const { copyToClipboard, shareToX, shareToFacebook, shareToWhatsApp, shareToTelegram } =
    useSocialShare()

  const SOCIAL_MEDIAS: SocialMedia[] = ['x', 'facebook', 'whatsapp', 'telegram', 'copy']

  const isCopied = ref(false)

  const themeColor = computed(() => {
    if (props.mode === 'latestScore') {
      return 'blue'
    }

    if (props.mode === 'highestScore') {
      return 'lime'
    }

    return 'purple'
  })

  const message = computed(() => {
    if (props.mode === 'latestScore') {
      return t('shareLatestScoreText', { score: props.score })
    }

    if (props.mode === 'highestScore') {
      return t('shareHighestScoreText', { score: props.score })
    }

    return t('shareRankingText')
  })

  const description = computed(() => {
    if (props.mode === 'latestScore') {
      return t('shareLatestScoreDescription')
    }

    if (props.mode === 'highestScore') {
      return t('shareHighestScoreDescription')
    }

    return t('shareRankingDescription')
  })

  async function handleCopy() {
    copyToClipboard()
    isCopied.value = true
    ToastService.emitToast(t('linkCopiedToClipboard'), 'success')
    setTimeout(() => (isCopied.value = false), 2000)
  }

  function handleShare(type: SocialMedia) {
    switch (type) {
      case 'x':
        return shareToX(message.value)

      case 'facebook':
        return shareToFacebook()

      case 'whatsapp':
        return shareToWhatsApp(message.value)

      case 'telegram':
        return shareToTelegram(message.value)

      case 'copy':
        return handleCopy()
    }
  }
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-xl px-2 py-3"
    :class="`bg-${themeColor}-50`"
  >
    <p :class="`text-${themeColor}-600`">
      {{ description }}
    </p>

    <div class="flex gap-3 justify-center">
      <Button
        v-for="socialMedia in SOCIAL_MEDIAS"
        :key="socialMedia"
        background-color="white"
        :border-color="`${themeColor}-700`"
        @click="handleShare(socialMedia)"
      >
        <Icon
          :color="`${themeColor}-700`"
          :name="socialMedia"
          size="sm"
        />
      </Button>
    </div>
  </div>
</template>
