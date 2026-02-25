import apiClient from './apiClient'

const resource = '/reports'

export default {
  // جميع الدوال تقبل params لتمرير الفلاتر (مثل التواريخ، المعرفات، إلخ)
  getTreasuryStatement(params = {}) {
    return apiClient.get(`${resource}/treasury-statement`, { params })
  },
  getBeneficiaryStatement(params = {}) {
    return apiClient.get(`${resource}/beneficiary-statement`, { params })
  },
  getInKindDistribution(params = {}) {
    return apiClient.get(`${resource}/in-kind-distribution`, { params })
  },
  getGlobalBalances(params = {}) {
    return apiClient.get(`${resource}/global-balances`, { params })
  },
  getFinancialAidByType(params = {}) {
    return apiClient.get(`${resource}/financial-aid-by-type`, { params })
  },
}
