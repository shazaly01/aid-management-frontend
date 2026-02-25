<template>
  <div class="space-y-4">
    <AppTable
      :headers="tableHeaders"
      :items="treasuries"
      :is-loading="loading"
      :row-clickable="false"
    >
      <template #cell-name="{ item }">
        <span class="font-bold text-text-primary">{{ item.name }}</span>
      </template>

      <template #cell-balance="{ item }">
        <span
          class="font-mono font-semibold"
          :class="item.balance < 0 ? 'text-danger' : 'text-emerald-600 dark:text-emerald-400'"
        >
          {{
            Number(item.balance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
          د.ل
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center justify-end gap-2">
          <button
            v-if="authStore.can('treasury.update')"
            @click.stop="$emit('edit-treasury', item)"
            class="text-primary hover:text-primary-dark p-1 rounded transition-colors"
            title="تعديل بيانات الخزينة"
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
            v-if="authStore.can('treasury.delete')"
            @click.stop="$emit('delete-treasury', item)"
            class="text-danger hover:text-red-700 p-1 rounded transition-colors"
            title="حذف الخزينة"
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
      :per-page="pagination.per_page"
      @page-change="(page) => $emit('page-change', page)"
    />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import AppTable from '@/components/ui/AppTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

const props = defineProps({
  treasuries: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['edit-treasury', 'delete-treasury', 'page-change'])

const authStore = useAuthStore()

// أعمدة الجدول بسيطة جداً للخزائن
const tableHeaders = [
  { key: 'name', label: 'اسم الخزينة' },
  { key: 'balance', label: 'الرصيد' },
  { key: 'actions', label: '', cellClass: 'w-24' },
]
</script>
