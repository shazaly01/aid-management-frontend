// src/stores/areaStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import areaService from '@/services/areaService'

export const useAreaStore = defineStore('area', () => {
  const areas = ref([]) // ستحتوي على شجرة المناطق
  const currentArea = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // جلب المناطق لبناء الشجرة أو القوائم المنسدلة
  async function fetchAreas() {
    loading.value = true
    error.value = null
    try {
      const response = await areaService.get()
      // البيانات ستصل هنا مرتبة: كل محافظة وتحتها مدنها
      areas.value = response.data.data
    } catch (err) {
      error.value = 'فشل في تحميل قائمة المناطق.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchArea(id) {
    loading.value = true
    error.value = null
    try {
      const response = await areaService.find(id)
      currentArea.value = response.data.data
    } catch (err) {
      error.value = 'فشل في تحميل بيانات المنطقة.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createArea(payload) {
    loading.value = true
    error.value = null
    try {
      await areaService.create(payload)
      await fetchAreas() // تحديث القائمة بعد الإضافة
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إضافة المنطقة.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateArea(id, payload) {
    loading.value = true
    error.value = null
    try {
      await areaService.update(id, payload)
      await fetchAreas() // تحديث القائمة بعد التعديل
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث المنطقة.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteArea(id) {
    loading.value = true
    error.value = null
    try {
      await areaService.delete(id)
      await fetchAreas() // تحديث القائمة بعد الحذف
    } catch (err) {
      // هنا سيظهر خطأ "المنع" (Restrict) إذا كانت المنطقة مستخدمة
      error.value = err.response?.data?.message || 'لا يمكن حذف المنطقة.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    areas,
    currentArea,
    loading,
    error,
    fetchAreas,
    fetchArea,
    createArea,
    updateArea,
    deleteArea,
  }
})
