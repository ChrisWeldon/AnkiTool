const fs = require("fs");

const GoogleImages = require('google-images');
const axios = require('axios')
GOOGLE_IMAGE_SEARCH = process.env.GOOGLE_IMAGE_SEARCH; 
CID = process.env.CID;
console.log(`Google: ${GOOGLE_IMAGE_SEARCH}`);
console.log(`CID ${CID}`);

async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((accept, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => accept(filepath));
    });
}



async function getGoogleImage(input, path){

    if(!CID || !GOOGLE_IMAGE_SEARCH){
        throw("Google Images API key not configured!");
        // TODO: Ask at this moment if you want to configure the API key
    }
    
    // NOTE: unsure of the overhead of making an instance each time
    const client = new GoogleImages(CID, GOOGLE_IMAGE_SEARCH);
    
    return client.search(input, {page: 1, safe: "high", size: "medium"})
        .then(async images => {
            /*
            [{
                "url": "http://steveangello.com/boss.jpg",
                "type": "image/jpeg",
                "width": 1024,
                "height": 768,
                "size": 102451,
                "thumbnail": {
                    "url": "http://steveangello.com/thumbnail.jpg",
                    "width": 512,
                    "height": 512
                }
            }]
             */
            let img = images[0];
            let i = 1;
            while(img.type != 'image/jpeg' && i<10){
                img = images[i];
                i++;
            }
            let uri = `${path}tmp.jpg`;
            await downloadImage(img.url, uri);
            return uri;
        })
        .catch(( err ) => {
            console.log(err);
        })
}


module.exports = {
    getGoogleImage
}
