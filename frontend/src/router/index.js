import { createRouter, createWebHistory } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'

// 用户端页面
import HomePage from '@/views/user/HomePage.vue'
import ExploreHub from '@/views/user/ExploreHub.vue'
import CreatorPage from '@/views/user/CreatorPage.vue'
import SubscriptionPage from '@/views/user/SubscriptionPage.vue'
import MyCollections from '@/views/user/MyCollections.vue'

// 创作者端页面
import CreatorDashboard from '@/views/creator/CreatorDashboard.vue'
import ContentManager from '@/views/creator/ContentManager.vue'
import SubscriptionManager from '@/views/creator/SubscriptionManager.vue'
import RevenueSettings from '@/views/creator/RevenueSettings.vue'
import Analytics from '@/views/creator/Analytics.vue'

// 组件
import CreatorSetup from '@/components/CreatorSetup.vue'

const routes = [
  // 用户端路由
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Satscribe - 發現優質內容' }
  },
  {
    path: '/explore',
    name: 'ExploreHub',
    component: ExploreHub,
    meta: { title: 'Satscribe - 探索創作宇宙' }
  },
  {
    path: '/creator/:address',
    name: 'CreatorPage',
    component: CreatorPage,
    props: true,
    meta: { title: '創作者詳情' }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/user/ArticleDetail.vue'),
    props: true,
    meta: { title: '文章詳情' }
  },
  {
    path: '/subscription/:address/:seasonId',
    name: 'SubscriptionPage',
    component: SubscriptionPage,
    props: true,
    meta: { title: '订阅详情' }
  },
  {
    path: '/my-collections',
    name: 'MyCollections',
    component: MyCollections,
    meta: { 
      title: '我的收藏',
      requiresAuth: true 
    }
  },
  
  // 创作者端路由
  {
    path: '/creator',
    redirect: '/creator/dashboard'
  },
  {
    path: '/creator/setup',
    name: 'CreatorSetup',
    component: CreatorSetup,
    meta: { 
      title: '創作者註冊',
      requiresAuth: true
    }
  },
  {
    path: '/creator/dashboard',
    name: 'CreatorDashboard',
    component: CreatorDashboard,
    meta: { 
      title: '创作者仪表盘',
      requiresAuth: true,
      creatorOnly: true
    }
  },
  {
    path: '/creator/content',
    name: 'ContentManager',
    component: ContentManager,
    meta: { 
      title: '内容管理',
      requiresAuth: true,
      creatorOnly: true
    }
  },
  {
    path: '/creator/subscriptions',
    name: 'SubscriptionManager',
    component: SubscriptionManager,
    meta: { 
      title: '订阅管理',
      requiresAuth: true,
      creatorOnly: true
    }
  },
  {
    path: '/creator/revenue',
    name: 'RevenueSettings',
    component: RevenueSettings,
    meta: { 
      title: '分润设置',
      requiresAuth: true,
      creatorOnly: true
    }
  },
  {
    path: '/creator/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: { 
      title: '数据分析',
      requiresAuth: true,
      creatorOnly: true
    }
  },
  
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const walletStore = useWalletStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 检查是否需要钱包连接
  if (to.meta.requiresAuth && !walletStore.isConnected) {
    // 可以在这里显示连接钱包的提示
    console.warn('此页面需要连接钱包')
    next('/')
    return
  }
  
  // 检查创作者权限
  if (to.meta.creatorOnly && walletStore.isConnected) {
    try {
      // 这里可以检查用户是否为注册创作者
      // const isCreator = await walletStore.checkIsCreator()
      // if (!isCreator) {
      //   next('/')
      //   return
      // }
    } catch (error) {
      console.error('检查创作者状态失败:', error)
    }
  }
  
  next()
})

export default router