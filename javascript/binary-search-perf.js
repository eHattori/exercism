function generateRandomArray(size) {
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(Math.floor(Math.random() * size + 1));
  }
  return result;
}


function search(target, data, start = 0, end = data.length - 1) {
  if (start > end) return false;
  const middle = start + parseInt((end - start) / 2);

  if (data[middle] === target) return true;

  if (data[middle] < target) {
    return search(target, data, middle + 1, end);
  } else {
    return search(target, data, start, middle - 1);
  }
}




function otherBinarySearch(target, data) {
  if (data.length === 0) return false;

  const middle = parseInt(data.length / 2);

  if (data[middle] === target) return true;

  if (data[middle] < target) {
    return search(target, data.slice(middle + 1));
  } else {
    return search(target, data.slice(0, middle));
  }
}

const ARRAY_SIZE = 100000000;
const binaryList = generateRandomArray(ARRAY_SIZE);
const target = Math.floor(Math.random() * ARRAY_SIZE + 1);

console.time('time...');
const sortedList = binaryList.sort((a, b) => a - b);
// console.log(target, search(target, sortedList));
console.log(target, otherBinarySearch(target, sortedList));
console.timeEnd('time...');

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
