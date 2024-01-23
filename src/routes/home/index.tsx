import { FC, useContext, useEffect, useState } from 'react';
import Profile from '../profile';
import { UserContext, findProfile } from '../../user';
import HomeHeader from './HomeHeader';
import { Outlet, useNavigate } from 'react-router-dom';
import './Home.css';

interface HomeProps {
    searching?: boolean
}

const Home: FC<HomeProps> = ({ searching }) => {

    const user = useContext(UserContext);
    const selectedProfile = user != null && user.selectedProfile != null ? findProfile(user, user.selectedProfile) : null;
    const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleQueryChange = () => {
        setSearchTimeoutId(searchTimeoutId => {
            if (searchTimeoutId != null)
                clearTimeout(searchTimeoutId);

            return setTimeout(() => {
                const url = new URL(window.location.href);
                const query = url.searchParams.get('q');

                setSearchQuery(query);
                setSearchTimeoutId(null);
            }, 1000);
        });
    };

    useEffect(() => {
        if (!searching) {
            if (searchTimeoutId != null) {
                clearTimeout(searchTimeoutId);
                setSearchTimeoutId(null);
            }
            return;
        }
        
        window.addEventListener('searchQueryChange', handleQueryChange);
        return () => {
            window.removeEventListener('searchQueryChange', handleQueryChange);
            if (searchTimeoutId != null) {
                clearTimeout(searchTimeoutId);
                setSearchTimeoutId(null);
            }
        };
    }, [searching]);

    useEffect(() => {
        if (searchQuery === null)
            return;

        if (!searchQuery.length) {
            navigate('/');
            return;
        }

        alert('Query: ' + searchQuery);
    }, [searchQuery]);

    if (selectedProfile === null)
        return <Profile />;

    return (<>
        <HomeHeader profile={selectedProfile} />
        <main className="flex flex-col" style={{ backgroundColor: '#141414' }}>
            <Outlet />
        </main>
        <footer className="text-dark flex flex-col gap-5 pb-6 pt-32 px-4" style={{ backgroundColor: '#141414' }}>
            <ul className="container mx-auto flex flex-wrap items-start text-xs gap-y-3 lg:px-40 xl:px-56">
                <li className="w-full flex gap-5">
                    <a href="https://www.facebook.com/netflixfrance" target="_blank">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.987 13.1621V21.9841H10.042V13.1621H6.84198V9.51207H10.047V6.73207C10.047 3.56707 11.932 1.82007 14.815 1.82007C15.7618 1.83321 16.7063 1.91577 17.641 2.06707V5.17307H16.045C15.4954 5.10007 14.9424 5.28088 14.5421 5.66447C14.1417 6.04807 13.9375 6.59284 13.987 7.14507V9.51207H17.487L16.928 13.1621H13.987Z"></path>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/NetflixFR" target="_blank">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.93 16.123C21.9584 17.6765 21.3789 19.1796 20.315 20.312C19.1851 21.3804 17.6797 21.9607 16.125 21.927C14.474 22.021 9.52499 22.021 7.87499 21.927C6.32126 21.9551 4.81792 21.3757 3.68499 20.312C2.61754 19.1819 2.03744 17.6772 2.06999 16.123C1.97699 14.472 1.97699 9.523 2.06999 7.873C2.03955 6.31886 2.61933 4.81466 3.68499 3.683C4.81767 2.61952 6.32162 2.04163 7.87499 2.073C9.52599 1.979 14.475 1.979 16.125 2.073C17.6789 2.04394 19.1826 2.62353 20.315 3.688C21.3825 4.81813 21.9625 6.32278 21.93 7.877C22.023 9.528 22.023 14.472 21.93 16.123ZM20.2 12C20.2 10.545 20.32 7.422 19.8 6.106C19.4572 5.23679 18.7692 4.54875 17.9 4.206C16.588 3.689 13.461 3.806 12.006 3.806C10.551 3.806 7.42799 3.685 6.11199 4.206C5.24298 4.54905 4.55505 5.23699 4.21199 6.106C3.69499 7.418 3.81199 10.545 3.81199 12C3.81199 13.455 3.69099 16.578 4.21199 17.894C4.55535 18.7628 5.24318 19.4506 6.11199 19.794C7.42399 20.311 10.552 20.194 12.006 20.194C13.46 20.194 16.584 20.315 17.9 19.794C18.769 19.451 19.4569 18.763 19.8 17.894C20.319 16.582 20.2 13.455 20.2 12ZM17.13 12C17.13 14.8312 14.8352 17.1264 12.004 17.127C9.17282 17.1276 6.8771 14.8332 6.87599 12.002C6.87489 9.17083 9.16882 6.87466 12 6.87299C13.3608 6.87034 14.6666 7.40959 15.629 8.37161C16.5914 9.33363 17.1311 10.6392 17.129 12H17.13ZM15.336 12C15.336 10.1596 13.8444 8.66756 12.004 8.667C10.1636 8.66645 8.6711 10.1576 8.66999 11.998C8.66889 13.8384 10.1596 15.3313 12 15.333C13.8406 15.3319 15.3328 13.8406 15.335 12H15.336ZM17.336 7.85901C16.6733 7.85901 16.136 7.32174 16.136 6.659C16.136 5.99626 16.6733 5.459 17.336 5.459C17.9987 5.459 18.536 5.99626 18.536 6.659C18.5379 6.97731 18.4124 7.28317 18.1876 7.50853C17.9628 7.73389 17.6573 7.86008 17.339 7.85901H17.336Z"></path>
                        </svg>
                    </a>
                    <a href="https://twitter.com/NetflixFR" target="_blank">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M20.768 8.207C20.7914 11.5932 19.4565 14.8475 17.062 17.242C14.6675 19.6365 11.4132 20.9714 8.027 20.948C5.58923 20.9544 3.20152 20.2564 1.151 18.938C1.50998 18.9771 1.87091 18.9955 2.232 18.993C4.24768 18.9984 6.20639 18.3245 7.792 17.08C5.87438 17.0472 4.18971 15.799 3.6 13.974C3.87982 14.0187 4.16264 14.0421 4.446 14.044C4.84354 14.0428 5.23935 13.9914 5.624 13.891C3.53637 13.4667 2.0367 11.6303 2.038 9.5V9.441C2.65835 9.78765 3.3519 9.98262 4.062 10.01C2.08979 8.69332 1.48225 6.06954 2.675 4.02C4.94972 6.82016 8.30596 8.52336 11.909 8.706C11.8375 8.369 11.8009 8.02551 11.8 7.681C11.8014 5.84295 12.9248 4.19204 14.6341 3.51625C16.3434 2.84047 18.2921 3.2768 19.55 4.617C20.5522 4.42342 21.5131 4.05731 22.39 3.535C22.0556 4.56894 21.3555 5.44538 20.421 6C21.3102 5.89965 22.1795 5.66709 23 5.31C22.3866 6.20228 21.6273 6.98489 20.754 7.625C20.768 7.82 20.768 8.014 20.768 8.207Z"></path>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/user/netflixfrance" target="_blank">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M22.54 6.67C22.288 5.71873 21.549 4.97331 20.6 4.713C18.88 4.25 12 4.25 12 4.25C12 4.25 5.11997 4.25 3.39997 4.713C2.45094 4.97331 1.71199 5.71873 1.45997 6.67C1.14265 8.42869 0.988663 10.213 0.99997 12C0.988663 13.787 1.14265 15.5713 1.45997 17.33C1.71288 18.2825 2.45401 19.0282 3.40497 19.287C5.11997 19.75 12.005 19.75 12.005 19.75C12.005 19.75 18.885 19.75 20.6 19.287C21.549 19.0267 22.288 18.2813 22.54 17.33C22.8573 15.5713 23.0113 13.787 23 12C23.0113 10.213 22.8573 8.42869 22.54 6.67ZM9.74997 15.27V8.729L15.5 12L9.74997 15.27Z"></path>
                        </svg>
                    </a>
                </li>
                {
                    [
                        ['Audiodescription', 'https://www.netflix.com/browse/audio-description'],
                        ['Centre d\'aide', 'https://help.netflix.com/'],
                        ['Cartes cadeaux', 'https://www.netflix.com/redeem'],
                        ['Presse', 'https://media.netflix.com/'],
                        ['Relations investisseurs', 'http://ir.netflix.com/'],
                        ['Recrutement', 'https://jobs.netflix.com/'],
                        ['Boutique Netflix', 'https://netflix.shop/'],
                        ['Conditions d\'utilisation', 'https://help.netflix.com/legal/termsofuse'],
                        ['Confidentialité', 'https://help.netflix.com/legal/privacy'],
                        ['Informations légales', 'https://help.netflix.com/legal/notices'],
                        ['Préférences de cookies', 'https://www.netflix.com/Cookies'],
                        ['Mentions légales', 'https://help.netflix.com/legal/corpinfo'],
                        ['Nous contacter', 'https://help.netflix.com/contactus'],
                        ['Choix liés à la pub', 'https://netflix.com/adchoices'],
                    ].map(([label, url], index) => 
                        <li key={index} className="w-1/3 lg:w-1/4 pr-5 hover:underline" style={{ minWidth: '100px' }}>
                            <a href={url} className="text-xs md:text-sm">{label}</a>
                        </li>
                    )
                }
                <li className="lg:w-full lg:pt-5">
                    <button className="button-classic">
                        Code de service
                    </button>
                </li>
            </ul>
        </footer>
    </>);
}

export default Home;