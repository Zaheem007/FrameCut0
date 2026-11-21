# FrameCut

FrameCut is a videographer booking platform with a Node.js/Express API and a React frontend.

## Project structure

- `server.js` - Express server and MongoDB startup
- `routes/` - authentication, profiles, bookings, portfolios, reviews, and payments
- `models/` - Mongoose schemas
- `middleware/` - JWT authentication and role checks
- `framecut-frontend/` - Vite + React client

## Requirements

- Node.js 20+
- MongoDB
- Razorpay account for payment functionality

## Backend setup

From the repository root:

```bash
npm install
```

Create a root `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/framecut
JWT_SECRET=replace-with-a-long-random-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
PORT=5000
```

Start the API:

```bash
node server.js
```

The API is available at `http://localhost:5000`.

## Frontend setup

```bash
cd framecut-frontend
npm install
npm run start
```

The Vite development server runs at `http://localhost:5173`.

Useful frontend commands:

```bash
npm run build
npm run preview
npm test
```

The frontend currently uses the deployed API URL in its page components. Update those URLs when running against a local backend.

## Security notes

- Public registration can create client or videographer accounts; admin accounts must be provisioned separately.
- Protected API requests require a JWT Bearer token.
- Booking prices and payment amounts are derived and verified by the backend.
- Never commit `.env` files or payment credentials.

## Validation

Run backend checks from the repository root:

```bash
npm test
npm audit --omit=dev
```

Run frontend checks from `framecut-frontend`:

```bash
npm test
npm audit
```
