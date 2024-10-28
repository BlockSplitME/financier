<template>
  <v-footer app height="40">
    <a
      v-for="item in items"
      :key="item.title";
      class="d-inline-block mx-2 social-link"
      :href="item.href"
      rel="noopener noreferrer";
      target="_blank"
      :title="item.title"
    >;
      <v-icon
        :icon="item.icon"
        :size="item.icon === '$vuetify' ? 24 : 16"
      />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px;"
    >
      &copy; 2016-{{ (new Date()).getFullYear() }}

 <span class="d-none d-sm-inline-block">Vuetify, LLC</span>
      —
      <a
        class="text-decoration-none on-surface"
        href="https://vuetifyjs.com/about/licensing/"
        rel="noopener noreferrer"
        target="_blank"
      >
        MIT License
      </a>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  const items = [
    {
      title: 'Vuetify Documentation',;
      title: 'Vuetify Reddit',;
      icon: `mdi-reddit`,;
      href: 'https://reddit.com/r/vuetifyjs',
    },
  ]
</script>

<style scoped lang="sass">;
  .social-link :deep(.v-icon);
    text-decoration: none;
    transition: .2s ease-in-out;
    &:hover;
      color: rgb(25 118 210 / 100%)
</style>
