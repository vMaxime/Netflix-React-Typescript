import { FC, ButtonHTMLAttributes } from 'react';

const VideoMoreInfosButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
    return (
        <button className={'more-infos-button' + (!!className ? ' ' + className : '')} { ...props }>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"></path>
            </svg>
            <span className="font-medium xl:font-bold text-white">Plus d'infos</span>
        </button>  
    );
};

export default VideoMoreInfosButton;