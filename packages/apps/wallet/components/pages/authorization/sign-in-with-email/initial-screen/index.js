import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Input, Button } from 'components/common'
import { validateEmail } from 'helpers'

@actions(({ authorization: { loading } }) => ({ loading }))
@translate('pages.authorization')
class InitialScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  render () {
    const { checkUser, title, loading } = this.props
    const { email } = this.state
    return <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <Input
        className={styles.input}
        value={email}
        onChange={({ value }) => this.setState({ email: String((value || '')).toLowerCase() })}
        placeholder={this.t('titles.email')}
      />
      <Button
        loading={loading}
        disabled={!email || !validateEmail({ email })}
        className={styles.button}
        onClick={_ => checkUser && checkUser({ email })}
      >
        {this.t('buttons.next')}
      </Button>
    </div>
  }
}

export default InitialScreen
