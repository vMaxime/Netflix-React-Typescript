import { CSSProperties, FC, ReactNode, createRef, useEffect, useState } from 'react';
import './Slider.css';

interface SliderProps {
    buttonsBackground?: string,
    items: ReactNode[],
    style?: CSSProperties
}

const Slider:FC<SliderProps> = ({ buttonsBackground, items, style }) => {
    
    const sliderRef = createRef<HTMLDivElement>();
    const contentRef = createRef<HTMLDivElement>();

    const [dimension, setDimension] = useState<[number, number]>([0, 0]);

    const [visibleIndexes, setVisibleIndexes] = useState<number[]>(Array(items.length).fill(null).map((a, i) => i));
    const [backwardIndexes, setBackwardIndexes] = useState<number[]>([]);
    const [forwardIndexes, setForwardIndexes] = useState<number[]>([]);

    const [parts, setParts] = useState<number>(0);
    const [currentPart, setCurrentPart] = useState<number>(0);
    const [itemsPerPart, setItemsPerPart] = useState<number>(0);
    const [moving, setMoving] = useState<boolean>(false);

    const [hasTransition, setHasTransition] = useState<boolean>(true);
    const [x, setX] = useState<number>(0);

    const adjust = (totalWidth: number, itemWidth: number) => {
        const itemsPerPart = Math.floor(totalWidth / itemWidth);
        const parts = Math.floor(items.length / itemsPerPart);
        setParts(parts);
        setItemsPerPart(itemsPerPart);
        calculate(currentPart, parts, itemsPerPart);
        setCurrentPart(Math.min(currentPart, parts));
    }

    useEffect(() => {
        const handleResize = () => {
            if (contentRef.current === null)
                return;

            const element = contentRef.current.children[0];
            const totalWidth = contentRef.current.getBoundingClientRect().width;
            const itemWidth = element.getBoundingClientRect().width;
            if (dimension[0] === totalWidth && dimension[1] === itemWidth)
                return;
            setDimension([totalWidth, itemWidth]);
            adjust(totalWidth, itemWidth);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [contentRef]);

    const getBackwardIndexes = (length: number, index: number, count: number): number[] =>  {
        let exceed = false;
        const backwardIndexes: number[] = [];
        for (let i = 1; i <= count; i++) {
            if (index - i < 0) {
                if (!exceed || currentPart === 0 || currentPart === parts)
                    backwardIndexes.unshift(length + index - i);
                exceed = true;
            }
            else backwardIndexes.unshift(index - i);
        }
        return backwardIndexes;
    };

    const getForwardIndexes = (length: number, index: number, count: number): number[] => {
        let exceed = false;
        const forwardIndexes: number[] = [];
        for (let i = 1; i <= count; i++) {
            if (index + i >= length) {
                if (!exceed || currentPart === parts || currentPart === 0)
                    forwardIndexes.push(index + i - length);
                exceed = true;
            } 
            else forwardIndexes.push(index + i);
        }
        return forwardIndexes;
    };

    const getNextPart = (part: number, parts: number): number => part === parts ? 0 : part + 1;
    const getPrevPart = (part: number, parts: number): number => part === 0 ? parts : part - 1;
    const getItemsInPart = (part: number, parts: number, itemsPerPart: number): number => part === parts ? items.length % itemsPerPart || itemsPerPart : itemsPerPart;

    useEffect(() => {
        if (moving || x === 0)
            return;

        const xBase = (backwardIndexes.length + 1) / itemsPerPart * 100;

        setHasTransition(false);
        setX(-xBase);
    }, [visibleIndexes]);

    const moveLeft = () => {
        if (moving || x === 0)
            return;

        const newPart = getPrevPart(currentPart, parts);
        let newX = backwardIndexes.length / itemsPerPart * 100;

        setMoving(true);
        setHasTransition(true);
        setX(x + newX);

        setTimeout(() => {
            setMoving(false);
            setCurrentPart(newPart);
        }, 500);
    };

    const moveRight = () => {
        if (moving || contentRef.current === null || contentRef.current.children.length === 0)
            return;
        
        const newPart = getNextPart(currentPart, parts);
        const newX = forwardIndexes.length / itemsPerPart * 100;

        setMoving(true);
        setHasTransition(true);
        setX(x - newX);

        setTimeout(() => {
            setMoving(false);
            setCurrentPart(newPart);
        }, 500);
    };

    const calculate = (part: number, parts: number, itemsPerPart: number) => {
        if (parts === 0)
            return;

        const firstIndex = part * itemsPerPart;

        let visibleStart = x === 0 ? -1 : Math.max(firstIndex - 2, -1);
        if (x != 0 && currentPart === 0)
            visibleStart = items.length - 2;
        else if (x != 0 && currentPart === parts)
            visibleStart = items.length - 2 - itemsPerPart;

        let newVisibleIndexes: number[] = getForwardIndexes(items.length, visibleStart, itemsPerPart + 2);
        setVisibleIndexes(newVisibleIndexes);

        const itemsInPreviousPart = getItemsInPart(part === 0 ? part : part === parts ? parts : getPrevPart(part, parts), parts, itemsPerPart);
        const newBackwardIndexes: number[] = x === 0 ? backwardIndexes : getBackwardIndexes(items.length, newVisibleIndexes[0], itemsInPreviousPart);
        setBackwardIndexes(newBackwardIndexes);

        const itemsInNextPart = getItemsInPart(getNextPart(part, parts), parts, itemsPerPart);
        const newForwardIndexes: number[] = getForwardIndexes(items.length, newVisibleIndexes[newVisibleIndexes.length - 1], itemsInNextPart);
        setForwardIndexes(newForwardIndexes);
    };
    
    useEffect(() => {
        calculate(currentPart, parts, itemsPerPart);
    }, [currentPart]);

    return (
        <div ref={sliderRef} className="slider" style={style}>
            {   x === 0 ? null :
                <button className="move-left" onClick={moveLeft} style={{ background: buttonsBackground || 'linear-gradient(270deg,#141414 0,hsla(0,0%,8%,.4))' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
                    </svg>
                </button>
            }
            <div className="slider-mask">
                <div key={dimension[0] + ':' + dimension[1]} ref={contentRef} className="slider-content" style={{ transform: 'translateX(' + x + '%)', transition: 'transform ' + (hasTransition ? '.5s' : '0s') }}>
                    {
                        backwardIndexes.map(index =>
                            <div key={'backward' + index} className="slider-item">
                                { items[index] }
                            </div>
                        )
                    }
                    {
                        visibleIndexes.map((index, i) =>
                            <div key={'visible' + i} className={`slider-item slider-item-` + i}>
                                { items[index] }
                            </div>
                        )
                    }
                    {
                        forwardIndexes.map(index =>
                            <div key={'forward' + index} className="slider-item">
                                { items[index] }
                            </div>
                        )
                    }
                </div>
            </div>
            <button className="move-right" onClick={moveRight} style={{ background: buttonsBackground || 'linear-gradient(270deg,#141414 0,hsla(0,0%,8%,.4))' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
            </button>
        </div>
    );
};

export default Slider;