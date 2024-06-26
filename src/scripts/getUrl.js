const getUrl = (imgUrl) => {
  let encoded = imgUrl.replace("amp;s", "s");
  let doubleEncoded = encoded.replace("amp;", "");
  let tripleEncoded = doubleEncoded.replace("amp;", "");
  return tripleEncoded;
};

export default getUrl;
