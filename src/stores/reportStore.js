import { defineStore } from 'pinia'
import { ref } from 'vue'
import reportService from '@/services/reportService'

export const useReportStore = defineStore('report', () => {
  // فصلنا حالة كل تقرير لتجنب التداخل إذا تم طلب تقريرين في نفس الوقت
  const treasuryStatementData = ref(null)
  const beneficiaryStatementData = ref(null)
  const inKindDistributionData = ref(null)
  const globalBalancesData = ref(null)
  const financialAidData = ref(null)

  const loading = ref(false)
  const error = ref(null)

  async function fetchTreasuryStatement(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getTreasuryStatement(params)
      treasuryStatementData.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch treasury statement report.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchBeneficiaryStatement(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getBeneficiaryStatement(params)
      beneficiaryStatementData.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch beneficiary statement report.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchInKindDistribution(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getInKindDistribution(params)
      inKindDistributionData.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch in-kind distribution report.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchGlobalBalances(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getGlobalBalances(params)
      globalBalancesData.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch global balances report.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchFinancialAidByType(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getFinancialAidByType(params)
      financialAidData.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch financial aid by type report.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    treasuryStatementData,
    beneficiaryStatementData,
    inKindDistributionData,
    globalBalancesData,
    financialAidData,
    loading,
    error,
    fetchTreasuryStatement,
    fetchBeneficiaryStatement,
    fetchInKindDistribution,
    fetchGlobalBalances,
    fetchFinancialAidByType,
  }
})
