import  { FC } from 'react';
import { ProfileInterface } from '../../user';

interface ConfirmNewPictureProps {
    profile: ProfileInterface,
    newPicture: string,
    onChose(choice: string | null): void
}

const ConfirmNewPicture: FC<ConfirmNewPictureProps> = ({ profile, newPicture, onChose }) => {

    return (<>
        <main className="absolute top-0 left-0 w-full h-full flex justify-center items-center px-5 sm:px-0" style={{ backgroundColor: '#141414' }}>
            <div className="flex flex-col">
                <h1 className="font-medium text-xl md:text-3xl text-center">Changer l'icône de profil ?</h1>
                <div className="flex items-center justify-center divider mt-5 py-10 gap-8 px-4">
                    <div>
                        <img src={profile.picture} className="rounded-md w-36 h-auto" alt="Previous profile picture" />
                        <span className="block text-center mt-3">Actuelle</span>
                    </div>
                    <svg className="fill-white h-10 mb-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                    </svg>
                    <div>
                        <img src={newPicture} className="rounded-md w-36 h-auto" alt="New profile picture" />
                        <span className="block text-center mt-3">Nouvelle</span>
                    </div>
                </div>
                <div className="flex justify-center divider mt-5 py-10 gap-5 w-full px-2">
                    <button className="button-classic-2 w-1/2 md:h-14" onClick={() => onChose(newPicture)}><span className="text-base md:text-lg">C'est parti</span></button>
                    <button className="button-classic w-1/2 md:h-14" onClick={() => onChose(null)}><span className="text-base md:text-lg">Pas encore</span></button>
                </div>
            </div>
        </main>
    </>);
}

export default ConfirmNewPicture;