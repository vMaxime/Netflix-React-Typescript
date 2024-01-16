import { createRef, CSSProperties, FC, ReactNode, ReactElement, useContext, useState, cloneElement, useEffect } from 'react';
import { ShowInterface } from '../../../fakeApi';
import Tooltip from '../../Tooltip';
import Evaluation from '../../Evaluation';
import { findProfile, UserContext, UserDispatchContext } from '../../../user';
import { createPortal } from 'react-dom';
import { getAbsolutePosition } from '../../../utils';

export interface ShowItemModalProps {
    children: ReactNode,
    show: ShowInterface
}

const ShowItemModal: FC<ShowItemModalProps> = ({ children, show }) => {

    const ref = createRef<HTMLElement>();

    const [modalState, setModalState] = useState<ShowModalState | null>(null);
    const [stateTimeoutId, setStateTimeoutId] = useState<number | null>(null);
    const [showTimeoutId, setShowTimeoutId] = useState<number | null>(null);

    const [relativeElement, setRelativeElement] = useState<HTMLElement | null>(null);

    const handleMouseOver = () => {
        if (modalState != null || showTimeoutId != null)
            return;

        setShowTimeoutId(setTimeout(() => {
            setShowTimeoutId(null);
            setModalState('showing');
        }, 400)); // show modal delay

        setStateTimeoutId(setTimeout(() => {
            setModalState('visible');
            setStateTimeoutId(null);
        }, 900)); // show timeout + animation duration
    };

    const handleMouseLeave = () => {
        if (showTimeoutId != null && stateTimeoutId != null) {
            clearTimeout(showTimeoutId);
            clearTimeout(stateTimeoutId);
            setShowTimeoutId(null);
            setStateTimeoutId(null);
            return;
        }
    };

    const hide = () => {
        setModalState('hiding');
        setStateTimeoutId(setTimeout(() => {
            setModalState(null);
            setStateTimeoutId(null);
        }, 500)); // animation duration
    };

    useEffect(() => {
        if (ref.current === null)
            return;
        setRelativeElement(ref.current);
    }, []);

    return (<>
        {
            cloneElement(children as ReactElement, { onMouseEnter: handleMouseOver, onMouseLeave: handleMouseLeave, ref })
        }
        {
            modalState != null && relativeElement != null ? 
            createPortal(<ShowModal key={show.id} show={show} onMouseLeave={hide} state={modalState} relativeElement={relativeElement} />, document.getElementById('root')!)
            : null
        }
    </>);
};

type ShowModalState = 'showing' | 'visible' | 'hiding';

interface ShowModalProps {
    show: ShowInterface,
    onMouseLeave(): void,
    state: ShowModalState,
    relativeElement: HTMLElement
}

