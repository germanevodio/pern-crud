'use strict';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    const users = [];
    const hashedPassword = await bcrypt.hash('password123', 10);

    for (let i = 0; i < 50; i++) {
        users.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number('###-###-####'),
            role: faker.helpers.arrayElement(['user', 'admin']),
            status: faker.helpers.arrayElement(['active', 'inactive']),
            address: JSON.stringify({
                street: faker.location.streetAddress(),
                number: faker.location.buildingNumber(),
                city: faker.location.city(),
                postalCode: faker.location.zipCode()
            }),
            profilePicture: faker.image.avatar(),
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    await queryInterface.bulkInsert('users', users, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
}
