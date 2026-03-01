//src\stores\beneficiaryStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import beneficiaryService from '@/services/beneficiaryService'

export const useBeneficiaryStore = defineStore('beneficiary', () => {
  const beneficiaries = ref([])
  const pagination = ref({})
  const currentBeneficiary = ref(null)
  const beneficiaryAssistances = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchBeneficiaries(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await beneficiaryService.get(page, search)
      beneficiaries.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch beneficiaries.'
      console.error(err)
      beneficiaries.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchBeneficiary(id) {
    loading.value = true
    error.value = null
    currentBeneficiary.value = null
    try {
      const response = await beneficiaryService.find(id)
      currentBeneficiary.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch beneficiary.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createBeneficiary(payload) {
    loading.value = true
    error.value = null
    try {
      await beneficiaryService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create beneficiary.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBeneficiary(id, payload) {
    loading.value = true
    error.value = null
    try {
      await beneficiaryService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update beneficiary.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBeneficiary(id) {
    loading.value = true
    error.value = null
    try {
      await beneficiaryService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete beneficiary.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBeneficiaryAssistances(id) {
    loading.value = true
    error.value = null
    beneficiaryAssistances.value = null // تصفير البيانات القديمة
    try {
      const response = await beneficiaryService.getAssistances(id)
      beneficiaryAssistances.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch beneficiary assistances.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    beneficiaries,
    pagination,
    currentBeneficiary,
    beneficiaryAssistances,
    loading,
    error,
    fetchBeneficiaries,
    fetchBeneficiary,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    fetchBeneficiaryAssistances,
  }
})
