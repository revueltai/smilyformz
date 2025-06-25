<script setup lang="ts">
  import Page from '@/components/app/Page.vue'
  import RankingList from '@/components/app/RankingList.vue'

  const mockRankingData = [
    { position: 1, username: 'Player1', score: 1250, country: 'US' },
    { position: 2, username: 'Player2', score: 1100, country: 'CA' },
    { position: 3, username: 'Player3', score: 950, country: 'UK' },
    { position: 4, username: 'Player4', score: 800, country: 'DE' },
    { position: 5, username: 'Player5', score: 750, country: 'FR' },
    { position: 6, username: 'Player6', score: 750, country: 'FR' },
    { position: 7, username: 'Player7', score: 750, country: 'FR' },
    { position: 8, username: 'Player8', score: 750, country: 'FR' },
    { position: 9, username: 'Player9', score: 750, country: 'FR' },
    { position: 10, username: 'Player10', score: 750, country: 'FR' },
  ]
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

        <h2 class="text-xl">{{ $t('smilyLeaguesRanking') }}</h2>
      </header>

      <div class="flex flex-col gap-4 min-h-0 flex-1">
        <RankingList :list="mockRankingData" />

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
