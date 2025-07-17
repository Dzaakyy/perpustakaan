import { Sequelize } from "sequelize";
import db from '../config/dbconfig.js';
import User from './userModels.js';

const { DataTypes } = Sequelize;

const KartuPustaka = db.define('kartu_pustaka', {
    id_kartu_pustaka: {
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
    nomor_resi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tanggal_diterbitkan: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    berlaku_sampai: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Berlaku', 'Tidak Berlaku'),
        allowNull: false,
        defaultValue: 'Berlaku'
    },
}, {
    freezeTableName: true,
    timestamps: false
});

KartuPustaka.belongsTo(User, { foreignKey: 'user_id' });

export default KartuPustaka;