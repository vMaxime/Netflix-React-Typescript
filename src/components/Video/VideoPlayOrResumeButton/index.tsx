import { FC, ButtonHTMLAttributes } from 'react';

const VideoPlayOrResumeButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
    return (
        <button className={'video-play-or-resume-button' + (!!className ? ' ' + className : '')} { ...props }>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"></path>
            </svg>
            <span className="font-medium xl:font-bold text-black">Lecture</span>
        </button>
    );
}

export default VideoPlayOrResumeButton;