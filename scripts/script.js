var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var inputHandler = function (event) {
    console.log(event);
};
/**
 * Handles the drop event.
 * @param event
 * @returns
 */
var dropHandler = function (event) {
    event.preventDefault();
    var items = __spreadArray([], event.dataTransfer.items, true);
    if (items) {
        // Use DataTransferItemList to access
        items.map(function (item, i) {
            if (item.kind === 'file') {
                var file = item.getAsFile();
                if (!isFileImage(file))
                    return;
                console.log("... file[" + i + "] = " + file.name);
                var reader = new FileReader();
                var img_1 = new Image();
                reader.onload = function (readerEvent) {
                    img_1.onload = function () { return calculateDimensions(img_1); };
                    img_1.src = readerEvent.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        return;
    }
    // Use DataTransfer interface to access
    __spreadArray([], event.dataTransfer.files, true).map(function (file, i) {
        console.log("... file[" + i + "].name = " + file.name);
    });
};
/**
 * Prevents the default drag over event.
 * @param event
 * @returns
 */
var dragOverHandler = function (event) { return event.preventDefault(); };
/**
 * Return boolean whether a file is an image.
 * @param file - the file checked
 * @returns boolean
 */
var isFileImage = function (file) { return file.type.match(/image.*/); };
/**
 * TODO
 * @param dataURI
 * @returns
 */
var dataURItoBlob = function (dataURI) {
    var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
        atob(dataURI.split(',')[1]) :
        unescape(dataURI.split(',')[1]);
    var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var max = bytes.length;
    var ia = new Uint8Array(max);
    for (var i = 0; i < max; i++)
        ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
};
/**
 * TODO
 * @param img
 * @returns
 */
var calculateDimensions = function (img) {
    var MAX_SIZE = 512;
    var width = img.width;
    var height = img.height;
    if (width > height) {
        if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
        }
    }
    else {
        if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
        }
    }
    prepareImageForDownload(img, width, height);
};
var prepareImageForDownload = function (img, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    var dataUrl = canvas.toDataURL('image/png');
    downloadImage(dataUrl);
};
var downloadImage = function (downloadUrl) {
    var anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = 'test.png';
    document.body.appendChild(anchor);
    anchor.click();
};
window.addEventListener('load', function () {
    var dropBox = document.querySelector('.drop_zone');
    var emoji = document.querySelector('#emoji');
    dropBox.addEventListener('dragover', function () {
        emoji.innerHTML = '✔️';
        dropBox.classList.add('on-dragover');
    });
    dropBox.addEventListener('dragleave', function () {
        emoji.innerHTML = '⬇️';
        dropBox.classList.remove('on-dragover');
    });
    dropBox.addEventListener('drop', function () {
        emoji.innerHTML = '⬇️';
        dropBox.classList.remove('on-dragover');
    });
});
