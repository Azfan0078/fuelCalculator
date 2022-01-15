
module.exports = saveDataMenu

function saveDataMenu(fs, path ) {
    let haveMessage = false
    function listen() {
        const submitButton = document.getElementById("submitButton")
        submitButton.onclick = () => processForm(fs, path )
    }
    function processForm(fs, path, ) {
        const actualQuilometers = document.getElementById('actualQuilometers')
        const litersStockeds = document.getElementById('litersStockeds')
        const totalValue = document.getElementById('totalValue')
        const supplyDate = document.getElementById('supplyDate')
        validation() ? saveDatas(fs, path) : ''
        function validation() {
            let validated = true

            const message = {
                show() {
                    const form = document.getElementById("saveDataForm")
                    let message

                    if (validated && !haveMessage) {
                        message = document.createElement('div')
                        message.setAttribute('class', 'alert alert-success mb-0')
                        message.setAttribute('id', "errorSucessMessage")
                        message.innerHTML = 'Dados salvos com sucesso'

                        form.insertBefore(message, actualQuilometers)
                        haveMessage = true

                    } else if (!validated && !haveMessage) {
                        message = document.createElement('div')
                        message.setAttribute('class', 'alert alert-danger mb-0')
                        message.setAttribute('id', "errorSucessMessage")
                        message.innerHTML = 'Erro ao salvar os dados, verifique todos os campos'

                        form.insertBefore(message, actualQuilometers)
                        haveMessage = true

                    }
                },
                remove() {
                    const errorSucessMessage = document.getElementById('errorSucessMessage')
                    const dataInputs = document.querySelectorAll('input')
                    dataInputs.forEach((element) => {
                        element.onclick = () => {
                            if (haveMessage) {
                                errorSucessMessage.remove()
                                haveMessage = false
                            }

                        }
                    })
                }
            }

            function validate() {
                if (
                    actualQuilometers.value.length > 9 ||
                    !actualQuilometers.value.length ||
                    actualQuilometers.value < 0 ||

                    litersStockeds.value.length > 9 ||
                    !litersStockeds.value.length ||
                    litersStockeds.value < 0 ||

                    totalValue.value.length > 9 ||
                    !totalValue.value.length ||
                    totalValue.value < 0 ||

                    !supplyDate.value.length
                ) {
                    validated = false
                    message.show()
                } else {
                    message.show()
                }
            }
            validate()
            message.remove()

            return validated
        }
        function saveDatas(fs, path) {
            const directory = path.join(__dirname, "../dataBase")
            const fileName = path.join(directory, "saves.json")


            readAndSaveFile()
            function readAndSaveFile() {
                let mySave
                
                function writeFile(content) {
                    fs.writeFile(fileName, JSON.stringify(content), 'utf-8', (err) => {
                        if (err) { console.log(`Errou ao salvar o arquivo ${err}`) }
                    })
                }
                function saveFirstTime() {
                    const content = { saves: [] }
                    const date = supplyDate.value
                    
                    content.saves.push({
                        id: 1,
                        actualQuilometers: `${actualQuilometers.value}`,
                        litersStockeds: `${litersStockeds.value}`,
                        totalValue: `${totalValue.value}`,
                        supplyDate: `${date}`
                    })
                    writeFile(content)
                }
                function save() {
                    const id = mySave.saves.length + 1
                    const date = supplyDate.value
                    mySave.saves.push({
                        id,
                        actualQuilometers: actualQuilometers.value,
                        litersStockeds: litersStockeds.value,
                        totalValue: totalValue.value,
                        supplyDate: date
                    })
                    writeFile(mySave)
                }
                function saveData() {
                    function resetValues() {
                        actualQuilometers.value = ''
                        litersStockeds.value = ''
                        totalValue.value = ''
                        supplyDate.value = ''
                        actualQuilometers.focus()
                    }
                    fs.readFile(fileName, 'utf-8', (err, data) => {
                        if (err) {
                            console.log(`Ocorreu um erro ao ler o arquivo: ${err}`)
                        } else {
                            mySave = JSON.parse(data)
                            const isEmpty = Object.keys(mySave).length
                            //Verifica se o arquivo de saves está vazio
                            if (!isEmpty) {
                                saveFirstTime()
                                resetValues()
                            } else {
                                save()
                                resetValues()
                            }
                        }
                    })
                }
                saveData()
            }
        }
    }
    listen()
}
