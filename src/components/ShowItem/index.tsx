import { FC, createRef } from 'react';
import { ShowInterface } from "../../fakeApi";
import ShowItemModal from './Modal/index2';

interface ShowItemProps {
    show: ShowInterface
}

const ShowItem: FC<ShowItemProps> = ({ show }) => {
    const wrapperRef = createRef<HTMLDivElement>();

    return (<>
        <ShowItemModal show={show}>
            <div ref={wrapperRef} className="relative p16x9 rounded-md text-white hover:cursor-pointer" style={{ backgroundColor: '#222', backgroundImage: 'linear-gradient(transparent,#000)' }}>
                <img src={show.picture} className="absolute top-0 left-0 rounded-md z-20" alt={show.name + ' cover'} loading="lazy" />
                <div className="absolute bottom-0 left-0 w-full z-10">
                    <p className="pb-5 px-5 font-medium text-center overflow-hidden text-ellipsis max-w-full whitespace-nowrap">{show.name}</p>
                </div>
            </div>
        </ShowItemModal>
    </>);
};

export default ShowItem;