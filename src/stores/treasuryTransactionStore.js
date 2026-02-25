import { defineStore } from 'pinia'
import { ref } from 'vue'
import treasuryTransactionService from '@/services/treasuryTransactionService'

export const useTreasuryTransactionStore = defineStore('treasuryTransaction', () => {
  const transactions = ref([])
  const pagination = ref({})
  const currentTransaction = ref(null)

  // حالة خاصة لكشف الحساب
  const statementData = ref([])

  const loading = ref(false)
  const error = ref(null)

  async function fetchTransactions(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await treasuryTransactionService.get(page, search)
      transactions.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch transactions.'
      console.error(err)
      transactions.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchTransaction(id) {
    loading.value = true
    error.value = null
    currentTransaction.value = null
    try {
      const response = await treasuryTransactionService.find(id)
      currentTransaction.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch transaction.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(payload) {
    loading.value = true
    error.value = null
    try {
      await treasuryTransactionService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create transaction.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTreasuryStatement(treasuryId, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await treasuryTransactionService.getStatement(treasuryId, params)
      statementData.value = response.data.data // تأكد من مطابقة هذه البنية لرد الـ API
    } catch (err) {
      error.value = 'Failed to fetch treasury statement.'
      console.error(err)
      statementData.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    pagination,
    currentTransaction,
    statementData,
    loading,
    error,
    fetchTransactions,
    fetchTransaction,
    createTransaction,
    fetchTreasuryStatement,
  }
})
