import { PublicKey } from '@solana/web3.js'
import { getMint } from '@solana/spl-token'

import { connection } from '../config'

const address = new PublicKey('ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82')

async function getTokenDecimals() {
  try {
    const mintInfo = await getMint(connection, address)

    console.log(mintInfo)
  } catch (e) {
    console.error(e)
  }
}

getTokenDecimals()
