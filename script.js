const uploadInput = document.getElementById("file_upload");
const canvasDiv = document.getElementById("canvas_div");
const canvas = document.getElementById("ppm_canvas");
const error = document.getElementById("error");
const context = canvas.getContext("2d");
let width = 255;
let height = 255;

uploadInput.addEventListener("change", () => {
    const file = uploadInput.files[0];
    if (!file) {
        error.innerText = "Failed to read file";
        return;
    }

    if (!file.name.endsWith(".ppm")) {
        error.innerText = "Not a .ppm file";
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const content = reader.result.trim();
        const parsedWords = parseFile(content);
        const valid = validatePPMFile(parsedWords);
        if(valid) {
            clearCanvas();
            drawCanvas(parsedWords);
        }
    }
    reader.readAsText(file);
})

function parseFile(content) {
    let parsedWords = [];

    let i = 0;
    while (i < content.length) {
        let line = "";
        while (i < content.length &&
            (content[i] !== '\n' && content[i] !== '#' && content[i] !== '\r')) {
            line += content[i];
            i++;
        }
        parsedWords = parsedWords.concat(line.trim().split(' '));
        if(i < content.length && content[i] === '#'){
            while(i < content.length && content[i] !== '\n'){
                i++;
            }
        }
        while (i < content.length && (content[i] === '\n' || content[i] === '\r')) {
            i++;
        }
    }
    console.log(parsedWords);
    
    return parsedWords;
}

function validatePPMFile(parsedWords) {
    if (parsedWords[0] !== "P3") {
        error.innerText = "PPM file format is invalid";
        return false;
    }
    width = parseInt(parsedWords[1]);
    if (isNaN(width)) {
        error.innerText = "Failed to parse width";
        return false;
    }
    height = parseInt(parsedWords[2]);
    if (isNaN(height)) {
        error.innerText = "Failed to parse height";
        return false;
    }
    if (parsedWords[3] !== "255") {
        error.innerText = "Max color value must be 255";
        return false;
    }
    if(parsedWords.length !== 4 + width * height * 3){
        error.innerText = "PPM file format is invalid";
        return false;
    }
    return true;
}

function drawCanvas(parsedWords) {
    const width = 255;
    const height = 255;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    if (context) {
        const imgData = context.createImageData(width, height);
        const data = imgData.data;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let index = 4 * (x + y * imgData.width);
                data[index] = x;
                data[index + 1] = y;
                data[index + 2] = 0;
                data[index + 3] = 255;
            }
        }
        context.putImageData(imgData, 0, 0);
    }
}

function clearCanvas() {
    context.putImageData(context.createImageData(width, height), 0, 0);
}