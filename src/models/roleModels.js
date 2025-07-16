import { Sequelize } from "sequelize";
import db from '../config/dbconfig.js';

const { DataTypes } = Sequelize;

const Role = db.define('role', {
    id_role: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull:false,
    },
    deskripsi: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
     freezeTableName: true,
    timestamps: false,
});

export default Role;
(async()=>{
    await db.sync();
})();