import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Set favicon to project logo at runtime (works in dev and build)
(() => {
  const link = document.querySelector('link[rel="icon"]') || document.createElement('link')
  link.setAttribute('rel', 'icon')
  link.setAttribute('type', 'image/png')
  // Use Vite asset resolution so the path is transformed in production
  try {
    // eslint-disable-next-line no-undef
    const logoUrl = new URL('./assets/LOGO.png', import.meta.url).href
    link.setAttribute('href', logoUrl)
  } catch (e) {
    // fallback for any unexpected error
    link.setAttribute('href', '/src/assets/LOGO.png')
  }
  if (!link.isConnected) document.head.appendChild(link)
})()