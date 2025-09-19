import QuizCard from '../components/QuizCard';
import { loadQuizzes } from '../lib/quiz';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const quizzes = await loadQuizzes();
  const cookieStore = cookies();
  const roleCookie = cookieStore.get('cc_role');
  const isLoggedIn = !!roleCookie?.value;
  if (roleCookie?.value === 'admin') {
    redirect('/admin');
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f4c025]/10 to-transparent opacity-50"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            CryptoCross: Gamified Web3 Education & Certification
          </h1>
          <p className="hero-subtitle">
            Master blockchain, NFTs, and DeFi through an engaging, gamified learning experience. Earn valuable certifications and step into the future of the internet.
          </p>
          <div className="hero-buttons">
            <Link href="/login" className="btn-primary">
              <span className="truncate">Start Learning</span>
            </Link>
            <Link href="/marketplace" className="btn-secondary">
              <span className="truncate">Explore Marketplace</span>
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-1 w-full h-20 bg-gradient-to-t from-[#0d0f1a] to-transparent"></div>
      </section>

      <section className="feature-section">
  <div className="mx-auto max-w-7xl">
    <div className="feature-grid">
      {[
        {
          title: "Quizzes",
          description: "Test your knowledge.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-SMfFvawyaXEs2RPFHaqwzhiuxfCkeAfFLtVru1-OCl9_nvSp-cxH63w_xBMtsap2-aCdTHzDMqRTdzBhDS2QmTsrsV6YwXrqS3Q3GC8dZhxYhdV948lcV-B5R4hjp9T7r0YHqwPPSGItAHgjCgebF9UVX7ZCRrdOM1LJjjQiEpw40fkNAiRJvLdZm4trp5bb2A1cWsQIYDM3Dg3Z9sEryRSb6pW4M-nCYK9KY8YU0-Lck4ub5IY-y_7-wp6f1b62HGpM7DbS5Q",
        },
        {
          title: "Flashcards",
          description: "Master key concepts.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvrA0KiKaaVTMjpvD4c-jZxlR2XusUV2R-lhTPu3yR9MMAiriYhBElrxTtOA96shdVDxtLyRs6jVyWd0WlHiI0wA6ufqwzQKpDMNuebE8cigyNCElq8DS9ayvaMKg7sifDSWbfJP2S-47hYjtkcseoTnNxICbhlX0ixisVrXrC20DJmWcefRIpgo4AqOeGWmd0EsIodc-9dHS1G2hqzRqcQpL8DVWBf0h5QKx4Kcceq84iei_Y-ZxWY_GJlW4saMR3ZxZjYgHGDQ",
        },
        {
          title: "Mystery Packs",
          description: "Unlock rare items.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6r5D3PilK2x11j8Bx_IRVji0yOyeQBNPg2XO_TjCQNs0y_mNPWRErGlfBKqWP6l0qR4TMHPeL7hPDBPkGzuQh6_tD268nNcAem3GVSHdE2uoB1wTxl8BWXnf81nqr8T31wPiTyU_vyuagH12zeMDPAGnBW5KiDngpSuGznhFyWBxbVdnmHh4xR6hOOQ9UHrLByJvt5Vtam-acnf3Y7ERYDOMrLGL0NJoCoyACqqkmVxuv6y8I_ti7aCiD9AWJHHMeJMrfpcbRsA",
        },
        {
          title: "Certificates",
          description: "Showcase your skills.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw53VjqxFaPNq8inte243HS-AZR9T5MTOoteqmYM_qZbrycnWlGepO4ejReO9aXHjRN1RM7IcQGA_p2pX3gbLW1HwsCPSm8BFHQaZ-mXR-p_lmaomYVsAZ-8QQIhgKQ06F8vKnBmDiFzEOKk3C_gWztzuqshNpLIYFNgPSPbonhoaya2-g05tix3jJBx46zElCFHmarzFgptyibt05Ss2DddP6WI7D_tKmPZ030C3WdkDTWCvucOWSDKMHfrcPdgfQRf_E4KOPwg",
        },
        {
          title: "Marketplace",
          description: "Trade your assets.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWaocZG0rtTYAcp-EoqRJrahVX49BbAGzJQ3nEbjd_-Ndbt5tp8c48N7g2ksx0YihPhvEOCeLjJMXd7h7kV4RwjR-n-KfZ15aEwKD2glY7al0k1zvjOMK0UJ6wc587_d-8rqpWV6nAknhAq2ojgh11rR636W7wv7cl_2-iYS3xkfcC-DHDShSSCHMRea69zcUlJtJrlEtqOkCL_B2xGsRKA9_N67veBlP1KwATBGGudT15RLidcnMrFWiRLDGYUfeeYsveULwt5w",
        },
        {
          title: "Leaderboard",
          description: "Track top performers.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuLeaderBoardExampleImageURL",
        },
      ].map((feature, index) => (
        <div key={index} className="feature-card group">
          <img src={feature.image} alt={feature.title} className="feature-image" />
          <div className="feature-overlay"></div>
          <div className="feature-content">
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">
            Join CryptoCross today and unlock a new world of Web3 learning. Gain valuable skills, earn certifications, and become part of a thriving community.
          </p>
          <div className="mt-10">
            <Link href="/login" className="btn-primary">
              <span className="truncate">Get Started Now</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
