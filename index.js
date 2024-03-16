const axios = require('axios');
const fs = require('fs').promises;

// 
//

async function FetchAndDownloadData(date) {
    try {
      const downloadLink = `https://archives.nseindia.com/content/historical/EQUITIES/2024/MAR/NSE_CM_bhavcopy_${date}.csv.zip`
      const response = await axios.get(downloadLink, { responseType: 'arraybuffer' });
      const fileData = Buffer.from(response.data, 'binary');
      await fs.writeFile('file.zip', fileData);
      console.log('File downloaded successfully!');
    } catch (err) {
        console.error(err);
    }
}




function ExtractFile(){
    const AdmZip = require('adm-zip');


    const extractPath = './extracted_files'; // Adjust the extraction path as needed
    
    const zip = new AdmZip('file.zip');
    
    zip.extractAllTo(extractPath, true); // Set true to overwrite existing files
    
    console.log('Files extracted successfully!');``
}




async function  CsvToJson(date){
    const csvFilePath=`extracted_files/NSE_CM_bhavcopy_${date}.csv`
    const csv=require('csvtojson')
    const jsonArray= await csv().fromFile(csvFilePath);

    return jsonArray
 

}

async function getNSEStockData(date){


    await FetchAndDownloadData(date);
     ExtractFile();

    let jsonData = await CsvToJson(date)

    
    fs.unlink('file.zip', (err) => {
        if (err) {
          // Handle specific error if any
          if (err.code === 'ENOENT') {
            console.error('File does not exist.');
          } else {
            throw err;
          }
        } else {
          console.log('File deleted!');
        }
      });

      fs.unlink(`extracted_files/NSE_CM_bhavcopy_${date}.csv`, (err) => {
        if (err) {
          // Handle specific error if any
          if (err.code === 'ENOENT') {
            console.error('File does not exist.');
          } else {
            throw err;
          }
        } else {
          console.log('File deleted!');
        }
      });

        return jsonData;
    };
   

getNSEStockData('14032024').then(data => {
    console.log(data);
    process.exit(0);
}).catch(e=> {
    console.error(e);
    process.exit(1);
});


 
module.exports = getNSEStockData;