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
          <TreasuriesDropdown
            id="treasury-id"
            label="الصرف من خزينة"
            v-model="form.treasury_id"
            required
          />
          <p v-if="errors.treasury_id" class="text-rose-500 text-xs mt-1 font-bold">
            يجب اختيار الخزينة
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppDropdown
            id="assistance-type"
            label="نوع المساعدة"
            v-model="form.type"
            :options="assistanceTypeOptions"
            option-label="name"
            option-value="id"
            placeholder="اختر نوع المساعدة"
            required
          />
          <p v-if="errors.type" class="text-rose-500 text-xs mt-1 font-bold">
            يجب تحديد نوع المساعدة
          </p>
        </div>

        <div>
          <AppCurrencyInput
            id="approved-amount"
            label="المبلغ المعتمد (د.ل)"
            v-model="form.approved_amount"
            placeholder="0.00"
            required
          />
          <p v-if="errors.approved_amount" class="text-rose-500 text-xs mt-1 font-bold">
            المبلغ يجب أن يكون أكبر من صفر
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="request-date"
            label="تاريخ الصرف"
            v-model="form.request_date"
            type="date"
            required
          />
        </div>

        <div>
          <AppInput
            id="notes"
            label="ملاحظات إضافية"
            v-model="form.notes"
            placeholder="أدخل أي ملاحظات هنا..."
          />
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>اعتماد وصرف المساعدة</span>
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
import BeneficiariesDropdown from '@/components/forms/BeneficiariesDropdown.vue'
import TreasuriesDropdown from '@/components/forms/TreasuriesDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const errors = reactive({
  beneficiary_id: false,
  treasury_id: false,
  type: false,
  approved_amount: false,
})

const assistanceTypeOptions = [
  { id: 'social', name: 'مساعدة اجتماعية' },
  { id: 'medical', name: 'مساعدة علاجية' },
]

const createFreshForm = () => ({
  beneficiary_id: '',
  treasury_id: '',
  type: '',
  request_date: new Date().toISOString().split('T')[0],
  approved_amount: 0,
  notes: '',
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        ...createFreshForm(),
        beneficiary_id: newData.beneficiary_id || '',
        // إذا كنا نفتح المودال من جدول المستفيدين، سيتم تعبئة الـ ID تلقائياً
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  // تصفير الأخطاء والتحقق
  Object.keys(errors).forEach((k) => (errors[k] = false))

  if (!form.value.beneficiary_id) errors.beneficiary_id = true
  if (!form.value.treasury_id) errors.treasury_id = true
  if (!form.value.type) errors.type = true
  if (form.value.approved_amount <= 0) errors.approved_amount = true

  if (Object.values(errors).some((v) => v)) return

  emit('submit', { ...form.value })
}

const handleCancel = () => emit('cancel')
</script>
