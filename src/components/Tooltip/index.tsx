import { FC, createRef, useEffect, useState, ReactNode, cloneElement, ReactElement, CSSProperties, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getAbsolutePosition } from '../../utils';
import './Tooltip.css';

export interface TooltipProps {
    children: ReactNode,
    message: string
}

interface PortalTooltipProps {
    relativeElement: HTMLElement,
    message: string
}

const PortalTooltip: FC<PortalTooltipProps> = ({ message, relativeElement }) => {
    const ref = createRef<HTMLDivElement>();
    const [style, setStyle] = useState<CSSProperties>({});

    useEffect(() => {
        if (ref.current === null)
            return;

        let [top, left] = getAbsolutePosition(relativeElement);
        const relativeRect = relativeElement.getBoundingClientRect();
        const tooltipRect = ref.current.getBoundingClientRect();
        left -= (tooltipRect.width - relativeRect.width) / 2;
        setStyle({
            top: `calc(${top}px - 56px)`,
            left: left + 'px'
        });
    }, [message]);

    return (
        <div className="tooltip" ref={ref} style={style}>
            <div className="tooltip-content">
                {message}
            </div>
        </div>
    );
};

const Tooltip: FC<TooltipProps> = ({ children, message }) => {

    const childrenRef = createRef();
    const [visible, setVisible] = useState<boolean>(false);
    const [portal, setPortal] = useState<ReactNode | null>(null);

    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (childrenRef.current === null)
            return;

        const childElement = childrenRef.current as HTMLElement;
        childElement.addEventListener('mouseenter', show);
        childElement.addEventListener('mouseleave', hide);
        return () => {
            childElement.removeEventListener('mouseenter', show);
            childElement.removeEventListener('mouseleave', hide);
        }
    }, [children, message]);

    useEffect(() => {
        if (!visible) {
            setPortal(null);
            return;
        }
        const childElement = childrenRef.current as HTMLElement;
        if (!childElement)
            return;
        setPortal(createPortal(<PortalTooltip message={message} relativeElement={childElement} />, document.getElementById('root')!));
    }, [visible, message]);

    return (<>
        { cloneElement(children as ReactElement, { ref: childrenRef }) }
        { portal }
    </>);

};

export default Tooltip;