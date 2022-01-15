const { ipcRenderer } = require("electron")

function rendererConfimationMessage() {
    window.addEventListener('DOMContentLoaded', () => {
        const deleteButton = document.getElementById('deleteButton')
        const cancelButton = document.getElementById('cancelButton')
        
        deleteButton.addEventListener('click', () => {
            ipcRenderer.send('rendererConfirmationMessageReady', 'delete')
        })
        cancelButton.addEventListener('click', () => {
            ipcRenderer.send('rendererConfirmationMessageReady', 'cancel')
        })
    })

}
rendererConfimationMessage()
