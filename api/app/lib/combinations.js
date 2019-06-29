module.exports = (items) => {
  const combinations = [];
  for(let i = 0; i < items.length; i++) {
    for(let j = i + 1; j < items.length; j++) {
      combinations.push([items[i], items[j]])
    }
  }
  return combinations;
};