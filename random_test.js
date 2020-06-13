// VERIFY EQUAL DISTRIBUTION OF RESULTS 
// FROM RANDOM DICE FUNCTION

function randbetween(min, max){
  // get random number between two numbers
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Compute array of random numbers
y = [];
for (i=0; i<=100000; i++){
  y.push(randbetween(1,6));
}

// Calculate mean of array
const sum = y.reduce((a, b) => a + b, 0);
const avg = (sum / y.length) || 0;

// Calculate frequency of items in array
const aCount = new Map([...new Set(y)].map(
    b => [b, y.filter(a => a === b).length]
));

aCount
