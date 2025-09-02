import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button'; // Confirm this path
import { User } from 'lucide-react'; // Icon for profiles

const dummyProfiles = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Alex Brown', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const VideoCallPage: React.FC = () => {
  const navigate = useNavigate();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
  const [peerName, setPeerName] = useState<string>('');

  const myVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = () => {
      if (!selectedPeer) return;
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          console.log('Available devices:', devices);
          const hasVideo = devices.some((device) => device.kind === 'videoinput');
          const hasAudio = devices.some((device) => device.kind === 'audioinput');

          const constraints = {
            video: hasVideo ? { facingMode: 'user' } : false,
            audio: hasAudio ? true : false,
          };

          return navigator.mediaDevices.getUserMedia(constraints);
        })
        .then((stream) => {
          if (!isMounted || !stream) {
            throw new Error('Stream acquisition failed or component unmounted');
          }
          console.log('Camera stream acquired:', stream);
          setMyStream(stream);
          if (myVideoRef.current) myVideoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error('Media Error Details:', err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('Camera/mic access denied. Allow permissions:\n1. Click lock icon (left of URL).\n2. Select "Site settings".\n3. Set Camera and Microphone to "Allow".\n4. Reload and retry.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera or mic found. Check device connections.');
          } else {
            setError(`Media access failed: ${err.message}. Reload and try again.`);
          }
        });
    };

    if (selectedPeer) startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [selectedPeer]);

  const stopCamera = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
      if (myVideoRef.current) myVideoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  const endCall = () => {
    stopCamera();
    setCallActive(false);
    setSelectedPeer(null);
    setPeerName('');
    navigate('/dashboard/entrepreneur');
  };

  const startCallWithPeer = (peerId: string, name: string) => {
    setSelectedPeer(peerId);
    setPeerName(name);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <p className="text-red-500 text-lg mb-4 whitespace-pre-wrap">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!selectedPeer) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Select a Peer to Call</h1>
        {dummyProfiles.map((profile) => (
          <div key={profile.id} className="flex items-center mb-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => startCallWithPeer(profile.id, profile.name)}>
            <img src={profile.avatar} alt={profile.name} className="w-12 h-12 rounded-full mr-4" />
            <span className="text-lg">{profile.name}</span>
            <User className="ml-2 text-gray-500" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Video Call with {peerName}</h1>
      <div className="flex space-x-4 mb-4">
        <video ref={myVideoRef} autoPlay playsInline muted className="w-96 h-64 border border-gray-300 rounded-lg" />
      </div>
      <div className="flex space-x-4">
        <Button variant="destructive" onClick={endCall}>End Call</Button>
        <Button variant="outline" onClick={toggleVideo}>
          Video {videoEnabled ? 'On' : 'Off'}
        </Button>
        <Button variant="outline" onClick={toggleAudio}>
          Audio {audioEnabled ? 'On' : 'Off'}
        </Button>
      </div>
    </div>
  );
};

export default VideoCallPage;