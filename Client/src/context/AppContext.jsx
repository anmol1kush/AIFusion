import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyChats, dummyUserData } from '../assets/assets'
import axios from 'axios'
import toast from 'react-hot-toast';

axios.defaults.baseURL= import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectChat, setSelectChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme')|| 'light');
  const [token,setToken]= useState(localStorage.getItem('token')||null);
  const [loadingUser,setLoadingUser]= useState(true)

  // Fetch user (dummy for now)
  const fetchUser = async () => {
    try {
    const {data}=  await axios.get('/api/user/data',{headers:{Authorization:token}})
     if(data.success){
      setUser(data.user);
     
     }else{
      toast.error(data.message)
     }
    } catch (error) {
      toast.error(data.message)
      
    }finally{
      setLoadingUser(false)
    }
  };
const createNewChat = async () => {
  try {
    if (!user) return toast.error("Login to create new chat");

    const { data } = await axios.get('/api/chat/create', {
      headers: { Authorization: token },
    });

    if (data.success) {
      await fetchUserChats();
      toast.success("New chat created");
    } else {
      toast.error(data.message || "Failed to create chat");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Unknown error");
  }
};

 

  // Fetch user chats (dummy for now)
 const fetchUserChats = async () => {
  try {
    const { data } = await axios.get('/api/chat/get', {
      headers: { Authorization: token }
    });

    if (data.success) {
     
      setChats(data.message);

   
      if (data.message.length === 0) {
        await createNewChat();
        return fetchUserChats();
      } else {
     
        setSelectChat(data.message[0]);
       
      }
    } else {
    
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error fetching chats");
  }
};

   useEffect(() => {
    if(token){
      fetchUser()
    }else{
      setUser(null)
      setLoadingUser(false)
    }
  }, [token]);

  // Handle theme switching
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Refetch chats whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectChat(null);
    }
  }, [user]);

  const value = {
    navigate,
    user,
    setUser,
    chats,
    setChats,
    selectChat,
    setSelectChat,
    theme,
    fetchUser,
    setTheme,
    createNewChat,
    loadingUser,
    fetchUserChats,
    token,
    setToken,
    axios
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
