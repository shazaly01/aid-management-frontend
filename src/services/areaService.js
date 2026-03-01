// src/services/areaService.js
import apiClient from './apiClient'

const resource = '/areas'

export default {
  // جلب جميع المناطق (ستعود بشكل شجري من الـ API)
  get() {
    return apiClient.get(resource)
  },

  // جلب منطقة محددة مع أبنائها وأبيها
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  // إضافة منطقة جديدة (محافظة أو مدينة أو حي)
  create(payload) {
    return apiClient.post(resource, payload)
  },

  // تحديث بيانات منطقة
  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  // حذف منطقة (تذكر أن النظام سيمنع الحذف إذا كانت مرتبطة)
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
