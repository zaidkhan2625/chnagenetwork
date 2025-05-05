export const authorize = (user: { role: any; }, roles = []) => {
    if (!roles.includes(user.role)) {
      throw new Error('Access denied');
    }
  };

  