import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/orgs',
      name: 'orgs',
      component: () => import('@/views/OrgsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orgs/:id',
      name: 'org-detail',
      component: () => import('@/views/OrgDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cache',
      name: 'cache',
      component: () => import('@/views/CacheView.vue')
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('@/views/JobsView.vue')
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () => import('@/views/JobDetailView.vue')
    },
    {
      path: '/email',
      name: 'email',
      component: () => import('@/views/EmailView.vue')
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Wait for initial session check to complete
  if (!authStore.isReady) {
    await authStore.waitUntilReady()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'orgs' })
  } else {
    next()
  }
})

export default router
