const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps:true,
            underscoredIf: false,
            modelNameL:'Post',
            tableNameL:'posts',
            paranoid:false,
            charset:'utf8mb4',
            collate: 'utf8mb4_general_ci'
    
        })
    }
    static associate(db) {
        db.Post.belongTo(db.User);
        db.Post.belongToMany(db.Hashtag, { through: 'PostHashtag'})
    }
    
}

module.exports = Post