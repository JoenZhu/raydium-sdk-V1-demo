import assert from 'assert'

import {
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  Percent,
  Token,
  TOKEN_PROGRAM_ID,
  TokenAmount,
} from '@raydium-io/raydium-sdk'
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

import { connection, DEFAULT_TOKEN, makeTxVersion, wallet } from '../config'
import { formatAmmKeysById } from './formatAmmKeysById'
import { buildAndSendTx, getWalletTokenAccount } from './util'

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  outputToken: Token
  targetPool: string
  inputTokenAmount: TokenAmount
  slippage: Percent
  // walletTokenAccounts: WalletTokenAccounts
  // wallet: Keypair
}

async function swapOnlyAmm(input: TestTxInputInfo) {
  // -------- pre-action: get pool info --------
  const targetPoolInfo = await formatAmmKeysById(input.targetPool)
  assert(targetPoolInfo, 'cannot find the target pool')
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys

  // -------- step 1: coumpute amount out --------
  const exchange = Liquidity.computeAmountOut({
    poolKeys: poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: input.inputTokenAmount,
    currencyOut: input.outputToken,
    slippage: input.slippage,
  })

  console.log(exchange)

  // -------- step 2: create instructions by SDK function --------
  // const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
  //   connection,
  //   poolKeys,
  //   userKeys: {
  //     tokenAccounts: input.walletTokenAccounts,
  //     owner: input.wallet.publicKey,
  //   },
  //   amountIn: input.inputTokenAmount,
  //   amountOut: minAmountOut,
  //   fixedSide: 'in',
  //   makeTxVersion,
  // })

  // console.log('amountOut:', amountOut.toFixed(), '  minAmountOut: ', minAmountOut.toFixed())

  // return { txids: await buildAndSendTx(innerTransactions) }
}

async function howToUse() {
  const inputToken = DEFAULT_TOKEN.WSOL // USDC
  const outputToken = new Token(TOKEN_PROGRAM_ID, new PublicKey('ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82'), 6)
  const targetPool = 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82' // USDC-RAY pool
  const inputTokenAmount = new TokenAmount(inputToken, 1 * LAMPORTS_PER_SOL)
  const slippage = new Percent(1, 100)
  // const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

  swapOnlyAmm({
    outputToken,
    targetPool,
    inputTokenAmount,
    slippage,
    // walletTokenAccounts,
    // wallet: wallet,
  })
  // .then(({ txids }) => {
  //   /** continue with txids */
  //   console.log('txids', txids)
  // })
}

howToUse()
