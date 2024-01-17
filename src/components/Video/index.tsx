import { FC, PropsWithChildren, createRef, useEffect, useState } from 'react';
import './Video.css';

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
        <video ref={videoRef} autoPlay={true} className="w-full" src={src}></video>
        <div className="absolute left-0 bottom-0 w-full" style={{ background: 'linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)' }}>
            <div className="flex items-cente xl:mb-10">
                { children }
            </div>
        </div>
    </div>;
};

export default Video;