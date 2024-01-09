import { FC, createRef, useContext, useEffect, useState, CSSProperties } from 'react';
import { ShowType, SectionInterface, fetchSections, shuffle, ShowInterface } from '../fakeApi';
import { UserContext, findProfile } from '../user';
import Slider from '../components/Slider';
import SectionSkeleton from '../components/SectionSkeleton';
import ShowItem from '../components/ShowItem';
import './ByType.css';

interface ByTypeInterface {
    type: ShowType
}

const ByType: FC<ByTypeInterface> = ({ type }) => {

    const user = useContext(UserContext);
    const selectedProfile = user != null && user.selectedProfile != null ? findProfile(user, user.selectedProfile) : null;

    const wrapperRef = createRef<HTMLDivElement>();
    const modalRef = createRef<HTMLDivElement>();
    const widthRef = createRef<HTMLDivElement>();

    const [sections, setSections] = useState<SectionInterface[] | null>(null);
    
    const [showing, setShowing] = useState<boolean>(false);
    const [hiding, setHiding] = useState<boolean>(false);

    const [itemModalShow, setItemModalShow] = useState<ShowInterface | null>(null);
    const [itemModal, setItemModal] = useState<HTMLDivElement | null>(null);
    
    const [modalStyle, setModalStyle] = useState<CSSProperties>({});

    useEffect(() => {
        if (selectedProfile === null)   
            return;

        fetchSections(selectedProfile, type)
            .then(setSections)
    }, []);

    const hide = () => {
        if (hiding)
            return;

        setHiding(true);
    }

    const calculateModal = () => {
        if (itemModal === null || itemModalShow === null || modalRef.current === null || hiding)
            return;

        const itemElement = itemModal;
        const itemRect = itemElement.getBoundingClientRect();
        const { height, width, top, left } = itemRect;

        let modalRect = modalRef.current.getBoundingClientRect();
        const predictedXdistance = (modalRect.width - itemRect.width) / 2;
        const predictedYdistance = (modalRect.height - itemRect.height) / 2;

        let transformOrigin = 'center center';

        let styleLeft = left - predictedXdistance;
        if (widthRef.current != null) {
            const widthRefRect = widthRef.current.getBoundingClientRect();
            const minLeft = widthRefRect.left;
            const maxLeft = widthRefRect.right - modalRect.width;
            if (minLeft >= styleLeft) {
                transformOrigin = 'center left';
                styleLeft = minLeft;
            } else if (maxLeft <= styleLeft) {
                transformOrigin = 'center right';
                styleLeft = maxLeft;
            }
        }

        const style: CSSProperties = {
            opacity: '0',
            top: (top - predictedYdistance) + 'px',
            left: styleLeft + 'px',
            transform: `scaleX(${width / modalRect.width}) scaleY(${height / modalRect.height})`,
            transformOrigin
        };
        setModalStyle(style);
        setShowing(true);
        modalRef.current.focus();
    };

    useEffect(() => {
        if (itemModal === null || itemModalShow === null)
            return;
        
        calculateModal();

        window.addEventListener('resize', calculateModal);
        return () =>  window.removeEventListener('resize', calculateModal);
    }, [itemModal, itemModalShow]);

    useEffect(() => {
        if (!showing)
            return;
        
        const style: CSSProperties = {...modalStyle,
            opacity: '1',
            transition: 'transform 0.3s, opacity 0.3s',
            transform: 'none'
        };
        setModalStyle(style);

        const timeoutId = setTimeout(() => setShowing(false), 300);
        return () => clearTimeout(timeoutId);
    }, [showing]);

    useEffect(() => {
        if (!hiding || itemModal === null || modalRef.current === null)
            return;

        const itemElement = itemModal;
        const itemRect = itemElement.getBoundingClientRect();

        const { height, width } = itemRect;
        let modalRect = modalRef.current.getBoundingClientRect();

        const style: CSSProperties = {...modalStyle,
            transform: `scaleX(${width / modalRect.width}) scaleY(${height / modalRect.height})`
        };
        setModalStyle(style);

        const timeoutId = setTimeout(() => {
            setItemModal(null);
            setItemModalShow(null);
            setHiding(false);
            setModalStyle({});
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [hiding]);

    const handleHoverItem = (show: ShowInterface, itemElement: HTMLDivElement) => {
        setItemModal(itemElement);
        setItemModalShow(show);
    };

    if (sections === null)
        return <div className="px-4p"><SectionSkeleton /></div>;
    
    return (<>
        <div ref={widthRef} className="h-0 mx-4p"></div>
        <div ref={wrapperRef} className="flex flex-col gap-10 shows">
            {
                sections.map(section => 
                    <section key={section.name} className="w-full">
                        <p className="mb-2 lg:mb-3 text-xs sm:text-sm md:text-xl xl:text-2xl xl:font-medium px-4p">{section.name}</p>
                        <Slider
                            key={section.name}
                            items={
                                section.shows.map((show, index) =>
                                    <ShowItem key={show.id} show={show} onHover={handleHoverItem} />  
                                )
                            }
                            buttonsBackground='hsla(0,0%,8%,.5)'
                        />
                    </section>
                )
            }
            {
                itemModal != null && itemModalShow != null ?
                <div tabIndex={-1} onBlur={hide} onMouseLeave={hide} ref={modalRef} key={itemModalShow.id} className={'modal' + ('left' in modalStyle ? '' : ' invisible')} style={modalStyle}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <img src={itemModalShow.picture} className="h-full w-full rounded-t-md absolute top-0 left-0" alt={itemModalShow.name + ' cover'} loading="lazy" />
                        </div>
                        <div className="modal-body">
                            <div className="flex">
                                <div className="flex gap-2">
                                    <button className="bg-white hover:bg-opacity-85 rounded-full p-2 w-10 h-10 relative">
                                        <svg className="absolute top-1/4 left-1/4" width="24" height="20" fill="#181818" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1" x="0px" y="0px">
                                            <g><path d="M24.9573396,9.90134267 C20.0103375,6.8572215 16,9.10794841 16,14.9158024 L16,85.8210389 C16,91.6345697 20.0172931,93.8753397 24.9573396,90.8354986 L81.7630583,55.8802896 C86.7100604,52.8361684 86.7031048,47.8963928 81.7630583,44.8565517 L24.9573396,9.90134267 Z"></path></g>
                                        </svg>
                                    </button>
                                    <button className="border-2 border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-5 rounded-full p-2 w-10 h-10 relative">
                                        <svg className="absolute top-1/4 left-1/4" width="18" height="18" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"></path>
                                        </svg>
                                    </button>
                                    <button className="border-2 border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-5 rounded-full p-2 w-10 h-10 relative">
                                        <svg className="absolute top-1/4 left-1/4" width="18" height="18" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="font-medium" style={{ color: '#46d369' }}>Recommandé à { Math.floor(Math.random() * 100) } %</p>
                            </div>
                        </div>
                    </div>
                </div>
                :null
            }
        </div>
    </>);
};

export default ByType;