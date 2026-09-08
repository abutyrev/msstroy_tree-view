<script setup lang="ts">
import { ref } from 'vue';
import { getItems } from './api.ts';
import TreeViewTable from './components/TreeViewTable.vue';
import type { TreeViewItem } from './types.ts';

const items = ref<TreeViewItem[]>([])
const loading = ref(false)

const onLoad = async () => {
  loading.value = true
  try {
    const data = await getItems()
    items.value = data
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <header>
    <button :disabled="loading" @click="onLoad">Загрузить</button>
  </header>
  <main style="flex: 1; margin-top: 10px;">
    <tree-view-table :items="items" :loading="loading" />
  </main>
</template>
