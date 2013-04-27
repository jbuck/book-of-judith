module.exports = {
  upload: function(req, res) {
    res.send({ url: req.s3Url });
  }
};
