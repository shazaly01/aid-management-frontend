<!-- src\views\financial-assistances\FinancialAssistancesList.vue-->
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary">سجل المساعدات المالية</h1>
      <AppButton v-if="authStore.can('financial_assistance.create')" @click="openModal()">
        تسجيل مساعدة جديدة
      </AppButton>
    </div>

    <div class="mb-6 bg-surface-section p-4 rounded-xl border border-surface-border">
      <div class="w-full md:w-1/3">
        <AppInput
          id="search-financial"
          v-model="searchQuery"
          placeholder="ابحث باسم المستفيد..."
          @input="onSearch"
        />
      </div>
    </div>

    <FinancialAssistancesTable
      :assistances="assistances"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @view-details="openViewModal"
    />

    <FinancialAssistanceModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :assistance="selectedAssistance"
      :is-saving="isSaving"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useFinancialAssistanceStore } from '@/stores/financialAssistanceStore'

import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import FinancialAssistancesTable from './FinancialAssistancesTable.vue'
import FinancialAssistanceModal from './FinancialAssistanceModal.vue'

const authStore = useAuthStore()
const financialStore = useFinancialAssistanceStore()
const { assistances, loading, pagination } = storeToRefs(financialStore)
const toast = useToast()

const searchQuery = ref('')
const isModalOpen = ref(false)
const isSaving = ref(false)
const selectedAssistance = ref(null)

const onSearch = () => {
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => handlePageChange(1), 500)
}

const handlePageChange = async (page = 1) => {
  await financialStore.fetchAssistances(page, searchQuery.value)
}

const openModal = (item = null) => {
  selectedAssistance.value = item
  isModalOpen.value = true
}

const openViewModal = (item) => {
  // يمكن هنا فتح مودال عرض تفاصيل المساعدة المالية وحركات الخزينة المرتبطة بها
  console.log('Viewing financial aid details:', item)
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    // بناءً على api.php، ندعم الـ store فقط حالياً
    await financialStore.createAssistance(formData)
    toast.success('تم تسجيل المساعدة المالية بنجاح.')
    handlePageChange(1)
    isModalOpen.value = false
  } catch (err) {
    toast.error(err.response?.data?.message || 'فشل عملية الحفظ.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => handlePageChange())
</script>
