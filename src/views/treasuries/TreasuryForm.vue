<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
      <div>
        <AppInput
          id="treasury-name"
          label="اسم الخزينة"
          v-model="form.name"
          placeholder="مثال: الخزينة الرئيسية، خزينة التبرعات..."
          required
        />
        <p v-if="errors.name" class="text-rose-500 text-xs mt-1 font-bold">اسم الخزينة مطلوب</p>
      </div>

      <AppCurrencyInput
        id="treasury-balance"
        label="الرصيد الحالي / الافتتاحي"
        v-model="form.balance"
        type="number"
        step="0.01"
        placeholder="0.00"
        required
      />
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ بيانات الخزينة</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCurrencyInput from '@/components/ui/AppCurrencyInput.vue'

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
  name: false,
})

const createFreshForm = () => ({
  id: null,
  name: '',
  balance: 0,
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        id: newData.id,
        name: newData.name || '',
        balance: newData.balance !== undefined ? newData.balance : 0,
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

const handleSubmit = () => {
  errors.name = false

  if (!form.value.name || form.value.name.trim() === '') {
    errors.name = true
    return
  }

  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
