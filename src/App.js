import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, OrthographicCamera, Sphere, Stars, useGLTF, useAnimations } from '@react-three/drei';
import { MessageCircle, Send, UserCircle, Bot, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import ReactAudioPlayer from 'react-audio-player';
import { Avatar } from './components/Avatar';
import { Bg } from './components/Background';
import { OrbitControls} from '@react-three/drei';


const ResponsiveAvatarWrapper = ({ 
  avatar_url, 
  speak, 
  setSpeak, 
  text,
  setText, // Pass setText as a prop 
  setAudioSource, 
  playing 
}) => {
  return (
    <div className="w-full h-full relative">
     <Canvas
        className="w-full h-full"
        Camera={{ 
          fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] 
        }}
        shadows
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />

        {/* Background */}
        <Bg />

        {/* Avatar and controls */}
        <Avatar
          avatar_url={avatar_url}
          speak={speak}
          setSpeak={setSpeak}
          text={text}
          setText={setText}
          setAudioSource={setAudioSource}
          playing={playing}
          animation="typingAnimation"
        />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          minDistance={0.5}
          maxDistance={1}
          rotation={[0, Math.PI / 2, Math.PI / 2]}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI /60} // Limit horizontal rotation
          maxAzimuthAngle={Math.PI / 90}  // Limit horizontal rotation
          target={[0, 1.5, 0]}
          zoom0={100}
          autoRotate={true}              // Enable auto rotation
          autoRotateSpeed={0.5}          // Set rotation speed
        />
        <Environment preset="city" />
      </Canvas>

      {/* Optional overlay controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200"
          onClick={() => setSpeak(!speak)}
        >
          {speak ? 'Stop' : 'Speak'}
        </button>
      </div>
    </div>
  );
};

const ChatApp = () => {
  const audioPlayer = useRef();
  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState("");
  const [audioSource, setAudioSource] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: "Hi! I'm Arwen, a virtual human. Type your message and I'll speak it with realistic facial movements."
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!text.trim()) return;
  //   setMessages(prev => [...prev, { type: 'user', content: text }]);
  //   setSpeak(true);
  // };

  const ChatWindow = ({ message, type }) => (
    <div className={`flex items-start space-x-2 ${type === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
      {type === 'assistant' && (
        <div className="shrink-0">
          <Bot className="w-6 h-6 text-blue-500" />
        </div>
      )}
      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
        type === 'user'
          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
          : 'bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-lg text-gray-100'
      }`}>
        <p className="text-sm md:text-base">{message}</p>
      </div>
      {type === 'user' && (
        <div className="shrink-0">
          <UserCircle className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );

  const InputField = ({ value, onChange, speak, disabled }) => (
    <div className="flex space-x-2">
      <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`flex-1 bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
      placeholder="Type your message..."
      maxLength={200}
      disabled={disabled}
      />
    </div>
  );

  useEffect(() => {
    if (text && text !== messages[messages.length - 1]?.content) {
      setMessages(prev => [...prev, { type: 'assistant', content: text }]);
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const userMessage = text;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setSpeak(true);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full md:w-3/5 h-1/2 md:h-full'} bg-gray-800 rounded-3xl shadow-2xl`}>
          <div className="absolute top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-700 rounded-t-3xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <span className="text-white font-medium">Virtual Assistant</span>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-gray-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-300 hover:text-white"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <ResponsiveAvatarWrapper 
            avatar_url="/model1.glb"
            speak={speak}
            setSpeak={setSpeak}
            text={text}
            setText={setText}
            setAudioSource={setAudioSource}
            playing={playing}
          />
        </div>

        {!isFullscreen && (
          <div className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col bg-gray-800 rounded-3xl shadow-2xl">
            <div className="p-4 bg-gray-900 border-b border-gray-700 rounded-t-3xl">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-medium text-white">Chat History</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 rounded-b-3xl">
              {messages.map((message, index) => (
                <ChatWindow key={index} message={message.content} type={message.type} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-700 rounded-b-3xl">
              <InputField
                value={text}
                onChange={setText}
                speak={speak}
                disabled={speak}
              />
              <button
                type="submit"
                disabled={speak}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center space-x-2 ${
                  speak ? 'opacity-50' : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'
                }`}
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{speak ? 'Speaking...' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      <ReactAudioPlayer
        src={audioSource}
        ref={audioPlayer}
        onEnded={() => {
          setAudioSource(null);
          setSpeak(false);
          setPlaying(false);
        }}
        onCanPlayThrough={() => {
          audioPlayer.current.audioEl.current.play();
          setPlaying(true);
        }}
      />
    </div>
  );
};

export default ChatApp;