import Role from "../models/roleModels.js";

const roleController = {
    createRole: async (req, res) => {
        try {
            const { nama, deskripsi } = req.body;
            const newRole = await Role.create({
                nama: nama,
                deskripsi: deskripsi
            });
            res.status(201).json({ msg: "Role berhasil dibuat", data: newRole });

        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    updateRole: async (req, res) => {
        try {
            const role = await Role.findByPk(req.params.id);

            if (!role) {
                return res.status(404).json({ msg: `Role dengan ID ${req.params.id} tidak ditemukan` });
            }

            role.nama = req.body.nama;
            role.deskripsi = req.body.deskripsi;

            await role.save();
            res.status(200).json({ msg: "Role berhasil diperbarui", data: role });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getAllRoles: async (req, res) => {
        try {
            const roles = await Role.findAll();
            if (roles.length === 0) {
                return res.status(404).json({ msg: "Data role tidak ditemukan" });
            }
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    getRoleById: async (req, res) => {
        try {
            const role = await Role.findByPk(req.params.id);
            if (!role) {
                return res.status(404).json({ msg: `Role dengan ID ${req.params.id} tidak ditemukan` });
            }
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    },

    deleteRole: async (req, res) => {
        try {
            const role = await Role.findByPk(req.params.id);
            if (!role) {
                return res.status(404).json({ msg: `Role dengan ID ${req.params.id} tidak ditemukan` });
            }
            await role.destroy();
            res.status(200).json({ msg: "Role berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
        }
    }

}

export default roleController;
