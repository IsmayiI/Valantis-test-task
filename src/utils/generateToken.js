// Функция генерации токена
function generateToken() {
   const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
   const authString = `Valantis_${timestamp}`;

   const md5Hash = md5(authString);

   return md5Hash;
}

export default generateToken