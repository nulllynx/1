import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X, Code, User, FlaskConical, Trophy, FileText, Activity, Lock, Download, ChevronDown, ChevronUp, CheckCircle, ExternalLink, Gauge, Zap, Search, Shield, Server, Bug, Heart, GitFork, TrendingUp, Sun, Moon, Mail, Linkedin, Github, Twitter, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

// --- DATA DEFINITIONS ---
const NAV_ITEMS = ["STATUS", "PROFILE", "ANALYSIS", "ACCOMPLISH", "DOCUMENTS", "ACCESS_LOG", "ENCRYPT"];
const INITIAL_VISIBLE_PLATFORMS = 4; // initially show 4 cards

const TYPING_ROLES = [
    "Hacker",
    "Bug Bounty Hunter",
    "CTF Player",
    "Pentester",
    "Security Researcher",
    "Critical Thinker"
];

const STATS_DATA = [
    { label: "Vulnerabilities Found", endValue: 500, suffix: "+", icon: Zap },
    { label: "Clients Secured", endValue: 25, suffix: "", icon: Shield },
    { label: "Success Rate", endValue: 98, suffix: "%", icon: TrendingUp },
];

const TOOLS_DATA = [
    { name: "Burp Suite Pro", level: 5, desc: "Leading web application security testing platform.", icon: Bug },
    { name: "Metasploit", level: 4, desc: "Exploitation framework for vulnerability development and execution.", icon: Server },
    { name: "Nmap", level: 5, desc: "Network discovery and security auditing tool.", icon: Search },
    { name: "Wireshark", level: 4, desc: "Network protocol analyzer for traffic inspection.", icon: GitFork },
    { name: "Ghidra", level: 3, desc: "Reverse engineering tool suite (NSA-developed).", icon: Code },
    { name: "Docker", level: 4, desc: "Containerization platform for isolated testing environments.", icon: Code },
    { name: "OWASP ZAP", level: 3, desc: "Free, open-source tool for finding vulnerabilities.", icon: Bug },
    { name: "SQLMap", level: 5, desc: "Automatic SQL injection and database takeover tool.", icon: Server },
    { name: "IDA Pro", level: 3, desc: "Binary analysis and disassembly tool.", icon: Code },
    { name: "Fuzzing Tools", level: 4, desc: "Custom scripts for input validation testing.", icon: Zap },
    // Added more tools for better horizontal scroll visualization
    { name: "KALI Linux", level: 5, desc: "A Linux distribution specialized for penetration testing.", icon: Server },
    { name: "Shodan", level: 4, desc: "Search engine for Internet-connected devices.", icon: Search },
    { name: "Maltego", level: 3, desc: "Graphical link analysis tool for data mining.", icon: GitFork },
    { name: "Aircrack-ng", level: 4, desc: "Wireless security auditing suite.", icon: Code },
    { name: "Sublime Text", level: 4, desc: "Code editor essential for payload creation and viewing.", icon: FileText },
    { name: "Hydra", level: 3, desc: "Fast parallelized login cracker.", icon: Lock },
    { name: "Gobuster", level: 4, desc: "Directory/file/DNS brute-forcing tool.", icon: Search },
    { name: "CouchPotato", level: 2, desc: "An automated movie downloading software.", icon: Heart },
    { name: "Hashcat", level: 5, desc: "Advanced password recovery utility.", icon: Zap },
    { name: "Autopsy", level: 3, desc: "Digital forensics platform.", icon: Bug },
];
// Duplicate tool data for continuous scroll
const combinedToolsData = [...TOOLS_DATA, ...TOOLS_DATA];

const VULNS_DATA = [
    { name: "SQL Injection (SQLi)", level: 5, desc: "Classic database exploitation vulnerability.", icon: Server },
    { name: "Cross-Site Scripting (XSS)", level: 5, desc: "Injecting malicious scripts into web pages.", icon: Code },
    { name: "Insecure Direct Object Reference (IDOR)", level: 4, desc: "Accessing unauthorized resources via parameter manipulation.", icon: Shield },
    { name: "Server-Side Request Forgery (SSRF)", level: 4, desc: "Tricking the server into making unexpected requests.", icon: GitFork },
    { name: "Authentication Flaws", level: 5, desc: "Bypassing login logic or token manipulation.", icon: Lock },
    { name: "XML External Entity (XXE)", level: 3, desc: "Exploiting XML parser processing of external entity references.", icon: FileText },
    { name: "Remote Code Execution (RCE)", level: 5, desc: "Executing arbitrary code on the host machine.", icon: Zap },
    { name: "Cross-Site Request Forgery (CSRF)", level: 3, desc: "Forcing victim users to execute unintended actions.", icon: Bug },
    { name: "Misconfiguration", level: 4, desc: "Exploiting improperly configured systems and services.", icon: Server },
    { name: "Logic Flaws", level: 5, desc: "Exploiting unique business logic errors.", icon: Heart },
    // Placeholder for 50 vulnerabilities
    { name: "OAuth/JWT Misconfig", level: 4, desc: "Token validation or scope issues.", icon: Lock },
    { name: "CORS Misconfig", level: 3, desc: "Relaxed CORS headers allowing unauthorized requests.", icon: GitFork },
    { name: "Subdomain Takeover", level: 4, desc: "Claiming expired domains linked in DNS records.", icon: Server },
    { name: "Web Cache Deception", level: 3, desc: "Cache poisoning to leak sensitive user info.", icon: Shield },
    { name: "Prototype Pollution", level: 4, desc: "Injecting properties into JavaScript base objects.", icon: Code },
];
// Duplicate vulnerability data for continuous scroll
const combinedVulnsData = [...VULNS_DATA, ...VULNS_DATA];

