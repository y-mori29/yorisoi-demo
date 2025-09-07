import { removeExpired } from '../utils/sharesStore.js';

(async () => {
  const removed = await removeExpired();
  console.log(`Removed ${removed} expired links`);
})();
