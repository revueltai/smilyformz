<script setup lang="ts">
  import { ref } from 'vue'
  import { useSoundStore } from '@/stores/sounds'

  const soundStore = useSoundStore()

  const sounds = ref<boolean>(soundStore.soundsOn)
  const soundEffects = ref<boolean>(soundStore.soundEffectsOn)

  function handleSoundsChange() {
    soundStore.updateSoundSetting(sounds.value)
  }

  function handleSoundEffectsChange() {
    soundStore.updateSoundEffectsSetting(soundEffects.value)
  }
</script>

<template>
  <div class="flex flex-col gap-4 rounded-lg bg-slate-50 p-4">
    <Switch
      v-model="sounds"
      :label="$t('music')"
      direction="row"
      name="music"
      @change="handleSoundsChange"
    />

    <Switch
      v-model="soundEffects"
      :label="$t('soundEffects')"
      direction="row"
      @change="handleSoundEffectsChange"
    />
  </div>
</template>
