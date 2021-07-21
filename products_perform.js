
const services = require('./services')


const run = async () => {
  const token = await services.createCredentials();

  const totalProducts = await getTotalElements(token);

  console.log('*'.repeat(45));
  console.log('List all products in sequence')
  console.log('*'.repeat(45));

  console.log(`Total products: ${totalProducts}`);

  const pages = getArrayPages(totalProducts);
  const pageIterators = pages.values();

  console.time('Getting all products for 7 requests');

  await handlePages(token, pageIterators);
};

const getTotalElements = async (token) => {
  const listProducts = await services.listProducts(token, {size: 1});

  return totalProducts = listProducts.page.totalElements;
};

const getArrayPages = totalElements => {
  const maxPages = Math.ceil(totalElements / 1000);

  return [...Array(maxPages).keys()];
};

const handlePages = async(token, pageIterators) => {
  const page = pageIterators.next();

  if (page.done) {
    console.timeEnd('Getting all products for 7 requests');
  } else {
    await fetchPages(token, page.value, pageIterators);
  }
};

const fetchPages = async (token, page, pageIterators) => {
  console.time(`Getting page ${page}`);

  try {
    await services.listProducts(token, {size: 1000, page});
    console.timeEnd(`Getting page ${page}`);
    handlePages(token, pageIterators)
  } catch (error) {
    console.timeEnd(`Getting page ${page}`);
    handlePages(token, pageIterators)
  }
}

const runParallel = async () => {
  const token = await services.createCredentials();

  const totalProducts = await getTotalElements(token);

  console.log('*'.repeat(45));
  console.log('List all products in parallel')
  console.log('*'.repeat(45));

  console.log(`Total products: ${totalProducts}`);

  const pages = getArrayPages(totalProducts);

  console.time(`Getting all products for ${pages.length} requests in parallel`);

  await handlePagesInParallel(token, pages);
};


const handlePagesInParallel = async (token, pages) => {
  const promises = [];

  const pageIterators = pages.values();

  let page = pageIterators.next();

  while (!page.done) {
    promises.push(services.listProducts(token, {size: 1000, page}));
    page = pageIterators.next();
  }

  await Promise.all(promises);

  console.timeEnd(`Getting all products for ${pages.length} requests in parallel`);
};

const start = async () =>  {
  await runParallel();
  await run();
}

start();
