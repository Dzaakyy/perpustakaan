import { Sequelize } from "sequelize";
import db from '../config/dbconfig.js';
import Role from "./roleModels.js";

const { DataTypes } = Sequelize;

const User = db.define('user', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id_role'
        }
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: false 
});

User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

export default User;
(async()=>{
    await db.sync();
})();