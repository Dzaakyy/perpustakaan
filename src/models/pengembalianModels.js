import { Sequelize } from "sequelize";
import db from '../config/dbconfig.js';
import Peminjaman from "./peminjamanModels.js";

const { DataTypes } = Sequelize;

const Pengembalian = db.define('pengembalian', {
    id_pengembalian: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    peminjaman_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Peminjaman,
            key: 'id_peminjaman'
        }
    },
    tanggal_kembali: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    kondisi_buku: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
        denda: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    freezeTableName: true,
    timestamps: false 
});

Pengembalian.belongsTo(Peminjaman, { foreignKey: 'peminjaman_id' });
Peminjaman.hasMany(Pengembalian, { foreignKey: 'peminjaman_id' });

export default Pengembalian;
(async()=>{
    await db.sync();
})();