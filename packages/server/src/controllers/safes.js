import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import safeCreationService from '../services/safeCreationService'

export const create = wrapAsync(async (req, res, next) => {
  try {
    const { data, gasPrice } = req.body
    assert.string(data, 'Creation data is required')
    assert.string(gasPrice, 'Gas price is required')

    const { success, txHash, errors } = await safeCreationService.create({
      data,
      gasPrice
    })

    res.json({
      success,
      txHash,
      errors
    })
  } catch (err) {
    next(err)
  }
})

export const claimAndCreate = wrapAsync(async (req, res, next) => {
  try {
    const { data, gasPrice } = req.body
    assert.string(data, 'Creation data is required')
    assert.string(gasPrice, 'Gas price is required')

    const {
      success,
      txHash,
      errors
    } = await safeCreationService.claimAndCreate({
      data,
      gasPrice
    })

    res.json({
      success,
      txHash,
      errors
    })
  } catch (err) {
    next(err)
  }
})
