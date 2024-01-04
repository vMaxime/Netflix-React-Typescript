import { FC, createRef } from "react";
import { ShowInterface } from "../../fakeApi";

interface ShowItemProps {
    show: ShowInterface,
    sliderItemIndex?: number,
    onHover?(show: ShowInterface, wrapperElement: HTMLDivElement): void 
}

const ShowItem: FC<ShowItemProps> = ({ show, sliderItemIndex, onHover }) => {

    const wrapperRef = createRef<HTMLDivElement>();

    const handleMouseEnter = () => {
        if (onHover != null && wrapperRef.current != null)
            onHover(show, wrapperRef.current);
    };

    let className = 'h-32 w-56 min-w-56 hover:cursor-pointer relative';
    if (sliderItemIndex != null)
        className += ' slider-item-' + sliderItemIndex;

    return (
        <div ref={wrapperRef} className={className}>
            <div className="w-56 h-32 relative rounded-md text-white flex" onMouseEnter={handleMouseEnter} style={{ backgroundColor: '#222', backgroundImage: 'linear-gradient(transparent,#000)' }}>
                <img src={show.picture} className="w-56 h-full rounded-md absolute top-0 left-0 z-10" alt={show.name + ' cover'} loading="lazy" />
                <p className="mt-auto mx-auto pb-5 px-5 font-medium overflow-hidden text-ellipsis max-w-full whitespace-nowrap">{show.name}</p>
            </div>
        </div>  
    );
};

export default ShowItem;