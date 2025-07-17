import Pengembalian from "../models/pengembalianModels.js";
import Peminjaman from "../models/peminjamanModels.js";
import Buku from "../models/bukuModels.js";
import db from "../config/dbconfig.js";

const pengembalianController = {
    createPengembalian: async (req, res) => {
        const t = await db.transaction(); 
        try {
            const { peminjaman_id, kondisi_buku } = req.body;

            const peminjaman = await Peminjaman.findByPk(peminjaman_id, { transaction: t });
            if (!peminjaman) {
                await t.rollback();
                return res.status(404).json({ msg: "Data peminjaman tidak ditemukan" });
            }
            if (peminjaman.status === 'Dikembalikan') {
                await t.rollback();
                return res.status(400).json({ msg: "Buku ini sudah dikembalikan" });
            }

            const newPengembalian = await Pengembalian.create({
                peminjaman_id,
                tanggal_kembali: new Date(),
                kondisi_buku
            }, { transaction: t });

            peminjaman.status = 'Dikembalikan';
            await peminjaman.save({ transaction: t });

            const buku = await Buku.findByPk(peminjaman.buku_id, { transaction: t });
            if (buku) {
                buku.stok += 1;
                await buku.save({ transaction: t });
            }
            
            await t.commit(); 
            res.status(201).json({ msg: "Pengembalian buku berhasil", data: newPengembalian });

        } catch (error) {
            await t.rollback(); 
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getAllPengembalian: async (req, res) => {
        try {
            const pengembalian = await Pengembalian.findAll({
                include: [{
                    model: Peminjaman,
                    include: [
                        { model: Buku, attributes: ['judul'] }
                    ]
                }]
            });
            if (pengembalian.length === 0) {
                return res.status(404).json({ msg: "Data pengembalian tidak ditemukan" });
            }
            res.status(200).json(pengembalian);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getPengembalianById: async (req, res) => {
        try {
            const pengembalian = await Pengembalian.findByPk(req.params.id, {
                include: [{
                    model: Peminjaman
                }]
            });
            if (!pengembalian) {
                return res.status(404).json({ msg: `Pengembalian dengan ID ${req.params.id} tidak ditemukan` });
            }
            res.status(200).json(pengembalian);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    }
};

export default pengembalianController;