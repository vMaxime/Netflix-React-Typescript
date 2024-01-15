import { FC, PropsWithChildren, createRef, useEffect, useState } from 'react';
import './Video.css';

interface VideoProps {

}

const Video: FC<PropsWithChildren<VideoProps>> = ({ children }) => {

    const videoRef = createRef<HTMLVideoElement>();

    return <div className="video">
        <video ref={videoRef} autoPlay={true} className="w-full h-full" src="https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-tree-covered-hill-41537-large.mp4"></video>
        <div className="absolute left-0 bottom-0 w-full" style={{ background: 'linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)' }}>
            <div className="flex items-cente xl:mb-10">
                { children }
            </div>
        </div>
    </div>;
};

export default Video;