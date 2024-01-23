import { ChangeEvent, useContext, useEffect, useState } from 'react';
import './profile.css';
import { ProfileInterface, UserContext, UserDispatchContext, generateId } from '../user';
import EditProfile from './EditProfile';
import EditProfilePicture from './EditProfilePicture';

function Profile() {

    const user = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);

    const profiles = user?.profiles || [];
    const managing = user?.managingProfiles || false;
    const [currentProfile, setCurrentProfile] = useState<ProfileInterface | null>(null); // current profile user is editing
    const [editingProfilePicture, setEditingProfilePicture] = useState(false);
    const [newProfile, setNewProfile] = useState<ProfileInterface | null>(null); // current profile user is creating
    const [error, setError] = useState<string | null>(null);

    const toggleManaging = () => {
        if (dispatch != null)
            dispatch({ type: 'TOGGLE_MANAGING' });
    };

    const setSelectedProfile = (profile: ProfileInterface) => {
        if (dispatch === null)  
            return;
        
        dispatch({
            type: 'SELECT_PROFILE',
            payload: profile.id
        });
    };

    const defaultProfile: ProfileInterface = {
        id: generateId(),
        name: '',
        picture: 'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTxO1HAzIh18LDAY7Igs6qQ3GhmsclmpCllWnoojeSDD0lMm9hUCp-C4VGo3cT40xfg_7SpIoY6pmRIl-W7B5CN8kvXCBqM7n8_f.png?r=a4b',
        alias: null,
        read_next_episode: true,
        read_preview: true,
        notifications: [],
        evaluations: [],
        list: []
    }

    const gradientStyle = {
        height: '41px',
        backgroundImage: 'linear-gradient(180deg,rgba(0,0,0,.7) 10%,transparent)'
    };

    const handleAddProfile = () => {
        if (newProfile != null && dispatch) {
            setError(null);
            if (!newProfile.name.length) {
                setError('Veuillez entrer un nom');
                return;
            }
            if (profiles.find(({ name }) => name === newProfile.name)) {
                setError('Un profil utilise déjà ce nom');
                return;
            }
            dispatch({
                type: 'ADD_PROFILE',
                payload: newProfile
            });
            setNewProfile(null);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (newProfile != null) {
            setNewProfile({...defaultProfile, name: e.target.value, picture: newProfile?.picture});
            if (e.target.value.length && error) {
                setError(null);
            }
        }
    };

    const handleProfilePictureChose = (choice: string) => {
        if (currentProfile != null)
            setCurrentProfile({ ...currentProfile, picture: choice });
        setEditingProfilePicture(false);
    };

    const handleSave = (): string | null => {
        setCurrentProfile(null);
        if (dispatch === null || currentProfile === null)
            return null;
        
        if (profiles.find(({ id, name }) => currentProfile.id != id && name === currentProfile.name))
            return 'Un profil utilise déjà ce nom';

        dispatch({
            type: 'UPDATE_PROFILE',
            payload: currentProfile
        });
        return null;
    };

    const handleDelete = () => {
        setCurrentProfile(null);
        if (dispatch === null || currentProfile === null)
            return;
        dispatch({
            type: 'REMOVE_PROFILE',
            payload: currentProfile.id
        });
    };

    return currentProfile != null && editingProfilePicture ?
        <EditProfilePicture profile={currentProfile} onChose={handleProfilePictureChose} />
    :
    <>
        <header className="w-full" style={{ height: '70px', backgroundColor: '#141414' }}>
            <div style={gradientStyle}></div>
        </header>
        <main className={newProfile === null ? "block" : "flex"} style={{ backgroundColor: '#141414' }}>
        {
            newProfile === null
            ?
                currentProfile === null
                ?
                <div className="mx-auto" style={{ maxWidth: '80%' }}>
                    <h1 className="text-2xl text-center my-5">
                        {managing ? 'Gestion des profils :' : 'Qui est-ce ?'}
                    </h1>
                    <ul className="flex flex-wrap md:justify-center gap-x-5">
                        {
                            profiles.map(profile => 
                                <li key={profile.name} className={'profile' + (managing ? ' managing' : '')} onClick={() => { if (managing) setCurrentProfile(profile); else setSelectedProfile(profile) }}>
                                    <div className="relative">
                                        <img src={profile.picture} alt="Profile picture" />
                                        {
                                            managing
                                            ?
                                            <div className="edit-icon">
                                                <svg className="edit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-mirrorinrtl="true" data-name="Pencil" aria-hidden="true">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.1213 1.7071C17.9497 0.535532 16.0503 0.53553 14.8787 1.7071L13.2929 3.29289L12.5858 4L1.58579 15C1.21071 15.3751 1 15.8838 1 16.4142V21C1 22.1046 1.89543 23 3 23H7.58579C8.11622 23 8.62493 22.7893 9 22.4142L20 11.4142L20.7071 10.7071L22.2929 9.12132C23.4645 7.94975 23.4645 6.05025 22.2929 4.87868L19.1213 1.7071ZM15.5858 7L14 5.41421L3 16.4142L3 19C3.26264 19 3.52272 19.0517 3.76537 19.1522C4.00802 19.2527 4.2285 19.4001 4.41421 19.5858C4.59993 19.7715 4.74725 19.992 4.84776 20.2346C4.94827 20.4773 5 20.7374 5 21L7.58579 21L18.5858 10L17 8.41421L6.70711 18.7071L5.29289 17.2929L15.5858 7ZM16.2929 3.12132C16.6834 2.73079 17.3166 2.73079 17.7071 3.12132L20.8787 6.29289C21.2692 6.68341 21.2692 7.31658 20.8787 7.7071L20 8.58578L15.4142 4L16.2929 3.12132Z" fill="currentColor"></path>
                                                </svg>
                                            </div>
                                            : null
                                        }
                                    </div>
                                    <span className="block py-2 text-center text-dark text-xs mx-auto">{profile.name}</span>
                                </li>
                            )
                        }
                        <li className="profile" onClick={() => setNewProfile(defaultProfile)}>
                            <div className="relative px-4">
                                <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#808080" d="M 249.999 0.467 C 112.184 0.467 0.468 112.183 0.468 249.997 C 0.468 387.811 112.184 499.532 249.999 499.532 C 387.814 499.532 499.532 387.811 499.532 249.997 C 499.532 112.183 387.814 0.467 249.999 0.467 Z M 224.541 106.282 L 275.457 106.282 L 275.457 224.538 L 393.722 224.538 L 393.722 275.461 L 275.457 275.461 L 275.457 393.717 L 224.541 393.717 L 224.541 275.461 L 106.276 275.461 L 106.276 224.538 L 224.541 224.538 L 224.541 106.282 Z"></path>
                                </svg>
                            </div>
                            <span className="block py-2 text-center text-dark text-xs">Ajouter un profil</span>
                        </li>
                    </ul>
                    {
                        managing
                        ?
                        <button className="button-classic-2 block mx-auto mt-10" onClick={toggleManaging}>
                            Terminé
                        </button>
                        :
                        <button className="button-classic block mx-auto mt-10" onClick={toggleManaging}>
                            Gérer les profils
                        </button>
                    }
                </div>
                :
                <EditProfile profile={currentProfile} setProfile={setCurrentProfile} onEditPicture={() => setEditingProfilePicture(true)} onSave={handleSave} onDelete={handleDelete} onClose={() => setCurrentProfile(null)} />
            :
            <div className="flex flex-col mx-auto mt-52 new-profile px-2">
                <h1 className="text-2xl">Ajouter un profil</h1>
                <h2 className="text-xs text-dark mt-1 mb-2">Ajoutez un profil pour un nouvel utilisateur Netflix.</h2>
                <div className="divider flex py-4">
                    <img src={newProfile.picture} alt="New profile picture" />
                    <div className="flex flex-col flex-1 px-4 py-2 md:py-4 pr-0">
                        <input className={'outline-none' + (error ? ' border border-red' : '')} type="text" name="name" value={newProfile.name} placeholder="Nom" onChange={e => handleChange(e)} />
                        {
                            error ?
                            <span className="mt-2 text-xs text-red">{error}</span>
                            : null
                        }
                    </div>
                </div>
                <div className="divider py-5 flex gap-5">
                    <button className="button-classic-2" onClick={handleAddProfile}>Continuer</button>
                    <button className="button-classic" onClick={() => setNewProfile(null)}>Annuler</button>
                </div>
            </div>
        }
        </main>
    </>;
}

export default Profile;