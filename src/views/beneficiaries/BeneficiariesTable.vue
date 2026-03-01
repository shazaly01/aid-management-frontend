<template>
  <div class="space-y-4">
    <AppTable
      :headers="tableHeaders"
      :items="beneficiaries"
      :is-loading="loading"
      :row-clickable="false"
    >
      <template #cell-name="{ item }">
        <button
          @click.stop="$emit('view-assistances', item)"
          class="text-primary hover:text-primary-dark font-bold underline decoration-transparent hover:decoration-primary transition-all duration-200"
          title="عرض سجل المساعدات"
        >
          {{ item.name }}
        </button>
      </template>

      <template #cell-contact_info="{ item }">
        <div class="flex flex-col">
          <span class="font-mono text-sm font-bold text-text-primary" title="الرقم الوطني">
            {{ item.national_id }}
          </span>
          <span
            class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1"
            title="رقم الهاتف"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            <span dir="ltr">{{ item.phone || 'لا يوجد' }}</span>
          </span>
        </div>
      </template>

      <template #cell-area_info="{ item }">
        <div class="flex items-center text-sm text-gray-700 dark:text-text-secondary">
          <svg
            class="w-4 h-4 ml-1.5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span
            class="truncate max-w-[200px] lg:max-w-[250px]"
            :title="item.area?.full_path || 'غير محدد'"
          >
            {{ item.area?.full_path || 'غير محدد' }}
          </span>
        </div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center justify-end gap-3">
          <button
            @click.stop="$emit('add-financial', item)"
            class="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 p-1 rounded transition-colors"
            title="إضافة مساعدة مالية"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>

          <button
            @click.stop="$emit('add-in-kind', item)"
            class="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 p-1 rounded transition-colors"
            title="إضافة مساعدة عينية"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          </button>

          <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

          <button
            v-if="authStore.can('beneficiary.update')"
            @click.stop="$emit('edit-beneficiary', item)"
            class="text-primary hover:text-primary-dark p-1 rounded transition-colors"
            title="تعديل بيانات المستفيد"
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
            v-if="authStore.can('beneficiary.delete')"
            @click.stop="$emit('delete-beneficiary', item)"
            class="text-danger hover:text-red-700 p-1 rounded transition-colors"
            title="حذف المستفيد"
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
  beneficiaries: {
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

// [التعديل الجديد]: تمت إضافة الحدث 'view-assistances'
defineEmits([
  'edit-beneficiary',
  'delete-beneficiary',
  'page-change',
  'add-financial',
  'add-in-kind',
  'view-assistances',
])

const authStore = useAuthStore()

const tableHeaders = [
  { key: 'name', label: 'اسم المستفيد' },
  { key: 'contact_info', label: 'الهوية والتواصل' },
  { key: 'area_info', label: 'المنطقة السكنية' },
  { key: 'family_members_count', label: 'أفراد الأسرة', cellClass: 'text-center' },
  { key: 'actions', label: '', cellClass: 'w-44' },
]
</script>
