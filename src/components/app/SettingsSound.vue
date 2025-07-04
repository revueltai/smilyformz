<script setup lang="ts">
  import { ref } from 'vue'
  import { useSoundStore } from '@/stores/sounds.store'
  import { useUserStore } from '@/stores/user.store'

  const soundStore = useSoundStore()
  const userStore = useUserStore()

  const music = ref<boolean>(userStore.music)
  const sound = ref<boolean>(userStore.sound)

  async function handleSoundsChange() {
    soundStore.updateSoundSetting(music.value)
    await userStore.updateUserSettings({
      music: music.value,
    })
  }

  async function handleSoundChange() {
    soundStore.updateSoundEffectsSetting(sound.value)
    await userStore.updateUserSettings({
      sound: sound.value,
    })
  }
</script>

<template>
  <div class="flex flex-col gap-4 rounded-lg bg-slate-50 p-4">
    <Switch
      v-model="music"
      :label="$t('music')"
      direction="row"
      name="music"
      @change="handleSoundsChange"
    />

    <Switch
      v-model="sound"
      :label="$t('soundEffects')"
      direction="row"
      name="sound"
      @change="handleSoundChange"
    />
  </div>
</template>
