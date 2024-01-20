import { FC, ReactNode } from 'react';

interface VideoBodyProps {
    children: ReactNode,
    showTitleSrc: string
}

const VideoBody: FC<VideoBodyProps> = ({ children, showTitleSrc }) => {
    return (<>
        <div className="video-body">
            <div>
                <img className="w-full" src={showTitleSrc} alt="Show title" />
            </div>
            <div className="flex mt-4">
                { children }
            </div>
        </div>
    </>);
}

export default VideoBody;