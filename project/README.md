# 🚀 Trading Crypto Academy - Enterprise Security Edition

Sebuah website modern untuk kursus trading cryptocurrency yang dilengkapi dengan admin dashboard dan sistem keamanan enterprise-grade. Dibangun dengan teknologi web terkini dan dirancang untuk memberikan pengalaman pengguna yang optimal dengan keamanan tingkat tinggi.

## 🔐 Enterprise Security Features

### **Bcrypt Password Hashing**
- **Salt Rounds 12**: Sangat aman dengan computational cost tinggi
- **No Plain Text**: Password tidak pernah disimpan dalam bentuk readable
- **Unique Salt**: Setiap hash unik meski password sama
- **Brute Force Protection**: Bcrypt lambat secara design untuk mencegah brute force

### **Advanced Authentication System**
- **Rate Limiting**: Maksimal 5 percobaan login per 15 menit
- **Account Lockout**: Otomatis mengunci akun setelah percobaan gagal berlebihan
- **Session Management**: JWT-style session dengan timeout otomatis
- **Secure Storage**: Data tersimpan dengan enkripsi base64

### **Security Monitoring**
- **Login Attempt Tracking**: Mencatat semua percobaan login
- **Session Timeout**: Otomatis logout setelah periode inaktif
- **CSRF Protection**: Token untuk mencegah cross-site request forgery
- **Input Sanitization**: Membersihkan semua input dari potensi XSS

