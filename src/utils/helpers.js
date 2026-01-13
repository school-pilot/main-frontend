import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid Date';
  } catch {
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const checkAuthStatus = async () => {
  const token = localStorage.getItem('access_token');
  const savedProfile = localStorage.getItem('user_profile');
  
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    // Try to restore from saved profile first
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUser(profile);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }
    
    // Decode token to get user_id
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.user_id;
      
      // Fetch user profile
      const userResponse = await accountsAPI.getUser(userId);
      const userProfile = userResponse.data;
      
      if (userProfile) {
        // Ensure role is set
        if (!userProfile.role && userProfile.email) {
          userProfile.role = inferRoleFromEmail(userProfile.email);
        }
        
        setUser(userProfile);
        setIsAuthenticated(true);
        localStorage.setItem('user_profile', JSON.stringify(userProfile));
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.clear();
  } finally {
    setLoading(false);
  }
};