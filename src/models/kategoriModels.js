import { Sequelize } from "sequelize";
import db from '../config/dbconfig.js';

const { DataTypes } = Sequelize;

const Kategori = db.define('kategori', {
    id_kategori: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_kategori: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

export default Kategori;
(async () => {
    await db.sync();
})();