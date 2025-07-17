import KartuPustaka from "../models/kartuPustakaModels.js";
import User from "../models/userModels.js";

const kartuPustakaController = {
    createKartuPustaka: async (req, res) => {
        try {
            const { user_id, nomor_resi, berlaku_sampai, status } = req.body;
            const newKartu = await KartuPustaka.create({
                user_id,
                nomor_resi,
                tanggal_diterbitkan: new Date(),
                berlaku_sampai,
                status
            });
            res.status(201).json({ msg: "Kartu Pustaka berhasil dibuat", data: newKartu });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    updateKartuPustaka: async (req, res) => {
        try {
            const kartu = await KartuPustaka.findByPk(req.params.id);
            if (!kartu) {
                return res.status(404).json({ msg: `Kartu Pustaka dengan ID ${req.params.id} tidak ditemukan` });
            }
            const { user_id, nomor_resi, berlaku_sampai, status } = req.body;
            await kartu.update({
                user_id,
                nomor_resi,
                berlaku_sampai,
                status
            });
            res.status(200).json({ msg: "Kartu Pustaka berhasil diperbarui", data: kartu });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getAllKartuPustaka: async (req, res) => {
        try {
            const kartu = await KartuPustaka.findAll({
                 include: [{
                    model: User,
                    attributes: ['nama', 'email']
                }]
            });
            if (kartu.length === 0) {
                return res.status(404).json({ msg: "Data Kartu Pustaka tidak ditemukan" });
            }
            res.status(200).json(kartu);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },
    
    getKartuPustakaById: async (req, res) => {
        try {
            const kartu = await KartuPustaka.findByPk(req.params.id, {
                 include: [{
                    model: User,
                    attributes: ['nama', 'email']
                }]
            });
            if (!kartu) {
                return res.status(404).json({ msg: `Kartu Pustaka dengan ID ${req.params.id} tidak ditemukan` });
            }
            res.status(200).json(kartu);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    deleteKartuPustaka: async (req, res) => {
        try {
            const kartu = await KartuPustaka.findByPk(req.params.id);
            if (!kartu) {
                return res.status(404).json({ msg: `Kartu Pustaka dengan ID ${req.params.id} tidak ditemukan` });
            }
            await kartu.destroy();
            res.status(200).json({ msg: "Kartu Pustaka berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    }
};

export default kartuPustakaController;