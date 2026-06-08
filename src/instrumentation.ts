export async function register() {
  // Fix SSL certificate verification in local dev (corporate/VPN environments)
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
}
