require('dotenv').config();

const axios = require('axios');

// module.exports = {
//   createCredentials,
//   listProducts,
//   listImages,
//   listVariationImages,
//   listVariationProperties,
//   listVariations
// };


class BeyondApi {

  constructor() { }

  async init() {
    this.token = await this.createCredentials();
  }

  async createCredentials() {
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
      return response.data;
    } catch (error) {
      return Error(error);
    }
  }

  getHeaders () {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token.access_token}`
    }
  }

  async listProducts(options) {
    const params = new URLSearchParams(options);
    const config = {
      method: 'GET',
      url: `${process.env.SHOP_URL}/api/products?${params.toString()}`,
      headers: this.getHeaders()
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      return Error(error);
    }
  }

  async listImages(productId, options) {
    const params = new URLSearchParams(options);
    const config = {
      method: 'GET',
      url: `${process.env.SHOP_URL}/api/products/${productId}/images?${params.toString()}`,
      headers: this.getHeaders()
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      return Error(error);
    }
  }

  async listVariationImages(productId, variationId, options) {
    const params = new URLSearchParams(options);
    const config = {
      method: 'GET',
      url: `${process.env.SHOP_URL}/api/products/${productId}/variations/${variationId}/images?${params.toString()}`,
      headers: this.getHeaders()
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      return Error(error);
    }
  }

  async listVariations(productId, options) {
    const params = new URLSearchParams(options);
    const config = {
      method: 'GET',
      url: `${process.env.SHOP_URL}/api/products/${productId}/variations?${params.toString()}`,
      headers: this.getHeaders()
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      return Error(error);
    }
  }

  async listVariationProperties(productId, options) {
    const params = new URLSearchParams(options);
    const config = {
      method: 'GET',
      url: `${process.env.SHOP_URL}/api/products/${productId}/variation-properties?${params.toString()}`,
      headers: this.getHeaders()
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      return Error(error);
    }
  }
}

module.exports = BeyondApi;
