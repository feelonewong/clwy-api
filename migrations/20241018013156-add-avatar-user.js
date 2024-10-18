'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING
    })
  },

  // 执行回滚命令可以删掉这个字段
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'avatar')
  }
};
