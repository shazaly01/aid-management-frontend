<!--src\views\areas\AreaModalForm.vue-->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h3 class="text-xl font-bold mb-4">
        {{ isEdit ? 'تعديل المنطقة' : parentArea ? 'إضافة منطقة فرعية' : 'إضافة منطقة رئيسية' }}
      </h3>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div v-if="parentArea && !isEdit" class="bg-gray-50 p-3 rounded text-sm text-gray-600">
            تتبع لمنطقة: <strong>{{ parentArea.name }}</strong>
          </div>

          <AppInput
            id="area-name"
            label="اسم المنطقة"
            v-model="form.name"
            placeholder="مثال: الرياض، حي الورود..."
            required
          />
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <AppButton type="button" variant="secondary" @click="closeModal">إلغاء</AppButton>
          <AppButton type="submit" :disabled="areaStore.loading">
            {{ areaStore.loading ? 'جاري الحفظ...' : 'حفظ' }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAreaStore } from '@/stores/areaStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  targetArea: { type: Object, default: null }, // المنطقة المراد تعديلها
  parentArea: { type: Object, default: null }, // الأب في حالة إضافة فرع
})

const emit = defineEmits(['close', 'saved'])
const areaStore = useAreaStore()

const form = ref({
  name: '',
  parent_id: null,
})

// مراقبة التغيرات لتعبئة النموذج عند الفتح
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.targetArea) {
        form.value.name = props.targetArea.name
        form.value.parent_id = props.targetArea.parent_id
      } else {
        form.value.name = ''
        form.value.parent_id = props.parentArea ? props.parentArea.id : null
      }
    }
  },
)

const handleSubmit = async () => {
  try {
    if (props.isEdit) {
      await areaStore.updateArea(props.targetArea.id, form.value)
    } else {
      await areaStore.createArea(form.value)
    }
    emit('saved') // إخبار الشاشة الرئيسية بنجاح العملية
    closeModal()
  } catch (error) {
    alert(areaStore.error)
  }
}

const closeModal = () => {
  emit('close')
}
</script>
