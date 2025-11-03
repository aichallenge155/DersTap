const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// İstifadəçi autentifikasiyası
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token yoxdur, giriş rədd edildi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'derstap_secret_key');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        isActive: true,
        isOnline: true,
        lastSeen: true,
        profileViews: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Token etibarsızdır' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token etibarsızdır' });
  }
};

// Admin icazəsi yoxlanışı (auth-dan sonra çağırılmalıdır)
const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Token etibarsızdır' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin icazəsi tələb olunur' });
  }

  next();
};

module.exports = { auth, adminAuth };
