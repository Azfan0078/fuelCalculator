module.exports = editProcessForm

function editProcessForm(ipcRenderer, fs, path, ) {
    const directory = path.join(__dirname, '../dataBase')
    const fileName = path.join(directory, "saves.json")

    function getData() {

        const saves = JSON.parse(fs.readFileSync(fileName,))
        return saves
    }
    function readAndEditSave() {
        const actualQuilometers = document.getElementById('editActualQuilometers')
        const litersStockeds = document.getElementById('editLitersStockeds')
        const totalValue = document.getElementById('editTotalValue')
        const supplyDate = document.getElementById('editSupplyDate')

        let haveMessage = false

        function getEditingSave(saveID) {
            let save
            getData().saves.forEach((element, i) => {
                if (element.id == saveID) {
                    save = element.id
                } else { '' }
            })
            return save
        }
        function startValues(editingSave) {
            const InitialArraySaves = getData().saves
            const indexOfInitialEditingSave = editingSave - 1
            actualQuilometers.value = InitialArraySaves[indexOfInitialEditingSave].actualQuilometers
            litersStockeds.value = InitialArraySaves[indexOfInitialEditingSave].litersStockeds
            totalValue.value = InitialArraySaves[indexOfInitialEditingSave].totalValue
            supplyDate.value = InitialArraySaves[indexOfInitialEditingSave].supplyDate
        }
        function newContentFunction() {
            const newActualQuilometers = actualQuilometers.value
            const newLitersStockeds = litersStockeds.value
            const newTotalValue = totalValue.value
            const newSupplyDate = supplyDate.value
            return {
                newActualQuilometers,
                newLitersStockeds,
                newTotalValue,
                newSupplyDate
            }
        }
        function buttonListener(saveID) {
            const submitButton = document.getElementById('editButton')
            const deleteButton = document.getElementById('editDeleteButton')
            submitButton.addEventListener('click', () => {
                if (validation()) {
                    try {
                        editSave(saveID)
                    } catch {
                        console.log('Erro ao editar o save')
                    } finally {
                        closeEditSaveWindow()
                    }
                }
            })
            deleteButton.addEventListener('click', () => {
                deleteSaveFunction(saveID)
            })
        }
        function validation() {
            let validated = true

            const message = {
                show() {
                    const form = document.getElementById("editSaveWindowForm")
                    let message
                    if (!haveMessage) {
                        message = document.createElement('div')
                        message.setAttribute('class', 'alert alert-danger mb-0')
                        message.setAttribute('id', "errorMessage")
                        message.innerHTML = 'Erro ao editar os dados, verifique todos os campos'

                        form.insertBefore(message, actualQuilometers)
                        haveMessage = true
                    }
                },
                remove() {
                    const errorMessage = document.getElementById('errorMessage')
                    const dataInputs = document.querySelectorAll('input')
                    dataInputs.forEach((element) => {
                        element.onclick = () => {
                            if (haveMessage) {
                                errorMessage.remove()
                                haveMessage = false
                            }
                        }
                    })
                }
            }

            function validate() {
                if (
                    actualQuilometers.value.length > 9 ||
                    actualQuilometers.value < 0 ||
                    !actualQuilometers.value.length ||

                    litersStockeds.value.length > 9 ||
                    litersStockeds.value < 0 ||
                    !litersStockeds.value.length ||

                    totalValue.value.length > 9 ||
                    totalValue.value < 0 ||
                    !totalValue.value.length ||

                    !supplyDate.value.length

                ) {
                    validated = false
                    message.show()
                }
            }
            validate()
            message.remove()

            return validated
        }
        function editSave(saveID) {

            function editedContent() {
                const newContent = {
                    actualQuilometers: newContentFunction().newActualQuilometers,
                    litersStockeds: newContentFunction().newLitersStockeds,
                    totalValue: newContentFunction().newTotalValue,
                    supplyDate: newContentFunction().newSupplyDate
                }
                const arraySaves = getData().saves
                const indexOfEditingSave = getEditingSave(saveID) - 1
                const actualSave = arraySaves[indexOfEditingSave]

                actualSave.actualQuilometers = newContent.actualQuilometers
                actualSave.litersStockeds = newContent.litersStockeds
                actualSave.totalValue = newContent.totalValue
                actualSave.supplyDate = newContent.supplyDate

                return arraySaves
            }
            const JSONArchive = { saves: editedContent() }
            writeFile(JSONArchive)
        }
        function writeFile(content) {
            fs.writeFile(fileName, JSON.stringify(content), 'utf-8', (err) => {
                if (err) { console.log(`Errou ao salvar o arquivo ${err}`) }
            })
        }
        function closeEditSaveWindow() {
            ipcRenderer.send('closeEditSaveWindow', 'Fechou')
        }
        function deleteSaveFunction(saveID) {
            function confirmationMessage() {
                ipcRenderer.send("confirmationMessage")
                ipcRenderer.on('confirmedMessageReady', (e, data) => {
                    if (data === 'delete') {
                        deleteSave()
                    }
                })
            }
            function deleteSave() {
                const arraySaves = getData().saves
                const indexOfEditingSave = getEditingSave(saveID) - 1
                arraySaves.splice(indexOfEditingSave, 1)
                arraySaves.map((element,i) => {
                    element.id = i + 1
                    return element
                })
                const JSONArchive = {saves: arraySaves}
                writeFile(JSONArchive)
                closeEditSaveWindow()
            }
            confirmationMessage()
        }

        ipcRenderer.on('saveEditingID', (event, data) => {

            const saveID = Number(data)
            const editingSave = getEditingSave(saveID)
            startValues(editingSave)

            buttonListener(saveID)
        })
    }
    readAndEditSave()
}