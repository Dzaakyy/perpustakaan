import User from "../models/userModels.js";
import Role from "../models/roleModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['id_user', 'nama', 'email'],
                include: [{
                    model: Role,
                    attributes: ['nama', 'deskripsi']
                }]
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    profileUser: async (req, res) => {
        try {
            // console.log("Req.user:", req.user);
            const user = await User.findOne({
                where: {
                    id_user: req.user.userId
                },
                include: [{
                    model: Role,
                    attributes: ['nama', 'deskripsi']
                }]
            });

            // console.log("User data:", user.toJSON());

            if (!user) {
                return res.status(401).json({ message: 'pengguna tidak ditemukan' });
            }

            res.status(200).json({
                message: 'Profile User',
                user: {
                    id_user: user.id_user,
                    nama: user.nama,
                    email: user.email,
                    role: user.role ? {
                        nama: user.role.nama,
                        deskripsi: user.role.deskripsi
                    } : null
                }
            });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: error.message });
        }
    },

    register: async (req, res) => {
        const { nama, email, password, role_id } = req.body;

        if (password && password.length < 5) {
            return res.status(400).json({ msg: "Panjang password minimal 5 karakter." });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            await User.create({
                nama: nama,
                email: email,
                password: hashPassword,
                role_id: role_id
            });
            res.status(201).json({ msg: "Registrasi Berhasil" });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({
                where: { email: req.body.email },
                include: [Role]
            });
            if (!user) return res.status(404).json({ msg: "Email tidak ditemukan." });

            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) return res.status(400).json({ msg: "Password Salah." });

            const userId = user.id_user;
            const email = user.email;
            const roleId = user.role_id;
            const roleName = user.role.nama;

            const accessToken = jwt.sign({ userId, email, roleId, roleName }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({
                msg: "Login Berhasil",
                user: {
                    email: user.email,
                    role: roleName
                }
            });

        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('accessToken');
            res.status(200).json({ msg: "Anda telah logout" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user.userId;

            const { nama, email, password } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ msg: "User tidak ditemukan." });
            }

            user.nama = nama;
            user.email = email;

            if (password && password.length > 0) {
                if (password.length < 5) {
                    return res.status(400).json({ msg: "Panjang password minimal 5 karakter." });
                }
                const salt = await bcrypt.genSalt();
                user.password = await bcrypt.hash(password, salt);
            }

            await user.save();

            const updatedUserWithRole = await User.findByPk(userId, {
                include: [{ model: Role, attributes: ['nama'] }]
            });

            res.status(200).json({
                msg: "Profil berhasil diperbarui",
                user: updatedUserWithRole
            });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: "Terjadi kesalahan di server." });
        }
    },
}

export default userController;