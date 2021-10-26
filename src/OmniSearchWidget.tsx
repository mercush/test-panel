import React from 'react'

import { ReactWidget } from '@jupyterlab/apputils'

import OmniSearch from './components/OmniSearch'

export default class OmniSearchWidget extends ReactWidget {

  constructor() {
    super()
  }

  render(): JSX.Element {
    return <OmniSearch />
  }
}
