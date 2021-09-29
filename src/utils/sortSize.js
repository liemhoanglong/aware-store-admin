import config from '../constants/config'
export function sortSize(arr) {
    const sizeDefault = config.SIZE;
    return arr.sort((a, b) => (sizeDefault.findIndex(e => e === a) > sizeDefault.findIndex(e => e === b)) ? 1 : -1);
}

export function sortObjectSize(arr) {
    const sizeDefault = config.SIZE;
    return arr.sort((a, b) => (sizeDefault.findIndex(e => e === a.name) > sizeDefault.findIndex(e => e === b.name)) ? 1 : -1);
}