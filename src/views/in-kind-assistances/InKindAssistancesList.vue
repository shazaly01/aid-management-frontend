<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary">سجل المساعدات العينية</h1>
      <AppButton v-if="authStore.can('in_kind_assistance.create')" @click="openModal()">
        تسجيل صرف جديد
      </AppButton>
    </div>

    <div class="mb-6 bg-surface-section p-4 rounded-xl border border-surface-border">
      <div class="w-full md:w-1/3">
        <AppInput
          id="search-in-kind"
          v-model="searchQuery"
          placeholder="ابحث باسم المستفيد أو الصنف..."
          @input="onSearch"
        />
      </div>
    </div>

    <InKindAssistancesTable
      :assistances="assistances"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @edit-assistance="openModal"
      @delete-assistance="openDeleteDialog"
    />

    <InKindAssistanceModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :assistance="selectedAssistance"
      :is-saving="isSaving"
      @save="handleSave"
    />

    <AppConfirmDialog
      v-model="isDeleteDialogOpen"
      title="حذف سجل الصرف"
      :message="`هل أنت متأكد من رغبتك في حذف هذا السجل؟ لن يتم استرجاع البيانات.`"
      @confirmed="deleteSelectedAssistance"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useInKindAssistanceStore } from '@/stores/inKindAssistanceStore'

import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'
import InKindAssistancesTable from './InKindAssistancesTable.vue'
import InKindAssistanceModal from './InKindAssistanceModal.vue'

const authStore = useAuthStore()
const inKindStore = useInKindAssistanceStore()
const { assistances, loading, pagination } = storeToRefs(inKindStore)
const toast = useToast()

const searchQuery = ref('')
const isModalOpen = ref(false)
const isSaving = ref(false)
const selectedAssistance = ref(null)
const isDeleteDialogOpen = ref(false)
const assistanceToDelete = ref(null)

const onSearch = () => {
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => handlePageChange(1), 500)
}

const handlePageChange = async (page = 1) => {
  await inKindStore.fetchAssistances(page, searchQuery.value)
}

const openModal = (item = null) => {
  selectedAssistance.value = item
  isModalOpen.value = true
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (formData.id) {
      // بناءً على api.php، قد لا يكون هناك Update حالياً، لكن جهزناها
      toast.info('هذا الإجراء غير مدعوم حالياً في الـ API')
    } else {
      await inKindStore.createAssistance(formData)
      toast.success('تم تسجيل عملية الصرف بنجاح.')
    }
    handlePageChange(1)
    isModalOpen.value = false
  } catch (err) {
    toast.error(err.response?.data?.message || 'فشل الحفظ.')
  } finally {
    isSaving.value = false
  }
}

const openDeleteDialog = (item) => {
  assistanceToDelete.value = item
  isDeleteDialogOpen.value = true
}

const deleteSelectedAssistance = async () => {
  if (assistanceToDelete.value) {
    try {
      await inKindStore.deleteAssistance(assistanceToDelete.value.id)
      toast.success('تم حذف السجل بنجاح.')
      handlePageChange(pagination.value.current_page)
    } catch (err) {
      toast.error('فشل عملية الحذف.')
    } finally {
      isDeleteDialogOpen.value = false
      assistanceToDelete.value = null
    }
  }
}

onMounted(() => handlePageChange())
</script>
