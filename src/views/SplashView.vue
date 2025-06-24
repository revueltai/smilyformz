<script setup lang="ts">
  import { ref } from 'vue'
  import Page from '@/components/app/Page.vue'
  import { useModalStore } from '@/stores/modal.store'
  import ModalLogin from '@/components/app/ModalLogin.vue'
  import ModalCreateAccount from '@/components/app/ModalCreateAccount.vue'
  import ModalCredits from '@/components/app/ModalCredits.vue'
  import { MODALS } from '@/configs/constants'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const modalStore = useModalStore()

  function handleClickButtonPlay() {
    router.push('/game')
  }

  function handleClickButtonCreateAccount() {
    modalStore.openModal(MODALS.CREATE_ACCOUNT)
  }

  function handleClickButtonLogin() {
    modalStore.openModal(MODALS.LOGIN)
  }

  function handleClickButtonCredits() {
    modalStore.openModal(MODALS.CREDITS)
  }
</script>

<template>
  <Page
    has-tutorial-button
    content-is-centered
  >
    <div class="flex flex-col gap-16 items-center justify-center">
      <img
        src="/images/logo.svg"
        alt="splash"
        width="249"
        height="120"
        class="animate-bounce sm:w-1/2"
      />

      <div class="flex flex-col gap-4 items-center">
        <div class="mb-10">
          <Button
            size="2xl"
            background-color="lime-50"
            border-color="lime-600"
            class="animate-bounce-1"
            @click="handleClickButtonPlay"
          >
            <Icon
              name="play"
              size="2xl"
              color="lime-600"
            />
          </Button>
        </div>

        <Button
          size="base"
          class="animate-bounce-2"
          @click="handleClickButtonCreateAccount"
        >
          <Icon
            name="circle-user-round"
            size="md"
          />

          {{ $t('createAnAccount') }}
        </Button>

        <Button
          size="xs"
          class="animate-bounce-3"
          @click="handleClickButtonLogin"
        >
          <Icon
            name="log-in"
            size="sm"
          />

          {{ $t('haveAccount') }}
        </Button>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 px-2 pb-4 text-center">
      <Button
        size="xs"
        type="link"
        text-color="slate-500"
        @click="handleClickButtonCredits"
      >
        {{ $t('credits') }}
      </Button>
    </div>

    <Modal
      :name="MODALS.LOGIN"
      :heading="$t('loginToYourAccount')"
    >
      <ModalLogin />
    </Modal>

    <Modal
      :name="MODALS.CREATE_ACCOUNT"
      :heading="$t('createAnAccount')"
    >
      <ModalCreateAccount />
    </Modal>

    <Modal
      :name="MODALS.CREDITS"
      :heading="$t('designedAndDevelopedBy')"
    >
      <ModalCredits />
    </Modal>
  </Page>
</template>
