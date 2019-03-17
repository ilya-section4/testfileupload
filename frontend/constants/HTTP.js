export default {
  //at home
  serverUrl: 'http://192.168.0.102:4000',

  defaultOptions: {
     headers: {
       Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache': 'no-cache',
     },
     credentials: 'include',
   },

   formDataOptions: {
      headers: {
       'Content-Type': 'multipart/form-data',
       'Cache': 'no-cache',
      },
      credentials: 'include',
    },
}
