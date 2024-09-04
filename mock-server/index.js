/*
 * Project specific mock server
 *
 * (c) 2023-2024 Magnus Persson
 */
import { createRequire } from "module";
import { registerEspFwk } from './espfwk.js'

const require = createRequire(import.meta.url);
const express = require('express')
var cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

registerEspFwk(app)

app.listen(port, () => {
  console.log(`Victron BLE Receiver API simulator port http://localhost:${port}/`)
})