### **Password Security**
- **Strength Validation**: Persyaratan password yang ketat
- **Real-time Feedback**: Validasi password secara real-time
- **Secure Change**: Proses ganti password yang aman
- **Auto Logout**: Logout otomatis setelah ganti password

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🔐 Security Features](#-security-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [👥 For Users](#-for-users)
- [💻 For Developers](#-for-developers)
- [🔧 Configuration](#-configuration)
- [📱 Responsive Design](#-responsive-design)
- [🔐 Security](#-security)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Overview

Trading Crypto Academy adalah platform edukasi trading cryptocurrency yang menyediakan:
- **Landing Page** yang menarik untuk mempromosikan kursus
- **Admin Dashboard** dengan keamanan enterprise-grade
- **WhatsApp Integration** untuk pendaftaran langsung
- **Responsive Design** yang optimal di semua device
- **Security System** dengan bcrypt hashing dan rate limiting

## ✨ Features

### 🌟 Landing Page Features
- **Hero Section** dengan call-to-action WhatsApp
- **Features Section** untuk menampilkan keunggulan kursus
- **Packages Section** dengan berbagai paket berlangganan
- **Testimonials Section** untuk review dari member
- **FAQ Section** untuk pertanyaan yang sering diajukan
- **Responsive Design** untuk semua ukuran layar
- **Modern Animations** dan micro-interactions

### 🔧 Admin Dashboard Features
- **Content Management System (CMS)** lengkap
- **Hero Content Editor** untuk mengubah konten utama
- **Features Manager** untuk mengelola fitur-fitur
- **Packages Manager** untuk mengelola paket kursus
- **Testimonials Manager** untuk mengelola review
- **FAQs Manager** untuk mengelola pertanyaan
- **Security Settings** untuk mengelola keamanan akun
- **Real-time Preview** perubahan konten
- **Enterprise Security** dengan bcrypt dan rate limiting

## 🔐 Security Features

### **Authentication & Authorization**
```typescript
// Bcrypt hashing dengan salt rounds 12
const hashedPassword = await bcrypt.hash(password, 12);

// Rate limiting untuk mencegah brute force
const rateLimiter = new RateLimiter();
if (rateLimiter.isBlocked(username)) {
  return { error: 'Too many attempts' };
}

// Session management dengan timeout
const session = {
  userId: user.id,
  sessionId: generateSecureId(),
  createdAt: Date.now(),
  lastActivity: Date.now()
};
```

### **Security Configuration**
```typescript
export const SECURITY_CONFIG = {
  SALT_ROUNDS: 12,              // Bcrypt salt rounds
  MAX_LOGIN_ATTEMPTS: 5,        // Max failed attempts
  LOCKOUT_DURATION: 15 * 60000, // 15 minutes lockout
  SESSION_TIMEOUT: 24 * 3600000, // 24 hours session
  PASSWORD_MIN_LENGTH: 8,       // Minimum password length
  PASSWORD_REQUIREMENTS: {      // Password complexity
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};
```

### **Security Monitoring Dashboard**
- **Session Information**: Real-time session tracking
- **Security Status**: Live security feature status
- **Password Management**: Secure password change
- **Security Configuration**: View current security settings

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern JavaScript library
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Lightning fast build tool

### Security Libraries
- **bcryptjs 2.4.3** - Password hashing with salt
- **Crypto API** - Secure random generation
- **Base64 Encoding** - Secure data storage

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - CSS transformation tool
- **Autoprefixer 10.4.18** - CSS vendor prefixes

### Icons & Assets
- **Lucide React 0.344.0** - Beautiful icon library

### Development Tools
- **ESLint 9.9.1** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **React Hooks ESLint Plugin** - React hooks linting
- **Terser** - Code minification

## 📁 Project Structure

```
trading-crypto-academy/
├── 📁 public/                    # Static assets
│   ├── _redirects               # Netlify redirects
│   └── robots.txt               # SEO robots file
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 admin/             # Admin dashboard components
│   │   │   ├── AdminApp.tsx      # Main admin application
│   │   │   ├── AdminLayout.tsx   # Admin layout wrapper
│   │   │   ├── Dashboard.tsx     # Admin dashboard home
│   │   │   ├── LoginForm.tsx     # Secure login form
│   │   │   ├── SecuritySettings.tsx # Security management
│   │   │   ├── HeroContentManager.tsx
│   │   │   ├── FeaturesManager.tsx
│   │   │   ├── PackagesManager.tsx
│   │   │   ├── TestimonialsManager.tsx
│   │   │   └── FAQsManager.tsx
│   │   └── LandingPage.tsx       # Main landing page
│   ├── 📁 contexts/
│   │   ├── AuthContext.tsx       # Enhanced authentication context
│   │   └── ContentContext.tsx    # Content management context
│   ├── 📁 utils/
│   │   └── security.ts           # Security utilities & bcrypt
│   ├── 📁 types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts            # Vite type definitions
├── 📄 index.html                 # HTML template with SEO
├── 📄 package.json               # Dependencies and scripts
├── 📄 tailwind.config.js         # Tailwind configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 vite.config.ts             # Vite configuration
└── 📄 eslint.config.js           # ESLint configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 atau lebih tinggi)
- **npm** atau **yarn** package manager
- **Git** (opsional)

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd trading-crypto-academy
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. **Open Browser**
   - Landing Page: `http://localhost:5173`
   - Admin Dashboard: `http://localhost:5173/admin`

## 👥 For Users

### 🌐 Mengakses Website

#### Landing Page
- Buka `http://localhost:5173` di browser
- Jelajahi berbagai section: Hero, Features, Packages, Testimonials, FAQ
- Klik tombol "Daftar via WhatsApp" untuk pendaftaran

#### Admin Dashboard
- Buka `http://localhost:5173/admin`
- Login dengan kredensial yang aman:
  - **Username**: `admin`
  - **Password**: `Admin123!`

### 🔐 Security Features untuk Admin

#### 1. Secure Login
- **Bcrypt Protection**: Password di-hash dengan salt rounds 12
- **Rate Limiting**: Maksimal 5 percobaan per 15 menit
- **Account Lockout**: Otomatis terkunci setelah percobaan berlebihan
- **Real-time Feedback**: Validasi password strength secara real-time

#### 2. Session Management
- **Secure Sessions**: Session ID yang aman dan unik
- **Auto Timeout**: Logout otomatis setelah 24 jam atau inaktif
- **Activity Tracking**: Monitoring aktivitas session real-time

#### 3. Security Settings
- **Password Change**: Ganti password dengan validasi keamanan
- **Security Status**: Monitor status keamanan sistem
- **Session Info**: Informasi detail session aktif

### 📝 Mengelola Konten (Admin)

#### 1. Hero Content
- Edit judul utama, subtitle, dan deskripsi
- Update nomor WhatsApp untuk pendaftaran
- Perubahan langsung terlihat di landing page

#### 2. Features Management
- Tambah, edit, atau hapus fitur-fitur kursus
- Pilih icon dari library Lucide React
- Tulis deskripsi yang menarik

#### 3. Packages Management
- Kelola paket-paket kursus (pemula, professional, VIP)
- Set harga dan fitur untuk setiap paket
- Tandai paket populer dengan badge khusus

#### 4. Testimonials Management
- Tambah review dari member
- Set rating bintang (1-5)
- Include nama dan profesi reviewer

#### 5. FAQs Management
- Kelola pertanyaan yang sering diajukan
- Format accordion yang user-friendly
- Update jawaban sesuai kebutuhan

#### 6. Security Management
- Monitor informasi session aktif
- Ubah password dengan validasi keamanan
- View konfigurasi keamanan sistem

## 💻 For Developers

### 🔧 Development Setup

#### VS Code Extensions (Recommended)
```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint
- GitLens
```

#### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Package Management
npm install          # Install dependencies
npm update           # Update dependencies
```

### 🔐 Security Implementation

#### Bcrypt Password Hashing
```typescript
import bcrypt from 'bcryptjs';

// Hash password dengan salt rounds 12
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

#### Rate Limiting Implementation
```typescript
export class RateLimiter {
  private attempts: Map<string, LoginAttempt[]> = new Map();

  isBlocked(identifier: string): boolean {
    const userAttempts = this.attempts.get(identifier) || [];
    const recentAttempts = userAttempts.filter(
      attempt => Date.now() - attempt.timestamp < LOCKOUT_DURATION
    );
    return recentAttempts.length >= MAX_LOGIN_ATTEMPTS;
  }

  addAttempt(identifier: string, attempt: LoginAttempt): void {
    // Implementation details...
  }
}
```

#### Secure Session Management
```typescript
export interface SessionData {
  userId: string;
  username: string;
  role: string;
  createdAt: number;
  lastActivity: number;
  sessionId: string;
}

export const generateSessionId = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
```

### 🏗️ Architecture Overview

#### Security-First Design
- **Defense in Depth**: Multiple layers of security
- **Principle of Least Privilege**: Minimal access rights
- **Secure by Default**: Security features enabled by default
- **Input Validation**: All inputs sanitized and validated

#### Component Architecture
- **Functional Components** dengan React Hooks
- **Context API** untuk state management
- **TypeScript** untuk type safety
- **Modular Design** dengan separation of concerns
- **Security Utils** untuk fungsi keamanan terpusat

#### State Management
```typescript
// Enhanced Authentication Context
const { 
  user, 
  login, 
  logout, 
  isAuthenticated, 
  isLoading,
  changePassword,
  sessionInfo 
} = useAuth();

// Content Management Context
const { 
  heroContent, features, packages, testimonials, faqs,
  updateHeroContent, addFeature, updateFeature, deleteFeature
} = useContent();
```

## 🔧 Configuration

### Security Configuration
```typescript
// src/utils/security.ts
export const SECURITY_CONFIG = {
  SALT_ROUNDS: 12,                    // Bcrypt salt rounds
  MAX_LOGIN_ATTEMPTS: 5,              // Maximum failed login attempts
  LOCKOUT_DURATION: 15 * 60 * 1000,   // 15 minutes lockout
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours session timeout
  PASSWORD_MIN_LENGTH: 8,             // Minimum password length
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};
```

### Environment Variables (Production)
```env
# Untuk production, gunakan environment variables
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD_HASH=your_bcrypt_hash
VITE_JWT_SECRET=your_jwt_secret
VITE_ENCRYPTION_KEY=your_encryption_key
```

### WhatsApp Configuration
```typescript
// Update di src/contexts/ContentContext.tsx
const defaultHeroContent: HeroContent = {
  whatsappNumber: "6281234567890" // Ganti dengan nomor Anda
};
```

### Admin Credentials (Development)
```typescript
// Default credentials untuk development
Username: admin
Password: Admin123!

// Password hash (bcrypt dengan salt rounds 12):
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXIG/QVygl8S
```

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Mobile-First Approach
- Design dimulai dari mobile
- Progressive enhancement untuk desktop
- Touch-friendly interface
- Optimized loading untuk mobile

## 🔐 Security

### Enterprise-Grade Security Features

#### **Password Security**
- **Bcrypt Hashing**: Salt rounds 12 untuk keamanan maksimal
- **Password Strength**: Validasi kompleksitas password real-time
- **No Plain Text**: Password tidak pernah disimpan dalam bentuk readable
- **Secure Change**: Proses ganti password yang aman dengan validasi

#### **Authentication Security**
- **Rate Limiting**: Maksimal 5 percobaan login per 15 menit
- **Account Lockout**: Otomatis mengunci akun setelah percobaan berlebihan
- **Session Management**: Session timeout otomatis dan tracking aktivitas
- **Secure Storage**: Data tersimpan dengan enkripsi base64

#### **Application Security**
- **Input Sanitization**: Semua input dibersihkan dari potensi XSS
- **CSRF Protection**: Token untuk mencegah cross-site request forgery
- **Secure Headers**: HTTP security headers untuk perlindungan tambahan
- **Error Handling**: Error handling yang aman tanpa expose informasi sensitif

#### **Monitoring & Logging**
- **Login Attempt Tracking**: Mencatat semua percobaan login
- **Session Monitoring**: Real-time monitoring session aktif
- **Security Events**: Logging event keamanan penting
- **Audit Trail**: Jejak audit untuk aktivitas admin

### Production Security Recommendations

#### **Database Security**
```typescript
// Untuk production, gunakan database dengan:
// - Encrypted connections (SSL/TLS)
// - Prepared statements untuk prevent SQL injection
// - Database user dengan minimal privileges
// - Regular security updates
```

#### **Server Security**
```typescript
// Implementasi di server:
// - HTTPS dengan certificate yang valid
// - Security headers (HSTS, CSP, X-Frame-Options)
// - Rate limiting di level server
// - Web Application Firewall (WAF)
```

#### **Environment Security**
```typescript
// Environment variables untuk production:
// - Database credentials
// - JWT secrets
// - Encryption keys
// - API keys
// - Admin credentials
```

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Security Checklist untuk Production

#### **Pre-Deployment**
- [ ] Update semua dependencies ke versi terbaru
- [ ] Ganti default admin credentials
- [ ] Set environment variables untuk production
- [ ] Enable HTTPS dengan certificate yang valid
- [ ] Configure security headers
- [ ] Set up monitoring dan logging

#### **Post-Deployment**
- [ ] Test login functionality
- [ ] Verify rate limiting works
- [ ] Check session timeout
- [ ] Test password change functionality
- [ ] Monitor security logs
- [ ] Set up backup procedures

### Deployment Options

#### 1. Netlify (Recommended)
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_ADMIN_USERNAME=your_username
VITE_ADMIN_PASSWORD_HASH=your_bcrypt_hash
```

#### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with environment variables
vercel --prod
```

#### 3. Traditional Hosting
- Upload folder `dist` ke web hosting
- Configure server untuk SPA routing
- Set up HTTPS dan security headers
- Configure environment variables

### Security Monitoring

#### **Production Monitoring**
```typescript
// Set up monitoring untuk:
// - Failed login attempts
// - Unusual session patterns
// - Security event alerts
// - Performance monitoring
// - Error tracking
```

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Security Guidelines
- Follow secure coding practices
- Test security features thoroughly
- Document security changes
- Review code for vulnerabilities
- Update security dependencies regularly

### Code Standards
- Follow ESLint rules
- Use TypeScript for type safety
- Write descriptive commit messages
- Test on multiple browsers
- Maintain responsive design
- Implement security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Security Issues
Jika Anda menemukan vulnerability keamanan, silakan laporkan secara private ke:
- 📧 Email: security@tradingcryptoacademy.com
- 🔐 PGP Key: Available on request

### General Support
- 📧 Email: support@tradingcryptoacademy.com
- 💬 WhatsApp: +62 812-3456-7890
- 🐛 Issues: [GitHub Issues](https://github.com/username/repo/issues)

---

**Trading Crypto Academy** - Memberdayakan trader Indonesia dengan edukasi crypto trading berkualitas tinggi dan keamanan enterprise-grade.

Made with ❤️ and 🔐 using React, TypeScript, Tailwind CSS, and bcryptjs.

**Security First. Education Always.**