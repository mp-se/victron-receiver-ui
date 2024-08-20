const express = require('express')
var cors = require('cors')

const multer  = require('multer');
const upload = multer({ dest: "./" });

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.post('/api/firmware', upload.single('file'), function(req, res) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

configData = {
  // Device configuration
  id: "7376ef",
  mdns: "victron3",
  temp_format: "C",
  dark_mode: false, 
  // Hardware
  ble_scan_time: 5,
  timezone: "CET-1CEST,M3.5.0,M10.5.0/3",
  // Wifi
  wifi_portal_timeout: 120,
  wifi_connect_timeout: 20,
  wifi_ssid: "network A",
  wifi_ssid2: "",
  wifi_pass: "password",
  wifi_pass2: "mypass",
  // Push - Generic
  push_timeout: 10,
  push_resend_time: 300, 
  // Push - mqtt
  mqtt_target: "192.168.1.10",
  mqtt_port: 142,
  mqtt_user: "user",
  mqtt_pass: "pass",
  // Devices
  victron_config: [
    { name: "name", mac: "11:22:33:44:55:66", key: "123456789012345678901234567890"},
  ]
}

statusData = {
  id: "7376ef",
  angle: 22.4,
  rssi: -56,
  app_ver: "2.0.0",
  app_build: "gitrev",
  mdns: "gravmon",
  platform: "esp32s3",
  wifi_ssid: "wifi",
  total_heap: 1000,
  free_heap: 500,
  ip: "192.0.0.1",
  wifi_setup: false,
  uptime_seconds: 1,
  uptime_minutes: 2,
  uptime_hours: 3,
  uptime_days: 4,
  victron_device: [ 
    { mac: "00:11:22:33:44:55", data: "{\"name\":\"Smart Battery Monitor\",\"model\":\"0xA3A4\",\"battery_voltage\":11.34,\"temperature\":23}", name: "Cranking battery", update_time: 100, push_time: 600 },  
    { mac: "00:11:22:33:44:56", data: "{\"name\":\"Orion Smart DC-DC Charger\",\"model\":\"0xA3C0\",\"input_voltage\":14.45,\"output_voltage\":13.67,\"state_message\":\"Off\",\"error\":0,\"error_message\":\"No error\",\"off_reason\":0,\"off_reason_message\":\"No input power. \"}", name: "Boat charger", update_time: 200, push_time: 300 },  
    { mac: "00:11:22:33:44:57", data: "{\"name\":\"Unknown\",\"model\":\"0x1234\",\"data\":\"0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x00,0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x10,0x21\"}", name: "Solar charger", update_time: 10, push_time: 0 },  
  ]
}

app.get('/api/auth', (req, res) => {
  console.log('GET: /api/auth')
  /* 
   * Description:    Perform device authentication and receive access token
   * Authentication: No
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  data = { token: statusData.id }

  console.log(req.headers['authorization'])
  res.send(data)
})

app.get('/api/config', (req, res) => {
  console.log('GET: /api/config')
  /* 
   * Description:    Return configuration data as json document. 
   * Authentication: Required
   * Limitation:     Don't include format templates due to their size.
   *                 Wifi passwords are removed due to security considerations (no encrypted transfer).
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(configData)
})

app.get('/api/restart', (req, res) => {
  console.log('GET: /api/restart')
  /* 
   * Description:    Perform a restart of the device
   * Authentication: Required
   * Limitation:     - 
   * Note:           Simulator will wait 2 seconds before returning result.
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      status: true,
      success: true,
      message: "Device is restarting..."
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

app.get('/api/factory', (req, res) => {
  console.log('GET: /api/factory')
  /* 
   * Description:    Simualate a factory reset.
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      success: true,
      message: "Factory settings restored"
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

app.get('/api/status', (req, res) => {
  console.log('GET: /api/status')
  /* 
   * Description:    Return status data as json document. 
   * Authentication: None
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(statusData)
})

app.post('/api/config', (req, res) => {
  console.log('POST: /api/config')
  /* 
   * Description:    Update the configuration data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See config read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    configData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Configuration stored",
  }
  res.type('application/json')
  res.send(data)
})

var wifiScanRunning = false

app.get('/api/wifi', (req, res) => {
  console.log('GET: /api/wifi')
  /* 
   * Description:    Do a wifi scan for avaialble networks
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/wifi/scan/status to check for completion
   * Return:         200 OK, 401 Access Denied
   */
  wifiScanRunning = true
  setTimeout(() => { wifiScanRunning = false }, 8000)
  var data = {
    success: true,
    message: "Wifi scan started."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/wifi/status', (req, res) => {
  console.log('GET: /api/wifi/status')
  /* 
   * Description:    Return status of the current wifi scan process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (wifiScanRunning) {
    data = {
      status: wifiScanRunning,
      success: false,
      message: "Wifi scan running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Wifi scan completed...",
      networks: [ 
        { wifi_ssid: "network A", rssi: -20, channel: 10, encryption: 2 }, 
        { wifi_ssid: "network B", rssi: -70, channel: 12, encryption: 3 }, 
        { wifi_ssid: "network C", rssi: -50, channel: 6, encryption: 0 }
      ]
    }
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/filesystem', (req, res) => {
  console.log('POST: /api/filesystem')
  /* 
   * Description:    Interact with local file system on the device
   * Authentication: Required
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied, 400 Faulty request
   * Request body:
     {
       command: "dir|get|del",
       file: "name of file for get and del"
     }
   */
  console.log("Command:", req.body.command)
  
  if(req.body.command == "dir") {
    var data = { 
      total: 1000,
      used: 900,
      free: 100,
      files: [
        { file: "/error.log", size: 10 },
        { file: "/error2.log", size: 10 },
      ]
    }
    res.type('application/json')
    res.send(data)
    return
  }
  else if(req.body.command == "del") {
    console.log(req.body.file)
    setTimeout(() => {
      res.sendStatus(200)
    }, 2000)
    return
  } else if(req.body.command == "get") {
    console.log(req.body.file)
    if(req.body.file == "/error.log") {
      setTimeout(() => {
        res.send("Log entry 5\nLog entry 4\nLog entry 3\nLog entry 2\nLog entry 1\n")
      }, 1000)
    } else if(req.body.file == "/error2.log") {
      setTimeout(() => {
        res.send("Log entry 9\nLog entry 8\nLog entry 7\nLog entry 6\n")
      }, 1000)
    }
    return
  } 

  res.sendStatus(400)
})

app.listen(port, () => {
  console.log(`Victron BLE Receiver API simulator port ${port}`)
})