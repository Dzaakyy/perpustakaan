import Pengembalian from "../models/pengembalianModels.js";
import Peminjaman from "../models/peminjamanModels.js";
import Buku from "../models/bukuModels.js";
import KartuPustaka from "../models/kartuPustakaModels.js";
import db from "../config/dbconfig.js";
import User from "../models/userModels.js";

const pengembalianController = {
    createPengembalian: async (req, res) => {
        const t = await db.transaction();
        try {
            const { peminjaman_id, kondisi_buku } = req.body;

            const peminjaman = await Peminjaman.findByPk(peminjaman_id, {
                include: KartuPustaka,
                transaction: t
            });

            if (!peminjaman) {
                await t.rollback();
                return res.status(404).json({ msg: "Data peminjaman tidak ditemukan" });
            }
            if (peminjaman.status === 'Dikembalikan' || peminjaman.status === 'Terlambat') {
                await t.rollback();
                return res.status(400).json({ msg: "Buku ini statusnya sudah selesai (dikembalikan/terlambat)" });
            }

            const tanggalHariIni = new Date();
            const tanggalJatuhTempo = new Date(peminjaman.tanggal_kembali);
            
            tanggalHariIni.setHours(0, 0, 0, 0);

            let statusPeminjamanBaru = 'Dikembalikan';
            let denda = 0;
            let pesanDenda = "Tidak ada denda.";

            if (tanggalHariIni > tanggalJatuhTempo) {
                statusPeminjamanBaru = 'Terlambat';
                
                const selisihWaktu = tanggalHariIni.getTime() - tanggalJatuhTempo.getTime();
                const selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
                
                denda = selisihHari * 1000;
                pesanDenda = `Terlambat ${selisihHari} hari, denda sebesar Rp ${denda}.`;
            }


            peminjaman.status = statusPeminjamanBaru;
            await peminjaman.save({ transaction: t });

            if (peminjaman.kartu_pustaka) {
                peminjaman.kartu_pustaka.status = 'Tidak Berlaku';
                await peminjaman.kartu_pustaka.save({ transaction: t });
            }

            const newPengembalian = await Pengembalian.create({
                peminjaman_id,
                tanggal_kembali: new Date(),
                kondisi_buku,
                denda: denda 
            }, { transaction: t });

            await Buku.increment('stok', {
                by: 1,
                where: { id_buku: peminjaman.buku_id },
                transaction: t
            });

            await t.commit();
            res.status(201).json({ 
                msg: `Buku berhasil dikembalikan. Status: ${statusPeminjamanBaru}.`,
                info_denda: pesanDenda,
                data: newPengembalian 
            });

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
                        Buku,
                        {
                            model: User,
                            attributes: ['nama', 'email']
                        },
                        {
                            model: KartuPustaka,
                            attributes: ['nomor_resi']
                        }
                    ]
                }]
            });
            res.status(200).json(pengembalian);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getPengembalianById: async (req, res) => {
        try {
            const pengembalian = await Pengembalian.findByPk(req.params.id, {
                include: [{
                    model: Peminjaman,
                    include: [
                        Buku,
                        {
                            model: User,
                            attributes: ['nama', 'email']
                        }
                    ]
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