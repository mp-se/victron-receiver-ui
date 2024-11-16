/*
 * Project specific data objects, should contain configData and statusData as minimum
 *
 * (c) 2023-2024 Magnus Persson
 */

export var configData = {
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
  wifi_scan_ap: true,
  // Push - Generic
  push_timeout: 10,
  push_resend_time: 300, 
  // Push - post
  http_post_target: 'http://post.home.arpa:9090/',
  http_post_header1: 'Authorization: Bearer',
  http_post_header2: '',
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

export var statusData = {
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

// EOF