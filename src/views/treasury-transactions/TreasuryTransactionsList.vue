<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary">سجل حركات الخزينة</h1>
      <div class="flex gap-2">
        <AppButton variant="secondary" @click="goToReports"> تقارير الخزينة </AppButton>
        <AppButton v-if="authStore.can('treasury.view')" @click="openModal()">
          إضافة حركة يدوية
        </AppButton>
      </div>
    </div>

    <div class="mb-6 bg-surface-section p-4 rounded-xl border border-surface-border">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <AppInput
            id="search-tx"
            v-model="searchQuery"
            placeholder="البحث برقم الحركة أو الملاحظات..."
            @input="onSearch"
          />
        </div>
      </div>
    </div>

    <TreasuryTransactionsTable
      :transactions="transactions"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @view-details="openViewModal"
    />

    <TreasuryTransactionModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :transaction="selectedTransaction"
      :is-saving="isSaving"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useTreasuryTransactionStore } from '@/stores/treasuryTransactionStore'

import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import TreasuryTransactionsTable from './TreasuryTransactionsTable.vue'
import TreasuryTransactionModal from './TreasuryTransactionModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const transactionStore = useTreasuryTransactionStore()
const { transactions, loading, pagination } = storeToRefs(transactionStore)
const toast = useToast()

const searchQuery = ref('')
const isModalOpen = ref(false)
const isSaving = ref(false)
const selectedTransaction = ref(null)

const onSearch = () => {
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => handlePageChange(1), 500)
}

const handlePageChange = async (page = 1) => {
  await transactionStore.fetchTransactions(page, searchQuery.value)
}

const openModal = (tx = null) => {
  selectedTransaction.value = tx
  isModalOpen.value = true
}

const openViewModal = (tx) => {
  // يمكن هنا فتح مودال عرض فقط لعرض كامل تفاصيل الحركة
  console.log('Viewing details for:', tx)
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    await transactionStore.createTransaction(formData)
    toast.success('تم تسجيل الحركة المالية وتحديث رصيد الخزينة بنجاح.')
    handlePageChange(1)
    isModalOpen.value = false
  } catch (err) {
    toast.error(err.response?.data?.message || 'فشل تسجيل الحركة.')
  } finally {
    isSaving.value = false
  }
}

const goToReports = () => router.push({ name: 'TreasuryStatementReport' })

onMounted(() => handlePageChange())
</script>
