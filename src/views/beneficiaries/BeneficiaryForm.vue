<!-- src\views\beneficiaries\BeneficiaryForm.vue-->
<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
      <AppInput
        id="beneficiary-name"
        label="اسم المستفيد"
        v-model="form.name"
        placeholder="ادخل اسم المستفيد بالكامل"
        required
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="national-id"
            label="الرقم الوطني"
            v-model="form.national_id"
            placeholder="ادخل الرقم الوطني"
            required
          />
          <p v-if="errors.national_id" class="text-rose-500 text-xs mt-1 font-bold">
            الرقم الوطني مطلوب
          </p>
        </div>

        <AppInput
          id="phone-number"
          label="رقم الهاتف"
          v-model="form.phone"
          placeholder="ادخل رقم الهاتف"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput id="birth-date" label="تاريخ الميلاد" v-model="form.birth_date" type="date" />

        <AppDropdown
          id="gender"
          label="الجنس"
          v-model="form.gender"
          :options="genderOptions"
          placeholder="اختر الجنس"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput
          id="nationality"
          label="الجنسية"
          v-model="form.nationality"
          placeholder="مثال: ليبي، سوداني، مصري..."
        />

        <AppDropdown
          id="marital-status"
          label="الحالة الاجتماعية"
          v-model="form.marital_status"
          :options="maritalStatusOptions"
          placeholder="اختر الحالة الاجتماعية"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput
          id="family-members-count"
          label="عدد أفراد الأسرة"
          v-model="form.family_members_count"
          type="number"
          min="1"
          required
        />

        <AreasDropdown id="area-id" label="محل الإقامة (المنطقة)" v-model="form.area_id" required />
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ بيانات المستفيد</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

// استيراد مكونات UI الأساسية (تأكد من مساراتها في مشروعك)
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AreasDropdown from '@/components/forms/AreasDropdown.vue'

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

// إدارة الأخطاء يدوياً
const errors = reactive({
  national_id: false,
})

// خيارات القوائم المنسدلة
const genderOptions = [
  { id: 'ذكر', name: 'ذكر' },
  { id: 'أنثى', name: 'أنثى' },
]

const maritalStatusOptions = [
  { id: 'أعزب', name: 'أعزب' },
  { id: 'متزوج', name: 'متزوج' },
  { id: 'مطلق', name: 'مطلق' },
  { id: 'أرمل', name: 'أرمل' },
  { id: 'أخرى', name: 'أخرى' },
]

const createFreshForm = () => ({
  id: null,
  name: '',
  national_id: '',
  birth_date: '',
  gender: '',
  nationality: '',
  marital_status: '',
  family_members_count: 1, // القيمة الافتراضية كما في الـ Migration
  residence: '',
  phone: '',
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      // تنسيق التاريخ إذا كان موجوداً ليناسب حقل إدخال التاريخ
      const formattedDate = newData.birth_date
        ? new Date(newData.birth_date).toISOString().split('T')[0]
        : ''

      form.value = {
        id: newData.id,
        name: newData.name || '',
        national_id: newData.national_id || '',
        birth_date: formattedDate,
        gender: newData.gender || '',
        nationality: newData.nationality || '',
        marital_status: newData.marital_status || '',
        family_members_count: Number(newData.family_members_count) || 1,
        residence: newData.residence || '',
        phone: newData.phone || '',
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

const handleSubmit = () => {
  // إعادة تعيين الأخطاء
  errors.national_id = false

  // تحقق إضافي للرقم الوطني
  if (!form.value.national_id || form.value.national_id.trim() === '') {
    errors.national_id = true
    return
  }

  // إذا نجح التحقق، نقوم بالإرسال
  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
