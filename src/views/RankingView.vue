<script setup lang="ts">
  import { ref } from 'vue'
  import Page from '@/components/app/Page.vue'
  import RankingList from '@/components/app/RankingList.vue'
  import { mockRankings } from '@/configs/mocks'

  const filter = ref('')
</script>

<template>
  <Page
    back-button-to="home"
    content-classes="flex flex-col h-full"
  >
    <div class="flex flex-col gap-6 h-full">
      <header
        class="flex flex-col items-center justify-center h-36 p-4 gap-3 bg-slate-200 rounded-3xl shrink-0"
      >
        <Icon
          name="globe"
          size="2xl"
        />

        <h2 class="text-xl">{{ $t('globalRanking') }}</h2>
      </header>

      <div class="flex flex-col gap-4 min-h-0 flex-1">
        <Input
          v-model="filter"
          :placeholder="$t('filterByUsername')"
          :show-edit-icon="false"
          iconName="search"
          show-input-field
          class="shrink-0"
        />

        <RankingList :list="mockRankings" />

        <div class="flex flex-col items-center gap-3 mt-2 shrink-0">
          <p class="text-center text-xs text-slate-400">
            {{ $t('globalRankingTeaser1') }}<br />
            {{ $t('globalRankingTeaser2') }}
          </p>

          <Button
            size="xs"
            to="game"
            border-color="lime-600"
            border-color-hover="lime-400"
            background-color="lime-50"
            background-color-hover="lime-100"
            text-color="lime-800"
          >
            <Icon
              name="play"
              size="sm"
              color="lime-800"
            />

            {{ $t('playNow') }}
          </Button>
        </div>
      </div>
    </div>
  </Page>
</template>
