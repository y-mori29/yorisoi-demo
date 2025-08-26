import { removeExpired } from '../utils/sharesStore';

(async () => {
  const removed = await removeExpired();
  console.log(`Removed ${removed} expired links`);
})();
