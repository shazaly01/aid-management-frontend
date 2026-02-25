<template>
  <div class="space-y-4">
    <AppTable
      :headers="tableHeaders"
      :items="assistances"
      :is-loading="loading"
      :row-clickable="false"
    >
      <template #cell-beneficiary="{ item }">
        <div class="flex flex-col">
          <span class="font-bold text-text-primary">{{ item.beneficiary?.name || '---' }}</span>
          <span class="text-xs text-text-muted">{{ item.beneficiary?.national_id }}</span>
        </div>
      </template>

      <template #cell-request_date="{ item }">
        <span class="text-sm">{{ item.request_date }}</span>
      </template>

      <template #cell-items="{ item }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(subItem, index) in item.items?.slice(0, 2)"
            :key="index"
            class="bg-surface-border text-text-secondary text-[10px] px-2 py-0.5 rounded-full"
          >
            {{ subItem.description }}
          </span>
          <span v-if="item.items?.length > 2" class="text-[10px] text-primary font-bold">
            +{{ item.items.length - 2 }} أخرى
          </span>
        </div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex justify-end gap-2">
          <button
            v-if="authStore.can('in_kind_assistance.view')"
            @click.stop="$emit('edit-assistance', item)"
            class="text-primary hover:text-primary-dark p-1 rounded transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </button>

          <button
            v-if="authStore.can('in_kind_assistance.delete')"
            @click.stop="$emit('delete-assistance', item)"
            class="text-danger hover:text-red-700 p-1 rounded transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </template>
    </AppTable>

    <AppPagination
      v-if="pagination && pagination.total > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      @page-change="(page) => $emit('page-change', page)"
    />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import AppTable from '@/components/ui/AppTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

const props = defineProps({
  assistances: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  pagination: { type: Object, default: () => ({}) },
})

defineEmits(['edit-assistance', 'delete-assistance', 'page-change'])

const authStore = useAuthStore()

const tableHeaders = [
  { key: 'beneficiary', label: 'المستفيد' },
  { key: 'request_date', label: 'تاريخ الصرف' },
  { key: 'reasons', label: 'السبب' },
  { key: 'items', label: 'الأصناف المصروفة' },
  { key: 'actions', label: '', cellClass: 'w-20' },
]
</script>
