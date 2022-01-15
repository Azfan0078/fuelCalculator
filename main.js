const { app, BrowserWindow, ipcMain, ipcRenderer, webContents, Tray} = require('electron')
const path = require('path')
const { addListener } = require('process')
//Electron config
function initApplication() {
  let main
  
  function mainFunction() {
    main = new BrowserWindow({
      width: 800,
      height: 600,
      center: true,
      minHeight:1600,
      minWidth:900,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        preload: path.join(app.getAppPath(), "/backend", "rendererMainWindow.js")
      }
    })
    main.loadFile('./build/index.html')
  }
  app.whenReady().then(() => {
    const appIcon = new Tray(__dirname + '/build/icons/favicon.ico')
    console.log(appIcon)
    mainFunction()
    main.maximize()
  })

  function listenRenderers() {
    //Janela de edição de dados
    function editSaveWindowFunction() {
      let editSaveWindow
      ipcMain.on('openEditSaveWindow', (event, data) => {

        app.whenReady().then(() => {
          editSaveWindow = new BrowserWindow({
            width: 1000,
            height: 760,
            parent: main,
            modal: true,
            resizable: false,
            movable: false,
            autoHideMenuBar: true,
            webPreferences: {
              preload: path.join(__dirname, 'preload.js'),
              preload: path.join(app.getAppPath(), "/backend", "rendererEditSaveWindow.js")
            }
          })
          editSaveWindow.loadFile('./build/pages/editSaveWindow.html')
          editSaveWindow.webContents.send('saveEditingID', data)
        })
      })
      ipcMain.on('closeEditSaveWindow', () => {
        editSaveWindow.close()
        main.close()
        mainFunction()
        main.maximize()
      })
      let confirmationMessageWindow
      ipcMain.on('confirmationMessage', () => {
          confirmationMessageWindow = new BrowserWindow({
            height:280,
            width:350,
            parent:editSaveWindow,
            modal:true,
            frame:false,
            transparent:true,
            webPreferences: {
              preload: path.join(__dirname, 'preload.js'),
              preload: path.join(app.getAppPath(), "/backend", "rendererConfirmationMessage.js")
            }
          })
          confirmationMessageWindow.loadFile('./build/pages/confirmationMessage.html')
      })
      ipcMain.on('rendererConfirmationMessageReady',(e,data) =>{
        confirmationMessageWindow.close()
        editSaveWindow.webContents.send('confirmedMessageReady',data)
      })
    }
    editSaveWindowFunction()
  }
  listenRenderers()
}

initApplication()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
