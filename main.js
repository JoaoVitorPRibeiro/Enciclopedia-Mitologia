'use strict'

const openModal = () => document.getElementById("modal")
    .classList.add('active');

const closeModal = () => {
    clearFields()
    document.getElementById("modal").classList.remove('active')
}


/*const tempCriatura = {
    nome: "Poseidon",
    descrição: "Deus dos mares",
    mitologia: "Grega",
    tipo: "Deus"
}
*/

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_criatura')) ?? []
const setLocalStorage = (dbCriatura) => localStorage.setItem("db_criatura", JSON.stringify(dbCriatura))

//CRUD - CREATE READ UPDATE DELETE

//DELETE
const deleteCriatura = (index) => {
    const dbCriatura = readCriatura()
    dbCriatura.splice(index, 1)
    setLocalStorage(dbCriatura)
}

//UPDATE
const updateCriatura = (index, criatura) => {
    const dbCriatura = readCriatura()
    dbCriatura[index] = criatura
    setLocalStorage(dbCriatura)
}

//READ
const readCriatura = () => getLocalStorage()

//CREATE
const createCriatura = (criatura) => {
    const dbCriatura = getLocalStorage()
    dbCriatura.push (criatura)
    setLocalStorage(dbCriatura)
}

const isValidFields = () => {
    return document.getElementById("form").reportValidity()
}

//Interação com o Layout

const clearFields = () => {
    const fields = document.querySelectorAll(".modal-field")
    fields.forEach(field => field.value = "")
}

const saveCriatura = () => {
    if (isValidFields()) {
        const criatura = {
            nome: document.getElementById("nome").value , 
            descrição: document.getElementById("descrição").value, 
            mitologia: document.getElementById("mitologia").value, 
            tipo: document.getElementById("tipo").value
        }
        const index = document.getElementById("nome").dataset.index
        if (index == "new") {
            createCriatura(criatura)
            updateTable()
            closeModal()
        } else {
            updateCriatura(index, criatura)
            updateTable()
            closeModal()
        }

    }
}

const createRow = (criatura, index) => {
    const newRow = document.createElement("tr")
    newRow.innerHTML = `
    <td>${criatura.nome}</td>
    <td>${criatura.descrição}</td>
    <td>${criatura.mitologia}</td>
    <td>${criatura.tipo}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}" >Editar</button>
        <button type="button" class="button red" id="delete-${index}" >Excluir</button>
    </td>
    `
    document.querySelector("#tableCriatura>tbody").appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll("#tableCriatura>tbody tr")
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable =() => {
    const dbCriatura = readCriatura()
    clearTable()
    dbCriatura.forEach(createRow)
}

const fillFields = (criatura) => {
    document.getElementById("nome").value = criatura.nome
    document.getElementById("descrição").value = criatura.descrição
    document.getElementById("mitologia").value = criatura.mitologia
    document.getElementById("tipo").value = criatura.tipo
    document.getElementById("nome").dataset.index = criatura.index
}

const editCriatura = (index) => {
    const criatura = readCriatura()[index]
    criatura.index = index
    fillFields(criatura)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == "button") {

        const [action, index] = event.target.id.split("-")

        if (action == "edit") {
            editCriatura(index)
        } else {
            const criatura = readCriatura()[index]
            const response = confirm(`Deseja realmente excluir a criatura ${criatura.nome}`)
            if (response) {
                deleteCriatura(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos  
document.getElementById("cadastrarCriatura")
    .addEventListener('click', openModal)

document.getElementById("modalClose")  
    .addEventListener('click', closeModal)

document.getElementById("salvar")
    .addEventListener("click", saveCriatura)

document.querySelector("#tableCriatura>tbody")
    .addEventListener("click", editDelete)