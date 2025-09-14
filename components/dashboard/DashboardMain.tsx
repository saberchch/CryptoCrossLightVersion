'use client';

import React from 'react';

interface DashboardMainProps {
  userName?: string;
}

export default function DashboardMain({ userName = 'User' }: DashboardMainProps) {
  const featuredQuizzes = [
    {
      id: 1,
      title: 'Crypto Basics',
      description: 'Learn the basics of cryptocurrency',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_geB4tJlGREXJiSrobGY66K-pVsx_VPYlp4YkQZt0Blb59FIWgZ-YbpVNpRBhLCI1Quwl79D8gQXSHAcHhcXiCBoXsaCiPQioAxD-aDMWnVpAiWYf4QO-S2Y8cRvimQPmYr4EA2v6QjGW9HtCCZQ-bY-SeKsFFZlotb11gy7o-hAh-78NFJKRx6b2mnqwdPqDLqrjj4Ak0HDw-DlCfMhp5MncMhQzEbTQMSRvj8H0Owjs9eqsVL4oEd7XVhR6APEO7mfjpLUVRg'
    },
    {
      id: 2,
      title: 'Blockchain Fundamentals',
      description: 'Understand the core concepts of blockchain',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtey-1_mL6__RLDdzbNbrkihulbRpKM9dyPG4Z6EkNKR8-Cz_lADi2fZzlMyKjl_uMeJaoNb_nKfYTrI-DTaheDKXEunQ7uoWFfk3L0YY-OqCJ0gyjmyMt6JggO7NEx1e8_10A_TslXNKEBIe6FfGByXN1FPZzhQIvzuVEOjO_9o13vCPd9Nl2og2zlfeulxHeGP1i4FbY2josXC--6y-F8jEZdOKrQscGw_c7W_WKhGCYTnsm9rwp_C45M9r3sr_BEGGlrSMukw'
    },
    {
      id: 3,
      title: 'DeFi Deep Dive',
      description: 'Explore decentralized finance',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_rURVZd3JfBHRFN3TNBbayXhCKBjFI9RGeiG-_MRO-iVbJJpeUCxRbdKX86zXG2SYccfsF1vOiyVgmPxDCQjhRfPZZCffh59SytpbYiE5MCVS7NjIU0-m4JZWPnlgv7WBsuRq_5TNggl0GkNQQd08K4aouuB4JdtUIG9ITBG-riNaqnMk3Xg9pPHUsT72Aq6GJEEK9hevcL-nSjGwUB3pzWCMuFvR7GOckh67yjgVtgUZyvnOq03wdEyAkDWfcfalDBs1BPDp6A'
    }
  ];

  const progressItems = [
    { label: 'Crypto Basics', percentage: 75 },
    { label: 'Blockchain Fundamentals', percentage: 50 },
    { label: 'DeFi Deep Dive', percentage: 25 }
  ];

  const activities = [
    {
      id: 1,
      title: 'Completed Quiz: Crypto Basics',
      date: '2 days ago',
      icon: 'M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'
    },
    {
      id: 2,
      title: 'Started Quiz: Blockchain Fundamentals',
      date: '5 days ago',
      icon: 'M232.4,114.49,139.28,20.66a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z'
    },
    {
      id: 3,
      title: 'Received Certificate: Crypto Basics',
      date: '1 week ago',
      icon: 'M248,128a56,56,0,1,0-96,39.14V224a8,8,0,0,0,11.58,7.16L192,216.94l28.42,14.22A8,8,0,0,0,232,224V167.14A55.81,55.81,0,0,0,248,128ZM192,88a40,40,0,1,1-40,40A40,40,0,0,1,192,88Zm3.58,112.84a8,8,0,0,0-7.16,0L168,211.06V178.59a55.94,55.94,0,0,0,48,0v32.47ZM136,192a8,8,0,0,1-8,8H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216a16,16,0,0,1,16,16,8,8,0,0,1-16,0H40V184h88A8,8,0,0,1,136,192Zm-16-56a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h40A8,8,0,0,1,120,136Zm0-32a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h40A8,8,0,0,1,120,104Z'
    }
  ];

  return (
    <main className="dashboard-content">
      <div className="dashboard-content-section">
        <h1 className="dashboard-title">Welcome back, {userName}</h1>
        
        <div>
          <h2 className="section-title">Featured Quizzes</h2>
          <div className="quiz-grid">
            {featuredQuizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card group">
                <div 
                  className="quiz-image" 
                  style={{ backgroundImage: `url("${quiz.image}")` }}
                ></div>
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Your Progress</h2>
          <div className="progress-section">
            {progressItems.map((item, index) => (
              <div key={index}>
                <div className="progress-item">
                  <p className="progress-label">{item.label}</p>
                  <p className="progress-percentage">{item.percentage}%</p>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-timeline">
            <div className="activity-line"></div>
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-container">
                  <div className="activity-icon">
                    <svg fill="currentColor" height="16px" viewBox="0 0 256 256" width="16px" xmlns="http://www.w3.org/2000/svg">
                      <path d={activity.icon}></path>
                    </svg>
                  </div>
                </div>
                <p className="activity-title">{activity.title}</p>
                <p className="activity-date">{activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
