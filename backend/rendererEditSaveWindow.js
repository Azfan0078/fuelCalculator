function rendererEditSaveWindow() {
    const { ipcRenderer } = require("electron")
    const fs = require('fs')
    const path = require('path')
    const editProcessForm = require('./Javascripts/editProcessForm.js')

    function windowListen() {
        window.addEventListener('DOMContentLoaded', () => {
            editProcessForm(ipcRenderer,fs,path)
        })
    }
    windowListen()
}
rendererEditSaveWindow()

