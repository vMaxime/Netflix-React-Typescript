import { FC, createRef, useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    className?: string,
    onCancel: Function
}

const SearchBar: FC<SearchBarProps> = ({ className, onCancel }) => {

    const navigate = useNavigate();
    const inputRef = createRef<HTMLInputElement>();
    const wrapperRef = createRef<HTMLDivElement>();
    const [showQuit, setShowQuit] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);

    const style = {
        height: '24px',
        width: '24px'
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        navigate('/search?q=' + e.target.value);
        window.dispatchEvent(new Event('searchQueryChange'));
        setShowQuit(e.target.value.length ? true : false);
    };

    useEffect(() => {
        if (inputRef.current === null)
            return;

        const url = new URL(window.location.href);
        const query = url.searchParams.get('q');
        if (query != null) {
            inputRef.current.value = query;
        }

        const handleFocusOut = (e: FocusEvent) => {
            const target = e.target as HTMLInputElement;
            if (!target.value.length) {
                setExpanded(false);
                onCancel();
            }
        };
        
        inputRef.current.addEventListener('focusout', handleFocusOut);
    }, [inputRef]);

    useEffect(() => {
        if (inputRef.current === null || wrapperRef.current === null || !expanded)
            return;
        
        inputRef.current.focus();
        inputRef.current;
        if (!wrapperRef.current.classList.contains('expand'))
            wrapperRef.current.classList.add('expand');
    }, [expanded]);

    return (
    <div className={'relative' + (className ? ' ' + className : '')} style={style}>
        {
            !expanded ?
            <button onClick={() => setExpanded(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.6177 17.0319C14.078 18.2635 12.125 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.125 18.2635 14.078 17.0319 15.6177L22.7071 21.2929L21.2929 22.7071L15.6177 17.0319Z"></path>
                </svg>
            </button>
            :
            <>
            <div ref={wrapperRef} className="flex items-center gap-2 absolute right-0 -top-1/4 z-10 border border-white bg-black w-0 overflow-x-hidden" style={{ transition: 'width 1s', maxWidth: '280px' }}>
                <svg width="18" height="18" className="ml-2" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.6177 17.0319C14.078 18.2635 12.125 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.125 18.2635 14.078 17.0319 15.6177L22.7071 21.2929L21.2929 22.7071L15.6177 17.0319Z"></path>
                </svg>
                <input ref={inputRef} type="text" placeholder="Titres, personnes, genres" className="bg-transparent outline-none flex-1 text-sm my-2" onChange={handleChange} />
                {
                    showQuit ?
                    <button onClick={() => onCancel()} className="mr-2">
                        <svg height="14" width="14" viewBox="0 0.507 86.165 84.641" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, -7.234502, -7.230015)" stroke="#FFF" strokeWidth="10px">
                                <line y2="11.97403" x2="89.512984" y1="89" x1="12.487015"></line>
                                <line transform="rotate(-90.547119140625 50,49.48701477050781) " y2="10.97403" x2="88.512986" y1="88" x1="11.487017"></line>
                            </g>
                        </svg>
                    </button>
                    : null
                }
            </div>
            </>
        }
    </div>
    );
};


export default SearchBar;