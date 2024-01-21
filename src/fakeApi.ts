import data from './fakeData.json';
import { ProfileInterface } from './user';

export type ShowType = 'film' | 'serie' | null;

export type UserEvaluation = "bad" | "like" | "love"| null;

export interface ShowInterface {
    id: number,
    name: string,
    year: number,
    age: number,
    ageWhy: string,
    audiodescription: boolean,
    duration: string,
    realisation: string[],
    scenarists: string[],
    description: string,
    type: ShowType,
    tags: string[],
    distribution: string[],
    picture: string,
    recommended: number
}

export interface SectionInterface {
    name: string,
    shows: ShowInterface[]
}

const wait = async (time: number) => {
    return new Promise<number>(r => setTimeout(r, time));
};

const randomTimeout = (): number => {
    return (1 + Math.random()) * 1000;
};

export const getShowsByType = (type: ShowType): ShowInterface[] => {
    const _shows = data as [];
    const shows = _shows as ShowInterface[];
    return shows.filter(show => type === null || show.type === type);
};

export function shuffle<Type>(array: Type[]): Type[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const fetchSections = (profile: ProfileInterface, type: ShowType): Promise<SectionInterface[]> => {
    const shows = getShowsByType(type);

    return new Promise(async (resolve) => {
        const sections: SectionInterface[] = [
            {
                'name': 'Notre sélection pour ' + profile.name,
                'shows': shows
            },
            {
                'name': (type === 'film' ? 'Films salués' : 'Séries saluées') + ' par la critique à regarder sans modération',
                'shows': shows
            },
            {
                'name': 'Nouveautés',
                'shows': shows
            },
            {
                'name': 'Ajouts des 12 derniers mois',
                'shows': shows
            },
            {
                'name': 'Films psychologique',
                'shows': shows
            },
            {
                'name': 'Appréciés sur Netflix',
                'shows': shows
            }
        ];

        await wait(randomTimeout());
        resolve(sections);
    });
};

export const fetchListShows = (profile: ProfileInterface): Promise<ShowInterface[]> => {
    const _shows = data as [];
    const shows = _shows as ShowInterface[];
    return new Promise(async (resolve) => {
        await wait(randomTimeout());
        resolve(shows.filter(show => profile.list.includes(show.id)));
    });
};

export const fetchNews = (): Promise<SectionInterface[]> => {
    const _shows = data as [];
    const shows = _shows as ShowInterface[];
    return new Promise(async (resolve) => {
        const sections: SectionInterface[] = [
            {
                'name': 'Disponible cette semaine',
                'shows': shows
            },
            {
                'name': 'Nouveautés sur Netflix',
                'shows': shows
            },
            {
                'name': 'Valent bien l\'attente',
                'shows': shows
            },
            {
                'name': 'Top 10 des films aujourd\'hui',
                'shows': shows
            }
        ];

        await wait(randomTimeout());
        resolve(sections);
    });
}

export const fetchVideoSrc = (): Promise<string> => {
  return new Promise(resolve => {
    resolve('https://vod-progressive.akamaized.net/exp=1705536587~acl=%2Fvimeo-transcode-storage-prod-us-west1-h264-2160p%2F01%2F3586%2F18%2F467931213%2F2078854744.mp4~hmac=75870ee3ebde511e9bdd0138fd0cb0e9d40d8d1071bb94e888a02d72d72e2e63/vimeo-transcode-storage-prod-us-west1-h264-2160p/01/3586/18/467931213/2078854744.mp4');
    // const init: RequestInit = {
    //     headers: {
    //         'Authorization': import.meta.env.VITE_PEXELS_API_KEY
    //     }
    // };

    // fetch('https://api.pexels.com/videos/search?query=nature+sound&orientation=landscape&per_page=2', init)
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data.videos)
    //         resolve(data.videos[1].video_files[0].link)
    //     })
    //     .catch(() => resolve('https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-tree-covered-hill-41537-large.mp4'));
  });
};