import { put, select } from 'redux-saga/effects'
import { defineError } from 'helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'AUTHORIZATION.SET_ERRORS', payload: { errors: [] } })
    const { email, password } = payload
    const chainId = yield select(generator.selectors.chainId)
    const sdk = yield select(generator.selectors.sdk)
    console.log('starting..')
    const { success, data: requestData } = yield sdk.login(email, password)
    console.log('stopped..')
    if (success) {
      const { privateKey, sessionKeyStore } = requestData
      yield put({ type: '*USER.SET_USER_DATA', payload: { privateKey, email, sessionKeyStore, chainId } })
      yield put({ type: 'AUTHORIZATION.SET_SCREEN', payload: { screen: 'success' } })
    }
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    const { response: { data: { message = '' } = {} } = {} } = error
    if (message) {
      yield put({ type: 'AUTHORIZATION.SET_ERRORS', payload: { errors: [defineError({ error: message })] } })
    }
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  sdk: ({ user: { sdk } }) => sdk
}
