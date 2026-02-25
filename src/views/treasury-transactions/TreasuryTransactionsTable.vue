<template>
  <div class="space-y-4">
    <AppTable
      :headers="tableHeaders"
      :items="transactions"
      :is-loading="loading"
      :row-clickable="false"
    >
      <template #cell-TransactionNo="{ item }">
        <span class="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">
          {{ item.TransactionNo }}
        </span>
      </template>

      <template #cell-transaction_type="{ item }">
        <div class="flex items-center gap-2">
          <span
            class="flex items-center justify-center w-6 h-6 rounded-full"
            :class="
              item.transaction_type === 'deposit'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-rose-100 text-rose-600'
            "
          >
            <svg
              v-if="item.transaction_type === 'deposit'"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              ></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              ></path>
            </svg>
          </span>
          <span class="text-sm font-medium">
            {{ item.transaction_type === 'deposit' ? 'إيداع' : 'سحب' }}
          </span>
        </div>
      </template>

      <template #cell-amount="{ item }">
        <span
          class="font-mono font-bold"
          :class="item.transaction_type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'"
        >
          {{ item.transaction_type === 'withdrawal' ? '-' : '+' }}
          {{ Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </span>
      </template>

      <template #cell-treasury="{ item }">
        <span class="text-text-secondary">{{ item.treasury?.name || '---' }}</span>
      </template>

      <template #cell-notes="{ item }">
        <span class="text-xs text-text-muted truncate max-w-[150px] block" :title="item.notes">
          {{ item.notes || 'لا يوجد' }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex justify-end">
          <button
            @click.stop="$emit('view-details', item)"
            class="text-text-muted hover:text-primary p-1 rounded transition-colors"
            title="عرض التفاصيل"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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
import AppTable from '@/components/ui/AppTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

const props = defineProps({
  transactions: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  pagination: { type: Object, default: () => ({}) },
})

defineEmits(['page-change', 'view-details'])

const tableHeaders = [
  { key: 'TransactionNo', label: 'رقم الحركة' },
  { key: 'transaction_date', label: 'التاريخ' },
  { key: 'treasury', label: 'الخزينة' },
  { key: 'transaction_type', label: 'النوع' },
  { key: 'amount', label: 'المبلغ' },
  { key: 'notes', label: 'ملاحظات' },
  { key: 'actions', label: '', cellClass: 'w-16' },
]
</script>
