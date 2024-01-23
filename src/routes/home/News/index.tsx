import { FC, useEffect, useState } from 'react';
import { SectionInterface, fetchNews } from '../../../fakeApi';
import ShowItem from '../../../components/ShowItem';
import SectionSkeleton from '../../../components/SectionSkeleton';
import Slider from '../../../components/Slider';

interface NewsProps {

}

const News: FC<NewsProps> = ({ }) => {

    const [sections, setSections] = useState<SectionInterface[] | null>(null);
    
    useEffect(() => {
        fetchNews()
            .then(setSections);
    }, []);

    if (sections === null)
        return <div className="px-4p"><SectionSkeleton /></div>;

    return (<>
        <div className="flex flex-col gap-5 md:gap-10 shows mt-20 md:mt-28">
            {
                sections.map((section, index) => !section.shows.length ? null :
                    <section key={section.name} className="w-full">
                        <p className="mb-2 lg:mb-3 text-xs sm:text-sm md:text-2xl font-medium px-4p">{section.name}</p>
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

export default News;