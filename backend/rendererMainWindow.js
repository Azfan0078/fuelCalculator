function renderer() {
    const fs = require('fs')
    const path = require('path')

    function contentLoader() {
        const moment = require("moment")
        const saveDataMenu = require('./Javascripts/saveDataMenu')
        const chargeViewDataMenu = require('./Javascripts/chargeViewDataMenu')
        const createMainPage = require('./Javascripts/createMainPage')
        const { ipcRenderer } = require('electron')

        window.addEventListener("DOMContentLoaded", () => {
            //Carregando pagina via ajax
            const initialPage = './pages/mainPage.html'
            const destiny = '#mainMenu'

            function loadPage(destiny, url) {
                if (!url || !destiny) return
                const element = document.querySelector(destiny)
                fetch(url)
                    .then(answer => answer.text())
                    .then(html => {
                        element.innerHTML = html
                        switch (url) {
                            case './pages/saveDataMenu.html': saveDataMenu(fs, path)
                                break
                            case './pages/viewDataMenu.html': chargeViewDataMenu(fs, path, ipcRenderer,moment)
                                break
                            case './pages/mainPage.html': {
                                createMainPage(fs, path,moment)
                                listen()
                            }
                                break
                        }
                    })
            }
            function listen() {
                document.querySelectorAll('[fc-link]').forEach(link => {
                    const url = link.attributes['fc-link'].value
                    link.onclick = e => {
                        e.preventDefault()
                        loadPage(destiny, url)
                    }
                })
            }
            loadPage(destiny, initialPage)
            listen()
        })
    }
    contentLoader()
}
renderer()



