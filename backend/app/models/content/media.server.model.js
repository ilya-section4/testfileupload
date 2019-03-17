'use strict';

module.exports = function(sequelize, DataTypes) {

  var Media = sequelize.define('Media', {
    // location
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // fieldname
    fieldname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //size
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    //bucket
    bucket: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //key
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //contentType
    contentType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //mimetype
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //etag
    etag: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }
);

  return Media;
};
