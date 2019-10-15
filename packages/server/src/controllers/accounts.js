import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import accountsService from '../services/accountsService'
import relayerWalletService from '../services/relayerWalletService'
import transactionRelayService from '../services/transactionRelayService'
import authService from '../services/authService'

export const update = wrapAsync(async (req, res, next) => {
  try {
    const { email, deployed } = req.body

    let account = await accountsService.findAccount({
      email,
      chain: relayerWalletService.chain
    })

    if (!account) {
      return next(boom.badRequest('Account does not exist'))
    }

    account = await accountsService.update({
      email,
      chain: relayerWalletService.chain,
      deployed
    })

    const token = await authService.getToken(email)

    res.json({ account, token })
  } catch (err) {
    logger.error(err)
  }
})

export const create = wrapAsync(async (req, res, next) => {
  try {
    const {
      email,
      ens,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonicPhrase,
      owner,
      saltNonce,
      safe,
      linkdropModule,
      recoveryModule,
      createSafeData,
      deployed
    } = req.body

    assert.string(email, 'Email is required')
    assert.string(ens, 'Ens name is required')
    assert.string(passwordHash, 'Password hash is required')
    assert.string(
      passwordDerivedKeyHash,
      'Password derived key hash is required'
    )
    assert.string(
      encryptedEncryptionKey,
      'Encrypted encryption key is required'
    )

    console.log(
      'SHIt',
      await accountsService.findAccount({
        email: null,
        chain: relayerWalletService.chain
      })
    )

    let account = await accountsService.findAccount({
      email,
      chain: relayerWalletService.chain
    })

    if (account) {
      return next(boom.badRequest('Account already exists'))
    }

    account = await accountsService.create({
      email,
      chain: relayerWalletService.chain,
      ens,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonicPhrase,
      owner,
      saltNonce,
      safe,
      linkdropModule,
      recoveryModule,
      createSafeData,
      deployed
    })

    const token = await authService.getToken(email)

    res.json({ account, token })
  } catch (err) {
    next(err)
  }
})

export const login = wrapAsync(async (req, res, next) => {
  try {
    const { email, passwordHash } = req.body

    const account = await accountsService.findAccount({
      email,
      chain: relayerWalletService.chain
    })

    if (!account) {
      return next(boom.badRequest('No account found'))
    }

    if (account.passwordHash !== passwordHash) {
      return next(boom.badRequest('Invalid password'))
    }

    console.log(account.passwordHash)
    console.log(passwordHash)

    const token = await authService.getToken(email)

    return { account, token }
  } catch (err) {
    next(err)
  }
})
