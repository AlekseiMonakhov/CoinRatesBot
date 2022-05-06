const { Sequelize, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define('Currencies', {
		id: { 
			type: DataTypes.FLOAT, 
			primaryKey: true
		},
		valute: DataTypes.STRING,
		value: DataTypes.FLOAT
	}, {
    	timestamps: false
	})
}



