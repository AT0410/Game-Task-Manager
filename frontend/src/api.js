import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Adjust the base URL as needed
});


const fetchUser = async (token) => {
  try {
      const response = await axios.get('/user', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error("Fetch user profile error:", error);
      throw error;
  }
};

const loginUser = async (username, fullname, email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', loginData.username);
  formData.append('password', loginData.password);
  
  try {
    const response = await api.post(
        '/token',
        formDetails,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
    );
	return response.data;
      
    } catch (error) {
		console.log("Login error:", error);
         throw error;
  	}
}

const registerUser = async (userData) => {
  try {
    await api.post('/register', userData);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }

}


export default api;
export { fetchUser, registerUser };