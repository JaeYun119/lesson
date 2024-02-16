const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {
    static initiate(sequelize) {
        Hashtag.init({
            tag: {
                type: Sequelize.STRING(200),
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            timestamps:true,
            underscoredIf: false,
            modelNameL:'Hashtag',
            tableNameL:'hashtag',
            paranoid:false,
            charset:'utf8mb4',
            collate: 'utf8mb4_general_ci'
    
        })
    }
    static associate(db) {
        db.Hashtag.belongToMany(db.Post, { through: 'PostHashtag'})
    }
    
    
}

module.exports = Hashtag