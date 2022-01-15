
module.exports = createMainPage

function createMainPage(fs, path,moment) {
    moment.locale('pt-BR')
    function createPage() {


        const divMainPage = document.getElementById('divMainPage')
        function getData() {
            const organizedSaves = () => {
                const directory = path.join(__dirname, "../dataBase")
                const fileName = path.join(directory, "saves.json")
                const saves = JSON.parse(fs.readFileSync(fileName)).saves
                if (!saves) return

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
            if (!organizedSaves()) return

            const lastSave = organizedSaves()[organizedSaves().length - 1]
            let penultimateSave = organizedSaves()[organizedSaves().length - 2]

            if (organizedSaves().length === 1) {
                penultimateSave = lastSave
            }

            return { lastSave, penultimateSave }
        }
        function notData() {
            const divMainPage = document.getElementById('divMainPage')
            const message = document.createElement('h2')
            message.innerHTML = 'Não há dados salvos'
            divMainPage.appendChild(message)
        }
        if (!getData().lastSave) {
            notData()
            return
        }

        const lastSave = getData().lastSave
        const penultimateSave = getData().penultimateSave

        const createPage = {
            message() {
                const message = document.createElement('h2')
                message.classList.add('text-light', 'mt-2')
                message.innerHTML = 'Ultimo save'
                divMainPage.appendChild(message)
            },
            date() {
                const date = document.createElement('h2')
                date.innerHTML = `Data: ${moment(lastSave.supplyDate).format('DD/MM/YYYY')}`
                divMainPage.appendChild(date)
            },
            actualQuilometers() {
                const actualQuilometers = document.createElement('p')
                actualQuilometers.innerHTML = `Quilometragem atual: ${lastSave.actualQuilometers} Km`
                actualQuilometers.classList.add('mt-3')
                divMainPage.appendChild(actualQuilometers)
            },
            litersStockeds() {
                const litersStockeds = document.createElement('p')
                litersStockeds.innerHTML = `Litros abastecidos: ${lastSave.litersStockeds} L`
                divMainPage.appendChild(litersStockeds)
            },
            totalValue() {
                const totalValue = document.createElement('p')
                totalValue.innerHTML = `Valor total: R$ ${Number(lastSave.totalValue).toFixed(2)}`
                divMainPage.appendChild(totalValue)
            },
            averageRounded() {
                const roundedQuilometers = lastSave.actualQuilometers - penultimateSave.actualQuilometers
                const average = roundedQuilometers / lastSave.litersStockeds
                const averageRound = document.createElement('p')
                averageRound.innerHTML = `Média rodada: ${average.toFixed(2)} Km/L`
                divMainPage.appendChild(averageRound)
            },
            pricePerLiter() {
                const pricePerLiter = document.createElement('p')
                pricePerLiter.innerHTML = `Preço por litro: R$ ${(lastSave.totalValue / lastSave.litersStockeds).toFixed(2)} P/L`
                divMainPage.appendChild(pricePerLiter)
            }
        }
        createPage.message()
        createPage.date()
        createPage.actualQuilometers()
        createPage.litersStockeds()
        createPage.totalValue()
        createPage.averageRounded()
        createPage.pricePerLiter()
    }
    createPage()
}
