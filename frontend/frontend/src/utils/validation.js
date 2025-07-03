export const authValidation = {
  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters'
    },
    maxLength: {
      value: 20,
      message: 'Username must be less than 20 characters'
    }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters'
    }
  }
};

export const gameValidation = {
  status: {
    required: 'Status is required'
  },
  rating: {
    min: {
      value: 1,
      message: 'Rating must be at least 1'
    },
    max: {
      value: 10,
      message: 'Rating must be at most 10'
    }
  },
  playtime: {
    min: {
      value: 0,
      message: 'Playtime cannot be negative'
    }
  }
};

export const reviewValidation = {
  content: {
    required: 'Review content is required',
    minLength: {
      value: 10,
      message: 'Review must be at least 10 characters'
    },
    maxLength: {
      value: 2000,
      message: 'Review must be less than 2000 characters'
    }
  }
};