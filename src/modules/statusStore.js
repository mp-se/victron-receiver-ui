import { defineStore } from 'pinia'
import { logDebug, logError, logInfo, sharedHttpClient } from '@mp-se/espframework-ui-components'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      id: '',
      rssi: 0,
      app_ver: '',
      app_build: '',
      mdns: '',
      platform: '',
      wifi_ssid: '',
      ip: '',
      total_heap: 0,
      free_heap: 0,
      wifi_setup: false,

      victron_device: [],

      uptime_seconds: 0,
      uptime_minutes: 0,
      uptime_hours: 0,
      uptime_days: 0
    }
  },
  getters: {},
  actions: {
    async load() {
      logInfo('statusStore.load()', 'Fetching /api/status')

      try {
        const json = await sharedHttpClient.getJson('api/status')
        logDebug('statusStore.load()', json)
        this.id = json.id
        this.rssi = json.rssi
        this.app_ver = json.app_ver
        this.app_build = json.app_build
        this.mdns = json.mdns
        this.platform = json.platform
        this.wifi_ssid = json.wifi_ssid
        this.ip = json.ip
        this.total_heap = json.total_heap
        this.free_heap = json.free_heap
        this.wifi_setup = json.wifi_setup

        this.victron_device = json.victron_device

        this.uptime_seconds = json.uptime_seconds
        this.uptime_minutes = json.uptime_minutes
        this.uptime_hours = json.uptime_hours
        this.uptime_days = json.uptime_days

        this.total_heap = Math.round(this.total_heap / 1024).toFixed(0)
        this.free_heap = Math.round(this.free_heap / 1024).toFixed(0)

        logInfo('statusStore.load()', 'Fetching /api/status completed', this.victron_device)
        return true
      } catch (err) {
        logError('statusStore.load()', err)
        return false
      }
    },
    getModelString(id) {
      switch (id) {
        case 0x203:
          return 'BMV-700'
        case 0x204:
          return 'BMV-702'
        case 0x205:
          return 'BMV-700H'
        case 0x0300:
          return 'BlueSolar MPPT 70|15'
        case 0xa040:
          return 'BlueSolar MPPT 75|50'
        case 0xa041:
          return 'BlueSolar MPPT 150|35'
        case 0xa042:
          return 'BlueSolar MPPT 75|15'
        case 0xa043:
          return 'BlueSolar MPPT 100|15'
        case 0xa044:
          return 'BlueSolar MPPT 100|30'
        case 0xa045:
          return 'BlueSolar MPPT 100|50'
        case 0xa046:
          return 'BlueSolar MPPT 150|70'
        case 0xa047:
          return 'BlueSolar MPPT 150|100'
        case 0xa049:
          return 'BlueSolar MPPT 100|50 rev2'
        case 0xa04a:
          return 'BlueSolar MPPT 100|30 rev2'
        case 0xa04b:
          return 'BlueSolar MPPT 150|35 rev2'
        case 0xa04c:
          return 'BlueSolar MPPT 75|10'
        case 0xa04d:
          return 'BlueSolar MPPT 150|45'
        case 0xa04e:
          return 'BlueSolar MPPT 150|60'
        case 0xa04f:
          return 'BlueSolar MPPT 150|85'
        case 0xa050:
          return 'SmartSolar MPPT 250|100'
        case 0xa051:
          return 'SmartSolar MPPT 150|100'
        case 0xa052:
          return 'SmartSolar MPPT 150|85'
        case 0xa053:
          return 'SmartSolar MPPT 75|15'
        case 0xa054:
          return 'SmartSolar MPPT 75|10'
        case 0xa055:
          return 'SmartSolar MPPT 100|15'
        case 0xa056:
          return 'SmartSolar MPPT 100|30'
        case 0xa057:
          return 'SmartSolar MPPT 100|50'
        case 0xa058:
          return 'SmartSolar MPPT 150|35'
        case 0xa059:
          return 'SmartSolar MPPT 150|100 rev2'
        case 0xa05a:
          return 'SmartSolar MPPT 150|85 rev2'
        case 0xa05b:
          return 'SmartSolar MPPT 250|70'
        case 0xa05c:
          return 'SmartSolar MPPT 250|85'
        case 0xa05d:
          return 'SmartSolar MPPT 250|60'
        case 0xa05e:
          return 'SmartSolar MPPT 250|45'
        case 0xa05f:
          return 'SmartSolar MPPT 100|20'
        case 0xa060:
          return 'SmartSolar MPPT 100|20 48V'
        case 0xa061:
          return 'SmartSolar MPPT 150|45'
        case 0xa062:
          return 'SmartSolar MPPT 150|60'
        case 0xa063:
          return 'SmartSolar MPPT 150|70'
        case 0xa064:
          return 'SmartSolar MPPT 250|85 rev2'
        case 0xa065:
          return 'SmartSolar MPPT 250|100 rev2'
        case 0xa066:
          return 'BlueSolar MPPT 100|20'
        case 0xa067:
          return 'BlueSolar MPPT 100|20 48V'
        case 0xa068:
          return 'SmartSolar MPPT 250|60 rev2'
        case 0xa069:
          return 'SmartSolar MPPT 250|70 rev2'
        case 0xa06a:
          return 'SmartSolar MPPT 150|45 rev2'
        case 0xa06b:
          return 'SmartSolar MPPT 150|60 rev2'
        case 0xa06c:
          return 'SmartSolar MPPT 150|70 rev2'
        case 0xa06d:
          return 'SmartSolar MPPT 150|85 rev3'
        case 0xa06e:
          return 'SmartSolar MPPT 150|100 rev3'
        case 0xa06f:
          return 'BlueSolar MPPT 150|45 rev2'
        case 0xa070:
          return 'BlueSolar MPPT 150|60 rev2'
        case 0xa071:
          return 'BlueSolar MPPT 150|70 rev2'
        case 0xa072:
          return 'BlueSolar MPPT 150|45 rev3'
        case 0xa073:
          return 'SmartSolar MPPT 150|45 rev3'
        case 0xa074:
          return 'SmartSolar MPPT 75|10 rev2'
        case 0xa075:
          return 'SmartSolar MPPT 75|15 rev2'
        case 0xa076:
          return 'BlueSolar MPPT 100|30 rev3'
        case 0xa077:
          return 'BlueSolar MPPT 100|50 rev3'
        case 0xa078:
          return 'BlueSolar MPPT 150|35 rev2'
        case 0xa079:
          return 'BlueSolar MPPT 75|10 rev2'
        case 0xa07a:
          return 'BlueSolar MPPT 75|15 rev2'
        case 0xa07b:
          return 'BlueSolar MPPT 100|15 rev2'
        case 0xa07c:
          return 'BlueSolar MPPT 75/10 rev3'
        case 0xa07d:
          return 'BlueSolar MPPT 75/15 rev3'
        case 0xa07e:
          return 'SmartSolar Charger MPPT 100/30'
        case 0xa102:
          return 'SmartSolar MPPT VE.Can 150/70'
        case 0xa103:
          return 'SmartSolar MPPT VE.Can 150/45'
        case 0xa104:
          return 'SmartSolar MPPT VE.Can 150/60'
        case 0xa105:
          return 'SmartSolar MPPT VE.Can 150/85'
        case 0xa106:
          return 'SmartSolar MPPT VE.Can 150/100'
        case 0xa107:
          return 'SmartSolar MPPT VE.Can 250/45'
        case 0xa108:
          return 'SmartSolar MPPT VE.Can 250/60'
        case 0xa109:
          return 'SmartSolar MPPT VE.Can 250/70'
        case 0xa10a:
          return 'SmartSolar MPPT VE.Can 250/85'
        case 0xa10b:
          return 'SmartSolar MPPT VE.Can 250/100'
        case 0xa10c:
          return 'SmartSolar MPPT VE.Can 150/70 rev2'
        case 0xa10d:
          return 'SmartSolar MPPT VE.Can 150/85 rev2'
        case 0xa10e:
          return 'SmartSolar MPPT VE.Can 150/100 rev2'
        case 0xa10f:
          return 'BlueSolar MPPT VE.Can 150/100'
        case 0xa112:
          return 'BlueSolar MPPT VE.Can 250/70'
        case 0xa113:
          return 'BlueSolar MPPT VE.Can 250/100'
        case 0xa114:
          return 'SmartSolar MPPT VE.Can 250/70 rev2'
        case 0xa115:
          return 'SmartSolar MPPT VE.Can 250/100 rev2'
        case 0xa116:
          return 'SmartSolar MPPT VE.Can 250/85 rev2'
        case 0xa201:
          return 'Phoenix Inverter 12V 250VA 230V'
        case 0xa202:
          return 'Phoenix Inverter 24V 250VA 230V'
        case 0xa204:
          return 'Phoenix Inverter 48V 250VA 230V'
        case 0xa211:
          return 'Phoenix Inverter 12V 375VA 230V'
        case 0xa212:
          return 'Phoenix Inverter 24V 375VA 230V'
        case 0xa214:
          return 'Phoenix Inverter 48V 375VA 230V'
        case 0xa221:
          return 'Phoenix Inverter 12V 500VA 230V'
        case 0xa222:
          return 'Phoenix Inverter 24V 500VA 230V'
        case 0xa224:
          return 'Phoenix Inverter 48V 500VA 230V'
        case 0xa231:
          return 'Phoenix Inverter 12V 250VA 230V'
        case 0xa232:
          return 'Phoenix Inverter 24V 250VA 230V'
        case 0xa234:
          return 'Phoenix Inverter 48V 250VA 230V'
        case 0xa239:
          return 'Phoenix Inverter 12V 250VA 120V'
        case 0xa23a:
          return 'Phoenix Inverter 24V 250VA 120V'
        case 0xa23c:
          return 'Phoenix Inverter 48V 250VA 120V'
        case 0xa241:
          return 'Phoenix Inverter 12V 375VA 230V'
        case 0xa242:
          return 'Phoenix Inverter 24V 375VA 230V'
        case 0xa244:
          return 'Phoenix Inverter 48V 375VA 230V'
        case 0xa249:
          return 'Phoenix Inverter 12V 375VA 120V'
        case 0xa24a:
          return 'Phoenix Inverter 24V 375VA 120V'
        case 0xa24c:
          return 'Phoenix Inverter 48V 375VA 120V'
        case 0xa251:
          return 'Phoenix Inverter 12V 500VA 230V'
        case 0xa252:
          return 'Phoenix Inverter 24V 500VA 230V'
        case 0xa254:
          return 'Phoenix Inverter 48V 500VA 230V'
        case 0xa259:
          return 'Phoenix Inverter 12V 500VA 120V'
        case 0xa25a:
          return 'Phoenix Inverter 24V 500VA 120V'
        case 0xa25c:
          return 'Phoenix Inverter 48V 500VA 120V'
        case 0xa261:
          return 'Phoenix Inverter 12V 800VA 230V'
        case 0xa262:
          return 'Phoenix Inverter 24V 800VA 230V'
        case 0xa264:
          return 'Phoenix Inverter 48V 800VA 230V'
        case 0xa269:
          return 'Phoenix Inverter 12V 800VA 120V'
        case 0xa26a:
          return 'Phoenix Inverter 24V 800VA 120V'
        case 0xa26c:
          return 'Phoenix Inverter 48V 800VA 120V'
        case 0xa271:
          return 'Phoenix Inverter 12V 1200VA 230V'
        case 0xa272:
          return 'Phoenix Inverter 24V 1200VA 230V'
        case 0xa274:
          return 'Phoenix Inverter 48V 1200VA 230V'
        case 0xa279:
          return 'Phoenix Inverter 12V 1200VA 120V'
        case 0xa27a:
          return 'Phoenix Inverter 24V 1200VA 120V'
        case 0xa27c:
          return 'Phoenix Inverter 48V 1200VA 120V'
        case 0xa281:
          return 'Phoenix Inverter 12V 1600VA 230V'
        case 0xa282:
          return 'Phoenix Inverter 24V 1600VA 230V'
        case 0xa284:
          return 'Phoenix Inverter 48V 1600VA 230V'
        case 0xa291:
          return 'Phoenix Inverter 12V 2000VA 230V'
        case 0xa292:
          return 'Phoenix Inverter 24V 2000VA 230V'
        case 0xa294:
          return 'Phoenix Inverter 48V 2000VA 230V'
        case 0xa2a1:
          return 'Phoenix Inverter 12V 3000VA 230V'
        case 0xa2a2:
          return 'Phoenix Inverter 24V 3000VA 230V'
        case 0xa2a4:
          return 'Phoenix Inverter 48V 3000VA 230V'
        case 0xa340:
          return 'Phoenix Smart IP43 Charger 12|50 (1+1)'
        case 0xa341:
          return 'Phoenix Smart IP43 Charger 12|50 (3)'
        case 0xa342:
          return 'Phoenix Smart IP43 Charger 24|25 (1+1)'
        case 0xa343:
          return 'Phoenix Smart IP43 Charger 24|25 (3)'
        case 0xa344:
          return 'Phoenix Smart IP43 Charger 12|30 (1+1)'
        case 0xa345:
          return 'Phoenix Smart IP43 Charger 12|30 (3)'
        case 0xa346:
          return 'Phoenix Smart IP43 Charger 24|16 (1+1)'
        case 0xa347:
          return 'Phoenix Smart IP43 Charger 24|16 (3)'
        case 0xa3b0:
          return 'Smart BatteryProtect 12/24V-65A'
        case 0xa381:
          return 'BMV-712 Smart'
        case 0xa382:
          return 'BMV-710H Smart'
        case 0xa383:
          return 'BMV-712 Smart Rev2'
        case 0xa389:
          return 'SmartShunt 500A/50mV'
        case 0xa38a:
          return 'SmartShunt 1000A/50mV'
        case 0xa38b:
          return 'SmartShunt 2000A/50mV'
        case 0xa3a4:
          return 'Smart Battery Sense'
        case 0xa3a5:
          return 'Smart Battery Sense'
        case 0xa3c0:
          return 'Orion Smart 12V|12V-18A Isolated DC-DC Charger'
        case 0xa3c8:
          return 'Orion Smart 12V|12V-30A Isolated DC-DC Charger'
        case 0xa3d0:
          return 'Orion Smart 12V|12V-30A Non-isolated DC-DC Charger'
        case 0xa3c1:
          return 'Orion Smart 12V|24V-10A Isolated DC-DC Charger'
        case 0xa3c9:
          return 'Orion Smart 12V|24V-15A Isolated DC-DC Charger'
        case 0xa3d1:
          return 'Orion Smart 12V|24V-15A Non-isolated DC-DC Charger'
        case 0xa3c2:
          return 'Orion Smart 24V|12V-20A Isolated DC-DC Charger'
        case 0xa3ca:
          return 'Orion Smart 24V|12V-30A Isolated DC-DC Charger'
        case 0xa3d2:
          return 'Orion Smart 24V|12V-30A Non-isolated DC-DC Charger'
        case 0xa3c3:
          return 'Orion Smart 24V|24V-12A Isolated DC-DC Charger'
        case 0xa3cb:
          return 'Orion Smart 24V|24V-17A Isolated DC-DC Charger'
        case 0xa3d3:
          return 'Orion Smart 24V|24V-17A Non-isolated DC-DC Charger'
        case 0xa3c4:
          return 'Orion Smart 24V|48V-6A Isolated DC-DC Charger'
        case 0xa3cc:
          return 'Orion Smart 24V|48V-8.5A Isolated DC-DC Charger'
        case 0xa3c5:
          return 'Orion Smart 48V|12V-20A Isolated DC-DC Charger'
        case 0xa3cd:
          return 'Orion Smart 48V|12V-30A Isolated DC-DC Charger'
        case 0xa3c6:
          return 'Orion Smart 48V|24V-12A Isolated DC-DC Charger'
        case 0xa3ce:
          return 'Orion Smart 48V|24V-16A Isolated DC-DC Charger'
        case 0xa3c7:
          return 'Orion Smart 48V|48V-6A Isolated DC-DC Charger'
        case 0xa3cf:
          return 'Orion Smart 48V|48V-8.5A Isolated DC-DC Charger'
        case 0xa3e6:
          return 'Lynx Smart BMS 1000'
        case 0x2780:
          return 'Victron Multiplus II 12/3000/120-50 2x120V'
        case 0xc030:
          return 'SmartShunt IP65 500A/50mV'
      }
      return 'Unknown device 0x' + id.toString(16).toUpperCase()
    }
  }
})
