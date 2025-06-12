<script setup lang="ts">
  import { ref } from 'vue'
  import {
    shareToTwitter,
    shareToFacebook,
    shareToWhatsApp,
    shareToTelegram,
    shareToLinkedIn,
    copyToClipboard,
  } from '@/utils/share'

  type SocialMedia = 'twitter' | 'facebook' | 'whatsapp' | 'telegram' | 'linkedin' | 'copy'

  const props = withDefaults(
    defineProps<{
      text?: string
      url?: string
    }>(),
    {
      title: '',
      text: '',
      url: window.location.href,
    },
  )

  const socialMedias: SocialMedia[] = [
    'twitter',
    'facebook',
    'whatsapp',
    'telegram',
    'linkedin',
    'copy',
  ]

  const isCopied = ref(false)

  async function handleCopy() {
    await copyToClipboard(props.url)
    isCopied.value = true
    setTimeout(() => (isCopied.value = false), 2000)
  }

  function handleShare(type: SocialMedia) {
    const shareOptions = {
      title: props.title,
      text: props.text,
      url: props.url,
    }

    switch (type) {
      case 'twitter':
        return shareToTwitter(shareOptions)

      case 'facebook':
        return shareToFacebook(shareOptions)

      case 'whatsapp':
        return shareToWhatsApp(shareOptions)

      case 'telegram':
        return shareToTelegram(shareOptions)

      case 'linkedin':
        return shareToLinkedIn(shareOptions)

      case 'copy':
        return handleCopy()
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 overflow-x-auto bg-slate-100 rounded-xl p-2">
      <Button
        v-for="socialMedia in socialMedias"
        :key="socialMedia"
        @click="handleShare(socialMedia)"
      >
        <Icon
          :name="socialMedia"
          size="sm"
        />
      </Button>
    </div>
  </div>
</template>
