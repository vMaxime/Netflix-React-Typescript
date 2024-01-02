import { FC, PropsWithChildren, ReactElement, createRef, useEffect, useState, MouseEvent } from "react";

interface DropdownProps {
    showOnHover?: boolean,
    icon: ReactElement | string,
    width?: string,
    border?: boolean,
    carpet?: boolean
}

const Dropdown: FC<PropsWithChildren<DropdownProps>> = ({ showOnHover, icon, width, border, carpet, children }) => {

    const contentRef = createRef<HTMLDivElement>();
    const carpetRef = createRef<HTMLDivElement>();
    const wrapperRef = createRef<HTMLDivElement>();
    const [visible, setVisible] = useState<boolean>(false);
    const [hideTimeoutId, setHideTimeoutId] = useState<number | null>(null);

    let className = 'absolute top-0 right-0 bg-black mt-12 flex flex-wrap outline-none';
    if (border)
        className += ' border-t border-white-2';

    if (!visible)
        className += ' hidden';

    const handleMouseEnter = () => {
        setHideTimeoutId(hideTimeoutId => {
            if (hideTimeoutId != null)
                clearTimeout(hideTimeoutId);
            return null;
        });
    };

    const handleMouseLeave = (e: MouseEvent) => {
        if (wrapperRef.current != null) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if (mouseX >= 0 && mouseX <= wrapperRef.current.clientWidth && mouseY >= 0 && mouseY <= wrapperRef.current.clientHeight)
                return;
        }
        
        setHideTimeoutId(hideTimeoutId => {
            if (hideTimeoutId != null)
                clearTimeout(hideTimeoutId);

            return setTimeout(hide, 1000);
        });
    };

    const show = () => {
        if (visible)
            return;
        handleMouseEnter();
        document.dispatchEvent(new Event('dropdownshow'));
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    useEffect(() => {
        const handleBlur = (event: FocusEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.relatedTarget as Node))
                hide();
        };

        if (contentRef.current != null) {
            contentRef.current.focus();
            contentRef.current.addEventListener('focusout', handleBlur);
        }

        const handleDropdownShow = () => hide();
        document.addEventListener('dropdownshow', handleDropdownShow);
        return () => {
            document.removeEventListener('dropdownshow', handleDropdownShow);
            if (contentRef.current != null)
                contentRef.current.removeEventListener('focusout', handleBlur);
        };
    }, []);

    useEffect(() => {
        if (!visible || carpetRef.current === null || wrapperRef.current === null)
            return;

        carpetRef.current.style.top = (wrapperRef.current.getBoundingClientRect().top + 5) + 'px';
    }, [visible]);

    return (
        <div ref={wrapperRef} className="relative flex" onClick={show}>
            <button className={'relative' + (carpet ? ' mr-5' : '')} onMouseEnter={() => { if (showOnHover) show(); }} onMouseLeave={handleMouseLeave}>
                {icon}
                <svg className={carpet ? 'absolute -right-5 top-1/4' : 'hidden'} fill="#FFF" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512">
                    <polygon points="64 144 256 368 448 144 64 144"/>
                </svg>
            </button>
            {
                <>
                    <div ref={carpetRef} className={'absolute w-full h-full flex' + (carpet ? ' pr-4' : '') + (!visible ? ' hidden' : '')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <svg className="rotate-180 m-auto" fill="#FFF" xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 512 512">
                            <polygon points="64 144 256 368 448 144 64 144"/>
                        </svg>
                    </div>
                    <div tabIndex={0} ref={contentRef} className={className} style={{ width: width || 'auto', maxWidth: width || 'none', backgroundColor: 'rgba(0,0,0,.9)' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        { children }
                    </div>
                </>
            }
        </div>
    );
}

export default Dropdown;