import { FC, useContext, useEffect, useState } from 'react';
import { ShowInterface, fetchListShows } from '../../fakeApi';
import { UserContext, findProfile } from '../../user';
import ShowItem from '../../components/ShowItem';
import SectionSkeleton from '../../components/SectionSkeleton';
import Slider from '../../components/Slider';

interface MyListProps {

}

const MyList: FC<MyListProps> = ({ }) => {

    const user = useContext(UserContext);
    const selectedProfile = user != null && user.selectedProfile != null ? findProfile(user, user.selectedProfile) : null;

    const [shows, setShows] = useState<ShowInterface[] | null>(null);
    
    useEffect(() => {
        if (selectedProfile === null)
            return;

        fetchListShows(selectedProfile).then(setShows);
    }, [selectedProfile]);

    if (shows === null)
        return <div className="px-4p"><SectionSkeleton /></div>;

    return (<>
        <div className="sub-header">
            <h1 className="text-2xl md:text-4xl font-medium pb-5">Ma liste</h1>
        </div>
        <div className="flex w-full h-full shows mt-32 md:mt-52">
            <section className="w-full">
                <Slider wrap={true} items={
                        shows.map(show =>
                            <ShowItem key={show.id} show={show} />    
                        )
                    }
                />
                {
                    shows.length === 0 ?
                    <p className="px-4p">Vous n'avez rien ajouté à votre liste..</p>
                    : null
                }
            </section>
        </div>
    </>);
};

export default MyList;