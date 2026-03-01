<!--src\views\beneficiaries\BeneficiariesList.vue-->
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary">إدارة المستفيدين</h1>
    </div>

    <div
      v-if="authStore.can('beneficiary.create')"
      class="mb-8 bg-surface-section p-6 rounded-xl border border-surface-border"
    >
      <h2 class="text-xl font-bold mb-5 text-text-primary">إضافة مستفيد جديد</h2>
      <BeneficiaryForm
        :key="formKey"
        :is-saving="isCreating"
        @submit="handleCreate"
        @cancel="cancelCreate"
      />
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
      @edit-beneficiary="openEditModal"
      @delete-beneficiary="openDeleteDialog"
      @add-financial="openFinancialModal"
      @add-in-kind="openInKindModal"
      @view-assistances="openAssistancesModal"
    />

    <BeneficiaryModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :beneficiary="selectedBeneficiary"
      :is-saving="isEditing"
      @save="handleEdit"
    />

    <BeneficiaryAssistancesModal
      v-if="isAssistancesModalOpen"
      v-model="isAssistancesModalOpen"
      :beneficiary="selectedBeneficiaryForAssistances"
    />

    <AppConfirmDialog
      v-model="isDeleteDialogOpen"
      title="تأكيد حذف المستفيد"
      :message="`هل أنت متأكد من رغبتك في حذف بيانات المستفيد '${beneficiaryToDelete?.name}'؟ سيؤدي هذا إلى حذف جميع المساعدات المرتبطة به.`"
      @confirmed="deleteSelectedBeneficiary"
    />

    <FinancialAssistanceModal
      v-if="isFinancialModalOpen"
      v-model="isFinancialModalOpen"
      :assistance="initialAssistanceData"
      :is-saving="isSavingFinancial"
      @save="handleSaveFinancial"
    />

    <InKindAssistanceModal
      v-if="isInKindModalOpen"
      v-model="isInKindModalOpen"
      :assistance="initialAssistanceData"
      :is-saving="isSavingInKind"
      @save="handleSaveInKind"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

// استيراد الـ Stores
import { useAuthStore } from '@/stores/authStore'
import { useBeneficiaryStore } from '@/stores/beneficiaryStore'
import { useFinancialAssistanceStore } from '@/stores/financialAssistanceStore'
import { useInKindAssistanceStore } from '@/stores/inKindAssistanceStore'
import BeneficiaryAssistancesModal from './BeneficiaryAssistancesModal.vue'
// استيراد المكونات الأساسية
import AppInput from '@/components/ui/AppInput.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'

// استيراد مكونات المستفيدين
import BeneficiariesTable from './BeneficiariesTable.vue'
import BeneficiaryModal from './BeneficiaryModal.vue'
import BeneficiaryForm from './BeneficiaryForm.vue'

// استيراد نوافذ المساعدات
import FinancialAssistanceModal from '@/views/financial-assistances/FinancialAssistanceModal.vue'
import InKindAssistanceModal from '@/views/in-kind-assistances/InKindAssistanceModal.vue'

// تهيئة الـ Stores
const authStore = useAuthStore()
const beneficiaryStore = useBeneficiaryStore()
const financialStore = useFinancialAssistanceStore()
const inKindStore = useInKindAssistanceStore()

const { beneficiaries, loading, pagination } = storeToRefs(beneficiaryStore)
const toast = useToast()

// === إدارة البحث وجلب البيانات ===
const searchQuery = ref('')
let searchTimeout = null

const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handlePageChange(1)
  }, 500)
}

const handlePageChange = async (page = 1) => {
  await beneficiaryStore.fetchBeneficiaries(page, searchQuery.value)
}

onMounted(() => {
  handlePageChange()
})

// === إدارة نموذج الإضافة المدمج (للمستفيدين) ===
const isCreating = ref(false)
const formKey = ref(0)

const handleCreate = async (formData) => {
  isCreating.value = true
  try {
    await beneficiaryStore.createBeneficiary(formData)
    toast.success(`تم إضافة المستفيد '${formData.name}' بنجاح.`)
    formKey.value++
    await handlePageChange(1)
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة المستفيد.'
    toast.error(errorMessage)
  } finally {
    isCreating.value = false
  }
}

const cancelCreate = () => {
  formKey.value++
}

// === إدارة التعديل والحذف (للمستفيدين) ===
const isModalOpen = ref(false)
const selectedBeneficiary = ref(null)
const isEditing = ref(false)

const openEditModal = (beneficiary) => {
  if (!authStore.can('beneficiary.update')) {
    toast.error('ليس لديك الصلاحية لتعديل بيانات المستفيد.')
    return
  }
  selectedBeneficiary.value = { ...beneficiary }
  isModalOpen.value = true
}

const handleEdit = async (formData) => {
  isEditing.value = true
  try {
    await beneficiaryStore.updateBeneficiary(formData.id, formData)
    toast.success(`تم تعديل بيانات المستفيد '${formData.name}' بنجاح.`)
    await handlePageChange(pagination.value.current_page || 1)
    isModalOpen.value = false
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء حفظ التعديلات.'
    toast.error(errorMessage)
  } finally {
    isEditing.value = false
  }
}

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

// === إدارة المساعدات المالية والعينية ===
const isFinancialModalOpen = ref(false)
const isInKindModalOpen = ref(false)
const isSavingFinancial = ref(false)
const isSavingInKind = ref(false)

// كائن مبدئي نمرره لنموذج المساعدة يحتوي على معرف المستفيد المختار
const initialAssistanceData = ref(null)

// 1. المساعدات المالية
const openFinancialModal = (beneficiary) => {
  // تمرير معرف المستفيد واسمه (إذا كان الفورم يحتاجه للعرض)
  initialAssistanceData.value = {
    beneficiary_id: beneficiary.id,
    beneficiary_name: beneficiary.name,
  }
  isFinancialModalOpen.value = true
}

const handleSaveFinancial = async (formData) => {
  isSavingFinancial.value = true
  try {
    await financialStore.createAssistance(formData)
    toast.success('تم تسجيل المساعدة المالية بنجاح.')
    isFinancialModalOpen.value = false
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء حفظ المساعدة المالية.'
    toast.error(errorMessage)
  } finally {
    isSavingFinancial.value = false
  }
}

// 2. المساعدات العينية
const openInKindModal = (beneficiary) => {
  initialAssistanceData.value = {
    beneficiary_id: beneficiary.id,
    beneficiary_name: beneficiary.name,
  }
  isInKindModalOpen.value = true
}

const handleSaveInKind = async (formData) => {
  isSavingInKind.value = true
  try {
    await inKindStore.createAssistance(formData)
    toast.success('تم تسجيل المساعدة العينية بنجاح.')
    isInKindModalOpen.value = false
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء حفظ المساعدة العينية.'
    toast.error(errorMessage)
  } finally {
    isSavingInKind.value = false
  }
}

// === إدارة عرض سجل المساعدات (المالية والعينية) ===
const isAssistancesModalOpen = ref(false)
const selectedBeneficiaryForAssistances = ref(null)

const openAssistancesModal = async (beneficiary) => {
  selectedBeneficiaryForAssistances.value = beneficiary
  isAssistancesModalOpen.value = true
  // جلب البيانات من الباك إند عبر الـ Store بمجرد فتح النافذة
  await beneficiaryStore.fetchBeneficiaryAssistances(beneficiary.id)
}
</script>
