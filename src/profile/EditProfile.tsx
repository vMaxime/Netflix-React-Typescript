import { FC, ChangeEvent, useState } from 'react';
import { ProfileInterface } from '../user';
import Checkbox from '../components/Checkbox';

interface EditProfileProps {
    profile: ProfileInterface,
    setProfile(profile: ProfileInterface): void,
    onEditPicture: Function,
    onSave(): string | null,
    onDelete(): void,
    onClose(): void
}
  
const EditProfile: FC<EditProfileProps> = ({ profile, setProfile, onEditPicture, onSave, onDelete, onClose }) => {
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        setError(onSave());
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, param: string) => {
        const changedProfile = {...profile};
        if (param === 'name')
            changedProfile.name = e.target.value;
        if (param === 'alias')
            changedProfile.alias = e.target.value;
        setProfile(changedProfile);
    };

    const handleCheck = (param: string) => {
        const changedProfile = {...profile};
        if (param === 'read_next_episode')
            changedProfile.read_next_episode = !changedProfile.read_next_episode;
        if (param === 'read_preview')
            changedProfile.read_preview = !changedProfile.read_preview;
        setProfile(changedProfile);
    };

    return (
      <div className="flex flex-col mx-auto edit-profile px-4 xs:px-14 sm:px-20" style={{ maxWidth: '700px' }}>
        <h1 className="text-4xl">Modifier le profil</h1>
        <div className="divider py-4 mt-2 flex flex-col gap-5">
            <div className="flex gap-5">
                <div className="relative">
                    <img src={profile.picture} alt="Profile picture" />
                    <svg className="absolute bottom-1 left-1 bg-black rounded-full cursor-pointer" onClick={() => onEditPicture()} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-mirrorinrtl="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M19.1213 1.7071C17.9497 0.535532 16.0503 0.53553 14.8787 1.7071L13.2929 3.29289L12.5858 4L1.58579 15C1.21071 15.3751 1 15.8838 1 16.4142V21C1 22.1046 1.89543 23 3 23H7.58579C8.11622 23 8.62493 22.7893 9 22.4142L20 11.4142L20.7071 10.7071L22.2929 9.12132C23.4645 7.94975 23.4645 6.05025 22.2929 4.87868L19.1213 1.7071ZM15.5858 7L14 5.41421L3 16.4142L3 19C3.26264 19 3.52272 19.0517 3.76537 19.1522C4.00802 19.2527 4.2285 19.4001 4.41421 19.5858C4.59993 19.7715 4.74725 19.992 4.84776 20.2346C4.94827 20.4773 5 20.7374 5 21L7.58579 21L18.5858 10L17 8.41421L6.70711 18.7071L5.29289 17.2929L15.5858 7ZM16.2929 3.12132C16.6834 2.73079 17.3166 2.73079 17.7071 3.12132L20.8787 6.29289C21.2692 6.68341 21.2692 7.31658 20.8787 7.7071L20 8.58578L15.4142 4L16.2929 3.12132Z" fill="currentColor"></path>
                    </svg>
                </div>
                
                <div className="flex flex-col gap-1 flex-1">
                    <input className="text-xs outline-none" type="text" name="name" value={profile.name} onChange={e => handleChange(e, 'name')} />
                    {
                        error ?
                        <span className="text-xxs text-red mt-1">{error}</span>
                        : null
                    }
                    <div className="flex flex-col gap-1">
                        <label htmlFor="language" className="text-xs text-light">Langue :</label>
                        <select className="outline-none bg-black border border-white text-xs w-fit pl-2 md:py-1 pr-10" name="language" id="language" defaultValue={"fr"}>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="alias" className="text-xs md:text-sm text-light">Alias :</label>
                <p className="text-xxs text-light">
                    Votre alias est un identifiant unique qui sera utilisé lorsque vous jouerez aux jeux Netflix avec d'autres abonnés.
                </p>
                <input className="outline-none" type="text" name="alias" id="alias" placeholder="Créer un alias" value={profile.alias || ''} onChange={e => handleChange(e, 'alias')} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm text-light">Catégories d'âge :</p>
                <div className="badge">Tous les âges</div>
                <p className="text-xxs text-light">Proposer les titres <b>pour tous les âges</b> à ce profil</p>
            </div>
            <div className="flex flex-col gap-2 divider pt-2">
                <p className="text-sm text-light">Commandes de lecture automatique</p>
                <div className="flex items-center gap-2 select-none" onClick={() => handleCheck('read_next_episode')}>
                    <Checkbox checked={profile.read_next_episode} />
                    <span className="text-xxs md:text-xs text-dark">Lecture automatique de l'épisode suivant d'une série sur tous les appareils.</span>
                </div>
                <div className="flex items-center gap-2 select-none" onClick={() => handleCheck('read_preview')}>
                    <Checkbox checked={profile.read_preview} />
                    <span className="text-xxs md:text-xs text-dark">Lecture automatique des aperçus pendant la navigation sur tous les appareils.</span>
                </div>
            </div>
        </div>
        <div className="divider pb-2 mt-2 flex flex-wrap py-6 gap-5">
            <button className="button-classic-2" onClick={() => handleSave()}>Enregistrer</button>
            <button className="button-classic" onClick={() => onClose()}>Annuler</button>
            <button className="button-classic" onClick={() => onDelete()}>Supprimer le profil</button>
        </div>
      </div>
    );
}

export default EditProfile;