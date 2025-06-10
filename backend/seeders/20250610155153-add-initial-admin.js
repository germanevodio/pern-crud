'use strict';
import bcrypt from 'bcryptjs';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);

    await queryInterface.bulkInsert('users', [{
        firstName: 'Root',
        lastName: 'Admin',
        email: 'admin@example.com',
        phoneNumber: '123-123-4567',
        role: 'admin',
        status: 'active',
        address: JSON.stringify({
            street: 'Admin Street',
            number: '123',
            city: 'Main city',
            postalCode: '12345'
        }),
        profilePicture: 'https://i.pravatar.cc/150',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
    }], {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
}