const PLATFORMS_DATA = [
    { name: "HackerOne", achievement: "Top 1% Rank", detail: "Ranked among the top 1% of researchers globally, consistently submitting high-impact reports.", logoUrl: "https://placehold.co/60x60/06B6D4/FFFFFF?text=H1", profileUrl: "#" },
    { name: "Bugcrowd", achievement: "MVP Award 2023", detail: "Recognized as the Most Valuable Researcher in 2023 for significant platform contributions and volume of critical findings.", logoUrl: "https://placehold.co/60x60/EF4444/FFFFFF?text=BC", profileUrl: "#" },
    { name: "Hack The Box", achievement: "Sensei Rank", detail: "Achieved the Sensei rank, demonstrating expert-level proficiency in penetration testing and machine exploitation.", logoUrl: "https://placehold.co/60x60/10B981/FFFFFF?text=HTB", profileUrl: "#" },
    { name: "TryHackMe", achievement: "100% Completion", detail: "Completed all major learning paths and challenges, mastering defensive and offensive security concepts.", logoUrl: "https://placehold.co/60x60/6366F1/FFFFFF?text=THM", profileUrl: "#" },
    { name: "PortSwigger", achievement: "Web Security Hero", detail: "Recognized as a Web Security Hero for consistently solving complex web security lab challenges.", logoUrl: "https://placehold.co/60x60/F97316/FFFFFF?text=PS", profileUrl: "#" },
    { name: "Google VRP", achievement: "Hall of Fame", detail: "Inducted into the Google Vulnerability Rewards Program Hall of Fame for multiple critical vulnerability submissions.", logoUrl: "https://placehold.co/60x60/FACC15/000000?text=GV", profileUrl: "#" },
    { name: "Microsoft", achievement: "Acknowledge", detail: "Received multiple acknowledgments for finding and responsibly disclosing security vulnerabilities in Microsoft products.", logoUrl: "https://placehold.co/60x60/3B82F6/FFFFFF?text=MS", profileUrl: "#" },
    { name: "Facebook/Meta", achievement: "Special Thanks", detail: "Acknowledged by Meta's security team for contributions to the integrity and safety of their social media platforms.", logoUrl: "https://placehold.co/60x60/059669/FFFFFF?text=FB", profileUrl: "#" },
    { name: "Synack", achievement: "Elite Red Team", detail: "Part of the exclusive Synack Red Team, trusted with highly sensitive penetration tests.", logoUrl: "https://placehold.co/60x60/EAB308/000000?text=SYN", profileUrl: "#" },
    { name: "Cobalt", achievement: "Top Researcher", detail: "Consistently rated as a top-tier researcher on the Cobalt platform for speed and quality of findings.", logoUrl: "https://placehold.co/60x60/9333EA/FFFFFF?text=CO", profileUrl: "#" },
    // Adding 30 more for the 'See More' functionality
    ...Array(30).fill(0).map((_, i) => ({
        name: `Platform ${i + 11}`, achievement: `Tier ${i % 5 + 1} Contributor`, detail: `Achieved recognition for sustained contributions to the platform's security.`, logoUrl: `https://placehold.co/60x60/${(i * 10) % 100 + 10}6${(i * 5) % 100 + 5}a/FFFFFF?text=P${i + 11}`, profileUrl: "#"
    }))
];

const CERTIFICATIONS_DATA = [
    { name: "OSCP (Offensive Security Certified Professional)", issuer: "Offensive Security", year: 2022, isTop: true, logoUrl: "https://placehold.co/60x60/0D9488/FFFFFF?text=OSCP", details: "The gold standard in offensive security. Requires demonstrated ability to actively compromise systems in a controlled environment." },
    { name: "CEH (Certified Ethical Hacker)", issuer: "EC-Council", year: 2021, isTop: true, logoUrl: "https://placehold.co/60x60/D97706/FFFFFF?text=CEH", details: "Covers 20 domains of security, including footprinting, scanning, enumeration, system hacking, and cloud security." },
    { name: "eJPT (eLearnSecurity Junior Penetration Tester)", issuer: "eLearnSecurity", year: 2020, isTop: true, logoUrl: "https://placehold.co/60x60/374151/FFFFFF?text=eJPT", details: "Practical and beginner-friendly certification focusing on black-box penetration testing methodologies." },
    { name: "CRTO (Certified Red Team Operator)", issuer: "Rastamouse", year: 2023, isTop: true, logoUrl: "https://placehold.co/60x60/BE123C/FFFFFF?text=CRTO", details: "Specialized in modern attack techniques, Active Directory exploitation, and defensive evasion strategies in a corporate environment." },
    { name: "CompTIA Security+", issuer: "CompTIA", year: 2019, isTop: true, logoUrl: "https://placehold.co/60x60/1E3A8A/FFFFFF?text=Sec+", details: "Foundation certification covering core security functions and best practices across various roles." },
    // 45 more certifications for the modal (mock data)
    ...Array(45).fill(0).map((_, i) => ({
        name: `CyberSec Certification ${i + 6}`, issuer: `Issuer ${i % 5}`, year: 2020 + (i % 4), isTop: false, logoUrl: `https://placehold.co/60x60/${(i * 10) % 100 + 10}6${(i * 5) % 100 + 5}a/FFFFFF?text=C${i + 6}`, details: `This is a detailed description for Certification ${i + 6} covering topics like compliance, cloud architecture, and network hardening.`
    }))
];

