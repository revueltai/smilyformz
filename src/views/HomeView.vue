<script setup lang="ts">
  import { ref } from 'vue'
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'
  import StatBlock from '@/components/app/StatBlock.vue'
  import EmailConfirmationWarning from '@/components/app/EmailConfirmationWarning.vue'
  import ModalShare from '@/components/app/ModalShare.vue'
  import { MODALS } from '@/configs/constants'
  import { useModalStore } from '@/stores/modal.store'
  import { useUserStore } from '@/stores/user.store'

  const userStore = useUserStore()
  const modalStore = useModalStore()

  const score = ref(2000)
  const ranking = ref(120)
  const activeShare = ref<'score' | 'ranking'>('score')

  function isActiveShareScore() {
    return activeShare.value === 'score'
  }

  function handleShare(type: 'score' | 'ranking') {
    if (type === 'score') {
      activeShare.value = 'score'
      modalStore.openModal(MODALS.SHARE)
      return
    }

    activeShare.value = 'ranking'
    modalStore.openModal(MODALS.SHARE)
  }
</script>

<template>
  <Page
    has-tutorial-button
    content-classes="flex flex-col justify-between"
  >
    <HeaderUser :display-name="userStore.displayName" />

    <EmailConfirmationWarning :is-confirmed="userStore.isEmailConfirmed" />

    <div class="flex flex-col gap-4">
      <StatBlock
        :label="$t('yourLastScore')"
        :value="score"
        variant="score"
        @click="handleShare('score')"
      />

      <StatBlock
        :label="$t('yourGlobalRanking')"
        value="123"
        @click="handleShare('ranking')"
      />
    </div>

    <div class="w-full flex gap-4 items-end justify-center">
      <Button
        to="/ranking"
        size="base"
      >
        <Icon
          name="award"
          size="md"
          color="slate-700"
        />
      </Button>

      <Button
        to="/game"
        size="2xl"
        border-color="lime-600"
        border-color-hover="lime-400"
        background-color="lime-50"
        background-color-hover="lime-100"
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
      :heading="isActiveShareScore() ? $t('shareScore') : $t('shareRanking')"
    >
      <ModalShare
        :text="
          !isActiveShareScore()
            ? $t('shareScoreText', { score })
            : $t('shareRankingText', { ranking })
        "
      />
    </Modal>
  </Page>
</template>
