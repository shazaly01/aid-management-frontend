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

      <template #cell-type="{ item }">
        <span
          class="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
          :class="
            item.type === 'social' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          "
        >
          {{ item.type === 'social' ? 'اجتماعية' : 'علاجية' }}
        </span>
      </template>

      <template #cell-approved_amount="{ item }">
        <span class="font-mono font-bold text-emerald-600">
          {{ Number(item.approved_amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          د.ل
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex justify-end">
          <button
            v-if="authStore.can('financial_assistance.view')"
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
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
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

defineEmits(['page-change', 'view-details'])

const authStore = useAuthStore()

const tableHeaders = [
  { key: 'beneficiary', label: 'المستفيد' },
  { key: 'type', label: 'النوع' },
  { key: 'request_date', label: 'تاريخ الطلب' },
  { key: 'approved_amount', label: 'المبلغ المعتمد' },
  { key: 'actions', label: '', cellClass: 'w-16' },
]
</script>
