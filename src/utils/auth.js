export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };
  
  export const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  