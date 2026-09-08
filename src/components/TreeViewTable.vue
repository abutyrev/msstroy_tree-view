<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { AgGridVue } from "ag-grid-vue3";
import { ColumnApiModule, ClientSideRowModelModule, ModuleRegistry, enableDevValidations, LocaleModule, CellStyleModule } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'

import type { TreeViewItem } from "@/types";
import TreeStore from "@/TreeStore";

ModuleRegistry.registerModules([ColumnApiModule, ClientSideRowModelModule, TreeDataModule, LocaleModule, CellStyleModule ])
enableDevValidations()

type Props = {
  items: TreeViewItem[]
  loading: boolean
}

const props = defineProps<Props>()

const treeVeiw = new TreeStore(props.items)

const gridItems = computed(() => treeVeiw.items)

watch(() => props.items, (items) => {
  treeVeiw.setItems(items)
})

const colDefs = ref<ColDef[]>([
  {
    headerName: '№ п\\п',
    maxWidth: 50,
    valueGetter: "node.rowIndex + 1",
    sortable: false,
    cellClass: ['bold']
  },
  {
    headerName: 'Категория',
    showRowGroup: true,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true
    },
    cellClassRules: {
      bold: params => treeVeiw.getChildren(params.data.id).length > 0
    },
    valueFormatter: (params) => treeVeiw.getChildren(params.data.id).length > 0 ? 'Группа' : 'Элемент',
    sortable: false
  },
  {
    field: 'label',
    headerName: 'Наименование',
    sortable: false,
    cellClassRules: {
      bold: params => treeVeiw.getChildren(params.data.id).length > 0
    },
  }
])

const defaultColDef = {
  flex: 1
}

</script>

<template>
  <ag-grid-vue
    style="width: 100%; height: 100%"
    :loading="loading"
    :column-defs="colDefs"
    :default-col-def="defaultColDef"
    :row-data="gridItems"
    :get-row-id="params => String(params.data.id)"
    :group-default-expanded="-1"
    :locale-text="{
      noRowsToShow: 'Нет данных'
    }"
    tree-data
    tree-data-parent-id-field="parent"
    group-display-type="custom"
  />
</template>

<style>
.ag-cell.bold,
.ag-cell.bold .ag-group-value {
  font-weight: var(--ag-header-font-weight);
}
</style>
