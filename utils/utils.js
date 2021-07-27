const getTotalElements = (elements) => {
  return elements.page.totalElements;
}

const getArrayPages = (totalElements, size) => {
  const maxPages = Math.ceil(totalElements / size);

  return [...Array(maxPages).keys()];
};


module.exports = {
  getTotalElements,
  getArrayPages
}
