import Vue from 'vue';

if(!Vue.__global_mixin__) {
  Vue.__global_mixin__ = true;
  
  Vue.mixin({
    methods: {
      // Convert an image URL to Image file
      async URLtoImage(url) {
        const response = await fetch(url)
        const data = await response.blob();
        const ext = url.split(".").pop();
        const filename = url.split("/").pop();
        const metadata = { type: `image/${ext}`}
  
        return new File([data], filename, metadata)
      },
      // Convert to UTC
      convertToUTC(date) {
        const table = date.split(',')
        const timezone = table[1].replace(' ', 'T');
        const tableTwo = table[0].split('/');
        const finalDate = tableTwo[2] +"-"+ tableTwo[1] +"-"+ tableTwo[0] + timezone;
  
        return finalDate;
      },
      // Convert date to dd/mm/yyyy
      convertDateHorizontalBar(date) {
        const dateFormatted = new Date(date.seconds * 1000);
        return dateFormatted.getDate() +  '/' +  (dateFormatted.getMonth()+1) + '/' + dateFormatted.getFullYear();
      }
    },
  })
}