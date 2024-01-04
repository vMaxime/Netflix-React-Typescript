function SectionSkeleton() {
    return (
        <section className="w-full flex flex-col gap-2 overflow-x-hidden mt-1 pt-20">
            <div className="w-28 h-6" style={{ backgroundColor: '#1a1a1a' }}></div>
            <ul className="flex">
                {
                    Array(10).fill(null).map((ignore, i) => 
                        <li key={i} className="inline-block w-56 h-32 pulsate flex-shrink-0" style={{ borderLeft: '2px solid #141414', borderRight: '2px solid #141414', animationDelay: (i * 0.2) + 's' }}></li>
                    )
                }
            </ul>
        </section>
    );
}

export default SectionSkeleton;