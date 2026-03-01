import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- استيراد التخطيطات الرئيسية (Layouts) ---
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// --- استيراد الصفحات الأساسية ---
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

// --- استيراد صفحات النظام الجديد (الجمعية الخيرية والمساعدات) ديناميكياً ---
// إدارة النظام والمستخدمين
const UsersList = () => import('@/views/users/UsersList.vue')
const RolesList = () => import('@/views/roles/RolesList.vue')
const BackupsList = () => import('@/views/settings/BackupsList.vue')

// الكيانات الأساسية للنظام
const BeneficiariesList = () => import('@/views/beneficiaries/BeneficiariesList.vue')
const AreasList = () => import('@/views/areas/AreaIndex.vue')
const InKindAssistancesList = () => import('@/views/in-kind-assistances/InKindAssistancesList.vue')
const FinancialAssistancesList = () =>
  import('@/views/financial-assistances/FinancialAssistancesList.vue')
const TreasuriesList = () => import('@/views/treasuries/TreasuriesList.vue')
const TreasuryTransactionsList = () =>
  import('@/views/treasury-transactions/TreasuryTransactionsList.vue')

// --- استيراد صفحات التقارير ---
const TreasuryStatementReport = () => import('@/views/reports/TreasuryStatementReport.vue')
const BeneficiaryStatementReport = () => import('@/views/reports/BeneficiaryStatementReport.vue')
const InKindDistributionReport = () => import('@/views/reports/InKindDistributionReport.vue')
const GlobalBalancesReport = () => import('@/views/reports/GlobalBalancesReport.vue')
const FinancialAidByTypeReport = () => import('@/views/reports/FinancialAidByTypeReport.vue')
const MessageCenter = () => import('@/views/messages/MessageCenter.vue')
// صفحات الطباعة (بدون Layout)
// const PrintTreasuryStatement = () => import('@/views/reports/print/PrintTreasuryStatement.vue')
// const PrintBeneficiaryStatement = () =>
//   import('@/views/reports/print/PrintBeneficiaryStatement.vue')

const routes = [
  // --- المسارات العامة (لا تتطلب مصادقة) ---
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      // إعادة توجيه المسار الجذري إلى صفحة تسجيل الدخول
      { path: '', redirect: '/login' },
    ],
  },

  {
    path: '/print/assistance',
    name: 'PrintAssistance',
    component: () => import('@/views/reports/PrintAssistance.vue'),
    meta: { requiresAuth: true, layout: 'empty' }, // تأكد أن التخطيط لا يحتوي على Sidebar أو Navbar
  },

  // --- المسارات المحمية (تتطلب مصادقة) ---
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { permission: 'dashboard.view' },
      },

      // --- مسارات إدارة النظام ---
      {
        path: 'users',
        name: 'UsersList',
        component: UsersList,
        // تأكد من أن الصلاحية هنا تتطابق مع ما تم تعريفه في الباك اند
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'RolesList',
        component: RolesList,
        meta: { permission: 'role.view' },
      },
      {
        path: 'settings/backups',
        name: 'BackupsList',
        component: BackupsList,
        meta: { permission: 'backup.view' },
      },

      // --- مسارات إدارة الجمعية والمساعدات ---
      {
        path: 'areas',
        name: 'AreasList',
        component: AreasList,
        meta: { permission: 'area.view' }, // ربط المسار بصلاحية رؤية المناطق
      },
      {
        path: 'messages',
        name: 'MessageCenter',
        component: MessageCenter,
        meta: { permission: 'message.view' }, // ربط المسار بصلاحية عرض الرسائل
      },
      {
        path: 'beneficiaries',
        name: 'BeneficiariesList',
        component: BeneficiariesList,
        meta: { permission: 'beneficiary.view' },
      },
      {
        path: 'in-kind-assistances',
        name: 'InKindAssistancesList',
        component: InKindAssistancesList,
        meta: { permission: 'in_kind_assistance.view' },
      },
      {
        path: 'financial-assistances',
        name: 'FinancialAssistancesList',
        component: FinancialAssistancesList,
        meta: { permission: 'financial_assistance.view' },
      },

      // --- مسارات إدارة الخزائن ---
      {
        path: 'treasuries',
        name: 'TreasuriesList',
        component: TreasuriesList,
        meta: { permission: 'treasury.view' },
      },
      {
        path: 'treasury-transactions',
        name: 'TreasuryTransactionsList',
        component: TreasuryTransactionsList,
        meta: { permission: 'treasury.view' }, // ربطناها بصلاحية الخزينة بشكل عام
      },

      // --- مسارات التقارير ---
      {
        path: 'reports/treasury-statement',
        name: 'TreasuryStatementReport',
        component: TreasuryStatementReport,
        meta: { permission: 'treasury.view' },
      },
      {
        path: 'reports/beneficiary-statement',
        name: 'BeneficiaryStatementReport',
        component: BeneficiaryStatementReport,
        meta: { permission: 'beneficiary.view' },
      },
      {
        path: 'reports/in-kind-distribution',
        name: 'InKindDistributionReport',
        component: InKindDistributionReport,
        meta: { permission: 'in_kind_assistance.view' },
      },
      {
        path: 'reports/global-balances',
        name: 'GlobalBalancesReport',
        component: GlobalBalancesReport,
        meta: { permission: 'treasury.view' },
      },
      {
        path: 'reports/financial-aid-by-type',
        name: 'FinancialAidByTypeReport',
        component: FinancialAidByTypeReport,
        meta: { permission: 'financial_assistance.view' },
      },

      // إعادة توجيه المسار الرئيسي للتطبيق إلى لوحة التحكم
      { path: '', redirect: '/app/dashboard' },
    ],
  },

  // --- مسارات الطباعة المستقلة (خارج إطار AppLayout) ---
  // {
  //   path: '/print/treasury-statement',
  //   name: 'PrintTreasuryStatement',
  //   component: PrintTreasuryStatement,
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: '/print/beneficiary-statement',
  //   name: 'PrintBeneficiaryStatement',
  //   component: PrintBeneficiaryStatement,
  //   meta: { requiresAuth: true },
  // },

  // مسار للتعامل مع الصفحات غير الموجودة (404 Fallback)
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- حارس التنقل العام (Global Navigation Guard) ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated, can } = authStore

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      authStore.returnUrl = to.fullPath
      next({ name: 'Login' })
    } else {
      const requiredPermission = to.meta.permission
      if (requiredPermission && !can(requiredPermission)) {
        console.warn(
          `Access denied: route "${String(to.name)}" requires permission "${requiredPermission}"`,
        )
        // توجيه المستخدم للوحة التحكم إذا لم تكن لديه الصلاحية
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
