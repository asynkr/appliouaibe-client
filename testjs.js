function fact(n) {
  if (n === 0) {
    return 1;
  }
  else {
    return (n * fact(n - 1));
  }
};

console.log(fact(6));

function applique(f, tab) {
  let new_tab = [];
  for (const element of tab) {
    new_tab.push(f(element));
  }
  return new_tab;
}

console.log(applique(fact, [1, 2, 3, 4, 5, 6]));
console.log(applique(function(n) { return (n + 1); }, [1, 2, 3, 4, 5, 6]));