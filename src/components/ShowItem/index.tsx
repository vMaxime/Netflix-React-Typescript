import { FC, createRef, useEffect, useState } from "react";
import { ShowInterface } from "../../fakeApi";

interface ShowItemProps {
    show: ShowInterface,
    onHover?(show: ShowInterface, wrapperElement: HTMLDivElement): void 
}

const ShowItem: FC<ShowItemProps> = ({ show, onHover }) => {

    const wrapperRef = createRef<HTMLDivElement>();

    const [toggleHover, setToggleHover] = useState<boolean>(false);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const handleMouseOver = () => {
        if (timeoutId != null)
            return;
        
        const id = setTimeout(() => {
            setToggleHover(true);
            setTimeoutId(null);
        }, 300);

        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId === null)
            return;

        clearTimeout(timeoutId);
        setTimeoutId(null);
    };

    useEffect(() => {
        if (wrapperRef.current === null)
            return;

        wrapperRef.current.onmousemove = handleMouseOver;
        wrapperRef.current.onmouseleave = handleMouseLeave;
    }, [wrapperRef]);

    useEffect(() => {
        if (onHover != null && wrapperRef.current != null && toggleHover)
            onHover(show, wrapperRef.current);
        setToggleHover(false);
    }, [toggleHover]);

    return (
        <div ref={wrapperRef} className="relative p16x9 rounded-md text-white hover:cursor-pointer" style={{ backgroundColor: '#222', backgroundImage: 'linear-gradient(transparent,#000)' }}>
            <img src={show.picture} className="absolute top-0 left-0 rounded-md z-20" alt={show.name + ' cover'} loading="lazy" />
            <div className="absolute bottom-0 left-0 w-full z-10">
                <p className="pb-5 px-5 font-medium text-center overflow-hidden text-ellipsis max-w-full whitespace-nowrap">{show.name}</p>
            </div>
        </div>  
    );
};

export default ShowItem;