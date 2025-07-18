import Peminjaman from "../models/peminjamanModels.js";
import Buku from "../models/bukuModels.js";
import User from "../models/userModels.js";
import KartuPustaka from "../models/kartuPustakaModels.js";
import db from "../config/dbconfig.js";

const peminjamanController = {
    createPeminjaman: async (req, res) => {
        const t = await db.transaction();
        try {
            const user_id = req.user.userId;
            const { buku_id, tanggal_pinjam, tanggal_kembali } = req.body;

            const [pinjamDay, pinjamMonth, pinjamYear] = tanggal_pinjam.split('-');
            const formattedTanggalPinjam = `${pinjamYear}-${pinjamMonth}-${pinjamDay}`;

            const [kembaliDay, kembaliMonth, kembaliYear] = tanggal_kembali.split('-');
            const formattedTanggalKembali = `${kembaliYear}-${kembaliMonth}-${kembaliDay}`;

            const newKartuPustaka = await KartuPustaka.create({
                user_id: user_id,
                nomor_resi: `BUKTI-${Date.now()}`,
                tanggal_diterbitkan: formattedTanggalPinjam,
                berlaku_sampai: formattedTanggalKembali,
                status: 'Berlaku'
            }, { transaction: t });

            const kartu_pustaka_id = newKartuPustaka.id_kartu_pustaka;

            const buku = await Buku.findByPk(buku_id, { transaction: t });
            if (!buku || buku.stok < 1) {
                await t.rollback();
                return res.status(400).json({ msg: "Buku tidak tersedia atau stok habis" });
            }

            const newPeminjaman = await Peminjaman.create({
                user_id: user_id,
                buku_id,
                kartu_pustaka_id,
                tanggal_pinjam: formattedTanggalPinjam,
                tanggal_kembali: formattedTanggalKembali,
                status: 'Dipinjam'
            }, { transaction: t });

            await Buku.decrement('stok', {
                by: 1,
                where: { id_buku: buku_id },
                transaction: t
            });

            await t.commit();
            const peminjamanLengkap = await Peminjaman.findByPk(newPeminjaman.id_peminjaman, {
                include: [{
                    model: KartuPustaka,
                    attributes: ['nomor_resi']
                }]
            });

            res.status(201).json({ msg: "Peminjaman berhasil dicatat", data: peminjamanLengkap });

        } catch (error) {
            await t.rollback();
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getAllPeminjaman: async (req, res) => {
        try {
            const peminjaman = await Peminjaman.findAll({
                include: [
                    { model: User, attributes: ['email', 'nama'] },
                    { model: Buku, attributes: ['judul'] },
                    { model: KartuPustaka, attributes: ['nomor_resi'] }
                ]
            });
            if (peminjaman.length === 0) {
                return res.status(404).json({ msg: "Data peminjaman tidak ditemukan" });
            }
            res.status(200).json(peminjaman);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getPeminjamanById: async (req, res) => {
        try {
            const peminjaman = await Peminjaman.findByPk(req.params.id, {
                include: [
                    { model: User, attributes: ['email', 'nama'] },
                    { model: Buku, attributes: ['judul'] },
                    { model: KartuPustaka, attributes: ['nomor_resi'] }
                ]
            });
            if (!peminjaman) {
                return res.status(404).json({ msg: `Peminjaman dengan ID ${req.params.id} tidak ditemukan` });
            }
            res.status(200).json(peminjaman);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },


    getRiwayatPeminjamanByUser: async (req, res) => {
        try {
            const user_id = req.user.userId;

            const riwayat = await Peminjaman.findAll({
                where: { user_id: user_id },
                include: [
                    {
                        model: Buku,
                        attributes: ['judul', 'penulis', 'images']
                    },
                    {
                        model: KartuPustaka,
                        attributes: ['nomor_resi']
                    }
                ],
                order: [['tanggal_pinjam', 'DESC']]
            });

            if (riwayat.length === 0) {
                return res.status(200).json([]);
            }

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const riwayatWithImageUrls = riwayat.map(item => {
                const itemData = item.toJSON();
                if (itemData.buku && itemData.buku.images) {
                    const imageNames = JSON.parse(itemData.buku.images || '[]');
                    itemData.buku.images = imageNames.length > 0 ? `${baseUrl}/uploads_buku/${encodeURIComponent(imageNames[0])}` : '/placeholder.jpg';
                }
                return itemData;
            });

            res.status(200).json(riwayatWithImageUrls);

        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

};

export default peminjamanController;