import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * ({ payload }) {
  try {
    const { code } = payload
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    yield delay(3000)
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
