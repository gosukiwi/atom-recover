'use babel'
import crypto from 'crypto'
import path from 'path'
import os from 'os'
import fs from 'fs'

function sha1 (str) {
  return crypto.createHash('sha1').update(str).digest('hex')
}

const TEMP_DIR = path.join(os.tmpdir(), 'atom-recover')

module.exports = class SwapfileManager {
  constructor (subscriptions) {
    subscriptions.add(atom.workspace.observeTextEditors((editor) => {
      this.check(editor)
      subscriptions.add(editor.onDidStopChanging(() => this.generate(editor)))
      subscriptions.add(editor.onDidSave(() => this.delete(editor)))
    }))
  }

  check (editor) {
    const hash = sha1(editor.getPath())
    const swapfile = path.join(TEMP_DIR, hash)
    if (!fs.existsSync(swapfile)) return

    const swapfileLastModified = fs.statSync(swapfile).mtime
    const bufferLastModified = fs.statSync(editor.getPath()).mtime
    if (swapfileLastModified > bufferLastModified) {
      const swapfileText = fs.readFileSync(swapfile).toString()
      if (swapfileText === editor.getText()) return

      editor.setText(swapfileText)
      this.delete(editor)
    }
  }

  generate (editor) {
    const hash = sha1(editor.getPath())
    this.ensureTempDirExists()
    fs.writeFile(path.join(TEMP_DIR, hash), editor.getText(), (err) => {
      if (err) throw err
    })
  }

  delete (editor) {
    const hash = sha1(editor.getPath())
    const swapfile = path.join(TEMP_DIR, hash)
    if (!fs.existsSync(swapfile)) return

    fs.unlink(swapfile, (err) => {
      if (err) throw err
    })
  }

  ensureTempDirExists () {
    if (fs.existsSync(TEMP_DIR)) return
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }
}
