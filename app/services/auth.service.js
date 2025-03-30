const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, PlacementCell, Recruiter } = require('../models');
const { 
  ConflictError, 
  UnauthorizedError, 
  ValidationError,
  NotFoundError 
} = require('../utils/errors');

class AuthService {
  // Unified registration for all user types
  static async registerUser(data) {
    try {
      const { type, email, password, ...typeData } = data;
      
      // Validate email uniqueness
      await this.validateEmailUniqueness(email);
      
      // Validate type-specific data
      await this.validateTypeSpecificData(data);

      // Create base user
      const user = await User.create({
        email,
        password: await bcrypt.hash(password, 12),
        type,
        is_active: type === 'student' // Students active immediately
      });

      // Create type-specific entity
      const entity = await this.createTypeEntity(type, user.user_id, typeData);

      // Generate tokens
      const tokens = this.generateTokens(user);

      return {
        user: user.toJSON(),
        entity,
        tokens
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Unified login for all user types
  static async loginUser(credentials) {
    const { email, password } = credentials;
    
    // Find user with associated entity
    const user = await User.findOne({ 
      where: { email },
      include: this.getEntityInclude(user.type)
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('Account is inactive');
    }

    return this.generateTokens(user);
  }

  // Token refresh
  static async refreshToken(refreshToken) {
    const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findByPk(userId, {
      attributes: ['user_id', 'type', 'is_active']
    });
    
    if (!user || !user.is_active) {
      throw new UnauthorizedError('Invalid token');
    }

    return this.generateTokens(user);
  }

  // Password reset
  static async resetPassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return User.update(
      { password: hashedPassword },
      { where: { user_id: userId } }
    );
  }

  // Helper methods
  static async createTypeEntity(type, userId, data) {
    const entityCreators = {
      student: async () => {
        const domain = data.email.split('@')[1];
        const placementCell = await PlacementCell.findOne({ 
          where: { domain, is_verified: true }
        });
        
        return Student.create({
          student_id: userId,
          enrollment_number: data.enrollment_number,
          name: data.name,
          placement_cell_id: placementCell?.placement_cell_id || null
        });
      },
      placement_cell: async () => {
        return PlacementCell.create({
          admin_id: userId,
          domain: data.domain,
          branches: data.branches,
          is_verified: false
        });
      },
      recruiter: async () => {
        return Recruiter.create({
          recruiter_id: userId,
          company_name: data.company_name,
          position: data.position
        });
      }
    };

    return entityCreators[type]();
  }

  static async validateEmailUniqueness(email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }
  }

  static async validateTypeSpecificData(data) {
    const { type, email } = data;
    
    if (type === 'student') {
      if (!data.enrollment_number || !data.name) {
        throw new ValidationError('Missing required student fields');
      }
      
      const domain = email.split('@')[1];
      const placementCell = await PlacementCell.findOne({ 
        where: { domain, is_verified: true }
      });
      
      if (!placementCell) {
        throw new ValidationError('Invalid student email domain');
      }
    }
    
    if (type === 'placement_cell') {
      if (!data.domain || !data.branches) {
        throw new ValidationError('Missing required placement cell fields');
      }
      
      const existing = await PlacementCell.findOne({ 
        where: { domain: data.domain }
      });
      if (existing) throw new ConflictError('Domain already registered');
    }
    
    if (type === 'recruiter') {
      if (!data.company_name || !data.position) {
        throw new ValidationError('Missing required recruiter fields');
      }
    }
  }

  static generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user.user_id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static getEntityInclude(userType) {
    const includes = {
      student: [{ model: Student, as: 'student_profile' }],
      placement_cell: [{ model: PlacementCell, as: 'managed_placement_cell' }],
      recruiter: [{ model: Recruiter, as: 'recruiter_profile' }]
    };
    return includes[userType] || [];
  }
}

module.exports = AuthService;