<script setup lang="ts">
  import { usePwaInstall } from '@/composables/usePwaInstall'

  const { canInstall, installApp, simulateInstallPrompt } = usePwaInstall()

  async function handleClick() {
    if (!simulateInstallPrompt()) {
      await installApp()
    }
  }
</script>

<template>
  <div
    v-if="canInstall"
    class="absolute top-5 left-4 z-50"
  >
    <div
      class="bg-blue-800 text-white rounded-xl shadow-lg border border-b-2 border-blue-950 transition-all duration-200 cursor-pointer animate-bounce-4 hover:bg-blue-700"
      @click="handleClick"
    >
      <div
        class="flex items-center gap-3 py-1 pl-1 pr-4 border border-blue-600 w-full h-full rounded-xl"
      >
        <div class="bg-white border border-blue-800 rounded-lg p-2 shadow-xs">
          <img
            src="/images/icons/favicon-256x256.png"
            alt="SmilyFormz"
            width="24"
            height="24"
            class="w-6 h-6"
          />
        </div>

        <div class="flex flex-col text-xs font-semibold text-shadow-xs text-shadow-blue-900">
          {{ $t('installApp') }}
        </div>
      </div>
    </div>
  </div>
</template>
