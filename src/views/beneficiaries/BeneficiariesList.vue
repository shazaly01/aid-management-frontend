<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary">إدارة المستفيدين</h1>
      <AppButton v-if="authStore.can('beneficiary.create')" @click="openModal()">
        إضافة مستفيد
      </AppButton>
    </div>

    <div
      class="mb-6 bg-surface-section p-4 rounded-xl border border-surface-border flex items-center gap-4"
    >
      <div class="w-full md:w-1/3">
        <AppInput
          id="search-beneficiaries"
          v-model="searchQuery"
          placeholder="ابحث بالاسم أو الرقم الوطني..."
          @input="onSearch"
        />
      </div>
    </div>

    <BeneficiariesTable
      :beneficiaries="beneficiaries"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @edit-beneficiary="openModal"
      @delete-beneficiary="openDeleteDialog"
    />

    <BeneficiaryModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :beneficiary="selectedBeneficiary"
      :is-saving="isSaving"
      @save="handleSave"
    />

    <AppConfirmDialog
      v-model="isDeleteDialogOpen"
      title="تأكيد حذف المستفيد"
      :message="`هل أنت متأكد من رغبتك في حذف بيانات المستفيد '${beneficiaryToDelete?.name}'؟ سيؤدي هذا إلى حذف جميع المساعدات المرتبطة به.`"
      @confirmed="deleteSelectedBeneficiary"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useBeneficiaryStore } from '@/stores/beneficiaryStore'

// استيراد المكونات
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'
import BeneficiariesTable from './BeneficiariesTable.vue'
import BeneficiaryModal from './BeneficiaryModal.vue'

const authStore = useAuthStore()
const beneficiaryStore = useBeneficiaryStore()
const { beneficiaries, loading, pagination } = storeToRefs(beneficiaryStore)
const toast = useToast()

// حالة البحث
const searchQuery = ref('')
let searchTimeout = null

const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handlePageChange(1)
  }, 500) // Debounce 500ms
}

// جلب البيانات
const handlePageChange = async (page = 1) => {
  await beneficiaryStore.fetchBeneficiaries(page, searchQuery.value)
}

onMounted(() => {
  handlePageChange()
})

// === إدارة مودال الإضافة/التعديل ===
const isModalOpen = ref(false)
const selectedBeneficiary = ref(null)
const isSaving = ref(false) // حالة زر الحفظ في المودال

const openModal = (beneficiary = null) => {
  if (beneficiary && !authStore.can('beneficiary.update')) {
    toast.error('ليس لديك الصلاحية لتعديل بيانات المستفيد.')
    return
  }
  selectedBeneficiary.value = beneficiary ? { ...beneficiary } : null
  isModalOpen.value = true
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (formData.id) {
      await beneficiaryStore.updateBeneficiary(formData.id, formData)
      toast.success(`تم تعديل بيانات المستفيد '${formData.name}' بنجاح.`)
    } else {
      await beneficiaryStore.createBeneficiary(formData)
      toast.success(`تم إضافة المستفيد '${formData.name}' بنجاح.`)
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
const beneficiaryToDelete = ref(null)

const openDeleteDialog = (beneficiary) => {
  beneficiaryToDelete.value = beneficiary
  isDeleteDialogOpen.value = true
}

const deleteSelectedBeneficiary = async () => {
  if (beneficiaryToDelete.value) {
    try {
      await beneficiaryStore.deleteBeneficiary(beneficiaryToDelete.value.id)
      toast.success(`تم حذف المستفيد '${beneficiaryToDelete.value.name}' بنجاح.`)

      // التعامل الذكي مع الترقيم عند حذف آخر عنصر في الصفحة
      if (beneficiaries.value.length === 1 && pagination.value.current_page > 1) {
        await handlePageChange(pagination.value.current_page - 1)
      } else {
        await handlePageChange(pagination.value.current_page)
      }
    } catch (error) {
      const errorMessage =
        beneficiaryStore.error || error.response?.data?.message || 'فشل حذف بيانات المستفيد.'
      toast.error(errorMessage)
    } finally {
      isDeleteDialogOpen.value = false
      beneficiaryToDelete.value = null
    }
  }
}
</script>
