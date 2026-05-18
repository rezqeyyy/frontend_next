export default function Team() {
    const team = [
    {
        name: "Achmad Haikal Maali",
        role: "Lead Developer",
        photo: "public/assets/haikal.jpg",
    },
    { 
        name: "Aren Syifa Nabilah", 
        role: "AI Engineer", 
        photo: "../../assets/muka aren.jpeg" },
    {
        name: "Faleza Yassinia O.R",
        role: "UI/UX Designer",
        photo: "../../assets/muka eja.JPEG",
    },
    { 
        name: "Rr. Afifah Ramadhani", 
        role: "AI Engineer", 
        photo: "../../assets/muka hani.jpeg" },
    { 
        name: "Rizqi Asan Masika", 
        role: "Web Developer", 
        photo: "../../assets/muka gwech.jpg" },
    ];

    return (
        <section id="profile" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-purple-300 mb-2 tracking-tight">
            Meet Our Team
            </h2>
            <p className="text-gray-400 mb-16 text-sm font-medium">
            The talented people behind Keeva's powerful churn prediction platform
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {team.map((member) => (
                <div key={member.name} className="flex flex-col items-center group">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-50 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                    src={`${member.photo}`}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all "
                    />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {member.name}
                </h3>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">
                    {member.role}
                </p>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
}
