import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, UserDispatchContext } from "../user";
import './login.css';

function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const user = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);

    const gatekeeperUri = import.meta.env.VITE_GATEKEEPER_URI;
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = window.location.origin + import.meta.env.VITE_REDIRECT_URI;

    useEffect(() => {
        if (user?.token != null) {
            navigate('/');
            return;
        }
    }, [loading]);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');

        if (code) {
            setLoading(true);
            setError('');
            handleGithubCallback(code);
        }
    }, []);

    const handleGithubCallback = async (code: string) => {
        try {
            const response = await fetch(`${gatekeeperUri}/authenticate/${code}`);
            const data = await response.json();
            if (data.hasOwnProperty('error')) {
                setLoading(false);
                if (data.error === 'bad_code')
                    setError('Une erreur est survenue, réessayez ultérieurement..');
                else
                    throw new Error('');
                return;
            }
            if (dispatch) {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: data.token,
                        email: 'johndoe@gmail.com',
                        profiles: [],
                        selectedProfile: null,
                        managingProfiles: false
                    }
                });
                setLoading(false);
            }
        } catch {
            setLoading(false);
            setError('An unexpected error ocurred, try again..');
        }
    }

    const handleClick = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    };

    return (<>
        <header className="p-2 md:p-4">
            <svg id="netflixLogo" fill="red" height="32" width="75" viewBox="0 0 111 30" aria-hidden="true" focusable="false">
                <g id="netflix-logo"><path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z" id="Fill-14"></path></g>
            </svg>
        </header>
        <main className="login text-white flex flex-col p-4">
            <h1 className="text-3xl font-medium mb-10">Se connecter</h1>
            {
                loading ?
                <p>Redirection en cours...</p>
                :
                <>
                <button className="sign-in" onClick={handleClick} disabled={loading}>
                    <svg height="16" width="16" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.000000 240.000000" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0.000000,240.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M970 2301 c-305 -68 -555 -237 -727 -493 -301 -451 -241 -1056 143 -1442 115 -116 290 -228 422 -271 49 -16 55 -16 77 -1 24 16 25 20 25 135 l0 118 -88 -5 c-103 -5 -183 13 -231 54 -17 14 -50 62 -73 106 -38 74 -66 108 -144 177 -26 23 -27 24 -9 37 43 32 130 1 185 -65 96 -117 133 -148 188 -160 49 -10 94 -6 162 14 9 3 21 24 27 48 6 23 22 58 35 77 l24 35 -81 16 c-170 35 -275 96 -344 200 -64 96 -85 179 -86 334 0 146 16 206 79 288 28 36 31 47 23 68 -15 36 -11 188 5 234 13 34 20 40 47 43 45 5 129 -24 214 -72 l73 -42 64 15 c91 21 364 20 446 0 l62 -16 58 35 c77 46 175 82 224 82 39 0 39 -1 55 -52 17 -59 20 -166 5 -217 -8 -30 -6 -39 16 -68 109 -144 121 -383 29 -579 -62 -129 -193 -219 -369 -252 l-84 -16 31 -55 32 -56 3 -223 4 -223 25 -16 c23 -15 28 -15 76 2 80 27 217 101 292 158 446 334 590 933 343 1431 -145 293 -419 518 -733 602 -137 36 -395 44 -525 15z"/></g>
                    </svg>
                    <span className="mx-auto">Se connecter avec Github</span>
                </button>
                <p className="text-red text-sm mt-5">{error}</p>
                </>
            }
        </main>
        <footer className="text-dark flex flex-col gap-5 py-6 px-4 divider">
            <a href="https://help.netflix.com/en/contactus" className="">Questions? Contact us.</a>
            <ul className="flex flex-wrap items-start text-xs gap-y-3">
                {
                    [
                        ['FAQ', 'https://help.netflix.com/support/412'],
                        ['Help Center', 'https://help.netflix.com/en/'],
                        ['Netflix Shop', 'https://www.netflix.shop/'],
                        ['Terms of Use', 'https://help.netflix.com/legal/termsofuse'],
                        ['Privacy', 'https://help.netflix.com/legal/privacy'],
                        ['Cookie preferences', '#'],
                        ['Corporate Information', 'https://help.netflix.com/legal/corpinfo'],
                        ['Ad Choices', 'https://help.netflix.com/en/node/100637'],
                    ].map(([label, url], index) => 
                        <li key={index} className="w-1/3 pr-5" style={{ minWidth: '100px' }}>
                            <a href={url}>{label}</a>
                        </li>
                    )
                }
            </ul>
        </footer>
    </>);
}

export default Login;