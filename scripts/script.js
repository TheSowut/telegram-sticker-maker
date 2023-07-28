var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var DROP_IMAGE_EMOJI = '⬇️';
var SUCCESS_EMOJI = '✔️';
var inputHandler = function (event) {
    event.preventDefault();
    var files = __spreadArray([], event.srcElement.files, true);
    files.map(function (file) { return prepareReader(file); });
};
/**
 * Handles the drop event.
 * @param event
 * @returns
 */
var dropHandler = function (event) {
    event.preventDefault();
    var items = __spreadArray([], event.dataTransfer.items, true);
    items === null || items === void 0 ? void 0 : items.map(function (item) {
        if (item.kind === 'file')
            prepareReader(item.getAsFile());
    });
};
/**
 * TODO
 * @param file
 * @returns
 */
var prepareReader = function (file) {
    if (!isFileImage(file))
        return;
    var reader = new FileReader();
    var img = new Image();
    reader.onload = function (readerEvent) {
        img.onload = function () { return calculateDimensions(img, file.name); };
        img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
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
var calculateDimensions = function (img, fileName) {
    var MAX_SIZE = 512;
    var width = img.width;
    var height = img.height;
    if (width > height) {
        if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
        }
        return prepareImageForDownload(img, width, height, fileName);
    }
    if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
    }
    prepareImageForDownload(img, width, height, fileName);
};
/**
 * TODO
 * @param img
 * @param width
 * @param height
 */
var prepareImageForDownload = function (img, width, height, fileName) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    var dataUrl = canvas.toDataURL('image/png');
    downloadImage(dataUrl, fileName);
};
/**
 * TODO
 * @param downloadUrl
 */
var downloadImage = function (downloadUrl, fileName) {
    var anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
};
window.addEventListener('load', function () {
    var dropBox = document.querySelector('.drop_zone');
    var emoji = document.querySelector('#emoji');
    dropBox.addEventListener('dragover', function () { return emoji.innerHTML = SUCCESS_EMOJI; });
    dropBox.addEventListener('dragleave', function () { return emoji.innerHTML = DROP_IMAGE_EMOJI; });
    dropBox.addEventListener('drop', function () { return emoji.innerHTML = DROP_IMAGE_EMOJI; });
});
