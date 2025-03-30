const { PlacementCell, User } = require('../models');
const bcrypt = require('bcryptjs');

class PlacementCellService {
  // Registration flow
  static async createPlacementCellUser(data) {
    const { email, password } = data;
    
    // 1. Extract domain from admin email
    const domain = email.split('@')[1];
    
    // 2. Create user
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 12),
      type: 'placement_cell',
      is_active: false // Require admin verification
    });

    // 3. Create minimal placement cell
    const placementCell = await PlacementCell.create({
      admin_id: user.user_id,
      domain,
      is_verified: false
    });

    return { user, placementCell };
  }

  // Profile completion
  static async updatePlacementCellProfile(adminId, updateData) {
    const placementCell = await PlacementCell.findOne({
      where: { admin_id: adminId }
    });

    if (!placementCell) {
      throw new Error('Placement cell not found');
    }

    // Domain update validation
    if (updateData.domain) {
      await this.validateDomainUpdate(placementCell, updateData.domain);
    }

    return placementCell.update(updateData);
  }

  // Admin verification
  static async verifyPlacementCell(placementCellId) {
    return PlacementCell.update(
      { is_verified: true },
      { where: { placement_cell_id: placementCellId } }
    );
  }

  // Domain management
  static async validateDomainUpdate(currentCell, newDomain) {
    // Check domain uniqueness
    const existing = await PlacementCell.findOne({
      where: { domain: newDomain }
    });

    if (existing && existing.placement_cell_id !== currentCell.placement_cell_id) {
      throw new Error('Domain already registered');
    }

    // Additional domain format validation if needed
    if (!this.isValidDomainFormat(newDomain)) {
      throw new Error('Invalid domain format');
    }
  }

  static isValidDomainFormat(domain) {
    const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  static async getByDomain(domain) {
    return PlacementCell.findOne({
      where: { 
        domain,
        is_verified: true,
        is_deleted: false
      }
    });
  }

  static async getPlacementCellByAdmin(adminId) {
    return PlacementCell.findOne({
      where: { admin_id: adminId },
      include: [{
        model: User,
        as: 'admin',
        attributes: ['user_id', 'email', 'is_active']
      }]
    });
  }
}

module.exports = PlacementCellService;