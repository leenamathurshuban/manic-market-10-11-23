// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  AESKey:"cgQtMyWSNfJp7aehHWnzAa0dBDy/NX3iJaOWoJ36PCY=",
  endPoint :"https://api.manicmarket.com/api/v1/",
  // endPoint :"http://35.193.218.152/api/v1/",
  // endPoint :"http://192.168.29.72:8000/api/v1/",
};

export const websocketurl = {
  // url:"ws://192.168.29.72:8000",
  // url:"ws://35.193.218.152",
  url: "wss://api.manicmarket.com",
}
export const imagepath = {
  defalut: "https://api.manicmarket.com/media/default.png",
  url: "https://api.manicmarket.com",
}
export const cloud_sse = {
// url:"ws://192.168.29.72:8000",
streaming:"https://api.manicmarket.com/api/v1/",
url:"https://cloud-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=pk_b2968a4c180949689e743441f3e2eb5a&symbols=",
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
