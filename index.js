const { app, BrowserWindow } = require('electron')
const autoUpdater = require("electron-updater");


let status = 'IDLE'

const initializeAutoUpdater = () => {
  autoUpdater.autoDownload = false

  autoUpdater.on('update-downloaded', () => {
    status = 'DOWNLOADED'

    dialog.showMessageBox(
      {
        message:
          process.platform === 'win32'
            ? i18next.t(
                'PandaNote has been updated.\nRestart your computer to apply changes.'
              )
            : i18next.t(
                'PandaNote has been updated.\nRestart to apply changes.'
              ),
        buttons: [i18next.t('Restart'), i18next.t('Later')]
      },
      button => (button === 0 ? autoUpdater.quitAndInstall() : null)
    )
  })

  autoUpdater.on('update-available', () => {
    if (status === 'IDLE') {
      status = 'DOWNLOADING'
      autoUpdater.downloadUpdate()
    }
  })

  // Check updates each 10 minutes
  setInterval(checkForUpdates, 1000 * 60 * 10)
}

 const checkForUpdates = () => {
  if (status === 'IDLE') autoUpdater.checkForUpdates()
}

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })
  
    win.loadFile('index.html')
  }
  

  app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.whenReady().then(() => {
    createWindow()

    initializeAutoUpdater()
    checkForUpdates()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })