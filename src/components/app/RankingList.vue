<script setup lang="ts">
  import RankingItem from '@/components/app/RankingItem.vue'

  interface RankItem {
    position: number
    username: string
    score: string | number
    country: string
  }

  interface Props {
    list: RankItem[]
  }

  withDefaults(defineProps<Props>(), {
    list: () => [],
  })
</script>

<template>
  <ol class="flex flex-col py-2 px-0 bg-slate-100 rounded-xl overflow-y-auto">
    <li
      v-for="item in list"
      :key="item.position"
    >
      <RankingItem
        :position="item.position"
        :username="item.username"
        :score="item.score"
        :country="item.country"
      />
    </li>
  </ol>
</template>
