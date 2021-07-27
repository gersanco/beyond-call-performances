
require('dotenv').config();
const BeyondApi = require('./services');
const { getTotalElements, getArrayPages } = require('./utils/utils');

const beyondApi = new BeyondApi();
const MAX_SIZE = process.env.SIZE || 20;

const start = async () => {
  try {
    await beyondApi.init();
    const products = await beyondApi.listProducts({size: 1}); // get total products
    const totalProducts = getTotalElements(products);
    const pages = getArrayPages(totalProducts, MAX_SIZE);

    run(pages, totalProducts);
  } catch (err) {
    console.log(err);
  }
}



start();

const run = async (pages, totalProducts) => {
  console.log('*'.repeat(75));
  console.log(`List all products in sequence`)
  console.log('*'.repeat(75));

  console.time(`Getting all products (${totalProducts}) for ${pages.length} requests`);
  const products = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    console.time(`Getting page ${page}`);
    const responses = await beyondApi.listProducts({size: MAX_SIZE, page});
    console.timeEnd(`Getting page ${page}`);
    products.push(...responses._embedded.products);
  }
  const [masterProducts, regularProducts] = filterProducts(products);

  console.group(`Getting all regular products(${regularProducts.length}) images`);
  await getImagesRegular(regularProducts);
  console.groupEnd();

  console.group(`Getting all master products(${masterProducts.length})`);
  await handleMasterProducts(masterProducts);
  console.groupEnd();

  console.timeEnd(`Getting all products (${totalProducts}) for ${pages.length} requests`);
}

const getProducts = (pages) => {
  return pages.map(page => {
    try {
      return beyondApi.listProducts({ size: MAX_SIZE, page: page })
    } catch (error) {
      throw error;
    }
  })
}

const filterProducts = products => {
  const masterProducts = []
  const regularProducts= []

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    product.variationAttributes.length > 0 ? masterProducts.push(product) : regularProducts.push(product)
  }

  return [masterProducts, regularProducts]
}

const getImagesRegular = async regularProds => {
  console.time(`Getting all regular products(${regularProds.length}) images`);
  for (let i = 0; i < regularProds.length; i++) {
    const regularProd = regularProds[i];

    // console.time(`Getting regular product ${i} images`);
    const responseImages = await beyondApi.listImages(regularProd._id, { size: MAX_SIZE });
    // console.timeEnd(`Getting regular product ${i} images`);
  }
  console.timeEnd(`Getting all regular products(${regularProds.length}) images`)

  return true;
}

const handleMasterProducts = async masterProducts => {
  console.time(`Getting all variation products(${masterProducts.length})`);

  console.group('Variation properties')
  await getvariationProperties(masterProducts);
  console.groupEnd();

  console.group('Variations')
  const variations = await getVariations(masterProducts);
  console.groupEnd();

  console.group('Variation images')
  await getVariationImages(variations);
  console.groupEnd()

  console.timeEnd(`Getting all variation products(${masterProducts.length})`);

  return true;
}

const getvariationProperties = async masterProducts => {
  console.time(`Getting all variation properties(${masterProducts.length})`);
  for (let i = 0; i < masterProducts.length; i++) {
    const masterProduct = masterProducts[i];

    // console.time(`Getting variation property for ${i}`);
    const responseVariationProperties = await beyondApi.listVariationProperties(masterProduct._id, { size: MAX_SIZE });
    // console.timeEnd(`Getting variation property for ${i}`);
  }

  console.timeEnd(`Getting all variation properties(${masterProducts.length})`);

  return true;
 }

 const getVariations = async masterProducts => {
  console.time(`Getting all variations(${masterProducts.length})`);
  const variations = [];
  for (let i = 0; i < masterProducts.length; i++) {
    const masterProduct = masterProducts[i];

    // console.time(`Getting variations for ${i}`);
    const responseVariations = await beyondApi.listVariations(masterProduct._id, { size: MAX_SIZE });
    // console.timeEnd(`Getting variations property for ${i}`);
    variations.push({masterId: masterProduct._id, variation: {...responseVariations._embedded}});
  }

  console.timeEnd(`Getting all variations(${masterProducts.length})`);

  return variations;
 }

 const getVariationImages = async variationProducts => {
  console.time(`Getting all variation products(${variationProducts.length}) images`);
  for (let i = 0; i < variationProducts.length; i++) {
    const variationProduct = variationProducts[i];

    // console.time(`Getting variation product ${i} images`);
    const responseImages = await beyondApi.listVariationImages(variationProduct.masterId, variationProduct.variation._id, { size: MAX_SIZE });
    // console.timeEnd(`Getting variation product ${i} images`);
  }
  console.timeEnd(`Getting all variation products(${variationProducts.length}) images`);

  return true;
 }