const ShowModal: FC<ShowModalProps> = ({ show, onMouseLeave, state, relativeElement }) => {

    const user = useContext(UserContext);
    const selectedProfile = user != null && user.selectedProfile != null ? findProfile(user, user.selectedProfile) : null;
    const profileList: number[] = selectedProfile != null ? selectedProfile.list : [];
    const inProfileList = profileList.includes(show.id);
    const dispatch = useContext(UserDispatchContext);

    const ref = createRef<HTMLDivElement>();

    const [style, setStyle] = useState<CSSProperties>({});

    useEffect(() => {
        if (ref.current === null)
            return;

        const { width, height } = ref.current.getBoundingClientRect();
        const relativeRect = relativeElement.getBoundingClientRect();
        const startScaleX = relativeRect.width / width;
        const startScaleY = relativeRect.height / height;

        const [relativeTop, relativeLeft] = getAbsolutePosition(relativeElement);
        let top = relativeTop + ((relativeRect.height - height) / 2);
        let left = relativeLeft + ((relativeRect.width - width) / 2);
        let transformOrigin = 'center center';

        const sliderElement = relativeElement.closest('.slider-mask') as HTMLElement;
        if (sliderElement != null) {
            const sliderRect = sliderElement.getBoundingClientRect();
            const minLeft = sliderRect.left;
            const maxLeft = sliderRect.right - width;
            if (minLeft >= left) {
                transformOrigin = 'center left';
                left = minLeft;
            } else if (maxLeft <= left) {
                transformOrigin = 'center right';
                left = maxLeft;
            }
        }

        let timeoutId: number | null = null;
        if (state === 'showing') {
            setStyle({
                visibility: 'hidden',
                top: top + 'px',
                left: left + 'px',
                transition: 'transform 0s, opacity 0s',
                transform: `scaleX(${startScaleX}) scaleY(${startScaleY})`,
                transformOrigin
            });
            timeoutId = setTimeout(() => {
                setStyle(style => ({...style,
                    visibility: 'visible',
                    transition: 'transform .5s, opacity .5s',
                    transform: 'scaleX(1) scaleY(1)'
                }));
                timeoutId = null;
            }, 100);
        } else if (state === 'hiding') {
            setStyle(style => ({...style,
                transform: `scaleX(${startScaleX}) scaleY(${startScaleY})`
            }));
        }
        return () => {
            if (timeoutId != null)
                clearTimeout(timeoutId);
        };
    }, [state]);

    const addToList = () => {
        if (selectedProfile === null || dispatch === null)
            return;

        dispatch({
            type: 'ADD_SHOW_TO_LIST',
            target: selectedProfile,
            payload: show.id
        });
    };

    const removeFromList = () => {
        if (selectedProfile === null || dispatch === null)
            return;

        dispatch({
            type: 'REMOVE_SHOW_FROM_LIST',
            target: selectedProfile,
            payload: show.id
        });
    };

    return (
        <div tabIndex={-1} ref={ref} onMouseLeave={onMouseLeave} className={'modal' + ('visibility' in style ? '' : ' invisible')} style={style}>
            <div className="modal-content">
                <div className="modal-header">
                    <img src={show.picture} className="h-full w-full rounded-t-md absolute top-0 left-0" alt={show.name + ' cover'} loading="lazy" />
                </div>
                <div className="modal-body">
                    <div>
                        <div className="flex gap-2 w-full">
                            <button className="bg-white hover:bg-opacity-85 rounded-full p-2 w-10 h-10 relative">
                                <svg className="absolute top-1/4 left-1/4" width="24" height="20" fill="#181818" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1" x="0px" y="0px">
                                    <g><path d="M24.9573396,9.90134267 C20.0103375,6.8572215 16,9.10794841 16,14.9158024 L16,85.8210389 C16,91.6345697 20.0172931,93.8753397 24.9573396,90.8354986 L81.7630583,55.8802896 C86.7100604,52.8361684 86.7031048,47.8963928 81.7630583,44.8565517 L24.9573396,9.90134267 Z"></path></g>
                                </svg>
                            </button>
                            <Tooltip message={inProfileList ? "Supprimer de Ma liste" : "Ajouter à Ma liste"}>
                                <button className="border-2 border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-5 rounded-full p-2 w-10 h-10 relative" onClick={inProfileList ? removeFromList : addToList}>
                                {
                                    inProfileList ?
                                    <svg className="absolute top-1/4 left-1/4" width="18" height="18" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"></path>
                                    </svg>
                                    :
                                    <svg className="absolute top-1/4 left-1/4" width="18" height="18" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"></path>
                                    </svg>
                                }
                                </button>
                            </Tooltip>
                            <Evaluation
                                showId={show.id}
                                className="border-2 border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-5 rounded-full p-2 w-10 h-10 relative"
                            />
                            <Tooltip message="Plus d'infos">
                                <button className="ml-auto border-2 border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-5 rounded-full p-2 w-10 h-10 relative">
                                    <svg className="absolute top-1/4 left-1/4" width="18" height="18" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z"></path>
                                    </svg>
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium" style={{ color: '#46d369' }}>Recommandé à { show.recommended } %</p>
                        <div className="flex flex-wrap gap-2 items-center">
                            <div className="flex items-center text-sm text-white text-opacity-40 font-light border border-white border-opacity-40 px-1">
                                <span><b>{ show.age }</b></span>
                                <span style={{ paddingBottom: '1px' }}>+</span>
                            </div>
                            <span className="text-white text-opacity-40">{ show.duration }</span>
                            <div className="flex items-center justify-center text-xs text-white text-opacity-40 font-medium text-center border border-white border-opacity-40 h-4 w-7 px-1" style={{ borderRadius: '3px' }}>
                                <span>HD</span>
                            </div>
                            <ul className="flex flex-wrap">
                                {
                                    show.tags.map((tag, index) => 
                                        <li key={index}>
                                            {
                                                index > 0 && index < show.tags.length ?
                                                <span className="evidence-separator"></span>
                                                : null
                                            }
                                            <span className="text-white font-medium mr-2">{tag}</span>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowItemModal;