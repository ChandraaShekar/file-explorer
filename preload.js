const { contextBridge, ipcRenderer, BrowserWindow } = require('electron')

let CURRENT_WINDOW = "Desktop"
let CURRENT_PATH = "C:\\Users\\csred\\Desktop"




// on window load read files from desktop


window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('set-title', CURRENT_WINDOW)
    ipcRenderer.send('read-files', CURRENT_PATH)
    document.getElementById('title').innerHTML = CURRENT_WINDOW
});

ipcRenderer.on('files', (event, files) => {
    console.log(files)
    const list = document.getElementById('list')
    for (const file in files) {
        const li = document.createElement('li')
        li.innerHTML = `
        <button class="btn btn-link">
        ${ files[file].isDir ? '<i class="fas fa-folder"></i>' : '<i class="fas fa-file"></i>'}
        ${files[file].name}</button>
        `;
        li.addEventListener('click', () => {
            if (files[file].isDir) {
                CURRENT_WINDOW = files[file].name
                CURRENT_PATH = files[file].path
                ipcRenderer.send('set-title', CURRENT_WINDOW)
                ipcRenderer.send('read-files', CURRENT_PATH)
            }
        })
        list.appendChild(li)
    }

});