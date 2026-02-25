<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
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
          <AppDropdown
            id="assistance-type"
            label="نوع المساعدة"
            v-model="form.type"
            :options="assistanceTypeOptions"
            option-label="name"
            option-value="id"
            placeholder="اختر نوع المساعدة"
            :required="true"
          />
          <p v-if="errors.type" class="text-rose-500 text-xs mt-1 font-bold">
            يجب تحديد نوع المساعدة
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="request-date"
            label="تاريخ الطلب / الإعتماد"
            v-model="form.request_date"
            type="date"
            required
          />
          <p v-if="errors.request_date" class="text-rose-500 text-xs mt-1 font-bold">
            تاريخ الطلب مطلوب
          </p>
        </div>

        <div>
          <AppCurrencyInput
            id="approved-amount"
            label="المبلغ المعتمد (د.ل)"
            v-model="form.approved_amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            required
          />
          <p v-if="errors.approved_amount" class="text-rose-500 text-xs mt-1 font-bold">
            المبلغ المعتمد يجب أن يكون أكبر من صفر
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ المساعدة المالية</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppCurrencyInput from '@/components/ui/AppCurrencyInput.vue'
// نفترض وجود المكون لاختيار المستفيد
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
  type: false,
  request_date: false,
  approved_amount: false,
})

// خيارات نوع المساعدة المطابقة للـ Enum في الداتابيز
const assistanceTypeOptions = [
  { id: 'social', name: 'مساعدة اجتماعية' },
  { id: 'medical', name: 'مساعدة علاجية' },
]

const createFreshForm = () => ({
  id: null,
  beneficiary_id: '',
  type: '',
  request_date: new Date().toISOString().split('T')[0], // تاريخ اليوم كافتراضي
  approved_amount: 0,
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
        type: newData.type || '',
        request_date: formattedDate,
        approved_amount:
          newData.approved_amount !== undefined ? Number(newData.approved_amount) : 0,
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

const handleSubmit = () => {
  // تصفير الأخطاء
  errors.beneficiary_id = false
  errors.type = false
  errors.request_date = false
  errors.approved_amount = false

  // التحقق من الحقول
  if (!form.value.beneficiary_id) errors.beneficiary_id = true
  if (!form.value.type) errors.type = true
  if (!form.value.request_date) errors.request_date = true
  if (form.value.approved_amount <= 0) errors.approved_amount = true

  if (errors.beneficiary_id || errors.type || errors.request_date || errors.approved_amount) {
    return
  }

  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
