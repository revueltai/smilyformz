<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useUserStore } from '@/stores/user.store'

  const { isAuthenticated } = useUserStore()

  const page = ref(1)

  const tutorialTotalSteps = computed(() => (isAuthenticated ? 4 : 6))

  function handleClickPage(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      if (page.value > 1) {
        page.value--
      }
    } else {
      if (page.value <= tutorialTotalSteps.value) {
        page.value++
      }
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-3">
      <div class="text-slate-400">
        <p>{{ $t('tutorial' + page + '_1') }}<br />{{ $t('tutorial' + page + '_2') }} </p>
      </div>

      <div class="bg-slate-50 rounded-lg flex items-center justify-center">
        <img
          :src="`/images/tutorial/tutorial${page}.svg`"
          alt="tutorial"
          width="256"
          height="160"
        />
      </div>
    </div>

    <div class="flex justify-center items-center gap-3 pb-4">
      <Button
        :disabled="page === 1"
        @click="handleClickPage('prev')"
      >
        <Icon
          name="arrow-left"
          color="slate-700"
        />
      </Button>

      <Button
        :disabled="page === tutorialTotalSteps"
        @click="handleClickPage('next')"
      >
        <Icon
          name="arrow-right"
          color="slate-700"
        />
      </Button>
    </div>
  </div>
</template>
