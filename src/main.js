/*
  victron-receiver-ui
  Copyright (C) 2024-2026 Magnus

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
  IconClipboard,
  IconEye
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
app.component('IconEye', IconEye)

app.component('AdvancedFilesFragment', AdvancedFilesFragment)
app.component('EnableCorsFragment', EnableCorsFragment)
app.component('ListFilesFragment', ListFilesFragment)
app.component('VoltageFragment', VoltageFragment)

// Import CSS before mounting
import 'bootstrap/dist/css/bootstrap.css'
//import '@popperjs/core/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.js'

app.mount('#app')
