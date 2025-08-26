import { removeExpired } from '../utils/sharesStore';

const removed = removeExpired();
console.log(`Removed ${removed} expired links`);
