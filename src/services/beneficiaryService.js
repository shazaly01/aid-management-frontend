//src\services\beneficiaryService.js
import apiClient from './apiClient'

const resource = '/beneficiaries'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: { page, search },
    })
  },

  find(id) {
    // نمرر المعرف (الذي قد يكون DECIMAL 18 رقم) كما هو
    return apiClient.get(`${resource}/${id}`)
  },

  getAssistances(id) {
    return apiClient.get(`${resource}/${id}/assistances`)
  },

  create(payload) {
    return apiClient.post(resource, payload)
  },

  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
