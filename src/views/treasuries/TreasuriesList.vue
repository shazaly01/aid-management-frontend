<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary">إدارة الخزائن</h1>
      <AppButton v-if="authStore.can('treasury.create')" @click="openModal()">
        إضافة خزينة جديدة
      </AppButton>
    </div>

    <div
      class="mb-6 bg-surface-section p-4 rounded-xl border border-surface-border flex items-center gap-4"
    >
      <div class="w-full md:w-1/3">
        <AppInput
          id="search-treasuries"
          v-model="searchQuery"
          placeholder="ابحث باسم الخزينة..."
          @input="onSearch"
        />
      </div>
    </div>

    <TreasuriesTable
      :treasuries="treasuries"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @edit-treasury="openModal"
      @delete-treasury="openDeleteDialog"
    />

    <TreasuryModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :treasury="selectedTreasury"
      :is-saving="isSaving"
      @save="handleSave"
    />

    <AppConfirmDialog
      v-model="isDeleteDialogOpen"
      title="تأكيد حذف الخزينة"
      :message="`هل أنت متأكد من رغبتك في حذف '${treasuryToDelete?.name}'؟ لا يمكن التراجع عن هذه الخطوة وسيتم حذف الحركات المرتبطة بها.`"
      @confirmed="deleteSelectedTreasury"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useTreasuryStore } from '@/stores/treasuryStore' // المتجر الذي أنشأناه سابقاً

// المكونات
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'
import TreasuriesTable from './TreasuriesTable.vue'
import TreasuryModal from './TreasuryModal.vue'

const authStore = useAuthStore()
const treasuryStore = useTreasuryStore()
const { treasuries, loading, pagination } = storeToRefs(treasuryStore)
const toast = useToast()

// حالة البحث
const searchQuery = ref('')
let searchTimeout = null

const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handlePageChange(1)
  }, 500)
}

// جلب البيانات
const handlePageChange = async (page = 1) => {
  await treasuryStore.fetchTreasuries(page, searchQuery.value)
}

onMounted(() => {
  handlePageChange()
})

// === إدارة مودال الإضافة/التعديل ===
const isModalOpen = ref(false)
const selectedTreasury = ref(null)
const isSaving = ref(false)

const openModal = (treasury = null) => {
  if (treasury && !authStore.can('treasury.update')) {
    toast.error('ليس لديك الصلاحية لتعديل بيانات الخزينة.')
    return
  }
  selectedTreasury.value = treasury ? { ...treasury } : null
  isModalOpen.value = true
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (formData.id) {
      await treasuryStore.updateTreasury(formData.id, formData)
      toast.success(`تم تعديل الخزينة '${formData.name}' بنجاح.`)
    } else {
      await treasuryStore.createTreasury(formData)
      toast.success(`تم إضافة الخزينة '${formData.name}' بنجاح.`)
    }
    await handlePageChange(pagination.value.current_page || 1)
    isModalOpen.value = false
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات.'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// === إدارة مودال الحذف ===
const isDeleteDialogOpen = ref(false)
const treasuryToDelete = ref(null)

const openDeleteDialog = (treasury) => {
  treasuryToDelete.value = treasury
  isDeleteDialogOpen.value = true
}

const deleteSelectedTreasury = async () => {
  if (treasuryToDelete.value) {
    try {
      await treasuryStore.deleteTreasury(treasuryToDelete.value.id)
      toast.success(`تم حذف الخزينة '${treasuryToDelete.value.name}' بنجاح.`)

      if (treasuries.value.length === 1 && pagination.value.current_page > 1) {
        await handlePageChange(pagination.value.current_page - 1)
      } else {
        await handlePageChange(pagination.value.current_page)
      }
    } catch (error) {
      const errorMessage =
        treasuryStore.error ||
        error.response?.data?.message ||
        'فشل حذف الخزينة لارتباطها بحركات مالية.'
      toast.error(errorMessage)
    } finally {
      isDeleteDialogOpen.value = false
      treasuryToDelete.value = null
    }
  }
}
</script>
