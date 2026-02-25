import apiClient from './apiClient'

const resource = '/in-kind-assistances'

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
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
