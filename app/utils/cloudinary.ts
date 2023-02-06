const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dbpm7bjks/image/fetch';
const CLOUDINARY_SMALL_URL = `${CLOUDINARY_BASE_URL}/w_360,h_167,f_auto,q_auto/`;
const CLOUDINARY_LARGE_URL = `${CLOUDINARY_BASE_URL}/w_640,h_298,f_auto,q_auto/`;

export function getCloudinaryUrl(url: string, size: 'large' | 'small') {
  return size === 'large'
    ? CLOUDINARY_LARGE_URL + url
    : CLOUDINARY_SMALL_URL + url;
}
