import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { assets } from '../assets/assets'
import moment from "moment";
import toast from 'react-hot-toast';


const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectChat, theme, setTheme, user ,navigate,createNewChat,axios,setChats,fetchusersChats,setToken,token} = useAppContext();
  const [search, setSearch] = useState('');

const logout=()=>{
  localStorage.removeItem('token')
  setToken(null)
  toast.success('Logout Successfully')
}

const deleteChat = async (e, chatId) => {
  try {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    // ✅ get token from localStorage or context
   

    const { data } = await axios.post(
      '/api/chat/delete',
      { chatId },
      { headers: { Authorization: token } }
    );
   

    if (data.success) {
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      
      toast.success(data.message || "Chat deleted successfully");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting chat");
  }
};
  // ✅ Fix: close sidebar and navigate properly on mobile
  const handleChatClick = (chat) => {
    setSelectChat(chat);
    navigate('/', { replace: true });
    if (window.innerWidth <= 768) {
      setTimeout(() => setIsMenuOpen(false), 100); // small delay to ensure smooth transition
    }
  };

  return (
    <div className={`flex flex-col justify-between h-screen w-72 p-5 
      dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 
      border-r border-[#80609F]/30 backdrop-blur-3xl 
      transition-all duration-500 transform max-md:absolute left-0 z-10 
      ${!isMenuOpen ? 'max-md:-translate-x-full' : ''}`}>

      {/* ----------- TOP SCROLLABLE SECTION ----------- */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <img
          src={theme === 'dark' ? assets.logo_white : assets.logo_white}
          alt="logo"
          className='w-full max-w-60'
        />

        <button  onClick={createNewChat}className='flex justify-center items-center w-full py-2 mt-10 
          text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] 
          text-sm rounded-md cursor-pointer'>
          New Chat
        </button>

        <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>
          <img src={assets.search_icon} className='w-4 not-dark:invert' alt="search" />
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type='text'
            placeholder='Search Conversations'
            className='text-xs placeholder:text-gray-400 outline-none bg-transparent flex-1'
          />
        </div>

        {(chats?.length ?? 0) > 0 && <p className='mt-4 text-sm'>Recent Chats</p>}


       <div className="flex flex-col gap-2 mt-3">
  {(chats ?? [])        // ✅ if chats is undefined, use []
    .filter((chat) => {
      const firstMsg = chat.messages?.[0]?.content || '';
      const name = chat.name || '';
      return (
        firstMsg.toLowerCase().includes(search.toLowerCase()) ||
        name.toLowerCase().includes(search.toLowerCase())
      );
    })
    .map((chat) => (
      <div
        key={chat._id}
        onClick={() => handleChatClick(chat)}
        className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 
                   dark:border-[#80609F]/15 rounded-md cursor-pointer 
                   flex justify-between items-center group"
      >
        <div>
          <p className="truncate w-full">
            {(chat.messages?.length ?? 0) > 0
              ? chat.messages[0]?.content?.slice(0, 32)
              : chat.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
            {moment(chat.updatedAt).fromNow()}
          </p>
        </div>
        <img
          onClick={(e) =>
            toast.promise(deleteChat(e, chat._id), { loading: '...deleting' })
          }
          src={assets.bin_icon}
          alt="delete"
          className="hidden group-hover:block w-4 cursor-pointer dark:invert"
        />
      </div>
    ))}
</div>

      </div>

      {/* ----------- BOTTOM FIXED SECTION ----------- */}
      <div className="flex flex-col gap-3 pt-4 border-t border-gray-300 dark:border-white/15">
        <div
          onClick={() => {
            navigate('/community');
            setIsMenuOpen(false);
          }}
          className='flex items-center gap-2 p-3 border border-gray-300 dark:border-white/15 
          rounded-md cursor-pointer hover:scale-105 transition-all'
        >
          <img src={assets.gallery_icon} className='w-5 not-dark:invert' alt='gallery' />
          <p className='text-sm'>Community Image</p>
        </div>

        <div
          onClick={() => {
            navigate('/credits');
            setIsMenuOpen(false);
          }}
          className='flex items-center gap-2 p-3 border border-gray-300 dark:border-white/15 
          rounded-md cursor-pointer hover:scale-105 transition-all'
        >
          <img src={assets.diamond_icon} className='w-5 dark:invert' alt='credits' />
          <div className='flex flex-col text-sm'>
            <p>Credits: {user?.credits}</p>
            <p className='text-xs text-gray-400'>Purchase credits to use AIFusion</p>
          </div>
        </div>

        {/* <div className='flex items-center justify-between p-3 border border-gray-300 dark:border-white/15 rounded-md'>
          <div className='flex items-center gap-2 text-sm'>
            <img src={assets.theme_icon} className='w-5 not-dark:invert' alt='theme' />
            <p>Dark Mode</p>
          </div>
          <label className='relative inline-flex cursor-pointer'>
            <input
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              type='checkbox'
              className='sr-only peer'
              checked={theme === 'dark'}
              readOnly
            />
            <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
          </label>
        </div> */}
      </div>

      <div className='flex items-center gap-3 p-3 border border-gray-300 dark:border-white/15 rounded-md'>
        <img src={assets.user_icon} className='w-7 rounded-full' alt='user' />
        <p className='flex-1 text-sm dark:text-primary truncate'>
          {user ? user.name : "Login your account"}
        </p>
        {user && (
          <img
            onClick={logout}
            src={assets.logout_icon}
            className='h-5 cursor-pointer  not-dark:invert group-hover:block'
            alt='logout'
          />
        )}
      </div>

      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert'
        alt='close'
      />
    </div>
  );
};

export default Sidebar;
