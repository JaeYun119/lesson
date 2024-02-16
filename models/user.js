const Sequelize = require('sequelize');
const { underscoredIf } = require('sequelize/types/utils');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provide_kakao: {
                type: Sequelize.ENUM('local','kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps:true,
            underscoredIf: false,
            modelNameL:'User',
            tableNameL:'users',
            paranoid:true,
            charset:'utf8',
            collate: 'utf8_general_ci'
    
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        })
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followings',
            through: 'Follow'
        });
    }
    
}

module.exports = User