const REPORTS_DATA = [
    { platform: "Client A Corp", vulnerability: "Remote Code Execution", bounty: "$15,000", date: "2024-05-10", desc: "Critical vulnerability via deserialization flaw.", link: "#" },
    { platform: "Financial Platform", vulnerability: "Authentication Bypass", bounty: "$7,500", date: "2024-03-22", desc: "Bypassed 2FA via race condition on token validation.", link: "#" },
    { platform: "E-commerce Site", vulnerability: "Stored XSS", bounty: "$3,000", date: "2024-01-15", desc: "High-impact XSS in user profile image upload.", link: "#" },
    { platform: "Internal Network", vulnerability: "SSRF", bounty: "N/A (Consulting)", date: "2023-11-01", desc: "Used SSRF to access internal cloud metadata service.", link: "#" },
    { platform: "Health Startup", vulnerability: "IDOR", bounty: "$5,000", date: "2023-09-05", desc: "Unauthorized access to patient records by changing ID.", link: "#" },
    { platform: "Gaming Company", vulnerability: "Logic Flaw", bounty: "$10,000", date: "2023-07-19", desc: "Exploited currency duplication in the in-game store.", link: "#" },
    { platform: "Gov Agency", vulnerability: "Information Disclosure", bounty: "$4,000", date: "2023-05-30", desc: "Leaked sensitive configuration files via path traversal.", link: "#" },
    { platform: "Social Media App", vulnerability: "CSRF", bounty: "$2,500", date: "2023-03-12", desc: "Forced users to change their account email.", link: "#" },
];
// Duplicate report data for continuous scroll
const combinedReportsData = [...REPORTS_DATA, ...REPORTS_DATA];


const ACCESS_LOG_DATA = [
    { date: "2024-06-01", activity: "Completed 'Advanced Web Exploitation' Training Module.", icon: CheckCircle, color: "text-teal-400" },
    { date: "2024-05-10", activity: "Disclosed Critical RCE to Client A Corp, awarded $15,000 bounty.", icon: Zap, color: "text-red-500" },
    { date: "2024-04-15", activity: "Presented 'Modern IDOR Techniques' at local security meetup.", icon: User, color: "text-blue-400" },
    { date: "2024-03-22", activity: "Resolved 5 High-Severity Bugcrowd reports for Financial Platform.", icon: Shield, color: "text-yellow-500" },
    { date: "2023-12-01", activity: "Achieved 'Sensei' rank on Hack The Box.", icon: Trophy, color: "text-indigo-400" },
];

const CONTACT_LINKS = [
    { name: "Professional Mail", link: "mailto:asanul.prof@example.com", icon: Mail, color: "#06b6d4", isEmail: true }, // Teal
    { name: "Personal Mail", link: "mailto:asanul.personal@example.com", icon: Send, color: "#f97316", isEmail: true }, // Orange
    { name: "WhatsApp Chat", link: "https://wa.me/8801700000000", icon: MessageSquare, color: "#25d366" }, // Green
    { name: "LinkedIn", link: "https://linkedin.com/in/asanulhoesann", icon: Linkedin, color: "#3b82f6" }, // Blue
    { name: "GitHub", link: "https://github.com/asanulhoesann", icon: Github, color: "#ffffff" }, // White
    { name: "Twitter/X", link: "https://twitter.com/asanulhoesann", icon: Twitter, color: "#38bdf8" }, // Sky Blue
    { name: "HackerOne Profile", link: "https://hackerone.com/profile", icon: Zap, color: "#06b6d4" }, // Teal
    { name: "Bugcrowd Profile", link: "https://bugcrowd.com/profile", icon: Bug, color: "#EF4444" }, // Red
    { name: "TryHackMe Profile", link: "https://tryhackme.com/p/profile", icon: Code, color: "#10B981" }, // Emerald
    { name: "Telegram", link: "https://t.me/asanulhoesann", icon: Send, color: "#229ED9" }, // Telegram Blue
];

const emailLinks = CONTACT_LINKS.filter(link => link.isEmail);
const otherLinks = CONTACT_LINKS.filter(link => !link.isEmail);


// --- UTILITY COMPONENTS ---

// Custom Hook for Scroll-Triggered Count Up
const useCountUp = (endValue) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    // Mock animate function for single-file environment if not explicitly imported from framer-motion
    const animate = (mv, target, config) => {
        let start = mv.get();
        let duration = config.duration * 1000;
        let startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const value = start + progress * (target - start);
            mv.set(value);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
        return { stop: () => { } };
    };

    useEffect(() => {
        // Simple immediate set for the single file environment fallback
        count.set(endValue);
        // Note: The actual count-up animation logic with 'animate' from framer-motion is omitted
        // or simplified here due to single-file environment limitations on imports, 
        // relying on the final value set above.

    }, [endValue]);

    return rounded;
};


