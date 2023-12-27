import { ChangeEvent, useContext, useState } from 'react';
import { ProfileInterface, UserDispatchContext } from '../user';

interface EditProfileProps {
    profile: ProfileInterface,
    handleCancel: Function,
    onSaved: Function
}
  
const EditProfile: React.FC<EditProfileProps> = ({ profile, handleCancel, onSaved }) => {
    const [newProfile, setNewProfile] = useState<ProfileInterface>(profile);
    const dispatch = useContext(UserDispatchContext);

    const handleSave = () => {
        if (dispatch === null)
            return;
        dispatch({
            type: 'UPDATE_PROFILE',
            target: profile.name,
            payload: newProfile
        });
        onSaved();
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>, param: string) => {
        const changedProfile = {...newProfile};
        if (param === 'name')
            changedProfile.name = e.target.value;
        if (param === 'alias')
            changedProfile.alias = e.target.value;
        setNewProfile(changedProfile);
    };

    const handleCheck = (param: string) => {
        const changedProfile = {...newProfile};
        if (param === 'read_next_episode')
            changedProfile.read_next_episode = !changedProfile.read_next_episode;
        if (param === 'read_preview')
            changedProfile.read_preview = !changedProfile.read_preview;
        setNewProfile(changedProfile);
    };

    return (
      <div className="flex flex-col mx-auto edit-profile px-20" style={{ maxWidth: '700px' }}>
        <h1 className="text-4xl">Modifier le profil</h1>
        <div className="divider py-4 mt-2 flex flex-col gap-5">
            <div className="flex gap-5">
                <img src={newProfile.picture} alt="Profile picture" />
                <div className="flex flex-col gap-1 flex-1">
                    <input className="text-xs outline-none" type="text" name="name" value={newProfile.name} onChange={e => handleChange(e, 'name')} />
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
                <input className="outline-none" type="text" name="alias" id="alias" placeholder="Créer un alias" value={newProfile.alias || ''} onChange={e => handleChange(e, 'alias')} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm text-light">Catégories d'âge :</p>
                <div className="badge">Tous les âges</div>
                <p className="text-xxs text-light">Proposer les titres <b>pour tous les âges</b> à ce profil</p>
            </div>
            <div className="flex flex-col gap-2 divider pt-2">
                <p className="text-sm text-light">Commandes de lecture automatique</p>
                
            </div>
        </div>
        <div className="divider pb-2 mt-2 flex py-6 gap-5">
            <button className="button-classic-2" onClick={() => handleSave()}>Enregistrer</button>
            <button className="button-classic" onClick={() => handleCancel()}>Annuler</button>
        </div>
      </div>
    );
}

export default EditProfile;