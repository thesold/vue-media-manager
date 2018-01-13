import Vue from 'vue'
import App from './App.vue'
import router from './router'
import MediaManager from './components/MediaManager.vue'

Vue.config.productionTip = false

Vue.component('media-manager', MediaManager)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App),
})
