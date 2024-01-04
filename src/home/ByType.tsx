import { FC, createRef, useContext, useEffect, useState } from 'react';
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
    const modalContainerRef = createRef<HTMLDivElement>();

    const [sections, setSections] = useState<SectionInterface[] | null>(null);
    
    const [hiding, setHiding] = useState<boolean>(false);

    const [modalShowTimeoutId, setModalShowTimeoutId] = useState<number | null>(null);

    const [itemModalShow, setItemModalShow] = useState<ShowInterface | null>(null);
    const [itemModal, setItemModal] = useState<HTMLDivElement | null>(null);
    
    const [top, setTop] = useState<string>('0px');
    const [left, setLeft] = useState<string>('0px');

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
        calculateAbsolutePos();

        setTimeout(() => {
            setItemModal(null);
            setItemModalShow(null);
            setHiding(false);
        }, 500);
    }

    const calculateAbsolutePos = () => {
        if (itemModal === null || itemModalShow === null || wrapperRef.current === null || modalRef.current === null)
            return;

        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const itemModalRect = itemModal.getBoundingClientRect();
        const modalRect = modalRef.current.getBoundingClientRect();

        const top = itemModalRect.top - wrapperRect.top;

        const minLeft = wrapperRect.left;
        const maxLeft = wrapperRect.right - modalRect.width;
        const left = Math.max(Math.min(itemModalRect.left - wrapperRect.left, maxLeft), minLeft);

        setTop(top + 'px');
        setLeft(left + 'px');
    };

    useEffect(() => {
        calculateAbsolutePos();

        window.addEventListener('resize', calculateAbsolutePos);
        return () =>  window.removeEventListener('resize', calculateAbsolutePos);
    }, [itemModal, itemModalShow]);

    useEffect(() => {
        if (modalContainerRef.current != null) {
            modalContainerRef.current.classList.add('show');
            if (hiding)
                modalContainerRef.current.classList.add('hide');
        }
    }, [modalContainerRef]);

    const handleHoverItem = (show: ShowInterface, itemElement: HTMLDivElement) => {
        if ((itemModal != null && itemModalShow != null) || hiding)
            return;

        let mouseLeft = false;

        const handleMouseLeave = () => mouseLeft = true;
        itemElement.addEventListener('mouseleave', handleMouseLeave);

        const timeoutId = setTimeout(() => {
            itemElement.removeEventListener('mouseleave', handleMouseLeave);
            setModalShowTimeoutId(null);
            if (!mouseLeft) {
                setItemModal(itemElement);
                setItemModalShow(show);
            }
        }, 1000);

        setModalShowTimeoutId(prevId => {
            if (prevId != null) {
                clearTimeout(prevId);
                itemElement.removeEventListener('mouseleave', handleMouseLeave);
            }
            return timeoutId;
        });
    };

    if (sections === null)
        return <SectionSkeleton />;
    
    return (<>
        <div ref={wrapperRef} className="flex flex-col gap-10 shows">
            {
                sections.map(section => 
                    <section key={section.name} className="w-full">
                        <p className="mb-2 lg:mb-3 text-xs sm:text-sm md:text-xl xl:text-2xl xl:font-medium">{section.name}</p>
                        <Slider buttonsBackground='hsla(0,0%,8%,.5)'>
                            {
                                shuffle(section.shows).map((show, index) =>
                                    <ShowItem key={show.id} show={show} sliderItemIndex={index} onHover={handleHoverItem} />  
                                )
                            }
                        </Slider>
                    </section>
                )
            }
            {
                itemModal != null && itemModalShow != null ?
                <div ref={modalRef} key={itemModalShow.id} className="h-fit w-80 absolute z-20 flex" style={{ top, left }} onMouseLeave={hide}>
                    <div ref={modalContainerRef} className='modal-container'>
                        <div className="h-44 w-full rounded-t-md bg-black relative">
                            <img src={itemModalShow.picture} className="h-full w-full rounded-t-md absolute top-0 left-0" alt={itemModalShow.name + ' cover'} loading="lazy" />
                        </div>
                        <div className="modal-content">
                            <div className="flex">
                                <div className="flex gap-2">
                                    <button className="bg-white hover:bg-opacity-85 rounded-full p-2 h-10 w-10 flex">
                                        <svg className="m-auto" width="18" height="18" viewBox="0 0 24 24" fill="#181818" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"></path>
                                        </svg>
                                    </button>
                                    <button className="border-2 border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-5 rounded-full p-2 max-h-10 max-w-10 min-h-8 min-w-8 w-full h-full flex">
                                        <svg className="m-auto" width="18" height="18" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"></path>
                                        </svg>
                                    </button>
                                    <button className="border-2 border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-5 rounded-full p-2 max-h-10 max-w-10 min-h-8 min-w-8 w-full h-full flex">
                                        <svg className="m-auto" width="18" height="18" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p style={{ color: '#46d369' }}>Recommandé à { Math.floor(Math.random() * 100) } %</p>
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