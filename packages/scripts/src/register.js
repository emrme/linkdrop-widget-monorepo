import WalletSDK from '../../sdk/src/WalletSDK'
const walletSDK = new WalletSDK({})

const main = async () => {
  console.log(await walletSDK.register('@emailcom', 'password'))
}

main()
