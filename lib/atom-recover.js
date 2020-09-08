'use babel'
import { CompositeDisposable } from 'atom'
import SwapfileManager from './swapfile-manager'

export default {
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    this.manager = new SwapfileManager(this.subscriptions)
  },

  deactivate () {
    this.subscriptions.dispose()
  }
}
