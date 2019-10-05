import path from 'path'
import csvToJson from 'csvtojson'
import queryString from 'query-string'
import WalletSDK from '../../sdk/src'

export const getUrlParams = async (type, i) => {
  const csvFilePath = path.resolve(__dirname, `../output/linkdrop_${type}.csv`)
  const jsonArray = await csvToJson().fromFile(csvFilePath)
  const rawUrl = jsonArray[i].url.replace('#', '')
  const parsedUrl = await queryString.extract(rawUrl)
  const parsed = await queryString.parse(parsedUrl)
  return parsed
}

const walletSDK = new WalletSDK({})

const main = async () => {
  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId
  } = await getUrlParams('eth', 0)

  const ensName = Math.random()
    .toString(36)
    .substring(2, 15)

  const saltNonce = Math.floor(Math.random() * 30000)
  console.log('ensName: ', ensName)
  console.log('saltNonce: ', saltNonce)

  const {
    safe,
    linkdropModule,
    recoveryModule,
    success,
    txHash,
    creationCosts,
    errors
  } = await walletSDK.claimAndCreate({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId,
    owner: '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A',
    ensName,
    saltNonce,
    gasPrice: 4000000000 // 4 gwei
  })

  console.log({
    safe,
    linkdropModule,
    recoveryModule,
    success,
    txHash,
    creationCosts: creationCosts.toString(),
    errors
  })
}
main()
