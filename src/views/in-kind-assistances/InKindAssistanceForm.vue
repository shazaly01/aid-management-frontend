<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-6">
      <div class="bg-surface-section border border-surface-border rounded-lg p-4 space-y-5">
        <h4 class="text-sm font-semibold text-primary mb-3">البيانات الأساسية</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <BeneficiariesDropdown
              id="beneficiary-id"
              label="المستفيد"
              v-model="form.beneficiary_id"
              required
            />
            <p v-if="errors.beneficiary_id" class="text-rose-500 text-xs mt-1 font-bold">
              يجب اختيار المستفيد
            </p>
          </div>

          <div>
            <AppInput
              id="request-date"
              label="تاريخ الطلب / الصرف"
              v-model="form.request_date"
              type="date"
              required
            />
            <p v-if="errors.request_date" class="text-rose-500 text-xs mt-1 font-bold">
              تاريخ الطلب مطلوب
            </p>
          </div>
        </div>

        <AppInput
          id="reasons"
          label="مسببات الصرف"
          v-model="form.reasons"
          placeholder="مثال: دخل محدود، كارثة طبيعية، تضرر مسكن..."
        />
      </div>

      <div class="bg-surface-section border border-surface-border rounded-lg p-4 space-y-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-semibold text-primary">الأصناف المصروفة</h4>
          <button
            type="button"
            @click="addItem"
            class="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            إضافة صنف
          </button>
        </div>

        <div v-for="(item, index) in form.items" :key="index" class="flex items-start gap-3">
          <div class="flex-1">
            <AppInput
              :id="'item-desc-' + index"
              v-model="item.description"
              placeholder="وصف الصنف (مثال: سلة غذائية، بطانية...)"
              required
            />
          </div>
          <button
            v-if="form.items.length > 1"
            type="button"
            @click="removeItem(index)"
            class="mt-1 p-2 text-danger hover:bg-danger/10 rounded-md transition-colors"
            title="حذف الصنف"
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

        <p v-if="errors.items" class="text-rose-500 text-xs mt-1 font-bold">
          يجب إضافة صنف واحد على الأقل بوصف صحيح.
        </p>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ المساعدة العينية</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
// نفترض أنك ستنشئ هذا المكون بنفس طريقة CompaniesDropdown
import BeneficiariesDropdown from '@/components/forms/BeneficiariesDropdown.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const errors = reactive({
  beneficiary_id: false,
  request_date: false,
  items: false,
})

const createFreshForm = () => ({
  id: null,
  beneficiary_id: '',
  // تعيين تاريخ اليوم كقيمة افتراضية
  request_date: new Date().toISOString().split('T')[0],
  reasons: '',
  items: [{ description: '' }], // نبدأ بصنف واحد فارغ كحد أدنى
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      const formattedDate = newData.request_date
        ? new Date(newData.request_date).toISOString().split('T')[0]
        : ''

      form.value = {
        id: newData.id,
        beneficiary_id: newData.beneficiary_id || '',
        request_date: formattedDate,
        reasons: newData.reasons || '',
        // جلب الأصناف المرتبطة إن وجدت، أو وضع صنف فارغ
        items:
          newData.items && newData.items.length > 0
            ? newData.items.map((item) => ({ description: item.description }))
            : [{ description: '' }],
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

// دوال إدارة الأصناف (الـ Dynamic Array)
const addItem = () => {
  form.value.items.push({ description: '' })
}

const removeItem = (index) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1)
  }
}

const handleSubmit = () => {
  // تصفير الأخطاء
  errors.beneficiary_id = false
  errors.request_date = false
  errors.items = false

  // التحقق من الحقول الإجبارية
  if (!form.value.beneficiary_id) errors.beneficiary_id = true
  if (!form.value.request_date) errors.request_date = true

  // تصفية الأصناف الفارغة
  const validItems = form.value.items.filter(
    (item) => item.description && item.description.trim() !== '',
  )

  if (validItems.length === 0) {
    errors.items = true
  }

  if (errors.beneficiary_id || errors.request_date || errors.items) {
    return
  }

  // إرسال البيانات (مع الأصناف المفلترة لضمان عدم إرسال قيم فارغة)
  const payload = {
    ...form.value,
    items: validItems,
  }

  emit('submit', payload)
}

const handleCancel = () => {
  emit('cancel')
}
</script>
