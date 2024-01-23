import { CSSProperties, FC, useState } from 'react';
import Slider from '../../components/Slider';
import { ProfileInterface } from '../../user';
import ConfirmNewPicture from "./ConfirmNewPicture";

interface EditProfilePictureProps {
    profile: ProfileInterface,
    onChose(choice: string): void
}

const EditProfilePicture: FC<EditProfilePictureProps> = ({ profile, onChose }) => {

    const [selectedPicture, setSelectedPicture] = useState<string | null>(null);

    const handleChose = (choice: string | null) => {
        if (choice != null)
            onChose(choice);
    };

    const pictures = [
        {
            name: 'La Casa De Papel',
            cover: 'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABRU2gspR3cm9HM8lv6quhYJww65ER4uG4glz9kXNrVYC6595TqM3RsToWfxHKprWmw7tzloTmSvsNqb2ns08TMUouhnLjWqV8Q.png?r=53c',
            sources: [
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABWLaJuk3OZ3rF9xN_2BUljMdFJSg_OKfpKOHAiVGh5Atu9JKFG6UF_18gOQ3XO3I3pu4NuhOWYJyD6hmYBnTjMhDdvVSt708LQ.png?r=72f',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABdyMITmkOnagVbhbGR6g2muk1dLpNn1CO170z7cjLPs4kF6796k7aSQT26Ii7G9s_n-H_oqitI83sxo_HwhFQWQFcsHOpqFDtA.png?r=b38',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRIVtxA1PJtPvz-iRoR9T2FsPAxEux_f0k06Ko8_OuUylpVzicoCS8BX5Dk4pip3rgXOUozZVSVP25SRHdc7CoJCIuNGjerXpw.png?r=28c',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABb207lFF_80tOattdCHqmYHW4OFRW819b4jpE78tLcXvr4iFwppYZAXcNKq1rqcx6Aig1IfE7EuQPRS7JFpzFW08kLIwhqAkNw.png?r=f92',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbpXjR2wT3Np4Bhlg2x5LgAqC_LnHWlScouA-CEP9l9xekJXEpmCqDAZilPnQJ7iFBEIoK0TUSdkM3OkmN3DX3RxIwN7oetkKg.png?r=b0f',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABew1i0c2vFGnqPh2dryJ9uH4Q9sxKGh84V7iobqPgf-utLBTFOheCtA6vAQiPu_wIdWokAxIOqW9EEV4_LLGh5dHgRIA-mJgKg.png?r=959',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRo8cDb2syT26Rmd1700jMaQ2aHmFiGeb-tyjeVCK2LY4zGZmGH8yqIvVxdkw3AWoPwN63vzjqK-3RDsbGz2ZqsUOXR8u_qDLg.png?r=b83',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABdPrNzqmRAwoRY69gOPiFuzVhqjhSgxrDbWrtHZbbqCMpZczi6imiyZ3gdqqIfwQnBV1PWLuCwxfNRwl2CMyEOZIxOA6EAee6A.png?r=619',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABeLctIBaJkwz25Rv6-R97KCqISIJBNv2stwtt_qM5F058wDrAfT5rLkFg7mqwhuhMO8NyaKs5G1PenwKmTx1XAM0Zu24-Q_Xgw.png?r=cf8',
                'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABUn3W-FFcEId5Y01elYrPTC-GpFPpA3ySc_v3VvxhQ7rpZaydbISG2mRNgTTDx1WPENQcgeCwFQ6P1w43OdMf0meiqSiArgTxA.png?r=fe5',
            ]
        }
    ];

    const pictureStyle = {
        height: '10vw',
        maxHeight: '200px',
        width: '10vw',
        maxWidth: '200px',
        margin: '0 .5vw',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: '50%'
    }

    const gradientStyle = {
        height: '68px',
        backgroundImage: 'linear-gradient(180deg,rgba(0,0,0,.7) 10%,transparent)',
    };

    const containerStyle: CSSProperties = {
        width: '87%',
        maxWidth: '1310px',
        margin: '0 auto 1.5vw'
    };

    //<img src={source} style={pictureStyle} className="h-full w-full rounded-md border-white hover:border-2" alt={'Picture from ' + picture.name} /> 

    return (<>
        <header className="w-full z-10" style={{ backgroundColor: '#141414' }}>
            <div style={gradientStyle}></div>
            {
                selectedPicture === null ?
                <div className="flex justify-between w-full mt-2 mx-auto" style={containerStyle}>
                    <div className="flex items-center">
                        <button className="p-2 md:p-0" onClick={() => onChose(profile.picture)}>
                            <svg fill="#FFF" className="w-5 h-5 md:w-10 md:h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"/>
                            </svg>
                        </button>
                        <div className="flex flex-col ml-2">
                            <h1 className="font-medium text-sm xs:text-base md:text-2xl lg:font-bold">Modifier le profil</h1>
                            <h2 className="text-xs xs:text-sm -mt-1 md:font-medium md:text-base lg:text-xl">Choisissez une icône de profil.</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 xs:gap-5">
                        <h3 className="font-light text-sm md:text-2xl">{ profile.name }</h3>
                        <img src={ profile.picture } className="rounded-md h-8 w-8 xs:h-10 xs:w-10 md:w-12 md:h-12 lg:w-20 lg:h-20" alt="Profile picture" />
                    </div>
                </div>
                : null
            }
        </header>
        {
            selectedPicture === null ?
            <main className="pt-10 w-full" style={{ backgroundColor: '#141414' }}>
                <div className="flex flex-col gap-10 mx-auto w-full">
                    {
                        pictures.map(picture => 
                            <div key={picture.name} className="flex flex-col gap-1 md:gap-5">
                                <div className="w-full" style={containerStyle}>
                                {
                                    picture.cover ?
                                    <img src={picture.cover} className="h-6 lg:h-10 w-auto" alt="Pictures cover" />
                                    :
                                    picture.name
                                }
                                </div>
                                <Slider
                                    key={picture.name}
                                    items={
                                        picture.sources.map((source, index) => 
                                            <button key={index} className="cursor-pointer" style={{ ...pictureStyle, backgroundImage: `url(${source})` }} onClick={() => setSelectedPicture(source)}>
                                            </button>   
                                        )
                                    }
                                    style={{maxWidth: '1320px', width: '88vw', margin: '0 auto'}}
                                />
                            </div>
                        )
                    }
                </div>
            </main>
            :
            <ConfirmNewPicture profile={profile} newPicture={selectedPicture} onChose={handleChose} />
        }
    </>);
};

export default EditProfilePicture;