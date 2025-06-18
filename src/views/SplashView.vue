<script setup lang="ts">
  import { ref } from 'vue'
  import Page from '@/components/app/Page.vue'
  import { useModalStore } from '@/stores/modal.store'
  import ModalLogin from '@/components/app/ModalLogin.vue'
  import ModalCreateAccount from '@/components/app/ModalCreateAccount.vue'
  import { MODALS } from '@/configs/constants'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const activeModal = ref('')
  const modalStore = useModalStore()

  function handleClickButtonPlay() {
    router.push('/game')
  }

  function handleClickButtonCreateAccount() {
    activeModal.value = MODALS.CREATE_ACCOUNT
    modalStore.openModal(activeModal.value)
  }

  function handleClickButtonLogin() {
    activeModal.value = MODALS.LOGIN
    modalStore.openModal(activeModal.value)
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
      />

      <div class="flex flex-col gap-4 items-center">
        <div class="mb-10">
          <Button
            size="2xl"
            background-color="lime-50"
            border-color="lime-600"
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

    <Modal
      v-if="activeModal === MODALS.LOGIN"
      :name="MODALS.LOGIN"
      :heading="$t('loginToYourAccount')"
    >
      <ModalLogin />
    </Modal>

    <Modal
      v-if="activeModal === MODALS.CREATE_ACCOUNT"
      :name="MODALS.CREATE_ACCOUNT"
      :heading="$t('createAnAccount')"
    >
      <ModalCreateAccount />
    </Modal>
  </Page>
</template>
