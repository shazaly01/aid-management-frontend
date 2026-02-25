import { defineStore } from 'pinia'
import { ref } from 'vue'
import treasuryService from '@/services/treasuryService'

export const useTreasuryStore = defineStore('treasury', () => {
  const treasuries = ref([])
  const pagination = ref({})
  const currentTreasury = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchTreasuries(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await treasuryService.get(page, search)
      treasuries.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch treasuries.'
      console.error(err)
      treasuries.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchTreasury(id) {
    loading.value = true
    error.value = null
    currentTreasury.value = null
    try {
      const response = await treasuryService.find(id)
      currentTreasury.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch treasury.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createTreasury(payload) {
    loading.value = true
    error.value = null
    try {
      await treasuryService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create treasury.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTreasury(id, payload) {
    loading.value = true
    error.value = null
    try {
      await treasuryService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update treasury.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTreasury(id) {
    loading.value = true
    error.value = null
    try {
      await treasuryService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete treasury.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    treasuries,
    pagination,
    currentTreasury,
    loading,
    error,
    fetchTreasuries,
    fetchTreasury,
    createTreasury,
    updateTreasury,
    deleteTreasury,
  }
})
