
const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

app.on('ready',function(){
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on(
        'close',
        function () {
            app.quit();
        }        
    )

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);

});

ipcMain.on(
    'item:add',
    function(e,item){
        console.log(item)
        mainWindow.webContents.send('item:add', item);
        addWindow.close();
    }
);


function createAddWindow(){
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:'Add Shopping List Item'
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    addWindow.on('close', function(){
        addWindow = null;
    })
}

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {label: 'Add Item',
                click(){
                    createAddWindow()
                }
            },
            {label: 'Clear Item',

            click(){
                mainWindow.webContents.send('item:clear')
            }
        },
            {label:'Quit',
            accelerator: 'CmdOrCtrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        role: 'window',
        submenu: [
          {role: 'minimize'},
          {role: 'close'}
        ]
    }
];
if (process.platform === 'darwin') {mainMenuTemplate.unshift({})}
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu: [
         {  
             label:'Developer Tools',
            accelerator: 'CmdOrCtrl+I',
            click(item,focusedWindow){
                focusedWindow.toggleDevTools();}
            },
            {
                role: 'reload'
            }
        ]
    });
}
    
