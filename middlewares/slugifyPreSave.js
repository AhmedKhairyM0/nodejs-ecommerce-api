const slugify = require("slugify");

module.exports = function (value, doc) {
  doc.slug = slugify(value, {
    lower: true,
    trim: true,
  });
};

// TODO: slugify on update document
