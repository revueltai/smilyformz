<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'
  import StatBlockItem from '@/components/app/StatBlockItem.vue'
  import ModalShare from '@/components/app/ModalShare.vue'
  import ModalLeagueSelection from '@/components/app/ModalLeagueSelection.vue'
  import LeagueBlock from '@/components/app/LeagueBlock.vue'
  import Button from '@/components/shared/Button/index.vue'
  import Icon from '@/components/shared/Icon/index.vue'
  import Modal from '@/components/shared/Modal/index.vue'
  import { MODALS } from '@/configs/constants'
  import { useModalStore } from '@/stores/modal.store'
  import { useUserStore } from '@/stores/user.store'
  import type { ShareType } from '@/components/app/ModalShare.vue'
  import { usePWA } from '@/composables/usePwaInstall'

  const userStore = useUserStore()
  const modalStore = useModalStore()
  const isPWA = usePWA()

  const latestScore = ref(0)
  const highestScore = ref(0)
  const activeShare = ref<ShareType>('latestScore')

  function isActiveShareLatestScore() {
    return activeShare.value === 'latestScore'
  }

  function handleShare(type: ShareType) {
    if (type === 'latestScore') {
      activeShare.value = 'latestScore'
      modalStore.openModal(MODALS.SHARE)
      return
    }

    activeShare.value = 'highestScore'
    modalStore.openModal(MODALS.SHARE)
  }

  function handlePlayClick() {
    modalStore.openModal(MODALS.LEAGUE_SELECTION)
  }

  onMounted(async () => {
    latestScore.value = await userStore.getLatestScore()
    highestScore.value = await userStore.getHighestScore()
  })
</script>

<template>
  <Page
    :floating-tiles="true"
    has-tutorial-button
    content-classes="flex flex-col justify-between"
  >
    <HeaderUser
      :display-name="userStore.displayName"
      :avatar-shape="userStore.profile?.avatar.shape"
      :avatar-shape-color="userStore.profile?.avatar.shape_color"
      :avatar-background-color="userStore.profile?.avatar.background_color"
      :avatar-expression="userStore.profile?.avatar.expression"
      class="animate-bounce-subtle"
    />

    <div class="flex flex-col gap-4">
      <LeagueBlock class="animate-bounce-subtle-2" />

      <div class="flex flex-col gap-2 bg-slate-100 rounded-xl p-3 animate-bounce-subtle-2">
        <StatBlockItem
          :label="$t('yourLatestScore')"
          :value="latestScore"
          variant="score"
          class="animate-bounce-subtle-3"
          @click="handleShare('latestScore')"
        />

        <StatBlockItem
          :label="$t('yourHighestScore')"
          :value="highestScore"
          class="animate-bounce-subtle-4"
          @click="handleShare('highestScore')"
        />
      </div>
    </div>

    <div
      class="w-full flex gap-4 items-end justify-center pb-6"
      :class="isPWA ? 'pb-6' : 'pb-8'"
    >
      <Button
        to="/ranking"
        size="base"
        class="animate-bounce-subtle-5"
      >
        <Icon
          name="award"
          size="md"
          color="slate-700"
        />
      </Button>

      <Button
        size="xl"
        border-color="lime-600"
        border-color-hover="lime-400"
        background-color="lime-100"
        background-color-hover="lime-200"
        class="animate-bounce-subtle-7"
        @click="handlePlayClick"
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
        class="animate-bounce-subtle-6"
      >
        <Icon
          name="settings-2"
          size="md"
          color="slate-700"
        />
      </Button>
    </div>

    <Modal
      :name="MODALS.SHARE"
      :heading="isActiveShareLatestScore() ? $t('shareLatestScore') : $t('shareHighestScore')"
    >
      <ModalShare
        :mode="activeShare"
        :score="isActiveShareLatestScore() ? latestScore : highestScore"
      />
    </Modal>

    <Modal
      :name="MODALS.LEAGUE_SELECTION"
      :heading="$t('smilyLeagues')"
    >
      <ModalLeagueSelection />
    </Modal>
  </Page>
</template>
