
module.exports = chargeViewDataMenu

function chargeViewDataMenu(fs, path, ipcRenderer,moment) {
    moment.locale('pt-BR')
    function getData() {
        const directory = path.join(__dirname, "../dataBase")
        const fileName = path.join(directory, "saves.json")
        const saves = JSON.parse(fs.readFileSync(fileName)).saves
        if (!saves) return
        
        const sortedSaves = () => {
            const sortedSaves = saves.sort((a, b) => {
                const dateA = a.supplyDate
                const dateB = b.supplyDate
                if (dateA < dateB) {
                    return -1
                } else {
                    return 1
                }
            })
            return sortedSaves
        }
        const data = sortedSaves().map((element, i, data) => {
            const lastSave = () => {
                let lastSave
                const actualElementIndex = data.indexOf(data[i])

                if (actualElementIndex > 0) {
                    lastSave = data[actualElementIndex - 1]
                } else {
                    lastSave = data[0]
                }
                return lastSave
            }
            function dataContent() {
                const roundedQuilometers = element.actualQuilometers - lastSave().actualQuilometers
                const averageRounded = roundedQuilometers / element.litersStockeds

                const content = {
                    date: `<h2 class='m-2'>Data: ${moment(element.supplyDate).format('DD/MM/YYYY')}</h2>`,
                    actualQuilometers: `<p class='m-2'> Quilometragem atual: ${element.actualQuilometers} Km</p>`,
                    litersStockeds: `<p class='m-2'> Litros Abastecidos: ${element.litersStockeds} L</p>`,
                    totalValue: `<p class='m-2'> Valor total: R$ ${Number((element.totalValue)).toFixed(2)}</p>`,
                    averageRounded: `<p class='m-2'> Média rodada: ${averageRounded.toFixed(2)} Km/L </p >`,
                    pricePerLiter: `<p class='m-2'> Preço por litro : R$ ${(element.totalValue / element.litersStockeds).toFixed(2)} P/L</p>`,
                    id:`<input type="hidden" id="${element.id}">`
                }
                const dataContent = `
                    ${content.date}
                    ${content.actualQuilometers}
                    ${content.litersStockeds}
                    ${content.totalValue}
                    ${content.averageRounded}
                    ${content.pricePerLiter}   
                    ${content.id}                       
                `
                return dataContent
            }
            return dataContent()
        })
        return data
    }
    function createPagination() {
        function notData() {
            const message = document.createElement('h1')
            const savesMenu = document.getElementById('savesMenu')
            message.classList.add('mt-3')
            message.innerHTML = 'Não há dados salvos'
            savesMenu.appendChild(message)
        }
        if (!getData().length ) {
            notData()
            return
        }        
        const viewDataMenu = document.getElementById('viewDataMenu')
        const pagination = document.createElement('ul')
        const paginationClass = 'pagination w-100 d-flex justify-content-center'
        const paginationContent = `
            <li class="page-item disabled" id='first'><a class="page-link" > << First</a></li>
            <li class="page-item disabled" id='previous'><a class="page-link" > < Previous</a></li>
            <li class="page-item" id='next'><a class="page-link" >Next > </a></li>
            <li class="page-item" id='last'><a class="page-link" >Last >> </a></li>
        `
        pagination.setAttribute('class', paginationClass)
        pagination.innerHTML = paginationContent

        viewDataMenu.appendChild(pagination)

    }
    function initPagination() {
        //Não executa se não tiver dados salvos

        if (!getData().length) return
        
        const totalSaves = getData().length
        const savesPerPage = 9

        const paginationState = {
            actualPage: 1,
            savesPerPage,
            totalPages: Math.ceil(totalSaves / savesPerPage)
        }

        const elementsHtml = {
            get(element) {
                return document.querySelector(element)
            }
        }

        const paginationSaves = {

            create(divContent, i) {
                const div = document.createElement('div')
                div.classList.add('myCard', 'm-2')
                div.innerHTML = divContent
                elementsHtml.get('#savesMenu').appendChild(div)
            },
            update() {
                elementsHtml.get('#savesMenu').innerHTML = ''
                const pageIndex = paginationState.actualPage - 1
                const start = pageIndex * paginationState.savesPerPage
                const end = start + paginationState.savesPerPage
                const paginatedItens = getData().slice(start, end)

                paginatedItens.forEach((element, i) => {
                    paginationSaves.create(element, i)
                })
            }
        }
        
        const disableButtons = {

            next() {
                const nextButton = document.getElementById('next')
                const lastButton = document.getElementById('last')
                const prevButton = document.getElementById('previous')
                const firstButton = document.getElementById('first')

                prevButton.classList.remove('disabled')
                firstButton.classList.remove('disabled')

                if (paginationState.actualPage === paginationState.totalPages) {

                    nextButton.classList.add('disabled')
                    lastButton.classList.add('disabled')

                }
            },
            prev() {
                const nextButton = document.getElementById('next')
                const lastButton = document.getElementById('last')
                const prevButton = document.getElementById('previous')
                const firstButton = document.getElementById('first')

                nextButton.classList.remove('disabled')
                lastButton.classList.remove('disabled')

                if (paginationState.actualPage === 1) {

                    prevButton.classList.add("disabled")
                    firstButton.classList.add("disabled")

                }
            }
        }
        const controls = {
            next() {
                paginationState.actualPage++

                const lastPage = paginationState.actualPage > paginationState.totalPages
                if (lastPage) {
                    paginationState.actualPage--
                }
            },
            prev() {
                paginationState.actualPage--

                if (paginationState.actualPage < 1) {
                    paginationState.actualPage++
                }
            },
            goTo(page) {
                if (page < 1) {
                    page = 1
                }
                paginationState.actualPage = page

                if (page > paginationState.totalPages) {
                    paginationState.actualPage = paginationState.totalPages
                }
            },
            createListeners() {

                elementsHtml.get('#first').addEventListener('click', () => {
                    controls.goTo(1)
                    paginationSaves.update()
                    disableButtons.prev()
                    listenSaves()
                })
                elementsHtml.get('#last').addEventListener('click', () => {
                    controls.goTo(paginationState.totalPages)
                    paginationSaves.update()
                    disableButtons.next()
                    listenSaves()
                })
                elementsHtml.get('#next').addEventListener('click', () => {
                    controls.next()
                    paginationSaves.update()
                    disableButtons.next()
                    listenSaves()
                })
                elementsHtml.get('#previous').addEventListener('click', () => {
                    controls.prev()
                    paginationSaves.update()
                    disableButtons.prev()
                    listenSaves()
                })
            }
        }
        paginationSaves.update()
        controls.createListeners()
    }
    function listenSaves() {
        const saves = document.querySelectorAll('.myCard')
        
        saves.forEach((element, i) => {
            const input = element.childNodes[13]
            const id = input.getAttribute('id')
            element.addEventListener('dblclick', () => {
                 ipcRenderer.send('openEditSaveWindow', id)
            })
        })
    }

    createPagination()
    initPagination()
    listenSaves()
}