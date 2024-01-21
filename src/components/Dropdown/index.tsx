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
                <DropdownContent
                    relativeElement={relativeElement}
                    onMouseOver={handleMouseOver}
                    onMouseLeave={handleMouseLeave}
                    onMouseClickOutside={handleMouseClickOutside}
                    borderTop={borderTop}
                >
                    {children}
                </DropdownContent>,
                relativeElement
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

    const handleMouseClickOutside = () => {
        console.log('click outside')
        if (portal === null)
            return;
        setHideTimeoutId(prevId => {
            if (prevId != null)
                clearTimeout(prevId);
            return null;
        });
        hide();
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

    let iconClassName = icon.props.className || '';
    if (!iconClassName.includes('relative'))
        iconClassName += ' relative';

    return (<>
        { cloneElement(icon, { className: iconClassName, onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave, onClick: show, ref }) }
        { portal }
    </>);
};

interface DropdownContentProps {
    children?: ReactNode,
    relativeElement: HTMLElement,
    onMouseOver(): void,
    onMouseLeave(): void,
    onMouseClickOutside(): void,
    borderTop?: boolean
}

const DropdownContent: FC<DropdownContentProps> = ({ children, relativeElement, onMouseOver, onMouseLeave, onMouseClickOutside, borderTop }) => {
    const ref = createRef<HTMLDivElement>();
    const [style, setStyle] = useState<CSSProperties>({borderTop: borderTop ? '1px solid' : '', visibility: 'hidden'});

    useEffect(() => {
        if (ref.current === null)
            return;

        const element = ref.current as HTMLElement;

        const relativeRect = relativeElement.getBoundingClientRect();
        const relativeHeight = relativeRect.height;

        setStyle({...style,
            top: `calc(${relativeHeight}px + 1rem)`,
            right: '0px',
            visibility: 'visible'
        });
        element.focus();

        const handleClick = (e: MouseEvent) => {
            if (!element.contains(e.target as Node))
                onMouseClickOutside();
        }

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
    

    return (
        <div tabIndex={-1} autoFocus className="dropdown" ref={ref} style={style} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
            { children }
        </div>
    );
};

export default Dropdown;