import { FC, cloneElement, createRef, ReactNode, ReactElement, useState, ReactPortal, CSSProperties, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Dropdown.css';
import { getAbsolutePosition } from '../../utils';

export interface DropdownShowEvent {
    target: HTMLElement
}

interface DropdownProps {
    children?: ReactNode,
    icon: ReactElement,
    borderTop?: boolean
}

const Dropdown: FC<DropdownProps> = ({ icon, children, borderTop }) => {
    const ref = createRef();

    const [portal, setPortal] = useState<ReactPortal | null>(null);
    const [hideTimeoutId, setHideTimeoutId] = useState<number | null>(null);

    const show = () => {
        const relativeElement = ref.current as HTMLElement;
        if (!relativeElement)
            return;

        setPortal(prevPortal => {
            if (prevPortal != null)
                return prevPortal;

            return createPortal(
                <DropdownContent relativeElement={relativeElement} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} borderTop={borderTop}>
                    {children}
                </DropdownContent>,
                document.getElementById('root')!
            );
        });
    };

    const hide = () => setPortal(null);

    const handleMouseOver = () => {
        setHideTimeoutId(prevId => {
            if (prevId != null)
                clearTimeout(prevId);
            return null;
        });
        show();
    };
    const handleMouseLeave = () => {
        setHideTimeoutId(setTimeout(() => {
            setHideTimeoutId(null);
            hide();
        }, 300));
    };

    useEffect(() => {
        if (ref.current === null)
            return;

        const relativeElement = ref.current as HTMLElement;
        const chevron = relativeElement.querySelector('.chevron') as HTMLElement;
        if (chevron)
            chevron.style.transform = 'rotate(' + (portal === null ? 0 : 180) + 'deg)';

        if (portal != null)
            document.dispatchEvent(new Event('dropdownshow'));
        
        document.addEventListener('dropdownshow', hide);
        return () => document.removeEventListener('dropdownshow', hide);
    }, [portal]);

    return (<>
        { cloneElement(icon, { onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave, onClick: show, ref }) }
        { portal }
    </>);
};

interface DropdownContentProps {
    children?: ReactNode,
    relativeElement: HTMLElement,
    onMouseOver(): void,
    onMouseLeave(): void,
    borderTop?: boolean
}

const DropdownContent: FC<DropdownContentProps> = ({ children, relativeElement, onMouseOver, onMouseLeave, borderTop }) => {
    const ref = createRef<HTMLDivElement>();
    const [style, setStyle] = useState<CSSProperties>({borderTop: borderTop ? '1px solid' : ''});

    useEffect(() => {
        if (ref.current === null)
            return;

        const { width } = ref.current.getBoundingClientRect();

        const relativeRect = relativeElement.getBoundingClientRect();
        const [relativeTop, relativeLeft] = getAbsolutePosition(relativeElement);
        const relativeHeight = relativeRect.height;
        const relativeWidth = relativeRect.width;

        const top = relativeTop + relativeHeight;
        const left = relativeLeft - width + relativeWidth;

        setStyle({...style,
            top: `calc(${top}px + 1rem)`,
            left: left + 'px'
        });
        ref.current.focus();
    }, []);

    return (
        <div tabIndex={-1} autoFocus className="dropdown" ref={ref} style={style} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
            { children }
        </div>
    );
};

export default Dropdown;