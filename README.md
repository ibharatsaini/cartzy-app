# Cartzy Shop - Premium eCommerce Experience

A modern, full-stack eCommerce application built with React and Node.js, featuring a seamless checkout flow and robust order management system.

![Cartzy Shop Screenshot](https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- 🛍️ **Beautiful Product Showcase**
  - High-quality product images
  - Variant selection (color, size)
  - Real-time inventory tracking

- 🔒 **Secure Checkout Process**
  - Encrypted payment processing
  - Order confirmation emails
  - Transaction simulation modes

- 📱 **Responsive Design**
  - Mobile-first approach
  - Smooth animations
  - Intuitive navigation
  - Cross-browser compatibility

- 🔧 **Technical Features**
  - TypeScript for type safety
  - Real-time form validation
  - Error handling & recovery

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- React Hook Form
- Zod validation
- Lucide React icons

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- TypeScript
- Nodemailer

### Security
- RSA encryption for sensitive data
- CORS protection
- Input validation
- Error handling middleware

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ibharatsaini/cartzy-app.git
cd cartzy-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Root .env
VITE_API_URL=http://localhost:3000/api


# Server .env
DATABASE_URL=postgresql://user:password@localhost:5432/luxe_shop
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
PUBLIC_KEY=''
PRIVATE_KEY=''
```

4. Initialize the database:
```bash
cd server
npx prisma migrate dev
```

### Development

Start both frontend and backend in development mode:

```bash
# Start frontend (from root directory)
npm run dev

# Start backend (in another terminal)
npm run dev:server
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Testing the Checkout Flow

The application includes three transaction simulation modes:

1. **Approved**: Successful payment processing
2. **Declined**: Payment declined by bank
3. **Error**: Gateway processing error



## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.