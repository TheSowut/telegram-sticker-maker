const DROP_IMAGE_EMOJI = '⬇️';
const SUCCESS_EMOJI = '✔️';

const inputHandler = (event: any) => {
    event.preventDefault();

    const files = [...event.srcElement.files];
    files.map((file: File) => prepareReader(file));
}

/**
 * Handles the drop event.
 * @param event
 * @returns
 */
const dropHandler = (event: any) => {
    event.preventDefault();

    const items = [...event.dataTransfer.items];
    items?.map((item) => {
        if (item.kind === 'file') prepareReader(item.getAsFile());
    });
};

/**
 * TODO
 * @param file
 * @returns
 */
const prepareReader = (file: File) => {
    if (!isFileImage(file)) return;

    const reader = new FileReader();
    const img = new Image();

    reader.onload = (readerEvent: any) => {
        img.onload = () => calculateDimensions(img, file.name);
        img.src = readerEvent!.target!.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Prevents the default drag over event.
 * @param event
 * @returns
 */
const dragOverHandler = (event: any) => event.preventDefault();

/**
 * Return boolean whether a file is an image.
 * @param file - the file checked
 * @returns boolean
 */
const isFileImage = (file: File) => file.type.match(/image.*/);

/**
 * TODO
 * @param dataURI
 * @returns
 */
const dataURItoBlob = (dataURI: string) => {
    const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
        atob(dataURI.split(',')[1]) :
        unescape(dataURI.split(',')[1]);
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
};

/**
 * TODO
 * @param img
 * @returns
 */
const calculateDimensions = (img: HTMLImageElement, fileName: string) => {
    const MAX_SIZE = 512;
    let width = img.width;
    let height = img.height;

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
}

/**
 * TODO
 * @param img
 * @param width
 * @param height
 */
const prepareImageForDownload = (img: HTMLImageElement, width: number, height: number, fileName: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
    const dataUrl: string = canvas.toDataURL('image/png');
    downloadImage(dataUrl, fileName);
}

/**
 * TODO
 * @param downloadUrl
 */
const downloadImage = (downloadUrl: string, fileName: string) => {
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
}

window.addEventListener('load', () => {
    const dropBox: HTMLElement = document.querySelector('.drop_zone')!;
    const emoji = document.querySelector('#emoji');

    dropBox.addEventListener('dragover', () => emoji!.innerHTML = SUCCESS_EMOJI);
    dropBox.addEventListener('dragleave', () => emoji!.innerHTML = DROP_IMAGE_EMOJI);
    dropBox.addEventListener('drop', () => emoji!.innerHTML = DROP_IMAGE_EMOJI);
});
