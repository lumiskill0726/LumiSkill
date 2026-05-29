const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n=======================================');
console.log('🔑 VAPID Keys Generated!');
console.log('=======================================\n');
console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);
console.log('\n=======================================');
console.log('📝 Add these to your .env.local file:');
console.log('=======================================\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log('\n=======================================');
console.log('✅ Next Steps:');
console.log('=======================================');
console.log('1. Copy the keys above');
console.log('2. Paste them into your .env.local file');
console.log('3. Restart your dev server (npm run dev)');
console.log('4. Test push notifications!');
console.log('=======================================\n');
