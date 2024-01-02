import { FC, createRef, cloneElement, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from 'react';
import './Slider.css';

const Slider: FC<PropsWithChildren> = ({ children }) => {

    const [items, setItems] = useState<ReactNode>(children);
    const itemsArray = items as ReactNode[];
    const [transitionDuration, setTransitionDuration] = useState(0);
    const [x, setX] = useState(0);
    const [moving, setMoving] = useState(false);
    const [overflowing, setOverflowing] = useState(true);

    const sliderRef = createRef<HTMLDivElement>();
    const wrapperRef = createRef<HTMLDivElement>();
    const buttonRef = createRef<HTMLButtonElement>();

    function isVisible(element: HTMLElement): boolean {
        const parentRect = document.documentElement.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        return elementRect.top >= parentRect.top &&
            elementRect.bottom <= parentRect.bottom &&
            elementRect.left >= parentRect.left &&
            elementRect.right <= parentRect.right;
    }

    function getElementsBackward<Type>(elements: Type[], index: number, count: number): Type[] {
        const backwardElements: Type[] = [];
        for (let i = 1; i <= count; i++) {
            if (index - i < 0) backwardElements.unshift(elements[elements.length + index - i]);
            else backwardElements.unshift(elements[index - i]);
        }
        return backwardElements;
    }

    /**
     * Slides to the left
     * @returns void
     */
    const moveLeft = () => {
        if (moving || !overflowing || wrapperRef.current === null || buttonRef.current === null || !items)
            return;

        let lastVisible = 0;
        let visibleCount = 0;
        const parent = wrapperRef.current as HTMLElement;
        const children = parent.children;
        for (let i = 0; i < children.length; i++) {
            const childElement = children[i] as HTMLElement;
            if (isVisible(childElement)) {
                lastVisible = i;
                visibleCount++;
            }
        }

        if (items === children) // didn't move right first
            return;

        const invisibleCount = itemsArray.length - visibleCount;
        let step = Math.max(Math.min(lastVisible, invisibleCount), 1);

        let newItems = items as ReactElement[];
        let backwardElements = getElementsBackward<ReactElement>(newItems, 0, step);
        let transitionDuration = 0.5;
        for (let i = backwardElements.length - 1; i > 0; i--) {
            if (backwardElements[i].key?.toString() === '0') {
                backwardElements = backwardElements.slice(i, backwardElements.length);
                transitionDuration = 0.8;
                break;
            }
        }
        newItems = newItems.map(item => !backwardElements.includes(item) ? item : cloneElement(item, { key: 'CLONE' + item.key }));
        newItems = [...backwardElements, ...newItems];
        
        setTransitionDuration(0);
        const fixedX = -(children[backwardElements.length].getBoundingClientRect().left - wrapperRef.current.getBoundingClientRect().left);
        setX(fixedX);

        setMoving(true);
        setItems(newItems);
        setTimeout(() => {
            setTransitionDuration(transitionDuration);
            setX(0);
        }, 0);

        setTimeout(() => {
            setMoving(false);
            newItems = newItems.filter(item => !item.key?.startsWith('CLONE'));
            setItems(newItems);
        }, transitionDuration * 1000);
    };

    /**
     * Slides to the right
     * @returns void
     */
    const moveRight = () => {
        if (!overflowing || !wrapperRef.current || moving)
            return;

        let visibleCount = 0;
        let lastVisible = 0;
        let firstElementAtStartIndex = 0;
        const parent = wrapperRef.current as HTMLElement;
        const children = parent.children;
        for (let i = 0; i < children.length; i++) {
            const childElement = children[i] as HTMLElement;
            if (isVisible(childElement)) {
                visibleCount++;
                lastVisible = i;
            }
            if (childElement.classList.contains(('slider-item-0')))
                firstElementAtStartIndex = i;
        }

        const invisibleCount = itemsArray.length - visibleCount;

        let newFirstElementIndex = Math.max(Math.min(lastVisible, invisibleCount), 1);
        if (firstElementAtStartIndex < newFirstElementIndex && firstElementAtStartIndex > 0) {
            newFirstElementIndex = firstElementAtStartIndex;
        }
        const newFirstElement = children[newFirstElementIndex] as HTMLElement;
        setMoving(true);
        let transitionDuration = newFirstElementIndex === firstElementAtStartIndex ? 0.8 : 0.5;
        setTransitionDuration(transitionDuration);
        // Move to the left rect of the element - wrapper left rect
        setX(-(newFirstElement.getBoundingClientRect().left - wrapperRef.current.getBoundingClientRect().left));

        let newItems = items as ReactElement[];
        if (newFirstElementIndex >= invisibleCount) {
            newItems = [...newItems, cloneElement(newItems[0], { key: 'CLONE0' })];
            setItems(newItems);
        }
        setTimeout(() => {
            newItems = newItems.filter(item => !item.key?.startsWith('CLONE'));
            setMoving(false);
            setItems([...newItems.slice(newFirstElementIndex, newItems.length), ...newItems.slice(0, newFirstElementIndex)]);
        }, transitionDuration * 1000);
    };

    useEffect(() => {
        if (!overflowing || !wrapperRef.current || moving) {
            return;
        }

        setTransitionDuration(0);
        setX(0);
    }, [items]);

    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current === null)
                return;
            const previousOverflowing = overflowing;
            let nowOverflowing = false;
            const parent = wrapperRef.current as HTMLElement;
            if (parent.children.length) {
                const lastChildren = parent.children[parent.children.length - 1];
                if (lastChildren.getBoundingClientRect().right > parent.getBoundingClientRect().right) {
                    nowOverflowing = true;
                }
            }
            setOverflowing(nowOverflowing);
            if (previousOverflowing != nowOverflowing && !nowOverflowing) {
                const newItems = items as ReactElement[];
                setItems(newItems.filter(item => !item.key?.startsWith('CLONE')));
            }
        };

        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [wrapperRef]);

    return (
        <div className="slider" ref={sliderRef}>
            {
                overflowing ?
                <>
                <button className="move-left" onClick={moveLeft}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
                    </svg>
                </button>
                <button ref={buttonRef} className="move-right" onClick={moveRight}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                    </svg>
                </button>
                </>
                : null
            }
            <div ref={wrapperRef} className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4" style={{ transform: 'translateX(' + x + 'px)', transition: 'transform ' + transitionDuration + 's ease-out 0s' }}>
                { items }
            </div>
        </div>
    );
}

export default Slider;