export async function importBoard() {
    try {
        const fileList = await getBoardFileList();
        
        const selectedFile = await showImportDialog(fileList);
        if (!selectedFile) {
            return null; // Cancelled
        }

        let fileContent;
        let fileName;

        if (selectedFile.type === 'file') {
            // Własny plik
            fileContent = await readFileContent(selectedFile.file);
            fileName = selectedFile.file.name;
        } else {
            // Plik gotowy z listy
            const fileResponse = await fetch(`/boards/${selectedFile.filename}`);
            if (!fileResponse.ok) {
                throw new Error(`Failed to load board file: ${selectedFile.filename}`);
            }
            
            fileContent = await fileResponse.text();
            fileName = selectedFile.filename;
        }

        return parseBoardFile(fileContent, fileName);
    } catch (error) {
        console.error('Error importing board:', error);
        throw error;
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}


async function getBoardFileList() {
    // Nie czytam plików w folderze
	// Zwracam statyczną listę plików gotowych
    return [
        'Inst_1_7-16_5_80_1.txt',
        'Inst_2_7-10_5-50_1.txt', 
        'Inst_3_5-7_4-24_1.txt',
        'Inst_4_5-4_5-15_1.txt'
    ];
}

// Wygerowany ładny dialog
async function showImportDialog(fileList) {
    return new Promise((resolve) => {
        // Create modal dialog
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 70vh;
            overflow-y: auto;
        `;

        dialog.innerHTML = `
            <h3>Import Board</h3>
            <p>Select a file from public/boards/ or upload your own:</p>
            
            <div style="margin: 15px 0;">
                <h4>Available files:</h4>
                <div id="fileList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                    ${fileList.map((file, index) => `
                        <div class="file-option" data-filename="${file}" style="padding: 5px; cursor: pointer; border-bottom: 1px solid #eee;" data-index="${index}">
                            ${index + 1}. ${file}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin: 15px 0;">
                <h4>Or upload custom file:</h4>
                <input type="file" id="fileInput" accept=".txt" style="width: 100%; margin: 10px 0;">
            </div>
            
            <div style="margin-top: 20px; text-align: right;">
                <button id="cancelBtn" style="margin-right: 10px;">Cancel</button>
                <button id="uploadBtn" disabled>Upload Selected</button>
            </div>
        `;

        modal.appendChild(dialog);
        document.body.appendChild(modal);

        let selectedFile = null;
        let selectedType = null;

        // File selection from list
        const fileOptions = dialog.querySelectorAll('.file-option');
        fileOptions.forEach(option => {
            option.addEventListener('click', () => {
                fileOptions.forEach(opt => opt.style.background = '');
                option.style.background = '#e0e0e0';
                selectedFile = option.dataset.filename;
                selectedType = 'public';
                dialog.querySelector('#uploadBtn').disabled = false;
            });
        });

        // File upload
        const fileInput = dialog.querySelector('#fileInput');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedFile = file;
                selectedType = 'file';
                fileOptions.forEach(opt => opt.style.background = '');
                dialog.querySelector('#uploadBtn').disabled = false;
            }
        });

        // Buttons
        dialog.querySelector('#uploadBtn').addEventListener('click', () => {
            if (selectedFile) {
                if (selectedType === 'public') {
                    resolve({ type: 'public', filename: selectedFile });
                } else {
                    resolve({ type: 'file', file: selectedFile });
                }
            }
            cleanup();
        });

        dialog.querySelector('#cancelBtn').addEventListener('click', () => {
            resolve(null);
            cleanup();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                resolve(null);
                cleanup();
            }
        });

        function cleanup() {
            document.body.removeChild(modal);
        }
    });
}


function parseBoardFile(content, filename) {
    const params = parseFileName(filename);

    const lines = content.trim().split('\n');
    const matrix = lines.map(line => 
        line.trim()
            .split(/\s+/) 
            .map(num => parseInt(num))
    );

    const expectedRows = params.rows;
    const expectedCols = params.cols;
    
    if (matrix.length !== expectedRows) {
        throw new Error(`Expected ${expectedRows} rows, got ${matrix.length}`);
    }
    
    if (matrix[0].length !== expectedCols) {
        throw new Error(`Expected ${expectedCols} columns, got ${matrix[0].length}`);
    }

    const rods = transposeMatrix(matrix);
    
    return rods.map(rod => 
        rod
            .filter(color => color !== 0) 
            .map(color => mapFileColorToGameColor(color)) 
            .reverse() 
    );
}

function parseFileName(filename) {
    // Inst_{number}_{cols}-{rows}_{colors}_{balls}_{inst_variant}.txt
    const match = filename.match(/Inst_(\d+)_(\d+)-(\d+)_(\d+)[_-](\d+)_(\d+)\.txt/);
    
    if (!match) {
        console.error(`Failed to parse filename: ${filename}`);
        throw new Error(`Invalid filename format: ${filename}. Expected format: Inst_{variant}_{cols}-{rows}_{colors}_{balls}_{seed}.txt`);
    }

    const params = {
        variant: parseInt(match[1]),
        cols: parseInt(match[2]),
        rows: parseInt(match[3]),
        colors: parseInt(match[4]),
        balls: parseInt(match[5]),
        seed: parseInt(match[6])
    };

    console.log(`Parsed filename ${filename}:`, params);
    return params;
}


function transposeMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    const transposed = Array(cols).fill(null).map(() => Array(rows));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            transposed[j][i] = matrix[i][j];
        }
    }
    
    return transposed;
}

// Mapuje kolory, żeby zgadzały się z instrukcji z tymi w colorMap
function mapFileColorToGameColor(fileColor) {
    const colorMapping = {
        1: 8,  
        2: 3,  
        3: 6,  
        4: 2,  
        5: 10, 
        6: 9, 
        7: 1,  
        8: 5,  
        9: 7  
    };
    
    const gameColor = colorMapping[fileColor];
    if (gameColor === undefined) {
        throw new Error(`Unknown color code: ${fileColor}`);
    }
    
    return gameColor;
}