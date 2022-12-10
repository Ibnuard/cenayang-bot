const {fetchJson} = require('../tools/fetch');
const config = require('../config.json');

/**
 * Get Instagram media from URL.
 * @param {string} url
 * @returns {Promise<object>}
 */
const insta = url =>
  new Promise((resolve, reject) => {
    fetchJson(
      `https://api.vhtear.com/instadl?link=${url}&apikey=${config.vhtear}`,
      {
        method: 'GET',
      },
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

/**
 * Get Instagram media from Username.
 * @param {string} username
 * @returns {Promise<object>}
 */
const instaStory = username =>
  new Promise((resolve, reject) => {
    fetchJson(
      `https://api.vhtear.com/igstory?query=${username}&apikey=${config.vhtear}`,
      {
        method: 'GET',
      },
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

/**
 * Get TikTok video from URL.
 * @param {string} url
 * @returns {Promise<object>}
 */
const tik = url =>
  new Promise((resolve, reject) => {
    fetchJson(
      `https://api.vhtear.com/tiktokdl?link=${url}&apikey=${config.vhtear}`,
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

/**
 * Get Facebook video from URL.
 * @param {string} url
 * @returns {Promise<object>}
 */
const fb = url =>
  new Promise((resolve, reject) => {
    fetchJson(`https://api.vhtear.com/fbdl?link=${url}&apikey=${config.vhtear}`)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

/**
 * Get YouTube media from URL.
 * @param {string} url
 * @returns {Promise<object>}
 */
const ytdl = url =>
  new Promise((resolve, reject) => {
    fetchJson(`https://api.vhtear.com/ytdl?link=${url}&apikey=${config.vhtear}`)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

/**
 * Get TikTok video with no WM.
 * @param {string} url
 * @returns {Promise<object>}
 */
const tikNoWm = url =>
  new Promise((resolve, reject) => {
    fetchJson(`https://videfikri.com/api/tiktok/?url=${url}`)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

/**
 * Get Pinterest
 * @param {string} url
 * @returns {Promise<object>}
 */
const pinterest = url =>
  new Promise((resolve, reject) => {
    fetchJson(
      `https://api.vhtear.com/pinterestdl?link=${url}&apikey=${config.vhtear}`,
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

module.exports = {
  fb,
  ytdl,
  tik,
  insta,
  instaStory,
  tikNoWm,
};
