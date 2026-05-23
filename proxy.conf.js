// Dev-server reverse proxy for ng serve.
// Default targets the deployed Docker Spring. Override NG_API_URL to run locally.
//
//   npm start                                       → http://192.168.1.29:8080 (Docker, default)
//   npm run start:local                             → http://localhost:8080 (local Spring)
//   NG_API_URL=http://localhost:8080 npm start      → same, via env var
//
const target = process.env['NG_API_URL'] || 'http://192.168.1.29:8080';

module.exports = {
  '/api': { target, secure: false, changeOrigin: true, logLevel: 'debug' },
  '/login': { target, secure: false, changeOrigin: true },
  '/oauth2': { target, secure: false, changeOrigin: true },
};
