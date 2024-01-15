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