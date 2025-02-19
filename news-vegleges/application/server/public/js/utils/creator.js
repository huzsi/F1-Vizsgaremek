document.addEventListener('DOMContentLoaded', () => {
    // 1. Main title input
const mainTitleInput = document.getElementById('main-title-input');
const previewContent = document.getElementById('preview-content');

mainTitleInput.addEventListener('input', () => {
    let mainTitleElement = document.getElementById('main-title-preview');
    if (!mainTitleElement) {
        mainTitleElement = document.createElement('h2');
        mainTitleElement.id = 'main-title-preview';
        previewContent.prepend(mainTitleElement);
    }
    mainTitleElement.innerText = mainTitleInput.value;
});

// 2. Adding elements based on select option
const addElementBtn = document.getElementById('add-element-btn');
const editorContainer = document.getElementById('editor-container');
const elementSelect = document.getElementById('element-select');

addElementBtn.addEventListener('click', () => {
    const selectedElement = elementSelect.value;

    const elementContainer = document.createElement('div');
    elementContainer.className = 'element-container';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    let element;
    if (selectedElement === 'Paragraph') {
        element = document.createElement('textarea');
        element.placeholder = 'paragraph';
    } else if (selectedElement === 'Image') {
        element = document.createElement('input');
        element.type = 'file';
    } else {
        element = document.createElement('input');
        element.type = 'text';
        element.placeholder = selectedElement;
    }

    inputContainer.appendChild(element);
    elementContainer.appendChild(inputContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete element';
    deleteButton.addEventListener('click', () => {
        elementContainer.remove();
        updatePreview();
    });

    const changeButton = document.createElement('button');
    changeButton.textContent = 'Change element';
    changeButton.addEventListener('click', () => {
        updatePreview();
    });

    buttonsContainer.appendChild(deleteButton);
    buttonsContainer.appendChild(changeButton);

    if (selectedElement !== 'Image') {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        buttonsContainer.appendChild(fileInput);
    }

    elementContainer.appendChild(buttonsContainer);
    editorContainer.appendChild(elementContainer);

    element.addEventListener('input', updatePreview);
    if (selectedElement === 'Image') {
        element.addEventListener('change', updatePreview);
    }

    updatePreview();
});

// 3. Update preview content
function updatePreview() {
    // Ensure Main Title stays at the top
    const mainTitleElement = document.getElementById('main-title-preview');
    previewContent.innerHTML = '';
    if (mainTitleElement) {
        previewContent.appendChild(mainTitleElement);
    }

    const elementContainers = editorContainer.getElementsByClassName('element-container');
    Array.from(elementContainers).forEach(container => {
        const input = container.querySelector('.input-container').firstElementChild;
        let previewElement;
        if (input.tagName === 'TEXTAREA') {
            previewElement = document.createElement('p');
            previewElement.innerHTML = input.value.replace(/\n/g, '<br>'); // Replace newlines with <br> for automatic line breaks
        } else if (input.type === 'file' && input.files[0]) {
            previewElement = document.createElement('img');
            previewElement.src = URL.createObjectURL(input.files[0]);
        } else {
            // Use the element's placeholder as tag name for preview
            const tagName = input.placeholder.replace('Headline', 'h');
            previewElement = document.createElement(tagName);
            previewElement.innerText = input.value;
        }
        previewContent.appendChild(previewElement);
    });
}

// 4. Clear input elements and preview content
const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', () => {
    mainTitleInput.value = '';
    editorContainer.innerHTML = '';
    previewContent.innerHTML = '';
});
});



