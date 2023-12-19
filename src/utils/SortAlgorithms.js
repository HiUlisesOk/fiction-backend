function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(item => item.Cantidad < pivot.Cantidad);
    const middle = arr.filter(item => item.Cantidad === pivot.Cantidad);
    const right = arr.filter(item => item.Cantidad > pivot.Cantidad);

    const sortedArray = quickSort(right).concat(middle, quickSort(left));

    return sortedArray;
}











module.exports = {
    quickSort,

};


