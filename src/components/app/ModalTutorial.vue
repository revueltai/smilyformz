<script setup lang="ts">
  import { ref } from 'vue'

  const totalPages = 3

  const page = ref(1)

  function handleClickPage(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      if (page.value > 1) {
        page.value--
      }
    } else {
      if (page.value <= totalPages) {
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

      <div class="bg-slate-50 rounded-lg p-3">
        <img
          :src="`/images/tutorial${page}.svg`"
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
        :disabled="page === totalPages"
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
