<script setup lang="ts">
  import { ref } from 'vue'
  import { useSoundStore } from '@/stores/sounds'

  const soundStore = useSoundStore()

  const sounds = ref<boolean | undefined>(soundStore.soundsOn)
  const soundEffects = ref<boolean | undefined>(soundStore.soundEffectsOn)

  function handleSoundsChange() {
    console.log('handleSoundsChange')
  }

  function handleSoundEffectsChange() {
    console.log('handleSoundEffectsChange')
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
