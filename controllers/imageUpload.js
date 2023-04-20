const { SERVER_URL } = require('../constants/config');

const imageUpload = (req,res)=>{
    const files = req.files;
    console.log("files",files)
    const urls = [];
    files.forEach(element => {
        const arr = `${SERVER_URL}/${element.path.split('/').slice(1).join('/')}`;
        urls.push(arr);
    });
    console.log(urls)
     res.json({urls : urls});
}

module.exports = imageUpload;