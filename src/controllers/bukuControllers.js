import Buku from "../models/bukuModels.js";
import Kategori from "../models/kategoriModels.js";
import fs from 'fs';
import path from 'path';

const bukuController = {
    createBuku: async (req, res) => {
        try {
            const { judul, penulis, penerbit, kategori_id, tahun_terbit, stok } = req.body;
            
            const images = req.files ? req.files.map(file => file.filename) : [];

            const newBuku = await Buku.create({
                judul,
                penulis,
                penerbit,
                kategori_id,
                tahun_terbit,
                stok,
                images: JSON.stringify(images)
            });
            res.status(201).json({ msg: "Buku berhasil ditambahkan", data: newBuku });
        } catch (error) {
            if (req.files) {
                req.files.forEach(file => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error("Gagal menghapus file saat error:", err);
                    });
                });
            }
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    updateBuku: async (req, res) => {
        try {
            const buku = await Buku.findByPk(req.params.id);
            if (!buku) {
                return res.status(404).json({ msg: `Buku dengan ID ${req.params.id} tidak ditemukan` });
            }

            const { judul, penulis, penerbit, kategori_id, tahun_terbit, stok } = req.body;
            let newImages = buku.images;

            if (req.files && req.files.length > 0) {
                const oldImages = JSON.parse(buku.images || '[]');
                oldImages.forEach(img => {
                    const imagePath = path.join('uploads_buku', img);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });

                const newImageFilenames = req.files.map(file => file.filename);
                newImages = JSON.stringify(newImageFilenames);
            }

            await buku.update({
                judul: judul || buku.judul,
                penulis: penulis || buku.penulis,
                penerbit: penerbit || buku.penerbit,
                kategori_id: kategori_id || buku.kategori_id,
                tahun_terbit: tahun_terbit || buku.tahun_terbit,
                stok: stok || buku.stok,
                images: newImages
            });
            res.status(200).json({ msg: "Buku berhasil diperbarui", data: buku });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getAllBuku: async (req, res) => {
        try {
            const allBuku = await Buku.findAll({
                include: [{
                    model: Kategori,
                    attributes: ['nama_kategori']
                }]
            });
            if (allBuku.length === 0) {
                return res.status(404).json({ msg: "Data buku tidak ditemukan" });
            }

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const bukuWithImageUrls = allBuku.map(buku => {
                const bukuData = buku.toJSON();
                const imageNames = JSON.parse(bukuData.images || '[]');
                bukuData.images = imageNames.map(img => `${baseUrl}/uploads_buku/${encodeURIComponent(img)}`);
                return bukuData;
            });

            res.status(200).json(bukuWithImageUrls);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getBukuById: async (req, res) => {
        try {
            const buku = await Buku.findByPk(req.params.id, {
                include: [{
                    model: Kategori,
                    attributes: ['nama_kategori']
                }]
            });
            if (!buku) {
                return res.status(404).json({ msg: `Buku dengan ID ${req.params.id} tidak ditemukan` });
            }

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const bukuData = buku.toJSON();
            const imageNames = JSON.parse(bukuData.images || '[]');
            bukuData.images = imageNames.map(img => `${baseUrl}/uploads_buku/${encodeURIComponent(img)}`);

            res.status(200).json(bukuData);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    deleteBuku: async (req, res) => {
        try {
            const buku = await Buku.findByPk(req.params.id);
            if (!buku) {
                return res.status(404).json({ msg: `Buku dengan ID ${req.params.id} tidak ditemukan` });
            }

            const images = JSON.parse(buku.images || '[]');
            images.forEach(img => {
                const imagePath = path.join('uploads_buku', img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });

            await buku.destroy();
            res.status(200).json({ msg: "Buku berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    }
};

export default bukuController;