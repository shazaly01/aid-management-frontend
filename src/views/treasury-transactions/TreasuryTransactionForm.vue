<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <TreasuriesDropdown
            id="treasury-id"
            label="الخزينة"
            v-model="form.treasury_id"
            required
          />
          <p v-if="errors.treasury_id" class="text-rose-500 text-xs mt-1 font-bold">
            يجب اختيار الخزينة
          </p>
        </div>

        <div>
          <AppInput
            id="transaction-no"
            label="رقم الحركة"
            v-model="form.TransactionNo"
            placeholder="أدخل رقم الحركة (رقم صحيح)"
            type="text"
            required
          />
          <p v-if="errors.TransactionNo" class="text-rose-500 text-xs mt-1 font-bold">
            رقم الحركة مطلوب
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppDropdown
            id="transaction-type"
            label="نوع الحركة"
            v-model="form.transaction_type"
            :options="transactionTypeOptions"
            option-label="name"
            option-value="id"
            placeholder="اختر نوع الحركة"
            :required="true"
          />
          <p v-if="errors.transaction_type" class="text-rose-500 text-xs mt-1 font-bold">
            يجب تحديد نوع الحركة
          </p>
        </div>

        <div>
          <AppCurrencyInput
            id="amount"
            label="المبلغ (د.ل)"
            v-model="form.amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            required
          />
          <p v-if="errors.amount" class="text-rose-500 text-xs mt-1 font-bold">
            المبلغ يجب أن يكون أكبر من صفر
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="transaction-date"
            label="تاريخ الحركة"
            v-model="form.transaction_date"
            type="date"
            required
          />
          <p v-if="errors.transaction_date" class="text-rose-500 text-xs mt-1 font-bold">
            تاريخ الحركة مطلوب
          </p>
        </div>

        <div>
          <FinancialAssistancesDropdown
            id="financial-assistance-id"
            label="رقم المساعدة المالية (إن وجدت)"
            v-model="form.financial_assistance_id"
          />
        </div>
      </div>

      <AppTextarea
        id="notes"
        label="ملاحظات (اختياري)"
        v-model="form.notes"
        placeholder="أدخل أي ملاحظات إضافية حول الحركة"
        rows="3"
      />
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ الحركة المالية</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppCurrencyInput from '@/components/ui/AppCurrencyInput.vue'
// مكونات مساعدة لاختيار الخزينة والمساعدة المالية (إن وجدت)
import TreasuriesDropdown from '@/components/forms/TreasuriesDropdown.vue'
import FinancialAssistancesDropdown from '@/components/forms/FinancialAssistancesDropdown.vue'

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
  treasury_id: false,
  TransactionNo: false,
  transaction_type: false,
  amount: false,
  transaction_date: false,
})

// خيارات نوع الحركة
const transactionTypeOptions = [
  { id: 'deposit', name: 'إيداع' },
  { id: 'withdrawal', name: 'سحب' },
]

// ملاحظة: لم نقم بتضمين user_id في الفورم لأنه يُفضل التقاطه من الواجهة الخلفية (Backend) تلقائياً بناءً على المستخدم المسجل دخوله
const createFreshForm = () => ({
  id: null,
  treasury_id: '',
  TransactionNo: '',
  transaction_type: '',
  amount: 0,
  financial_assistance_id: '', // اختياري
  transaction_date: new Date().toISOString().split('T')[0],
  notes: '',
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      const formattedDate = newData.transaction_date
        ? new Date(newData.transaction_date).toISOString().split('T')[0]
        : ''

      form.value = {
        id: newData.id,
        treasury_id: newData.treasury_id || '',
        TransactionNo: newData.TransactionNo || '',
        transaction_type: newData.transaction_type || '',
        amount: newData.amount !== undefined ? Number(newData.amount) : 0,
        financial_assistance_id: newData.financial_assistance_id || '',
        transaction_date: formattedDate,
        notes: newData.notes || '',
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

const handleSubmit = () => {
  // تصفير الأخطاء
  errors.treasury_id = false
  errors.TransactionNo = false
  errors.transaction_type = false
  errors.amount = false
  errors.transaction_date = false

  // التحقق من الحقول
  if (!form.value.treasury_id) errors.treasury_id = true
  if (!form.value.TransactionNo || String(form.value.TransactionNo).trim() === '')
    errors.TransactionNo = true
  if (!form.value.transaction_type) errors.transaction_type = true
  if (form.value.amount <= 0) errors.amount = true
  if (!form.value.transaction_date) errors.transaction_date = true

  if (
    errors.treasury_id ||
    errors.TransactionNo ||
    errors.transaction_type ||
    errors.amount ||
    errors.transaction_date
  ) {
    return
  }

  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
