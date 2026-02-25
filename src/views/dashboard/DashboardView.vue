<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-text-primary">مرحباً بك في لوحة التحكم</h1>
      <p class="text-text-muted text-sm mt-1">نظرة عامة على نشاط النظام لليوم</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    </div>

    <template v-else-if="dashboardData">
      <StatCards :stats="dashboardData.cards" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <RecentActivities :activities="dashboardData.activities" />
        </div>

        <div class="lg:col-span-2 space-y-8">
          <div
            class="bg-surface-section p-6 rounded-2xl border border-surface-border shadow-sm h-full flex flex-col items-center justify-center border-dashed"
          >
            <ChartBarIcon class="w-16 h-16 text-surface-border mb-4" />
            <p class="text-text-muted">تحليل المساعدات الشهرية والديموغرافية</p>
            <span class="text-xs text-text-muted mt-2"
              >(جاري العمل على دمج الرسوم البيانية التفاعلية)</span
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/services/apiClient'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

import StatCards from '@/components/ui/StatCards.vue'
import RecentActivities from '@/components/ui/RecentActivities.vue'

const loading = ref(true)
const dashboardData = ref(null)

const fetchDashboardStats = async () => {
  try {
    const response = await axios.get('/dashboard/stats')
    if (response.data.status) {
      dashboardData.value = response.data.data
    }
  } catch (error) {
    console.error('فشل جلب إحصائيات لوحة التحكم:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>