// 1. STATUS Section
const StatusSection = () => {
    const [displayedRole, setDisplayedRole] = useState('');
    const [roleIndex, setRoleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const currentRole = TYPING_ROLES[roleIndex % TYPING_ROLES.length];
        let timeout;

        if (isDeleting) {
            setTypingSpeed(50);
            if (displayedRole.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayedRole(currentRole.substring(0, displayedRole.length - 1));
                }, typingSpeed);
            } else {
                setIsDeleting(false);
                setRoleIndex(prev => prev + 1);
            }
        } else {
            setTypingSpeed(150);
            if (displayedRole.length < currentRole.length) {
                timeout = setTimeout(() => {
                    setDisplayedRole(currentRole.substring(0, displayedRole.length + 1));
                }, typingSpeed);
            } else {
                setTypingSpeed(3000);
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, typingSpeed);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedRole, isDeleting, roleIndex, typingSpeed]);

    return (
        <section id="STATUS" className="min-h-screen pt-24 flex items-center bg-gray-900 text-white">
            <div className="container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 bg-gray-800 rounded-3xl shadow-2xl shadow-teal-900/40"
                >
                    <div className="lg:w-3/5 mb-10 lg:mb-0 text-center lg:text-left">
                        <motion.h1
                            className="text-6xl md:text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Asanul Hoque Esan
                        </motion.h1>
                        <motion.p
                            className="text-3xl md:text-5xl font-light text-gray-300 h-16 md:h-20 flex items-center justify-center lg:justify-start"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            {displayedRole}
                            <motion.span
                                className="inline-block w-1 bg-teal-400 h-8 md:h-12 ml-1"
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                            />
                        </motion.p>
                    </div>

                    <motion.div
                        className="lg:w-2/5 flex justify-center lg:justify-end"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
                    >
                        <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-[50px] overflow-hidden shadow-2xl shadow-teal-600/30 border-4 border-teal-500/50">
                            <img
                                src="https://placehold.co/800x800/2D3748/FFFFFF?text=A.H.E"
                                alt="Asanul Hoque Esan Headshot"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

// 2. PROFILE Section
const ProfileSection = () => {
    // Intersection Observer fallback for inView detection
    const [inView, setInView] = useState(false);
    const ref = useCallback(node => {
        if (node !== null) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    setInView(entry.isIntersecting);
                },
                { threshold: 0.1 }
            );
            observer.observe(node);
            // Cleanup function for the observer
            return () => observer.unobserve(node);
        }
    }, []);

    const StatDisplay = ({ data }) => {
        const count = useMotionValue(0);
        const rounded = useTransform(count, Math.round);

        useEffect(() => {
            // Simple immediate set for the single file environment fallback
            count.set(data.endValue);
        }, [data.endValue]);


        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="bg-gray-700/50 p-6 rounded-xl shadow-lg border border-teal-700/50 text-center"
            >
                <data.icon className="w-8 h-8 mx-auto text-teal-400 mb-3" />
                <motion.div className="text-5xl font-extrabold text-white">
                    <motion.span>{rounded}</motion.span>{data.suffix}
                </motion.div>
                <p className="text-gray-400 mt-1 uppercase text-sm tracking-wider">{data.label}</p>
            </motion.div>
        );
    };

    return (
        <section id="PROFILE" className="py-24 bg-gray-900 text-white" ref={ref}>
            <div className="container mx-auto px-6">
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-5xl font-bold text-center mb-12 text-teal-400"
                >
                    PROFILE
                </motion.h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Left Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-1 flex justify-center lg:sticky lg:top-24"
                    >
                        <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-blue-500/50">
                            <img
                                src="https://placehold.co/600x600/0D121B/FFFFFF?text=Asanul+H.E."
                                alt="Asanul Hoque Esan Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: Bio & Stats */}
                    <div className="lg:col-span-2">
                        {/* Bio */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={inView ? { x: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="mb-10"
                        >
                            <h3 className="text-4xl font-bold mb-4 text-white">Ethical Security, Critical Insight</h3>
                            <p className="text-gray-400 mb-4 leading-relaxed">
                                With **5+ years of dedicated experience** as a professional bug bounty hunter and security consultant, my focus is on finding and responsibly disclosing critical vulnerabilities across complex web applications and network infrastructures. I thrive in high-stakes environments where precision and deep technical knowledge are paramount.
                            </p>
                            <p className="text-gray-400 mb-4 leading-relaxed">
                                My journey into security began with **competitive CTF challenges** which cultivated a profound passion for problem-solving and exploring the hidden mechanisms of technology. This competitive background translates into a relentless drive to discover zero-day and complex, chained exploits that evade automated tools.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                I specialize in **cutting-edge web application security**, including modern frameworks and cloud environments. My methodology centers on critical thinking, ensuring every component is analyzed not just for common flaws, but for unique logic errors that often present the highest business risk.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-8 px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-xl transition duration-300 flex items-center"
                            >
                                Download Full Resume <Download className="w-5 h-5 ml-2" />
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
                            initial={{ y: 50, opacity: 0 }}
                            animate={inView ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.7, delay: 0.6 }}
                        >
                            {STATS_DATA.map((stat, index) => (
                                <StatDisplay key={index} data={stat} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Simplified card for horizontal scrolling (Only Icon and Name)
const HorizontalToolCard = ({ name, icon: Icon }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="inline-flex flex-col items-center justify-center p-6 rounded-2xl shadow-xl border border-gray-700 transition-all duration-300 cursor-pointer w-32 h-32 bg-gray-800 flex-shrink-0"
    >
        <Icon className="w-8 h-8 text-teal-400 mb-2" />
        {/* Display name, wrapping or truncating if necessary */}
        <h4 className="text-sm font-semibold text-white text-center whitespace-normal">{name.split(' ').slice(0, 2).join(' ')}</h4>
    </motion.div>
);


// 3. ANALYSIS Section (Tools & Vulnerabilities)
const AnalysisSection = () => {
    return (
        <section id="ANALYSIS" className="py-24 bg-gray-950 text-white">
            <style>
                {/* CSS Keyframes for smooth Right-to-Left (RTL) infinite scroll */}
                {`
                @keyframes autoscroll-rtl {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                .autoscroll-container-rtl {
                    animation: autoscroll-rtl 60s linear infinite; /* 60 seconds duration for smooth speed */
                    display: flex;
                    width: max-content; /* Ensure container is wide enough for duplicated content */
                }

                /* CSS Keyframes for smooth Left-to-Right (LTR) infinite scroll */
                @keyframes autoscroll-ltr {
                    0% { transform: translateX(-50%); } 
                    100% { transform: translateX(0); }
                }
                .autoscroll-container-ltr {
                    animation: autoscroll-ltr 60s linear infinite; /* Same duration for visual balance */
                    display: flex;
                    width: max-content;
                }
                `}
            </style>
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold text-center mb-16 text-teal-400">ANALYSIS & EXPERTISE</h2>

                {/* --- Tools I Know (Horizontal Auto-Scroll RTL) --- */}
                <h3 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-white">
                    Tools I Know ({TOOLS_DATA.length} Total)
                </h3>
                {/* Outer container hides overflow, Inner container applies animation */}
                <div className="overflow-x-hidden pb-6 mb-20 border-y border-gray-700/50 py-4 bg-gray-900/50">
                    <div className="autoscroll-container-rtl space-x-6">
                        {combinedToolsData.map((tool, index) => (
                            <HorizontalToolCard key={index} {...tool} />
                        ))}
                    </div>
                </div>

                {/* --- Vulnerabilities I Know (Horizontal Auto-Scroll LTR) --- */}
                <h3 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-white">
                    Vulnerabilities I Know ({VULNS_DATA.length} Total)
                </h3>
                {/* Outer container hides overflow, Inner container applies animation */}
                <div className="overflow-x-hidden pb-6 border-y border-gray-700/50 py-4 bg-gray-900/50">
                    {/* The LTR animation starts at -50% to show the duplicated content first */}
                    <div className="autoscroll-container-ltr space-x-6">
                        {combinedVulnsData.map((vuln, index) => (
                            <HorizontalToolCard key={index} name={vuln.name} icon={vuln.icon} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// 4. ACCOMPLISH Section
const AccomplishSection = () => {
    const [showAllPlatforms, setShowAllPlatforms] = useState(false);

    const platformsToShow = useMemo(() => {
        return showAllPlatforms ? PLATFORMS_DATA : PLATFORMS_DATA.slice(0, INITIAL_VISIBLE_PLATFORMS);
    }, [showAllPlatforms]);

    const PlatformCard = ({ name, achievement, detail, logoUrl, profileUrl }) => (
        <motion.a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            // Framer Motion initial/whileInView for individual card fade-in on scroll
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
            // layout prop for smooth rearrangement when more cards are added/removed
            layout 
            // UPDATED: Increased height to h-72
            className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-500 h-72"
        >
            {/* Logo/Image */}
            <img
                src={logoUrl}
                alt={`${name} Logo`}
                className="w-14 h-14 rounded-full object-contain mb-4 bg-gray-700 p-1"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/374151/FFFFFF?text=P" }}
            />
            
            {/* Platform Name */}
            <h4 className="text-xl font-bold text-white mb-2 truncate w-full">{name}</h4>
            
            {/* Achievement Headline (Top 1%, MVP, etc.) */}
            <p className="text-teal-400 font-semibold text-sm uppercase mt-1 mb-3">{achievement}</p>
            
            {/* Detailed Description */}
            <p className="text-gray-400 text-sm flex-grow line-clamp-3">{detail}</p>
            
            {/* Link Icon */}
            <div className="mt-3 flex items-center text-blue-500 text-xs font-medium">
                View Profile <ExternalLink className="w-4 h-4 ml-1" />
            </div>
        </motion.a>
    );

    return (
        <section id="ACCOMPLISH" className="py-24 bg-gray-900 text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold text-center mb-16 text-blue-400">PLATFORM ACCOMPLISHMENTS</h2>
                <p className="text-center text-gray-400 mb-12">
                    Showcasing key achievements across various Bug Bounty and CTF/Learning platforms. Clicking any card will attempt to open the corresponding profile.
                </p>
                
                {/* Platform Grid Container */}
                {/* UPDATED: Grid layout changed from xl:grid-cols-10 to xl:grid-cols-5 for larger cards */}
                <motion.div 
                    layout 
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                    <AnimatePresence>
                        {platformsToShow.map((platform, index) => (
                            // Unique key is required for AnimatePresence to function correctly
                            <PlatformCard key={platform.name} {...platform} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* See More/See Less Button */}
                {PLATFORMS_DATA.length > INITIAL_VISIBLE_PLATFORMS && (
                    <div className="text-center mt-12">
                        <motion.button
                            onClick={() => setShowAllPlatforms(prev => !prev)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center mx-auto shadow-xl transition duration-300"
                        >
                            {showAllPlatforms ? (
                                <>
                                    See Less <ChevronUp className="w-5 h-5 ml-2" />
                                </>
                            ) : (
                                <>
                                    See More ({PLATFORMS_DATA.length - INITIAL_VISIBLE_PLATFORMS} More) <ChevronDown className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </motion.button>
                    </div>
                )}
            </div>
        </section>
    );
};

// Cert Details Modal Component
const CertDetailsModal = ({ cert, onClose }) => {
    if (!cert) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                // Custom size for 40% x 50% feel, centered
                className="bg-gray-800 w-full max-w-xl max-h-[70vh] overflow-y-auto rounded-3xl p-8 shadow-2xl border-2 border-teal-500"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6 border-b border-gray-700 pb-4">
                    <div className="flex items-center">
                        <img
                            src={cert.logoUrl}
                            alt={`${cert.name} Logo`}
                            className="w-16 h-16 rounded-full object-contain mr-4 bg-gray-700"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/374151/FFFFFF?text=C" }}
                        />
                        <div>
                            <h3 className="text-3xl font-bold text-teal-400 leading-tight">{cert.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">{cert.issuer} ({cert.year})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white mt-1">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        {cert.details}
                    </p>
                    <div className="pt-4 border-t border-gray-700">
                        <p className="font-semibold text-white">Issuance Details:</p>
                        <ul className="text-sm text-gray-400 list-disc list-inside ml-2">
                            <li>Issuer: {cert.issuer}</li>
                            <li>Year: {cert.year}</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// 5. DOCUMENTS Section (Certs & Reports)
const DocumentsSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);

    const CertCard = ({ name, issuer, year, logoUrl, isTop, details }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedCert({ name, issuer, year, logoUrl, details })} // Handle click for modal
            className={`flex items-center p-4 rounded-xl shadow-lg border cursor-pointer transition-all duration-300 ${isTop ? 'bg-gray-800 border-teal-600/50 hover:border-teal-400' : 'bg-gray-700/50 border-gray-600/50 hover:border-gray-500'}`}
        >
            <img
                src={logoUrl}
                alt={`${name} Logo`}
                className="w-12 h-12 rounded-full object-contain mr-4 bg-gray-600"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/374151/FFFFFF?text=C" }}
            />
            <div>
                <h4 className="font-semibold text-white">{name}</h4>
                <p className="text-sm text-gray-400">{issuer} ({year})</p>
            </div>
        </motion.div>
    );

    const ReportCard = ({ platform, vulnerability, bounty, date, desc, link, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }}
            className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 transition-all duration-300 h-full"
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-xl font-bold text-white">{platform}</h4>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bounty.includes('$') ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {bounty}
                </span>
            </div>
            <p className="text-teal-400 font-medium mb-2">{vulnerability}</p>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{desc}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Discovery: {date}</span>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 flex items-center">
                    View Report <ExternalLink className="w-3 h-3 ml-1" />
                </a>
            </div>
        </motion.div>
    );

    return (
        <section id="DOCUMENTS" className="py-24 bg-gray-950 text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold text-center mb-16 text-blue-400">DOCUMENTS & REPORTS</h2>

                {/* Certifications */}
                <h3 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-white">
                    Top Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                    {CERTIFICATIONS_DATA.filter(c => c.isTop).map((cert, index) => (
                        <CertCard key={index} {...cert} />
                    ))}
                </div>

                <div className="text-center mb-16">
                    <motion.button
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg flex items-center mx-auto"
                    >
                        See More Certifications <ChevronDown className="w-5 h-5 ml-2" />
                    </motion.button>
                </div>

                {/* Reports */}
                <h3 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-white">
                    Vulnerability Reports (My Find) ({REPORTS_DATA.length} Total)
                </h3>
                {/* Horizontal Auto-Scroll (RTL) for Reports */}
                <div className="overflow-x-hidden pb-6 mb-12 border-y border-gray-700/50 py-4 bg-gray-900/50">
                    <div className="autoscroll-container-rtl space-x-6">
                        {combinedReportsData.map((report, index) => (
                            // Each report card must have a fixed width to ensure scroll smoothness
                            <div key={index} className="flex-shrink-0 w-80"> 
                                <ReportCard {...report} index={index} />
                            </div>
                        ))}
                    </div>
                </div>


                {/* All Certifications Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="bg-gray-800 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                                    <h3 className="text-3xl font-bold text-teal-400">All Certifications</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                        <X className="w-8 h-8" />
                                    </button>
                                }
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {CERTIFICATIONS_DATA.map((cert, index) => (
                                        <CertCard key={index} {...cert} />
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Single Certification Details Modal (New) */}
                <AnimatePresence>
                    {selectedCert && (
                        <CertDetailsModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

// 6. ACCESS_LOG Section
const AccessLogSection = () => {
    const LogCard = ({ date, activity, icon: Icon, color }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 flex items-start space-x-4"
        >
            <Icon className={`w-6 h-6 flex-shrink-0 ${color}`} />
            <div>
                <p className="text-xs uppercase font-semibold text-gray-500">{date}</p>
                <p className="text-white mt-1">{activity}</p>
            </div>
        </motion.div>
    );

    return (
        <section id="ACCESS_LOG" className="py-24 bg-gray-900 text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold text-center mb-16 text-teal-400">ACCESS LOG / MILESTONES</h2>
                <div className="max-w-4xl mx-auto space-y-8 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-700 hidden md:block"></div>

                    {ACCESS_LOG_DATA.map((log, index) => (
                        <div key={index} className="relative md:grid md:grid-cols-2 md:gap-12 items-center">
                            {/* Connector Dot */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 z-10 w-4 h-4 rounded-full bg-teal-500 border-2 border-gray-900 -ml-2"></div>

                            {/* Card positioning based on index */}
                            {index % 2 === 0 ? (
                                <div className="md:col-start-1 md:text-right">
                                    <LogCard {...log} />
                                </div>
                            ) : (
                                <div className="md:col-start-2">
                                    <LogCard {...log} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 7. ENCRYPT Section
const EncryptDecryptSection = () => {
    const [inputText, setInputText] = useState('');
    const [output, setOutput] = useState('');
    const [cipher, setCipher] = useState('Base64');
    const [aesKey, setAesKey] = useState('');
    const [isEncrypting, setIsEncrypting] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [copyStatus, setCopyStatus] = useState('');

    // --- ENCRYPTION/DECRYPTION FUNCTIONS ---

    const base64Encode = (str) => btoa(str);
    const base64Decode = (str) => {
        try { return atob(str); } catch { return "Error: Invalid Base64 input."; }
    };

    const rot13 = (str) => {
        return str.replace(/[a-zA-Z]/g, (c) => {
            const charCode = c.charCodeAt(0);
            const offset = (charCode <= 90) ? 65 : 97; // A=65, a=97
            return String.fromCharCode(((charCode - offset + 13) % 26) + offset);
        });
    };

    // Simplified Mock Encryption/Decryption for AES/XOR (As proper client-side crypto is complex)
    const mockAes = (str, key) => {
        if (!key || key.length < 8) return "Error: AES/XOR requires a strong key (8+ chars).";
        if (isEncrypting) return `AES-256(${key}): Encrypted result of: "${str.substring(0, 20)}..."`;
        return `AES-256(${key}): Decrypted result of: "${str.substring(0, 20)}..."`;
    };

    const xorCipher = (str, key) => {
        if (!key || key.length === 0) return "Error: XOR requires a key.";
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const keyCode = key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode ^ keyCode);
        }
        // Base64 encode/decode XOR output to handle non-printable chars
        return isEncrypting ? base64Encode(result) : base64Decode(result);
    };

    const processText = useCallback(() => {
        if (!inputText) return setOutput('');

        let result = '';
        switch (cipher) {
            case 'Base64':
                result = isEncrypting ? base64Encode(inputText) : base64Decode(inputText);
                break;
            case 'ROT13':
                result = rot13(inputText); // ROT13 is symmetric
                break;
            case 'AES-256':
                result = mockAes(inputText, aesKey);
                break;
            case 'XOR':
                result = xorCipher(inputText, aesKey);
                break;
            default:
                result = 'Invalid Cipher Selected';
        }

        // Simulate typing animation for output
        setIsTyping(true);
        setOutput('');
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < result.length) {
                setOutput(prev => prev + result.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, 10); // Fast typing speed

        return () => clearInterval(typingInterval);
    }, [inputText, cipher, aesKey, isEncrypting]);

    const handleCopy = () => {
        if (output) {
            // Using document.execCommand('copy') as requested for compatibility
            const tempInput = document.createElement('textarea');
            tempInput.value = output;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus(''), 2000);
        }
    };

    const getAesKeyStrength = () => {
        if (aesKey.length === 0) return { strength: 0, text: "Enter Key" };
        if (aesKey.length < 8) return { strength: 1, text: "Weak" };
        if (aesKey.length < 16) return { strength: 2, text: "Medium" };
        return { strength: 3, text: "Strong" };
    };

    const keyStrength = getAesKeyStrength();

    return (
        <section id="ENCRYPT" className="py-24 bg-gray-950 text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold text-center mb-16 text-blue-400">ENCRYPT / DECRYPT</h2>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                    className="bg-gray-800 p-8 rounded-3xl shadow-2xl shadow-blue-900/40"
                >
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                        {/* Mode Toggle */}
                        <div className="flex bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setIsEncrypting(true)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${isEncrypting ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                Encrypt
                            </button>
                            <button
                                onClick={() => setIsEncrypting(false)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${!isEncrypting ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                Decrypt
                            </button>
                        </div>

                        {/* Cipher Select */}
                        <div className="flex-grow">
                            <select
                                value={cipher}
                                onChange={(e) => {
                                    setCipher(e.target.value);
                                    setOutput('');
                                }}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            >
                                {['Base64', 'ROT13', 'XOR', 'AES-256'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Key Input (Conditional) */}
                    {(cipher === 'AES-256' || cipher === 'XOR') && (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                {cipher} Key
                            </label>
                            <input
                                type="password"
                                value={aesKey}
                                onChange={(e) => setAesKey(e.target.value)}
                                placeholder="Enter symmetric key here..."
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                            {cipher === 'AES-256' && (
                                <div className="mt-2 flex items-center text-sm">
                                    <Gauge className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="mr-3 text-gray-400">Key Strength:</span>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3].map(level => (
                                            <div
                                                key={level}
                                                className={`h-2 w-10 rounded-full transition-all duration-300 ${level <= keyStrength.strength
                                                    ? (level === 1 ? 'bg-red-500' : level === 2 ? 'bg-yellow-500' : 'bg-green-500')
                                                    : 'bg-gray-600'
                                                    }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <span className={`ml-3 font-semibold ${keyStrength.strength === 3 ? 'text-green-400' : keyStrength.strength === 1 ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {keyStrength.text}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Input Panel */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{isEncrypting ? 'Plain Text Input' : 'Cipher Text Input'}</label>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                rows="8"
                                placeholder={`Enter text to ${isEncrypting ? 'encrypt' : 'decrypt'}...`}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-4 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            ></textarea>
                        </div>

                        {/* Output Panel */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Output</label>
                            <div className="bg-gray-700 text-teal-300 border border-gray-600 rounded-lg p-4 h-full min-h-[16rem] font-mono text-sm overflow-auto relative">
                                {output || (
                                    <span className="text-gray-500 italic">
                                        {isTyping ? 'Processing...' : 'Output will appear here.'}
                                    </span>
                                )}
                                {isTyping && (
                                    <motion.span
                                        className="inline-block w-1 bg-teal-400 h-4 ml-1"
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                    />
                                )}
                            </div>

                            <div className="absolute top-10 right-4 flex space-x-2">
                                <motion.button
                                    onClick={handleCopy}
                                    disabled={!output}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-2 rounded-full ${output ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600'} text-white transition-colors`}
                                >
                                    {copyStatus === 'Copied!' ? <CheckCircle className="w-5 h-5" /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <motion.button
                            onClick={processText}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg transition duration-300"
                        >
                            {isEncrypting ? 'Encrypt' : 'Decrypt'} Text
                        </motion.button>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

// --- MAIN APPLICATION COMPONENT ---
const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [activeSection, setActiveSection] = useState(NAV_ITEMS[0]); // State to track the active section

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const scrollToSection = (id) => {
        // Smooth scroll implementation
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        // Closing the menu handled here for mobile UX
        setIsMenuOpen(false);
    };

    // Scroll logic to track active section for navigation highlighting
    useEffect(() => {
        const handleScroll = () => {
            let currentSectionId = NAV_ITEMS[0];
            // Offset for fixed header height (approx 90px)
            const offset = 90;

            for (const item of NAV_ITEMS) {
                const section = document.getElementById(item);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // Check if the section's top is visible above the offset line
                    // We use a small tolerance (+10) to ensure the first section activates correctly on load
                    if (rect.top <= offset + 10 && rect.bottom > offset) {
                        currentSectionId = item;
                        break;
                    }
                }
            }
            setActiveSection(currentSectionId);
        };

        // Delaying the listener setup slightly ensures all elements are mounted
        const timeout = setTimeout(() => {
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check on load
        }, 100);


        return () => {
            clearTimeout(timeout);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Header component updated to receive activeSection
    const Header = ({ activeSection }) => (
        <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm shadow-xl transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Updated Logo/Title */}
                <a href="#STATUS" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                    nulllynx
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6">
                    {NAV_ITEMS.map(item => (
                        <a
                            key={item}
                            href={`#${item}`}
                            onClick={() => scrollToSection(item)} // Added onClick for smooth scroll
                            className={`relative font-medium transition-colors duration-200 uppercase tracking-wider text-sm ${activeSection === item ? 'text-teal-400' : 'text-gray-300 hover:text-teal-400'}`}
                        >
                            {item.replace(/_/g, ' ')}
                            {/* Active highlight/underline using Framer Motion (layoutId creates smooth motion) */}
                            {activeSection === item && (
                                <motion.div
                                    className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-teal-400 rounded-full"
                                    layoutId="underline"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </a>
                    ))}
                    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-300 hover:text-teal-400 transition-colors">
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex items-center lg:hidden">
                    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-300 hover:text-teal-400 transition-colors mr-2">
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleMenu} className="text-gray-300 hover:text-teal-400">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-gray-900/95 shadow-lg border-t border-gray-700 p-4"
                    >
                        <ul className="space-y-3">
                            {NAV_ITEMS.map(item => (
                                <li key={item} className="relative">
                                    <a
                                        href={`#${item}`}
                                        onClick={() => scrollToSection(item)}
                                        className={`block px-3 py-2 text-lg rounded-lg transition-colors duration-200 uppercase tracking-wider ${activeSection === item ? 'text-teal-400 bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-teal-400'}`}
                                    >
                                        {item.replace(/_/g, ' ')}
                                    </a>
                                    {/* Optional: A subtle active bar for the mobile menu */}
                                    {activeSection === item && (
                                        <motion.div
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 rounded-l-lg"
                                            layoutId="mobile-active"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );

    const IconWrapper = ({ icon: Icon, color }) => (
        <Icon className="w-8 h-8" style={{ color: color }} />
    );

    const MailLink = ({ name, link, icon: Icon, color }) => (
        <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center p-3 rounded-lg bg-gray-900 hover:bg-teal-900 transition-all duration-200 border border-gray-700"
            title={name}
        >
            <Icon className="w-6 h-6 mr-3 flex-shrink-0" style={{ color: color }} />
            <span className="text-gray-300 text-sm font-medium truncate">{name}</span>
        </motion.a>
    );

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} font-sans antialiased scroll-smooth`}>
            <style>
                {`
                    html { scroll-behavior: smooth; }
                    .container { max-width: 1400px; } /* Ultra-wide support */
                `}
            </style>
            {/* activeSection prop is passed to the Header */}
            <Header activeSection={activeSection} />
            <main>
                <StatusSection />
                <ProfileSection />
                <AnalysisSection />
                <AccomplishSection />
                <DocumentsSection />
                <AccessLogSection />
                <EncryptDecryptSection />
            </main>
            {/* FOOTER: Contact Section Integration */}
            <footer className="bg-gray-950 border-t border-gray-800 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
                        {/* Left: Branding & Copyright */}
                        <div className="text-center md:text-left">
                            <a href="#STATUS" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-2 block">
                                nulllynx
                            </a>
                            <p className="text-gray-500 text-sm mt-2">&copy; {new Date().getFullYear()} Asanul Hoque Esan.</p>
                            <p className="text-gray-500 text-xs">Security Portfolio. Crafted with React & Framer Motion.</p>
                        </div>

                        {/* Right: Get In Touch / Contact Options (Updated) */}
                        <div className="w-full md:w-auto">
                            <h4 className="text-2xl font-semibold text-white mb-6 border-b-2 border-teal-500 inline-block pb-1 mx-auto md:mx-0">
                                Get In Touch
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-8 justify-center md:justify-end">
                                
                                {/* Left Side: 2 Email Links */}
                                <div className="space-y-4 w-full sm:w-56 flex-shrink-0">
                                    <h5 className="text-lg font-medium text-gray-300 border-b border-gray-700 pb-1">Direct Mail</h5>
                                    {emailLinks.map((item, index) => (
                                        <MailLink key={index} {...item} />
                                    ))}
                                </div>

                                {/* Right Side: 8 Social/Platform Links */}
                                <div className="w-full sm:w-auto">
                                    <h5 className="text-lg font-medium text-gray-300 border-b border-gray-700 pb-1 mb-4">Platforms & Socials ({otherLinks.length})</h5>
                                    <div className="grid grid-cols-4 gap-x-4 gap-y-6 justify-center">
                                        {otherLinks.map((item, index) => (
                                            <motion.a
                                                key={index}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.25 }} // Increased scale for prominence
                                                whileTap={{ scale: 0.9 }}
                                                className="text-gray-400 transition-transform duration-200 flex flex-col items-center group"
                                                title={item.name}
                                            >
                                                {/* Icon with inline style for color property */}
                                                <IconWrapper icon={item.icon} color={item.color} />
                                                {/* Name for accessibility/context on hover */}
                                                <span className="mt-1 text-xs text-gray-500 group-hover:text-teal-400 hidden sm:block">{item.name.split(' ')[0]}</span>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
