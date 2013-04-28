var uuid = require("node-uuid");

exports.uploadToS3 = function( s3 ) {
  return function( req, res, next ) {
    var file = req.files.image,
        s3Path = '/' + uuid.v4();

    s3.putFile( file.path, s3Path, {
      'Content-Type': file.type,
      'x-amz-acl': 'public-read'
    }, function( err, data ) {
      if ( err ) {
        next( err );
      }

      req.s3Url = "https://" + s3.endpoint + s3Path;
      next();
    });
  };
};
