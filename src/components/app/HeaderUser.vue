<script setup lang="ts">
  import { ref } from 'vue'
  import { useModalStore } from '@/stores/modal.store'

  const props = withDefaults(
    defineProps<{
      hasEditOptions?: boolean
    }>(),
    {
      hasEditOptions: false,
    },
  )

  const username = ref('Groarnacho1234')

  const modalStore = useModalStore()

  function handleClickEditUsername() {
    modalStore.openModal('username')
  }

  function handleClickEditAvatar() {
    modalStore.openModal('avatar')
  }
</script>

<template>
  <header class="flex flex-col items-center justify-end gap-3 text-center h-48 mt-8">
    <div class="relative">
      <div
        class="flex gap-3 items-center justify-center w-28 h-28 rounded-full overflow-hidden bg-slate-200"
      >
        <Icon
          name="circle-user-round"
          size="2xl"
          color="slate-400"
        />
      </div>

      <Button
        v-if="hasEditOptions"
        size="sm"
        class="absolute bottom-0 right-0"
        @click="handleClickEditAvatar"
      >
        <Icon
          name="pencil"
          color="slate-700"
        />
      </Button>
    </div>

    <div class="flex flex-col gap-1">
      <p
        v-if="!hasEditOptions"
        class="text-sm text-slate-400"
      >
        {{ $t('welcomeBack') }}
      </p>

      <Input
        v-model="username"
        :is-editable="hasEditOptions"
        css-classes-field="text-2xl text-slate-600"
        show-static-field
      />
    </div>
  </header>
</template>
