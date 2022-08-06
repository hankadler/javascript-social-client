const toBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (err) => reject(err);
});

export default toBase64;
