import React from 'react'
import { Authorization, Widget } from 'components/pages'
// import './styles'
import { Loading } from '@linkdrop/ui-kit'
import { actions } from 'decorators'
import { ethers } from 'ethers'
import AppRouter from '../router'
import { getHashVariables } from '@linkdrop/commons'
import config from 'app.config.js'

@actions(({ widget: { page, txParams, connected, eventEmitter }, user: { sdk, loading, privateKey, sessionKeyStore, locale } }) => ({
  sdk,
  loading,
  privateKey,
  sessionKeyStore,
  locale,
  // widget
  page,
  txParams,
  connected,
  eventEmitter
}))
class WidgetRouter extends React.Component {
  componentDidMount () {
    const { sdk } = this.props
    if (!sdk) {
      const {
        linkdropMasterAddress
      } = getHashVariables()
      this.actions().user.createSdk({ linkdropMasterAddress })
    }

    let walletAddress = null
    // Methods child is exposing to parent
    const methods = {
      sendTransaction: async (txParams) => {
        this.actions().widget.setTxParams({ txParams })
        this.actions().widget.setPage({ page: 'CONFIRM_TRANSACTION_SCREEN' })
        return this._awaitUserTransactionConfirmation()
      },
      connect: (ensName) => {
        this.actions().widget.setPage({ page: 'CONNECT_SCREEN' })
        return this._awaitUserConnectConfirmation()
      },
      getAccounts: () => {
        if (!walletAddress) {
          const { privateKey, sdk } = this.props
          const owner = new ethers.Wallet(privateKey).address
          walletAddress = sdk.precomputeAddress({ owner })
        }
        return [walletAddress]
      }
    }

    this.actions().widget.connectToDapp({ methods })
  }

  _awaitUserTransactionConfirmation () {
    const { eventEmitter } = this.props
    return new Promise((resolve, reject) => {
      this.actions().widget.show()
      // widgetService.showWidget()

      // wait for user input
      eventEmitter.on('userAction', ({ action, payload }) => {
        this.actions().widget.hide()
        // widgetService.hideWidget()

        // resolve or reject
        if (action === 'confirm') {
          resolve(payload)
        } else { // on close click
          reject(new Error('User rejected action'))
        }

        setTimeout(() => {
          this.actions().widget.setPage({ page: null })
        }, 500)
      })
    })
  }

  _awaitUserConnectConfirmation () {
    const { eventEmitter } = this.props
    return new Promise((resolve, reject) => {
      // wait for user input
      eventEmitter.on('userAction', ({ action, payload }) => {
        // resolve or close modal
        if (action === 'confirm') {
          resolve(payload)
          // setTimeout(() => {
          this.actions().widget.setPage({ page: null })
          this.actions().widget.setConnected({ connected: true })
          // }, 500)

          // hide widget if it's not a claim link
          if (window.location.hash.indexOf('/receive') === -1) {
            this.actions().widget.hide()
          }
        } else { // on close click
          this.actions().widget.hide()
        }
      })
    })
  }

  render () {
    const { sdk, privateKey, sessionKeyStore, page, connected } = this.props
    if (!sdk) { return <Loading /> }
    if (sdk && !sessionKeyStore) { return <Authorization /> }
    if (connected && !page) return <AppRouter />
    if (page === 'CONNECT_SCREEN') {
      if (!privateKey) { return <Loading /> }
      return <Widget.Connect />
    }
    if (page === 'CONFIRM_TRANSACTION_SCREEN') { return <Widget.Confirm /> }
    return <AppRouter />
  }
}

export default WidgetRouter
