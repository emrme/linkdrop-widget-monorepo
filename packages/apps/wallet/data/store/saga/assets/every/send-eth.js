import { put, select } from 'redux-saga/effects'
import { utils, ethers } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'
import { convertEns } from './helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })

    const { to, amount } = payload
    const chainId = yield select(generator.selectors.chainId)
    let address = to
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const sdk = yield select(generator.selectors.sdk)
    const privateKey = yield select(generator.selectors.privateKey)
    const owner = new ethers.Wallet(privateKey).address
    const wallet = sdk.precomputeAddress({ owner })
    const amountFormatted = utils.parseEther(String(amount).trim())
    if (to.indexOf('.') > -1) {
      address = yield convertEns({ ens: to, provider })
    }
    if (!address) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      return yield put({
        type: 'USER.SET_ERRORS',
        payload: { errors: ['ENS_INVALID'] }
      })
    }

    const params = {
      safe: wallet,
      to: address,
      data: '0x',
      value: amountFormatted.toString(),
      privateKey
    }
    const result = yield sdk.executeTx(params)
    const { success, errors, txHash } = result
    if (success) {
      yield put({
        type: 'TOKENS.SET_TRANSACTION_ID',
        payload: { transactionId: txHash }
      })
      yield put({
        type: 'TOKENS.SET_TRANSACTION_DATA',
        payload: {
          transactionData: {
            value: String(amount.trim()),
            tokenAddress: ethers.constants.AddressZero,
            status: 'loading'
          }
        }
      })
    } else {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      window.alert('Some error occured')
      if (errors.length > 0) {
        console.error(errors[0])
      }
    }
  } catch (e) {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    window.alert('Some error occured')
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  wallet: ({ user: { wallet } }) => wallet,
  privateKey: ({ user: { privateKey } }) => privateKey,
  chainId: ({ user: { chainId } }) => chainId
}
