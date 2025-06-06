<script setup lang="ts">
  import Page from '@/components/app/Page.vue'

  function handleClickButtonPlay() {}

  function handleClickButtonCreateAccount() {}

  function handleClickButtonLogin() {}
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
  </Page>
</template>
