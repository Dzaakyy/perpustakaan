import { Sequelize } from "sequelize";
import db from '../config/dbconfig.js';
import Kategori from "./kategoriModels.js";

const { DataTypes } = Sequelize;

const Buku = db.define('buku', {
    id_buku: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    judul: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    penulis: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    penerbit: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    kategori_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Kategori,
            key: 'id_kategori'
        }
    },
    tahun_terbit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    images: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

Buku.belongsTo(Kategori, { foreignKey: 'kategori_id' });
Kategori.hasMany(Buku, { foreignKey: 'kategori_id' });

export default Buku;
(async () => {
    await db.sync();
})();