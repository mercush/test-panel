import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application'

import { ICommandPalette } from '@jupyterlab/apputils'
import { requestAPI } from './handler';

import OmniSearchWidget from './OmniSearchWidget'

const extension: JupyterFrontEndPlugin<void> = {
  id: 'omnisearch',
  autoStart: true,
  optional: [ICommandPalette],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette
  ) => {
    const { commands } = app
    console.log('Jupyterab extension qbraid-server is activated');

    // requestAPI<any>('get_example')
    // .then(data => {
    //   console.log(data);
    // })
    // .catch(reason => {
    //   console.error(
    //     'The qbraid_server server extension appears to be missing'
    //   )
    // })
    var searchOverlayOpen = false

    var omniSearchWidget = new OmniSearchWidget() // could pass in flux, jupyterlab application object, etc as needed. these will become props of our root react component
    omniSearchWidget.id = 'omnisearch-widget'
    omniSearchWidget.title.label = 'Search'
    app.shell.add(omniSearchWidget, 'top') // add it to the frontend shell (still hidden at this point)
    omniSearchWidget.node.style.display = 'none'

    const cmdOpenOmniSearch = 'omnisearch:open' // add open command
    commands.addCommand(cmdOpenOmniSearch, {
      label: 'Search',
      caption: 'Search',
      execute: () => {
        omniSearchWidget.node.style.display = 'block'
        searchOverlayOpen = true
      }
    })
    palette.addItem({
      command: cmdOpenOmniSearch,
      category: 'qBraid Ecosystem',
      args: { origin: 'from the palette' }
    })

    const cmdCloseOmniSearch = 'omnisearch:close'
    commands.addCommand(cmdCloseOmniSearch, {
      label: 'Hide Search',
      caption: 'Hide Search',
      execute: () => {
        omniSearchWidget.node.style.display = 'none'
        searchOverlayOpen = false
      }
    })
    palette.addItem({
      command: cmdCloseOmniSearch,
      category: 'qBraid Ecosystem',
      args: { origin: 'from the palette' }
    })

    var clearPendingTaskId = -1
    var openSearchOverlayPending = false

    document.addEventListener('keydown', event => {
      if (event.isComposing || event.keyCode == 229) { // ignore IME composition and redundant browser opening
        return
      }

      if (event.keyCode === 16 && !searchOverlayOpen) {
        if (!openSearchOverlayPending) { // 1st shift keypress
          openSearchOverlayPending = true
          clearPendingTaskId = window.setTimeout(() => {
            openSearchOverlayPending = false
          }, 300)
          return
        } else { // 2nd shift keypress
          app.commands.execute('omnisearch:open')
        }
      }

      // if any key other than shift is pressed between the two shift presses, the search overlay should not be opened. this block is also reached for 2nd keypress.
      openSearchOverlayPending = false
      if (clearPendingTaskId != -1) {
        clearInterval(clearPendingTaskId)
      }

      // if ESC key is pressed while the search overlay is open, close the search overlay
      if (event.keyCode === 27 && searchOverlayOpen) {
        app.commands.execute('omnisearch:close')
      }
    })
  }
}

export default extension
