import { FC, createRef, useContext, useEffect, useState } from 'react';
import { ShowType, SectionInterface, fetchSections, fetchVideoSrc } from '../../../fakeApi';
import { UserContext, findProfile } from '../../../user';
import Slider from '../../../components/Slider';
import SectionSkeleton from '../../../components/SectionSkeleton';
import ShowItem from '../../../components/ShowItem';
import './ByType.css';
import { Video, VideoBody, VideoMoreInfosButton, VideoPlayOrResumeButton } from '../../../components/Video';

interface ByTypeInterface {
    type: ShowType
}

const ByType: FC<ByTypeInterface> = ({ type }) => {

    const user = useContext(UserContext);
    const selectedProfile = user != null && user.selectedProfile != null ? findProfile(user, user.selectedProfile) : null;

    const wrapperRef = createRef<HTMLDivElement>();
    const widthRef = createRef<HTMLDivElement>();

    const [sections, setSections] = useState<SectionInterface[] | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        if (selectedProfile === null)   
            return;

        fetchSections(selectedProfile, type)
            .then(setSections);
        fetchVideoSrc().then(setVideoSrc);
    }, []);

    if (sections === null || videoSrc === null)
        return <div className="px-4p"><SectionSkeleton /></div>;
    
    return (<>
        <Video src={videoSrc} volume={1}>
            <VideoBody
                showTitleSrc="https://occ-0-6613-55.1.nflxso.net/dnm/api/v6/LmEnxtiAuzezXBjYXPuDgfZ4zZQ/AAAABb_xHSOY3y8LdJIAwwujVXzci0FEfBiDD7pzfEeYFenEj0BCTWfxlwrddaeJ8U_xPc7_HRMl9dZxlrYxXM-yDR32EKES3ioNKTRRNAbAF37lBssMGY_ECEMaE_j4uqLg0jjO8wLny7XQ7iqIqN1ToAPgFr6POqGYGlJYiH2YDk65D7Cvc3hUZQ.webp?r=12c"
            >
                <VideoPlayOrResumeButton className="mr-1 sm:mr-2 md:mr-3 mb-4" />
                <VideoMoreInfosButton />
            </VideoBody>
            <div className="relative w-full h-full">
                <div className="video-gradient"></div>
            </div>
        </Video>
        <div ref={widthRef} className="h-0 mx-4p"></div>
        <div ref={wrapperRef} className="flex flex-col shows">
            {
                sections.map((section, index) => !section.shows.length ? null :
                    <section key={section.name} className="show-section">
                        <p className="mb-2 lg:mb-3 text-xs sm:text-sm md:text-xl xl:text-2xl font-medium px-4p">{section.name}</p>
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
                )
            }
        </div>
    </>);
};

export default ByType;