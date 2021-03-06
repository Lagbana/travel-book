const bcrypt = require('bcryptjs')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [6] }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [6] }
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phonenumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      longitude: {
        type: DataTypes.FLOAT,
        defaultValue: null
      },
      latitude: {
        type: DataTypes.FLOAT,
        defaultValue: null
      },
      location: {
        type: DataTypes.GEOMETRY('POINT')
      }
    },
    { sequelize }
  )

  User.associate = function (models) {
    models.User.hasMany(models.Post, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    })
  }

  // Check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }

  // Before a User is created, we will automatically hash their password
  User.addHook('beforeCreate', function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
  })

  return User
}
