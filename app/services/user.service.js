class UserService {
  async createUser(userData) {
    const userTypeHandlers = {
      student: this.createStudentUser,
      placement_cell: this.createPlacementCellUser,
      recruiter: this.createRecruiterUser
    };
    
    const handler = userTypeHandlers[userData.type];
    return handler(userData);
  }

  async createStudentUser(data) {
    // 1. Validate student email domain
    await DomainService.validateStudentDomain(data.email);
    
    // 2. Create user
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      type: 'student'
    });

    // 3. Create student profile
    await Student.create({
      student_id: user.user_id,
      enrollment_number: data.enrollment_number,
      // ... other fields
    });

    return user;
  }
}