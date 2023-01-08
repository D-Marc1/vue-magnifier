import { App } from 'vue'

import VueMagnifier from './components/VueMagnifier.vue'

import './css/style.css'

VueMagnifier.install = (app: App) => {
  app.component('VueMagnifier', VueMagnifier)
}

export default VueMagnifier
