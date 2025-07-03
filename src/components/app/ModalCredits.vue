<script setup lang="ts">
  const repositories = [
    {
      name: 'App Repository',
      url: 'https://github.com/revueltai/smilyformz',
    },
    {
      name: 'Personal Repository',
      url: 'https://github.com/revueltai',
    },
  ]

  function handleOpenRepository(url: string) {
    window.open(url, '_blank')
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex bg-slate-100 rounded-lg p-4 gap-4">
      <Button
        type="link"
        to="https://www.iamnacho.com/?ref=smilyformz"
        class="text-center block mx-auto"
      >
        <img
          src="/images/logoIamNacho.svg"
          alt="iamnacho"
          width="48"
          height="48"
          class="w-16 h-16"
        />
      </Button>

      <div class="flex flex-col gap-3 justify-center">
        <Button
          v-for="repository in repositories"
          :key="repository.name"
          size="xs"
          @click="handleOpenRepository(repository.url)"
        >
          {{ repository.name }}
        </Button>
      </div>
    </div>

    <div class="flex flex-col gap-1 border-t border-slate-300 pt-6 text-slate-500">
      <div class="grid grid-cols-2 gap-3">
        <h4 class="text-xs text-right">
          {{ $t('Framework') }}
        </h4>

        <div class="flex flex-col items-start">
          <Button
            type="link"
            to="https://vuejs.org/"
            size="xs"
          >
            Vuejs
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <h4 class="text-xs text-right">
          {{ $t('icons') }}
        </h4>

        <div class="flex flex-col items-start">
          <Button
            type="link"
            to="https://lucide.dev/"
            size="xs"
          >
            lucide.dev
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <h4 class="text-xs text-right">
          {{ $t('sounds') }}
        </h4>

        <div class="flex flex-col items-start">
          <Button
            type="link"
            to="https://pixabay.com/"
            size="xs"
          >
            pixabay.com
          </Button>

          <Button
            type="link"
            to="https://freesound.org/"
            size="xs"
          >
            freesound.org
          </Button>
        </div>
      </div>
    </div>

    <p class="mt-3 text-[6pt] text-slate-500">
      SmilyFormz is Open Source and built with lots of ❤️.<br />
      Feel free to fork it!
    </p>
  </div>
</template>
