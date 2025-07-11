<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center gap-3 mt-2 shrink-0">
    <p class="text-center text-xs text-slate-400">
      {{ $t('globalRankingTeaser1') }}<br />
      {{ $t('globalRankingTeaser2') }}
    </p>

    <Button
      size="sm"
      to="game"
      border-color="lime-600"
      border-color-hover="lime-400"
      background-color="lime-100"
      background-color-hover="lime-200"
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
</template>
