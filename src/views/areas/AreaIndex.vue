<!--src\views\areas\AreaIndex.vue-->
<template>
  <div class="bg-surface-section border border-surface-border rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-text-primary">إدارة المناطق السكنية</h2>
        <p class="text-text-secondary text-sm mt-1">أضف وعدل المحافظات والمدن والأحياء بشكل شجري</p>
      </div>

      <button
        @click="openAddMainModal"
        class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        + إضافة محافظة / منطقة رئيسية
      </button>
    </div>

    <div v-if="areaStore.loading && !isModalOpen" class="text-center py-10">
      <span class="text-text-secondary">جاري تحميل المناطق...</span>
    </div>

    <div v-else class="border border-surface-border rounded-md p-2">
      <div v-if="areaStore.areas.length === 0" class="text-center py-8 text-text-muted">
        لا توجد مناطق مسجلة حالياً. ابدأ بإضافة منطقة رئيسية.
      </div>

      <div v-else class="flex flex-col">
        <AreaTreeItem
          v-for="area in areaStore.areas"
          :key="area.id"
          :area="area"
          @add-child="openAddChildModal"
          @edit="openEditModal"
          @delete="confirmDelete"
        />
      </div>
    </div>

    <AreaModalForm
      :is-open="isModalOpen"
      :is-edit="isEditMode"
      :target-area="selectedArea"
      :parent-area="selectedParentArea"
      @close="closeModal"
      @saved="refreshData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAreaStore } from '@/stores/areaStore'
import AreaTreeItem from './AreaTreeItem.vue'
import AreaModalForm from './AreaModalForm.vue'

const areaStore = useAreaStore()

// متغيرات التحكم في النافذة المنبثقة
const isModalOpen = ref(false)
const isEditMode = ref(false)
const selectedArea = ref(null)
const selectedParentArea = ref(null)

onMounted(async () => {
  await areaStore.fetchAreas()
})

// فتح نافذة: إضافة منطقة رئيسية
const openAddMainModal = () => {
  isEditMode.value = false
  selectedArea.value = null
  selectedParentArea.value = null
  isModalOpen.value = true
}

// فتح نافذة: إضافة منطقة فرعية
const openAddChildModal = (parent) => {
  isEditMode.value = false
  selectedArea.value = null
  selectedParentArea.value = parent
  isModalOpen.value = true
}

// فتح نافذة: التعديل
const openEditModal = (area) => {
  isEditMode.value = true
  selectedArea.value = area
  selectedParentArea.value = null
  isModalOpen.value = true
}

// إغلاق النافذة
const closeModal = () => {
  isModalOpen.value = false
}

// تحديث البيانات (يتم استدعاؤها بعد نجاح الحفظ من النافذة)
const refreshData = async () => {
  await areaStore.fetchAreas()
}

// الحذف
const confirmDelete = async (areaId) => {
  if (confirm('هل أنت متأكد من رغبتك في حذف هذه المنطقة؟')) {
    try {
      await areaStore.deleteArea(areaId)
    } catch (error) {
      alert(areaStore.error)
    }
  }
}
</script>
