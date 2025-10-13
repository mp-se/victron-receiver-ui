import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import piniaInstance from './modules/pinia.js'
app.use(piniaInstance)

import router from './modules/router.js'
app.use(router)

import {
  BsMessage,
  BsCard,
  BsFileUpload,
  BsProgress,
  BsInputBase,
  BsInputText,
  BsInputReadonly,
  BsSelect,
  BsInputTextArea,
  BsInputNumber,
  BsInputSwitch,
  BsInputRadio,
  BsDropdown,
  BsModalConfirm,
  BsMenuBar,
  BsFooter,
  BsModalLogin,
  IconHome,
  IconTools,
  IconCloudUpArrow,
  IconUpArrow,
  IconCpu,
  IconClipboard
} from '@mp-se/espframework-ui-components'

import AdvancedFilesFragment from './fragments/AdvancedFilesFragment.vue'
import EnableCorsFragment from './fragments/EnableCorsFragment.vue'
import ListFilesFragment from './fragments/ListFilesFragment.vue'
import VoltageFragment from './fragments/VoltageFragment.vue'

app.component('BsMessage', BsMessage)
app.component('BsDropdown', BsDropdown)
app.component('BsCard', BsCard)
app.component('BsFileUpload', BsFileUpload)
app.component('BsProgress', BsProgress)
app.component('BsInputBase', BsInputBase)
app.component('BsInputText', BsInputText)
app.component('BsInputReadonly', BsInputReadonly)
app.component('BsSelect', BsSelect)
app.component('BsInputTextArea', BsInputTextArea)
app.component('BsInputNumber', BsInputNumber)
app.component('BsInputRadio', BsInputRadio)
app.component('BsInputSwitch', BsInputSwitch)
app.component('BsModalConfirm', BsModalConfirm)
app.component('BsMenuBar', BsMenuBar)
app.component('BsFooter', BsFooter)
app.component('BsModalLogin', BsModalLogin)

app.component('IconHome', IconHome)
app.component('IconClipboard', IconClipboard)
app.component('IconTools', IconTools)
app.component('IconCloudUpArrow', IconCloudUpArrow)
app.component('IconUpArrow', IconUpArrow)
app.component('IconCpu', IconCpu)

app.component('AdvancedFilesFragment', AdvancedFilesFragment)
app.component('EnableCorsFragment', EnableCorsFragment)
app.component('ListFilesFragment', ListFilesFragment)
app.component('VoltageFragment', VoltageFragment)

// Import CSS before mounting
import 'bootstrap/dist/css/bootstrap.css'
//import '@popperjs/core/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.js'

app.mount('#app')
