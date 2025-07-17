import Kategori from "../models/kategoriModels.js";

const kategoriController = {
    createKategori: async (req, res) => {
        try {
            const { nama_kategori, deskripsi } = req.body;
            const newCategory = await Kategori.create({
                nama_kategori: nama_kategori,
                deskripsi: deskripsi
            });
            res.status(201).json({ msg: "Kategori berhasil dibuat", data: newCategory });

        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    updateKategori: async (req, res) => {
        try {
            const kategori = await Kategori.findByPk(req.params.id);

            if (!kategori) {
                return res.status(404).json({ msg: `Kategori dengan ID ${req.params.id} tidak ditemukan` });
            }

            kategori.nama_kategori = req.body.nama_kategori;
            kategori.deskripsi = req.body.deskripsi;

            await kategori.save();
            res.status(200).json({ msg: "Kategori berhasil diperbarui", data: kategori });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getAllKategori: async (req, res) => {
        try {
            const kategori = await Kategori.findAll();
            if (kategori.length === 0) {
                return res.status(404).json({ msg: "Data kategori tidak ditemukan" });
            }
            res.status(200).json(kategori);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getKategoriById: async (req, res) => {
        try {
            const kategori = await Kategori.findByPk(req.params.id);
            if (!kategori) {
                return res.status(404).json({ msg: `Kategori dengan ID ${req.params.id} tidak ditemukan` });
            }
            res.status(200).json(kategori);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    deleteKategori: async (req, res) => {
        try {
            const kategori = await Kategori.findByPk(req.params.id);
            if (!kategori) {
                return res.status(404).json({ msg: `Kategori dengan ID ${req.params.id} tidak ditemukan` });
            }
            await kategori.destroy();
            res.status(200).json({ msg: "Kategori berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    }

}

export default kategoriController;
