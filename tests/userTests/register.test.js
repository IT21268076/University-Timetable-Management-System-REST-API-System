    // Throw an error if username already exists
    it('should throw an error if username already exists', async () => {
        const userData = {
          username: 'existinguser',
          password: 'testpassword'
        };
  
        const User = require('../../src/Models/User');
        jest.mock('../../src/Models/User');
        User.findOne.mockResolvedValue({ username: 'existinguser' });
  
        const register = require('../../src/Services/userService').register;
  
        await expect(register(userData)).rejects.toThrow('Username already exists');
      }, 10000)