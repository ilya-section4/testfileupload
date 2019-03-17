var path = require('path'),
  errorHandler = require(path.resolve('./app/controllers/core/errors.server.controller')),
  db = require(path.resolve('./settings/common_files/sequelize')),
  async = require('async'),
  config = require(path.resolve('./settings/settings')),
  aws = require('aws-sdk'),
  multer = require('multer'),
  multerS3 = require('multer-s3');

  const s3 = new aws.S3({
    accessKeyId: "...your AWS Access Key Id",
    secretAccessKey: "...your AWS secret Access Key",
    region: 'us-east-1'
  });

  // Initialize multers3 with our s3 config and other options
  const upload = multer(
    {storage: multerS3({
      s3,
      bucket: "... your AWS Bucket name",
      acl: 'public-read',
      key(req, file, cb) {
        console.log(file)
        cb(null, file.originalname);
      }
    })}
  ).fields([{name: 'photo', maxCount: 1}, {name: 'video', maxCount: 1}]);

  exports.upload = function(req, res) {

      upload(req, res, function(err) {
        if(err) {
          return res.send({message: "Error occurred"})
        }

        if(req.files['photo']){
          req.files['photo'].map((file)=> {
            uploadMedia(file).then((result) => {
              res.send(result)
            }).catch((err) => {
              res.send(err)
            })
          })
        }

        if(req.files['video']) {
          req.files['video'].map((file) => {
            uploadMedia(file).then((result) => {
              res.send(result)
            }).catch((err) => {
              res.send(err)
            })
          })
        }

        if(!req.files) {
          res.status(400).send({message: "No files found."})
        }
      })
  }

  function uploadMedia(file) {
    return new Promise((resolve, reject) => {
      let newFile = file;

      db.Media.create(
        newFile
      ).then(function(media){
        resolve(media);
      }).catch(function(err){
        reject(err);
      })
    })
  }
