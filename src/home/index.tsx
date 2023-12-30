import { useState } from 'react';
import Profile from '../profile';
import { ProfileInterface } from '../user';

function Home() {

    const [selectedProfile, setSelectedProfile] = useState<ProfileInterface | null>(null);

    if (selectedProfile === null)
        return <Profile setSelectedProfile={setSelectedProfile} />;

    return (<>
        <header>
            
        </header>
    </>);
}

export default Home;