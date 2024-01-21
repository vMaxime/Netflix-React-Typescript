import { FC, ReactNode, ReactElement, cloneElement, useEffect, createRef, useState, ReactPortal } from 'react';
import './Sidebar.css';
import { createPortal } from 'react-dom';

interface SidebarProps {
    icon: ReactElement,
    children?: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ icon, children }) => {

    const ref = createRef();
    
    const [sidebarState, setSidebarState] = useState<SidebarState | null>(null);
    const [refCurrentElement, setRefCurrentElement] = useState<HTMLElement | null>(null);

    const toggle = () => {
        if (sidebarState === null)
            setSidebarState('idle');
        else if (sidebarState === 'visible')
            setSidebarState('hiding');
    };

    const hide = () => {
        setSidebarState('hiding');
    };

    useEffect(() => {
        if (sidebarState === null || ref.current === null)
            return;

        let timeoutId: number | null = null;

        if (sidebarState === 'idle') {
            timeoutId = setTimeout(() => {
                setSidebarState('showing');
                timeoutId = null;
            }, 1);
        } else if (sidebarState === 'showing') {
            timeoutId = setTimeout(() => {
                setSidebarState('visible');
                timeoutId = null;
            }, 300);
        } else if (sidebarState === 'hiding') {
            timeoutId = setTimeout(() => {
                setSidebarState(null);
                timeoutId = null;
            }, 300);
        }
            
        return () => {
            if (timeoutId != null)
                clearTimeout(timeoutId);
        }
    }, [sidebarState]);

    useEffect(() => {
        if (ref.current === null)
            return;

        const element = ref.current as HTMLElement;
        setRefCurrentElement(element);

        const handleClick = (e: MouseEvent) => {
            if (!element.contains(e.target as Node))
                hide();
        }

        window.addEventListener('click', handleClick);
        return () => {
            setRefCurrentElement(null);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return (<>
    { cloneElement(icon, { onClick: toggle, ref }) }
    { refCurrentElement != null && sidebarState != null ?
        createPortal(
            <div tabIndex={0} className={'sidebar' + (sidebarState != 'idle' ? ' ' + sidebarState : '')}>
                { children }
            </div>,
            refCurrentElement
        )
        : null
    }
    </>);
};

type SidebarState = 'idle' | 'showing' | 'visible' | 'hiding';

export default Sidebar;