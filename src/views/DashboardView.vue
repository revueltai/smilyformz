<script setup lang="ts">
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'

  function handleShare(type: 'score' | 'ranking') {
    if (type === 'score') {
      console.log('share score')
      return
    }

    console.log('share ranking')
  }

  function handleClickPlay() {
    console.log('play')
  }

  function handleClickShowRanking() {
    console.log('show ranking')
  }

  function handleClickShowSettings() {
    console.log('show settings')
  }
</script>

<template>
  <Page
    has-tutorial-button
    content-classes="flex flex-col justify-between"
  >
    <HeaderUser />

    <div class="flex flex-col gap-4">
      <div
        class="flex justify-between items-center rounded-xl px-3 py-4 text-lime-900 bg-green-100"
      >
        <p class="text-sm">
          {{ $t('lastScore') }}
        </p>

        <div class="flex items-center gap-2">
          <p class="text-xs uppercase font-bold">2000 Pts</p>
          <Button
            size="sm"
            @click="handleShare('score')"
          >
            <Icon
              name="share-2"
              size="sm"
              color="slate-700"
            />
          </Button>
        </div>
      </div>

      <div
        class="flex justify-between items-center rounded-xl px-3 py-4 text-slate-900 bg-slate-100"
      >
        <p class="text-sm">
          {{ $t('globalRanking') }}
        </p>

        <div class="flex items-center gap-2">
          <p class="text-xs uppercase font-bold">123</p>
          <Button
            size="sm"
            @click="handleShare('ranking')"
          >
            <Icon
              name="share-2"
              size="sm"
              color="slate-700"
            />
          </Button>
        </div>
      </div>
    </div>

    <div class="w-full flex gap-4 items-end justify-center">
      <Button
        to="/ranking"
        size="base"
        @click="handleClickShowRanking"
      >
        <Icon
          name="award"
          size="md"
          color="slate-700"
        />
      </Button>

      <Button
        size="2xl"
        border-color="lime-600"
        border-color-hover="lime-400"
        background-color="lime-50"
        background-color-hover="lime-100"
        @click="handleClickPlay"
      >
        <Icon
          name="play"
          size="2xl"
          color="lime-900"
        />
      </Button>

      <Button
        to="/profile"
        size="base"
        @click="handleClickShowSettings"
      >
        <Icon
          name="settings-2"
          size="md"
          color="slate-700"
        />
      </Button>
    </div>
  </Page>
</template>
