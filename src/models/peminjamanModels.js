import { Sequelize } from "sequelize";
import db from '../config/dbconfig.js';
import Buku from "./bukuModels.js";
import KartuPustaka from "./kartuPustakaModels.js";
import User from './userModels.js';

const { DataTypes } = Sequelize;

const Peminjaman = db.define('peminjaman', {
    id_peminjaman: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id_user'
        }
    },
    buku_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Buku,
            key: 'id_buku'
        }
    },
    kartu_pustaka_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: KartuPustaka,
            key: 'id_kartu_pustaka'
        }
    },
    tanggal_pinjam: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    tanggal_kembali: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Dipinjam', 'Dikembalikan', 'Terlambat'),
        allowNull: false,
        defaultValue: 'Dipinjam'
    },
}, {
    freezeTableName: true,
    timestamps: false
});

Peminjaman.belongsTo(User, { foreignKey: 'user_id' });
Peminjaman.belongsTo(Buku, { foreignKey: 'buku_id' });
Peminjaman.belongsTo(KartuPustaka, { foreignKey: 'kartu_pustaka_id' });

export default Peminjaman;