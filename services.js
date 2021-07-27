require('dotenv').config();

const axios = require('axios');

const createCredentials = async () => {
  const buff = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'ascii');
  const config = {
    method: 'post',
    url: `${process.env.SHOP_URL}/api/oauth/token?grant_type=client_credentials`,
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Basic ${buff.toString('base64')}`
    }
  };

  try {
    const response = await axios(config);
    return response.data.access_token;
  } catch (error) {
    return Error(error);
  }
}

const listProducts = async (token, options) => {
  const params = new URLSearchParams(options);
  const config = {
    method: 'GET',
    url: `${process.env.SHOP_URL}/api/products?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return Error(error);
  }
}

const listImages = async (token, productId, options) => {
  const params = new URLSearchParams(options);
  const config = {
    method: 'GET',
    url: `${process.env.SHOP_URL}/api/products/${productId}/images?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return Error(error);
  }
}

const listVariationImages = async (token, productId, variationId, options) => {
  const params = new URLSearchParams(options);
  const config = {
    method: 'GET',
    url: `${process.env.SHOP_URL}/api/products/${productId}/variations/${variationId}/images?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return Error(error);
  }
}

const listVariations = async (token, productId, options) => {
  const params = new URLSearchParams(options);
  const config = {
    method: 'GET',
    url: `${process.env.SHOP_URL}/api/products/${productId}/variations?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return Error(error);
  }
}

const listVariationProperties = async (token, productId, options) => {
  const params = new URLSearchParams(options);
  const config = {
    method: 'GET',
    url: `${process.env.SHOP_URL}/api/products/${productId}/variation-properties?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return Error(error);
  }
}

module.exports = {
  createCredentials,
  listProducts,
  listImages,
  listVariationImages,
  listVariationProperties,
  listVariations
};
