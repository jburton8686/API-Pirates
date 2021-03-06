"use strict";
module.exports = (sequelize, DataTypes) => {
    var Pirates = sequelize.define(
        "Pirates",
        {
            PirateId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            family_name: DataTypes.STRING,
            rank: DataTypes.INTEGER,
            beard: DataTypes.STRING,
            nick_name: DataTypes.STRING,
            birth_country: DataTypes.STRING,
            worth: DataTypes.INTEGER,
            date_of_death: DataTypes.INTEGER
        },
        {
            timestamps: false
        },
        {
            classMethods: {
                associate: function (models) {
                    // associations can be defined here
                }
            }
        }
    );
    return Pirates;
};