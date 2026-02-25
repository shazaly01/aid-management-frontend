import { defineStore } from 'pinia'
import { ref } from 'vue'
import inKindAssistanceService from '@/services/inKindAssistanceService'

export const useInKindAssistanceStore = defineStore('inKindAssistance', () => {
  const assistances = ref([])
  const pagination = ref({})
  const currentAssistance = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAssistances(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await inKindAssistanceService.get(page, search)
      assistances.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch in-kind assistances.'
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
      const response = await inKindAssistanceService.find(id)
      currentAssistance.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch in-kind assistance.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createAssistance(payload) {
    loading.value = true
    error.value = null
    try {
      await inKindAssistanceService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create in-kind assistance.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteAssistance(id) {
    loading.value = true
    error.value = null
    try {
      await inKindAssistanceService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete in-kind assistance.'
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
    deleteAssistance,
  }
})
