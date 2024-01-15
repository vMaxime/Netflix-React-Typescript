import { FC, createRef, useContext, useEffect, useState } from 'react';
import { ShowType, SectionInterface, fetchSections } from '../../fakeApi';
import { UserContext, findProfile } from '../../user';
import Slider from '../../components/Slider';
import SectionSkeleton from '../../components/SectionSkeleton';
import ShowItem from '../../components/ShowItem';
import './ByType.css';
import Video from '../../components/Video';

interface ByTypeInterface {
    type: ShowType
}

const ByType: FC<ByTypeInterface> = ({ type }) => {

    const user = useContext(UserContext);
    const selectedProfile = user != null && user.selectedProfile != null ? findProfile(user, user.selectedProfile) : null;

    const wrapperRef = createRef<HTMLDivElement>();
    const widthRef = createRef<HTMLDivElement>();

    const [sections, setSections] = useState<SectionInterface[] | null>(null);

    useEffect(() => {
        if (selectedProfile === null)   
            return;

        fetchSections(selectedProfile, type)
            .then(setSections)
    }, []);

    if (sections === null)
        return <div className="px-4p"><SectionSkeleton /></div>;

    const sectionsElements = sections.map((section, index) => !section.shows.length ? null :
        <section key={section.name} className="w-full">
            <p className="mb-2 lg:mb-3 text-xs sm:text-sm md:text-xl xl:text-2xl xl:font-medium px-4p">{section.name}</p>
            <Slider
                key={section.name + index}
                items={
                    section.shows.map(show =>
                        <ShowItem key={show.id} show={show} />  
                    )
                }
                buttonsBackground='hsla(0,0%,8%,.5)'
            />
        </section>
    );
    
    return (<>
        <div className="w-full">
            <Video>
                <div className="shows w-full">
                    { sectionsElements[0] }
                </div>
            </Video>
        </div>
        <div ref={widthRef} className="h-0 mx-4p"></div>
        <div ref={wrapperRef} className="flex flex-col gap-10 shows mt-10">
            {
                sectionsElements.map((element, index) => 
                    index === 0 ? null : element
                )
            }
        </div>
    </>);
};

export default ByType;