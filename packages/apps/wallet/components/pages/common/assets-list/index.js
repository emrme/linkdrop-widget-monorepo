import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import variables from 'variables'
import { Icons } from '@linkdrop/ui-kit'
import { AssetBalance, AssetBalanceERC721 } from 'components/common'

@actions(({ user: { ens }, assets: { items } }) => ({
  items,
  ens
}))
@translate('pages.common.assetsList')
class AssetsList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  render () {
    const { items } = this.props
    const { expanded } = this.state
    return <div className={styles.container}>
      <div className={classNames(styles.assets, { [styles.assetsExpanded]: expanded })}>
        <div className={styles.assetsHeader} onClick={_ => this.setState({ expanded: !expanded })}>
          {this.t('titles.digitalAssets')}
          <Icons.PolygonArrow fill={variables.dbBlue} />
        </div>
        <div className={styles.assetsContent}>
          <div className={styles.assetsContentItems}>
            {this.renderAssets({ items })}
          </div>
        </div>
      </div>
    </div>
  }

  renderAssets ({ items }) {
    if ((!items || items.length === 0)) {
      return <div className={styles.note} dangerouslySetInnerHTML={{ __html: this.t('texts.empty') }} />
    }
    const erc20Items = items.filter(item => item.type === 'erc20')
    const erc721Items = items.filter(item => item.type === 'erc721')
    const erc20Assets = erc20Items.map(({
      icon,
      symbol,
      balanceFormatted,
      tokenAddress,
      price
    }) => <AssetBalance
      key={tokenAddress}
      symbol={symbol}
      amount={balanceFormatted}
      price={price}
      icon={icon}
    />)

    const erc721Assets = erc721Items.map(({
      tokenId,
      name,
      tokenAddress: address,
      symbol,
      image
    }) => <AssetBalanceERC721
      key={`${address}_${tokenId}`}
      symbol={symbol}
      icon={image}
      name={name}
      tokenId={tokenId}
    />)

    return <div>
      {erc20Assets}
      {erc721Assets}
    </div>
  }
}

export default AssetsList
