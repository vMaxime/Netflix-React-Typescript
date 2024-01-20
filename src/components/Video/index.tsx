import { FC, PropsWithChildren, createRef, useEffect } from 'react';
import './Video.css';
import VideoBody from './VideoBody';
import VideoToggleButton from './VideoToggleButton';
import VideoMoreInfosButton from './VideoMoreInfosButton';
import VideoPlayOrResumeButton from './VideoPlayOrResumeButton';

interface VideoProps {
    src: string,
    volume?: number
}

const Video: FC<PropsWithChildren<VideoProps>> = ({ src, volume, children }) => {

    const videoRef = createRef<HTMLVideoElement>();

    useEffect(() => {
        if (videoRef.current === null)
            return;

        const videoElement = videoRef.current as HTMLVideoElement;
        videoElement.volume = volume || 1;
        
        const handleClick = () => videoElement.play();

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return <div className="video">
        <video ref={videoRef} autoPlay={true} src={src}></video>
        <div className="video-content-wrapper">
            <div className="video-content">
                { children }
            </div>
        </div>
    </div>;
};

export { Video, VideoBody, VideoPlayOrResumeButton, VideoToggleButton, VideoMoreInfosButton };