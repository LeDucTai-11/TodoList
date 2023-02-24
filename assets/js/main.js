const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.js-modal-close');
const btnAdd = document.querySelector('.js-header__add');
const modalContainer = document.querySelector('.js-modal-container');
const btnAddSubmit = document.querySelector('.js-add-submit');
const modalInput = document.querySelector('.modal-body-input');
const modalInputChilds = [].slice.call(modalInput.children);
const todoList = document.querySelector('#todo_list');
const doingList = document.querySelector('#doing_list');
const finishList = document.querySelector('#finish_list');

const editModal = document.querySelector('#edit-modal');
const editModalClose = document.querySelector('.js-edit-modal-close');
const btnEditSubmit = document.querySelector('.js-edit-submit');
const editModalContainer = document.querySelector('.js-edit-modal-container');
const editModalInput = document.querySelector('.modal-edit-input');
const editModalInputChilds = [].slice.call(editModalInput.children);
const editModalOption = document.querySelector('.edit-modal-body-option');
const editRadioInput = document.querySelectorAll('.edit-modal-body-option input[type=radio');

const titleQuantities = document.querySelectorAll('.item-title-quantity');

const setDataLocalStorage = () => {
    localStorage.setItem('dataList',JSON.stringify(dataList));
}
// const dataList = [];
const dataList = JSON.parse(localStorage.getItem('dataList'));
window.onload = () => {
    renderView(dataList);
}

// Start : Show and Hide modal
const showModal = (modalItem) => {
    modalItem.classList.add('modal--open');
}

const hideModal = (modalItem) => {
    modalItem.classList.remove('modal--open');
}

const clearModal = (InputList) => {
    InputList.forEach((item) => item.value = '');
}

btnAdd.addEventListener('click', () => {
    showModal(modal);
});
modalClose.addEventListener('click', () => {hideModal(modal)});
modal.addEventListener('click', () => {hideModal(modal)});
modalContainer.addEventListener('click', (e) => {
    e.stopPropagation();
})
// End : Show and Hide modal

// Submit modal
const isValidInput = (arr) => arr.every((item) => item.value !== '');


const ToggleErrBorder = (arr) => {
    arr.forEach((item) => {
        if (item.value == '') {
            item.classList.add('border--red');
        } else {
            item.classList.remove('border--red');
        }
    });
}

const renderItem = (item) =>
    `<div class="item-content">
    <div class="item-content-category">
        <p>${item.category}</p>
        <div class="item-content-action">
            <div data-id=${item.id} class="item-action-edit" onclick="editElement(this);">
                <img src="./assets/img/Edit.png" alt="">
            </div>
            <div data-id=${item.id} class="item-action-delete" onclick="deleteItem(this);">
                <img src="./assets/img/Delete.png" alt="">
            </div>
        </div>
    </div>
    <div class="item-content-title">
        ${item.title}
    </div>
    <div class="item-content-border"></div>
    <div class="item-content-detail">
        <div class="item-content-detail-desc">
            ${item.content}
        </div>
        <div class="item-content-detail-time">
            <i class="fa-regular fa-clock"></i>
            <p>${item.time}</p>
        </div>
    </div>
</div>`;

const renderData = (arr, processID) =>
    arr.filter((item) => item.processID == processID)
        .reduce((res, data) => res + renderItem(data), '');

const renderView = (arr) => {
    todoList.innerHTML = renderData(arr, 1);
    doingList.innerHTML = renderData(arr, 2);
    finishList.innerHTML = renderData(arr, 3);

    titleQuantities.forEach((item,index) => {
        item.innerHTML = arr.filter((x) => x.processID == index + 1).length;
    })
}

btnAddSubmit.addEventListener('click', () => {
    ToggleErrBorder(modalInputChilds);

    if (isValidInput(modalInputChilds)) {
        dataList.push({
            id: Date.now(),
            category: modalInputChilds[0].value,
            title: modalInputChilds[1].value,
            content: modalInputChilds[2].value,
            processID: 1,
            time: Date(Date.now().toString()).slice(0, 15)
        });
        setDataLocalStorage();
        renderView(dataList);
        hideModal(modal);
        clearModal(modalInputChilds);
    }
});

// Delete Item

function deleteItem(element) {
    element.parentElement.parentElement.parentElement.remove();
    dataList.splice(dataList.indexOf((x) => x.id == element.dataset.id), 1);
    setDataLocalStorage();
}

// Edit
editModalClose.addEventListener('click', () => {hideModal(editModal)});
editModal.addEventListener('click', () => {hideModal(editModal)});
editModalContainer.addEventListener('click', (e) => {
    e.stopPropagation();
});

const GUIEdit = (element) => {
    // console.log(dataList.indexOf((x) => x.id == element.id));
    let todoItem = dataList.find((item) => item.id == element.dataset.id);
    editModalInputChilds[0].value = todoItem.category;
    editModalInputChilds[1].value = todoItem.title;
    editModalInputChilds[2].value = todoItem.content;
    editModalOption.children[todoItem.processID-1].children[0].checked = true;
}

const radioCheckedIndex = () => 
    [].slice.call(editRadioInput).findIndex((item) => item.checked);

let elementEdit;

const editElement = (element) => {
    showModal(editModal);
    GUIEdit(element);

    elementEdit = element;
}

btnEditSubmit.addEventListener('click', () => {
    ToggleErrBorder(editModalInputChilds);
    
    if(isValidInput(editModalInputChilds)) {
        let index = dataList.indexOf(dataList.find(x => x.id == elementEdit.dataset.id));
        let obj = {
            id: Number(elementEdit.dataset.id),
            category: editModalInputChilds[0].value,
            title: editModalInputChilds[1].value,
            content: editModalInputChilds[2].value,
            processID: radioCheckedIndex() + 1,
            time: Date(Date.now().toString()).slice(0, 15) 
        };
        console.log(elementEdit.dataset.id);
        console.log(index);
        dataList[index] = obj;
        setDataLocalStorage();
        renderView(dataList);
        hideModal(editModal);
        clearModal(editModalInputChilds);
    }
});



