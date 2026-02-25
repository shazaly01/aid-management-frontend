import { defineStore } from 'pinia'
import { ref } from 'vue'
import financialAssistanceService from '@/services/financialAssistanceService'

export const useFinancialAssistanceStore = defineStore('financialAssistance', () => {
  const assistances = ref([])
  const pagination = ref({})
  const currentAssistance = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAssistances(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await financialAssistanceService.get(page, search)
      assistances.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch financial assistances.'
      console.error(err)
      assistances.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAssistance(id) {
    loading.value = true
    error.value = null
    currentAssistance.value = null
    try {
      const response = await financialAssistanceService.find(id)
      currentAssistance.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch financial assistance.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createAssistance(payload) {
    loading.value = true
    error.value = null
    try {
      await financialAssistanceService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create financial assistance.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    assistances,
    pagination,
    currentAssistance,
    loading,
    error,
    fetchAssistances,
    fetchAssistance,
    createAssistance,
  }
})
