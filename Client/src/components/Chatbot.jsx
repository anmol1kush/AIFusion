// Chatbot.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const Chatbot = () => {
  const containerRef = useRef(null)
  const endRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)


  const { selectChat,theme,axios,user,token,setUser}= useAppContext();


  // Reliable scroll: requestAnimationFrame + sentinel + MutationObserver fallback
  useEffect(() => {
    const scrollToBottom = () => {
      if (endRef.current) {
        endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      } else if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBottom)
    })

    const container = containerRef.current
    if (!container) return
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      })
    })
    observer.observe(container, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [messages])

  useEffect(()=>{
    if(selectChat){
      setMessages(selectChat.messages)
    }
  },[selectChat])

  const onSubmit = async (e) => {
    try {
      e.preventDefault()
       if( !user){
        return toast("Login to send message")
       }
       setLoading(true)
       const promptcopy= prompt
       console.log("prompt",prompt)
       setPrompt('')
       setMessages(prev=>[...prev,{role:'user',content:prompt,timestamp:Date.now(),isImage:false}])
        console.log( " mode",mode)
       const {data}=await axios.post(`/api/message/${mode}`,{chatId: selectChat._id,prompt,isPublished},{headers:{Authorization: token}})
         console.log("data",data)
       if( data.success){
        setMessages(prev=>[...prev,data.reply])
        //decrese credist

        if( mode==='image'){
          setUser(prev=>({...prev,credits:prev.credits-2}))
        }else{
          setUser(prev=>({...prev,credits:prev.credits-1}))
        }

       }else{
        toast.error(data.message)
        setPrompt(promptcopy)
       }
    } catch (error) {
      toast.error(error.message)
      
    }finally{
      setPrompt('')
      setLoading(false)
    }
 
  
  }

  return (
    <div className='h-full w-full flex flex-col justify-between p-5'>
      {/* messages area */}
      <div ref={containerRef} className='flex-1 overflow-auto pr-4'>
        {messages.length === 0 ? (
          <div className='h-full  flex flex-col items-center justify-center gap-2 text-primary'>
            {/* <img
              src={theme === 'dark' ? assets.logo_white : assets.logo_white}
              alt=''
              className='w-full max-w-56 sm:max-w-68'
            /> */}
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>
              Ask me anything
            </p>
          </div>
        ) : (
          messages.map((message, i) => <Message key={i} message={message} />)
        )}

        {loading && (
          <div className='loader flex items-center gap-1.5 my-4 justify-center'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce' />
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:.2s]' />
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:.4s]' />
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* input area */}
      <div className='mt-4'>
        {mode === 'image' && (
  <div className='flex justify-center mb-3'>
    <label className='flex items-center gap-2 text-sm text-gray-600 dark:text-white'>
      <p className='text-xs'>Publish Generated Image to Community</p>
      <input
        type='checkbox'
        className='cursor-pointer accent-primary'
        checked={isPublished}
        onChange={(e) => setIsPublished(e.target.checked)}
      />
    </label>
  </div>
)}

<form
        onSubmit={onSubmit}
        className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className='text-sm pl-3 pr-2 outline-none bg-transparent dark:text-white cursor-pointer'
        >
          <option className='dark:bg-purple-900' value='text'>Text</option>
          <option className='dark:bg-purple-900' value='image'>Image</option>
        </select>

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type='text'
          placeholder='Type your prompt here...'
          className='flex-1 w-full text-sm outline-none bg-transparent dark:text-white'
          required
        />

        <button
          type='submit'
          disabled={loading}
          className={`transition-transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className='w-8'
            alt='send'
          />
        </button>
      </form>
      </div>
    </div>
  )
}

export default Chatbot
