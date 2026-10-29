#!/usr/bin/env node
import { STSClient } from '@aws-sdk/client-sts'
import { generateToken } from '../test/support/grants-config-broker-token.js'
import { config } from '../test/support/config/config.js'

const sts = new STSClient({ region: config.get('aws.region') })

try {
  await generateToken(sts)
} finally {
  sts.destroy()
}
