import { defineStore } from 'pinia'
import { ref } from 'vue'
import dashboardService from '@/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardService.getStats()
      stats.value = response.data.data // أو response.data حسب تصميم الـ API لديك
    } catch (err) {
      error.value = 'Failed to fetch dashboard stats.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
})
