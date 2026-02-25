import apiClient from './apiClient'

const resource = '/treasury-transactions'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, { params: { page, search } })
  },
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },
  create(payload) {
    return apiClient.post(resource, payload)
  },
  // مسار كشف الحساب الخاص بخزينة معينة
  getStatement(treasuryId, params = {}) {
    // params قد تحتوي على فلاتر مثل تواريخ (from_date, to_date)
    return apiClient.get(`/treasuries/${treasuryId}/statement`, { params })
  },
}
