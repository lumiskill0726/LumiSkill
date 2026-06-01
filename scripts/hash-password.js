const bcrypt = require('bcryptjs');

// Change this to your desired admin password
const password = 'student123';

// Generate hash
const hash = bcrypt.hashSync(password, 10);

console.log('\n=================================');
console.log('🔐 Admin Password Hash Generated');
console.log('=================================\n');
console.log('Your password:', password);
console.log('\nYour hash (copy this):');
console.log(hash);
console.log('\n=================================');
console.log('📝 Next Steps:');
console.log('=================================');
console.log('1. Copy the hash above');
console.log('2. Add to .env.local:');
console.log('   ADMIN_PASSWORD_HASH=' + hash);
console.log('\n3. Add to Supabase SQL Editor:');
console.log(`   INSERT INTO admin_users (email, password_hash, name, role)`);
console.log(`   VALUES ('admin@lumiskill.com', '${hash}', 'Admin User', 'admin');`);
console.log('\n=================================\n');
