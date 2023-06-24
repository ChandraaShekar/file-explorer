const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })

  ipcMain.on('read-files', (event, path) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    // console.log(fs.readdirSync(path))
    // win.webContents.send('files', fs.readdirSync(path))
    let files = {}
    fs.readdirSync(path).forEach(file => {
      files[file] = {}
      files[file].name = file
      files[file].path = path + '\\' + file
      files[file].stats = fs.Stats(path + '\\' + file)
      files[file].isDir = fs.statSync(path + '\\' + file).isDirectory()
    });
    console.log(files)
    win.webContents.send('files', files)
  })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})